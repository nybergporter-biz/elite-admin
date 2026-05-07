import Navigation from '@/components/Navigation';
import AuthGuard from '@/components/AuthGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
