"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

type ListItem = {
  id: string;
  unit_kind: "e" | "w" | "f";
  status: "active" | "retired";
  created_at: string;
  retired_at: string | null;
  operator_id: string | null;
  external_ref: string;
  content_hash: string;
  energy_kwh?: number;
  volume_m3?: number;
  capacity_kw?: number;
};

const STORAGE_KEY = "auros_chargeflow_console_key";

function quantityLabel(item: ListItem): string {
  if (item.energy_kwh != null) return `${item.energy_kwh} kWh`;
  if (item.volume_m3 != null) return `${item.volume_m3} m³`;
  if (item.capacity_kw != null) return `${item.capacity_kw} kW`;
  return "—";
}

export function ChargeflowConsoleView() {
  const [apiKey, setApiKey] = useState("");
  const [kind, setKind] = useState<"" | "e" | "w" | "f">("");
  const [status, setStatus] = useState<"" | "active" | "retired">("active");
  const [items, setItems] = useState<ListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retiringId, setRetiringId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, []);

  const load = useCallback(async () => {
    const key = apiKey.trim();
    if (!key) {
      setError("Collez une clé Protocol Premium (Bearer).");
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, key);
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (kind) params.set("kind", kind);
      if (status) params.set("status", status);
      params.set("limit", "50");
      const res = await fetch(`/api/v1/chargeflow?${params}`, {
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      });
      const json = (await res.json()) as {
        items?: ListItem[];
        total?: number;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        setItems([]);
        setTotal(0);
        return;
      }
      setItems(json.items ?? []);
      setTotal(json.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, [apiKey, kind, status]);

  async function retire(id: string) {
    const key = apiKey.trim();
    if (!key) return;
    setRetiringId(id);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/chargeflow/${encodeURIComponent(id)}/retire`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: "console_retire" }),
        }
      );
      const json = (await res.json()) as { error?: { message?: string } };
      if (!res.ok) {
        setError(json.error?.message ?? `Retire failed (${res.status})`);
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setRetiringId(null);
    }
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Console opérateur
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Vos unités ChargeFlow
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          Listez et retirez les CFU-E / W / F liées à votre clé Premium. La clé
          reste dans cette session navigateur uniquement.
        </p>
      </header>

      <section className="space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6">
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Clé API Bearer
          </span>
          <input
            type="password"
            autoComplete="off"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="auros_pk_live_…"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/30"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <label className="space-y-1">
            <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
              Kind
            </span>
            <select
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as "" | "e" | "w" | "f")
              }
              className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
            >
              <option value="">Tous</option>
              <option value="e">CFU-E</option>
              <option value="w">CFU-W</option>
              <option value="f">CFU-F</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
              Status
            </span>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "" | "active" | "retired")
              }
              className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
            >
              <option value="">Tous</option>
              <option value="active">Active</option>
              <option value="retired">Retired</option>
            </select>
          </label>
          <div className="flex items-end">
            <PrimaryButton type="button" onClick={load} disabled={loading}>
              {loading ? "Chargement…" : "Charger"}
            </PrimaryButton>
          </div>
        </div>
        {error ? (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}
        <p className="text-xs text-white/35">
          {total} unité{total === 1 ? "" : "s"} ·{" "}
          <Link
            href="/green/api#premium"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Protocol Premium
          </Link>
          {" · "}
          <Link
            href="/developers/docs/endpoint-chargeflow"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Docs API
          </Link>
        </p>
      </section>

      <div className="overflow-x-auto border border-white/[0.08]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            <tr>
              <th className="px-4 py-3 font-normal">ID</th>
              <th className="px-4 py-3 font-normal">Kind</th>
              <th className="px-4 py-3 font-normal">Qty</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Ref</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-white/40"
                >
                  Aucune unité — chargez avec une clé Premium.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/[0.05] text-white/70"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/chargeflow/${encodeURIComponent(item.id)}`}
                      className="text-emerald-400/90 underline-offset-2 hover:underline"
                    >
                      {item.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 uppercase">{item.unit_kind}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {quantityLabel(item)}
                  </td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="max-w-[160px] truncate px-4 py-3 font-mono text-xs text-white/45">
                    {item.external_ref}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === "active" ? (
                      <button
                        type="button"
                        disabled={retiringId === item.id}
                        onClick={() => retire(item.id)}
                        className="font-mono text-[11px] uppercase tracking-wider text-white/50 underline-offset-2 hover:text-white hover:underline disabled:opacity-40"
                      >
                        {retiringId === item.id ? "…" : "Retire"}
                      </button>
                    ) : (
                      <span className="text-white/25">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
