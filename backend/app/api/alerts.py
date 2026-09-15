from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
from datetime import datetime, timedelta
import random
from app.database import load_projects

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

class RuleModel(BaseModel):
    id: str
    name: str
    metric: str
    operator: str
    threshold: float
    severity: str
    enabled: bool
    description: str

class UpdateRuleModel(BaseModel):
    threshold: Optional[float] = None
    enabled: Optional[bool] = None
    severity: Optional[str] = None

# Default Early-Warning Rules
DEFAULT_RULES: List[Dict[str, Any]] = [
    {
        "id": "R1",
        "name": "Severe Physical Progress Lag",
        "metric": "progress_lag_pct",
        "operator": ">",
        "threshold": 20.0,
        "severity": "HIGH",
        "enabled": True,
        "description": "Flags projects where elapsed time outpaces physical progress by more than 20%."
    },
    {
        "id": "R2",
        "name": "Critical Budget Overrun Escalation",
        "metric": "cost_overrun_pct",
        "operator": ">",
        "threshold": 25.0,
        "severity": "HIGH",
        "enabled": True,
        "description": "Flags projects with cumulative cost overrun exceeding 25% of sanctioned budget."
    },
    {
        "id": "R3",
        "name": "Expenditure Ahead of Physical Assets",
        "metric": "fund_progress_gap",
        "operator": ">",
        "threshold": 15.0,
        "severity": "MEDIUM",
        "enabled": True,
        "description": "Flags projects where funds spent exceed physical construction progress by over 15%."
    },
    {
        "id": "R4",
        "name": "Extended Timeline Slippage",
        "metric": "delay_months",
        "operator": ">",
        "threshold": 8.0,
        "severity": "MEDIUM",
        "enabled": True,
        "description": "Flags projects with schedule delays exceeding 8 months beyond planned milestones."
    }
]

# In-memory mutable rules store (persists for server lifecycle)
_active_rules = [dict(r) for r in DEFAULT_RULES]

@router.get("/rules")
def get_rules():
    """Returns the list of configurable early-warning rules (Task 5)."""
    return {"rules": _active_rules}

@router.put("/rules/{rule_id}")
def update_rule(rule_id: str, update: UpdateRuleModel):
    """Allows editing threshold and toggling active/inactive status."""
    for r in _active_rules:
        if r['id'].upper() == rule_id.upper():
            if update.threshold is not None:
                r['threshold'] = float(update.threshold)
            if update.enabled is not None:
                r['enabled'] = bool(update.enabled)
            if update.severity is not None:
                r['severity'] = update.severity
            return {"message": f"Rule {rule_id} updated successfully", "rule": r}
    raise HTTPException(status_code=404, detail="Rule not found")

@router.post("/rules")
def create_rule(rule: RuleModel):
    """Creates a new early-warning rule."""
    if any(r['id'] == rule.id for r in _active_rules):
        raise HTTPException(status_code=400, detail="Rule ID already exists")
    new_r = rule.dict()
    _active_rules.append(new_r)
    return {"message": "Rule created successfully", "rule": new_r}

@router.delete("/rules/{rule_id}")
def delete_rule(rule_id: str):
    """Deletes an early-warning rule."""
    global _active_rules
    _active_rules = [r for r in _active_rules if r['id'].upper() != rule_id.upper()]
    return {"message": f"Rule {rule_id} deleted"}

@router.get("/")
def get_alerts(sector: Optional[str] = None, severity: Optional[str] = None):
    """
    Dynamically evaluates all projects against active early-warning rules.
    """
    df = load_projects()
    if sector and sector != 'All':
        df = df[df['sector'] == sector]

    # Precalculate metric columns
    df['progress_lag_pct'] = (df['elapsed_time_pct'] - df['physical_progress_pct']).round(1)
    df['fund_progress_gap'] = (df['fund_utilization_pct'] - df['physical_progress_pct']).round(1)

    enabled_rules = [r for r in _active_rules if r.get('enabled', True)]
    alerts = []
    seen_project_ids = set()

    base_date = datetime(2024, 6, 1)

    for rule in enabled_rules:
        metric = rule['metric']
        threshold = rule['threshold']
        rule_sev = rule['severity']
        rule_name = rule['name']

        if metric not in df.columns:
            continue

        # Filter violating projects
        violating = df[df[metric] > threshold]

        for _, row in violating.iterrows():
            pid = row['project_id']
            # Avoid duplicate alert entries for the same project
            if pid in seen_project_ids:
                continue
            seen_project_ids.add(pid)

            days_ago = (hash(pid) % 60) + 1
            alert_date = (base_date - timedelta(days=days_ago)).strftime('%Y-%m-%d')
            metric_val = row[metric]

            alerts.append({
                'project_id': pid,
                'project_name': row['project_name'],
                'sector': row['sector'],
                'implementing_agency': row['implementing_agency'],
                'risk_label': row['risk_label'],
                'severity': rule_sev,
                'rule_name': rule_name,
                'metric': metric,
                'threshold': threshold,
                'actual_value': float(metric_val),
                'alert_date': alert_date,
                'cost_overrun_pct': float(row['cost_overrun_pct']),
                'alert_message': f"Violated rule '{rule_name}': {metric.replace('_', ' ').title()} reached {metric_val:.1f}% (threshold: {threshold:.1f}%)."
            })

    if severity and severity != 'All':
        alerts = [a for a in alerts if a['severity'].upper() == severity.upper()]

    alerts.sort(key=lambda x: (0 if x['severity'] == 'HIGH' else 1, x['alert_date']), reverse=False)
    alerts.sort(key=lambda x: x['alert_date'], reverse=True)

    return {
        'alerts': alerts,
        'total': len(alerts),
        'active_rules_count': len(enabled_rules)
    }
