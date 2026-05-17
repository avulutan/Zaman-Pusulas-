import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

/**
 * Check if Supabase environment variables are configured.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Create a Supabase browser client.
 * Returns null if Supabase is not configured.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
