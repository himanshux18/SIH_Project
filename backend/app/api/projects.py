from fastapi import APIRouter, Query, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
from app.database import load_projects
from app.ml.predict import predict_project, models_exist
from app.models.project_enhancer import enhance_project

router = APIRouter(prefix="/api/projects", tags=["projects"])

class SimulationRequest(BaseModel):
    project_id: Optional[str] = None
    sector: str = "Roads & Highways"
    implementing_agency: str = "NHAI"
    sanctioned_cost_cr: float = 500.0
    sanctioned_duration_months: int = 36
    elapsed_time_pct: float = 60.0
    fund_utilization_pct: float = 65.0
    physical_progress_pct: float = 45.0

@router.get("/stats")
def get_stats(sector: Optional[str] = None):
    df = load_projects()
    if sector and sector != 'All':
        df = df[df['sector'] == sector]
    
    # Calculate overdue reporting count (Task 10)
    overdue_count = 0
    for _, row in df.iterrows():
        p_enh = enhance_project(row.to_dict())
        if p_enh.get('is_reporting_overdue'):
            overdue_count += 1

    return {
        "total_projects": len(df),
        "avg_cost_overrun_pct": round(float(df['cost_overrun_pct'].mean()), 2),
        "high_risk_count": int((df['risk_label'] == 'High').sum()),
        "medium_risk_count": int((df['risk_label'] == 'Medium').sum()),
        "low_risk_count": int((df['risk_label'] == 'Low').sum()),
        "overdue_reporting_count": overdue_count,
        "sectors": sorted(load_projects()['sector'].unique().tolist()),
    }

@router.get("/leaderboard")
def get_agency_leaderboard():
    """Ranks implementing agencies by average cost overrun and delay (Task 9)."""
    df = load_projects()
    leaderboard = []
    
    for agency, group in df.groupby('implementing_agency'):
        avg_overrun = round(float(group['cost_overrun_pct'].mean()), 1)
        avg_delay = round(float(group['delay_months'].mean()), 1)
        total_p = len(group)
        high_r = int((group['risk_label'] == 'High').sum())
        med_r = int((group['risk_label'] == 'Medium').sum())
        low_r = int((group['risk_label'] == 'Low').sum())
        
        # Calculate accountability grade
        if avg_overrun < 18.0 and avg_delay < 6.5:
            grade = "A (Low Overrun)"
            grade_color = "green"
        elif avg_overrun < 22.0:
            grade = "B (Moderate)"
            grade_color = "blue"
        elif avg_overrun < 26.0:
            grade = "C (Elevated Risk)"
            grade_color = "amber"
        else:
            grade = "D (Critical Overruns)"
            grade_color = "red"
            
        leaderboard.append({
            "agency": agency,
            "project_count": total_p,
            "avg_cost_overrun_pct": avg_overrun,
            "avg_delay_months": avg_delay,
            "high_risk_count": high_r,
            "medium_risk_count": med_r,
            "low_risk_count": low_r,
            "grade": grade,
            "grade_color": grade_color
        })
        
    # Rank by lowest overrun first
    leaderboard.sort(key=lambda x: (x['avg_cost_overrun_pct'], x['avg_delay_months']))
    for idx, item in enumerate(leaderboard, 1):
        item['rank'] = idx
        
    return leaderboard

@router.post("/simulate")
def simulate_project_risk(sim: SimulationRequest):
    """Real-time what-if risk simulation engine (Task 8)."""
    row_dict = sim.dict()
    row_dict['progress_lag_pct'] = round(sim.elapsed_time_pct - sim.physical_progress_pct, 1)
    
    if models_exist():
        preds = predict_project(row_dict)
        predicted_risk = preds['predicted_risk']
        predicted_overrun = preds['predicted_overrun_pct']
        predicted_delay = preds['predicted_delay_months']
        importances = preds.get('feature_importances', {})
    else:
        lag = sim.elapsed_time_pct - sim.physical_progress_pct
        if lag > 20:
            predicted_risk = 'High'
            predicted_overrun = round(lag * 1.1 + 10.0, 1)
            predicted_delay = round(lag * 0.45, 1)
        elif lag > 10:
            predicted_risk = 'Medium'
            predicted_overrun = round(lag * 0.7 + 6.0, 1)
            predicted_delay = round(lag * 0.3, 1)
        else:
            predicted_risk = 'Low'
            predicted_overrun = 4.5
            predicted_delay = 1.0
        importances = {
            'Progress Lag': 0.42,
            'Fund-Progress Gap': 0.28,
            'Project Size': 0.18,
            'Sector Risk History': 0.12
        }

    return {
        "inputs": row_dict,
        "predicted_risk": predicted_risk,
        "predicted_overrun_pct": predicted_overrun,
        "predicted_delay_months": predicted_delay,
        "progress_lag_pct": row_dict['progress_lag_pct'],
        "feature_importances": importances
    }

