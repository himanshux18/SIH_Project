'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import {
  ShieldCheck,
  Eye,
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  SlidersHorizontal,
  Award,
  AlertTriangle,
  TrendingUp,
  Bot,
  ShieldAlert,
  Users,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/simulator', label: 'Risk Simulator', icon: SlidersHorizontal },
  { href: '/leaderboard', label: 'Agency Ranking', icon: Award },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/comparison', label: 'AI vs Stats', icon: TrendingUp },
  { href: '/chat', label: 'AI Assistant', icon: Bot },
  { href: '/admin', label: 'Admin', icon: ShieldAlert },
  { href: '/about', label: 'Team', icon: Users },
];

export function Navbar() {
  const path = usePathname();
  const { role, setRole, isAdmin } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-14 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
            AI
          </span>
          <span className="font-bold text-slate-900 text-base tracking-tight">InfraRisk Monitor</span>
          <span className="hidden sm:inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            SIH26103
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => {
            const active = l.href === '/' ? path === '/' : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Role Toggle Switcher */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setRole('Admin')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                isAdmin ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Admin role: full access to rules and CSV uploads"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setRole('Viewer')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                !isAdmin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Viewer role: read-only monitoring mode"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Viewer</span>
            </button>
          </div>
        </div>

        {/* Mobile Top Controls: Role Switcher & Hamburger Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Compact Role Switcher on Mobile Bar */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setRole('Admin')}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-semibold text-[11px] transition ${
                isAdmin ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setRole('Viewer')}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-semibold text-[11px] transition ${
                !isAdmin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Viewer</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Explicit Role Status Box */}
          <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Mode: {role}</p>
              <p className="text-[11px] text-slate-500">
                {isAdmin ? 'Uploads & edits enabled' : 'Read-only viewer'}
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs shadow-xs">
              <button
                onClick={() => setRole('Admin')}
                className={`flex items-center gap-1 rounded px-2.5 py-1 font-semibold transition ${
                  isAdmin ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => setRole('Viewer')}
                className={`flex items-center gap-1 rounded px-2.5 py-1 font-semibold transition ${
                  !isAdmin ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Viewer</span>
              </button>
            </div>
          </div>

          {/* Navigation Links list */}
          <div className="space-y-1">
            {links.map(l => {
              const active = l.href === '/' ? path === '/' : path.startsWith(l.href);
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
