"use client";

import Link from "next/link";

import { getNavHub } from "@/lib/nav-hub";

import { useLocale } from "./i18n/LocaleProvider";

/** Full product map — /discover and hub navigation depth. */
export function DiscoverHubMap() {
  const { locale } = useLocale();
  const hub = getNavHub(locale);

  return (
    <section className="border-b border-white/[0.06] px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {locale === "en"
            ? "AUROS map"
            : locale === "es"
              ? "Mapa AUROS"
              : "Carte AUROS"}
        </p>
        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
          {locale === "en"
            ? "The full extent — five doors"
            : locale === "es"
              ? "Toda la extensión — cinco puertas"
              : "Toute l’étendue — cinq portes"}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/50">
          {locale === "en"
            ? "Same structure as the header hub: dossier, energy, protocol, ecosystem, company."
            : locale === "es"
              ? "Misma estructura que el hub del header: expediente, energía, protocol, ecosistema, empresa."
              : "Même structure que le hub du header : dossier, énergie, protocol, écosystème, entreprise."}
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
          {hub.groups.map((group) => (
            <div key={group.id}>
              <p className="font-display text-base text-white">{group.label}</p>
              <p className="mt-1 text-xs text-white/40">{group.blurb}</p>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group block rounded-lg border border-transparent px-2 py-1.5 hover:border-white/10 hover:bg-white/[0.03]"
                    >
                      <span className="text-sm text-white/85 group-hover:text-white">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-white/40">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
