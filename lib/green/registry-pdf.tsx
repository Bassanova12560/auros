/**
 * Green registry projects PDF — filtered export via @react-pdf/renderer.
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

import type { GreenRegistryProjectRow } from "./green-registry";
import { greenProjectSummary } from "./green-registry";
import type { GreenMessages } from "./i18n";
import type { GreenRegistryTierFilter } from "./registry-routes";
import type { Locale } from "@/lib/i18n";

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
  filterNote: { fontSize: 7, color: MUTED, marginTop: 6 },
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
  colName: { width: "22%" },
  colType: { width: "12%" },
  colCountry: { width: "14%" },
  colTier: { width: "12%" },
  colDate: { width: "14%" },
  colSummary: { width: "26%" },
  th: {
    fontSize: 6,
    letterSpacing: 1,
    color: GREEN,
    textTransform: "uppercase",
  },
  td: { fontSize: 7, color: "#404040", lineHeight: 1.35 },
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

export type GreenRegistryPdfRow = {
  name: string;
  type: string;
  country: string;
  tier: string;
  certifiedAt: string;
  summary: string;
};

export function greenRegistryProjectsToPdfRows(
  projects: GreenRegistryProjectRow[],
  labels: GreenMessages["registry"],
  compareLabels: GreenMessages["compare"],
  locale: Locale
): GreenRegistryPdfRow[] {
  const tierLabel = (tier: "verified" | "pilot"): string =>
    tier === "verified" ? labels.tierVerified : labels.tierPilot;

  return projects.map((proj) => ({
    name: proj.name,
    type: compareLabels.projectTypes[proj.projectType],
    country: proj.country,
    tier: tierLabel(proj.labelTier),
    certifiedAt: proj.certifiedAt.slice(0, 10),
    summary: greenProjectSummary(proj, locale),
  }));
}

function RegistryDocument({
  labels,
  compareLabels,
  pdfRows,
  filterNote,
  generatedAt,
  disclaimer,
}: {
  labels: GreenMessages["registry"];
  compareLabels: GreenMessages["compare"];
  pdfRows: GreenRegistryPdfRow[];
  filterNote: string | null;
  generatedAt: string;
  disclaimer: string;
}) {
  const docProps: DocumentProps = {
    title: labels.title,
    author: "AUROS Green",
    subject: "Green registry export",
    creator: "AUROS",
  };

  return (
    <Document {...docProps}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AUROS GREEN · REGISTRY</Text>
          <Text style={styles.title}>{labels.title}</Text>
          <Text style={styles.subtitle}>{labels.intro}</Text>
          {filterNote ? <Text style={styles.filterNote}>{filterNote}</Text> : null}
          <Text style={[styles.subtitle, { marginTop: 2 }]}>{generatedAt}</Text>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.colName]}>{labels.projectsTitle}</Text>
          <Text style={[styles.th, styles.colType]}>{compareLabels.table.type}</Text>
          <Text style={[styles.th, styles.colCountry]}>{labels.projectDetail.locationTitle}</Text>
          <Text style={[styles.th, styles.colTier]}>{labels.tierVerified}</Text>
          <Text style={[styles.th, styles.colDate]}>{labels.projectDetail.certifiedAtTitle}</Text>
          <Text style={[styles.th, styles.colSummary]}>{labels.projectDetail.descriptionTitle}</Text>
        </View>

        {pdfRows.map((row) => (
          <View key={`${row.name}-${row.certifiedAt}`} style={styles.tableRow}>
            <View style={styles.colName}>
              <Text style={styles.td}>{row.name}</Text>
            </View>
            <View style={styles.colType}>
              <Text style={styles.td}>{row.type}</Text>
            </View>
            <View style={styles.colCountry}>
              <Text style={styles.td}>{row.country}</Text>
            </View>
            <View style={styles.colTier}>
              <Text style={styles.td}>{row.tier}</Text>
            </View>
            <View style={styles.colDate}>
              <Text style={styles.td}>{row.certifiedAt}</Text>
            </View>
            <View style={styles.colSummary}>
              <Text style={styles.td}>{row.summary}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>{disclaimer}</Text>
      </Page>
    </Document>
  );
}

export function registryPdfFilterNote(
  labels: GreenMessages["registry"],
  tierFilter: GreenRegistryTierFilter
): string | null {
  if (tierFilter === "verified") return `${labels.tierFilterAll}: ${labels.tierFilterVerified}`;
  if (tierFilter === "pilot") return `${labels.tierFilterAll}: ${labels.tierFilterPilot}`;
  return null;
}

export async function generateGreenRegistryPDF(
  projects: GreenRegistryProjectRow[],
  labels: GreenMessages["registry"],
  compareLabels: GreenMessages["compare"],
  locale: Locale,
  options: { tierFilter?: GreenRegistryTierFilter; disclaimer?: string } = {}
): Promise<Blob> {
  const pdfRows = greenRegistryProjectsToPdfRows(projects, labels, compareLabels, locale);
  const filterNote = registryPdfFilterNote(labels, options.tierFilter ?? "all");
  const generatedAt = new Date().toISOString().slice(0, 10);
  return pdf(
    <RegistryDocument
      labels={labels}
      compareLabels={compareLabels}
      pdfRows={pdfRows}
      filterNote={filterNote}
      generatedAt={generatedAt}
      disclaimer={options.disclaimer ?? labels.pilotNote}
    />
  ).toBlob();
}

export function suggestedGreenRegistryPdfFilename(
  tierFilter: GreenRegistryTierFilter = "all",
  locale: Locale = "fr"
): string {
  const date = new Date().toISOString().slice(0, 10);
  const prefix =
    locale === "es"
      ? "AUROS_Green_Registro"
      : locale === "en"
        ? "AUROS_Green_Registry"
        : "AUROS_Green_Registre";
  const suffix =
    tierFilter === "verified" ? "_verified" : tierFilter === "pilot" ? "_pilot" : "";
  return `${prefix}${suffix}_${date}.pdf`;
}
