"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import type { SupplierScreenResult } from "@/lib/eau/supplier-esg-screen";

export function SupplierEsgConsole() {
  const [name, setName] = useState("CoolTech Cooling SARL");
  const [claim, setClaim] = useState(
    "100% green cooling, CSRD ready, GO certificates included, net-zero guaranteed."
  );
  const [urls, setUrls] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<SupplierScreenResult | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const evidence_urls = urls
        .split(/[\n,]/)
        .map((u) => u.trim())
        .filter(Boolean);
      const res = await fetch("/api/green/eau/supplier-screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_name: name,
          claim_text: claim,
          evidence_urls: evidence_urls.length ? evidence_urls : undefined,
        }),
      });
      const json = (await res.json()) as {
        screen?: SupplierScreenResult;
        error?: { message?: string };
      };
      if (!res.ok || !json.screen) {
        setError(json.error?.message ?? `HTTP ${res.status}`);
        return;
      }
      setScreen(json.screen);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">Fournisseur</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">Claim marketing / ESG</span>
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">
          URLs de preuve (https, une par ligne)
        </span>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={3}
          placeholder="https://…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>
      <PrimaryButton type="button" onClick={() => void run()} disabled={busy}>
        {busy ? "Analyse…" : "Scanner le claim"}
      </PrimaryButton>
      {error ? <p className="text-sm text-red-300/90">{error}</p> : null}
      {screen ? (
        <section className="space-y-3 border-t border-white/10 pt-6">
          <p className="font-mono text-sm text-white/70">
            Grade {screen.grade} · score {screen.score} · {screen.risk_tier}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/55">
            {screen.signals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="font-mono text-[10px] uppercase text-white/40">Priorités</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-white/65">
            {screen.priorities.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p className="text-xs text-white/35">{screen.disclaimer}</p>
        </section>
      ) : null}
    </div>
  );
}
