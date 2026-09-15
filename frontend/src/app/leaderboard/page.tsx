'use client';
import { useState, useEffect } from 'react';
import { api, AgencyRanking } from '@/lib/api';
import { StatCard } from '@/components/StatCard';
import {
  Award, Building2, TrendingDown, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<AgencyRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then(data => {
        setRankings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch leaderboard", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading agency accountability benchmarks...</div>;
  }

  const bestAgency = rankings[0];
  const totalTracked = rankings.reduce((acc, r) => acc + r.project_count, 0);

  const chartData = rankings.map(r => ({
    name: r.agency,
    overrun: r.avg_cost_overrun_pct,
    delay: r.avg_delay_months,
    count: r.project_count,
    color: r.avg_cost_overrun_pct < 21.0 ? '#16a34a' : (r.avg_cost_overrun_pct < 24.0 ? '#2563eb' : '#ef4444')
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">
            <Award className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Agency Accountability Leaderboard</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Ranked performance of implementing agencies based on cumulative cost overrun mitigation and schedule compliance.
        </p>
      </div>

      {/* Top Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Top Ranked Agency"
          value={bestAgency?.agency || '—'}
          sub={`Lowest average cost overrun (${bestAgency?.avg_cost_overrun_pct}% avg)`}
          accent="text-emerald-600"
        />
        <StatCard
          label="Total Agencies Audited"
          value={rankings.length}
          sub={`${totalTracked} total infrastructure packages`}
        />
        <StatCard
          label="Performance Spread"
          value={`${(rankings[rankings.length - 1]?.avg_cost_overrun_pct - (bestAgency?.avg_cost_overrun_pct || 0)).toFixed(1)}%`}
          sub="Overrun gap between best and worst agency"
          accent="text-amber-600"
        />
      </div>

      {/* Comparative Bar Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          Average Cost Overrun by Implementing Agency (%)
        </h2>
        <p className="text-xs text-slate-500 mb-4">Ranked from best-performing (lowest overrun) to highest overrun.</p>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
            <YAxis domain={[0, 'auto']} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Avg Overrun']} />
            <Bar dataKey="overrun" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranked Accountability Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Agency Performance Ranking</h2>
          <span className="text-xs text-slate-500">{rankings.length} agencies evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5 text-center w-16">Rank</th>
                <th className="px-6 py-3.5">Implementing Agency</th>
                <th className="px-6 py-3.5 text-center">Accountability Grade</th>
                <th className="px-6 py-3.5 text-right">Projects Tracked</th>
                <th className="px-6 py-3.5 text-right">Avg Cost Overrun</th>
                <th className="px-6 py-3.5 text-right">Avg Schedule Delay</th>
                <th className="px-6 py-3.5 text-center">High Risk Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankings.map(r => (
                <tr key={r.agency} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs ${
                      r.rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : (r.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : (r.rank === 3
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-slate-100 text-slate-600'))
                    }`}>
                      #{r.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="font-bold text-slate-900 text-sm">{r.agency}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      r.grade_color === 'green'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : (r.grade_color === 'blue'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : (r.grade_color === 'amber'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'))
                    }`}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                    {r.project_count}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                    <span className={r.avg_cost_overrun_pct > 22.0 ? 'text-red-600' : 'text-slate-800'}>
                      +{r.avg_cost_overrun_pct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">
                    +{r.avg_delay_months.toFixed(1)} mo
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {r.high_risk_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
