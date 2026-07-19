import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import {
  getChargeflowById,
  verifyChargeflowSignatureForId,
} from "@/lib/chargeflow";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function shortHash(hash: string): string {
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const record = await getChargeflowById(decodeURIComponent(id));
  if (!record) {
    return {
      title: "ChargeFlow unit not found | AUROS",
      robots: { index: false, follow: false },
    };
  }
  const kind = record.unit_kind === "w" ? "CFU-W" : "CFU-E";
  const detail =
    record.unit_kind === "w"
      ? `${record.public.volume_m3 ?? "—"} m³`
      : `${record.public.energy_kwh ?? "—"} kWh`;
  return {
    title: `ChargeFlow ${record.id} | AUROS`,
    description: `AUROS ${kind} — ${detail}, status ${record.status}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ChargeflowVerifyPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const record = await getChargeflowById(id);
  if (!record) notFound();

  const valid = verifyChargeflowSignatureForId(
    record.id,
    record.content_hash,
    record.signature
  );
  const isW = record.unit_kind === "w";
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
          AUROS ChargeFlow
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">
          {isW ? "CFU-W Unit" : "CFU-E Unit"}
        </h1>
        <p className="mt-2 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider">
          <span className={valid ? "text-white/70" : "text-white/45"}>
            {valid ? "Signature valid" : "Signature invalid"}
          </span>
          <span
            className={
              record.status === "retired" ? "text-amber-400/80" : "text-emerald-400/80"
            }
          >
            {record.status === "retired" ? "Retired" : "Active"}
          </span>
        </p>

        <dl className="mt-10 space-y-5">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Unit ID
            </dt>
            <dd className="mt-1 font-mono text-sm text-white/85">{record.id}</dd>
          </div>
          {isW ? (
            <>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  Volume
                </dt>
                <dd className="mt-1 text-lg text-white">
                  {record.public.volume_m3} m³
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  H₂O companion
                </dt>
                <dd className="mt-1 text-white/75">
                  {record.public.h2o_rating ?? "—"}
                  {record.public.h2o_tier ? ` · ${record.public.h2o_tier}` : ""}
                  {record.public.h2o_asset_class
                    ? ` · ${record.public.h2o_asset_class}`
                    : ""}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  Flow
                </dt>
                <dd className="mt-1 font-mono text-sm text-white/75">
                  {record.public.external_flow_id}
                </dd>
              </div>
            </>
          ) : (
            <>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  Energy
                </dt>
                <dd className="mt-1 text-lg text-white">
                  {record.public.energy_kwh} kWh
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  Watt companion
                </dt>
                <dd className="mt-1 text-white/75">
                  {record.public.watt_rating ?? "—"}
                  {record.public.watt_tier
                    ? ` · ${record.public.watt_tier}`
                    : ""}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  Session
                </dt>
                <dd className="mt-1 font-mono text-sm text-white/75">
                  {record.public.external_session_id}
                </dd>
              </div>
            </>
          )}
          {record.public.operator_id ? (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                Operator
              </dt>
              <dd className="mt-1 text-white/75">{record.public.operator_id}</dd>
            </div>
          ) : null}
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              Issued
            </dt>
            <dd className="mt-1 text-white/75">{issued}</dd>
          </div>
          {record.status === "retired" && record.retired_at ? (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                Retired
              </dt>
              <dd className="mt-1 text-white/75">
                {record.retired_at}
                {record.retire_reason ? ` — ${record.retire_reason}` : ""}
              </dd>
            </div>
          ) : null}
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

        <p className="mt-10 text-sm leading-relaxed text-white/45">
          {record.disclaimer}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={
              isW
                ? `/api/v1/chargeflow/w/verify?id=${encodeURIComponent(record.id)}`
                : `/api/v1/chargeflow/verify?id=${encodeURIComponent(record.id)}`
            }
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            JSON verify API
          </Link>
          <Link
            href={
              isW
                ? "/developers/docs/endpoint-chargeflow-w"
                : "/developers/docs/endpoint-chargeflow"
            }
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            Documentation
          </Link>
          <Link
            href={isW ? "/eau/chargeflow" : "/green/chargeflow"}
            className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            ChargeFlow
          </Link>
        </div>
      </BezelCard>
    </div>
  );
}

export function generateStaticParams() {
  return [];
}
