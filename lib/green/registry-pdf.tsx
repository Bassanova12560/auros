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



import type {

  GreenRegistryExpertRow,

  GreenRegistryProjectRow,

} from "./green-registry";

import { greenProjectSummary } from "./green-registry";

import type { GreenMessages } from "./i18n";

import type { GreenRegistryTierFilter } from "./registry-routes";
import {
  registryPdfCertifiedLabel,
  resolveRegistryPdfIntegrityLine,
} from "./registry-pdf-integrity";

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

const RTMS_SNIPPET_MAX = 160;



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

  metaRow: {

    flexDirection: "row",

    flexWrap: "wrap",

    gap: 8,

    marginTop: 8,

  },

  metaChip: {

    fontSize: 7,

    color: GREEN,

    borderWidth: 1,

    borderColor: GREEN,

    borderRadius: 4,

    paddingHorizontal: 6,

    paddingVertical: 3,

  },

  sectionTitle: {

    fontSize: 7,

    letterSpacing: 1.5,

    color: GREEN,

    textTransform: "uppercase",

    marginTop: 14,

    marginBottom: 6,

  },

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

  colName: { width: "18%" },

  colType: { width: "10%" },

  colLocation: { width: "12%" },

  colTier: { width: "10%" },

  colDate: { width: "12%" },

  colRtms: { width: "38%" },

  expertRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    borderBottomWidth: 1,

    borderBottomColor: "#e5e5e5",

    paddingVertical: 5,

  },

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

  watermark: {

    position: "absolute",

    top: "42%",

    left: "18%",

    fontSize: 48,

    color: "#059669",

    opacity: 0.06,

    letterSpacing: 6,

    transform: "rotate(-32deg)",

  },

  opsNote: {

    fontSize: 6,

    color: MUTED,

    marginTop: 4,

    fontStyle: "italic",

  },

});



export type GreenRegistryPdfRow = {

  name: string;

  type: string;

  location: string;

  tier: string;

  rtmsTierNote: string;

  certifiedAt: string;

  rtmsSnippet: string;

};



export type GreenRegistryPdfExpertRow = {

  name: string;

  specialty: string;

  certifiedAt: string;

};



export type GreenRegistryPdfMeta = {

  projectCount: number;

  verifiedCount: number;

  pilotCount: number;

  expertCount: number;

};



function rtmsSnippet(summary: string): string {

  const trimmed = summary.trim();

  if (trimmed.length <= RTMS_SNIPPET_MAX) return trimmed;

  return `${trimmed.slice(0, RTMS_SNIPPET_MAX - 1)}…`;

}



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

    location: proj.country,

    tier: tierLabel(proj.labelTier),

    rtmsTierNote: labels.projectDetail.rtmsTierBody(proj.labelTier),

    certifiedAt: proj.certifiedAt.slice(0, 10),

    rtmsSnippet: rtmsSnippet(greenProjectSummary(proj, locale)),

  }));

}



export function greenRegistryExpertsToPdfRows(

  experts: GreenRegistryExpertRow[]

): GreenRegistryPdfExpertRow[] {

  return experts.map((ex) => ({

    name: ex.displayName,

    specialty: ex.specialty ?? "RTMS · Green RWA",

    certifiedAt: ex.certifiedAt.slice(0, 10),

  }));

}



/** Footer line for registry PDF exports — used in document and tests. */
export function registryPdfExportFooter(date: string, locale: Locale = "fr"): string {
  if (locale === "es") return `AUROS Green Registro — exportación ${date}`;
  if (locale === "en") return `AUROS Green Registry — export ${date}`;
  return `AUROS Green Registre — export ${date}`;
}

export function greenRegistryPdfMeta(

  projects: GreenRegistryProjectRow[],

  experts: GreenRegistryExpertRow[]

): GreenRegistryPdfMeta {

  return {

    projectCount: projects.length,

    verifiedCount: projects.filter((p) => p.labelTier === "verified").length,

    pilotCount: projects.filter((p) => p.labelTier === "pilot").length,

    expertCount: experts.length,

  };

}



