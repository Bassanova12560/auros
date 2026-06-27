import type { GreenCompareRow } from "../compare-data";
import type { GreenProjectType } from "../constants";
import type { WizardData } from "@/lib/wizard-types";

import { GREEN_WIZARD_ASSET_TYPE } from "../constants";

export type WattScoreResult = {
  /** 0–100 credibility / energy-value rating for catalog rows. */
  rating: number;
  /** Estimated lifetime energy (GWh) when capacity inputs exist. */
  lifetime_gwh: number | null;
  /** Estimated energy value (EUR) at reference price. */
  energy_value_eur: number | null;
  tier: "high" | "mid" | "early";
};

export type WattScoreInputs = {
  capacity_mw?: number;
  sun_hours_per_year?: number;
  life_years?: number;
  energy_price_eur_per_kwh?: number;
  /** Battery: MWh capacity × cycles × spread. */
  capacity_mwh?: number;
  cycles?: number;
  spread_eur_per_kwh?: number;
};

const DEFAULTS: Record<
  Exclude<GreenProjectType, "carbon" | "other">,
  WattScoreInputs
> = {
  solar: {
    capacity_mw: 10,
    sun_hours_per_year: 1800,
    life_years: 20,
    energy_price_eur_per_kwh: 0.15,
  },
  wind: {
    capacity_mw: 15,
    sun_hours_per_year: 3200,
    life_years: 20,
    energy_price_eur_per_kwh: 0.12,
  },
  rec: {
    capacity_mw: 5,
    sun_hours_per_year: 2000,
    life_years: 15,
    energy_price_eur_per_kwh: 0.08,
  },
  ppa: {
    capacity_mw: 8,
    sun_hours_per_year: 1900,
    life_years: 15,
    energy_price_eur_per_kwh: 0.11,
  },
};

function tierFromRating(rating: number): WattScoreResult["tier"] {
  if (rating >= 75) return "high";
  if (rating >= 55) return "mid";
  return "early";
}

export function computeWattScoreFromInputs(
  inputs: WattScoreInputs
): Pick<WattScoreResult, "lifetime_gwh" | "energy_value_eur"> {
  const mw = inputs.capacity_mw ?? 0;
  const hours = inputs.sun_hours_per_year ?? 0;
  const years = inputs.life_years ?? 0;
  const price = inputs.energy_price_eur_per_kwh ?? 0;

  if (inputs.capacity_mwh && inputs.cycles && inputs.spread_eur_per_kwh) {
    const kwh = inputs.capacity_mwh * 1000 * inputs.cycles;
    const gwh = kwh / 1_000_000;
    const value = kwh * inputs.spread_eur_per_kwh;
    return { lifetime_gwh: Math.round(gwh * 10) / 10, energy_value_eur: Math.round(value) };
  }

  if (mw <= 0 || hours <= 0 || years <= 0) {
    return { lifetime_gwh: null, energy_value_eur: null };
  }

  const kwh = mw * 1000 * hours * years;
  const gwh = kwh / 1_000_000;
  const value = kwh * price;
  return {
    lifetime_gwh: Math.round(gwh * 10) / 10,
    energy_value_eur: Math.round(value),
  };
}

function ratingForCompareRow(row: GreenCompareRow): number {
  const taxonomy = row.green_taxonomy_score ?? 50;
  const text = `${row.impactNote} ${row.yieldNote}`.toLowerCase();

  if (row.type === "carbon") return Math.max(20, Math.min(45, taxonomy - 15));

  let rating = taxonomy * 0.85;

  if (/mwh|kwh|gwh|production|traceability|matched|pv|solar|renewable/.test(text)) {
    rating += 8;
  }
  if (/verify|certified|guarantee of origin|guarantie/.test(text)) {
    rating += 5;
  }
  if (/historical|legacy|high risk|variable/.test(text)) {
    rating -= 10;
  }

  if (row.type === "solar") rating += 4;
  if (row.type === "rec") rating += 2;

  return Math.max(0, Math.min(100, Math.round(rating)));
}

export function computeWattScoreForCompareRow(row: GreenCompareRow): WattScoreResult | null {
  if (row.type === "carbon" || row.type === "other") return null;

  const defaults = DEFAULTS[row.type as keyof typeof DEFAULTS];
  const energy = defaults ? computeWattScoreFromInputs(defaults) : { lifetime_gwh: null, energy_value_eur: null };
  const rating = ratingForCompareRow(row);

  return {
    rating,
    lifetime_gwh: energy.lifetime_gwh,
    energy_value_eur: energy.energy_value_eur,
    tier: tierFromRating(rating),
  };
}

export function parseCapacityMwFromText(text: string): number | undefined {
  const mw = text.match(/(\d+(?:[.,]\d+)?)\s*mw\b/i);
  if (mw) return Number.parseFloat(mw[1]!.replace(",", "."));
  const mwh = text.match(/(\d+(?:[.,]\d+)?)\s*mwh\b/i);
  if (mwh) return Number.parseFloat(mwh[1]!.replace(",", ".")) / 1000;
  return undefined;
}

export function computeWattScoreForWizard(data: WizardData): WattScoreResult | null {
  const text = [
    data.description,
    data.additionalNotes,
    data.incomeDescription,
    data.assetType,
  ]
    .filter(Boolean)
    .join(" ");

  const lower = text.toLowerCase();
  const isEnergy =
    data.assetType === GREEN_WIZARD_ASSET_TYPE ||
    /solar|solaire|éolien|wind|hydro|mwh|kwh|rec|ppa|renewable|renouvelable|megapack|battery|batterie/.test(
      lower
    );

  if (!isEnergy) return null;

  const capacityMw = parseCapacityMwFromText(text) ?? 10;
  const isBattery = /megapack|battery|batterie|mwh|storage|stockage/.test(lower);

  const inputs: WattScoreInputs = isBattery
    ? {
        capacity_mwh: parseCapacityMwFromText(text) ? parseCapacityMwFromText(text)! * 4 : 100,
        cycles: 3000,
        spread_eur_per_kwh: 0.08,
      }
    : {
        capacity_mw: capacityMw,
        sun_hours_per_year: /éolien|wind/.test(lower) ? 3200 : 1800,
        life_years: 20,
        energy_price_eur_per_kwh: 0.14,
      };

  const energy = computeWattScoreFromInputs(inputs);
  let rating = 45;
  if (/ppa|contrat|offtake/.test(lower)) rating += 15;
  if (/mwh|kwh|production|meter|compteur/.test(lower)) rating += 12;
  if (data.country?.trim()) rating += 5;
  if (data.documents?.filter((d) => d !== "none").length >= 2) rating += 8;
  rating = Math.max(0, Math.min(100, rating));

  return {
    rating,
    lifetime_gwh: energy.lifetime_gwh,
    energy_value_eur: energy.energy_value_eur,
    tier: tierFromRating(rating),
  };
}

export function formatWattScoreDisplay(rating: number | null): string {
  if (rating == null) return "—";
  return String(rating);
}

export function formatLifetimeGwh(gwh: number | null): string {
  if (gwh == null) return "—";
  if (gwh >= 1000) return `${(gwh / 1000).toFixed(1)} TWh`;
  return `${gwh} GWh`;
}
