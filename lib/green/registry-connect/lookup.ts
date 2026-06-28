import {
  computeCarbonQualityFromProfile,
  type CarbonQualityScore,
} from "@/lib/green/scoring/carbon-quality";
import type { CarbonQualityProfile } from "@/lib/green/scoring/carbon-profiles";
import { computeIcvcmReadiness, type IcvcmReadiness } from "@/lib/green/scoring/icvcm-readiness";
import {
  computeNatureScoreFromProfile,
  inferNatureProfileFromText,
  type NatureScoreResult,
} from "@/lib/green/scoring/nature-score";
import { lookupGreenScoreById } from "@/lib/green/api/score-lookup";

import { findRegistryCatalogEntry } from "./catalog";
import { fetchVerraProjectLive, providerSupportsLiveFetch } from "./fetch-verra";
import { fetchGoldStandardProjectLive, providerSupportsGoldStandardLive } from "./fetch-gold-standard";
import { parseRegistryConnectInput, type ParsedRegistryQuery } from "./parse-query";
import type {
  RegistryConnectLookupInput,
  RegistryConnectLookupResult,
  RegistryConnectMatchKind,
  RegistryConnectProvider,
} from "./types";

export type RegistryConnectScores = {
  carbon_quality: CarbonQualityScore;
  nature_score: NatureScoreResult | null;
  icvcm_readiness: IcvcmReadiness | null;
  unified_compare: ReturnType<typeof lookupGreenScoreById>;
};

export type RegistryConnectResponse = RegistryConnectLookupResult & {
  scores: RegistryConnectScores;
  methodology_note: string;
};

function registryUrls(provider: RegistryConnectProvider, serial: string) {
  const num = serial.replace(/^[A-Z]+-?/i, "");
  if (provider === "verra") {
    return {
      project: `https://registry.verra.org/app/projectDetail/VCS/${num}`,
      retirements: `https://registry.verra.org/app/search?query=${encodeURIComponent(serial)}`,
    };
  }
  if (provider === "gold_standard") {
    return {
      project: `https://registry.goldstandard.org/projects/details/${num}`,
      retirements: `https://registry.goldstandard.org/credits?q=${encodeURIComponent(serial)}`,
    };
  }
  if (provider === "puro") {
    return {
      project: "https://puro.earth/projects",
      retirements: "https://puro.earth/credits",
    };
  }
  return { project: null, retirements: null };
}

function profileFromProviderAndContext(
  provider: RegistryConnectProvider,
  description: string,
  projectType: string
): CarbonQualityProfile {
  const t = description.toLowerCase();
  const isNature = /redd|forest|nature|amazon|biodivers|conservation/.test(t);
  const isCdr = /rock weathering|cdr|removal|puro/.test(t);

  const registryMap: Record<RegistryConnectProvider, CarbonQualityProfile["registry"]> = {
    verra: "verra",
    gold_standard: "gold_standard",
    puro: "puro",
    other: "other",
  };

  return {
    registry: registryMap[provider],
    ccp_aligned:
      provider === "gold_standard"
        ? true
        : provider === "verra" && isNature
          ? "partial"
          : provider === "puro"
            ? "partial"
            : "unknown",
    additionality:
      projectType === "cookstove" || projectType === "renewable"
        ? "strong"
        : isNature
          ? "moderate"
          : "unknown",
    permanence: isCdr ? "strong" : isNature ? "moderate" : "unknown",
    vintage_risk: /2024|2025|2026/.test(t) ? "low" : "medium",
    on_chain_wrapper: false,
  };
}

function mapProjectType(raw: string | null): string {
  if (!raw) return "other";
  const t = raw.toLowerCase();
  if (/forest|redd|afolu/.test(t)) return "forestry";
  if (/renewable|solar|wind/.test(t)) return "renewable";
  if (/cookstove|energy/.test(t)) return "cookstove";
  if (/soil|agric/.test(t)) return "soil";
  return "other";
}

