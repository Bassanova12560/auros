import type { GreenRegistrySnapshot } from "./green-registry";

/**
 * Indicative RTMS constants — documented on /green/standards.
 * Applied only when registry has published cases (no fake demo MWh/tCO₂).
 */
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
      carbonSavedTco2: 0,
      mwhTraced: 0,
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
