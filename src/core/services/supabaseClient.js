import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[Supabase] Missing environment variables:", {
    url: supabaseUrl ? "✓" : "✗",
    key: supabaseKey ? "✓" : "✗",
  });
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    storageKey: 'sb-auth-token',
    // Disable lock to prevent orphaned lock issues in React Strict Mode
    lock: undefined
  },
  global: {
    headers: {
      'X-Client-Info': '7rayfi-app'
    }
  }
});