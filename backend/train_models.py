"""Convenience script to train all models from the backend root."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from app.ml.train import train_all

if __name__ == '__main__':
    print("Training ML models...")
    metrics = train_all()
    print("\n=== TRAINING COMPLETE ===")
    print(f"AI Model MAE: {metrics['gb_mae']:.3f}")
    print(f"Linear Regression MAE: {metrics['lr_mae']:.3f}")
    print(f"Moving Average MAE: {metrics['ma_mae']:.3f}")
    print(f"Improvement over best baseline: {metrics['improvement_pct']:.1f}%")
