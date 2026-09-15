const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ProjectRevision {
  date: string;
  revised_cost: number;
  reason: string;
}

export interface MonthlySnapshot {
  month: string;
  revised_cost: number;
  physical_progress_pct: number;
  fund_utilization_pct: number;
}

export interface ProjectTimeline {
  start_date: string;
  planned_completion_date: string;
  today_date: string;
  predicted_completion_date: string;
  delay_gap_months: number;
  is_delayed: boolean;
}

export interface Project {
  project_id: string;
  project_name: string;
  sector: string;
  implementing_agency: string;
  sanctioned_cost_cr: number;
  sanctioned_duration_months: number;
  start_date: string;
  elapsed_time_pct: number;
  fund_utilization_pct: number;
  physical_progress_pct: number;
  cost_overrun_pct: number;
  delay_months: number;
  risk_label: string;
  predicted_overrun_pct?: number;
  predicted_delay_months?: number;
  predicted_risk?: string;
  feature_importances?: Record<string, number>;
  progress_lag_pct?: number;
  
  // Tasks 2, 3, 4, 10 fields
  original_sanctioned_cost?: number;
  latest_revised_cost?: number;
  escalation_pct?: number;
  revisions?: ProjectRevision[];
  monthly_snapshots?: MonthlySnapshot[];
  timeline?: ProjectTimeline;
  last_updated_date?: string;
  is_reporting_overdue?: boolean;
  days_since_reporting?: number;
}

export interface ProjectStats {
  total_projects: number;
  avg_cost_overrun_pct: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  overdue_reporting_count?: number;
  sectors: string[];
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  operator: string;
  threshold: number;
  severity: string;
  enabled: boolean;
  description: string;
}

export interface Alert {
  project_id: string;
  project_name: string;
  sector: string;
  implementing_agency: string;
  risk_label: string;
  severity: string;
  alert_date: string;
  cost_overrun_pct: number;
  alert_message: string;
  rule_name?: string;
  metric?: string;
  threshold?: number;
  actual_value?: number;
}

export interface AgencyRanking {
  rank: number;
  agency: string;
  project_count: number;
  avg_cost_overrun_pct: number;
  avg_delay_months: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  grade: string;
  grade_color: string;
}

export interface SimulationResult {
  inputs: Record<string, any>;
  predicted_risk: string;
  predicted_overrun_pct: number;
  predicted_delay_months: number;
  progress_lag_pct: number;
  feature_importances: Record<string, number>;
}

export interface ComparisonMetric {
  model_name: string;
  mae: number;
  color: string;
}

export interface ComparisonResult {
  metrics: ComparisonMetric[];
  improvement_over_baseline_pct: number;
  best_baseline_mae: number;
  ai_mae: number;
  ai_model_type: string;
  clf_accuracy?: number;
}

export interface ChatProjectCard {
  project_id: string;
  project_name: string;
  sector: string;
  implementing_agency: string;
  cost_overrun_pct: number;
  delay_months: number;
  risk_label: string;
}

export interface ChatResponse {
  reply: string;
  projects?: ChatProjectCard[];
  suggestions: string[];
}

export interface CSVPreviewResponse {
  total_rows: number;
  risk_counts: { High: number; Medium: number; Low: number };
  avg_overrun_pct: number;
  top_risky_projects: Project[];
  projects: Project[];
}

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  getStats: (sector?: string) =>
    fetchAPI<ProjectStats>(`/api/projects/stats${sector ? `?sector=${sector}` : ''}`),

  getTopRisk: (sector?: string, limit = 10) =>
    fetchAPI<Project[]>(`/api/projects/top-risk?limit=${limit}${sector ? `&sector=${sector}` : ''}`),

  listProjects: (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(params as any).toString();
    return fetchAPI<{ total: number; page: number; page_size: number; projects: Project[]; agencies: string[] }>(`/api/projects/?${qs}`);
  },

  getProject: (id: string) => fetchAPI<Project>(`/api/projects/${id}`),

  getLeaderboard: () => fetchAPI<AgencyRanking[]>('/api/projects/leaderboard'),

  simulateRisk: (payload: {
    sector: string;
    implementing_agency: string;
    sanctioned_cost_cr: number;
    sanctioned_duration_months: number;
    elapsed_time_pct: number;
    fund_utilization_pct: number;
    physical_progress_pct: number;
  }) => fetchAPI<SimulationResult>('/api/projects/simulate', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getAlerts: (params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    return fetchAPI<{ alerts: Alert[]; total: number; active_rules_count?: number }>(`/api/alerts/${qs ? `?${qs}` : ''}`);
  },

  getRules: () => fetchAPI<{ rules: AlertRule[] }>('/api/alerts/rules'),

  updateRule: (rule_id: string, update: { threshold?: number; enabled?: boolean; severity?: string }) =>
    fetchAPI<{ message: string; rule: AlertRule }>(`/api/alerts/rules/${rule_id}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    }),

  getComparison: () => fetchAPI<ComparisonResult>('/api/comparison/'),

  previewCSV: async (file: File): Promise<CSVPreviewResponse> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload/preview`, { method: 'POST', body: form });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to process CSV' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  commitUploadedProjects: (projects: Project[]) =>
    fetchAPI<{ message: string; projects_added: number; total_projects_now: number }>('/api/upload/commit', {
      method: 'POST',
      body: JSON.stringify({ projects }),
    }),

  uploadCSV: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${API_BASE}/api/upload/csv`, { method: 'POST', body: form }).then(r => r.json());
  },

  addProject: (data: Record<string, unknown>) =>
    fetchAPI('/api/upload/project', { method: 'POST', body: JSON.stringify(data) }),

  sendChatMessage: (message: string, projectId?: string) =>
    fetchAPI<ChatResponse>('/api/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, project_id: projectId }),
    }),
};
