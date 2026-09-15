'use client';
import { useState } from 'react';
import { api, CSVPreviewResponse } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import { StatCard } from '@/components/StatCard';
import { useRole } from '@/context/RoleContext';
import { Upload, PlusCircle, CheckCircle2, AlertTriangle, FileSpreadsheet, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const SECTORS = ['Roads & Highways', 'Railways', 'Power', 'Urban Infrastructure', 'Irrigation'];
const AGENCIES = ['NHAI', 'Indian Railways', 'NTPC', 'Municipal Corporation', 'State PWD', 'CPWD'];

const defaultForm = {
  project_name: '',
  sector: 'Roads & Highways',
  implementing_agency: 'NHAI',
  sanctioned_cost_cr: '',
  sanctioned_duration_months: '',
  start_date: '',
  elapsed_time_pct: '',
  fund_utilization_pct: '',
  physical_progress_pct: '',
};

export default function AdminPage() {
  const { isAdmin } = useRole();
  const [tab, setTab] = useState<'upload' | 'manual'>('upload');
  const [file, setFile] = useState<File | null>(null);
  
  // CSV Preview & Commit state
  const [analyzing, setAnalyzing] = useState(false);
  const [previewData, setPreviewData] = useState<CSVPreviewResponse | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [committing, setCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState<{ message: string; total_projects_now: number } | null>(null);

  // Manual project form state
  const [form, setForm] = useState(defaultForm);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAnalyzeCSV = async () => {
    if (!file) return;
    setAnalyzing(true);
    setPreviewError(null);
    setCommitSuccess(null);
    setPreviewData(null);
    try {
      const data = await api.previewCSV(file);
      setPreviewData(data);
    } catch (err: any) {
      setPreviewError(err.message || 'Failed to analyze CSV file.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCommit = async () => {
    if (!previewData || !previewData.projects.length) return;
    setCommitting(true);
    try {
      const res = await api.commitUploadedProjects(previewData.projects);
      setCommitSuccess(res);
      setPreviewData(null);
      setFile(null);
    } catch (err: any) {
      setPreviewError(err.message || 'Failed to add projects to dashboard.');
    } finally {
      setCommitting(false);
    }
  };

  const handleManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        sanctioned_cost_cr: parseFloat(form.sanctioned_cost_cr),
        sanctioned_duration_months: parseInt(form.sanctioned_duration_months),
        elapsed_time_pct: parseFloat(form.elapsed_time_pct),
        fund_utilization_pct: parseFloat(form.fund_utilization_pct),
        physical_progress_pct: parseFloat(form.physical_progress_pct),
      };
      const r = await api.addProject(payload);
      setSubmitResult(r);
      setForm(defaultForm);
    } catch (e: any) {
      setSubmitResult({ error: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';
  const labelCls = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Management</h1>
      <p className="mb-6 text-sm text-slate-500">
        Upload project batches, validate data, inspect risk distributions, and add projects into the central database.
      </p>

      {!isAdmin && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Viewer Role Active (Read-Only)</span>
            <p className="mt-0.5 text-amber-700">
              You are currently viewing in read-only mode. Switch to <strong>Admin</strong> role using the toggle in the top-right navbar to import datasets or add new projects.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => { setTab('upload'); setCommitSuccess(null); }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === 'upload' ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Upload className="h-4 w-4" /> CSV Batch Upload & Ingestion
        </button>
        <button
          onClick={() => { setTab('manual'); setCommitSuccess(null); }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === 'manual' ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="h-4 w-4" /> Manual Project Entry
        </button>
      </div>

      {tab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 font-semibold text-slate-800">Upload Infrastructure Project Dataset</h2>
            <p className="mb-4 text-xs text-slate-500">
              CSV file containing project attributes (e.g. sector, implementing_agency, sanctioned_cost_cr, elapsed_time_pct, physical_progress_pct).
            </p>

            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                file ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  setFile(e.dataTransfer.files[0]);
                  setPreviewData(null);
                  setPreviewError(null);
                  setCommitSuccess(null);
                }
              }}
            >
              <FileSpreadsheet className={`mb-3 h-10 w-10 ${file ? 'text-blue-600' : 'text-slate-300'}`} />
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : 'Drag and drop your PAIMANA CSV here'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Supports standard comma-separated tabular files
              </p>

              <label className="mt-3 inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition">
                Browse Files
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setPreviewData(null);
                      setPreviewError(null);
                      setCommitSuccess(null);
                    }
                  }}
                />
              </label>
            </div>

            {/* Action Bar */}
            {file && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to analyze: <span className="font-semibold text-slate-700">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={handleAnalyzeCSV}
                  disabled={analyzing}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing & Scoring Rows...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Analyze & Preview Data
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {previewError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
                <span>{previewError}</span>
              </div>
            )}

            {/* Success Notification after commit */}
            {commitSuccess && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5 text-green-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-sm">{commitSuccess.message}</span>
                </div>
                <p className="mt-1 text-xs text-green-700">
                  The dashboard now tracks a total of <strong>{commitSuccess.total_projects_now}</strong> projects.
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition"
                  >
                    View on Dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-4 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-100/50 transition"
                  >
                    Open Project Explorer
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          {previewData && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">CSV Analysis Results</h3>
                  <p className="text-xs text-slate-500">
                    Validated {previewData.total_rows} records. Computed progress lag, cost overrun, and AI risk scores.
                  </p>
                </div>

                <button
                  onClick={handleCommit}
                  disabled={committing}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {committing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Merging to Database...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Add these projects to dashboard
                    </>
                  )}
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <StatCard label="Rows Processed" value={previewData.total_rows} sub="Valid projects parsed" />
                <StatCard label="Avg Overrun" value={`${previewData.avg_overrun_pct.toFixed(1)}%`} accent="text-amber-600" />
                <StatCard label="High Risk" value={previewData.risk_counts.High} sub="Immediate flag" accent="text-red-600" />
                <StatCard label="Medium Risk" value={previewData.risk_counts.Medium} sub="Monitoring needed" accent="text-amber-600" />
                <StatCard label="Low Risk" value={previewData.risk_counts.Low} sub="On schedule" accent="text-emerald-600" />
              </div>

              {/* Top at-risk projects table from this file */}
              <div>
                <h4 className="mb-3 font-semibold text-slate-800 text-sm">Top At-Risk Projects from this File</h4>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Project Name / ID</th>
                        <th className="px-4 py-3">Sector</th>
                        <th className="px-4 py-3">Agency</th>
                        <th className="px-4 py-3 text-right">Sanctioned Cost</th>
                        <th className="px-4 py-3 text-right">Progress Lag</th>
                        <th className="px-4 py-3 text-right">Cost Overrun</th>
                        <th className="px-4 py-3 text-center">Predicted Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewData.top_risky_projects.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-900 block">{p.project_name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{p.project_id}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{p.sector}</td>
                          <td className="px-4 py-3 text-slate-600">{p.implementing_agency}</td>
                          <td className="px-4 py-3 text-right font-mono">₹{p.sanctioned_cost_cr.toFixed(1)} Cr</td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-red-600">
                            +{(p.elapsed_time_pct - p.physical_progress_pct).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-amber-600">
                            +{p.cost_overrun_pct.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <RiskBadge risk={p.risk_label} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'manual' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Add Project Manually</h2>
          <form onSubmit={handleManual} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelCls}>Project Name</label>
              <input
                required
                className={inputCls}
                value={form.project_name}
                placeholder="e.g. NH-66 Four-Laning Package 4"
                onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Sector</label>
              <select className={inputCls} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Implementing Agency</label>
              <select className={inputCls} value={form.implementing_agency} onChange={e => setForm(f => ({ ...f, implementing_agency: e.target.value }))}>
                {AGENCIES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Sanctioned Cost (₹ Cr)</label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 450.0"
                className={inputCls}
                value={form.sanctioned_cost_cr}
                onChange={e => setForm(f => ({ ...f, sanctioned_cost_cr: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Sanctioned Duration (months)</label>
              <input
                required
                type="number"
                min="1"
                placeholder="e.g. 36"
                className={inputCls}
                value={form.sanctioned_duration_months}
                onChange={e => setForm(f => ({ ...f, sanctioned_duration_months: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Start Date</label>
              <input
                required
                type="date"
                className={inputCls}
                value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Elapsed Time %</label>
              <input
                required
                type="number"
                min="0"
                max="150"
                step="0.1"
                placeholder="e.g. 75.0"
                className={inputCls}
                value={form.elapsed_time_pct}
                onChange={e => setForm(f => ({ ...f, elapsed_time_pct: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Fund Utilization %</label>
              <input
                required
                type="number"
                min="0"
                max="150"
                step="0.1"
                placeholder="e.g. 70.0"
                className={inputCls}
                value={form.fund_utilization_pct}
                onChange={e => setForm(f => ({ ...f, fund_utilization_pct: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Physical Progress %</label>
              <input
                required
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g. 48.0"
                className={inputCls}
                value={form.physical_progress_pct}
                onChange={e => setForm(f => ({ ...f, physical_progress_pct: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Adding & Predicting...' : 'Add Project & Get AI Prediction'}
              </button>
            </div>
          </form>

          {submitResult && (
            <div className={`mt-5 rounded-xl border p-4 ${
              submitResult.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-900'
            }`}>
              {submitResult.error ? (
                <p className="text-sm">Error: {submitResult.error}</p>
              ) : (
                <div>
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {submitResult.message} — Assigned ID: <span className="font-mono text-blue-700">{submitResult.project_id}</span>
                  </p>
                  {submitResult.prediction?.predicted_risk && (
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                      <span className="font-semibold text-slate-700">AI Early-Warning Assessment:</span>
                      <RiskBadge risk={submitResult.prediction.predicted_risk} />
                      <span className="text-slate-600">
                        Predicted Overrun: <strong className="text-red-600 font-mono">+{submitResult.prediction.predicted_overrun_pct?.toFixed(1)}%</strong>
                      </span>
                      <span className="text-slate-600">
                        Predicted Delay: <strong className="font-mono">{submitResult.prediction.predicted_delay_months?.toFixed(1)} months</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
