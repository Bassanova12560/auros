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
import { getGreenMessages } from "@/lib/green/i18n";
import {
  GREEN_RTMS_PILLARS,
  GREEN_WIZARD_ASSET_TYPE,
} from "@/lib/green/constants";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";
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
  locale?: Locale;
};

function resolveLocale(dossier: GreenDossierPdfInput): Locale {
  const l = dossier.locale;
  return l && isLocale(l) ? l : DEFAULT_LOCALE;
}

function GreenDocument({ dossier }: { dossier: GreenDossierPdfInput }) {
  const locale = resolveLocale(dossier);
  const m = getGreenMessages(locale);
  const data = dossier.data ?? {};
  const rtms = dossier.greenRtms;
  const date = (dossier.generatedAt ? new Date(dossier.generatedAt) : new Date())
    .toISOString()
    .slice(0, 10);

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

        <Text style={styles.footer}>
          AUROS Green · indicative RTMS grid — not legal advice · auros-delta.vercel.app/green
        </Text>
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
