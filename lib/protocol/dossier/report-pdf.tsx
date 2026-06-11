/**
 * AUROS Protocol institutional dossier PDF — @react-pdf/renderer (condensed v1, ~10 pages).
 */

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

import { PROTOCOL_DISCLAIMER } from "../constants";
import type { DossierPayload } from "./generate";

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
  coverTitle: { fontSize: 20, fontWeight: 700, marginTop: 80 },
  coverSub: { fontSize: 10, color: MUTED, marginTop: 12 },
  brand: { fontSize: 7, letterSpacing: 2, color: BRAND },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
    color: BRAND,
  },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: "40%", color: MUTED },
  value: { width: "60%" },
  bullet: { marginBottom: 3, lineHeight: 1.4 },
  scoreBig: { fontSize: 36, fontWeight: 700, color: BRAND },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 6,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
  },
  note: { fontSize: 7, color: MUTED, marginTop: 8, lineHeight: 1.4 },
});

function CoverPage({ payload }: { payload: DossierPayload }) {
  const company = payload.branding?.company_name ?? "AUROS Protocol";
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.brand}>AUROS · PROTOCOL DOSSIER</Text>
      <Text style={styles.coverTitle}>Institutional MiCA Readiness Report</Text>
      <Text style={styles.coverSub}>
        {company} · Generated {new Date(payload.created_at).toLocaleDateString("fr-FR")}
      </Text>
      <Text style={styles.coverSub}>Reference: {payload.id}</Text>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.scoreBig}>{payload.score.score}</Text>
        <Text>Grade {payload.score.grade} · Status {payload.score.status}</Text>
      </View>
      <Text style={styles.footer}>{PROTOCOL_DISCLAIMER}</Text>
    </Page>
  );
}

function ExecutiveSummary({ payload }: { payload: DossierPayload }) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Executive Summary</Text>
      <Text style={styles.note}>
        Indicative MiCA readiness assessment based on structured inputs and AUROS static
        scoring rules. Not legal advice — validate with qualified counsel before issuance.
      </Text>
      <View style={{ marginTop: 16 }}>
        <View style={styles.row}>
          <Text style={styles.label}>Overall score</Text>
          <Text style={styles.value}>
            {payload.score.score}/100 ({payload.score.grade})
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>MiCA classification</Text>
          <Text style={styles.value}>{payload.score.mica_classification}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{payload.score.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Wizard dossier</Text>
          <Text style={styles.value}>{payload.full_report_url}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Critical gaps (max 3 priorities)</Text>
      {payload.score.critical_gaps.slice(0, 3).map((gap, i) => (
        <Text key={i} style={styles.bullet}>
          • {gap}
        </Text>
      ))}
      <Text style={styles.footer}>
        AUROS Protocol v1.0 · Page 2 · {PROTOCOL_DISCLAIMER}
      </Text>
    </Page>
  );
}

function ScoreBreakdown({ payload }: { payload: DossierPayload }) {
  const dims = Object.entries(payload.score.breakdown);
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Score Breakdown — 5 Dimensions</Text>
      {dims.map(([dim, val]) => (
        <View key={dim} style={styles.row}>
          <Text style={styles.label}>{dim.replace(/_/g, " ")}</Text>
          <Text style={styles.value}>{val}/100</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Recommendations</Text>
      {payload.score.recommendations.slice(0, 8).map((rec, i) => (
        <Text key={i} style={styles.bullet}>
          • {rec}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>Recommended jurisdictions</Text>
      {payload.score.recommended_jurisdictions.slice(0, 5).map((j) => (
        <Text key={j.id} style={styles.bullet}>
          • {j.id} ({j.score}) — {j.rationale}
        </Text>
      ))}
      <Text style={styles.footer}>AUROS Protocol v1.0 · Page 3</Text>
    </Page>
  );
}

function ChecklistSection({ payload }: { payload: DossierPayload }) {
  if (!payload.checklist) {
    return (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Compliance Checklist</Text>
        <Text style={styles.note}>No checklist generated for this asset type.</Text>
        <Text style={styles.footer}>AUROS Protocol v1.0</Text>
      </Page>
    );
  }
  const items = payload.checklist.items.slice(0, 15);
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>
        Compliance Checklist — {payload.checklist.jurisdiction}
      </Text>
      <Text style={styles.note}>
        {payload.checklist.total_items} items · ~{payload.checklist.estimated_total_days}{" "}
        days · ~€{payload.checklist.estimated_total_cost_eur.toLocaleString("fr-FR")}
      </Text>
      {items.map((item) => (
        <View key={item.id} style={{ marginBottom: 6 }}>
          <Text style={{ fontWeight: 700, fontSize: 7.5 }}>{item.title}</Text>
          <Text style={styles.note}>
            {item.regulatory_reference} · {item.estimated_time_days}d · €
            {item.estimated_cost_eur}
          </Text>
        </View>
      ))}
      <Text style={styles.footer}>AUROS Protocol v1.0 · Checklist excerpt</Text>
    </Page>
  );
}

function DisclaimersPage() {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Legal Disclaimers</Text>
      <Text style={styles.note}>{PROTOCOL_DISCLAIMER}</Text>
      <Text style={[styles.note, { marginTop: 12 }]}>
        This report is generated automatically from AUROS Protocol static rules. It does not
        constitute a legal opinion, audit, or offer to sell securities. EU MiCA requirements
        evolve — monitor regulatory updates via AUROS Protocol Monitor (premium).
      </Text>
      <Text style={[styles.note, { marginTop: 12 }]}>
        © AUROS · getauros.com · contact@getauros.com
      </Text>
      <Text style={styles.footer}>End of report</Text>
    </Page>
  );
}

function DossierDocument({ payload }: { payload: DossierPayload }) {
  const sections = payload.sections;
  return (
    <Document>
      {sections.includes("executive_summary") && <CoverPage payload={payload} />}
      {sections.includes("executive_summary") && <ExecutiveSummary payload={payload} />}
      {sections.includes("score_breakdown") && <ScoreBreakdown payload={payload} />}
      {(sections.includes("checklist") || sections.includes("mica_classification")) && (
        <ChecklistSection payload={payload} />
      )}
      {sections.includes("disclaimers") && <DisclaimersPage />}
    </Document>
  );
}

export async function generateProtocolDossierPdf(
  payload: DossierPayload
): Promise<Blob> {
  return pdf(<DossierDocument payload={payload} />).toBlob();
}
