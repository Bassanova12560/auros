"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { GreenRegistrySnapshot } from "@/lib/green/green-registry";
import {
  GREEN_ROUTE,
  getGreenMessages,
  greenProjectSummary,
  greenVerifyPath,
} from "@/lib/green";
import {
  GREEN_REGISTRY_TIER_URL_PARAM,
  greenRegistryProjectPath,
  parseRegistryTierParam,
  type GreenRegistryTierFilter,
} from "@/lib/green/registry-routes";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
  GreenTierBadge,
} from "./green-ui";

type Props = {
  snapshot: GreenRegistrySnapshot;
};

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(
      locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR",
      { year: "numeric", month: "short", day: "numeric" }
    );
  } catch {
    return iso;
  }
}

const TIER_FILTERS: GreenRegistryTierFilter[] = ["all", "verified", "pilot"];

export function GreenRegistryView({ snapshot }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const r = m.registry;
  const c = m.compare;
  const { projects, experts, available } = snapshot;
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [tierFilter, setTierFilter] = useState<GreenRegistryTierFilter>(() =>
    parseRegistryTierParam(searchParams.get(GREEN_REGISTRY_TIER_URL_PARAM))
  );

  useEffect(() => {
    setTierFilter(parseRegistryTierParam(searchParams.get(GREEN_REGISTRY_TIER_URL_PARAM)));
  }, [searchParams]);

  const setTier = useCallback(
    (tier: GreenRegistryTierFilter) => {
      setTierFilter(tier);
      const params = new URLSearchParams(searchParams.toString());
      if (tier === "all") {
        params.delete(GREEN_REGISTRY_TIER_URL_PARAM);
      } else {
        params.set(GREEN_REGISTRY_TIER_URL_PARAM, tier);
      }
      const next = params.toString();
      if (next !== searchParams.toString()) {
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  const verifiedCount = projects.filter((p) => p.labelTier === "verified").length;
  const pilotCount = projects.filter((p) => p.labelTier === "pilot").length;

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((proj) => {
      if (tierFilter !== "all" && proj.labelTier !== tierFilter) return false;
      if (!q) return true;
      const hay = [
        proj.name,
        proj.country,
        c.projectTypes[proj.projectType],
        greenProjectSummary(proj, locale),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, searchQuery, tierFilter, c.projectTypes, locale]);

  const tierLabel = (tier: GreenRegistryTierFilter): string => {
    if (tier === "verified") return r.tierFilterVerified;
    if (tier === "pilot") return r.tierFilterPilot;
    return r.tierFilterAll;
  };

  const emptyMessage =
    searchQuery.trim().length > 0 ? r.searchEmpty : r.tierFilterEmpty;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={r.eyebrow} title={r.title} intro={r.intro} compact />
      {!available ? (
        <p className="mt-4 text-xs text-neutral-500">{r.statsUnavailable}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-wider text-emerald-500/70">
        <span className="rounded-full border border-emerald-500/30 px-3 py-1">
          {r.statsProjects(projects.length)}
        </span>
        <span className="rounded-full border border-emerald-500/30 px-3 py-1">
          {r.statsVerified(verifiedCount)}
        </span>
        <span className="rounded-full border border-emerald-500/30 px-3 py-1">
          {r.statsPilots(pilotCount)}
        </span>
        <span className="rounded-full border border-emerald-500/30 px-3 py-1">
          {r.statsExperts(experts.length)}
        </span>
      </div>

      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{r.projectsTitle}</GreenSectionTitle>
          {projects.length > 0 ? (
            <>
              <div
                className="mt-4 flex flex-wrap gap-2"
                role="tablist"
                aria-label={r.tierFilterAll}
              >
                {TIER_FILTERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    role="tab"
                    aria-selected={tierFilter === tier}
                    onClick={() => setTier(tier)}
                    className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                      tierFilter === tier
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                        : "border-emerald-500/30 text-emerald-500/70 hover:border-emerald-400/60 hover:text-emerald-400"
                    }`}
                  >
                    {tierLabel(tier)}
                  </button>
                ))}
              </div>
              <label className="mt-4 block max-w-md">
                <span className="sr-only">{r.searchPlaceholder}</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={r.searchPlaceholder}
                  className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 text-sm text-emerald-200 outline-none focus:border-emerald-400"
                />
              </label>
            </>
          ) : null}
          {projects.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">{r.projectsEmpty}</p>
          ) : filteredProjects.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">{emptyMessage}</p>
          ) : (
            <ul className="mt-6 divide-y divide-emerald-500/20">
              {filteredProjects.map((proj) => (
                <li key={proj.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={greenRegistryProjectPath(proj.id)}
                      className="font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      {proj.name}
                    </Link>
                    <GreenTierBadge
                      tier={proj.labelTier}
                      verifiedLabel={r.tierVerified}
                      pilotLabel={r.tierPilot}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    {c.projectTypes[proj.projectType]} · {proj.country} ·{" "}
                    {formatDate(proj.certifiedAt, locale)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                    {greenProjectSummary(proj, locale)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4">
                    <Link
                      href={greenRegistryProjectPath(proj.id)}
                      className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
                    >
                      {r.viewProject} →
                    </Link>
                    <Link
                      href={greenVerifyPath(proj.verifyToken)}
                      className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
                    >
                      {r.verifyLink} →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GreenPanel>

      <GreenPanel className="mt-4">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{r.expertsTitle}</GreenSectionTitle>
          {experts.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">{r.expertsEmpty}</p>
          ) : (
            <ul className="mt-6 divide-y divide-emerald-500/20">
              {experts.map((ex) => (
                <li
                  key={ex.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-neutral-300">{ex.displayName}</span>
                  <Link
                    href={greenVerifyPath(ex.verifyToken)}
                    className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
                  >
                    {r.verifyLink} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GreenPanel>

      <p className="mt-6 text-xs leading-relaxed text-neutral-600">{r.pilotNote}</p>
      <p className="mt-3 text-xs leading-relaxed text-neutral-600">{r.verifyNote}</p>
      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{r.backLink}</GreenBackLink>
    </div>
  );
}
