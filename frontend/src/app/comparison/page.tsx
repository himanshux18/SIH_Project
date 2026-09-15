'use client';
import { useEffect, useState } from 'react';
import { api, ComparisonResult } from '@/lib/api';
import { StatCard } from '@/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function ComparisonPage() {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComparison().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading comparison...</div>;
  if (!data) return <div className="p-8 text-center text-slate-400">Could not load comparison data.</div>;

  const chartData = data.metrics.map(m => ({
    name: m.model_name,
    mae: m.mae,
    isAI: m.color === 'blue',
  }));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">AI vs Statistical Methods</h1>
      <p className="mb-6 text-sm text-slate-500">
        Comparison of prediction accuracy (Mean Absolute Error on cost overrun %) across models.
        Lower MAE = better prediction.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="AI Model MAE"
          value={`${data.ai_mae.toFixed(2)}%`}
          sub="Gradient Boosting"
          accent="text-blue-600"
        />
        <StatCard
          label="Best Baseline MAE"
          value={`${data.best_baseline_mae.toFixed(2)}%`}
          sub="Linear Regression"
        />
        <StatCard
          label="Accuracy Improvement"
          value={`${data.improvement_over_baseline_pct.toFixed(1)}%`}
          sub="vs best baseline"
          accent="text-green-600"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-1 font-semibold text-slate-800">Prediction Error Comparison (MAE)</h2>
        <p className="mb-6 text-xs text-slate-500">Gradient Boosting (AI) is highlighted in blue — others are statistical baselines.</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 60, top: 10, bottom: 10 }}>
            <XAxis type="number" domain={[0, 'auto']} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: any) => [`${Number(v || 0).toFixed(2)}%`, 'MAE']} />
            <Bar dataKey="mae" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.isAI ? '#2563eb' : '#cbd5e1'} />
              ))}
              <LabelList dataKey="mae" position="right" formatter={(v: any) => `${Number(v || 0).toFixed(2)}%`} style={{ fontSize: 12, fill: '#475569' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="mb-2 font-semibold text-blue-900">Why Gradient Boosting?</h3>
        <ul className="space-y-1.5 text-sm text-blue-800">
          <li>✓ <strong>{data.improvement_over_baseline_pct.toFixed(0)}% lower prediction error</strong> vs best statistical baseline</li>
          <li>✓ Captures <strong>non-linear interactions</strong> between features (progress lag × project size)</li>
          <li>✓ Built-in <strong>feature importance</strong> makes predictions explainable — not a black box</li>
          <li>✓ Compatible with PAIMANA's existing data schema — <strong>ready for real data swap</strong></li>
          {data.clf_accuracy && <li>✓ Risk classification accuracy: <strong>{data.clf_accuracy}%</strong></li>}
        </ul>
      </div>
    </div>
  );
}
