import { check, warnCheck, type SimCheck } from "@/lib/simulation/types";

const AGENT = "integrations";

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export async function runIntegrationsAgent(): Promise<SimCheck[]> {
  const checks: SimCheck[] = [];

  const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = env("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !supabaseKey) {
    checks.push(
      warnCheck(AGENT, "supabase", false, "missing env — skip DB probes")
    );
    return checks;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error: dossierErr, count: dossierCount } = await sb
      .from("dossiers")
      .select("id", { count: "exact", head: true });

    checks.push(
      check(
        AGENT,
        "supabase dossiers table",
        !dossierErr,
        dossierErr?.message ?? `count=${dossierCount ?? "?"}`
      )
    );

    const { error: leadsErr, count: leadsCount } = await sb
      .from("jurisdiction_leads")
      .select("id", { count: "exact", head: true });

    checks.push(
      check(
        AGENT,
        "supabase jurisdiction_leads",
        !leadsErr,
        leadsErr?.message ?? `count=${leadsCount ?? "?"}`
      )
    );

    const { error: colErr } = await sb
      .from("jurisdiction_leads")
      .select("deliverable_token, starter_kit, delivery_status")
      .limit(1);

    checks.push(
      check(
        AGENT,
        "starter kit columns",
        !colErr,
        colErr?.message ?? "deliverable_token + starter_kit ok"
      )
    );
  } catch (e) {
    checks.push(
      check(
        AGENT,
        "supabase client",
        false,
        e instanceof Error ? e.message : String(e)
      )
    );
  }

  const stripe = env("STRIPE_SECRET_KEY");
  checks.push(
    stripe
      ? check(
          AGENT,
          "stripe secret",
          stripe.startsWith("sk_test_") || stripe.startsWith("sk_live_"),
          `${stripe.slice(0, 12)}…`
        )
      : warnCheck(AGENT, "stripe secret", false, "missing")
  );

  const webhook = env("STRIPE_WEBHOOK_SECRET");
  checks.push(
    webhook
      ? check(AGENT, "stripe webhook secret", webhook.startsWith("whsec_"), "set")
      : warnCheck(AGENT, "stripe webhook secret", false, "missing")
  );

  const resend = env("RESEND_API_KEY");
  checks.push(
    resend
      ? check(AGENT, "resend api key", resend.startsWith("re_"), "set")
      : warnCheck(AGENT, "resend api key", false, "missing")
  );

  const cron = env("CRON_SECRET");
  checks.push(
    cron
      ? check(AGENT, "cron secret", cron.length >= 16, "set")
      : warnCheck(AGENT, "cron secret", false, "missing (nurture cron won't auth)")
  );

  const academyCert = env("ACADEMY_CERT_SECRET");
  checks.push(
    academyCert
      ? check(
          AGENT,
          "academy cert secret",
          academyCert.length >= 16 &&
            academyCert !== "auros-academy-dev-secret-change-in-production",
          "set"
        )
      : warnCheck(AGENT, "academy cert secret", false, "missing — certs forgeable")
  );

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error: remErr } = await sb
        .from("academy_reminder_prefs")
        .select("id", { count: "exact", head: true });
      checks.push(
        check(
          AGENT,
          "academy reminder prefs table",
          !remErr,
          remErr?.message ?? "ok"
        )
      );
      const { error: consErr } = await sb
        .from("academy_consumed_sessions")
        .select("session_id", { count: "exact", head: true });
      checks.push(
        check(
          AGENT,
          "academy consumed sessions table",
          !consErr,
          consErr?.message ?? "ok"
        )
      );
    } catch {
      // already logged above
    }
  }

  return checks;
}

export async function runCronAuthProbe(baseUrl: string): Promise<SimCheck[]> {
  const checks: SimCheck[] = [];
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/cron/jurisdiction-nurture`, {
      signal: AbortSignal.timeout(15_000),
    });
    checks.push(
      check(
        AGENT,
        "cron route protected",
        res.status === 401 || res.status === 403,
        `HTTP ${res.status} (expect 401 without secret)`
      )
    );
  } catch (e) {
    checks.push(
      check(
        AGENT,
        "cron route protected",
        false,
        e instanceof Error ? e.message : String(e)
      )
    );
  }
  return checks;
}
