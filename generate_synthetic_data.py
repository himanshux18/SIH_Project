"""
Synthetic Infrastructure Project Dataset Generator — for SIH26103
(AI-powered cost/schedule overrun prediction, modeled loosely on PAIMANA)

Calibration anchors (cite these in your pitch):
- Avg cost overrun on delayed infra projects: ~20-30% (commonly reported by CAG/PIB)
- Delayed projects often see time overruns of 50%+ of original schedule
- Larger, multi-agency, and certain sectors (e.g. Railways, Power) skew toward higher overruns

Run: pip install numpy pandas --break-system-packages
     python3 generate_synthetic_data.py
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path

np.random.seed(42)
N = 800  # number of synthetic projects

sectors = ["Roads & Highways", "Railways", "Power", "Urban Infrastructure", "Irrigation"]
sector_overrun_bias = {  # baseline overrun tendency per sector (calibrated loosely to public reporting)
    "Roads & Highways": 0.08,
    "Railways": 0.18,
    "Power": 0.15,
    "Urban Infrastructure": 0.10,
    "Irrigation": 0.16,
}
agencies = ["NHAI", "Indian Railways", "NTPC", "Municipal Corporation", "State PWD", "CPWD"]

rows = []
for i in range(N):
    sector = np.random.choice(sectors)
    agency = np.random.choice(agencies)

    # Project size: log-normal (most projects mid-size, some huge outliers)
    sanctioned_cost_cr = round(np.random.lognormal(mean=4.0, sigma=1.1), 2)  # in ₹ crore
    sanctioned_duration_months = int(np.random.choice([12, 18, 24, 36, 48, 60], p=[0.15,0.2,0.25,0.2,0.1,0.1]))

    start_date = datetime(2019, 1, 1) + timedelta(days=int(np.random.uniform(0, 1800)))

    # Elapsed time & progress simulation (as if "today" is some point during/after execution)
    elapsed_pct = np.random.uniform(0.3, 1.4)  # can exceed 1.0 if project overran its own schedule
    fund_utilization_pct = np.clip(elapsed_pct * np.random.uniform(0.6, 1.0), 0, 1.3)
    physical_progress_pct = np.clip(fund_utilization_pct * np.random.uniform(0.7, 1.05), 0, 1.2)

    # --- Rule-based risk construction (this is what makes it "learnable") ---
    size_factor = min(sanctioned_cost_cr / 500, 1.5)  # bigger projects -> more risk
    lag_factor = max(elapsed_pct - physical_progress_pct, 0)  # progress lagging behind time elapsed
    base_overrun = sector_overrun_bias[sector]

    cost_overrun_pct = base_overrun + 0.10 * size_factor + 0.25 * lag_factor + np.random.normal(0, 0.05)
    cost_overrun_pct = round(max(cost_overrun_pct, -0.05), 3)  # allow rare underruns

    delay_months = (base_overrun * sanctioned_duration_months * 0.7) + (lag_factor * sanctioned_duration_months * 0.8) \
                   + np.random.normal(0, 1.5)
    delay_months = round(max(delay_months, 0), 1)

    # Risk label from combined signal (used as your ML target / for validation)
    risk_score = 0.5 * cost_overrun_pct + 0.5 * (delay_months / sanctioned_duration_months)
    risk_label = "High" if risk_score > 0.30 else ("Medium" if risk_score > 0.12 else "Low")

    rows.append({
        "project_id": f"PRJ{i+1:04d}",
        "sector": sector,
        "implementing_agency": agency,
        "sanctioned_cost_cr": sanctioned_cost_cr,
        "sanctioned_duration_months": sanctioned_duration_months,
        "start_date": start_date.date().isoformat(),
        "elapsed_time_pct": round(elapsed_pct, 3),
        "fund_utilization_pct": round(fund_utilization_pct, 3),
        "physical_progress_pct": round(physical_progress_pct, 3),
        "cost_overrun_pct": cost_overrun_pct,
        "delay_months": delay_months,
        "risk_label": risk_label,
    })

df = pd.DataFrame(rows)
df.to_csv("synthetic_paimana_projects.csv", index=False)
backend_data_dir = Path("backend/data")
backend_data_dir.mkdir(parents=True, exist_ok=True)
df.to_csv(backend_data_dir / "projects.csv", index=False)

print(df.head(10))
print("\nSummary stats:")
print(df[["cost_overrun_pct", "delay_months"]].describe())
print("\nRisk label distribution:")
print(df["risk_label"].value_counts())
print(f"\nSaved {len(df)} rows to synthetic_paimana_projects.csv and backend/data/projects.csv")
