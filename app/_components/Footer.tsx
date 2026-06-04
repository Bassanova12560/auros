"use client";

import Link from "next/link";

import { useTranslations } from "./i18n/LocaleProvider";

import { COMPARATOR_ROUTES } from "@/lib/comparators";

export function Footer() {
  const t = useTranslations();
  const f = t.footer;
  const year = new Date().getFullYear();

  const product = [
    { href: "/estimate", label: t.nav.score },
    { href: "/wizard", label: t.nav.tokenize },
    { href: "/how-it-works", label: "How it works" },
    { href: "/discover", label: "Discover" },
    { href: "/trust", label: "Trust" },
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
    { href: "/faq", label: "FAQ" },
    { href: "/ressources", label: "Resources" },
    { href: "/about", label: "About" },
    { href: "/terms", label: f.terms },
    { href: "/privacy", label: f.privacy },
    { href: "/legal", label: f.legalNotice },
  ] as const;

  const linkClass =
    "interactive-subtle text-sm text-white/55 hover:text-white/90";

  return (
    <footer className="auros-divider px-6 py-12 md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.35em] text-white">
            AUROS
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{f.tagline}</p>
        </div>
        <div className="flex gap-12 sm:gap-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              {f.product}
            </p>
            <ul className="mt-3 space-y-1.5">
              {product.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              {f.legal}
            </p>
            <ul className="mt-3 space-y-1.5">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl font-mono text-[10px] text-white/28">
        © {year} {f.rights}
      </p>
    </footer>
  );
}
