'use client';
import { useEffect, useState, useCallback } from 'react';
import { api, Project } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import Link from 'next/link';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [agencies, setAgencies] = useState<string[]>(['All']);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [agency, setAgency] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [complianceFilter, setComplianceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('project_id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<string[]>(['All']);

  useEffect(() => {
    api.getStats().then(s => setSectors(['All', ...s.sectors]));
  }, []);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, page_size: 20, sort_by: sortBy, sort_dir: sortDir };
    if (search) params.search = search;
    if (sector !== 'All') params.sector = sector;
    if (agency !== 'All') params.agency = agency;
    if (riskFilter !== 'All') params.risk_label = riskFilter;
    api.listProjects(params).then(r => {
      let projs = r.projects;
      if (complianceFilter === 'Overdue') {
        projs = projs.filter(p => p.is_reporting_overdue);
      } else if (complianceFilter === 'Compliant') {
        projs = projs.filter(p => !p.is_reporting_overdue);
      }
      setProjects(projs);
      setTotal(complianceFilter !== 'All' ? projs.length : r.total);
      if (r.agencies.length) setAgencies(['All', ...r.agencies]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, sector, agency, riskFilter, complianceFilter, sortBy, sortDir, page]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortArrow = ({ col }: { col: string }) => (
    <span className="ml-1 text-slate-400">{sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Project Explorer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search, filter, and audit all tracked centrally-sponsored infrastructure packages.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name, ID, or agency..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={sector}
          onChange={e => { setSector(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
        >
          {sectors.map(s => <option key={s}>{s}</option>)}
        </select>

        <select
          value={agency}
          onChange={e => { setAgency(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
        >
          {agencies.map(a => <option key={a}>{a}</option>)}
        </select>

        <select
          value={riskFilter}
          onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
        >
          <option value="All">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>

        <select
          value={complianceFilter}
          onChange={e => { setComplianceFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
        >
          <option value="All">All Reporting Status</option>
          <option value="Overdue">⚠️ Overdue Reporting</option>
          <option value="Compliant">✓ Compliant Only</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/50">
          <span className="text-xs font-semibold text-slate-500">{total} projects matching criteria</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading project repository...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  {[
                    ['project_id', 'ID'],
                    ['project_name', 'Project Name'],
                    ['sector', 'Sector'],
                    ['implementing_agency', 'Agency'],
                    ['sanctioned_cost_cr', 'Cost (₹ Cr)'],
                    ['cost_overrun_pct', 'Overrun %'],
                    ['delay_months', 'Delay (mo)'],
                    ['compliance', 'Compliance'],
                    ['risk_label', 'Risk']
                  ].map(([col, label]) => (
                    <th
                      key={col}
                      onClick={() => col !== 'compliance' && toggleSort(col)}
                      className={`px-5 py-3.5 ${col !== 'compliance' ? 'cursor-pointer hover:text-slate-800' : ''}`}
                    >
                      {label}{col !== 'compliance' && <SortArrow col={col} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map(p => (
                  <tr key={p.project_id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500 font-semibold">{p.project_id}</td>
                    <td className="px-5 py-3.5">
                      <Link href={`/projects/${p.project_id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline block text-sm">
                        {p.project_name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{p.sector}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{p.implementing_agency}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">₹{p.sanctioned_cost_cr.toFixed(1)} Cr</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-red-600">+{p.cost_overrun_pct.toFixed(1)}%</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-amber-600">+{p.delay_months.toFixed(1)}</td>
                    <td className="px-5 py-3.5">
                      {p.is_reporting_overdue ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          <AlertCircle className="h-3 w-3 text-amber-600" /> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Up-to-date
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <RiskBadge risk={p.risk_label} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-slate-50/50">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm disabled:opacity-40 hover:bg-slate-50"
          >
            ← Previous
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Page {page} of {Math.max(1, Math.ceil(total / 20))}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm disabled:opacity-40 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
