/**
 * Browser Supabase client (publishable key). Not used in the MVP yet.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient | undefined;

function assertEnv(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local and restart the dev server.`
    );
  }
  return value;
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = assertEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL);
  const key = assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPABASE_ANON_KEY);
  browserClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return browserClient;
}
