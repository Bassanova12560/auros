"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Probe = {
  name: string;
  ok: boolean;
  detail: string;
};

/**
 * Ops transparency — probes public status endpoints (no fake uptime claims).
 */
export function StatusPanel() {
  const [probes, setProbes] = useState<Probe[] | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const next: Probe[] = [];
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const body = (await res.json().catch(() => ({}))) as { ok?: boolean; status?: string };
        next.push({
          name: "Protocol API /api/status",
          ok: res.ok,
          detail: res.ok
            ? `HTTP ${res.status} · ${body.status ?? body.ok ?? "reachable"}`
            : `HTTP ${res.status}`,
        });
      } catch {
        next.push({ name: "Protocol API /api/status", ok: false, detail: "fetch failed" });
      }
      try {
        const res = await fetch("/api/arl/status", { cache: "no-store" });
        const body = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          persistence?: string;
        };
        next.push({
          name: "ARL lab ledger /api/arl/status",
          ok: res.ok && body.ok !== false,
          detail: res.ok
            ? `HTTP ${res.status} · persistence ${body.persistence ?? "n/a"}`
            : `HTTP ${res.status}`,
        });
      } catch {
        next.push({ name: "ARL lab ledger /api/arl/status", ok: false, detail: "fetch failed" });
      }
      if (!cancelled) {
        setProbes(next);
        setCheckedAt(new Date().toISOString());
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/55">
        Live probes from this browser against public endpoints. Not a contractual SLA page — for
        that, request diligence via{" "}
        <a href="mailto:legal@auros.app" className="underline hover:text-white">
          legal@auros.app
        </a>
        .
      </p>
      <ul className="space-y-3">
        {(probes ?? [{ name: "Probing…", ok: true, detail: "…" }]).map((p) => (
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
      {checkedAt ? (
        <p className="font-mono text-[10px] text-white/35">
          Checked {new Date(checkedAt).toLocaleString()} ·{" "}
          <button
            type="button"
            className="underline-offset-2 hover:text-white hover:underline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </p>
      ) : null}
      <p className="font-mono text-[11px] text-white/40">
        <Link href="/lab" className="underline-offset-2 hover:underline">
          Energy Lab
        </Link>
        {" · "}
        <Link href="/builders" className="underline-offset-2 hover:underline">
          Builders
        </Link>
        {" · "}
        <Link href="/" className="underline-offset-2 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
