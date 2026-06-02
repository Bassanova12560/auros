import { getDataRoomEaseMessages } from "@/lib/data-room-ease-i18n";
import type { Locale } from "@/lib/i18n";
import {
  ALL_RWA_DOCUMENT_IDS,
  normalizeDocumentIds,
  RWA_DOCUMENT_WEIGHTS,
  type RwaDocumentId,
} from "@/lib/rwa-document-phases";

export type DataRoomEasePriority = {
  id: RwaDocumentId;
};

export type DataRoomEaseSummary = {
  headline: string;
  subline: string;
  heldCount: number;
  totalCount: number;
  percent: number;
  priorities: DataRoomEasePriority[];
  tone: "complete" | "progress" | "start";
};

export function computeDataRoomEase(
  rawDocuments: string[],
  locale: Locale
): DataRoomEaseSummary {
  const m = getDataRoomEaseMessages(locale);
  const held = normalizeDocumentIds(rawDocuments);
  const heldSet = new Set(held);
  const totalCount = ALL_RWA_DOCUMENT_IDS.length;
  const heldCount = held.length;
  const percent = totalCount
    ? Math.round((heldCount / totalCount) * 100)
    : 0;

  let tone: DataRoomEaseSummary["tone"] = "start";
  if (percent >= 70) tone = "complete";
  else if (percent >= 25 || heldCount >= 3) tone = "progress";

  const missing = ALL_RWA_DOCUMENT_IDS.filter((id) => !heldSet.has(id));
  missing.sort(
    (a, b) => (RWA_DOCUMENT_WEIGHTS[b] ?? 0) - (RWA_DOCUMENT_WEIGHTS[a] ?? 0)
  );

  const priorities: DataRoomEasePriority[] = missing.slice(0, 3).map((id) => ({
    id,
  }));

  return {
    headline: m.headlines[tone],
    subline: m.sublines[tone],
    heldCount,
    totalCount,
    percent,
    priorities,
    tone,
  };
}
