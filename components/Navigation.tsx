'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks';

export default function Navigation() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Elite Admin</h1>
        <p className="text-sm text-slate-400">{user.email}</p>
      </div>

      <ul className="space-y-4">
        <li>
          <Link href="/" className="hover:text-orange-400">
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link href="/customers" className="hover:text-orange-400">
            👥 Customers
          </Link>
        </li>
        <li>
          <Link href="/jobs" className="hover:text-orange-400">
            📋 Jobs
          </Link>
        </li>
        <li>
          <Link href="/invoices" className="hover:text-orange-400">
            💰 Invoices
          </Link>
        </li>
        <li>
          <Link href="/calendar" className="hover:text-orange-400">
            📅 Calendar
          </Link>
        </li>
        <li>
          <Link href="/settings" className="hover:text-orange-400">
            ⚙️ Settings
          </Link>
        </li>
      </ul>

      <div className="absolute bottom-6 left-6">
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="text-sm text-slate-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
