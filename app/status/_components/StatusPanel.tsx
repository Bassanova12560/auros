"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Probe = {
  name: string;
  ok: boolean;
  detail: string;
  ms: number | null;
};

async function timedFetch(url: string): Promise<{ res: Response; ms: number }> {
  const t0 = performance.now();
  const res = await fetch(url, { cache: "no-store" });
  return { res, ms: Math.round(performance.now() - t0) };
}

/**
 * Ops transparency — probes public status endpoints (no fake uptime claims).
 */
export function StatusPanel() {
  const [probes, setProbes] = useState<Probe[] | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const run = useCallback(async () => {
    setBusy(true);
    const next: Probe[] = [];
    try {
      const { res, ms } = await timedFetch("/api/status");
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; status?: string };
      next.push({
        name: "Protocol API /api/status",
        ok: res.ok,
        ms,
        detail: res.ok
          ? `HTTP ${res.status} · ${body.status ?? body.ok ?? "reachable"} · ${ms} ms`
          : `HTTP ${res.status} · ${ms} ms`,
      });
    } catch {
      next.push({ name: "Protocol API /api/status", ok: false, ms: null, detail: "fetch failed" });
    }
    try {
      const { res, ms } = await timedFetch("/api/arl/status");
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        persistence?: string;
      };
      next.push({
        name: "ARL lab ledger /api/arl/status",
        ok: res.ok && body.ok !== false,
        ms,
        detail: res.ok
          ? `HTTP ${res.status} · persistence ${body.persistence ?? "n/a"} · ${ms} ms`
          : `HTTP ${res.status} · ${ms} ms`,
      });
    } catch {
      next.push({
        name: "ARL lab ledger /api/arl/status",
        ok: false,
        ms: null,
        detail: "fetch failed",
      });
    }
    setProbes(next);
    setCheckedAt(new Date().toISOString());
    setBusy(false);
  }, []);

  useEffect(() => {
    void run();
  }, [run, attempt]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/55">
        Live probes from this browser against public endpoints, with round-trip latency. Not a
        contractual SLA — for diligence write{" "}
        <a href="mailto:legal@auros.app" className="underline hover:text-white">
          legal@auros.app
        </a>
        .
      </p>
      <ul className="space-y-3">
        {(probes ?? [{ name: "Probing…", ok: true, detail: "…", ms: null }]).map((p) => (
          <li
            key={p.name}
            className="flex flex-wrap items-baseline justify-between gap-2 border-t border-white/10 pt-3"
          >
            <span className="font-display text-sm text-white">{p.name}</span>
            <span
              className={`font-mono text-[11px] uppercase ${
                p.ok ? "text-emerald-400/80" : "text-rose-300/80"
              }`}
            >
              {p.ok ? "up" : "down"} · {p.detail}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-white/35">
        {checkedAt ? <span>Checked {new Date(checkedAt).toLocaleString()}</span> : null}
        <button
          type="button"
          disabled={busy}
          className="underline-offset-2 hover:text-white hover:underline disabled:opacity-40"
          onClick={() => setAttempt((n) => n + 1)}
        >
          {busy ? "Retrying…" : "Retry probes"}
        </button>
      </div>
      <p className="font-mono text-[11px] text-white/40">
        <Link href="/lab" className="underline-offset-2 hover:underline">
          Energy Lab
        </Link>
        {" · "}
        <Link href="/builders" className="underline-offset-2 hover:underline">
          Builders
        </Link>
        {" · "}
        <Link href="/investors" className="underline-offset-2 hover:underline">
          Investors
        </Link>
        {" · "}
        <Link href="/" className="underline-offset-2 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
