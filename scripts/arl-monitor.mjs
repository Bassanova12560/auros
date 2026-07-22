#!/usr/bin/env node
/**
 * ARL monitoring stub — alerts when oracle mint stream is silent.
 * Env: AGENT_API_URL (default http://127.0.0.1:4100), MINT_ALERT_MINUTES (default 15)
 */

const baseUrl = (process.env.AGENT_API_URL ?? "http://127.0.0.1:4100").replace(/\/$/, "");
const alertMinutes = Number(process.env.MINT_ALERT_MINUTES ?? "15");
const pollMs = Number(process.env.ARL_MONITOR_POLL_MS ?? "60000");

async function fetchHealth() {
  const res = await fetch(`${baseUrl}/health`);
  if (!res.ok) throw new Error(`health HTTP ${res.status}`);
  return res.json();
}

async function tick() {
  const ts = new Date().toISOString();
  try {
    const body = await fetchHealth();
    const lastMintAt = body.lastMintAt ?? body.mint?.lastAt ?? null;
    if (!lastMintAt) {
      console.warn(`[${ts}] oracle silence: no lastMintAt in health payload (mock/stub OK in dev)`);
      return;
    }
    const ageMin = (Date.now() - new Date(lastMintAt).getTime()) / 60000;
    if (ageMin > alertMinutes) {
      console.error(
        `[${ts}] ALERT: oracle silent ${ageMin.toFixed(1)} min (threshold ${alertMinutes} min)`
      );
    } else {
      console.info(`[${ts}] ok — last mint ${ageMin.toFixed(1)} min ago`);
    }
  } catch (err) {
    console.error(`[${ts}] monitor error:`, err instanceof Error ? err.message : err);
  }
}

console.info(`arl-monitor → ${baseUrl} every ${pollMs}ms`);
await tick();
setInterval(tick, pollMs);
