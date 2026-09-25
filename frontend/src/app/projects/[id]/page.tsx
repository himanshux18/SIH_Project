'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, Project } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend, AreaChart, Area
} from 'recharts';
import Link from 'next/link';
import {
  Calendar, Clock, DollarSign, AlertCircle, FileText, Printer,
  TrendingUp, Milestone, History, ArrowRight, ShieldAlert, CheckCircle2, Sparkles
} from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getProject(id as string)
        .then(p => { setProject(p); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading project diagnostics...</div>;
  if (!project) return <div className="p-12 text-center text-slate-400">Project not found.</div>;

  const progressData = [
    { name: 'Time Elapsed', value: project.elapsed_time_pct, color: '#94a3b8' },
    { name: 'Fund Utilized', value: project.fund_utilization_pct, color: '#60a5fa' },
    {
      name: 'Physical Progress',
      value: project.physical_progress_pct,
      color: project.physical_progress_pct < project.elapsed_time_pct - 15 ? '#ef4444' : '#22c55e'
    },
  ];

  const featureData = Object.entries(project.feature_importances || {}).slice(0, 6).map(([name, value]) => ({
    name,
    value: Math.round(value * 100),
  }));

  const revisions = project.revisions || [
    { date: project.start_date, revised_cost: project.original_sanctioned_cost || project.sanctioned_cost_cr, reason: "Original Sanctioned Budget" }
  ];

  const monthlySnapshots = project.monthly_snapshots || [];
  const timeline = project.timeline;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4 print:text-xs">
      {/* Top back navigation and Print button */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/projects" className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
          ← Back to Project Explorer
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-ai-chat', {
                detail: {
                  projectId: project.project_id,
                  projectName: project.project_name,
                  initialPrompt: `Why is this project risky?`
                }
              }));
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask AI Diagnostics</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Generate Project Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.project_name}</h1>
              <RiskBadge risk={project.risk_label} size="lg" />
              {project.is_reporting_overdue && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                  Reporting Overdue ({project.days_since_reporting}d inactive)
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              <span className="font-mono font-semibold text-slate-700">{project.project_id}</span> · {project.sector} · Implementing Agency: <strong>{project.implementing_agency}</strong>
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>Last Audited Status: <strong className="text-slate-700">{project.last_updated_date || project.start_date}</strong></p>
            <p className="mt-0.5">Monitoring Framework: <strong>PAIMANA Compliant</strong></p>
          </div>
        </div>

        {/* Headline Numbers */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Predicted Cost Overrun</p>
            <p className="mt-1 text-3xl font-extrabold text-red-600 font-mono">
              +{(project.predicted_overrun_pct ?? project.cost_overrun_pct).toFixed(1)}%
            </p>
            <p className="mt-0.5 text-xs text-slate-500">AI Regressor pace forecast</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Predicted Timeline Delay</p>
            <p className="mt-1 text-3xl font-extrabold text-amber-600 font-mono">
              +{(project.predicted_delay_months ?? project.delay_months).toFixed(1)} mo
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Beyond planned commissioning</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Current Sanctioned Cost</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900 font-mono">
              ₹{project.sanctioned_cost_cr.toFixed(1)} Cr
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Original: ₹{(project.original_sanctioned_cost || project.sanctioned_cost_cr).toFixed(1)} Cr</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Planned Duration</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900 font-mono">
              {project.sanctioned_duration_months} mo
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Started {project.start_date}</p>
          </div>
        </div>
      </div>

      {/* Task 4: Smart Timeline / Gantt View with Highlighted Delay Gap Overlay */}
      {timeline && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Milestone className="h-4 w-4 text-blue-600" />
                Smart Timeline & Schedule Slip Overlay
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Horizontal progression comparing planned completion against AI pace-adjusted commissioning date.
              </p>
            </div>
            {timeline.is_delayed && (
              <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-bold border border-red-200">
                ⚠️ Schedule Slip: +{timeline.delay_gap_months} Months Gap
              </span>
            )}
          </div>

          {/* Timeline Bar Visualizer */}
          <div className="py-6 px-2">
            <div className="relative">
              {/* Planned Schedule Track (Base bar) */}
              <div className="h-4 w-full rounded-full bg-slate-200 relative overflow-hidden">
                {/* Elapsed portion */}
                <div
                  className="h-full bg-blue-600 rounded-l-full transition-all"
                  style={{ width: `${Math.min(100, project.elapsed_time_pct)}%` }}
                />
              </div>

              {/* Red Overhang Overlay Bar (Highlighting the Gap between Planned and Predicted Completion) */}
              {timeline.is_delayed && (
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700">Planned Horizon</span>
                    <span className="font-bold text-red-600 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Critical Slippage Overlay: +{timeline.delay_gap_months} months
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-lg flex overflow-hidden border border-slate-200">
                    <div className="h-full bg-slate-300 w-[70%]" title="Baseline Target Horizon" />
                    {/* The Red Overlay Gap */}
                    <div
                      className="h-full bg-red-500 animate-pulse w-[30%]"
                      title={`Delay gap: +${timeline.delay_gap_months} months`}
                    />
                  </div>
                </div>
              )}

              {/* Milestone Markers */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="border-l-2 border-blue-600 pl-2">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Sanctioned Start</p>
                  <p className="font-bold text-slate-800">{timeline.start_date}</p>
                </div>
                <div className="border-l-2 border-slate-400 pl-2">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Today's Marker</p>
                  <p className="font-bold text-slate-800">{timeline.today_date} ({project.elapsed_time_pct.toFixed(0)}% elapsed)</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-2">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Target Commissioning</p>
                  <p className="font-bold text-slate-800">{timeline.planned_completion_date}</p>
                </div>
                <div className="border-l-2 border-red-600 pl-2 bg-red-50/50 p-1 rounded">
                  <p className="text-red-700 font-bold uppercase text-[10px]">AI-Predicted Delivery</p>
                  <p className="font-bold text-red-600 font-mono">{timeline.predicted_completion_date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task 2: Revised Allocation (Money) Tracking */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Revised Budget Allocation & Capital Escalation Tracking
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative financial revisions approved by implementing authorities over the project lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
              <span className="text-slate-500">Original Cost:</span>{' '}
              <strong className="text-slate-900 font-mono">₹{(project.original_sanctioned_cost || project.sanctioned_cost_cr).toFixed(1)} Cr</strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
              <span className="text-slate-500">Latest Approved:</span>{' '}
              <strong className="text-blue-700 font-mono">₹{project.sanctioned_cost_cr.toFixed(1)} Cr</strong>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-red-700">
              <span>Total Escalation:</span>{' '}
              <strong className="font-mono">+{project.escalation_pct?.toFixed(1) || '0.0'}%</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Step / Line Chart */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-slate-600 mb-2">Cost Revision Trajectory (₹ Cr)</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revisions} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}Cr`} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toFixed(1)} Cr`, 'Sanctioned Cost']} />
                <Area type="stepAfter" dataKey="revised_cost" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#costGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revisions Log Table */}
          <div className="border border-slate-100 rounded-xl bg-slate-50/60 p-4">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-slate-500" />
              Revision Audit History
            </p>
            <div className="space-y-2.5 text-xs">
              {revisions.map((rev, idx) => (
                <div key={idx} className="border-b border-slate-200/60 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-900">{rev.date}</span>
                    <span className="text-blue-700 font-mono">₹{rev.revised_cost.toFixed(1)} Cr</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rev.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task 3: Monthly Comparison View & Physical vs Fund Trend */}
      {monthlySnapshots.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Monthly Snapshot: Capital vs Physical Progress Trend
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly time-series comparing physical construction pace against budget drawdowns over recent milestones.
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySnapshots} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}Cr`} />
              <Tooltip
                formatter={(value: any, name: any, item: any) => {
                  const key = item?.dataKey || name;
                  if (key === 'revised_cost' || String(name).includes('Budget')) {
                    return [`₹${Number(value).toFixed(1)} Cr`, 'Approved Budget'];
                  }
                  if (key === 'fund_utilization_pct' || String(name).includes('Fund')) {
                    return [`${Number(value).toFixed(1)}%`, 'Fund Utilization'];
                  }
                  if (key === 'physical_progress_pct' || String(name).includes('Physical')) {
                    return [`${Number(value).toFixed(1)}%`, 'Physical Progress'];
                  }
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="physical_progress_pct" name="Physical Progress %" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="fund_utilization_pct" name="Fund Utilization %" stroke="#2563eb" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              <Line yAxisId="right" type="stepAfter" dataKey="revised_cost" name="Approved Budget (₹ Cr)" stroke="#9333ea" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Progress Lag Diagnostic & AI Feature Importance */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Progress vs Fund Utilization */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Progress Lag Diagnostic</h2>
          <p className="mb-4 text-xs text-slate-500">The gap between physical assets completed and time elapsed drives project risk.</p>
          <div className="space-y-4">
            {progressData.map(d => (
              <div key={d.name}>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">{d.name}</span>
                  <span className="font-mono" style={{ color: d.color }}>{d.value.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(100, d.value)}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
            <p className="text-xs text-slate-600">
              Current Progress Lag: <strong className="font-mono text-red-600 text-sm">{(project.elapsed_time_pct - project.physical_progress_pct).toFixed(1)}%</strong>
              <span className="block text-[11px] text-slate-400 mt-0.5">Physical completion is lagging behind elapsed duration.</span>
            </p>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Why is this project flagged?</h2>
          <p className="mb-4 text-xs text-slate-500">Explainable AI feature weights driving the cost & schedule overrun predictions.</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={featureData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Importance Weight']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {featureData.map((_, i) => <Cell key={i} fill={i === 0 ? '#ef4444' : (i === 1 ? '#f59e0b' : '#3b82f6')} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Data & Audit Parameters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Official Audit Attributes</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 md:grid-cols-4 text-xs">
          {[
            ['Start Date', project.start_date],
            ['Planned Duration', `${project.sanctioned_duration_months} months`],
            ['Time Elapsed', `${project.elapsed_time_pct.toFixed(1)}%`],
            ['Fund Utilization', `${project.fund_utilization_pct.toFixed(1)}%`],
            ['Physical Progress', `${project.physical_progress_pct.toFixed(1)}%`],
            ['Cost Overrun', `${project.cost_overrun_pct.toFixed(1)}%`],
            ['Milestone Delay', `${project.delay_months.toFixed(1)} months`],
            ['Reporting Status', project.is_reporting_overdue ? `Overdue (${project.days_since_reporting}d)` : 'Compliant'],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-slate-100 pb-2">
              <dt className="font-semibold uppercase tracking-wider text-slate-400 text-[10px]">{k}</dt>
              <dd className="mt-0.5 font-bold text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
