import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ChatWidget } from '@/components/ChatWidget';
import { RoleProvider } from '@/context/RoleContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InfraRisk Monitor',
  description: 'AI-powered predictive risk monitoring for infrastructure projects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <RoleProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
          <ChatWidget />
        </RoleProvider>
      </body>
    </html>
  );
}
