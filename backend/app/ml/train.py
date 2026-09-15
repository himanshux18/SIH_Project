import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score, classification_report
import joblib
from pathlib import Path

MODELS_DIR = Path(__file__).parent.parent.parent / "models"
DATA_PATH = Path(__file__).parent.parent.parent / "data" / "projects.csv"

FEATURES = [
    'elapsed_time_pct', 'fund_utilization_pct', 'physical_progress_pct',
    'sanctioned_cost_cr', 'sector_encoded', 'sanctioned_duration_months'
]

from app.database import load_projects

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    le = LabelEncoder()
    df = df.copy()
    df['sector_encoded'] = le.fit_transform(df['sector'])
    df['progress_lag'] = df['elapsed_time_pct'] - df['physical_progress_pct']
    df['fund_progress_gap'] = df['fund_utilization_pct'] - df['physical_progress_pct']
    return df, le

def train_all():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    df = load_projects()
    df, le = prepare_features(df)
    
    # Encode labels
    risk_map = {'Low': 0, 'Medium': 1, 'High': 2}
    df['risk_encoded'] = df['risk_label'].map(risk_map)
    
    features_extended = FEATURES + ['progress_lag', 'fund_progress_gap']
    X = df[features_extended]
    y_risk = df['risk_encoded']
    y_overrun = df['cost_overrun_pct']
    
    X_train, X_test, y_risk_train, y_risk_test, y_overrun_train, y_overrun_test = train_test_split(
        X, y_risk, y_overrun, test_size=0.2, random_state=42
    )
    
    # --- Risk Classifier ---
    clf = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
    clf.fit(X_train, y_risk_train)
    clf_preds = clf.predict(X_test)
    clf_acc = accuracy_score(y_risk_test, clf_preds)
    print(f"Risk Classifier Accuracy: {clf_acc:.3f}")
    print(classification_report(y_risk_test, clf_preds, target_names=['Low','Medium','High']))
    joblib.dump(clf, MODELS_DIR / 'risk_classifier.joblib')
    
    # --- Overrun Regressor (AI) ---
    reg = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
    reg.fit(X_train, y_overrun_train)
    reg_preds = reg.predict(X_test)
    reg_mae = mean_absolute_error(y_overrun_test, reg_preds)
    print(f"GradientBoosting Regressor MAE: {reg_mae:.3f}")
    joblib.dump(reg, MODELS_DIR / 'overrun_regressor.joblib')
    
    # --- Baseline: Linear Regression ---
    lr = LinearRegression()
    lr.fit(X_train, y_overrun_train)
    lr_preds = lr.predict(X_test)
    lr_mae = mean_absolute_error(y_overrun_test, lr_preds)
    print(f"Linear Regression MAE: {lr_mae:.3f}")
    joblib.dump(lr, MODELS_DIR / 'linear_regression.joblib')
    
    # --- Baseline: Moving Average ---
    train_mean = y_overrun_train.mean()
    ma_preds = np.full(len(y_overrun_test), train_mean)
    ma_mae = mean_absolute_error(y_overrun_test, ma_preds)
    print(f"Moving Average MAE: {ma_mae:.3f}")
    
    # --- Delay Regressor ---
    delay_reg = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
    delay_reg.fit(X_train, df.loc[X_train.index, 'delay_months'])
    joblib.dump(delay_reg, MODELS_DIR / 'delay_regressor.joblib')
    
    # Save label encoder & feature names
    joblib.dump(le, MODELS_DIR / 'label_encoder.joblib')
    joblib.dump(features_extended, MODELS_DIR / 'feature_names.joblib')
    
    # Save comparison metrics
    best_baseline = min(lr_mae, ma_mae)
    improvement_pct = (best_baseline - reg_mae) / best_baseline * 100
    
    metrics = {
        'gb_mae': reg_mae,
        'lr_mae': lr_mae,
        'ma_mae': ma_mae,
        'clf_accuracy': clf_acc,
        'improvement_pct': improvement_pct,
        'train_mean': float(train_mean),
    }
    joblib.dump(metrics, MODELS_DIR / 'comparison_metrics.joblib')
    print(f"\nAI improvement over best baseline: {improvement_pct:.1f}%")
    print("All models saved.")
    return metrics

if __name__ == '__main__':
    train_all()
