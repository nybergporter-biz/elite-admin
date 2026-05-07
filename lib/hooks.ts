import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from './types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ? { id: user.id, email: user.email! } : null);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (limit = 20, offset = 0) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      setCustomers(data || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { customers, loading, error, fetch };
}
