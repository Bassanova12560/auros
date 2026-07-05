/**
 * Smoke test Clerk env + Supabase dossiers + Resend API.
 * npm run verify:integrations
 */

import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[t.slice(0, i).trim()]) {
        process.env[t.slice(0, i).trim()] = v;
      }
    }
  } catch {
    console.error("Missing .env.local");
    process.exit(1);
  }
}

async function main() {
  loadEnvLocal();

  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const sk = process.env.CLERK_SECRET_KEY ?? "";
  console.log(
    `Clerk: publishable=${pk.startsWith("pk_test_") ? "test" : pk.startsWith("pk_live_") ? "live" : "unknown"}, secret=${sk.startsWith("sk_test_") ? "test" : sk.startsWith("sk_live_") ? "live" : "unknown"}`
  );

  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SECRET_KEY!;
  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error, count } = await sb
    .from("dossiers")
    .select("id, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Supabase FAIL:", error.message, error.code ?? "");
    process.exit(1);
  }
  console.log(
    `Supabase OK: table dossiers reachable, count=${count ?? "?"}, sample=${data?.length ?? 0}`
  );
  if (data?.length) {
    for (const row of data) {
      console.log(`  - ${String(row.id).slice(0, 8)}… status=${row.status}`);
    }
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    console.error("Resend FAIL: RESEND_API_KEY missing");
    process.exit(1);
  }

  const res = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${resendKey}` },
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await res.json().catch(() => ({}))) as {
    data?: unknown[];
    message?: string;
  };
  if (!res.ok) {
    console.error("Resend FAIL:", res.status, body.message ?? JSON.stringify(body));
    process.exit(1);
  }
  console.log(
    `Resend OK: API key valid, domains=${Array.isArray(body.data) ? body.data.length : 0}`
  );
  console.log(`From: ${process.env.RESEND_FROM_EMAIL ?? "(unset)"}`);
  console.log(`Internal: ${process.env.RESEND_INTERNAL_EMAIL ?? "(unset)"}`);

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  console.log(
    stripeKey
      ? `Stripe: secret key set (${stripeKey.startsWith("sk_live") ? "live" : "test"})`
      : "Stripe: STRIPE_SECRET_KEY not set (checkout disabled)"
  );

  const webhook =
    process.env.JURISDICTION_WEBHOOK_URL?.trim() ||
    process.env.PARTNER_WEBHOOK_URL?.trim();
  console.log(
    webhook
      ? "Webhook: jurisdiction/partner URL is set"
      : "Webhook: not set (optional — leads still email)"
  );

  const { data: leadCols, error: leadColsError } = await sb
    .from("leads")
    .select("referred_by, nurture_step, locale")
    .limit(0);
  if (leadColsError?.message?.includes("column")) {
    console.error(
      "Supabase WARN: leads nurture/partner columns missing — run migrations 0029–0032"
    );
  } else {
    console.log("Supabase OK: leads.referred_by + nurture columns present");
  }

  const { error: dossierRefError } = await sb
    .from("dossiers")
    .select("referred_by")
    .limit(0);
  if (dossierRefError?.message?.includes("column")) {
    console.error(
      "Supabase WARN: dossiers.referred_by missing — run migration 0029/0030"
    );
  } else {
    console.log("Supabase OK: dossiers.referred_by present");
  }

  const cron = process.env.CRON_SECRET?.trim();
  console.log(
    cron
      ? "Cron: CRON_SECRET set (lead-nurture + Green crons)"
      : "Cron: CRON_SECRET missing — Vercel crons will 401"
  );

  console.log("\nAll integration checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
