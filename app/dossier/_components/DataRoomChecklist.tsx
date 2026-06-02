"use client";

import { useMemo, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { computeDataRoomEase } from "@/lib/data-room-ease";
import { getDataRoomEaseMessages } from "@/lib/data-room-ease-i18n";
import {
  documentPhaseProgress,
  normalizeDocumentIds,
  type RwaDocumentId,
} from "@/lib/rwa-document-phases";
import { rwaPhaseCopy } from "@/lib/rwa-document-phases-i18n";
import { getDossierMessages } from "@/lib/dossier-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";

import { DataRoomEasePanel } from "./DataRoomEasePanel";
import { DataRoomUpload } from "./DataRoomUpload";

export function DataRoomChecklist({
  documents,
  dossierId,
  canUpload,
}: {
  documents: string[];
  dossierId?: string;
  canUpload?: boolean;
}) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const easeM = getDataRoomEaseMessages(locale);
  const [listOpen, setListOpen] = useState(false);
  const held = useMemo(
    () => normalizeDocumentIds(documents),
    [documents]
  );
  const ease = useMemo(
    () => computeDataRoomEase(documents, locale),
    [documents, locale]
  );
  const phases = useMemo(() => documentPhaseProgress(held), [held]);
  const heldSet = new Set(held);

  return (
    <section className="border-b border-white/[0.06] py-8">
      <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
        {dm.dataRoom.title}
      </p>
      <p className="mb-6 text-sm text-white/60">{dm.dataRoom.subtitle}</p>

      <DataRoomEasePanel summary={ease} />

      {canUpload && !dossierId ? (
        <p className="mb-4 text-xs text-amber-400/90">{dm.dataRoom.upload.signIn}</p>
      ) : null}

      <button
        type="button"
        onClick={() => setListOpen((o) => !o)}
        className="mb-5 font-mono text-[10px] uppercase tracking-wider text-white/45 underline-offset-4 transition hover:text-white/70 hover:underline"
      >
        {listOpen ? easeM.listHide : easeM.listToggle}
      </button>

      {listOpen ? (
        <div className="space-y-5">
          {phases.map(({ phase, held: h, total, percent }) => {
            const copy = rwaPhaseCopy(locale, phase.id);
            return (
              <div
                key={phase.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{copy.title}</p>
                    <p className="mt-0.5 text-xs text-white/50">{copy.subtitle}</p>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-white/70">
                    {h}/{total} · {percent}%
                  </span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-500/70 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {phase.documents.map((d) => (
                    <li
                      key={d.id}
                      className={`flex items-center gap-2 text-xs ${
                        heldSet.has(d.id as RwaDocumentId)
                          ? "text-emerald-400/90"
                          : "text-white/40"
                      }`}
                    >
                      <span>{heldSet.has(d.id as RwaDocumentId) ? "✓" : "○"}</span>
                      {wizardOptionLabel(locale, "documents", d.id)}
                    </li>
                  ))}
                  {canUpload && dossierId
                    ? phase.documents.map((d) => (
                        <li key={`up-${d.id}`} className="ml-5 list-none">
                          <DataRoomUpload
                            dossierId={dossierId}
                            documentId={d.id as RwaDocumentId}
                          />
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
