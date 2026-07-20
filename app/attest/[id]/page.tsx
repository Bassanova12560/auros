import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import {
  getAttestationById,
  verifyAttestSignature,
} from "@/lib/protocol/attest";

import { AttestCopyLink } from "./_components/AttestCopyLink";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function shortHash(hash: string): string {
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const record = await getAttestationById(decodeURIComponent(id));
  if (!record) {
    return {
      title: "Attestation not found | AUROS",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `Readiness Attestation ${record.id} | AUROS`,
    description: `AUROS MiCA readiness attestation — score ${record.public.score}, grade ${record.public.grade}.`,
    robots: { index: false, follow: false },
  };
}

export default async function AttestVerifyPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const record = await getAttestationById(id);
  if (!record) notFound();

  const valid = verifyAttestSignature(record.content_hash, record.signature);
  const issued = (() => {
    try {
      return new Date(record.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return record.created_at;
    }
  })();

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <BezelCard innerClassName="p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          AUROS Protocol
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">
          Readiness Attestation
        </h1>
        <p
          className={`mt-2 font-mono text-xs uppercase tracking-wider ${
            valid ? "text-emerald-400/90" : "text-red-400/90"
          }`}
        >
          {valid ? "Signature valid" : "Signature invalid"}
        </p>

        <dl className="mt-10 space-y-5">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Attestation ID
            </dt>
            <dd className="mt-1 font-mono text-sm text-white/85">{record.id}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Score / grade
            </dt>
            <dd className="mt-1 text-lg text-white">
              {record.public.score} · {record.public.grade}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Status
            </dt>
            <dd className="mt-1 text-white/75">{record.public.status}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              MiCA classification
            </dt>
            <dd className="mt-1 text-white/75">{record.public.mica_classification}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Issued
            </dt>
            <dd className="mt-1 text-white/75">{issued}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Content hash (SHA-256)
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-white/60">
              {record.content_hash}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Signature
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-white/60">
              {shortHash(record.signature)}
            </dd>
          </div>
        </dl>

        <p className="mt-10 text-sm leading-relaxed text-white/45">{record.disclaimer}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <AttestCopyLink attestId={record.id} />
          <Link
            href={`/verify?id=${encodeURIComponent(record.id)}`}
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            Verify public
          </Link>
          <Link
            href={`/api/v1/attest/verify?id=${encodeURIComponent(record.id)}`}
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            JSON verify API
          </Link>
          <Link
            href="/developers/docs/endpoint-attest"
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            Documentation
          </Link>
          <Link
            href="/developers"
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            Developers
          </Link>
        </div>
      </BezelCard>
    </div>
  );
}

export function generateStaticParams() {
  return [];
}
