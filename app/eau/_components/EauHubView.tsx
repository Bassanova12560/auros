"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { MobilePageShell } from "@/app/_components/ui/MobilePageShell";
import { getEauHubCopy } from "@/lib/eau/i18n";
import {
  GREEN_IMPACT_REPORT_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_REGISTRY_ROUTE,
} from "@/lib/green/constants";

import { H2oReadinessChecker } from "./H2oReadinessChecker";

export function EauHubView() {
  const { locale } = useLocale();
  const copy = getEauHubCopy(locale);

  const monetizationLinks = [
    { href: "/comment-tokeniser/eau", label: copy.links.guide },
    { href: "/eau/chargeflow", label: "ChargeFlow CFU-W" },
    { href: GREEN_REGISTRY_ROUTE, label: copy.links.registry },
    { href: GREEN_LABEL_ROUTE, label: copy.links.label },
    { href: "/developers/docs/endpoint-green-h2o", label: copy.links.api },
    { href: "/data/terminal", label: copy.links.terminal },
    { href: "/eau/embed/docs", label: copy.links.embed },
    { href: GREEN_IMPACT_REPORT_ROUTE, label: copy.links.impact },
  ];

  return (
    <MobilePageShell width="3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/50">
        {copy.kicker}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {copy.h1}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-white/55">{copy.intro}</p>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.futureTitle}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{copy.futureBody}</p>
        <ul className="mt-5 space-y-3">
          {copy.pillars.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/65">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/40" />
              {item}
            </li>
          ))}
        </ul>
      </BezelCard>

      <div className="mt-6">
        <H2oReadinessChecker />
      </div>

      <BezelCard className="mt-6" innerClassName="p-6 md:p-8" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.passportTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{copy.passportBody}</p>
      </BezelCard>

      <BezelCard className="mt-4 border-white/[0.06]" innerClassName="p-6 md:p-8" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/60">
          {copy.revenueTitle}
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {monetizationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </BezelCard>

      <p className="mt-12 text-xs leading-relaxed text-white/35">
        {locale === "en"
          ? "Indicative only — not legal, tax or investment advice."
          : locale === "es"
            ? "Solo indicativo — no es asesoramiento legal, fiscal ni de inversión."
            : "Indicatif uniquement — pas un conseil juridique, fiscal ou d'investissement."}
      </p>
    </MobilePageShell>
  );
}
