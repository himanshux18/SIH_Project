import pandas as pd
import os
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "data" / "projects.csv"

def load_projects() -> pd.DataFrame:
    """Load projects from CSV. Always returns a fresh copy with project_name populated."""
    if not DATA_PATH.exists():
        # Fallback to root dataset if backend/data isn't created yet
        root_data = Path(__file__).parent.parent.parent / "synthetic_paimana_projects.csv"
        if root_data.exists():
            df = pd.read_csv(root_data)
        else:
            raise FileNotFoundError(f"Data file not found: {DATA_PATH}")
    else:
        df = pd.read_csv(DATA_PATH)
        
    if 'project_name' not in df.columns:
        df['project_name'] = df.apply(
            lambda r: f"{r['implementing_agency']} {r['sector']} Phase {r['project_id'].replace('PRJ', '')}",
            axis=1
        )
        
    pct_cols = ['cost_overrun_pct', 'elapsed_time_pct', 'fund_utilization_pct', 'physical_progress_pct']
    for col in pct_cols:
        if col in df.columns and df[col].dropna().max() <= 2.0:
            df[col] = (df[col] * 100.0).round(2)
            
    return df

def save_projects(df: pd.DataFrame):
    """Persist the dataframe back to CSV."""
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATA_PATH, index=False)

def append_projects(new_rows: pd.DataFrame):
    """Append new rows and save."""
    existing = load_projects()
    combined = pd.concat([existing, new_rows], ignore_index=True)
    save_projects(combined)
