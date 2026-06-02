/**
 * Smoke test Resend — run: node --env-file=.env.local scripts/test-resend.mjs
 */
import { Resend } from "resend";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const key = process.env.RESEND_API_KEY?.trim();
const to =
  process.env.RESEND_INTERNAL_EMAIL?.trim() || "delivered@resend.dev";
const from = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

if (!key) {
  console.error("RESEND_API_KEY missing");
  process.exit(1);
}

const resend = new Resend(key);
const { data, error } = await resend.emails.send({
  from: from.includes("<") ? from : `AUROS <${from}>`,
  to: [to],
  subject: "AUROS — test Resend",
  html: "<p>Resend is configured. Transactional emails are ready.</p>",
});

if (error) {
  console.error("Resend error:", error);
  process.exit(1);
}

console.log("OK — email sent, id:", data?.id, "→", to);
