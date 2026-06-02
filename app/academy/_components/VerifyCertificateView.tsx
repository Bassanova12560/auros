"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AcademyDiplomaUpsell } from "@/app/academy/_components/AcademyDiplomaUpsell";
import {
  ACADEMY_ROUTE,
  renewalUrl,
  statusLabel,
  type AcademyCertificate,
} from "@/lib/academy";
import { formatCertDate, getAcademyMessages } from "@/lib/academy/i18n";
import type { CertificateStatus } from "@/lib/academy/types";

type Props = {
  cert: AcademyCertificate;
  status: CertificateStatus;
  legacy: boolean;
  hasDiploma: boolean;
  certToken: string;
};

export function VerifyCertificateView({ cert, status, legacy, hasDiploma, certToken }: Props) {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const v = m.verify;

  const tierName = m.tierNames[cert.tier];

  const issued = formatCertDate(locale, cert.issuedAt, "long");
  const expires = cert.expiresAt
    ? formatCertDate(locale, cert.expiresAt, "long")
    : v.expiresLegacy;
  const showRenew = status === "expired" || status === "renewal_due" || legacy;

  const statusTone =
    status === "active"
      ? "text-white/70"
      : status === "renewal_due"
        ? "text-white/55"
        : "text-white/45";

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <BezelCard innerClassName="p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {v.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">{v.title}</h1>
        <p className={`mt-2 font-mono text-xs uppercase tracking-wider ${statusTone}`}>
          {statusLabel(status, locale)}
        </p>

        <dl className="mt-10 space-y-5">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {v.holder}
            </dt>
            <dd className="mt-1 text-lg text-white">{cert.fullName}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {v.certification}
            </dt>
            <dd className="mt-1 text-white/75">{tierName}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {v.issuedOn}
            </dt>
            <dd className="mt-1 text-white/75">{issued}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {v.validUntil}
            </dt>
            <dd className="mt-1 text-white/75">{expires}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {v.integrity}
            </dt>
            <dd className="mt-1 text-white/75">
              {v.integrityLevel(
                cert.integrityLevel ?? 1,
                cert.curriculumVersion ?? "",
                cert.renewalGeneration ?? 0
              )}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {v.certId}
            </dt>
            <dd className="mt-1 font-mono text-sm text-white/60">{cert.id}</dd>
          </div>
        </dl>

        <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {v.scopeTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{v.scopeBody}</p>
        </div>

        {showRenew && (
          <div className="mt-10">
            <PrimaryButton href={renewalUrl(certToken)}>{v.renewCta}</PrimaryButton>
          </div>
        )}

        {cert.tier === "fundamentals" && (
          <AcademyDiplomaUpsell certToken={certToken} alreadyPurchased={hasDiploma} />
        )}

        <p className="mt-10 text-xs leading-relaxed text-white/35">{m.disclaimer}</p>
        <Link
          href={ACADEMY_ROUTE}
          className="mt-8 inline-block text-sm text-white/50 hover:text-white"
        >
          {v.backLink}
        </Link>
      </BezelCard>
    </div>
  );
}
