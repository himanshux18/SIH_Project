'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { ShieldCheck, Eye, SlidersHorizontal, Award } from 'lucide-react';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/simulator', label: 'Risk Simulator' },
  { href: '/leaderboard', label: 'Agency Ranking' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/comparison', label: 'AI vs Stats' },
  { href: '/chat', label: 'AI Assistant' },
  { href: '/admin', label: 'Admin', adminOnly: true },
];

export function Navbar() {
  const path = usePathname();
  const { role, setRole, isAdmin } = useRole();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 flex h-14 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
            AI
          </span>
          <span className="font-bold text-slate-900 text-base tracking-tight">InfraRisk Monitor</span>
        </Link>

        {/* Navigation Links */}
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

        {/* Role Toggle Switcher (Task 6) */}
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
