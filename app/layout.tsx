import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import AuthGuard from '@/components/AuthGuard';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Elite Junk Solutions - Admin Dashboard',
  description: 'Admin dashboard for managing junk removal business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  'use client';

  const isAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/login');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex">
        <Navigation />
        <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
