import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize session from localStorage if it exists
if (typeof window !== 'undefined') {
  const storedSession = localStorage.getItem('supabase.auth.token');
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      supabase.auth.setSession(session).catch(() => {
        // If session is invalid, clear it
        localStorage.removeItem('supabase.auth.token');
      });
    } catch (err) {
      localStorage.removeItem('supabase.auth.token');
    }
  }
}
