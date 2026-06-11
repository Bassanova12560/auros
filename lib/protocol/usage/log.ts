import { isSupabaseConfigured } from "../auth/keys";

export async function logProtocolUsage(
  keyHash: string,
  endpoint: string,
  method: string,
  status: number
): Promise<void> {
  if (keyHash === "demo" || !isSupabaseConfigured()) return;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    await supabase.from("protocol_usage_logs").insert({
      key_hash: keyHash,
      endpoint,
      method,
      status,
    });
  } catch {
    // optional audit trail
  }
}

export async function getUsageStats(keyHash: string): Promise<{
  requests_this_month: number;
  total_logged: number;
  by_endpoint: Record<string, number>;
}> {
  const { getKeyUsage } = await import("../auth/keys");
  const requestsThisMonth = await getKeyUsage(keyHash);

  if (!isSupabaseConfigured()) {
    return {
      requests_this_month: requestsThisMonth,
      total_logged: requestsThisMonth,
      by_endpoint: {},
    };
  }

  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);

    const { data, count } = await supabase
      .from("protocol_usage_logs")
      .select("endpoint", { count: "exact" })
      .eq("key_hash", keyHash)
      .gte("created_at", monthStart.toISOString());

    const byEndpoint: Record<string, number> = {};
    for (const row of data ?? []) {
      const ep = (row as { endpoint: string }).endpoint;
      byEndpoint[ep] = (byEndpoint[ep] ?? 0) + 1;
    }

    return {
      requests_this_month: requestsThisMonth,
      total_logged: count ?? 0,
      by_endpoint: byEndpoint,
    };
  } catch {
    return {
      requests_this_month: requestsThisMonth,
      total_logged: requestsThisMonth,
      by_endpoint: {},
    };
  }
}

export async function findKeyHashByEmail(email: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("api_keys")
      .select("key_hash")
      .eq("email", email.toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.key_hash ?? null;
  } catch {
    return null;
  }
}
