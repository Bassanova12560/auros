"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState, useTransition } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  getGreenMyDashboardAction,
  saveGreenMarketAlertAction,
} from "@/lib/actions/green-market-my";
import type { MyGreenMarketListing } from "@/lib/green/market/green-market-db";
import type { GreenMarketAlertRow } from "@/lib/green/market/alerts";
import type { GreenMarketActorType, GreenMarketRadiusKm } from "@/lib/green/market/types";
import { GREEN_MARKET_ROUTE, GREEN_REGISTER_ROUTE } from "@/lib/green/constants";
import { formatGreenMarketLocation } from "@/lib/green/market-i18n";

import { GreenBackLink, GreenPanel, greenBtnClass } from "./green-ui";

const STATUS_LABEL = {
  fr: {
    pending: "En revue",
    available: "Publié",
    closed: "Fermé",
  },
  en: {
    pending: "In review",
    available: "Live",
    closed: "Closed",
  },
  es: {
    pending: "En revisión",
    available: "Publicado",
    closed: "Cerrado",
  },
} as const;

const COPY = {
  fr: {
    eyebrow: "Espace acteur",
    title: "Mes fiches Green",
    intro:
      "Suivez vos fiches acteur et annonces soumises à la place de marché — revue AUROS sous 48 h ouvrées.",
    signIn: "Connectez-vous pour voir vos fiches.",
    empty: "Aucune fiche pour l'instant — référencez votre acteur pour apparaître sur la carte mondiale après revue.",
    register: "Référencer mon acteur",
    alertsTitle: "Alertes géographiques",
    alertsIntro:
      "Recevez un e-mail quand un nouvel acteur est publié près d'une ville (rayon 5–20 km).",
    alertCity: "Ville de référence",
    alertRadius: "Rayon",
    alertType: "Type d'acteur (optionnel)",
    alertTypeAll: "Tous types",
    alertSubmit: "Activer l'alerte",
    alertSubmitting: "Enregistrement…",
    alertSuccess: "Alerte enregistrée.",
    alertError: "Vérifiez la ville et l'e-mail.",
    listingsTitle: "Mes soumissions",
  },
  en: {
    eyebrow: "Actor space",
    title: "My Green listings",
    intro:
      "Track your actor profiles and marketplace listings — AUROS review within 48 business hours.",
    signIn: "Sign in to view your listings.",
    empty: "No listings yet — register your actor to appear on the worldwide map after review.",
    register: "Register my actor",
    alertsTitle: "Geo alerts",
    alertsIntro:
      "Get an email when a new actor is published near a city (5–20 km radius).",
    alertCity: "Reference city",
    alertRadius: "Radius",
    alertType: "Actor type (optional)",
    alertTypeAll: "All types",
    alertSubmit: "Enable alert",
    alertSubmitting: "Saving…",
    alertSuccess: "Alert saved.",
    alertError: "Check city and email.",
    listingsTitle: "My submissions",
  },
  es: {
    eyebrow: "Espacio actor",
    title: "Mis fichas Green",
    intro:
      "Siga sus fichas de actor y anuncios — revisión AUROS en 48 h laborables.",
    signIn: "Inicie sesión para ver sus fichas.",
    empty: "Sin fichas por ahora — registre su actor para el mapa mundial tras la revisión.",
    register: "Registrar mi actor",
    alertsTitle: "Alertas geográficas",
    alertsIntro:
      "Reciba un e-mail cuando se publique un actor cerca de una ciudad (radio 5–20 km).",
    alertCity: "Ciudad de referencia",
    alertRadius: "Radio",
    alertType: "Tipo de actor (opcional)",
    alertTypeAll: "Todos",
    alertSubmit: "Activar alerta",
    alertSubmitting: "Guardando…",
    alertSuccess: "Alerta registrada.",
    alertError: "Verifique ciudad y e-mail.",
    listingsTitle: "Mis envíos",
  },
} as const;

const ACTOR_TYPES: GreenMarketActorType[] = [
  "producer",
  "storer",
  "charger",
  "consumer",
];

