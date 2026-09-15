from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class Project(BaseModel):
    project_id: str
    project_name: str
    sector: str
    implementing_agency: str
    sanctioned_cost_cr: float
    sanctioned_duration_months: int
    start_date: str
    elapsed_time_pct: float
    fund_utilization_pct: float
    physical_progress_pct: float
    cost_overrun_pct: float
    delay_months: float
    risk_label: str

class ProjectDetail(Project):
    predicted_overrun_pct: float
    predicted_delay_months: float
    predicted_risk: str
    feature_importances: dict  # {feature_name: importance_value}

class ProjectStats(BaseModel):
    total_projects: int
    avg_cost_overrun_pct: float
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int

class Alert(BaseModel):
    project_id: str
    project_name: str
    sector: str
    risk_label: str
    alert_message: str
    alert_date: str
    severity: str  # HIGH, MEDIUM

class ComparisonMetrics(BaseModel):
    model_name: str
    mae: float
    accuracy: Optional[float] = None
    color: str  # for frontend

class ComparisonResult(BaseModel):
    metrics: List[ComparisonMetrics]
    improvement_over_baseline_pct: float
    best_baseline_mae: float
    ai_mae: float
    ai_model_type: str

class ManualProjectInput(BaseModel):
    project_name: str
    sector: str
    implementing_agency: str
    sanctioned_cost_cr: float
    sanctioned_duration_months: int
    start_date: str
    elapsed_time_pct: float
    fund_utilization_pct: float
    physical_progress_pct: float
