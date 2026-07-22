import type { Metadata } from "next";
import Link from "next/link";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";

export const metadata: Metadata = {
  title: "Enterprise Control Tower | AUROS Toll",
  description:
    "Console enterprise : Resolve, Policy, Monitoring, Audit, Rights, Wallet, Provenance — packagé pour banques et fonds.",
};

const MODULES = [
  {
    title: "Resolve",
    href: "/api/v1/toll/resolve",
    body: "Taxe DNS — lookup canonique + unknown risk",
  },
  {
    title: "Search / Research",
    href: "/api/v1/toll/search",
    body: "Retrieval + packs cités pour desks / IA",
  },
  {
    title: "Policy",
    href: "/green/toll/policy",
    body: "Allow / deny / review — pilote banque HITL",
  },
  {
    title: "Eligibility",
    href: "/green/toll/eligibility",
    body: "Router transactionnel — mint/buy/transfer/redeem (indicatif)",
  },
  {
    title: "Monitoring / Drift",
    href: "/api/v1/toll/drift",
    body: "MRR post-émission — stale, silent, docs",
  },
  {
    title: "Audit Export",
    href: "/api/v1/toll/audit-export",
    body: "Pack JSON audit-ready (indicatif)",
  },
  {
    title: "Rights Engine",
    href: "/api/v1/toll/rights",
    body: "Mapping droits programmable v0",
  },
  {
    title: "Wallet Risk",
    href: "/api/v1/toll/wallet-risk",
    body: "Attribution + behavioral flags indicatifs",
  },
  {
    title: "Source Attestation",
    href: "/api/v1/toll/sources",
    body: "Enrôlement sources — chaîne d’authenticité",
  },
  {
    title: "Event Certification",
    href: "/api/v1/toll/events",
    body: "Audit by query — maintenance, downtime, coupons (indicatif)",
  },
  {
    title: "Provenance Ledger",
    href: "/green/toll/provenance",
    body: "Raw vs derived — citation indicative auditors / IA",
  },
  {
    title: "Reality Reputation",
    href: "/green/toll/reputation",
    body: "Score opérationnel indicatif — issuers paient pour améliorer le signal",
  },
  {
    title: "Exception OS",
    href: "/green/toll/exceptions",
    body: "Cas sales — escalade / assignation / résolution HITL",
  },
  {
    title: "Red-Team Asset Layer",
    href: "/green/toll/red-team",
    body: "Revue adversariale — gaps docs / droits / mapping (indicatif)",
  },
  {
    title: "Recovery & Continuity",
    href: "/green/toll/continuity",
    body: "Playbooks HITL — source / opérateur / wallet / servicer / vendor",
  },
  {
    title: "Search Control Plane",
    href: "/green/toll/search-control",
    body: "Audience ranking + ACL indicatif + audit de recherche",
  },
  {
    title: "Red-Team Assets",
    href: "/green/toll/red-team",
    body: "Revue adversariale indicative — gaps docs / droits / mapping",
  },
  {
    title: "ZK / Selective Disclosure",
    href: "/green/toll/zk",
    body: "Stub v0 — claim + commitment SHA-256 (pas de circuits ZK)",
  },
];

export default function ControlTowerPage() {
  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Enterprise"
        title="AUROS Control Tower"
        intro="Package banque / fonds / plateforme : les 7 lignes de revenu Toll en une console. Contrats 100k–1M+ — contact HITL."
        compact
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {MODULES.map((m) => (
          <GreenPanel key={m.title}>
            <div className="p-5">
              <h2 className="font-display text-lg text-white">{m.title}</h2>
              <p className="mt-2 text-sm text-white/55">{m.body}</p>
              <Link
                href={m.href}
                className="mt-3 inline-block font-mono text-[11px] uppercase tracking-wider text-emerald-200/80 underline-offset-4 hover:underline"
              >
                Ouvrir →
              </Link>
            </div>
          </GreenPanel>
        ))}
      </div>
      <p className="mt-8 text-sm text-white/50">
        Tarification & SLA :{" "}
        <a
          href="mailto:hello@getauros.com"
          className="underline underline-offset-4"
        >
          hello@getauros.com
        </a>{" "}
        · packs cash{" "}
        <Link href="/green/toll" className="underline underline-offset-4">
          /green/toll
        </Link>
      </p>
      <GreenDisclaimer>
        Control Tower = packaging — pas d’auto-certification, pas de brokerage.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
