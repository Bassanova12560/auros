"use client";

/**
 * Renders the list of dossier cards for the dashboard. Server fetches the
 * rows, this client component handles all interactions:
 *
 *   - "Download PDF" lazy-loads @react-pdf/renderer and triggers a browser
 *     download — no network round-trip.
 *
 *   - "View dossier" hydrates localStorage.auros_dossier from the Supabase
 *     row so the /dossier preview can render the historical dossier without
 *     a route refactor.
 */

import { useRouter } from "next/navigation";
import { useCallback, useState, type CSSProperties } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { splitDossierDataBlob } from "@/lib/dossier-data";
import { importDossierIntoLocalSession } from "@/lib/wizard-resume";
import { getDashboardMessages } from "@/lib/dashboard-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import { tierFromScore } from "@/lib/score";
import {
  normalizeDossierStatus,
  type DossierStatus,
} from "@/lib/dossier-status";
import type { DossierData, StoredDossier } from "@/lib/pdf";

const MONO_FONT =
  '"Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const SERIF_FONT = '"Cormorant", Cormorant, Georgia, "Times New Roman", serif';
const RED = "#ff2d2d";

const DOSSIER_STORAGE_KEY = "auros_dossier";

export type DossierRow = {
  id: string;
  asset_type: string | null;
  data: Record<string, unknown>;
  score: number | null;
  status: DossierStatus;
  created_at: string;
};

