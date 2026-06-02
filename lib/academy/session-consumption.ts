import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

import { isAcademyProduction } from "./security";

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMissingTable(error: PostgrestError): boolean {
  const msg = error.message.toLowerCase();
  return (
    error.code === "PGRST204" ||
    error.code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

export type ConsumeSessionResult =
  | { ok: true }
  | { ok: false; reason: "already_used" | "database_unavailable" };

/**
 * Marks a challenge/renewal session as consumed (one cert per session).
 * Production: fail closed if DB unavailable. Dev: allow if migration missing.
 */
export async function consumeAcademySession(
  sessionId: string,
  kind: "challenge" | "renewal"
): Promise<ConsumeSessionResult> {
  if (!sessionId.trim()) {
    return { ok: false, reason: "database_unavailable" };
  }

  const supabase = getAdminClient();
  if (!supabase) {
    if (isAcademyProduction()) {
      return { ok: false, reason: "database_unavailable" };
    }
    console.warn("[academy] supabase env missing — dev skip consume");
    return { ok: true };
  }

  try {
    const { error } = await supabase.from("academy_consumed_sessions").insert({
      session_id: sessionId,
      kind,
    });

    if (!error) return { ok: true };

    if (error.code === "23505") {
      return { ok: false, reason: "already_used" };
    }

    if (isMissingTable(error) && !isAcademyProduction()) {
      console.warn("[academy] consumed_sessions table missing — dev skip");
      return { ok: true };
    }

    console.error("[academy] consume session failed", error);
    return { ok: false, reason: "database_unavailable" };
  } catch (err) {
    console.error("[academy] consume session error", err);
    if (isAcademyProduction()) {
      return { ok: false, reason: "database_unavailable" };
    }
    return { ok: true };
  }
}
