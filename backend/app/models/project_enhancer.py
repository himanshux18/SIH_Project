import random
import hashlib
from datetime import datetime, timedelta

REVISION_REASONS = [
    "Scope expansion & interchange flyovers added",
    "Statutory land acquisition compensation escalation",
    "Material index inflation (cement & structural steel)",
    "Geological realignment in tunneling stretch",
    "Safety standard upgrade to express corridor specs",
    "Utility shifting & forest clearance mitigation",
    "Contractual variation order for bridge foundations"
]

def get_project_seed(project_id: str) -> int:
    """Returns a deterministic seed integer from project_id."""
    return int(hashlib.md5(project_id.encode()).hexdigest()[:8], 16)

def enhance_project(project: dict) -> dict:
    """
    Enriches a project record with:
    - original_sanctioned_cost
    - revisions: list of {date, revised_cost, reason}
    - monthly_snapshots: list of {month, revised_cost, physical_progress_pct, fund_utilization_pct}
    - timeline: {start_date, planned_completion_date, today_date, predicted_completion_date, delay_gap_months}
    - last_updated_date and is_reporting_overdue
    """
    pid = project.get('project_id', 'PRJ0001')
    rnd = random.Random(get_project_seed(pid))
    
    current_cost = float(project.get('sanctioned_cost_cr', 100.0))
    duration_months = int(project.get('sanctioned_duration_months', 24))
    start_date_str = str(project.get('start_date', '2021-01-01'))
    try:
        start_dt = datetime.strptime(start_date_str[:10], '%Y-%m-%d')
    except Exception:
        start_dt = datetime(2021, 1, 1)

    # 1. Revised Allocation (Task 2)
    # 0 to 3 revisions. If risk is High, more likely 2-3 revisions with higher escalation
    risk_label = project.get('risk_label', 'Medium')
    num_revisions = rnd.choice([1, 2, 3]) if risk_label == 'High' else (rnd.choice([0, 1, 2]) if risk_label == 'Medium' else rnd.choice([0, 1]))
    
    # Calculate original cost before revisions
    total_escalation_pct = rnd.uniform(0.10, 0.38) if (num_revisions > 0 and risk_label == 'High') else (rnd.uniform(0.05, 0.20) if num_revisions > 0 else 0.0)
    original_cost = round(current_cost / (1.0 + total_escalation_pct), 2)
    
    revisions = [
        {
            "date": start_dt.strftime('%Y-%m-%d'),
            "revised_cost": original_cost,
            "reason": "Original Sanctioned Budget"
        }
    ]
    
    running_cost = original_cost
    if num_revisions > 0:
        cost_step = (current_cost - original_cost) / num_revisions
        for i in range(1, num_revisions + 1):
            rev_days = int((duration_months * 30.5 * 0.3) + (i * 120))
            rev_date = (start_dt + timedelta(days=rev_days)).strftime('%Y-%m-%d')
            running_cost = round(original_cost + (cost_step * i), 2)
            revisions.append({
                "date": rev_date,
                "revised_cost": running_cost,
                "reason": rnd.choice(REVISION_REASONS)
            })
    
    # Final latest revision matches current sanctioned cost
    latest_revised_cost = current_cost
    escalation_pct = round(((latest_revised_cost - original_cost) / original_cost) * 100, 1) if original_cost > 0 else 0.0

    # 2. Monthly Snapshots (Task 3)
    # Simulate 8-12 monthly snapshots of history up to current state
    snapshot_count = rnd.randint(8, 12)
    snapshots = []
    
    curr_prog = float(project.get('physical_progress_pct', 50.0))
    curr_fund = float(project.get('fund_utilization_pct', 55.0))
    
    # Progress starts lower and reaches current level
    start_prog = max(2.0, curr_prog - rnd.uniform(25.0, 45.0))
    start_fund = max(5.0, curr_fund - rnd.uniform(25.0, 45.0))
    
    base_ref_date = datetime(2024, 6, 1)
    for idx in range(snapshot_count):
        month_dt = base_ref_date - timedelta(days=int((snapshot_count - 1 - idx) * 30.4))
        frac = idx / (snapshot_count - 1)
        
        snap_prog = round(start_prog + frac * (curr_prog - start_prog), 1)
        snap_fund = round(start_fund + frac * (curr_fund - start_fund) + rnd.uniform(-2.0, 2.0), 1)
        
        # Intermediate cost based on revision schedule
        snap_cost = original_cost if idx < snapshot_count // 2 else latest_revised_cost
        
        snapshots.append({
            "month": month_dt.strftime('%b %Y'),
            "revised_cost": snap_cost,
            "physical_progress_pct": snap_prog,
            "fund_utilization_pct": snap_fund
        })

    # 3. Smart Timeline / Gantt Data (Task 4)
    planned_days = int(duration_months * 30.41)
    planned_completion_dt = start_dt + timedelta(days=planned_days)
    
    elapsed_pct = float(project.get('elapsed_time_pct', 60.0))
    today_days = int(planned_days * (elapsed_pct / 100.0))
    today_dt = start_dt + timedelta(days=today_days)
    
    predicted_delay = float(project.get('predicted_delay_months', project.get('delay_months', 0.0)))
    predicted_completion_dt = planned_completion_dt + timedelta(days=int(predicted_delay * 30.41))
    
    timeline = {
        "start_date": start_dt.strftime('%Y-%m-%d'),
        "planned_completion_date": planned_completion_dt.strftime('%Y-%m-%d'),
        "today_date": today_dt.strftime('%Y-%m-%d'),
        "predicted_completion_date": predicted_completion_dt.strftime('%Y-%m-%d'),
        "delay_gap_months": round(predicted_delay, 1),
        "is_delayed": predicted_delay > 1.0
    }

    # 4. Data Quality / Reporting Compliance (Task 10)
    # Roughly 15% of projects have overdue reporting (> 60 days)
    days_since_update = rnd.choice([15, 25, 35, 45, 75, 95, 120]) if rnd.random() < 0.22 else rnd.randint(5, 45)
    last_updated_dt = base_ref_date - timedelta(days=days_since_update)
    is_overdue = days_since_update > 60

    enriched = dict(project)
    enriched.update({
        "original_sanctioned_cost": original_cost,
        "latest_revised_cost": latest_revised_cost,
        "escalation_pct": escalation_pct,
        "revisions": revisions,
        "monthly_snapshots": snapshots,
        "timeline": timeline,
        "last_updated_date": last_updated_dt.strftime('%Y-%m-%d'),
        "is_reporting_overdue": is_overdue,
        "days_since_reporting": days_since_update
    })
    return enriched
