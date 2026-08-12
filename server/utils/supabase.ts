import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    console.warn("Supabase environment variables (SUPABASE_URL, SUPABASE_SECRET_KEY) are missing.");
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false
    }
  });

  return supabaseClient;
}
