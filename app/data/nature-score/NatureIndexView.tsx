"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_COMPARE_ROUTE } from "@/lib/green/constants";
import {
  downloadNatureIndexCsv,
  natureIndexToCsv,
  type NatureIndexPayload,
} from "@/lib/green/nature-index";

type Props = {
  payload: NatureIndexPayload;
};

export function NatureIndexView({ payload }: Props) {
  function handleDownload() {
    const csv = natureIndexToCsv(payload);
    downloadNatureIndexCsv(csv, payload.editionIso);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-emerald-500/20">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-emerald-500/30 font-mono text-[10px] uppercase tracking-wide text-emerald-500/80">
              <th className="px-4 py-3 font-normal">#</th>
              <th className="px-4 py-3 font-normal">Actif</th>
              <th className="px-4 py-3 font-normal">Nature</th>
              <th className="px-4 py-3 font-normal">CQS</th>
              <th className="px-4 py-3 font-normal">Écosystème</th>
            </tr>
          </thead>
          <tbody>
            {payload.entries.map((e) => (
              <tr key={e.id} className="border-b border-white/[0.04] text-white/80">
                <td className="px-4 py-3 font-mono text-emerald-400/90">{e.rank}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`${GREEN_COMPARE_ROUTE}?rwa=${encodeURIComponent(e.id)}`}
                    className="hover:text-emerald-400"
                  >
                    {e.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-emerald-400">
                  {e.nature_score}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-white/60">
                  {e.cqs ?? "—"}
                </td>
                <td className="px-4 py-3 text-white/50">{e.ecosystem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <PrimaryButton type="button" onClick={handleDownload}>
          Télécharger CSV
        </PrimaryButton>
        <Link
          href="/data/green-index"
          className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
        >
          Green Index →
        </Link>
        <Link
          href="/green/api"
          className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
        >
          API Nature Score →
        </Link>
        <Link
          href={GREEN_COMPARE_ROUTE}
          className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
        >
          Comparateur Green →
        </Link>
      </div>

      <p className="text-center text-xs text-white/40">{payload.methodologyNote}</p>
    </>
  );
}
