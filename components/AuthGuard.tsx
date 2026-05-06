'use client';

import { useAuth } from '@/lib/hooks';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
