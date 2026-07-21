import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

import type { ContinuityPlaybook } from "@/lib/wets/continuity-playbook";

Font.register({
  family: "Space Mono",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYE58RWq7.ttf",
      fontWeight: 400,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Space Mono", fontSize: 9, color: "#111" },
  h1: { fontSize: 14, marginBottom: 8 },
  h2: { fontSize: 11, marginTop: 12, marginBottom: 4 },
  p: { marginBottom: 6, lineHeight: 1.4 },
  muted: { fontSize: 8, color: "#444", marginTop: 16 },
});

export async function continuityPlaybookPdfBlob(
  playbook: ContinuityPlaybook
): Promise<Blob> {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>AUROS — Playbook continuité (indicatif)</Text>
        <Text style={styles.p}>{playbook.input_summary}</Text>
        <Text style={styles.p}>{playbook.executive_summary}</Text>
        {playbook.scenarios.map((s) => (
          <View key={s.id}>
            <Text style={styles.h2}>{s.title}</Text>
            <Text style={styles.p}>{s.trigger}</Text>
            {s.actions.map((a) => (
              <Text key={a} style={styles.p}>
                • {a}
              </Text>
            ))}
            <Text style={styles.p}>
              CAPEX {s.capex_eur_m[0]}–{s.capex_eur_m[1]} M€ · Δ OPEX{" "}
              {s.opex_delta_eur_m_year[0]}–{s.opex_delta_eur_m_year[1]} M€/an
            </Text>
          </View>
        ))}
        <Text style={styles.muted}>{playbook.disclaimer}</Text>
      </Page>
    </Document>
  );
  return pdf(doc).toBlob();
}
