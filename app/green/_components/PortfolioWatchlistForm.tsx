"use client";

import { useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { resolveCatalogLocale } from "@/lib/i18n";

const COPY = {
  fr: {
    title: "Watchlist e-mail",
    intro:
      "Digest quotidien si des alertes portfolio changent (flux silencieux, docs expirés, tiers). Indicatif — pas un service réglementé.",
    email: "E-mail professionnel",
    submit: "Activer le digest",
    success: "Watchlist enregistrée — digest si alertes.",
    error: "Impossible d’enregistrer. Vérifiez l’e-mail.",
    placeholder: "vous@entreprise.com",
  },
  en: {
    title: "Email watchlist",
    intro:
      "Daily digest when portfolio alerts change (silent streams, expired docs, tiers). Indicative — not a regulated service.",
    email: "Work email",
    submit: "Enable digest",
    success: "Watchlist saved — digest when alerts fire.",
    error: "Could not save. Check the email.",
    placeholder: "you@company.com",
  },
  es: {
    title: "Watchlist por e-mail",
    intro:
      "Digest diario si cambian alertas del portafolio. Indicativo — no es un servicio regulado.",
    email: "E-mail profesional",
    submit: "Activar digest",
    success: "Watchlist guardada — digest si hay alertas.",
    error: "No se pudo guardar. Revise el e-mail.",
    placeholder: "usted@empresa.com",
  },
} as const;

export function PortfolioWatchlistForm() {
  const { locale } = useLocale();
  const c = COPY[resolveCatalogLocale(locale)] ?? COPY.fr;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/v1/green/portfolio/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, assetDnaIds: [] }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="p-5 md:p-6">
      <h3 className="font-display text-lg text-white">{c.title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
        {c.intro}
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {c.email}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder={c.placeholder}
            className="mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-500/50"
            autoComplete="email"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {c.submit}
        </button>
      </form>
      {status === "ok" ? (
        <p className="mt-3 text-sm text-emerald-300/80">{c.success}</p>
      ) : null}
      {status === "err" ? (
        <p className="mt-3 text-sm text-red-300/80">{c.error}</p>
      ) : null}
    </div>
  );
}
