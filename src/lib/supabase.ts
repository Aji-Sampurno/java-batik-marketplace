import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient = null;

const isConfigured = supabaseUrl && 
                   supabaseAnonKey && 
                   !supabaseUrl.includes('your-supabase-url') &&
                   !supabaseUrl.includes('abcde-link-anda');

if (isConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("Supabase client failed to initialize:", e.message);
  }
}

export const supabase = supabaseClient as any;

if (!supabase) {
  console.warn("Supabase credentials missing or invalid. Falling back to Mock Data mode.");
}
