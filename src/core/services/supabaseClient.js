import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    /** Nécessaire pour récupérer la session depuis le hash du lien « reset password » (#access_token…). */
    detectSessionInUrl: true,
  },
});