@router.get("/")
def list_projects(
    sector: Optional[str] = None,
    agency: Optional[str] = None,
    risk_label: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = 'project_id',
    sort_dir: Optional[str] = 'asc',
    page: int = 1,
    page_size: int = 20,
):
    df = load_projects()
    if sector and sector != 'All':
        df = df[df['sector'] == sector]
    if agency and agency != 'All':
        df = df[df['implementing_agency'] == agency]
    if risk_label and risk_label != 'All':
        df = df[df['risk_label'] == risk_label]
    if search:
        mask = (
            df['project_name'].str.contains(search, case=False, na=False) |
            df['project_id'].str.contains(search, case=False, na=False) |
            df['implementing_agency'].str.contains(search, case=False, na=False)
        )
        df = df[mask]
    
    valid_sort = ['project_id', 'project_name', 'sector', 'sanctioned_cost_cr', 'cost_overrun_pct', 'risk_label']
    if sort_by in valid_sort:
        df = df.sort_values(sort_by, ascending=(sort_dir == 'asc'))
    
    total = len(df)
    start = (page - 1) * page_size
    page_df = df.iloc[start:start + page_size]
    
    # Enrich rows with reporting compliance flags
    enriched_records = []
    for r in page_df.to_dict(orient='records'):
        p_enh = enhance_project(r)
        r['last_updated_date'] = p_enh.get('last_updated_date')
        r['is_reporting_overdue'] = p_enh.get('is_reporting_overdue')
        r['progress_lag_pct'] = round(r['elapsed_time_pct'] - r['physical_progress_pct'], 1)
        enriched_records.append(r)
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "projects": enriched_records,
        "agencies": sorted(load_projects()['implementing_agency'].unique().tolist()),
    }

@router.get("/top-risk")
def get_top_risk(sector: Optional[str] = None, limit: int = 10):
    df = load_projects()
    if sector and sector != 'All':
        df = df[df['sector'] == sector]
    risk_order = {'High': 0, 'Medium': 1, 'Low': 2}
    df['_risk_order'] = df['risk_label'].map(risk_order)
    df = df.sort_values(['_risk_order', 'cost_overrun_pct'], ascending=[True, False])
    records = df.head(limit).drop(columns=['_risk_order']).to_dict(orient='records')
    
    # Enrich with reporting flag
    for r in records:
        p_enh = enhance_project(r)
        r['is_reporting_overdue'] = p_enh.get('is_reporting_overdue')
        r['last_updated_date'] = p_enh.get('last_updated_date')
        r['progress_lag_pct'] = round(r['elapsed_time_pct'] - r['physical_progress_pct'], 1)
        
    return records

@router.get("/{project_id}")
def get_project_detail(project_id: str):
    df = load_projects()
    row = df[df['project_id'].str.upper() == project_id.upper()]
    if row.empty:
        raise HTTPException(status_code=404, detail="Project not found")
    project = row.iloc[0].to_dict()
    
    if models_exist():
        preds = predict_project(project)
        project.update(preds)
    else:
        project.update({
            'predicted_risk': project.get('risk_label', 'Unknown'),
            'predicted_overrun_pct': project.get('cost_overrun_pct', 0),
            'predicted_delay_months': project.get('delay_months', 0),
            'feature_importances': {
                'Progress Lag': 0.39,
                'Sector Risk History': 0.23,
                'Project Size': 0.17,
                'Fund-Progress Gap': 0.08,
                'Physical Progress': 0.08,
                'Time Pressure': 0.05,
            }
        })
        
    # Enrich with Revised Allocation, Monthly Snapshots, Smart Timeline, Compliance
    project = enhance_project(project)
    return project
