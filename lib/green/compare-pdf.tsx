/**
 * Green compare table PDF — client/server via @react-pdf/renderer.
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

import type { GreenCompareRow } from "./compare-data";
import type { GreenMessages } from "./i18n";

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
    padding: 36,
    fontFamily: "Space Mono",
    fontSize: 8,
    color: "#171717",
    backgroundColor: "#fafafa",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GREEN,
    paddingBottom: 10,
  },
  brand: { fontSize: 7, letterSpacing: 2, color: GREEN },
  title: { fontSize: 14, marginTop: 6, fontWeight: 700 },
  subtitle: { fontSize: 8, color: MUTED, marginTop: 4, lineHeight: 1.4 },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: GREEN,
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 6,
  },
  colProject: { width: "18%" },
  colType: { width: "10%" },
  colToken: { width: "14%" },
  colYield: { width: "16%" },
  colImpact: { width: "16%" },
  colLabel: { width: "12%" },
  colSource: { width: "14%" },
  th: {
    fontSize: 6,
    letterSpacing: 1,
    color: GREEN,
    textTransform: "uppercase",
  },
  td: { fontSize: 7, color: "#404040", lineHeight: 1.35 },
  tdMuted: { fontSize: 6, color: MUTED, marginTop: 2 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 6,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 6,
    lineHeight: 1.4,
  },
});

export type GreenComparePdfRow = {
  project: string;
  type: string;
  token: string;
  yieldNote: string;
  impactNote: string;
  label: string;
  source: string;
  reviewed: string;
};

/** Pure mapping for tests and PDF generation. */
export function greenCompareRowsToPdfRows(
  rows: GreenCompareRow[],
  labels: GreenMessages["compare"]
): GreenComparePdfRow[] {
  return rows.map((row) => ({
    project: row.name,
    type: labels.projectTypes[row.type],
    token: row.token,
    yieldNote: row.yieldNote,
    impactNote: row.impactNote,
    label: labels.labelStatus[row.labelStatus],
    source: `${row.sourceLabel} (${row.lastReviewed})`,
    reviewed: row.lastReviewed,
  }));
}

function CompareDocument({
  labels,
  pdfRows,
  generatedAt,
}: {
  labels: GreenMessages["compare"];
  pdfRows: GreenComparePdfRow[];
  generatedAt: string;
}) {
  const docProps: DocumentProps = {
    title: labels.title,
    author: "AUROS Green",
    subject: "Green RWA compare export",
    creator: "AUROS",
  };

  return (
    <Document {...docProps}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AUROS GREEN · COMPARE</Text>
          <Text style={styles.title}>{labels.title}</Text>
          <Text style={styles.subtitle}>{labels.disclaimer}</Text>
          <Text style={[styles.subtitle, { marginTop: 2 }]}>{generatedAt}</Text>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.colProject]}>{labels.table.project}</Text>
          <Text style={[styles.th, styles.colType]}>{labels.table.type}</Text>
          <Text style={[styles.th, styles.colToken]}>{labels.table.token}</Text>
          <Text style={[styles.th, styles.colYield]}>{labels.table.yield}</Text>
          <Text style={[styles.th, styles.colImpact]}>{labels.table.impact}</Text>
          <Text style={[styles.th, styles.colLabel]}>{labels.table.label}</Text>
          <Text style={[styles.th, styles.colSource]}>{labels.table.source}</Text>
        </View>

        {pdfRows.map((row) => (
          <View key={`${row.project}-${row.reviewed}`} style={styles.tableRow}>
            <View style={styles.colProject}>
              <Text style={styles.td}>{row.project}</Text>
            </View>
            <View style={styles.colType}>
              <Text style={styles.td}>{row.type}</Text>
            </View>
            <View style={styles.colToken}>
              <Text style={styles.td}>{row.token}</Text>
            </View>
            <View style={styles.colYield}>
              <Text style={styles.td}>{row.yieldNote}</Text>
            </View>
            <View style={styles.colImpact}>
              <Text style={styles.td}>{row.impactNote}</Text>
            </View>
            <View style={styles.colLabel}>
              <Text style={styles.td}>{row.label}</Text>
            </View>
            <View style={styles.colSource}>
              <Text style={styles.td}>{row.source}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>{labels.disclaimer}</Text>
      </Page>
    </Document>
  );
}

export async function generateGreenComparePDF(
  rows: GreenCompareRow[],
  labels: GreenMessages["compare"],
  locale: string = "fr"
): Promise<Blob> {
  const pdfRows = greenCompareRowsToPdfRows(rows, labels);
  const generatedAt = new Date().toISOString().slice(0, 10);
  return pdf(
    <CompareDocument labels={labels} pdfRows={pdfRows} generatedAt={generatedAt} />
  ).toBlob();
}

export function suggestedGreenCompareFilename(locale: string = "fr"): string {
  const date = new Date().toISOString().slice(0, 10);
  const prefix =
    locale === "es" ? "AUROS_Green_Comparador" : locale === "en" ? "AUROS_Green_Compare" : "AUROS_Green_Comparateur";
  return `${prefix}_${date}.pdf`;
}