async function resolveContext(parsed: ParsedRegistryQuery): Promise<{
  match: RegistryConnectMatchKind;
  result: RegistryConnectLookupResult;
  profile: CarbonQualityProfile;
  natureText: string;
}> {
  const catalog = findRegistryCatalogEntry(parsed.provider, parsed.serial);
  const urls = catalog?.registry_project_url
    ? {
        project: catalog.registry_project_url,
        retirements: registryUrls(parsed.provider, parsed.serial).retirements,
      }
    : registryUrls(parsed.provider, parsed.serial);

  if (catalog) {
    const profile = profileFromProviderAndContext(
      catalog.provider,
      catalog.description,
      catalog.project_type
    );
    return {
      match: "catalog",
      result: {
        match: "catalog",
        provider: catalog.provider,
        serial: catalog.serial,
        project_name: catalog.project_name,
        country: catalog.country,
        vintage_year: catalog.vintage_year,
        compare_id: catalog.compare_id ?? null,
        registry_urls: urls,
      },
      profile,
      natureText: catalog.description,
    };
  }

  if (providerSupportsLiveFetch(parsed.provider)) {
    const live = await fetchVerraProjectLive(parsed.serial);
    if (live) {
      const projectType = mapProjectType(live.project_type);
      const profile = profileFromProviderAndContext(
        parsed.provider,
        live.description,
        projectType
      );
      return {
        match: "live",
        result: {
          match: "live",
          provider: parsed.provider,
          serial: parsed.serial,
          project_name: live.project_name,
          country: live.country,
          vintage_year: null,
          compare_id: null,
          registry_urls: urls,
        },
        profile,
        natureText: live.description,
      };
    }
  }

  if (providerSupportsGoldStandardLive(parsed.provider)) {
    const live = await fetchGoldStandardProjectLive(parsed.serial);
    if (live) {
      const projectType = mapProjectType(live.project_type);
      const profile = profileFromProviderAndContext(
        parsed.provider,
        live.description,
        projectType
      );
      return {
        match: "live",
        result: {
          match: "live",
          provider: parsed.provider,
          serial: parsed.serial,
          project_name: live.project_name,
          country: live.country,
          vintage_year: null,
          compare_id: null,
          registry_urls: urls,
        },
        profile,
        natureText: live.description,
      };
    }
  }

  const description = `${parsed.provider} ${parsed.serial} carbon credit project`;
  const profile = profileFromProviderAndContext(parsed.provider, description, "other");

  return {
    match: "inferred",
    result: {
      match: "inferred",
      provider: parsed.provider,
      serial: parsed.serial,
      project_name: `${parsed.serial} (inferred)`,
      country: null,
      vintage_year: null,
      compare_id: null,
      registry_urls: urls,
    },
    profile,
    natureText: description,
  };
}

export async function lookupRegistryConnect(
  input: RegistryConnectLookupInput
): Promise<
  { ok: true; data: RegistryConnectResponse } | { ok: false; code: string; message: string }
> {
  const parsed = parseRegistryConnectInput(input);
  if (!parsed) {
    return {
      ok: false,
      code: "invalid_query",
      message:
        "Provide serial (e.g. VCS-674), registry+serial, or q= with Verra/Gold Standard reference",
    };
  }

  const { match, result, profile, natureText } = await resolveContext(parsed);
  const carbon_quality = computeCarbonQualityFromProfile(profile);

  const natureProfile = inferNatureProfileFromText(natureText);
  const nature_score = /redd|forest|nature|biodivers|soil|rock weathering/i.test(natureText)
    ? computeNatureScoreFromProfile(natureProfile)
    : null;

  const unified_compare = result.compare_id ? lookupGreenScoreById(result.compare_id) : null;

  return {
    ok: true,
    data: {
      ...result,
      match,
      scores: {
        carbon_quality,
        nature_score,
        icvcm_readiness: computeIcvcmReadiness(carbon_quality, profile),
        unified_compare,
      },
      methodology_note:
        match === "live"
          ? "Registry Connect v1 — live Verra registry data + AUROS CQS. Verify retirement before procurement."
          : "Registry Connect — indicative AUROS mapping. Verify retirement on official registry before procurement.",
    },
  };
}

export async function resolveRegistrySerialText(
  text: string
): Promise<Awaited<ReturnType<typeof lookupRegistryConnect>>> {
  return lookupRegistryConnect({ q: text });
}

export { parseRegistryConnectInput, parseRegistryQuery } from "./parse-query";
export { findRegistryCatalogEntry, listRegistryConnectSerials, REGISTRY_CONNECT_CATALOG } from "./catalog";
export { fetchVerraProjectLive } from "./fetch-verra";
