/**
 * Pré-vol production — variables d'environnement + smoke HTTP optionnel.
 *
 * npm run prod:check
 * npm run prod:check -- --http
 * BASE_URL=https://xxx.vercel.app npm run prod:check -- --http
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { GREEN_HEALTH_PATHS } from "@/lib/green/green-health";

type Check = {
  id: string;
  level: "ok" | "warn" | "fail";
  message: string;
};

const REPORT = join(__dirname, "prod-preflight-report.txt");

function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // .env.local optional if vars already exported
  }
}

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function has(name: string): boolean {
  return env(name).length > 0;
}

function push(checks: Check[], id: string, level: Check["level"], message: string) {
  checks.push({ id, level, message });
}

function runEnvChecks(): Check[] {
  const checks: Check[] = [];
  const required: { key: string; hint: string }[] = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", hint: "Supabase Project URL" },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", hint: "Supabase anon key" },
    { key: "SUPABASE_SECRET_KEY", hint: "Supabase service_role" },
    { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", hint: "Clerk publishable" },
    { key: "CLERK_SECRET_KEY", hint: "Clerk secret" },
    { key: "NEXT_PUBLIC_SITE_URL", hint: "https://your-domain (no trailing slash)" },
    { key: "RESEND_API_KEY", hint: "Resend API key" },
    { key: "RESEND_FROM_EMAIL", hint: "onboarding@resend.dev or noreply@domain" },
    { key: "RESEND_INTERNAL_EMAIL", hint: "your inbox for internal alerts" },
  ];

  for (const { key, hint } of required) {
    if (has(key)) {
      push(checks, key, "ok", `${key} is set`);
    } else {
      push(checks, key, "fail", `${key} missing — ${hint}`);
    }
  }

  const ai =
    has("GEMINI_API_KEY") || has("GROQ_API_KEY") || has("MISTRAL_API_KEY");
  if (ai) {
    push(checks, "ai", "ok", "At least one AI provider key is set");
  } else {
    push(
      checks,
      "ai",
      "fail",
      "Set GEMINI_API_KEY and/or GROQ_API_KEY (generation will fail)"
    );
  }

  const site = env("NEXT_PUBLIC_SITE_URL");
  if (site.includes("localhost")) {
    push(
      checks,
      "site_url",
      "warn",
      "NEXT_PUBLIC_SITE_URL points to localhost — use https production URL on Vercel"
    );
  } else if (site.startsWith("http://") && !site.includes("localhost")) {
    push(checks, "site_url", "warn", "Prefer https:// for NEXT_PUBLIC_SITE_URL in prod");
  } else if (site.startsWith("https://")) {
    push(checks, "site_url", "ok", "NEXT_PUBLIC_SITE_URL uses https");
  }

  if (process.env.AUROS_SIMULATION === "true") {
    push(
      checks,
      "simulation",
      "warn",
      "AUROS_SIMULATION=true — disable on production (template-only AI)"
    );
  } else {
    push(checks, "simulation", "ok", "AUROS_SIMULATION is off");
  }

  const pk = env("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  if (pk.startsWith("pk_test_")) {
    push(
      checks,
      "clerk_env",
      "warn",
      "Clerk publishable key is pk_test_ — use production keys for real launch"
    );
  } else if (pk.startsWith("pk_live_")) {
    push(checks, "clerk_env", "ok", "Clerk production publishable key");
  }

  if (!has("NEXT_PUBLIC_CLERK_SIGN_IN_URL")) {
    push(
      checks,
      "clerk_sign_in",
      "warn",
      "Optional: NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in"
    );
  }

  return checks;
}

async function runHttpChecks(base: string): Promise<Check[]> {
  const checks: Check[] = [];
  const isProdHost =
    !base.includes("localhost") && !base.includes("127.0.0.1");

  const paths: { path: string; expect: number | number[] }[] = [
    { path: "/", expect: 200 },
    { path: "/wizard", expect: 200 },
    { path: "/wizard?expert=1", expect: 200 },
    { path: "/privacy", expect: 200 },
    { path: "/green", expect: 200 },
    { path: "/green/market", expect: 200 },
    { path: "/green/impact-report", expect: 200 },
    { path: "/data/green-index", expect: 200 },
    { path: "/api/green/index", expect: 200 },
    { path: "/api/green/carbon-quality/toucan", expect: 200 },
    { path: "/api/green/watt/sunexchange", expect: 200 },
    { path: "/comment-tokeniser", expect: 200 },
    { path: "/comment-tokeniser/immobilier", expect: 200 },
    { path: "/comment-tokeniser/obligations", expect: 200 },
    { path: "/comment-tokeniser/credit-prive", expect: 200 },
    { path: "/comment-tokeniser/energie", expect: 200 },
    { path: "/api/uhi/index", expect: 200 },
    {
      path: "/api/simulate",
      expect: isProdHost ? [200, 403] : 200,
    },
  ];

  for (const greenPath of GREEN_HEALTH_PATHS) {
    if (paths.some((p) => p.path === greenPath)) continue;
    paths.push({ path: greenPath, expect: 200 });
  }

  for (const { path, expect } of paths) {
    const expected = Array.isArray(expect) ? expect : [expect];
    const url = `${base.replace(/\/$/, "")}${path}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (expected.includes(res.status)) {
        push(checks, `http${path}`, "ok", `GET ${path} → ${res.status}`);
      } else {
        push(
          checks,
          `http${path}`,
          "warn",
          `GET ${path} → ${res.status} (expected ${expected.join(" or ")})`
        );
      }
    } catch (err) {
      push(
        checks,
        `http${path}`,
        "fail",
        `GET ${path} failed — ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return checks;
}

function summarize(all: Check[]): { ok: number; warn: number; fail: number } {
  return {
    ok: all.filter((c) => c.level === "ok").length,
    warn: all.filter((c) => c.level === "warn").length,
    fail: all.filter((c) => c.level === "fail").length,
  };
}

async function main() {
  loadEnvLocal();
  const httpFlag = process.argv.includes("--http");
  const base =
    process.env.BASE_URL?.replace(/\/$/, "") ||
    env("NEXT_PUBLIC_SITE_URL") ||
    "http://localhost:3000";

  const lines: string[] = [
    `AUROS prod preflight — ${new Date().toISOString()}`,
    "",
  ];

  const envChecks = runEnvChecks();
  lines.push("## Environment");
  for (const c of envChecks) {
    lines.push(`[${c.level.toUpperCase()}] ${c.message}`);
  }

  let httpChecks: Check[] = [];
  if (httpFlag) {
    lines.push("", `## HTTP (${base})`);
    httpChecks = await runHttpChecks(base);
    for (const c of httpChecks) {
      lines.push(`[${c.level.toUpperCase()}] ${c.message}`);
    }
  } else {
    lines.push("", "(Skip HTTP: run with --http or BASE_URL=... npm run prod:check -- --http)");
  }

  const all = [...envChecks, ...httpChecks];
  const s = summarize(all);
  lines.push(
    "",
    `Summary: ${s.ok} ok, ${s.warn} warn, ${s.fail} fail`,
    s.fail > 0 ? "→ Fix FAIL items before launch." : "→ Ready for deploy smoke test."
  );

  const text = lines.join("\n");
  writeFileSync(REPORT, text, "utf8");
  console.log(text);
  console.log("\nReport:", REPORT);

  process.exit(s.fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
