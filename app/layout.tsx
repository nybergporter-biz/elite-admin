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
        <AuthGuard>
          <div className="flex">
            <Navigation />
            <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
              {children}
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
