/**
 * Green Impact Report PDF — EU Taxonomy + RTMS summary for paid export.
 */

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
  type DocumentProps,
} from "@react-pdf/renderer";

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { getGreenMessages } from "@/lib/green/i18n";
import { GREEN_RTMS_PILLARS, GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";
import type { GreenComplianceScore } from "@/lib/green/scoring/green-compliance";
import type { CsrdResult } from "@/lib/green/csrd-check/types";
import type { GreenImpactReportTier } from "@/lib/green/impact-report-pricing";
import type { WizardData } from "@/lib/wizard-types";

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

const GREEN = "#059669";
const MUTED = "#737373";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Space Mono",
    fontSize: 9,
    color: "#171717",
    backgroundColor: "#fafafa",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: GREEN,
    paddingBottom: 12,
  },
  brand: { fontSize: 8, letterSpacing: 2, color: GREEN },
  title: { fontSize: 16, marginTop: 8, fontWeight: 700 },
  subtitle: { fontSize: 9, color: MUTED, marginTop: 4 },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 12,
  },
  scoreBig: { fontSize: 26, fontWeight: 700, color: GREEN },
  section: { marginTop: 14 },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: GREEN,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  grid: { flexDirection: "row", gap: 12 },
  gridCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    padding: 10,
  },
  pillar: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  pillarHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bullet: { color: MUTED, marginBottom: 2, paddingLeft: 8 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 7,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
  },
});

export type GreenImpactReportInput = {
  locale?: Locale;
  generatedAt?: string;
  tier?: GreenImpactReportTier;
  data?: WizardData;
  greenRtms?: GreenRtmsScore;
  greenCompliance?: GreenComplianceScore;
  csrdResult?: CsrdResult;
};

function resolveLocale(input: GreenImpactReportInput): Locale {
  const l = input.locale;
  return l && isLocale(l) ? l : DEFAULT_LOCALE;
}

const SFDR_LABELS: Record<GreenComplianceScore["sfdr_classification"], string> = {
  article_6: "SFDR Art. 6",
  article_8: "SFDR Art. 8",
  article_9: "SFDR Art. 9",
};

const GBS_LABELS: Record<GreenComplianceScore["eu_gbs_eligible"], string> = {
  eligible: "EU GBS eligible",
  conditional: "EU GBS — conditional",
  not_eligible: "Outside EU GBS",
};

function ImpactReportDocument({ input }: { input: GreenImpactReportInput }) {
  const locale = resolveLocale(input);
  const m = getGreenMessages(locale);
  const data = input.data ?? ({} as WizardData);
  const rtms = input.greenRtms;
  const compliance = input.greenCompliance;
  const csrd = input.csrdResult;
  const date = (input.generatedAt ? new Date(input.generatedAt) : new Date())
    .toISOString()
    .slice(0, 10);

  const docProps: DocumentProps = {
    title: `AUROS Green Impact Report — ${data.assetType ?? GREEN_WIZARD_ASSET_TYPE}`,
    author: "AUROS",
    subject: "Green impact report — EU Taxonomy + RTMS",
    creator: "AUROS",
  };

  const taxonomyLabel =
    locale === "fr"
      ? "Alignement EU Taxonomy"
      : locale === "es"
        ? "Alineación EU Taxonomy"
        : "EU Taxonomy alignment";

  return (
    <Document {...docProps}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AUROS GREEN · IMPACT REPORT</Text>
          <Text style={styles.title}>
            {data.assetType ?? GREEN_WIZARD_ASSET_TYPE}
          </Text>
          <Text style={styles.subtitle}>
            {[data.city, data.country].filter(Boolean).join(", ") || "—"} · {date}
            {input.tier === "institutional" ? " · Institutional" : ""}
          </Text>
        </View>

        {compliance ? (
          <View style={styles.scoreRow}>
            <View style={{ maxWidth: 300 }}>
              <Text style={styles.sectionLabel}>{taxonomyLabel}</Text>
              <Text style={{ color: MUTED, lineHeight: 1.4 }}>
                {compliance.disclaimer.slice(0, 120)}…
              </Text>
            </View>
            <Text style={styles.scoreBig}>{compliance.eu_taxonomy_alignment}</Text>
          </View>
        ) : null}

        {compliance ? (
          <View style={styles.grid}>
            <View style={styles.gridCell}>
              <Text style={styles.sectionLabel}>SFDR</Text>
              <Text>{SFDR_LABELS[compliance.sfdr_classification]}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.sectionLabel}>EU GBS</Text>
              <Text>{GBS_LABELS[compliance.eu_gbs_eligible]}</Text>
            </View>
          </View>
        ) : null}

        {compliance && compliance.priorities.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {locale === "fr" ? "Priorités (max 3)" : locale === "es" ? "Prioridades (máx. 3)" : "Priorities (max 3)"}
            </Text>
            {compliance.priorities.map((p) => (
              <Text key={p} style={styles.bullet}>
                · {p}
              </Text>
            ))}
          </View>
        ) : null}

        {rtms ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{m.hub.widgets.rtms.label}</Text>
            <Text style={{ color: MUTED, marginBottom: 8 }}>
              {m.hub.widgets.rtms.subtitle} — {rtms.overall}/100
            </Text>
            {GREEN_RTMS_PILLARS.map((pillar) => {
              const meta = m.standards.pillars[pillar];
              const pillarScore = rtms.pillars[pillar].score;
              return (
                <View key={pillar} style={styles.pillar}>
                  <View style={styles.pillarHead}>
                    <Text style={{ fontWeight: 700 }}>{meta.name}</Text>
                    <Text style={{ color: GREEN }}>{pillarScore}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {csrd ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CSRD</Text>
            <Text style={{ fontWeight: 700 }}>{csrd.scope_label}</Text>
            {csrd.scope_from_year ? (
              <Text style={{ color: MUTED, marginTop: 4 }}>
                Scope from {csrd.scope_from_year} · prep. {csrd.preparation_score}/100
              </Text>
            ) : null}
            {csrd.priorities.map((p) => (
              <Text key={p} style={styles.bullet}>
                · {p}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {locale === "fr" ? "Description" : locale === "es" ? "Descripción" : "Description"}
          </Text>
          <Text style={{ color: MUTED, lineHeight: 1.5 }}>
            {String(data.description ?? "—").slice(0, 900)}
          </Text>
        </View>

        <Text style={styles.footer}>
          AUROS Green · indicative report — not legal advice · auros-delta.vercel.app/green
        </Text>
      </Page>
    </Document>
  );
}

export async function generateGreenImpactReportPDF(
  input: GreenImpactReportInput
): Promise<Blob> {
  return pdf(<ImpactReportDocument input={input} />).toBlob();
}

export function suggestedGreenImpactReportFilename(
  input: GreenImpactReportInput
): string {
  const date = (input.generatedAt ? new Date(input.generatedAt) : new Date())
    .toISOString()
    .slice(0, 10);
  return `AUROS_Green_Impact_Report_${date}.pdf`;
}
