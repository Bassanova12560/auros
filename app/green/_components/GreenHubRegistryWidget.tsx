"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_REGISTRY_ROUTE, getGreenMessages } from "@/lib/green";

export type GreenHubRegistryStats = {
  verifiedCount: number;
  pilotCount: number;
  expertCount: number;
  latestVerifiedName?: string;
};

type Props = {
  stats: GreenHubRegistryStats;
};

export function GreenHubRegistryWidget({ stats }: Props) {
  const { locale } = useLocale();
  const w = getGreenMessages(locale).hub.widgets.registry;

  return (
    <div className="flex h-full flex-col p-6 md:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-green-royal-bright">
          {w.label}
        </p>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-royal opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-royal-bright" />
          </span>
          {w.live}
        </span>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-4">
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-wider text-white/40">
            {w.verified}
          </dt>
          <dd className="mt-1 font-display text-4xl font-semibold tabular-nums text-white">
            {stats.verifiedCount}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-wider text-white/40">
            {w.pilots}
          </dt>
          <dd className="mt-1 font-display text-4xl font-semibold tabular-nums text-white">
            {stats.pilotCount}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-wider text-white/40">
            {w.experts}
          </dt>
          <dd className="mt-1 font-display text-4xl font-semibold tabular-nums text-white">
            {stats.expertCount}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex-1 border-t border-white/[0.06] pt-5">
        <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
          {w.latestVerified}
        </p>
        <p className="mt-2 text-sm leading-snug text-white/60">
          {stats.latestVerifiedName ?? w.noneVerified}
        </p>
      </div>

      <Link
        href={GREEN_REGISTRY_ROUTE}
        className="mt-6 inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-green-royal-bright hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
      >
        {w.cta} →
      </Link>
    </div>
  );
}
