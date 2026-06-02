import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

import type { Locale } from "@/lib/i18n";

import { getEnterpriseMessages } from "./enterprise-messages";
import {
  STARTER_KIT_PRICE_EUR,
  STARTER_KIT_VALUE_STACK,
  starterKitMarketTotal,
  starterKitSavingsPercent,
} from "./starter-kit-value";

const styles = StyleSheet.create({
  page: {
    padding: 44,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
    lineHeight: 1.45,
  },
  brand: { fontSize: 8, letterSpacing: 2, marginBottom: 16, color: "#666" },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 6 },
  subtitle: { fontSize: 10, color: "#444", marginBottom: 20 },
  section: { fontSize: 10, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 5,
  },
  rowLabel: { flex: 1, paddingRight: 12, color: "#333" },
  rowValue: { width: 72, textAlign: "right", color: "#555" },
  totalStrike: {
    textDecoration: "line-through",
    color: "#888",
    fontSize: 11,
    marginTop: 10,
  },
  totalPrice: { fontSize: 18, fontWeight: 700, marginTop: 4 },
  savings: { fontSize: 9, color: "#1a6640", marginTop: 4 },
  bullet: { marginLeft: 8, marginBottom: 3, color: "#444" },
  footer: { marginTop: 24, fontSize: 7, color: "#777" },
});

function formatEur(value: number) {
  return `${value.toLocaleString("fr-FR")} €`;
}

export async function generateStarterKitOverviewPdf(
  locale: Locale = "fr"
): Promise<Blob> {
  const v = getEnterpriseMessages(locale).valueStack;
  const m = getEnterpriseMessages(locale).starterKitPage;
  const marketTotal = starterKitMarketTotal();
  const savings = starterKitSavingsPercent();

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>AUROS · RWA JURISDICTIONS</Text>
        <Text style={styles.title}>{m.h1}</Text>
        <Text style={styles.subtitle}>{m.subtitle}</Text>

        <Text style={styles.section}>{v.title}</Text>
        {STARTER_KIT_VALUE_STACK.map((row) => (
          <View key={row.id} style={styles.row}>
            <Text style={styles.rowLabel}>
              {v.items[row.labelKey] ?? row.labelKey}
            </Text>
            <Text style={styles.rowValue}>
              {formatEur(row.marketValueEur)}
            </Text>
          </View>
        ))}

        <Text style={styles.totalStrike}>
          {v.totalMarket}: {formatEur(marketTotal)}
        </Text>
        <Text style={styles.totalPrice}>
          {v.yourPrice}: {formatEur(STARTER_KIT_PRICE_EUR)}
        </Text>
        <Text style={styles.savings}>{v.savings(savings)}</Text>

        <Text style={styles.section}>{m.includedTitle}</Text>
        {m.included.slice(0, 6).map((item, i) => (
          <Text key={`inc-${i}`} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={styles.section}>{m.excludedTitle}</Text>
        {m.excluded.slice(0, 4).map((item, i) => (
          <Text key={`exc-${i}`} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={styles.footer}>{v.footnote}</Text>
        <Text style={styles.footer}>
          auros-delta.vercel.app/jurisdictions/starter-kit ·{" "}
          {new Date().toISOString().slice(0, 10)}
        </Text>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}