export function DossierList({ dossiers }: { dossiers: DossierRow[] }) {
  return (
    <ul style={styles.list}>
      {dossiers.map((row) => (
        <li key={row.id} style={styles.item}>
          <DossierCard row={row} />
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------------
 * Card
 * ------------------------------------------------------------------------- */

type PdfState = "idle" | "generating" | "error";

function DossierCard({ row }: { row: DossierRow }) {
  const router = useRouter();
  const { locale } = useLocale();
  const dm = getDashboardMessages(locale).list;
  const [pdfState, setPdfState] = useState<PdfState>("idle");

  const score = row.score ?? 0;
  const tier = tierFromScore(score);

  const { wizard, aiContent, aiMeta } = splitDossierDataBlob(row.data);
  const data = wizard as DossierData;
  const rawType = (data?.assetType as string | undefined) || row.asset_type || "";
  const assetType = rawType
    ? wizardOptionLabel(locale, "assetTypes", rawType)
    : dm.untitled;
  const location = [data?.city, data?.country].filter(Boolean).join(", ");
  const dateLabel = formatDate(row.created_at, locale);

  /** Build the StoredDossier shape expected by /dossier and lib/pdf. */
  const toStored = useCallback((): StoredDossier => {
    return {
      generatedAt: row.created_at,
      score,
      tier: tier.tier,
      tierLabel: tier.label,
      data,
      aiContent,
      aiMeta,
      id: row.id,
    };
  }, [row.created_at, row.id, score, tier, data, aiContent, aiMeta]);

  const handleDownloadPDF = useCallback(async () => {
    setPdfState("generating");
    try {
      // Lazy-load to keep @react-pdf/renderer out of the dashboard's initial
      // bundle — it's a fairly heavy dependency.
      const { generateDossierPDF, suggestedFilename } = await import("@/lib/pdf");
      const stored = toStored();
      const blob = await generateDossierPDF({ ...stored, locale });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedFilename(stored);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setPdfState("idle");
    } catch (err) {
      console.error("[dashboard] failed to generate PDF", err);
      setPdfState("error");
    }
  }, [toStored]);

  const handleView = useCallback(() => {
    router.push(`/dossier/${row.id}`);
  }, [row.id, router]);

  const handleEditWizard = useCallback(() => {
    importDossierIntoLocalSession({
      id: row.id,
      data: row.data,
      score: row.score,
      created_at: row.created_at,
      asset_type: row.asset_type,
    });
    router.push("/wizard");
  }, [row, router]);

  return (
    <article style={styles.card} data-dashboard-card="">
      {/* Top row: identity + score */}
      <div style={styles.cardTop}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 style={styles.assetType}>{assetType}</h2>
          <p style={styles.meta}>
            {[location, dateLabel].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
        <ScoreBadge score={score} color={tier.color} ariaLabel={dm.scoreAria(score)} />
      </div>

      {/* Status pill */}
      <div style={styles.pillRow}>
        <StatusPill status={row.status} labels={dm.status} />
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={pdfState === "generating"}
          data-dashboard-cta=""
          data-variant="primary"
          style={{
            ...styles.actionPrimary,
            cursor: pdfState === "generating" ? "wait" : "pointer",
            opacity: pdfState === "generating" ? 0.7 : 1,
          }}
        >
          {pdfState === "generating"
            ? dm.downloadPdfGenerating
            : pdfState === "error"
              ? dm.downloadPdfRetry
              : dm.downloadPdf}
        </button>
        <button
          type="button"
          onClick={handleView}
          data-dashboard-cta=""
          data-variant="secondary"
          style={styles.actionSecondary}
        >
          {dm.viewDossier}
        </button>
        <button
          type="button"
          onClick={handleEditWizard}
          data-dashboard-cta=""
          data-variant="secondary"
          style={{ ...styles.actionSecondary, gridColumn: "1 / -1" }}
        >
          {dm.editWizard}
        </button>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
 * Score badge + status pill
 * ------------------------------------------------------------------------- */

function ScoreBadge({
  score,
  color,
  ariaLabel,
}: {
  score: number;
  color: string;
  ariaLabel: string;
}) {
  return (
    <div style={styles.scoreBadge} aria-label={ariaLabel}>
      <span
        style={{
          ...styles.scoreNumber,
          color,
        }}
      >
        {score}
      </span>
      <span style={styles.scoreSlash}>/100</span>
    </div>
  );
}

function StatusPill({
  status,
  labels,
}: {
  status: DossierRow["status"];
  labels: Record<DossierStatus, string>;
}) {
  const visuals = STATUS_VISUALS[status] ?? STATUS_VISUALS.draft;
  return (
    <span style={{ ...styles.pill, ...visuals.style }}>
      <span
        style={{
          ...styles.pillDot,
          background: visuals.dot,
        }}
        aria-hidden
      />
      {labels[status]}
    </span>
  );
}

const STATUS_VISUALS: Record<DossierStatus, { dot: string; style: CSSProperties }> = {
  draft: {
    dot: "rgba(255,255,255,0.45)",
    style: {
      borderColor: "rgba(255,255,255,0.2)",
      color: "rgba(255,255,255,0.7)",
    },
  },
  generated: {
    dot: "#ffffff",
    style: {
      borderColor: "rgba(255,255,255,0.4)",
      color: "#ffffff",
    },
  },
  submitted: {
    dot: "#22c55e",
    style: {
      borderColor: "rgba(34,197,94,0.45)",
      color: "#86efac",
    },
  },
  in_review: {
    dot: "#fbbf24",
    style: {
      borderColor: "rgba(251,191,36,0.4)",
      color: "#fde68a",
    },
  },
  needs_info: {
    dot: "#f97316",
    style: {
      borderColor: "rgba(249,115,22,0.4)",
      color: "#fdba74",
    },
  },
  approved: {
    dot: "#22c55e",
    style: {
      borderColor: "rgba(34,197,94,0.55)",
      color: "#bbf7d0",
    },
  },
};

/* ---------------------------------------------------------------------------
 * Formatting helpers
 * ------------------------------------------------------------------------- */

function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
    return d.toLocaleDateString(loc, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* ---------------------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------------------- */

const styles = {
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: 14,
  } satisfies CSSProperties,

  item: {
    margin: 0,
  } satisfies CSSProperties,

  card: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#000",
    padding: "1.75rem",
    transition: "border-color 180ms ease, transform 180ms ease",
  } satisfies CSSProperties,

  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 24,
  } satisfies CSSProperties,

  assetType: {
    margin: 0,
    fontFamily: SERIF_FONT,
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "1.5rem",
    lineHeight: 1.1,
    color: "#fff",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  } satisfies CSSProperties,

  meta: {
    margin: "10px 0 0",
    fontFamily: MONO_FONT,
    fontSize: "0.7rem",
    letterSpacing: "0.04em",
    color: "rgba(255,255,255,0.5)",
  } satisfies CSSProperties,

  scoreBadge: {
    flexShrink: 0,
    display: "flex",
    alignItems: "baseline",
    gap: 4,
  } satisfies CSSProperties,

  scoreNumber: {
    fontFamily: SERIF_FONT,
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "2.2rem",
    lineHeight: 1,
    color: RED,
    fontVariantNumeric: "tabular-nums",
  } satisfies CSSProperties,

  scoreSlash: {
    fontFamily: MONO_FONT,
    fontSize: "0.65rem",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.35)",
  } satisfies CSSProperties,

  pillRow: {
    marginTop: 18,
  } satisfies CSSProperties,

  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 10px 5px 8px",
    border: "1px solid transparent",
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
  } satisfies CSSProperties,

  pillDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  } satisfies CSSProperties,

  actions: {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  } satisfies CSSProperties,

  actionPrimary: {
    background: RED,
    color: "#fff",
    border: `1px solid ${RED}`,
    padding: "0.85rem 1rem",
    fontFamily: MONO_FONT,
    fontSize: 12,
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "background 150ms ease",
  } satisfies CSSProperties,

  actionSecondary: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "0.85rem 1rem",
    fontFamily: MONO_FONT,
    fontSize: 12,
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "border-color 150ms ease",
  } satisfies CSSProperties,
};
