'use client';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  Database, 
  Cpu, 
  Layers, 
  FileText,
  Users
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      {/* Top Banner: Real-time System Telemetry & Hackathon Problem Badge */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              API & ML Services Online (v1.0.4)
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">
              Model Inference: <strong>Gradient Boosting (95.6% Accuracy · 1.94% MAE)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold px-2 py-0.5 text-[11px]">
              SIH Problem ID: 26103
            </span>
            <span className="hidden md:inline">MoSPI / Central Infrastructure Monitoring</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
                AI
              </span>
              <span className="font-bold text-slate-900 text-base tracking-tight">InfraRisk Monitor</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                v1.0.4
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              An intelligent early-warning decision support system built for central ministries and implementing agencies to preempt cost escalations, track contractor lag, and protect public capital in national infrastructure mega-projects.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                Developed by Team InfraRisk
              </span>
              <span>·</span>
              <Link 
                href="/about" 
                className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                Meet the Team <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Column 2: Decision Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Analytical Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-blue-600 transition">
                  Project Portfolio Explorer
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-blue-600 transition">
                  What-If Risk Simulator
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-blue-600 transition">
                  Agency Accountability Index
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-blue-600 transition">
                  Early-Warning Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: AI & Research */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              AI & Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/comparison" className="hover:text-blue-600 transition">
                  AI vs Statistical Benchmark
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-blue-600 transition">
                  AI Executive Copilot
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition">
                  PAIMANA Batch Ingestion
                </Link>
              </li>
              <li>
                <Link href="/about#architecture" className="hover:text-blue-600 transition">
                  Pipeline Architecture
                </Link>
              </li>
              <li>
                <Link href="/about#features" className="hover:text-blue-600 transition">
                  Explainable AI (XAI) Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Gov Alignment & SIH */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Governance & SIH
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="text-slate-400">Problem:</span>
                <span className="font-medium text-slate-800">SIH 2024 (SIH26103)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-slate-400">Domain:</span>
                <span className="font-medium text-slate-800">MoSPI / IPMD Cell</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-slate-400">Agencies:</span>
                <span className="font-medium text-slate-800">NHAI, Railways, NTPC</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Team & Project Dossier
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Human Touch & Disclaimers */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            <span>© {currentYear} InfraRisk Monitor. Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 inline fill-red-500" />
            <span>by Team InfraRisk for Smart India Hackathon.</span>
          </p>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Next.js 14 · FastAPI · Scikit-Learn</span>
            <span>·</span>
            <span>Calibrated against Central Project Benchmarks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
