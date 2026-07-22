"use client";

import { useMemo, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { resolveCatalogLocale } from "@/lib/i18n";

export type WatchlistAssetOption = {
  assetDnaId: string;
  displayName: string;
  country: string;
};

type Props = {
  assets: WatchlistAssetOption[];
};

const COPY = {
  fr: {
    title: "Watchlist e-mail",
    intro:
      "Digest quotidien si des alertes portfolio changent. Indicatif — pas un service réglementé.",
    email: "E-mail professionnel",
    submit: "Activer le digest",
    successAll: "Watchlist enregistrée — tout le portefeuille.",
    successSelected: (n: number) =>
      `Watchlist enregistrée — ${n} actif${n > 1 ? "s" : ""} sélectionné${n > 1 ? "s" : ""}.`,
    error: "Impossible d’enregistrer. Vérifiez l’e-mail et la sélection.",
    errorEmpty: "Sélectionnez au moins un actif, ou choisissez « Tout ». ",
    placeholder: "vous@entreprise.com",
    scope: "Périmètre",
    scopeAll: "Tout le portefeuille",
    scopeSelected: "Sélection",
    pick: "Actifs à suivre (max 20)",
    emptyAssets: "Aucun Asset DNA à sélectionner pour l’instant.",
  },
  en: {
    title: "Email watchlist",
    intro:
      "Daily digest when portfolio alerts change. Indicative — not a regulated service.",
    email: "Work email",
    submit: "Enable digest",
    successAll: "Watchlist saved — full portfolio.",
    successSelected: (n: number) =>
      `Watchlist saved — ${n} asset${n > 1 ? "s" : ""} selected.`,
    error: "Could not save. Check email and selection.",
    errorEmpty: "Select at least one asset, or choose “All”.",
    placeholder: "you@company.com",
    scope: "Scope",
    scopeAll: "Full portfolio",
    scopeSelected: "Selection",
    pick: "Assets to watch (max 20)",
    emptyAssets: "No Asset DNA to select yet.",
  },
  es: {
    title: "Watchlist por e-mail",
    intro:
      "Digest diario si cambian alertas del portafolio. Indicativo — no es un servicio regulado.",
    email: "E-mail profesional",
    submit: "Activar digest",
    successAll: "Watchlist guardada — portafolio completo.",
    successSelected: (n: number) =>
      `Watchlist guardada — ${n} activo${n > 1 ? "s" : ""} seleccionado${n > 1 ? "s" : ""}.`,
    error: "No se pudo guardar. Revise e-mail y selección.",
    errorEmpty: "Seleccione al menos un activo, o elija « Todo ».",
    placeholder: "usted@empresa.com",
    scope: "Alcance",
    scopeAll: "Portafolio completo",
    scopeSelected: "Selección",
    pick: "Activos a seguir (máx. 20)",
    emptyAssets: "Aún no hay Asset DNA para seleccionar.",
  },
} as const;

const MAX_PICK = 20;

export function PortfolioWatchlistForm({ assets }: Props) {
  const { locale } = useLocale();
  const c = COPY[resolveCatalogLocale(locale)] ?? COPY.fr;
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [errorKind, setErrorKind] = useState<"generic" | "empty">("generic");
  const [savedCount, setSavedCount] = useState(0);

  const options = useMemo(() => assets.slice(0, 40), [assets]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_PICK) next.add(id);
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const assetDnaIds =
      scope === "all" ? [] : [...selected].slice(0, MAX_PICK);
    if (scope === "selected" && assetDnaIds.length === 0) {
      setErrorKind("empty");
      setStatus("err");
      return;
    }
    setStatus("loading");
    setErrorKind("generic");
    try {
      const res = await fetch("/api/v1/green/portfolio/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, assetDnaIds }),
      });
      if (res.ok) {
        setSavedCount(assetDnaIds.length);
        setStatus("ok");
      } else {
        setStatus("err");
      }
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
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <fieldset>
          <legend className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {c.scope}
          </legend>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/75">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="watch-scope"
                checked={scope === "all"}
                onChange={() => setScope("all")}
                className="accent-emerald-500"
              />
              {c.scopeAll}
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="watch-scope"
                checked={scope === "selected"}
                onChange={() => setScope("selected")}
                disabled={options.length === 0}
                className="accent-emerald-500"
              />
              {c.scopeSelected}
            </label>
          </div>
        </fieldset>

        {scope === "selected" ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.pick}
            </p>
            {options.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-500">{c.emptyAssets}</p>
            ) : (
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto border border-white/10 bg-black/40 p-2">
                {options.map((asset) => (
                  <li key={asset.assetDnaId}>
                    <label className="flex cursor-pointer items-start gap-2 px-1 py-1.5 text-sm text-white/80 hover:bg-white/[0.03]">
                      <input
                        type="checkbox"
                        checked={selected.has(asset.assetDnaId)}
                        onChange={() => toggle(asset.assetDnaId)}
                        className="mt-0.5 accent-emerald-500"
                      />
                      <span>
                        <span className="text-white/90">{asset.displayName}</span>
                        <span className="mt-0.5 block font-mono text-[10px] text-white/35">
                          {asset.country} · {asset.assetDnaId.slice(0, 28)}…
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <div className="flex flex-wrap items-end gap-3">
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
        </div>
      </form>
      {status === "ok" ? (
        <p className="mt-3 text-sm text-emerald-300/80">
          {savedCount === 0 ? c.successAll : c.successSelected(savedCount)}
        </p>
      ) : null}
      {status === "err" ? (
        <p className="mt-3 text-sm text-red-300/80">
          {errorKind === "empty" ? c.errorEmpty : c.error}
        </p>
      ) : null}
    </div>
  );
}
