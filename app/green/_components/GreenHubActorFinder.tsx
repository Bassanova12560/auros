"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { GreenMarketActor, GreenMarketActorType } from "@/lib/green/market/types";
import { getGreenMessages } from "@/lib/green";

import { GreenSectionTitle } from "./green-ui";

type Props = {
  actors: GreenMarketActor[];
};

export function GreenHubActorFinder({ actors }: Props) {
  const { locale } = useLocale();
  const h = getGreenMessages(locale).hub;

  const counts = actors.reduce(
    (acc, a) => {
      acc[a.type] = (acc[a.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<GreenMarketActorType, number>
  );

  const countryCount = new Set(actors.map((a) => a.country.trim()).filter(Boolean)).size;

  return (
    <section aria-labelledby="green-actor-finder">
      <GreenSectionTitle>{h.find.title}</GreenSectionTitle>
      <p id="green-actor-finder" className="mt-3 max-w-2xl text-base leading-relaxed text-white/55">{h.find.intro}</p>
      {countryCount > 1 ? (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
          {h.find.countriesLabel(countryCount)}
        </p>
      ) : null}

      <div className="mt-8 grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
        {h.actors.map((item) => {
          const count = counts[item.id] ?? 0;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col justify-between bg-black px-5 py-6 transition-colors hover:bg-white/[0.02] md:px-6 md:py-7"
            >
              <div>
                <p className="font-display text-lg font-semibold tracking-[-0.02em] text-white group-hover:text-accent">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{item.description}</p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wide text-white/35">
                  {h.find.countLabel(count)}
                </span>
                <span className="font-mono text-sm text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
