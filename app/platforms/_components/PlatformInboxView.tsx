"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { triagePlatformDossierAction } from "@/lib/actions/platform-pipeline";
import type { PlatformInboxRow } from "@/lib/actions/platform-pipeline";
import type { DossierStatus } from "@/lib/dossier-status";

type Props = {
  partnerCode: string | null;
  rows: PlatformInboxRow[];
  error?: string | null;
};

const TRIAGE: { status: DossierStatus; label: string }[] = [
  { status: "in_review", label: "In review" },
  { status: "needs_info", label: "Needs info" },
  { status: "approved", label: "Approved" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PlatformInboxView({ partnerCode, rows, error }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function onTriage(id: string, status: DossierStatus) {
    setBusyId(id);
    setMsg(null);
    startTransition(async () => {
      const res = await triagePlatformDossierAction(id, status);
      setBusyId(null);
      if (!res.ok) {
        setMsg(res.message ?? res.error);
        return;
      }
      router.refresh();
    });
  }

  if (!partnerCode) {
    return (
      <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
        <BezelCard innerClassName="p-6 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            Issuer Pipeline
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white">
            Platform inbox
          </h1>
          <p className="mt-4 text-sm text-white/55">
            No active platform tenant for this account. Ask AUROS ops to activate
            your partner with <code className="text-white/70">kind=platform</code>.
          </p>
          <Link
            href="/partners"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-wider text-white/45 underline-offset-4 hover:text-white hover:underline"
          >
            Partners →
          </Link>
        </BezelCard>
      </div>
    );
  }

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          Issuer Pipeline
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-white">
          Admission inbox
        </h1>
        <p className="mt-2 font-mono text-xs text-white/50">
          Platform · {partnerCode}
        </p>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-300/80">{error}</p>
      ) : null}
      {msg ? <p className="mb-4 text-sm text-amber-200/80">{msg}</p> : null}

      {rows.length === 0 ? (
        <BezelCard innerClassName="p-6">
          <p className="text-sm text-white/55">
            No submitted dossiers yet for this platform.
          </p>
        </BezelCard>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.id}>
              <BezelCard innerClassName="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                      {row.status}
                    </p>
                    <p className="mt-1 text-lg text-white">
                      {row.asset_type ?? "Asset"} · score {row.score ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Admission {row.admissionPercent ?? "—"}% · submitted{" "}
                      {formatDate(row.submitted_at)}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-white/30">
                      {row.id}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRIAGE.map((t) => (
                      <button
                        key={t.status}
                        type="button"
                        disabled={pending || busyId === row.id || row.status === t.status}
                        onClick={() => onTriage(row.id, t.status)}
                        className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:border-white/30 hover:text-white disabled:opacity-40"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </BezelCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
