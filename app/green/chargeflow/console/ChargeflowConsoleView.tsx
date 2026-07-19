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

function sampleImportPayload(): string {
  const stamp = Date.now();
  return JSON.stringify(
    {
      default_operator_id: "cpo_demo",
      cdrs: [
        {
          id: `CDR-console-${stamp}`,
          start_date_time: "2026-07-19T10:00:00Z",
          end_date_time: "2026-07-19T10:42:00Z",
          total_energy: 48.2,
          country: "FR",
          location_id: "LOC-1",
        },
      ],
      csv_rows: [
        {
          external_session_id: `csv-console-${stamp}`,
          started_at: "2026-07-19T11:00:00Z",
          ended_at: "2026-07-19T11:30:00Z",
          energy_kwh: 22.5,
          country: "FR",
        },
      ],
    },
    null,
    2
  );
}

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
  const [importJson, setImportJson] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
    setImportJson(sampleImportPayload());
  }, []);

  const load = useCallback(
    async (overrides?: {
      kind?: "" | "e" | "w" | "f";
      status?: "" | "active" | "retired";
    }) => {
      const key = apiKey.trim();
      if (!key) {
        setError("Collez une clé Protocol Premium (Bearer).");
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, key);
      setLoading(true);
      setError(null);
      const kindFilter = overrides?.kind ?? kind;
      const statusFilter = overrides?.status ?? status;
      try {
        const params = new URLSearchParams();
        if (kindFilter) params.set("kind", kindFilter);
        if (statusFilter) params.set("status", statusFilter);
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
    },
    [apiKey, kind, status]
  );

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

  function downloadBlob(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    const header = [
      "id",
      "unit_kind",
      "status",
      "quantity",
      "external_ref",
      "operator_id",
      "content_hash",
      "created_at",
      "retired_at",
    ];
    const rows = items.map((item) =>
      [
        item.id,
        item.unit_kind,
        item.status,
        quantityLabel(item),
        item.external_ref,
        item.operator_id ?? "",
        item.content_hash,
        item.created_at,
        item.retired_at ?? "",
      ]
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(",")
    );
    downloadBlob(
      `chargeflow-units-${new Date().toISOString().slice(0, 10)}.csv`,
      [header.join(","), ...rows].join("\n"),
      "text/csv;charset=utf-8"
    );
  }

  function exportJson() {
    downloadBlob(
      `chargeflow-units-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify({ total: items.length, items }, null, 2),
      "application/json"
    );
  }

  async function runImport() {
    const key = apiKey.trim();
    if (!key) {
      setError("Collez une clé Protocol Premium (Bearer).");
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, key);
    let body: unknown;
    try {
      body = JSON.parse(importJson);
    } catch {
      setError("JSON d'import invalide.");
      return;
    }
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const res = await fetch("/api/v1/chargeflow/from-ocpi", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        total?: number;
        succeeded?: number;
        failed?: number;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Import failed (${res.status})`);
        return;
      }
      setImportResult(
        `Import OK — ${json.succeeded ?? 0}/${json.total ?? 0} réussis` +
          (json.failed ? `, ${json.failed} échecs` : "")
      );
      setKind("e");
      setStatus("active");
      await load({ kind: "e", status: "active" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setImporting(false);
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
          Listez, importez (OCPI/CSV stub) et retirez les CFU liées à votre clé
          Premium. La clé reste dans cette session navigateur uniquement.
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
          <div className="flex items-end gap-2">
            <PrimaryButton type="button" onClick={load} disabled={loading}>
              {loading ? "Chargement…" : "Charger"}
            </PrimaryButton>
            <button
              type="button"
              disabled={items.length === 0}
              onClick={exportCsv}
              className="min-h-[44px] rounded-full border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider text-white/60 transition hover:border-white/40 hover:text-white disabled:opacity-30"
            >
              CSV
            </button>
            <button
              type="button"
              disabled={items.length === 0}
              onClick={exportJson}
              className="min-h-[44px] rounded-full border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider text-white/60 transition hover:border-white/40 hover:text-white disabled:opacity-30"
            >
              JSON
            </button>
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
            href="/developers/docs/endpoint-chargeflow-ocpi"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Docs import OCPI
          </Link>
        </p>
      </section>

      <section className="space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Import OCPI / CSV
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              Collez un corps JSON pour{" "}
              <code className="text-white/70">POST /api/v1/chargeflow/from-ocpi</code>
              {" "}
              (stub offline, max 50). Pas de connexion OCPI live.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setImportJson(sampleImportPayload())}
            className="font-mono text-[11px] uppercase tracking-wider text-white/45 underline-offset-2 hover:text-white hover:underline"
          >
            Exemple
          </button>
        </div>
        <textarea
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          rows={12}
          spellCheck={false}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs leading-relaxed text-white/80 placeholder:text-white/25"
        />
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton
            type="button"
            onClick={runImport}
            disabled={importing || !importJson.trim()}
          >
            {importing ? "Import…" : "Importer → CFU-E"}
          </PrimaryButton>
          {importResult ? (
            <p className="text-sm text-emerald-400/90">{importResult}</p>
          ) : null}
        </div>
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
                  Aucune unité — chargez avec une clé Premium ou importez un
                  export.
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
