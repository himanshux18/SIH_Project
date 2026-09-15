'use client';
import { useEffect, useState } from 'react';
import { api, Alert, AlertRule } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import { StatCard } from '@/components/StatCard';
import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import {
  AlertTriangle, Bell, Sliders, CheckCircle2, ShieldAlert,
  X, Save, ToggleLeft, ToggleRight, Sparkles, Filter
} from 'lucide-react';

export default function AlertsPage() {
  const { isAdmin } = useRole();
  const [alertData, setAlertData] = useState<{ alerts: Alert[]; total: number; active_rules_count?: number } | null>(null);
  const [severity, setSeverity] = useState('All');
  const [sector, setSector] = useState('All');
  const [sectors, setSectors] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  // Manage Rules Modal State
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);

  const fetchAlerts = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (severity !== 'All') params.severity = severity;
    if (sector !== 'All') params.sector = sector;
    api.getAlerts(params)
      .then(d => { setAlertData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    api.getStats().then(s => setSectors(['All', ...s.sectors]));
    fetchAlerts();
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [severity, sector]);

  const openRulesModal = async () => {
    setIsRulesModalOpen(true);
    setRulesLoading(true);
    try {
      const res = await api.getRules();
      setRules(res.rules);
    } catch (err) {
      console.error("Failed to load rules", err);
    } finally {
      setRulesLoading(false);
    }
  };

  const handleToggleRule = async (rule: AlertRule) => {
    if (!isAdmin) return;
    setSavingRuleId(rule.id);
    try {
      await api.updateRule(rule.id, { enabled: !rule.enabled });
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRuleId(null);
    }
  };

  const handleThresholdChange = (ruleId: string, newThreshold: number) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, threshold: newThreshold } : r));
  };

  const handleSaveThreshold = async (rule: AlertRule) => {
    if (!isAdmin) return;
    setSavingRuleId(rule.id);
    try {
      await api.updateRule(rule.id, { threshold: rule.threshold });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRuleId(null);
    }
  };

  const highCount = alertData?.alerts.filter(a => a.severity === 'HIGH').length ?? 0;
  const medCount = alertData?.alerts.filter(a => a.severity === 'MEDIUM').length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Early-Warning Dynamic Alerts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time notifications generated dynamically by the early-warning rules engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openRulesModal}
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Sliders className="h-4 w-4 text-blue-600" />
            <span>Manage Rules ({alertData?.active_rules_count || 4} Active)</span>
          </button>

          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500"
          >
            {sectors.map(s => <option key={s}>{s}</option>)}
          </select>

          <select
            value={severity}
            onChange={e => setSeverity(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500"
          >
            {['All', 'HIGH', 'MEDIUM'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active Rule Breaches" value={alertData?.total ?? '—'} sub="Evaluated in real-time" />
        <StatCard label="High Severity" value={highCount} sub="Immediate intervention" accent="text-red-600" />
        <StatCard label="Medium Severity" value={medCount} sub="Monitoring required" accent="text-amber-600" />
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
          Evaluating project data against active threshold rules...
        </div>
      ) : (
        <div className="space-y-3">
          {alertData?.alerts.map(a => (
            <div
              key={`${a.project_id}-${a.alert_date}`}
              className={`flex items-start gap-4 rounded-xl border p-4.5 transition hover:shadow-sm ${
                a.severity === 'HIGH' ? 'border-red-200 bg-red-50/40' : 'border-amber-200 bg-amber-50/40'
              }`}
            >
              <div className={`mt-0.5 flex-shrink-0 rounded-full p-2 ${
                a.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/projects/${a.project_id}`}
                    className="font-bold text-slate-900 hover:text-blue-600 hover:underline text-sm"
                  >
                    {a.project_name}
                  </Link>
                  <RiskBadge risk={a.risk_label} size="sm" />
                  <span className="text-xs text-slate-500 font-mono">
                    {a.project_id} · {a.sector} · {a.implementing_agency}
                  </span>
                  {a.rule_name && (
                    <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Rule: {a.rule_name}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  {a.alert_message}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Logged on: {a.alert_date}</span>
                  <Link
                    href={`/projects/${a.project_id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View Project Diagnostics →
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {(!alertData?.alerts.length) && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No active alerts</p>
              <p className="text-xs text-slate-400 mt-1">No projects currently violate your enabled threshold rules.</p>
            </div>
          )}
        </div>
      )}

      {/* Task 5: Manage Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-blue-600" />
                  Early-Warning Rules Engine (Admin)
                </h3>
                <p className="text-xs text-slate-500">
                  Configure dynamic thresholds. Alerts are regenerated automatically based on active rules.
                </p>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!isAdmin && (
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>You are in <strong>Viewer mode</strong> (read-only). Switch to <strong>Admin</strong> in the top navigation bar to edit thresholds or toggle rules.</span>
              </div>
            )}

            {rulesLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading rules...</div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {rules.map(rule => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border transition ${
                      rule.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600">{rule.id}</span>
                          <h4 className="text-sm font-bold text-slate-900">{rule.name}</h4>
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            rule.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {rule.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => handleToggleRule(rule)}
                        disabled={!isAdmin || savingRuleId === rule.id}
                        className="text-slate-500 hover:text-slate-800 disabled:opacity-50"
                        title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                      >
                        {rule.enabled ? (
                          <ToggleRight className="h-6 w-6 text-blue-600" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-300" />
                        )}
                      </button>
                    </div>

                    {/* Threshold Input Field */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-600 font-semibold">Flag if:</span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {rule.metric} &gt;
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          disabled={!isAdmin || !rule.enabled}
                          value={rule.threshold}
                          onChange={e => handleThresholdChange(rule.id, parseFloat(e.target.value) || 0)}
                          className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
                        />
                        <span className="text-slate-500">{rule.metric.includes('pct') ? '%' : 'mo'}</span>
                      </div>

                      {isAdmin && rule.enabled && (
                        <button
                          onClick={() => handleSaveThreshold(rule)}
                          disabled={savingRuleId === rule.id}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                          <Save className="h-3 w-3" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Close & Refresh Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
