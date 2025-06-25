import { createClient } from '@supabase/supabase-js';
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
if (typeof window !== 'undefined') {
  alert(`URL: ${import.meta.env.VITE_SUPABASE_URL}\nKEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8)}...`);
}

export const supabase = createClient(
import.meta.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL,
import.meta.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY
);
