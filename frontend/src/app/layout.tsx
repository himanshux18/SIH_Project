import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { RoleProvider } from '@/context/RoleContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InfraRisk Monitor — SIH26103',
  description: 'AI-powered predictive early-warning infrastructure risk monitoring platform for centrally-sponsored projects.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <RoleProvider>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">{children}</main>
          <Footer />
          <ChatWidget />
        </RoleProvider>
      </body>
    </html>
  );
}
