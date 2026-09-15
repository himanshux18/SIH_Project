from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import io
from datetime import date
from app.database import append_projects, load_projects
from app.ml.predict import predict_project, models_exist

router = APIRouter(prefix="/api/upload", tags=["upload"])

class ManualProject(BaseModel):
    project_name: str
    sector: str
    implementing_agency: str
    sanctioned_cost_cr: float
    sanctioned_duration_months: int
    start_date: str
    elapsed_time_pct: float
    fund_utilization_pct: float
    physical_progress_pct: float

class CommitRequest(BaseModel):
    projects: List[Dict[str, Any]]

def process_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, Dict[str, Any]]:
    # Standardize column names (lowercase & stripped)
    df.columns = [c.strip().lower() for c in df.columns]
    
    # Map common alternative column names
    rename_map = {
        'cost': 'sanctioned_cost_cr',
        'cost_cr': 'sanctioned_cost_cr',
        'sanctioned_cost': 'sanctioned_cost_cr',
        'duration': 'sanctioned_duration_months',
        'duration_months': 'sanctioned_duration_months',
        'agency': 'implementing_agency',
        'elapsed_time': 'elapsed_time_pct',
        'fund_utilization': 'fund_utilization_pct',
        'physical_progress': 'physical_progress_pct',
        'overrun_pct': 'cost_overrun_pct',
        'delay': 'delay_months'
    }
    df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})

    # Validate essential columns
    required = ['sector', 'implementing_agency', 'sanctioned_cost_cr',
                'sanctioned_duration_months', 'elapsed_time_pct', 'fund_utilization_pct',
                'physical_progress_pct']
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"CSV missing required columns: {', '.join(missing)}")
    
    # Generate project_name if absent
    if 'project_name' not in df.columns:
        df['project_name'] = df.apply(
            lambda r: f"{r['implementing_agency']} {r['sector']} Phase {int(r.name) + 1}",
            axis=1
        )

    # Standardize percentages if given as ratios (e.g. 0.45 -> 45.0)
    pct_cols = ['elapsed_time_pct', 'fund_utilization_pct', 'physical_progress_pct']
    for c in pct_cols:
        df[c] = pd.to_numeric(df[c], errors='coerce').fillna(0.0)
        if df[c].max() <= 2.0:
            df[c] = (df[c] * 100.0).round(2)

    df['sanctioned_cost_cr'] = pd.to_numeric(df['sanctioned_cost_cr'], errors='coerce').fillna(100.0)
    df['sanctioned_duration_months'] = pd.to_numeric(df['sanctioned_duration_months'], errors='coerce').fillna(24).astype(int)

    # Compute progress_lag_pct
    df['progress_lag_pct'] = (df['elapsed_time_pct'] - df['physical_progress_pct']).round(2)

    if 'start_date' not in df.columns:
        df['start_date'] = str(date.today())

    # Generate sequential IDs
    existing = load_projects()
    max_id = len(existing)
    df['project_id'] = [f"PRJ{max_id + i + 1:04d}" for i in range(len(df))]

    # Run predictions or rule evaluations
    results = []
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        if models_exist():
            preds = predict_project(row_dict)
            row_dict['risk_label'] = preds.get('predicted_risk', 'Medium')
            row_dict['cost_overrun_pct'] = preds.get('predicted_overrun_pct', 0.0)
            row_dict['delay_months'] = preds.get('predicted_delay_months', 0.0)
        else:
            # Rule-based fallback
            lag = row_dict['progress_lag_pct']
            if lag > 20:
                row_dict['risk_label'] = 'High'
                row_dict['cost_overrun_pct'] = round(lag * 0.9, 1)
                row_dict['delay_months'] = round(lag * 0.4, 1)
            elif lag > 10:
                row_dict['risk_label'] = 'Medium'
                row_dict['cost_overrun_pct'] = round(lag * 0.6, 1)
                row_dict['delay_months'] = round(lag * 0.25, 1)
            else:
                row_dict['risk_label'] = 'Low'
                row_dict['cost_overrun_pct'] = 3.0
                row_dict['delay_months'] = 1.0
        results.append(row_dict)

    processed_df = pd.DataFrame(results)

    # Compute summary stats
    risk_counts = {
        'High': int((processed_df['risk_label'] == 'High').sum()),
        'Medium': int((processed_df['risk_label'] == 'Medium').sum()),
        'Low': int((processed_df['risk_label'] == 'Low').sum()),
    }
    avg_overrun = float(processed_df['cost_overrun_pct'].mean())

    risk_order = {'High': 0, 'Medium': 1, 'Low': 2}
    processed_df['_order'] = processed_df['risk_label'].map(risk_order)
    top_risky = processed_df.sort_values(['_order', 'progress_lag_pct'], ascending=[True, False]).head(5)
    top_risky_records = top_risky.drop(columns=['_order']).to_dict(orient='records')

    summary = {
        'total_rows': len(processed_df),
        'risk_counts': risk_counts,
        'avg_overrun_pct': round(avg_overrun, 2),
        'top_risky_projects': top_risky_records,
        'projects': processed_df.drop(columns=['_order']).to_dict(orient='records')
    }
    return processed_df, summary

