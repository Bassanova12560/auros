import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

import type { StarterKitContent } from "./starter-kit-types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  title: { fontSize: 14, marginBottom: 8, fontWeight: 700 },
  section: { marginTop: 14, marginBottom: 4, fontSize: 10, fontWeight: 700 },
  body: { marginBottom: 6, color: "#333" },
  bullet: { marginLeft: 8, marginBottom: 3 },
  footer: { marginTop: 24, fontSize: 7, color: "#666" },
});

export async function generateStarterKitPdf(input: {
  firstName: string;
  content: StarterKitContent;
  generatedAt: string;
}): Promise<Blob> {
  const { content, firstName, generatedAt } = input;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>AUROS Starter Kit</Text>
        <Text style={styles.body}>{firstName} · {generatedAt.slice(0, 10)}</Text>

        <Text style={styles.section}>Executive summary</Text>
        <Text style={styles.body}>{content.executiveSummary}</Text>

        <Text style={styles.section}>Recommended structure</Text>
        <Text style={styles.body}>{content.recommendedStructure}</Text>

        <Text style={styles.section}>Jurisdiction rationale</Text>
        <Text style={styles.body}>{content.jurisdictionRationale}</Text>

        <Text style={styles.section}>Regulatory checklist</Text>
        {content.regulatoryChecklist.map((item, i) => (
          <Text key={`c-${i}`} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={styles.section}>Timeline</Text>
        {content.timeline.map((t, i) => (
          <Text key={`t-${i}`} style={styles.bullet}>
            • {t.phase} ({t.duration}): {t.actions}
          </Text>
        ))}

        <Text style={styles.section}>Tech providers</Text>
        {content.techProviders.map((t, i) => (
          <View key={`p-${i}`} style={{ marginBottom: 6 }}>
            <Text style={styles.bullet}>• {t.name}</Text>
            <Text style={{ marginLeft: 12, color: "#444" }}>{t.fit}</Text>
          </View>
        ))}

        <Text style={styles.section}>Next steps</Text>
        {content.nextSteps.map((s, i) => (
          <Text key={`n-${i}`} style={styles.bullet}>
            • {s}
          </Text>
        ))}

        <Text style={styles.footer}>{content.disclaimer}</Text>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}
