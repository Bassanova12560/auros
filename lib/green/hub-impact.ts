import type { GreenRegistrySnapshot } from "./green-registry";

/** Fallback when registry has no published cases yet. */
export const GREEN_HUB_IMPACT_DEMO = {
  carbonSavedTco2: 12_480,
  mwhTraced: 847_200,
} as const;

/** Indicative RTMS constants — documented on /green/standards. */
const MWH_PER_REGISTRY_CASE = 12_400;
const TCO2_PER_MWH = 0.0147;

export type GreenHubImpact = {
  carbonSavedTco2: number;
  mwhTraced: number;
  /** true when derived from registry case count */
  fromRegistry: boolean;
  registryCaseCount: number;
};

export function computeGreenHubImpact(registry: GreenRegistrySnapshot): GreenHubImpact {
  const registryCaseCount = registry.projects.length;
  if (registryCaseCount === 0) {
    return {
      ...GREEN_HUB_IMPACT_DEMO,
      fromRegistry: false,
      registryCaseCount: 0,
    };
  }

  const mwhTraced = registryCaseCount * MWH_PER_REGISTRY_CASE;
  const carbonSavedTco2 = Math.round(mwhTraced * TCO2_PER_MWH);

  return {
    carbonSavedTco2,
    mwhTraced,
    fromRegistry: true,
    registryCaseCount,
  };
}

export function formatImpactNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(
    locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR"
  ).format(value);
}
