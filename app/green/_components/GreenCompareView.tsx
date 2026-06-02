"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_COMPARE_ROWS,
  GREEN_ROUTE,
  AUROS_COMPARE_ROUTE,
  GREEN_REGISTRY_ROUTE,
  getGreenMessages,
  greenVerifyPath,
} from "@/lib/green";
import type { GreenRegistryProjectRow } from "@/lib/green/green-registry";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
  GreenTierBadge,
} from "./green-ui";

type Props = {
  registryProjects: GreenRegistryProjectRow[];
};

function labelBadgeClass(status: string): string {
  switch (status) {
    case "certified":
      return "border-emerald-400 text-emerald-400";
    case "in_review":
      return "border-neutral-500 text-neutral-400";
    case "reference":
      return "border-neutral-600 text-neutral-500";
    default:
      return "border-neutral-700 text-neutral-500";
  }
}

export function GreenCompareView({ registryProjects }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const c = m.compare;
  const r = m.registry;
  const rows = GREEN_COMPARE_ROWS;

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} compact />
      <p className="mt-4 max-w-3xl border-l border-emerald-500/40 pl-5 text-xs leading-relaxed text-neutral-500">
        {c.disclaimer}
      </p>

      {registryProjects.length > 0 ? (
        <GreenPanel className="mt-10">
          <div className="p-6 md:p-8">
            <GreenSectionTitle>{c.registrySectionTitle}</GreenSectionTitle>
            <p className="mt-3 text-sm text-neutral-400">{c.registrySectionIntro}</p>
            <ul className="mt-6 divide-y divide-emerald-500/20">
              {registryProjects.map((proj) => (
                <li
                  key={proj.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-emerald-400">{proj.name}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {c.projectTypes[proj.projectType]} · {proj.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <GreenTierBadge
                      tier={proj.labelTier}
                      verifiedLabel={r.tierVerified}
                      pilotLabel={r.tierPilot}
                    />
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
          </div>
        </GreenPanel>
      ) : null}

      <GreenPanel className="mt-10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-500 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
                <th className="px-6 py-4 pr-4">{c.table.project}</th>
                <th className="py-4 pr-4">{c.table.type}</th>
                <th className="py-4 pr-4">{c.table.token}</th>
                <th className="py-4 pr-4">{c.table.yield}</th>
                <th className="py-4 pr-4">{c.table.impact}</th>
                <th className="py-4 pr-4">{c.table.label}</th>
                <th className="px-6 py-4">{c.table.source}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-neutral-500">
                    {c.emptyNote}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-emerald-500/20 text-neutral-300"
                  >
                    <td className="px-6 py-4 pr-4 font-medium text-emerald-400">{row.name}</td>
                    <td className="py-4 pr-4 text-neutral-400">{c.projectTypes[row.type]}</td>
                    <td className="py-4 pr-4 font-mono text-xs text-neutral-400">{row.token}</td>
                    <td className="py-4 pr-4 text-xs text-neutral-500">{row.yieldNote}</td>
                    <td className="py-4 pr-4 text-xs text-neutral-500">{row.impactNote}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block rounded border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wide ${labelBadgeClass(row.labelStatus)}`}
                      >
                        {c.labelStatus[row.labelStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-400"
                      >
                        {row.sourceLabel}
                      </a>
                      <p className="mt-1 font-mono text-[9px] text-neutral-600">
                        {c.table.reviewed}: {row.lastReviewed}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GreenPanel>

      <div className="mt-8 flex flex-wrap gap-6">
        <Link
          href={AUROS_COMPARE_ROUTE}
          className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
        >
          {c.aurosCompareCta} →
        </Link>
        <Link
          href={GREEN_REGISTRY_ROUTE}
          className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
        >
          {c.registryCta} →
        </Link>
      </div>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{c.backLink}</GreenBackLink>
    </div>
  );
}
