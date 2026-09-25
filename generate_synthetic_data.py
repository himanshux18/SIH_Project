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

    # --- Non-linear PAIMANA Infrastructure Dynamics ---
    # Real-world infrastructure projects experience compounding cost overruns when progress lags:
    # 1. Normal execution (lag <= 12%): mild overrun (~3-8%)
    # 2. Critical threshold (12% < lag <= 25%): contractor idle plant claims & price escalation kicks in
    # 3. Crisis packages (lag > 25%): re-tendering, legal arbitration, interest during construction (IDC)
    progress_lag = max(elapsed_pct * 100.0 - physical_progress_pct * 100.0, 0.0)
    fund_gap = max(fund_utilization_pct * 100.0 - physical_progress_pct * 100.0, 0.0)
    base_overrun = sector_overrun_bias[sector] * 100.0

    if progress_lag <= 12.0:
        cost_overrun = base_overrun + 0.18 * progress_lag + np.random.normal(0, 1.0)
    elif progress_lag <= 25.0:
        cost_overrun = (
            base_overrun + 2.5 + 0.35 * progress_lag +
            0.008 * (progress_lag ** 2.0) +
            0.02 * np.log1p(sanctioned_cost_cr) * progress_lag +
            np.random.normal(0, 1.4)
        )
    else:  # Severe crisis packages with compounding IDC and re-tendering
        cost_overrun = (
            base_overrun + 7.0 + 0.55 * progress_lag +
            0.015 * (progress_lag ** 2.1) +
            0.04 * np.log1p(sanctioned_cost_cr) * progress_lag +
            0.20 * fund_gap +
            np.random.normal(0, 2.0)
        )

    cost_overrun_pct = round(max(cost_overrun, 0.8), 1)

    delay_months = (progress_lag / 100.0) * sanctioned_duration_months * 1.15 + (0.018 * (progress_lag ** 1.35)) + np.random.normal(0, 0.9)
    delay_months = round(max(delay_months, 0.0), 1)

    # Risk label from combined signal
    risk_score = 0.52 * (cost_overrun_pct / 32.0) + 0.48 * (delay_months / sanctioned_duration_months)
    risk_label = "High" if risk_score > 0.50 else ("Medium" if risk_score > 0.22 else "Low")

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
