import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient;

export function getSupabase() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    supabase = createClient(url, key);
  }
  return supabase;
}
