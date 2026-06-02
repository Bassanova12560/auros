"use client";

import Link from "next/link";

import { useTranslations } from "./i18n/LocaleProvider";

import { COMPARATOR_ROUTES } from "@/lib/comparators";

export function Footer() {
  const t = useTranslations();
  const f = t.footer;
  const year = new Date().getFullYear();

  const product = [
    { href: "#score", label: t.nav.score },
    { href: "/wizard", label: t.nav.tokenize },
    { href: "/dashboard", label: t.nav.dossiers },
    { href: COMPARATOR_ROUTES.compare, label: "Compare all RWA yields" },
    { href: "/jurisdictions", label: "Jurisdiction comparator" },
    { href: COMPARATOR_ROUTES.stablecoins, label: "Stablecoins RWA" },
    { href: COMPARATOR_ROUTES.realEstate, label: "Real estate RWA" },
    { href: COMPARATOR_ROUTES.bonds, label: "Bonds RWA" },
    { href: COMPARATOR_ROUTES.commodities, label: "Commodities RWA" },
    { href: COMPARATOR_ROUTES.privateCredit, label: "Private credit RWA" },
    { href: "/partners", label: t.nav.partners },
  ] as const;

  const legal = [
    { href: "/academy", label: "AUROS Academy" },
    { href: "/green", label: "AUROS Green" },
    { href: "/about", label: "About" },
    { href: "/terms", label: f.terms },
    { href: "/privacy", label: f.privacy },
    { href: "/legal", label: f.legalNotice },
  ] as const;

  return (
    <footer className="border-t border-white/[0.06] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.35em] text-white">
            AUROS
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">{f.tagline}</p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="font-mono text-[10px] text-white/35">{f.product}</p>
            <ul className="mt-4 space-y-2">
              {product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] text-white/35">{f.legal}</p>
            <ul className="mt-4 space-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl font-mono text-[10px] text-white/30">
        © {year} {f.rights}
      </p>
    </footer>
  );
}
