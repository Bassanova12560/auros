"use client";

import { useCallback, useState } from "react";

import { formatGreenMarketLocation } from "@/lib/green/market-i18n";

import { GreenBackLink } from "./green-ui";

type MarketItem = {
  id: string;
  table: "green_market_assets" | "green_market_offers";
  kind: "actor" | "offer";
  name: string;
  city: string;
  country: string;
  contactEmail: string | null;
  createdAt: string;
  detail: string;
};

type LabelItem = {
  id: string;
  projectName: string;
  projectType: string;
  contactName: string;
  email: string;
  country: string;
  website: string;
  description: string;
  createdAt: string;
  hasDocument: boolean;
  reminderSentAt: string | null;
  secondReminderSentAt: string | null;
};

function authHeader(secret: string): HeadersInit {
  return { Authorization: `Bearer ${secret}` };
}

export function GreenAdminView() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [market, setMarket] = useState<MarketItem[]>([]);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const refresh = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const [marketRes, labelRes] = await Promise.all([
        fetch("/api/admin/green-market-pending", { headers: authHeader(token) }),
        fetch("/api/admin/green-label-pending", { headers: authHeader(token) }),
      ]);
      if (!marketRes.ok || !labelRes.ok) {
        setError("Accès refusé — vérifiez CRON_SECRET.");
        setAuthed(false);
        return;
      }
      const marketJson = (await marketRes.json()) as { items: MarketItem[] };
      const labelJson = (await labelRes.json()) as { items: LabelItem[] };
      setMarket(marketJson.items ?? []);
      setLabels(labelJson.items ?? []);
      setAuthed(true);
    } catch {
      setError("Impossible de charger les files d'attente.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!secret.trim()) return;
      await refresh(secret.trim());
    },
    [refresh, secret]
  );

  const moderateMarket = useCallback(
    async (item: MarketItem, action: "approve" | "reject") => {
      setBusyId(item.id);
      setError(null);
      try {
        const res = await fetch("/api/admin/green-market-moderate", {
          method: "POST",
          headers: {
            ...authHeader(secret),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ table: item.table, id: item.id, action }),
        });
        if (!res.ok) {
          setError("Modération marketplace échouée.");
          return;
        }
        await refresh(secret);
      } finally {
        setBusyId(null);
      }
    },
    [refresh, secret]
  );

  const updateLabelStatus = useCallback(
    async (item: LabelItem, status: "in_review" | "rejected") => {
      setBusyId(item.id);
      setError(null);
      try {
        const res = await fetch("/api/admin/green-label-status", {
          method: "POST",
          headers: {
            ...authHeader(secret),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationId: item.id, status }),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setError(json.error ?? "Mise à jour statut label échouée.");
          return;
        }
        await refresh(secret);
      } finally {
        setBusyId(null);
      }
    },
    [refresh, secret]
  );

  const sendLabelReminder = useCallback(
    async (item: LabelItem) => {
      setBusyId(item.id);
      setError(null);
      try {
        const res = await fetch("/api/admin/green-label-reminder", {
          method: "POST",
          headers: {
            ...authHeader(secret),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationId: item.id }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          sent?: boolean;
          reason?: string;
          error?: string;
        };
        if (!res.ok || !json.ok) {
          setError(json.error ?? "Relance dossier échouée.");
          return;
        }
        if (!json.sent) {
          setError(
            json.reason === "already_sent"
              ? "Relance déjà envoyée pour ce dossier."
              : json.reason === "complete"
                ? "Dossier déjà complet."
                : "Relance non envoyée."
          );
          return;
        }
        await refresh(secret);
      } finally {
        setBusyId(null);
      }
    },
    [refresh, secret]
  );

  const publishLabel = useCallback(
    async (item: LabelItem) => {
      const summaryFr = summaries[item.id]?.trim() || item.description.slice(0, 280);
      if (!summaryFr) return;
      setBusyId(item.id);
      setError(null);
      try {
        const res = await fetch("/api/admin/green-label-publish", {
          method: "POST",
          headers: {
            ...authHeader(secret),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId: item.id,
            summaryFr,
            summaryEn: summaryFr,
            summaryEs: summaryFr,
            labelTier: "verified",
          }),
        });
        const json = (await res.json()) as { ok?: boolean; verifyUrl?: string; error?: string };
        if (!res.ok || !json.ok) {
          setError(json.error ?? "Publication label échouée.");
          return;
        }
        await refresh(secret);
      } finally {
        setBusyId(null);
      }
    },
    [refresh, secret, summaries]
  );

  return (
    <div className="page-inner page-inner--3xl mx-auto min-h-screen px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500/60">
          Ops · AUROS Green
        </p>
        <h1 className="mt-2 text-2xl font-medium text-emerald-400">
          Modération marketplace & label
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Accès interne — saisissez CRON_SECRET pour approuver les fiches pending
          et publier les candidatures label.
        </p>

        {!authed ? (
          <form onSubmit={handleLogin} className="mt-8 max-w-md space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-emerald-500/50">
                CRON_SECRET
              </span>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="mt-2 w-full rounded-lg border border-emerald-500/40 bg-black px-4 py-3 text-sm text-emerald-300 outline-none focus:border-emerald-400"
                autoComplete="off"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Chargement…" : "Ouvrir la file"}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-neutral-400">
                {market.length} marketplace · {labels.length} label
              </p>
              <button
                type="button"
                onClick={() => refresh(secret)}
                disabled={loading}
                className="text-xs uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
              >
                Actualiser
              </button>
            </div>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-emerald-500">
                Place de marché (pending)
              </h2>
              {market.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">Aucune fiche en attente.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {market.map((item) => (
                    <li
                      key={`${item.table}-${item.id}`}
                      className="rounded-xl border border-emerald-500/30 bg-black p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-emerald-300">{item.name}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {item.kind} · {formatGreenMarketLocation(item.city, item.country)} ·{" "}
                            {item.detail}
                          </p>
                          {item.contactEmail ? (
                            <p className="mt-1 text-xs text-neutral-400">{item.contactEmail}</p>
                          ) : null}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => moderateMarket(item, "approve")}
                            className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
                          >
                            Approuver
                          </button>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => moderateMarket(item, "reject")}
                            className="rounded-full border border-neutral-600 px-4 py-1.5 text-xs text-neutral-300 hover:border-neutral-400 disabled:opacity-50"
                          >
                            Rejeter
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-emerald-500">
                Candidatures label (pending)
              </h2>
              {labels.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">Aucune candidature en attente.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {labels.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-emerald-500/30 bg-black p-4"
                    >
                      <p className="font-medium text-emerald-300">{item.projectName}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {item.projectType} · {item.country} · {item.contactName} · {item.email}
                        {!item.hasDocument ? " · PDF manquant" : " · PDF joint"}
                        {item.reminderSentAt ? " · Relance 1" : ""}
                        {item.secondReminderSentAt ? " · Relance 2" : ""}
                      </p>
                      <p className="mt-2 text-sm text-neutral-400 line-clamp-3">
                        {item.description}
                      </p>
                      <label className="mt-3 block">
                        <span className="text-xs uppercase tracking-wider text-emerald-500/50">
                          Résumé registre (FR)
                        </span>
                        <textarea
                          rows={2}
                          value={summaries[item.id] ?? item.description.slice(0, 280)}
                          onChange={(e) =>
                            setSummaries((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-3 py-2 text-sm text-emerald-200 outline-none focus:border-emerald-400"
                        />
                      </label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => void updateLabelStatus(item, "in_review")}
                          className="rounded-full border border-emerald-500/50 px-4 py-1.5 text-xs text-emerald-300 hover:border-emerald-400 disabled:opacity-50"
                        >
                          Mettre en revue
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => void updateLabelStatus(item, "rejected")}
                          className="rounded-full border border-neutral-600 px-4 py-1.5 text-xs text-neutral-300 hover:border-neutral-400 disabled:opacity-50"
                        >
                          Rejeter
                        </button>
                        <button
                          type="button"
                          disabled={
                            busyId === item.id ||
                            Boolean(item.reminderSentAt && item.secondReminderSentAt)
                          }
                          onClick={() => void sendLabelReminder(item)}
                          className="rounded-full border border-amber-500/40 px-4 py-1.5 text-xs text-amber-200/90 hover:border-amber-400 disabled:opacity-50"
                        >
                          Relance dossier
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => publishLabel(item)}
                          className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
                        >
                          Publier Verified
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {error ? (
          <p className="mt-6 text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}

        <GreenBackLink href="/green">← Retour au hub</GreenBackLink>
    </div>
  );
}
