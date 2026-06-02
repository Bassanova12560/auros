import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

function assertEnv(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local and restart the dev server.`
    );
  }
  return value;
}

/** Server-only Supabase client (secret key). Never import from client components. */
export function getSupabaseServerClient(): SupabaseClient {
  const url = assertEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL);
  const key = assertEnv("SUPABASE_SECRET_KEY", SUPABASE_SECRET_KEY);
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
