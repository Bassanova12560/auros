"use client";

import Link from "next/link";

import { getNavHub } from "@/lib/nav-hub";

import { useLocale, useTranslations } from "./i18n/LocaleProvider";

export function Footer() {
  const t = useTranslations();
  const { locale } = useLocale();
  const hub = getNavHub(locale);
  const f = t.footer;
  const year = new Date().getFullYear();

  const legal = [
    { href: "/legal", label: f.legalNotice },
    { href: "/terms", label: f.terms },
    { href: "/privacy", label: f.privacy },
    { href: "/press", label: "Press" },
    { href: "/why", label: "Why Auros" },
    { href: "/watt", label: "WATT" },
    { href: "/status", label: "Status" },
    { href: "/builders", label: "Builders" },
    { href: "/lab", label: "Energy Lab" },
    { href: "/trust", label: f.trust },
    { href: "/security", label: "Sécurité" },
    { href: "/about", label: f.about },
  ] as const;

  const linkClass =
    "interactive-subtle block py-1 text-sm text-white/55 hover:text-white/90";

  return (
    <footer className="auros-divider px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-xs shrink-0">
            <p className="font-display text-sm font-semibold tracking-[0.35em] text-white">
              AUROS
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.tagline}</p>
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/35">
              Jurisdiction posture: EU-facing operations · imprint &amp; entity pack on written
              request via{" "}
              <Link href="/legal" className="text-white/55 hover:text-white/80">
                /legal
              </Link>
              {" · "}
              <Link href="/press" className="text-white/55 hover:text-white/80">
                /press
              </Link>
              <br />
              <a href="mailto:resources@getauros.com" className="text-white/55 hover:text-white/80">
                resources@getauros.com
              </a>
              {" · "}
              <a href="mailto:legal@auros.app" className="text-white/55 hover:text-white/80">
                legal@auros.app
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/start"
                className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:border-white/40"
              >
                {hub.primaryCta}
              </Link>
              <Link
                href="/developers/shield"
                className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/45 hover:text-white/70"
              >
                {hub.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {hub.groups.map((group) => (
              <div key={group.id}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {group.label}
                </p>
                <ul className="mt-3 space-y-0.5">
                  {group.items.slice(0, 5).map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={linkClass}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-mono text-[10px] uppercase tracking-wider text-white/35 hover:text-white/60"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[10px] text-white/28">
            © {year} {f.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
