'use client';
import { useEffect, useState } from 'react';
import { api, Project, ProjectStats } from '@/lib/api';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import Link from 'next/link';
import { AlertCircle, ArrowRight, ShieldCheck, TrendingUp, SlidersHorizontal, Award, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [topRisk, setTopRisk] = useState<Project[]>([]);
  const [sector, setSector] = useState('All');
  const [sectors, setSectors] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then(s => { setSectors(['All', ...s.sectors]); });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getStats(sector === 'All' ? undefined : sector),
      api.getTopRisk(sector === 'All' ? undefined : sector, 10),
    ]).then(([s, t]) => {
      setStats(s);
      setTopRisk(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [sector]);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Sector Selector */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Infrastructure Risk Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            AI-powered predictive early-warning system for centrally-sponsored infrastructure projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Filter Sector:</label>
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500"
          >
            {sectors.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Headline Stat Cards with Task 10 Reporting Compliance Card */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="Total Tracked" value={stats.total_projects} sub="Active projects" />
          <StatCard label="Avg Cost Overrun" value={`${stats.avg_cost_overrun_pct.toFixed(1)}%`} accent="text-amber-600" />
          <StatCard label="High Risk" value={stats.high_risk_count} sub="Critical intervention" accent="text-red-600" />
          <StatCard label="Medium Risk" value={stats.medium_risk_count} sub="Monitoring required" accent="text-amber-600" />
          <StatCard
            label="Reporting Overdue"
            value={stats.overdue_reporting_count ?? 0}
            sub="> 2 months inactive"
            accent="text-orange-600"
          />
        </div>
      ) : null}

      {/* Quick Launchpad to New Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/simulator"
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Interactive Tool</span>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">What-if Risk Simulator</h3>
            <p className="text-xs text-slate-500 mt-0.5">Drag progress & fund sliders to test intervention scenarios live</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
        </Link>

        <Link
          href="/leaderboard"
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Governance Benchmark</span>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">Agency Accountability Ranking</h3>
            <p className="text-xs text-slate-500 mt-0.5">Compare NHAI, Indian Railways, NTPC on overrun mitigation</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
        </Link>

        <Link
          href="/alerts"
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Dynamic Engine</span>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600">Configurable Early Warnings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Edit threshold rules and inspect real-time breach timeline</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      {/* Top At-Risk Projects Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Priority Projects Requiring Intervention</h2>
            <p className="text-xs text-slate-500">Sorted by highest risk score and cost overrun magnitude.</p>
          </div>
          <Link href="/projects" className="text-xs font-semibold text-blue-600 hover:underline">
            View all 800 projects →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Project Name / ID</th>
                <th className="px-5 py-3.5">Sector</th>
                <th className="px-5 py-3.5">Implementing Agency</th>
                <th className="px-5 py-3.5 text-right">Cost Overrun</th>
                <th className="px-5 py-3.5 text-right">Delay</th>
                <th className="px-5 py-3.5 text-center">Compliance</th>
                <th className="px-5 py-3.5 text-center">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topRisk.map(p => (
                <tr key={p.project_id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5">
                    <Link href={`/projects/${p.project_id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline block text-sm">
                      {p.project_name}
                    </Link>
                    <span className="font-mono text-[11px] text-slate-400">{p.project_id}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{p.sector}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{p.implementing_agency}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-red-600 text-sm">
                    +{p.cost_overrun_pct.toFixed(1)}%
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-amber-600">
                    +{p.delay_months.toFixed(1)} mo
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {p.is_reporting_overdue ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        <AlertCircle className="h-3 w-3" /> Overdue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Compliant
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <RiskBadge risk={p.risk_label} size="sm" />
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
