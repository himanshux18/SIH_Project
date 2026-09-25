'use client';
import Link from 'next/link';
import { 
  Users, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  BrainCircuit,
  FileCheck2,
  Compass
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Himanshu',
    role: 'Team Lead & Full-Stack Architect',
    focus: 'End-to-End System Architecture, Next.js React UI, Role-Based Access Control, API Integration & Deployment.',
    badge: 'Lead Developer',
    color: 'border-blue-200 bg-blue-50/50',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  {
    name: 'ML & Research Cell',
    role: 'Machine Learning & Predictive Modeling',
    focus: 'Gradient Boosting Ensemble, Hyperparameter Optimization, Non-linear Tipping Point Calibration, Feature Importance Attribution.',
    badge: 'Data & AI',
    color: 'border-purple-200 bg-purple-50/50',
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  {
    name: 'Backend & Data Engineering',
    role: 'FastAPI Backend & Ingestion Pipeline',
    focus: 'High-throughput PAIMANA CSV schema validation, Synthetic Dataset Generation, In-memory Caching, RESTful Endpoint Security.',
    badge: 'Backend & Pipeline',
    color: 'border-emerald-200 bg-emerald-50/50',
    badgeColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    name: 'Policy & Governance Analyst',
    role: 'Domain Research & Decision Support',
    focus: 'MoSPI & IPMD guideline alignment, Agency Accountability Scoring (NHAI/Railways/NTPC), What-if Risk Simulator logic.',
    badge: 'Product & Policy',
    color: 'border-amber-200 bg-amber-50/50',
    badgeColor: 'bg-amber-100 text-amber-700'
  },
];

const pillars = [
  {
    icon: BrainCircuit,
    title: 'Explainable AI, Not a Black Box',
    desc: 'Bureaucrats and project officers cannot act on unexplained risk numbers. Every single risk score is attributed back to tangible physical progress lags, fund utilization discrepancies, and sector-specific multipliers.'
  },
  {
    icon: TrendingUp,
    title: 'Preemptive vs Retrospective Monitoring',
    desc: 'Traditional monitoring cells notice delays 6 months after they occur. InfraRisk uses leading indicators to catch contractor idling and capital stall 90 days before severe cost overruns trigger.'
  },
  {
    icon: Database,
    title: 'Drop-In Compatibility with PAIMANA',
    desc: 'Zero complex migration needed. Implementing agencies simply upload their existing CSV/tabular monthly progress reports, and our pipeline handles schema normalization and predictive scoring instantly.'
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Governance (RBAC)',
    desc: 'Separation of concerns between general public/parliamentary viewers (read-only audit trail) and administrative officers (staging data, triggering simulations, managing alerts).'
  }
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Smart India Hackathon 2024 · Problem Statement SIH26103
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Crafted by Engineers Dedicated to Safeguarding Public Capital
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            <strong>InfraRisk Monitor</strong> was conceptualized and engineered by <strong>Team InfraRisk</strong> to bridge the critical gap between raw infrastructure project tracking and intelligent predictive foresight across India&apos;s centrally-sponsored mega-projects.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
            >
              Explore Live Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/comparison"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              Review AI Benchmark
            </Link>
          </div>
        </div>

        {/* Decorative Grid Backdrop */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* The Origin Story & Problem Statement */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
          <Compass className="h-4 w-4" />
          The Motivation Behind The Project
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Why Central Infrastructure Monitoring Demands AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed pt-2">
          <p>
            According to recent reports by the <strong>Infrastructure and Project Monitoring Division (IPMD, MoSPI)</strong>, out of 1,800+ tracked mega-projects (worth over ₹150 Crore each), more than <strong>430 projects report severe time delays</strong>, and cost overruns collectively exceed <strong>₹4.5+ Lakh Crore</strong>.
          </p>
          <p>
            The root problem is not a lack of data—it is that traditional systems like PAIMANA operate <em>retrospectively</em>. Project officers only find out that a tunnel or highway package is stalled months after the contractor has pulled machinery off-site. We built this platform to provide <strong>anticipatory alerts, risk simulations, and transparent agency benchmarks</strong> before budgets escalate out of control.
          </p>
        </div>
      </div>

      {/* Team Profiles */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Users className="h-4 w-4" />
            The Builders
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Meet the Engineering Team
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            A collaborative multidisciplinary team spanning full-stack development, applied machine learning, data engineering, and public policy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {teamMembers.map((m, idx) => (
            <div 
              key={idx} 
              className={`rounded-xl border p-6 bg-white shadow-xs transition hover:shadow-md ${m.color}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
                  <p className="text-xs font-medium text-slate-600">{m.role}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                {m.focus}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Engineering Pillars */}
      <div id="architecture" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Layers className="h-4 w-4" />
            Engineering Philosophy
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Core Architectural Pillars
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How we designed InfraRisk Monitor to be production-ready, trustworthy, and deployable within central ministry monitoring cells.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 border border-blue-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Production Technology Stack</h2>
            <p className="text-xs text-slate-500">Every layer was chosen for low latency, reproducible machine learning, and clean maintainability.</p>
          </div>
          <span className="rounded-md bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 text-xs border border-emerald-200">
            100% Open Source
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-bold text-slate-900 block mb-1">Frontend Client</span>
            <p className="text-slate-600">Next.js 14 App Router</p>
            <p className="text-slate-500 text-[11px] mt-0.5">React 18 · Tailwind CSS · Recharts</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-bold text-slate-900 block mb-1">API Backend</span>
            <p className="text-slate-600">FastAPI & Python 3.12</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Uvicorn · Pydantic v2 · CORS</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-bold text-slate-900 block mb-1">ML Inference</span>
            <p className="text-slate-600">Scikit-Learn Ensemble</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Gradient Boosting · Joblib · Pandas</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-bold text-slate-900 block mb-1">Government Schema</span>
            <p className="text-slate-600">PAIMANA Compatibility</p>
            <p className="text-slate-500 text-[11px] mt-0.5">MoSPI Standard Project Attributes</p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-blue-950">Have questions or want a walkthrough?</h3>
          <p className="text-xs text-blue-800 mt-0.5">
            Test the live What-If Risk Simulator or chat with our embedded AI Executive Copilot.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/simulator"
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Launch Simulator
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
          >
            Open AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
