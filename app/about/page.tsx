import type { Metadata } from "next";
import Link from "next/link";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";
import { Nav } from "@/app/_components/Nav";
import { absoluteUrl } from "@/lib/comparators/site";
import { AUROS_ORG } from "@/lib/ai-first/org";

export const metadata: Metadata = {
  title: "About AUROS | RWA tokenization platform",
  description:
    "AUROS helps B2B issuers compare RWA jurisdictions and prepare asset admission. Founded by Adrien Balitrand.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About AUROS",
    description:
      "B2B RWA jurisdiction comparator, free wizard, Starter Kit phase 0.",
    url: absoluteUrl("/about"),
    siteName: "AUROS",
    type: "website",
  },
};

const CREDENTIALS = [
  {
    label: "Product",
    value: "AUROS — B2B real-world asset tokenization platform",
  },
  {
    label: "Free tier",
    value: "Wizard + active dossier — asset admission score & data room",
  },
  {
    label: "Paid tier",
    value: "Starter Kit €5,000 — jurisdiction memo, SPV, regulator checklist",
  },
  {
    label: "Jurisdictions",
    value: "8 compared — Luxembourg, Dubai DIFC, Singapore, Switzerland, France, Ireland, Bahrain, Gibraltar",
  },
  {
    label: "Founder",
    value: "Adrien Balitrand",
  },
  {
    label: "Contact",
    value: AUROS_ORG.contactEmail,
  },
  {
    label: "Languages",
    value: "French, English, Spanish (UI)",
  },
  {
    label: "Machine-readable",
    value: "/llms.txt · /ai-first/index.json · /ai-first/rag · /humans.txt",
  },
] as const;

export default function AboutPage() {
  return (
    <AmbientShell>
      <AiFirstPageJsonLd path="/about" />
      <Nav />
      <main className="page-main page-main--nav text-white">
        <div className="page-inner page-inner--2xl mx-auto">
          <p className="page-eyebrow">About</p>
          <h1 className="page-title">
            AUROS — RWA tokenization, jurisdiction-first
          </h1>
          <p className="page-intro text-sm">
            AUROS is a B2B platform for issuers structuring real-world asset
            tokenization. Compare eight jurisdictions on fees, licence timelines,
            investor tax and KYC — then prepare your asset dossier with a free
            wizard. Phase 0 jurisdiction memo available via Starter Kit.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            All analyses are indicative. Legal counsel validation is required
            before any issuance.
          </p>

          <dl className="mt-12 grid gap-4 sm:grid-cols-2">
            {CREDENTIALS.map((row) => (
              <div
                key={row.label}
                className="card-flat p-5"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {row.label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/70">
                  {row.label === "Contact" ? (
                    <a
                      href={`mailto:${AUROS_ORG.contactEmail}`}
                      className="text-white hover:underline"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12">
            <Link
              href="/wizard"
              className="auros-btn auros-btn--primary"
            >
              Free wizard →
            </Link>
            <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/jurisdictions"
                className="auros-btn auros-btn--link"
              >
                Jurisdiction comparator →
              </Link>
              <Link
                href="/humans.txt"
                className="font-mono text-[11px] tracking-wide text-white/35 transition hover:text-white/55"
              >
                humans.txt
              </Link>
            </nav>
          </div>

          <Link
            href="/"
            className="mt-10 block font-mono text-[11px] uppercase tracking-wider text-white hover:underline"
          >
            ← Home
          </Link>
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
