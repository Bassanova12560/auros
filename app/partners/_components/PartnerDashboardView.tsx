"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { getPartnersMessages } from "@/lib/partners-i18n";
import type { PartnerRecord, PartnerStats } from "@/lib/partners/types";

import { PartnerCopyLink } from "./PartnerCopyLink";

type Props =
  | { state: "none" }
  | { state: "pending"; partner: PartnerRecord }
  | {
      state: "active";
      partner: PartnerRecord;
      stats: PartnerStats;
      wizardUrl: string;
    };

export function PartnerDashboardView(props: Props) {
  const { locale } = useLocale();
  const m = getPartnersMessages(locale);
  const d = m.dashboard;

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <BezelCard innerClassName="p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {d.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">
          {d.title}
        </h1>

        {props.state === "none" ? (
          <div className="mt-8 space-y-3">
            <h2 className="text-lg text-white/90">{d.notPartnerTitle}</h2>
            <p className="text-sm leading-relaxed text-white/55">{d.notPartnerBody}</p>
            <Link
              href="/partners#contact"
              className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-white/60 underline-offset-4 hover:text-white hover:underline"
            >
              /partners
            </Link>
          </div>
        ) : null}

        {props.state === "pending" ? (
          <div className="mt-8 space-y-3">
            <h2 className="text-lg text-white/90">{d.pendingTitle}</h2>
            <p className="text-sm leading-relaxed text-white/55">{d.pendingBody}</p>
            <p className="font-mono text-xs text-white/40">
              {props.partner.company} · {props.partner.email}
            </p>
          </div>
        ) : null}

        {props.state === "active" ? (
          <div className="mt-8 space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                {d.codeLabel}
              </p>
              <p className="mt-2 font-mono text-xl text-white">{props.partner.code}</p>
              <p className="mt-1 text-sm text-white/50">{props.partner.company}</p>
            </div>

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {d.linkLabel}
              </p>
              <PartnerCopyLink
                value={props.wizardUrl}
                copyLabel={d.copyLink}
                copiedLabel={d.copied}
              />
            </div>

            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {d.leads}
                </dt>
                <dd className="mt-1 text-2xl text-white">{props.stats.leads}</dd>
              </div>
              <div className="rounded-lg border border-white/10 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {d.dossiers}
                </dt>
                <dd className="mt-1 text-2xl text-white">{props.stats.dossiers}</dd>
              </div>
              <div className="rounded-lg border border-white/10 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {d.total}
                </dt>
                <dd className="mt-1 text-2xl text-white">{props.stats.total}</dd>
              </div>
            </dl>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                {d.commission}
              </p>
              <p className="mt-1 text-sm text-white/60">{d.commissionEstimated}</p>
              <a
                href="/api/partners/payouts-export"
                className="mt-3 inline-block font-mono text-[11px] uppercase tracking-wider text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                Export compta CSV (estimé)
              </a>
            </div>
          </div>
        ) : null}

        <Link
          href="/partners"
          className="mt-10 inline-block font-mono text-xs uppercase tracking-wider text-white/45 underline-offset-4 hover:text-white hover:underline"
        >
          {d.back}
        </Link>
      </BezelCard>
    </div>
  );
}