@router.post("/preview")
async def preview_csv(file: UploadFile = File(...)):
    """Parses, validates, computes lag & risk scores, and returns analysis preview."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV file: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="The uploaded CSV file is empty.")

    _, summary = process_dataframe(df)
    return summary

@router.post("/commit")
def commit_projects(req: CommitRequest):
    """Merges staged projects into the active dataset."""
    if not req.projects:
        raise HTTPException(status_code=400, detail="No projects provided to add.")

    new_df = pd.DataFrame(req.projects)
    existing = load_projects()

    # Re-assign sequential project IDs based on current dataset size to avoid collisions
    max_id = len(existing)
    new_df['project_id'] = [f"PRJ{max_id + i + 1:04d}" for i in range(len(new_df))]

    # Ensure all required existing columns are present
    for col in existing.columns:
        if col not in new_df.columns:
            new_df[col] = None

    append_projects(new_df[existing.columns.tolist()])
    updated_total = len(load_projects())

    return {
        'message': f"Successfully merged {len(new_df)} projects into dashboard.",
        'projects_added': len(new_df),
        'total_projects_now': updated_total
    }

@router.post("/csv")
async def upload_csv_legacy(file: UploadFile = File(...)):
    """Direct upload and merge for backward compatibility."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files accepted")
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    processed_df, summary = process_dataframe(df)
    existing = load_projects()
    append_projects(processed_df[existing.columns.tolist()])
    return {
        'message': f"Successfully uploaded {len(processed_df)} projects",
        'projects_added': len(processed_df),
        'preview': summary['top_risky_projects']
    }

@router.post("/project")
def add_manual_project(project: ManualProject):
    existing = load_projects()
    new_id = f"PRJ{len(existing) + 1:04d}"
    
    row = project.dict()
    row['project_id'] = new_id
    row['progress_lag_pct'] = round(row['elapsed_time_pct'] - row['physical_progress_pct'], 2)
    
    prediction = {}
    if models_exist():
        prediction = predict_project(row)
        row['risk_label'] = prediction['predicted_risk']
        row['cost_overrun_pct'] = prediction['predicted_overrun_pct']
        row['delay_months'] = prediction['predicted_delay_months']
    else:
        row['risk_label'] = 'Medium'
        row['cost_overrun_pct'] = 15.0
        row['delay_months'] = 4.0
    
    new_df = pd.DataFrame([row])
    for col in existing.columns:
        if col not in new_df.columns:
            new_df[col] = None
    append_projects(new_df[existing.columns.tolist()])
    
    return {
        'message': 'Project added successfully',
        'project_id': new_id,
        'prediction': prediction,
    }
