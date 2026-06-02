"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveGreenMarketOfferAction } from "@/lib/actions/green-market-offer";
import { resolveCityCoordinates } from "@/lib/green/market/geo";
import {
  createLocalOfferId,
  writeStoredGreenMarketOffer,
} from "@/lib/green/market/offers-storage";
import type {
  GreenMarketEnergyType,
  GreenMarketOffer,
  GreenMarketOfferSide,
} from "@/lib/green/market/types";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";

import { GreenFieldLabel, GreenPanel, greenBtnClass } from "../green-ui";

type Props = {
  onPublished: (offer: GreenMarketOffer) => void;
  dbAvailable: boolean;
};

export function GreenOfferForm({ onPublished, dbAvailable }: Props) {
  const router = useRouter();
  const { locale } = useLocale();
  const m = getGreenMarketMessages(locale).market;
  const f = m.form;
  const [pending, startTransition] = useTransition();

  const [actorName, setActorName] = useState("");
  const [side, setSide] = useState<GreenMarketOfferSide>("sell");
  const [energyType, setEnergyType] = useState<GreenMarketEnergyType>("solar");
  const [volumeKwh, setVolumeKwh] = useState("");
  const [pricePerKwh, setPricePerKwh] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-lg border border-white/[0.12] bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const vol = Number(volumeKwh);
    const price = Number(pricePerKwh);
    const cityTrim = city.trim();
    const countryTrim = country.trim();
    if (
      !actorName.trim() ||
      !cityTrim ||
      !countryTrim ||
      !Number.isFinite(vol) ||
      !Number.isFinite(price)
    ) {
      return;
    }

    const coords = resolveCityCoordinates(cityTrim, countryTrim);
    const base = {
      actorName: actorName.trim(),
      side,
      volumeKwh: vol,
      pricePerKwh: price,
      energyType,
      city: cityTrim,
      country: countryTrim,
      lat: coords.lat,
      lon: coords.lon,
    };

    startTransition(async () => {
      if (dbAvailable) {
        const result = await saveGreenMarketOfferAction({
          actorName: base.actorName,
          side: base.side,
          energyType: base.energyType,
          volumeKwh: base.volumeKwh,
          pricePerKwh: base.pricePerKwh,
          city: base.city,
          country: base.country,
          contactEmail: contactEmail.trim() || undefined,
        });

        if (result.ok) {
          router.refresh();
          setSuccess(result.pending ? f.successPending : f.success);
          setActorName("");
          setVolumeKwh("");
          setPricePerKwh("");
          setCity("");
          setContactEmail("");
          setTimeout(() => setSuccess(null), 6000);
          return;
        }

        if (result.error === "rate_limit") {
          setError(m.form.errorRateLimit);
          return;
        }
        if (result.error !== "database") {
          setError(m.form.errorInvalid);
          return;
        }
      }

      const offer: GreenMarketOffer = {
        id: createLocalOfferId(),
        actorId: "local",
        actorName: base.actorName,
        side: base.side,
        volumeKwh: base.volumeKwh,
        pricePerKwh: base.pricePerKwh,
        energyType: base.energyType,
        lat: base.lat,
        lon: base.lon,
        city: base.city,
        country: base.country,
        createdAt: new Date().toISOString(),
        status: "available",
        listingTier: "referenced",
      };
      writeStoredGreenMarketOffer(offer);
      onPublished(offer);
      setSuccess(f.success);
      setActorName("");
      setVolumeKwh("");
      setPricePerKwh("");
      setCity("");
      setCountry("");
      setContactEmail("");
      setTimeout(() => setSuccess(null), 4000);
    });
  }

  return (
    <GreenPanel>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 md:p-8">
        <div>
          <p className="font-display text-lg font-semibold text-white">{m.formTitle}</p>
          <p className="mt-2 text-sm text-muted">
            {dbAvailable ? m.formNoteDb : m.formNote}
          </p>
        </div>
        {success ? (
          <p className="text-sm text-green-royal-bright">{success}</p>
        ) : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <GreenFieldLabel>{f.actorName}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{f.side}</GreenFieldLabel>
            <select
              className={`mt-2 ${inputClass}`}
              value={side}
              onChange={(e) => setSide(e.target.value as GreenMarketOfferSide)}
              disabled={pending}
            >
              <option value="sell">{m.sides.sell}</option>
              <option value="buy">{m.sides.buy}</option>
            </select>
          </label>
          <label className="block">
            <GreenFieldLabel>{f.energyType}</GreenFieldLabel>
            <select
              className={`mt-2 ${inputClass}`}
              value={energyType}
              onChange={(e) => setEnergyType(e.target.value as GreenMarketEnergyType)}
              disabled={pending}
            >
              {(["solar", "wind", "hydro", "battery", "mixed"] as const).map((t) => (
                <option key={t} value={t}>
                  {m.energyTypes[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <GreenFieldLabel>{f.volumeKwh}</GreenFieldLabel>
            <input
              type="number"
              min={1}
              className={`mt-2 ${inputClass}`}
              value={volumeKwh}
              onChange={(e) => setVolumeKwh(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{f.pricePerKwh}</GreenFieldLabel>
            <input
              type="number"
              min={0}
              step={0.001}
              className={`mt-2 ${inputClass}`}
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{f.city}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block">
            <GreenFieldLabel>{f.country}</GreenFieldLabel>
            <input
              className={`mt-2 ${inputClass}`}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={pending}
            />
          </label>
          <label className="block md:col-span-2">
            <GreenFieldLabel>{f.contactEmail}</GreenFieldLabel>
            <input
              type="email"
              className={`mt-2 ${inputClass}`}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              disabled={pending}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`rounded-lg px-6 py-3 text-sm font-medium disabled:opacity-50 ${greenBtnClass}`}
        >
          {pending ? f.submitting : f.submit}
        </button>
      </form>
    </GreenPanel>
  );
}
