/**
 * Dossier PDF — rapport institutionnel 2 pages max (term sheet).
 */

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
  Path,
  Rect,
  pdf,
  type DocumentProps,
} from "@react-pdf/renderer";

import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import {
  ALL_RWA_DOCUMENT_IDS,
  normalizeDocumentIds,
  RWA_DOCUMENT_LABELS,
} from "@/lib/rwa-document-phases";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { getPdfStrings, pdfDateLocale, type PdfStrings } from "@/lib/pdf-i18n";
import type { DossierContent } from "@/lib/wizard-types";
import { COUNTRIES_EUROPE } from "@/lib/wizard-countries";

Font.register({
  family: "Space Mono",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYE58RWq7.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/spacemono/v13/i7dMIFZifjKcF5UAWdDRYER8QHi-EwWMa0Q.ttf",
      fontWeight: 700,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

type Currency = "EUR" | "USD" | "GBP" | "CHF";
const DOC_NONE = "None yet";
const EU_SET = new Set<string>(COUNTRIES_EUROPE);
const RED = "#9F2F2D";

export type DossierData = {
  assetType?: string;
  description?: string;
  estimatedValue?: number;
  currency?: Currency;
  country?: string;
  city?: string;
  documents?: string[];
  goals?: string[];
  timeline?: string;
  platform?: string;
  firstName?: string;
  email?: string;
  legalStructure?: string;
  incomeType?: string;
  incomeAmountYear?: number;
  incomeDescription?: string;
  legalStatus?: string[];
  investorProfile?: string;
  additionalNotes?: string;
  [k: string]: unknown;
};

export type StoredDossier = {
  generatedAt?: string;
  score?: number;
  tier?: "low" | "mid" | "high";
  tierLabel?: string;
  data?: DossierData;
  aiContent?: Partial<DossierContent>;
  aiMeta?: { provider: string; generatedAt: string };
  id?: string;
  locale?: Locale;
};

const DOC_ROWS = ALL_RWA_DOCUMENT_IDS.map((id) => RWA_DOCUMENT_LABELS[id]);

function resolvePdfLocale(dossier: StoredDossier): Locale {
  const l = dossier.locale;
  return l && isLocale(l) ? l : DEFAULT_LOCALE;
}

function formatWithSpaces(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatCurrency(value: number, currency: Currency): string {
  const n = formatWithSpaces(value);
  switch (currency) {
    case "USD":
      return `$${n}`;
    case "GBP":
      return `£${n}`;
    case "CHF":
      return `CHF ${n}`;
    default:
      return `${n} EUR`;
  }
}

function formatDate(iso: string | undefined, locale: Locale): string {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toLocaleDateString(pdfDateLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ") + "…";
}

function completenessPercent(data: DossierData): number {
  const checks = [
    !!data.assetType,
    !!(data.description && data.description.trim().length > 20),
    (data.estimatedValue ?? 0) > 0,
    !!data.country,
    !!data.city,
    (data.documents?.length ?? 0) > 0,
    (data.goals?.length ?? 0) > 0,
    !!data.timeline,
    !!data.platform,
    !!data.firstName,
    !!data.email,
    !!data.legalStructure,
    !!data.incomeType,
    (data.legalStatus?.length ?? 0) > 0,
    !!data.investorProfile,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

function incomeSummary(data: DossierData, s: PdfStrings): string {
  if (data.incomeType === "rental" && data.incomeAmountYear) {
    return s.income.rental(
      formatCurrency(data.incomeAmountYear, data.currency ?? "EUR")
    );
  }
  if (data.incomeType === "other" && data.incomeDescription) {
    return data.incomeDescription;
  }
  if (data.incomeType === "none") return s.income.none;
  if (data.incomeType === "future") return s.income.future;
  return "—";
}

function micaStatus(data: DossierData, score: number): "ELIGIBLE" | "PENDING" {
  if (score < 51) return "PENDING";
  if (data.country && EU_SET.has(data.country)) return "ELIGIBLE";
  if (
    data.country === "United Kingdom" ||
    data.country === "Switzerland"
  ) {
    return "ELIGIBLE";
  }
  return "PENDING";
}

function nextSteps(data: DossierData, s: PdfStrings): string[] {
  const steps: string[] = [];
  const docs = (data.documents ?? []).filter((d) => d !== DOC_NONE);
  if (docs.length < 2) {
    steps.push(s.steps.gatherDocs);
  } else {
    steps.push(s.steps.uploadDocs);
  }
  if (!data.legalStructure) {
    steps.push(s.steps.confirmStructure);
  } else {
    steps.push(s.steps.alignStructure(data.legalStructure));
  }
  steps.push(
    s.steps.onboarding(
      data.platform || "—",
      data.investorProfile || "—"
    )
  );
  return steps.slice(0, 3);
}

const MONO = "Space Mono";
const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 52,
    paddingHorizontal: 44,
    backgroundColor: "#ffffff",
    color: "#111111",
    fontFamily: MONO,
    fontSize: 8,
    lineHeight: 1.45,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandText: { fontSize: 9, letterSpacing: 2.5 },
  reportTitle: { fontSize: 8, letterSpacing: 2, color: "#666666" },
  redRule: {
    height: 1,
    backgroundColor: RED,
    marginBottom: 14,
  },
  twoCol: { flexDirection: "row", gap: 16 },
  colLeft: { width: "58%" },
  colRight: { width: "42%" },
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: "#888888",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  h1: { fontSize: 14, marginBottom: 4, fontWeight: 700 },
  body: { fontSize: 8, lineHeight: 1.55, color: "#222222" },
  scoreBig: { fontSize: 48, fontWeight: 700, lineHeight: 1 },
  tier: { fontSize: 7, letterSpacing: 1.5, marginTop: 4, color: "#555555" },
  barTrack: {
    height: 4,
    backgroundColor: "#eeeeee",
    marginTop: 8,
    width: "100%",
  },
  barFill: { height: 4, backgroundColor: "#111111" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e8e8",
  },
  tableHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#111111",
    marginBottom: 2,
  },
  checkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    left: 44,
    right: 44,
    bottom: 28,
    borderTopWidth: 0.5,
    borderTopColor: RED,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerSmall: { fontSize: 6, letterSpacing: 1, color: "#888888", maxWidth: "70%" },
  block: { marginTop: 12 },
});

function AurosLogo({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x={1}
        y={1}
        width={22}
        height={22}
        stroke="#111111"
        strokeWidth={1.4}
        fill="transparent"
      />
      <Path d="M16 1 L23 1 L23 8 Z" fill="#111111" />
    </Svg>
  );
}

function PageHeader({ s }: { s: PdfStrings }) {
  return (
    <>
      <View style={styles.headerRow}>
        <View style={styles.brand}>
          <AurosLogo />
          <Text style={styles.brandText}>AUROS</Text>
        </View>
        <Text style={styles.reportTitle}>{s.reportTitle}</Text>
      </View>
      <View style={styles.redRule} />
    </>
  );
}

function ReportFooter({ date, s }: { date: string; s: PdfStrings }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerSmall}>{s.footer(date)}</Text>
      <AurosLogo size={12} />
    </View>
  );
}

function PageOne({
  dossier,
  s,
  locale,
}: {
  dossier: StoredDossier;
  s: PdfStrings;
  locale: Locale;
}) {
  const data = dossier.data ?? {};
  const score = typeof dossier.score === "number" ? dossier.score : 0;
  const tierLabel = dossier.tierLabel ?? "TOKENIZATION SCORE";
  const pct = completenessPercent(data);
  const mica = micaStatus(data, score);
  const docs = normalizeDocumentIds(data.documents ?? []);
  const admission = computeAdmissionReadiness(data as import("@/lib/wizard-types").WizardData);
  const desc = truncateWords(data.description?.trim() || "—", 200);
  const hasClear = data.legalStatus?.includes("Clear title — no disputes");
  const hasEnc =
    data.legalStatus?.includes("No mortgage or encumbrance");
  const hasTax = data.legalStatus?.includes("Tax compliant in jurisdiction");

  const cur = (data.currency ?? "EUR") as Currency;
  const valStr = formatCurrency(data.estimatedValue ?? 0, cur);

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader s={s} />
      <View style={styles.twoCol}>
        <View style={styles.colLeft}>
          <Text style={styles.sectionLabel}>{s.sections.asset}</Text>
          <Text style={styles.h1}>
            {data.assetType || s.fallbacks.unspecifiedAsset}
          </Text>
          <Text style={styles.body}>
            {s.labels.owner} · {data.firstName || "—"}
          </Text>
          <Text style={styles.body}>
            {s.labels.location} ·{" "}
            {[data.city, data.country].filter(Boolean).join(", ") || "—"}
          </Text>
          <Text style={styles.body}>
            {s.labels.legalHolding} · {data.legalStructure || "—"}
          </Text>
          <Text style={styles.body}>
            {s.labels.value} · {valStr}
          </Text>
          <Text style={styles.body}>
            {s.labels.cashFlows} · {incomeSummary(data, s)}
          </Text>
        </View>
        <View style={styles.colRight}>
          <Text style={styles.sectionLabel}>{s.sections.score}</Text>
          <Text style={styles.scoreBig}>{score}</Text>
          <Text style={styles.tier}>{tierLabel.toUpperCase()}</Text>
          <Text style={[styles.body, { marginTop: 8 }]}>
            {s.labels.admission} · {admission.overallAdmission}%
          </Text>
          <Text style={styles.body}>
            {s.labels.dataRoom} · {admission.dataRoomPercent}%
          </Text>
          <Text style={[styles.body, { marginTop: 4 }]}>
            {s.labels.completeness} · {pct}%
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${pct}%` }]} />
          </View>
          <Text style={[styles.body, { marginTop: 10 }]}>
            {s.labels.platform} · {data.platform || "—"}
          </Text>
          <Text style={[styles.body, { color: RED, marginTop: 4 }]}>
            {s.labels.mica} · {mica}
          </Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.sectionLabel}>{s.sections.docs}</Text>
        <View style={styles.tableHead}>
          <Text>{s.labels.document}</Text>
          <Text>{s.labels.status}</Text>
        </View>
        {ALL_RWA_DOCUMENT_IDS.map((id) => {
          const ok = docs.includes(id);
          const label = RWA_DOCUMENT_LABELS[id];
          return (
            <View key={id} style={styles.tableRow}>
              <Text>{label}</Text>
              <Text>{ok ? s.labels.available : s.labels.missing}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.block}>
        <Text style={styles.sectionLabel}>{s.sections.description}</Text>
        <Text style={styles.body}>{desc}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.sectionLabel}>{s.sections.legal}</Text>
        <View style={styles.checkRow}>
          <Text>{s.labels.clearTitle}</Text>
          <Text>{hasClear ? s.labels.yes : s.labels.no}</Text>
        </View>
        <View style={styles.checkRow}>
          <Text>{s.labels.noEncumbrance}</Text>
          <Text>{hasEnc ? s.labels.yes : s.labels.no}</Text>
        </View>
        <View style={styles.checkRow}>
          <Text>{s.labels.taxCompliant}</Text>
          <Text>{hasTax ? s.labels.yes : s.labels.no}</Text>
        </View>
      </View>

      <ReportFooter date={formatDate(dossier.generatedAt, locale)} s={s} />
    </Page>
  );
}

function PageTwo({
  dossier,
  s,
  locale,
}: {
  dossier: StoredDossier;
  s: PdfStrings;
  locale: Locale;
}) {
  const data = dossier.data ?? {};
  const ai = dossier.aiContent ?? {};
  const value = data.estimatedValue ?? 0;
  const cur = (data.currency ?? "EUR") as Currency;
  const valStr = formatCurrency(value, cur);
  const euOnly =
    data.country && EU_SET.has(data.country)
      ? s.labels.euOnly
      : s.labels.global;
  const tokenSupply = value > 0 ? Math.max(1000, Math.round(value / 1000)) : 0;
  const steps = nextSteps(data, s);

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader s={s} />

      <View style={styles.block}>
        <Text style={styles.sectionLabel}>{s.sections.ai}</Text>
        <Text style={[styles.body, { marginBottom: 6 }]}>
          {s.labels.legal} ·{" "}
          {ai.legalDescription?.trim() || s.fallbacks.legalAi}
        </Text>
        <Text style={[styles.body, { marginBottom: 6 }]}>
          {s.labels.valuation} ·{" "}
          {ai.valuation?.trim() || s.fallbacks.valuationAi(valStr)}
        </Text>
        <Text style={styles.body}>
          {s.labels.dueDiligence} ·{" "}
          {ai.dueDiligence?.trim() || s.fallbacks.ddAi}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.sectionLabel}>{s.sections.smartContract}</Text>
        <Text style={styles.body}>{s.labels.tokenStandard} · ERC-3643</Text>
        <Text style={styles.body}>
          {s.labels.fractionalizable} ·{" "}
          {value >= 100_000 ? s.labels.yesPlain : s.labels.reviewRequired}
        </Text>
        <Text style={styles.body}>
          {s.labels.transferRestrictions} · {euOnly}
        </Text>
        <Text style={styles.body}>
          {s.labels.estSupply} · {formatWithSpaces(tokenSupply)}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.sectionLabel}>{s.sections.nextSteps}</Text>
        {steps.map((step, i) => (
          <Text key={step} style={[styles.body, { marginBottom: 4 }]}>
            {i + 1}. {step}
          </Text>
        ))}
      </View>

      <ReportFooter date={formatDate(dossier.generatedAt, locale)} s={s} />
    </Page>
  );
}

function DossierDocument({ dossier }: { dossier: StoredDossier }) {
  const locale = resolvePdfLocale(dossier);
  const s = getPdfStrings(locale);
  const docProps: DocumentProps = {
    title: `AUROS — ${dossier.data?.assetType ?? "Asset"}`,
    author: "AUROS",
    subject: s.docSubject,
    creator: "AUROS",
  };
  return (
    <Document {...docProps}>
      <PageOne dossier={dossier} s={s} locale={locale} />
      <PageTwo dossier={dossier} s={s} locale={locale} />
    </Document>
  );
}

export async function generateDossierPDF(
  dossier: StoredDossier
): Promise<Blob> {
  return pdf(<DossierDocument dossier={dossier} />).toBlob();
}

export function suggestedFilename(dossier: StoredDossier): string {
  const s = getPdfStrings(resolvePdfLocale(dossier));
  const asset = dossier.data?.assetType
    ? slugify(dossier.data.assetType)
    : "report";
  const date = (dossier.generatedAt
    ? new Date(dossier.generatedAt)
    : new Date()
  )
    .toISOString()
    .slice(0, 10);
  return `${s.filenamePrefix}_${asset}_${date}.pdf`;
}
