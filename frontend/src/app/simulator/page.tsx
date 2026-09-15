'use client';
import { useState, useEffect } from 'react';
import { api, Project, SimulationResult } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import {
  SlidersHorizontal, Sparkles, TrendingDown, TrendingUp,
  RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SimulatorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Simulation Sliders
  const [physicalProgress, setPhysicalProgress] = useState<number>(45);
  const [fundUtilization, setFundUtilization] = useState<number>(65);
  const [elapsedTime, setElapsedTime] = useState<number>(60);
  const [sanctionedCost, setSanctionedCost] = useState<number>(500);
  const [sanctionedDuration, setSanctionedDuration] = useState<number>(36);
  const [sector, setSector] = useState<string>('Roads & Highways');
  const [agency, setAgency] = useState<string>('NHAI');

  // Results State
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  // Baseline Comparison
  const [baselineProject, setBaselineProject] = useState<Project | null>(null);

  // Load sample projects for selection
  useEffect(() => {
    api.listProjects({ page: 1, page_size: 50 })
      .then(res => {
        setProjects(res.projects);
        if (res.projects.length > 0) {
          const first = res.projects[0];
          setSelectedProjectId(first.project_id);
          applyProjectValues(first);
        }
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));
  }, []);

  const applyProjectValues = (p: Project) => {
    setBaselineProject(p);
    setPhysicalProgress(Math.round(p.physical_progress_pct));
    setFundUtilization(Math.round(p.fund_utilization_pct));
    setElapsedTime(Math.round(p.elapsed_time_pct));
    setSanctionedCost(p.sanctioned_cost_cr);
    setSanctionedDuration(p.sanctioned_duration_months);
    setSector(p.sector);
    setAgency(p.implementing_agency);
  };

  const handleSelectProject = (pid: string) => {
    setSelectedProjectId(pid);
    const found = projects.find(p => p.project_id === pid);
    if (found) {
      applyProjectValues(found);
    }
  };

  // Run simulation whenever sliders change
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 150);
    return () => clearTimeout(timer);
  }, [physicalProgress, fundUtilization, elapsedTime, sanctionedCost, sanctionedDuration, sector, agency]);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateRisk({
        sector,
        implementing_agency: agency,
        sanctioned_cost_cr: sanctionedCost,
        sanctioned_duration_months: sanctionedDuration,
        elapsed_time_pct: elapsedTime,
        fund_utilization_pct: fundUtilization,
        physical_progress_pct: physicalProgress,
      });
      setResult(res);
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setSimulating(false);
    }
  };

  const progressLag = Math.round(elapsedTime - physicalProgress);
  const fundProgressGap = Math.round(fundUtilization - physicalProgress);

  const baselineOverrun = baselineProject?.cost_overrun_pct || 0;
  const currentOverrun = result?.predicted_overrun_pct || 0;
  const overrunDelta = currentOverrun - baselineOverrun;

  const featureChartData = Object.entries(result?.feature_importances || {}).map(([k, v]) => ({
    name: k,
    value: Math.round(v * 100)
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">What-if Infrastructure Risk Simulator</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Interactively adjust project progress, fund drawdowns, and duration pace to test intervention scenarios against the ML risk model.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Controls & Sliders (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Baseline Project (Optional Pre-load)
            </label>
            <select
              value={selectedProjectId}
              onChange={e => handleSelectProject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_id}: {p.project_name} ({p.sector} · {p.risk_label} Risk)
                </option>
              ))}
            </select>
          </div>

          {/* Slider 1: Physical Progress % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800">Physical Progress %</span>
                <p className="text-[11px] text-slate-400">Actual ground construction completed</p>
              </div>
              <span className="font-mono text-base font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                {physicalProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={physicalProgress}
              onChange={e => setPhysicalProgress(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Slider 2: Fund Utilization % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800">Fund Utilization %</span>
                <p className="text-[11px] text-slate-400">Percentage of sanctioned capital disbursed/spent</p>
              </div>
              <span className="font-mono text-base font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                {fundUtilization}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="140"
              step="1"
              value={fundUtilization}
              onChange={e => setFundUtilization(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Slider 3: Elapsed Time % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800">Time Elapsed %</span>
                <p className="text-[11px] text-slate-400">Prorated duration consumed from sanction date</p>
              </div>
              <span className="font-mono text-base font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                {elapsedTime}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="140"
              step="1"
              value={elapsedTime}
              onChange={e => setElapsedTime(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
          </div>

          {/* Derived Real-time Gap Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className={`p-3 rounded-xl border ${
              progressLag > 20 ? 'bg-red-50 border-red-200 text-red-900' : (progressLag > 10 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900')
            }`}>
              <p className="text-[10px] font-bold uppercase tracking-wider">Progress Lag (Time - Progress)</p>
              <p className="text-xl font-bold font-mono mt-0.5">{progressLag > 0 ? `+${progressLag}%` : `${progressLag}%`}</p>
              <p className="text-[11px] mt-0.5 opacity-80">{progressLag > 15 ? 'Critical ground delay' : 'Manageable pace'}</p>
            </div>

            <div className={`p-3 rounded-xl border ${
              fundProgressGap > 15 ? 'bg-red-50 border-red-200 text-red-900' : (fundProgressGap > 5 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700')
            }`}>
              <p className="text-[10px] font-bold uppercase tracking-wider">Fund-Progress Disparity</p>
              <p className="text-xl font-bold font-mono mt-0.5">{fundProgressGap > 0 ? `+${fundProgressGap}%` : `${fundProgressGap}%`}</p>
              <p className="text-[11px] mt-0.5 opacity-80">{fundProgressGap > 10 ? 'Expenditure outpaces build' : 'Balanced expenditure'}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Live Simulated Risk Prediction (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Live AI Model Output
            </h3>
            {simulating && <span className="text-xs text-blue-600 animate-pulse font-semibold">Simulating...</span>}
          </div>

          {/* Predicted Risk Badge Header */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-center space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulated Risk Classification</p>
            <div className="flex justify-center">
              <RiskBadge risk={result?.predicted_risk || 'Medium'} size="lg" />
            </div>
            <p className="text-xs text-slate-500">
              Evaluated via Gradient Boosting Classifier (87.5% accuracy)
            </p>
          </div>

          {/* Predicted Cost Overrun & Delay */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Predicted Overrun</p>
              <p className="text-3xl font-extrabold text-red-600 font-mono mt-1">
                +{(result?.predicted_overrun_pct || 0).toFixed(1)}%
              </p>
              {baselineProject && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                  {overrunDelta > 0 ? (
                    <span className="text-red-600 font-bold flex items-center">
                      <TrendingUp className="h-3 w-3 inline" /> +{overrunDelta.toFixed(1)}% vs baseline
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center">
                      <TrendingDown className="h-3 w-3 inline" /> {overrunDelta.toFixed(1)}% vs baseline
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Predicted Delay</p>
              <p className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
                +{(result?.predicted_delay_months || 0).toFixed(1)} mo
              </p>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Pace milestone horizon
              </p>
            </div>
          </div>

          {/* Explainable AI Driver Breakdown */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5 text-slate-500" />
              Simulated Risk Drivers
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={featureChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Weight']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {featureChartData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#ef4444' : (i === 1 ? '#f59e0b' : '#3b82f6')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Intervention Advice */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
              Scenario Recommendation:
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {physicalProgress < elapsedTime - 15
                ? "Accelerating physical work by 10-15% will significantly reduce predicted cost overrun and downgrade project risk."
                : "Project is on a stable trajectory. Maintaining current progress pace will avert major cost escalations."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