function RegistryDocument({

  labels,

  compareLabels,

  pdfRows,

  expertRows,

  meta,

  filterNote,

  generatedAt,

  disclaimer,

  certifiedLabel,

  integrityLine,

  exportFooter,

  opsNote,

}: {

  labels: GreenMessages["registry"];

  compareLabels: GreenMessages["compare"];

  pdfRows: GreenRegistryPdfRow[];

  expertRows: GreenRegistryPdfExpertRow[];

  meta: GreenRegistryPdfMeta;

  filterNote: string | null;

  generatedAt: string;

  disclaimer: string;

  certifiedLabel: string;

  integrityLine: string;

  exportFooter: string;

  opsNote: string;

}) {

  const docProps: DocumentProps = {

    title: labels.title,

    author: "AUROS Green",

    subject: "Green registry export",

    creator: "AUROS",

  };



  const pd = labels.projectDetail;



  return (

    <Document {...docProps}>

      <Page size="A4" orientation="landscape" style={styles.page}>

        <Text style={styles.watermark} fixed>
          AUROS GREEN
        </Text>

        <View style={styles.header}>

          <Text style={styles.brand}>AUROS GREEN · REGISTRY</Text>

          <Text style={styles.title}>{labels.title}</Text>

          <Text style={styles.subtitle}>{labels.intro}</Text>

          {filterNote ? <Text style={styles.filterNote}>{filterNote}</Text> : null}

          <Text style={[styles.subtitle, { marginTop: 2 }]}>{generatedAt}</Text>

          <View style={styles.metaRow}>

            <Text style={styles.metaChip}>{labels.statsProjects(meta.projectCount)}</Text>

            <Text style={styles.metaChip}>{labels.statsVerified(meta.verifiedCount)}</Text>

            <Text style={styles.metaChip}>{labels.statsPilots(meta.pilotCount)}</Text>

            <Text style={styles.metaChip}>{labels.statsExperts(meta.expertCount)}</Text>

          </View>

          <Text style={styles.opsNote}>{opsNote}</Text>

        </View>



        <Text style={styles.sectionTitle}>{labels.projectsTitle}</Text>



        <View style={styles.tableHead}>

          <Text style={[styles.th, styles.colName]}>{labels.projectsTitle}</Text>

          <Text style={[styles.th, styles.colType]}>{compareLabels.table.type}</Text>

          <Text style={[styles.th, styles.colLocation]}>{pd.locationTitle}</Text>

          <Text style={[styles.th, styles.colTier]}>{pd.rtmsTierTitle}</Text>

          <Text style={[styles.th, styles.colDate]}>{pd.certifiedAtTitle}</Text>

          <Text style={[styles.th, styles.colRtms]}>{pd.descriptionTitle}</Text>

        </View>



        {pdfRows.map((row) => (

          <View key={`${row.name}-${row.certifiedAt}`} style={styles.tableRow}>

            <View style={styles.colName}>

              <Text style={styles.td}>{row.name}</Text>

            </View>

            <View style={styles.colType}>

              <Text style={styles.td}>{row.type}</Text>

            </View>

            <View style={styles.colLocation}>

              <Text style={styles.td}>{row.location}</Text>

            </View>

            <View style={styles.colTier}>

              <Text style={styles.td}>{row.tier}</Text>

              <Text style={[styles.td, { fontSize: 6, color: MUTED, marginTop: 2 }]}>

                {row.rtmsTierNote}

              </Text>

            </View>

            <View style={styles.colDate}>

              <Text style={styles.td}>{row.certifiedAt}</Text>

            </View>

            <View style={styles.colRtms}>

              <Text style={styles.td}>{row.rtmsSnippet}</Text>

            </View>

          </View>

        ))}



        {expertRows.length > 0 ? (

          <>

            <Text style={styles.sectionTitle}>{labels.expertsTitle}</Text>

            {expertRows.map((ex) => (

              <View key={`${ex.name}-${ex.certifiedAt}`} style={styles.expertRow}>

                <Text style={styles.td}>{ex.name}</Text>

                <Text style={[styles.td, { color: MUTED }]}>

                  {ex.specialty} · {ex.certifiedAt}

                </Text>

              </View>

            ))}

          </>

        ) : null}



        <Text style={styles.footer} fixed>
          {certifiedLabel}
          {"\n"}
          {integrityLine}
          {"\n"}
          {exportFooter}
          {"\n"}
          {disclaimer}
        </Text>

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

  experts: GreenRegistryExpertRow[],

  labels: GreenMessages["registry"],

  compareLabels: GreenMessages["compare"],

  locale: Locale,

  options: { tierFilter?: GreenRegistryTierFilter; disclaimer?: string } = {}

): Promise<Blob> {

  const pdfRows = greenRegistryProjectsToPdfRows(projects, labels, compareLabels, locale);

  const expertRows = greenRegistryExpertsToPdfRows(experts);

  const meta = greenRegistryPdfMeta(projects, experts);

  const filterNote = registryPdfFilterNote(labels, options.tierFilter ?? "all");

  const exportedAtIso = new Date().toISOString();
  const generatedAt = exportedAtIso.slice(0, 10);
  const projectIds = projects.map((project) => project.id);
  const expertIds = experts.map((expert) => expert.id);
  const integrityLine = await resolveRegistryPdfIntegrityLine(
    projectIds,
    expertIds,
    locale
  );

  return pdf(

    <RegistryDocument

      labels={labels}

      compareLabels={compareLabels}

      pdfRows={pdfRows}

      expertRows={expertRows}

      meta={meta}

      filterNote={filterNote}

      generatedAt={generatedAt}

      disclaimer={options.disclaimer ?? labels.pilotNote}

      certifiedLabel={registryPdfCertifiedLabel(exportedAtIso, locale)}

      integrityLine={integrityLine}

      exportFooter={registryPdfExportFooter(generatedAt, locale)}

      opsNote={labels.exportOpsNote}

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


