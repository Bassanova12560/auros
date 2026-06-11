/**
 * State of RWA Issuers quarterly report PDF — @react-pdf/renderer.
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

import type { Locale } from "@/lib/i18n";

import {
  formatCostEur,
  formatEditionQuarter,
  getStateOfRwaIssuersCopy,
  type StateOfRwaIssuersCopy,
} from "./i18n";
import type { StateOfRwaIssuersPayload } from "./types";

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

const BRAND = "#9F2F2D";
const MUTED = "#737373";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Space Mono",
    fontSize: 8,
    color: "#171717",
    backgroundColor: "#fafafa",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BRAND,
    paddingBottom: 12,
  },
  brand: { fontSize: 7, letterSpacing: 2, color: BRAND },
  title: { fontSize: 16, marginTop: 6, fontWeight: 700 },
  subtitle: { fontSize: 9, color: MUTED, marginTop: 4 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
    color: BRAND,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 5,
  },
  colLabel: { width: "45%" },
  colValue: { width: "25%" },
  colExtra: { width: "30%" },
  td: { fontSize: 7.5, lineHeight: 1.35 },
  th: { fontSize: 7, fontWeight: 700, color: MUTED },
  note: { fontSize: 7, color: MUTED, marginTop: 6, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 6.5,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
  },
  metricBox: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  metric: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  metricLabel: { fontSize: 6.5, color: MUTED },
  metricValue: { fontSize: 14, fontWeight: 700, marginTop: 4 },
});

function ReportDocument({
  payload,
  copy,
  locale,
  generatedLabel,
}: {
  payload: StateOfRwaIssuersPayload;
  copy: StateOfRwaIssuersCopy;
  locale: Locale;
  generatedLabel: string;
}) {
  const editionLabel = formatEditionQuarter(payload.edition, locale);
  const docProps: DocumentProps = {
    title: `${copy.pdf.title} — ${editionLabel}`,
    author: "AUROS",
    subject: "State of RWA Issuers quarterly report",
    creator: "AUROS",
  };

  return (
    <Document {...docProps}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AUROS · DATA</Text>
          <Text style={styles.title}>{copy.pdf.title}</Text>
          <Text style={styles.subtitle}>
            {copy.pdf.subtitle} — {editionLabel}
          </Text>
          <Text style={styles.subtitle}>
            {copy.pdf.generatedAt} {generatedLabel}
          </Text>
          <Text style={[styles.subtitle, { marginTop: 6 }]}>{copy.pdf.disclaimer}</Text>
        </View>

        <View style={styles.metricBox}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>{copy.assetMixProducts}</Text>
            <Text style={styles.metricValue}>{payload.totalProducts}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>{copy.micaAvg}</Text>
            <Text style={styles.metricValue}>
              {copy.micaAvgValue(payload.micaReadiness.avgScorePct)}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>{copy.trendsTitle}</Text>
            <Text style={[styles.metricValue, { fontSize: 9 }]}>
              {copy.trendsValue(
                payload.dossierTrends.wizardStartsEstimate,
                payload.dossierTrends.monthOverMonthPct
              )}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{copy.pdf.sectionAssetMix}</Text>
        <View style={styles.row}>
          <Text style={[styles.th, styles.colLabel]}>{copy.assetMixCategory}</Text>
          <Text style={[styles.th, styles.colValue]}>{copy.assetMixProducts}</Text>
          <Text style={[styles.th, styles.colExtra]}>{copy.assetMixShare}</Text>
        </View>
        {payload.assetMix.map((row) => (
          <View key={row.categoryId} style={styles.row}>
            <Text style={[styles.td, styles.colLabel]}>
              {copy.categories[row.categoryId]}
            </Text>
            <Text style={[styles.td, styles.colValue]}>{row.productCount}</Text>
            <Text style={[styles.td, styles.colExtra]}>{row.sharePct} %</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{copy.pdf.sectionMica}</Text>
        <View style={styles.row}>
          <Text style={[styles.th, styles.colLabel]}>{copy.micaSignal}</Text>
          <Text style={[styles.th, styles.colValue]}>Score</Text>
        </View>
        {payload.micaReadiness.signals.map((s) => (
          <View key={s.id} style={styles.row}>
            <Text style={[styles.td, styles.colLabel]}>
              {copy.micaSignals[s.id] ?? s.id}
            </Text>
            <Text style={[styles.td, styles.colValue]}>{s.scorePct} / 100</Text>
          </View>
        ))}
        <Text style={styles.note}>{payload.micaReadiness.note}</Text>

        <Text style={styles.sectionTitle}>{copy.pdf.sectionBlockers}</Text>
        {payload.blockers.map((b) => (
          <View key={b.id} style={styles.row}>
            <Text style={[styles.td, styles.colLabel]}>
              {copy.blockers[b.id] ?? b.id}
            </Text>
            <Text style={[styles.td, styles.colValue]}>{b.sharePct} %</Text>
          </View>
        ))}

        <Text style={styles.footer}>{copy.pdf.footer}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>{copy.pdf.sectionJurisdictions}</Text>
        <View style={styles.row}>
          <Text style={[styles.th, styles.colLabel]}>Juridiction</Text>
          <Text style={[styles.th, styles.colValue]}>{copy.jurisdictionShare}</Text>
          <Text style={[styles.th, styles.colExtra]}>{copy.jurisdictionCost}</Text>
        </View>
        {payload.jurisdictionBreakdown.map((j) => (
          <View key={j.jurisdictionId} style={styles.row}>
            <Text style={[styles.td, styles.colLabel]}>
              {copy.jurisdictions[j.jurisdictionId] ?? j.jurisdictionId}
            </Text>
            <Text style={[styles.td, styles.colValue]}>{j.sharePct} %</Text>
            <Text style={[styles.td, styles.colExtra]}>
              {formatCostEur(j.totalCostMid, locale)} · {j.licenseMaxMonths} mo
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{copy.pdf.sectionTrends}</Text>
        <Text style={styles.td}>
          {copy.trendsValue(
            payload.dossierTrends.wizardStartsEstimate,
            payload.dossierTrends.monthOverMonthPct
          )}
        </Text>
        <Text style={styles.note}>{payload.dossierTrends.note}</Text>
        <Text style={[styles.note, { marginTop: 10 }]}>
          RWA Index édition : {payload.rwaIndexEditionIso} ·{" "}
          {payload.activeJurisdictions} juridictions actives AUROS
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          {copy.methodologyTitle}
        </Text>
        {copy.methodologyBody.map((p) => (
          <Text key={p.slice(0, 30)} style={[styles.note, { marginBottom: 4 }]}>
            · {p}
          </Text>
        ))}

        <Text style={styles.footer}>{copy.pdf.footer}</Text>
      </Page>
    </Document>
  );
}

export async function generateStateOfRwaIssuersPdf(
  payload: StateOfRwaIssuersPayload,
  locale: Locale = "fr"
): Promise<Blob> {
  const copy = getStateOfRwaIssuersCopy(locale);
  const tag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  const generatedLabel = new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(payload.generatedAt));

  return pdf(
    <ReportDocument
      payload={payload}
      copy={copy}
      locale={locale}
      generatedLabel={generatedLabel}
    />
  ).toBlob();
}

export function suggestedReportFilename(edition: string): string {
  return `AUROS_State_of_RWA_Issuers_${edition}.pdf`;
}
