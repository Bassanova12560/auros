"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveGreenMarketActorAction } from "@/lib/actions/green-market-actor";
import type { GreenMarketActorType, GreenMarketEnergyType } from "@/lib/green/market/types";
import { GREEN_MARKET_ROUTE } from "@/lib/green/constants";
import { getGreenMessages } from "@/lib/green/i18n";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";

import { GreenFieldLabel, GreenFormStepBar, GreenPanel, greenBtnClass } from "../green-ui";

const ACTOR_TYPES: GreenMarketActorType[] = ["producer", "storer", "charger", "consumer"];
const ENERGY_TYPES: GreenMarketEnergyType[] = ["solar", "wind", "hydro", "battery", "mixed"];

export function GreenActorRegisterForm() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const gm = getGreenMessages(locale);
  const r = gm.register.form;
  const market = getGreenMarketMessages(locale).market;

  const [pending, startTransition] = useTransition();
  const [type, setType] = useState<GreenMarketActorType>("producer");

  useEffect(() => {
    const param = searchParams.get("type");
    if (param && ACTOR_TYPES.includes(param as GreenMarketActorType)) {
      setType(param as GreenMarketActorType);
    }
  }, [searchParams]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [capacityKwh, setCapacityKwh] = useState("");
  const [pricePerKwh, setPricePerKwh] = useState("");
  const [energyType, setEnergyType] = useState<GreenMarketEnergyType>("solar");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const inputClass =
    "green-form-input w-full rounded-lg px-4 py-3 text-sm text-white outline-none";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setRateLimited(false);
    const cap = Number(capacityKwh);
    const price = pricePerKwh.trim() ? Number(pricePerKwh) : undefined;
    if (!Number.isFinite(cap)) return;

    startTransition(async () => {
      const result = await saveGreenMarketActorAction({
        type,
        name,
        city,
        country,
        region: region || undefined,
        description,
        contactEmail,
        capacityKwh: cap,
        pricePerKwh: price,
        energyType,
      });
      if (result.ok) {
        setDone(true);
        return;
      }
      if (result.error === "rate_limit") {
        setError(true);
        setRateLimited(true);
        return;
      }
      setRateLimited(false);
      setError(true);
    });
  }

  if (done) {
    return (
      <GreenPanel className="space-y-3 p-6 text-center md:p-8">
        <div className="text-2xl text-green-royal-bright" aria-hidden>
          ✓
        </div>
        <p className="font-display text-lg font-medium text-white">
          {locale === "fr"
            ? "Demande reçue"
            : locale === "es"
              ? "Solicitud recibida"
              : "Request received"}
        </p>
        <p className="text-sm text-white/55">
          {locale === "fr"
            ? "L'équipe AUROS Green reviendra vers vous sous 48h ouvrées pour confirmer la publication de votre fiche sur la carte."
            : locale === "es"
              ? "El equipo AUROS Green se pondrá en contacto en 48 horas laborables para confirmar la publicación de su ficha en el mapa."
              : "The AUROS Green team will get back to you within 48 business hours to confirm publishing your profile on the map."}
        </p>
        <Link
          href={GREEN_MARKET_ROUTE}
          className="inline-block text-sm text-green-royal-bright underline underline-offset-4 transition hover:text-white"
        >
          {locale === "fr"
            ? "Voir la place de marché →"
            : locale === "es"
              ? "Ver el marketplace →"
              : "View marketplace →"}
        </Link>
      </GreenPanel>
    );
  }

  const typeLabels: Record<GreenMarketActorType, string> = {
    producer: gm.hub.actors.find((a) => a.id === "producer")?.title ?? "Producer",
    storer: gm.hub.actors.find((a) => a.id === "storer")?.title ?? "Storer",
    charger: gm.hub.actors.find((a) => a.id === "charger")?.title ?? "Charger",
    consumer: gm.hub.actors.find((a) => a.id === "consumer")?.title ?? "Consumer",
  };

  const registerStepLabel = r.stepOf(1, 1);

  const sectionTitle =
    locale === "fr"
      ? "Vos informations"
      : locale === "es"
        ? "Sus datos"
        : "Your details";

  return (
    <GreenPanel>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 md:p-8">
        <GreenFormStepBar current={1} total={1} label={registerStepLabel} />
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-white">
          {sectionTitle}
        </h2>
        <p className="text-sm text-white/45">{r.introHint}</p>
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {rateLimited ? r.errorRateLimit : r.errorInvalid}
          </p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <GreenFieldLabel>{r.type}</GreenFieldLabel>
            <select
              className={`mt-2 ${inputClass}`}
              value={type}
              onChange={(e) => setType(e.target.value as GreenMarketActorType)}
              disabled={pending}
            >
              {ACTOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <GreenFieldLabel>{r.name}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{r.city}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{r.country}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={pending}
              placeholder={
                locale === "fr"
                  ? "ex. France, Maroc, États-Unis"
                  : locale === "es"
                    ? "ej. España, Marruecos, Estados Unidos"
                    : "e.g. France, Morocco, United States"
              }
            />
          </label>
          <label className="block md:col-span-2">
            <GreenFieldLabel>{r.region}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={pending}
            />
          </label>
          <label className="block md:col-span-2">
            <GreenFieldLabel>{r.description}</GreenFieldLabel>
            <textarea
              className={`mt-2 min-h-[100px] resize-y ${inputClass}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={20}
              disabled={pending}
            />
          </label>
          <label className="block md:col-span-2">
            <GreenFieldLabel>{r.contactEmail}</GreenFieldLabel>
            <input
              type="email"
              className={`mt-2 ${inputClass}`}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{r.capacityKwh}</GreenFieldLabel>
            <input
              type="number"
              min={1}
              className={`mt-2 ${inputClass}`}
              value={capacityKwh}
              onChange={(e) => setCapacityKwh(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{r.pricePerKwh}</GreenFieldLabel>
            <input
              type="number"
              min={0}
              step={0.001}
              className={`mt-2 ${inputClass}`}
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              disabled={pending}
            />
          </label>
          <label className="block md:col-span-2">
            <GreenFieldLabel>{r.energyType}</GreenFieldLabel>
            <select
              className={`mt-2 ${inputClass}`}
              value={energyType}
              onChange={(e) => setEnergyType(e.target.value as GreenMarketEnergyType)}
              disabled={pending}
            >
              {ENERGY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {market.energyTypes[t]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`green-btn-primary mt-2 w-full rounded-lg px-6 py-3.5 text-sm font-semibold disabled:opacity-50 sm:w-auto ${greenBtnClass}`}
        >
          {pending ? r.submitting : r.submit}
        </button>
      </form>
    </GreenPanel>
  );
}
