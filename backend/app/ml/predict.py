import pandas as pd
import numpy as np
import joblib
from pathlib import Path

MODELS_DIR = Path(__file__).parent.parent.parent / "models"

_clf = None
_reg = None
_delay_reg = None
_le = None
_feature_names = None
_metrics = None

def _load_models():
    global _clf, _reg, _delay_reg, _le, _feature_names, _metrics
    if _clf is None:
        _clf = joblib.load(MODELS_DIR / 'risk_classifier.joblib')
        _reg = joblib.load(MODELS_DIR / 'overrun_regressor.joblib')
        _delay_reg = joblib.load(MODELS_DIR / 'delay_regressor.joblib')
        _le = joblib.load(MODELS_DIR / 'label_encoder.joblib')
        _feature_names = joblib.load(MODELS_DIR / 'feature_names.joblib')
        _metrics = joblib.load(MODELS_DIR / 'comparison_metrics.joblib')

RISK_DECODE = {0: 'Low', 1: 'Medium', 2: 'High'}

FEATURE_DISPLAY_NAMES = {
    'elapsed_time_pct': 'Time Pressure',
    'fund_utilization_pct': 'Fund Utilization',
    'physical_progress_pct': 'Physical Progress',
    'sanctioned_cost_cr': 'Project Size',
    'sector_encoded': 'Sector Risk History',
    'sanctioned_duration_months': 'Project Duration',
    'progress_lag': 'Progress Lag',
    'fund_progress_gap': 'Fund-Progress Gap',
}

def predict_project(row: dict) -> dict:
    """Given a project dict, return predictions + feature importances."""
    _load_models()
    row = dict(row)
    for col in ['elapsed_time_pct', 'fund_utilization_pct', 'physical_progress_pct']:
        if col in row and row[col] is not None:
            val = float(row[col])
            if abs(val) <= 2.0:
                row[col] = val * 100.0
                
    df = pd.DataFrame([row])
    try:
        df['sector_encoded'] = _le.transform(df['sector'])
    except Exception:
        df['sector_encoded'] = 0
        
    df['progress_lag'] = df['elapsed_time_pct'] - df['physical_progress_pct']
    df['fund_progress_gap'] = df['fund_utilization_pct'] - df['physical_progress_pct']
    
    X = df[_feature_names]
    
    risk_encoded = int(_clf.predict(X)[0])
    predicted_risk = RISK_DECODE[risk_encoded]
    predicted_overrun = float(_reg.predict(X)[0])
    predicted_delay = float(_delay_reg.predict(X)[0])
    
    # Feature importances (from regressor for overrun explanation)
    importances = _reg.feature_importances_
    fi_dict = {
        FEATURE_DISPLAY_NAMES.get(name, name): float(imp)
        for name, imp in zip(_feature_names, importances)
    }
    # Normalize to sum to 1
    total = sum(fi_dict.values())
    fi_dict = {k: round(v / total, 4) for k, v in fi_dict.items()}
    # Sort descending
    fi_dict = dict(sorted(fi_dict.items(), key=lambda x: x[1], reverse=True))
    
    return {
        'predicted_risk': predicted_risk,
        'predicted_overrun_pct': round(max(0, predicted_overrun), 2),
        'predicted_delay_months': round(max(0, predicted_delay), 1),
        'feature_importances': fi_dict,
    }

def get_comparison_metrics():
    _load_models()
    return _metrics

def models_exist() -> bool:
    return (MODELS_DIR / 'risk_classifier.joblib').exists()
