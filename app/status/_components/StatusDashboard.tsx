"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { ProtocolStatusPayload, ServiceHealth } from "@/lib/protocol/status";

const STATUS_LABEL: Record<ServiceHealth, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Outage",
};

const STATUS_CLASS: Record<ServiceHealth, string> = {
  operational: "text-emerald-400",
  degraded: "text-amber-400",
  down: "text-red-400",
};

const DOT_CLASS: Record<ServiceHealth, string> = {
  operational: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-red-400",
};

type Props = {
  initial: ProtocolStatusPayload;
};

export function StatusDashboard({ initial }: Props) {
  const [data, setData] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(initial.timestamp);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/v1/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ProtocolStatusPayload & { disclaimer?: string };
      const { disclaimer: _d, ...payload } = json;
      setData(payload);
      setLastChecked(new Date().toISOString());
    } catch {
      setData((prev) => ({
        ...prev,
        status: "degraded",
        timestamp: new Date().toISOString(),
      }));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return (
    <>
      <Link
        href="/"
        className="interactive-subtle mb-6 inline-flex items-center gap-3"
        aria-label="AUROS — home"
      >
        <Image
          src="/auros-logo.svg"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8"
          priority
        />
        <span className="font-mono text-[11px] tracking-wide text-white/45">AUROS</span>
      </Link>

      <header>
        <p className="page-eyebrow">System status</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${DOT_CLASS[data.status]}`}
            aria-hidden
          />
          <h1 className={`font-display text-2xl font-medium ${STATUS_CLASS[data.status]}`}>
            {STATUS_LABEL[data.status]}
          </h1>
        </div>
        <p className="mt-3 text-sm font-light text-white/50">
          Public health check for the AUROS Protocol API — no authentication required.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card-flat px-5 py-4">
          <p className="font-mono text-[10px] text-white/40">Protocol version</p>
          <p className="mt-2 font-mono text-lg text-white">v{data.version}</p>
        </div>
        <div className="card-flat px-5 py-4">
          <p className="font-mono text-[10px] text-white/40">App version</p>
          <p className="mt-2 font-mono text-lg text-white">{data.app_version}</p>
        </div>
        <div className="card-flat px-5 py-4">
          <p className="font-mono text-[10px] text-white/40">Environment</p>
          <p className="mt-2 font-mono text-sm text-white">{data.deploy.environment}</p>
        </div>
        <div className="card-flat px-5 py-4">
          <p className="font-mono text-[10px] text-white/40">Deploy</p>
          <p className="mt-2 font-mono text-sm text-white">
            {data.deploy.commit ? (
              <>
                <span className="text-emerald-400/80">{data.deploy.commit}</span>
                {data.deploy.ref ? (
                  <span className="text-white/45"> · {data.deploy.ref}</span>
                ) : null}
              </>
            ) : (
              <span className="text-white/45">Local / unknown</span>
            )}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">Services</h2>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="interactive-subtle font-mono text-[10px] text-white/45 hover:text-white disabled:opacity-40"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="mt-4 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {Object.entries(data.services).map(([name, service]) => (
            <div
              key={name}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-mono text-sm text-white">{name}</p>
                {service.message ? (
                  <p className="mt-1 text-xs font-light text-white/40">{service.message}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                {service.latency_ms != null ? (
                  <span className="font-mono text-[10px] text-white/35">
                    {service.latency_ms} ms
                  </span>
                ) : null}
                <span
                  className={`font-mono text-[10px] uppercase tracking-wide ${STATUS_CLASS[service.status]}`}
                >
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 card-flat px-5 py-4">
        <p className="font-mono text-[10px] text-white/40">JSON endpoint</p>
        <p className="mt-2 font-mono text-xs text-white/70">
          GET{" "}
          <Link href="/api/v1/status" className="text-emerald-400/80 hover:text-emerald-300">
            /api/v1/status
          </Link>
        </p>
        <p className="mt-2 text-xs font-light text-white/40">
          All <code>/api/v1/*</code> responses include{" "}
          <code className="text-white/55">X-Response-Time</code>,{" "}
          <code className="text-white/55">X-AUROS-Protocol-Version</code>, and{" "}
          <code className="text-white/55">X-AUROS-Logo</code>.
        </p>
      </section>

      <p className="mt-8 font-mono text-[10px] text-white/30">
        Last checked {new Date(lastChecked).toLocaleString()} · Auto-refresh 60s
      </p>

      <p className="mt-6 text-sm text-white/45">
        <Link href="/developers" className="hover:text-white">
          Developer hub →
        </Link>
      </p>
    </>
  );
}
