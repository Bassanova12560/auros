/**
 * Green dossier PDF — RTMS grid for renewable energy wizard path.
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
import { getGreenComplianceCopy } from "@/lib/green/compliance-i18n";
import { getGreenMessages } from "@/lib/green/i18n";
import {
  GREEN_RTMS_PILLARS,
  GREEN_WIZARD_ASSET_TYPE,
} from "@/lib/green/constants";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";
import type { GreenComplianceScore } from "@/lib/green/scoring/green-compliance";
import type { StoredDossier } from "@/lib/pdf";

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
    marginBottom: 24,
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
    marginTop: 20,
    marginBottom: 16,
  },
  scoreBig: { fontSize: 28, fontWeight: 700, color: GREEN },
  section: { marginTop: 14 },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: GREEN,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  pillar: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  pillarHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  grid: { flexDirection: "row", gap: 12 },
  gridCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    padding: 10,
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

export type GreenDossierPdfInput = StoredDossier & {
  greenRtms?: GreenRtmsScore;
  greenCompliance?: GreenComplianceScore;
  locale?: Locale;
};


function resolveLocale(dossier: GreenDossierPdfInput): Locale {
  const l = dossier.locale;
  return l && isLocale(l) ? l : DEFAULT_LOCALE;
}

function GreenDocument({ dossier }: { dossier: GreenDossierPdfInput }) {
  const locale = resolveLocale(dossier);
  const m = getGreenMessages(locale);
  const complianceCopy = getGreenComplianceCopy(locale);
  const data = dossier.data ?? {};
  const rtms = dossier.greenRtms;
  const compliance = dossier.greenCompliance;
  const date = (dossier.generatedAt ? new Date(dossier.generatedAt) : new Date())
    .toISOString()
    .slice(0, 10);

  const taxonomyLabel = complianceCopy.panelEyebrow;
  const prioritiesLabel =
    locale === "fr"
      ? "Priorités (max 3)"
      : locale === "es"
        ? "Prioridades (máx. 3)"
        : "Priorities (max 3)";
  const footerNote =
    locale === "fr"
      ? "AUROS Green · grille RTMS indicative — pas un avis juridique"
      : locale === "es"
        ? "AUROS Green · cuadrícula RTMS indicativa — no es asesoramiento jurídico"
        : "AUROS Green · indicative RTMS grid — not legal advice";

  const docProps: DocumentProps = {
    title: `AUROS Green RTMS — ${data.assetType ?? GREEN_WIZARD_ASSET_TYPE}`,
    author: "AUROS",
    subject: "Green RTMS readiness",
    creator: "AUROS",
  };

  return (
    <Document {...docProps}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AUROS GREEN · RTMS</Text>
          <Text style={styles.title}>
            {data.assetType ?? GREEN_WIZARD_ASSET_TYPE}
          </Text>
          <Text style={styles.subtitle}>
            {[data.city, data.country].filter(Boolean).join(", ") || "—"} · {date}
          </Text>
        </View>

        {compliance ? (
          <View style={styles.scoreRow}>
            <View style={{ maxWidth: 300 }}>
              <Text style={styles.sectionLabel}>{taxonomyLabel}</Text>
              <Text style={{ color: MUTED, lineHeight: 1.4 }}>
                {complianceCopy.assetClassLabels[compliance.asset_class]}{" "}
                {complianceCopy.alignmentSuffix}
              </Text>
            </View>
            <Text style={styles.scoreBig}>{compliance.eu_taxonomy_alignment}</Text>
          </View>
        ) : null}

        {compliance ? (
          <View style={styles.grid}>
            <View style={styles.gridCell}>
              <Text style={styles.sectionLabel}>{complianceCopy.sfdrLabel}</Text>
              <Text>{complianceCopy.sfdrLabels[compliance.sfdr_classification]}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.sectionLabel}>{complianceCopy.gbsLabel}</Text>
              <Text>{complianceCopy.gbsLabels[compliance.eu_gbs_eligible]}</Text>
            </View>
          </View>
        ) : null}

        {compliance && compliance.priority_keys.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{prioritiesLabel}</Text>
            {compliance.priority_keys.slice(0, 3).map((key) => (
              <Text key={key} style={styles.bullet}>
                · {complianceCopy.priorities[key]}
              </Text>
            ))}
          </View>
        ) : null}

        {compliance ? (
          <View style={styles.section}>
            <Text style={{ color: MUTED, lineHeight: 1.4, fontSize: 8 }}>
              {complianceCopy.disclaimer}
            </Text>
          </View>
        ) : null}

        {rtms ? (
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.sectionLabel}>{m.hub.widgets.rtms.label}</Text>
              <Text style={{ color: MUTED, maxWidth: 280 }}>
                {m.hub.widgets.rtms.subtitle}
              </Text>
            </View>
            <Text style={styles.scoreBig}>{rtms.overall}</Text>
          </View>
        ) : null}

        {rtms
          ? GREEN_RTMS_PILLARS.map((pillar) => {
              const meta = m.standards.pillars[pillar];
              const pillarScore = rtms.pillars[pillar].score;
              return (
                <View key={pillar} style={styles.pillar}>
                  <View style={styles.pillarHead}>
                    <Text style={{ fontWeight: 700 }}>{meta.name}</Text>
                    <Text style={{ color: GREEN }}>{pillarScore}%</Text>
                  </View>
                  <Text style={{ color: MUTED, marginBottom: 6 }}>{meta.tagline}</Text>
                  {meta.bullets.map((bullet) => (
                    <Text key={bullet} style={styles.bullet}>
                      · {bullet}
                    </Text>
                  ))}
                </View>
              );
            })
          : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {locale === "fr" ? "Description" : locale === "es" ? "Descripción" : "Description"}
          </Text>
          <Text style={{ color: MUTED, lineHeight: 1.5 }}>
            {String(data.description ?? "—").slice(0, 900)}
          </Text>
        </View>

        <Text style={styles.footer}>{footerNote} · getauros.com/green</Text>
      </Page>
    </Document>
  );
}

export async function generateGreenDossierPDF(
  dossier: GreenDossierPdfInput
): Promise<Blob> {
  return pdf(<GreenDocument dossier={dossier} />).toBlob();
}

export function suggestedGreenFilename(dossier: GreenDossierPdfInput): string {
  const date = (dossier.generatedAt ? new Date(dossier.generatedAt) : new Date())
    .toISOString()
    .slice(0, 10);
  return `AUROS_Green_RTMS_${date}.pdf`;
}