export function GreenMyView() {
  const { locale } = useLocale();
  const { isSignedIn, isLoaded } = useUser();
  const copy = COPY[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];
  const statusLabels = STATUS_LABEL[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const [listings, setListings] = useState<MyGreenMarketListing[]>([]);
  const [alerts, setAlerts] = useState<GreenMarketAlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertCity, setAlertCity] = useState("");
  const [alertRadius, setAlertRadius] = useState<GreenMarketRadiusKm>(20);
  const [alertType, setAlertType] = useState<GreenMarketActorType | "">("");
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await getGreenMyDashboardAction();
    if ("error" in data) {
      setLoading(false);
      return;
    }
    setListings(data.listings);
    setAlerts(data.alerts);
    setLoading(false);
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    void refresh();
  }, [isLoaded, refresh]);

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertFeedback(null);
    startTransition(async () => {
      const result = await saveGreenMarketAlertAction({
        city: alertCity,
        radiusKm: alertRadius,
        actorType: alertType,
      });
      if (result.ok) {
        setAlertFeedback(copy.alertSuccess);
        setAlertCity("");
        await refresh();
      } else {
        setAlertFeedback(copy.alertError);
      }
    });
  };

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-500/60">
        {copy.eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-medium text-emerald-400">{copy.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-400">{copy.intro}</p>

      {!isLoaded || loading ? (
        <p className="mt-10 text-sm text-neutral-500">…</p>
      ) : !isSignedIn ? (
        <GreenPanel className="mt-10 p-8 text-center">
          <p className="text-sm text-neutral-400">{copy.signIn}</p>
          <Link
            href="/sign-in?redirect_url=/green/my"
            className={`${greenBtnClass} mt-6 inline-flex`}
          >
            Sign in
          </Link>
        </GreenPanel>
      ) : (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider text-emerald-500">
              {copy.listingsTitle}
            </h2>
            {listings.length === 0 ? (
              <div className="mt-4 rounded-xl border border-emerald-500/25 bg-black p-6">
                <p className="text-sm text-neutral-400">{copy.empty}</p>
                <Link
                  href={GREEN_REGISTER_ROUTE}
                  className={`${greenBtnClass} mt-4 inline-flex`}
                >
                  {copy.register}
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {listings.map((item) => (
                  <li
                    key={`${item.table}-${item.id}`}
                    className="rounded-xl border border-emerald-500/25 bg-black p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-emerald-300">{item.name}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {item.kind} · {formatGreenMarketLocation(item.city, item.country)} ·{" "}
                          {item.detail}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-500/40 px-3 py-1 text-xs text-emerald-400">
                        {statusLabels[item.status as keyof typeof statusLabels] ??
                          item.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={GREEN_MARKET_ROUTE}
              className="mt-4 inline-block text-xs uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
            >
              {locale === "fr" ? "Place de marché →" : "Marketplace →"}
            </Link>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider text-emerald-500">
              {copy.alertsTitle}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">{copy.alertsIntro}</p>
            <form
              onSubmit={handleAlertSubmit}
              className="mt-4 rounded-xl border border-emerald-500/25 bg-black p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-500/50">
                    {copy.alertCity}
                  </span>
                  <input
                    required
                    value={alertCity}
                    onChange={(e) => setAlertCity(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 text-sm text-emerald-200 outline-none focus:border-emerald-400"
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-emerald-500/50">
                    {copy.alertRadius}
                  </span>
                  <select
                    value={alertRadius}
                    onChange={(e) =>
                      setAlertRadius(Number(e.target.value) as GreenMarketRadiusKm)
                    }
                    className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 text-sm text-emerald-200 outline-none"
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-emerald-500/50">
                    {copy.alertType}
                  </span>
                  <select
                    value={alertType}
                    onChange={(e) =>
                      setAlertType(e.target.value as GreenMarketActorType | "")
                    }
                    className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 text-sm text-emerald-200 outline-none"
                  >
                    <option value="">{copy.alertTypeAll}</option>
                    {ACTOR_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="submit"
                disabled={pending}
                className={`${greenBtnClass} mt-6 disabled:opacity-50`}
              >
                {pending ? copy.alertSubmitting : copy.alertSubmit}
              </button>
              {alertFeedback ? (
                <p className="mt-3 text-xs text-emerald-500/80" role="status">
                  {alertFeedback}
                </p>
              ) : null}
            </form>
            {alerts.length > 0 ? (
              <ul className="mt-4 space-y-2 text-xs text-neutral-500">
                {alerts.map((a) => (
                  <li key={a.id}>
                    {a.city} · {a.radiusKm} km
                    {a.actorType ? ` · ${a.actorType}` : ""}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      )}

      <GreenBackLink href="/green">← Hub Green</GreenBackLink>
    </div>
  );
}
