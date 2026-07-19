"use client";

import Link from "next/link";

import { useTranslations } from "./i18n/LocaleProvider";

export function Footer() {
  const t = useTranslations();
  const f = t.footer;
  const year = new Date().getFullYear();

  const product = [
    { href: "/estimate", label: t.nav.score },
    { href: "/wizard", label: t.nav.tokenize },
    { href: "/dashboard", label: t.nav.dossiers },
    { href: "/pricing", label: f.pricing },
  ] as const;

  const green = [
    { href: "/green", label: f.green },
    { href: "/eau", label: f.greenH2o },
    { href: "/green/api", label: f.greenApi },
    { href: "/green/dpp", label: f.greenDpp },
  ] as const;

  const legal = [
    { href: "/trust", label: f.trust },
    { href: "/about", label: f.about },
    { href: "/privacy", label: f.privacy },
    { href: "/terms", label: f.terms },
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
        <div className="flex flex-wrap gap-12 sm:gap-16">
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
              {f.greenColumn}
            </p>
            <ul className="mt-3 space-y-1.5">
              {green.map((l) => (
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
