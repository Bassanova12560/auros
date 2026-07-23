/**
 * Server-signed Compare Report PDF — indicative shortlist artifact.
 * HMAC attestation via auros-compare:v1: (same family as snapshot proofs).
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
import type { ReactElement } from "react";

import type { HubProduct } from "./compare-hub";
import { resolveCompareEntity } from "./entity-graph";
import {
  buildCompareProof,
} from "./api/signing";
import { COMPARE_REPORT_MAX } from "./compare-report";

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

const INK = "#171717";
const MUTED = "#737373";
const ACCENT = "#9F2F2D";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Space Mono",
    fontSize: 8,
    color: INK,
    backgroundColor: "#fafafa",
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: ACCENT,
    paddingBottom: 10,
  },
  brand: { fontSize: 7, letterSpacing: 2, color: ACCENT },
  title: { fontSize: 14, marginTop: 6, fontWeight: 700 },
  subtitle: { fontSize: 8, color: MUTED, marginTop: 4, lineHeight: 1.4 },
  meta: { fontSize: 7, color: MUTED, marginTop: 6 },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: ACCENT,
    paddingBottom: 6,
    marginBottom: 4,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 6,
  },
  colPlatform: { width: "22%" },
  colProduct: { width: "22%" },
  colApy: { width: "12%" },
  colTvl: { width: "16%" },
  colRisk: { width: "12%" },
  colEntity: { width: "16%" },
  th: { fontSize: 7, fontWeight: 700, color: ACCENT },
  td: { fontSize: 7, color: INK },
  disclaimer: {
    marginTop: 16,
    fontSize: 7,
    color: MUTED,
    lineHeight: 1.45,
  },
  proof: {
    marginTop: 10,
    fontSize: 6,
    color: MUTED,
    lineHeight: 1.4,
  },
});

export type CompareReportPdfStrings = {
  brand: string;
  title: string;
  subtitle: string;
  asOf: string;
  colPlatform: string;
  colProduct: string;
  colApy: string;
  colTvl: string;
  colRisk: string;
  colEntity: string;
  indicative: string;
  apyNote: string;
};

export function compareReportPdfStrings(
  locale: string
): CompareReportPdfStrings {
  if (locale.startsWith("fr")) {
    return {
      brand: "AUROS · COMPARE REPORT",
      title: "Rapport compare (indicatif)",
      subtitle:
        "Snapshot shortlist — pas un conseil d'investissement ; APY jamais inventé.",
      asOf: "As of",
      colPlatform: "Plateforme",
      colProduct: "Produit",
      colApy: "APY*",
      colTvl: "TVL USD",
      colRisk: "Risque",
      colEntity: "entity_id",
      indicative:
        "Données indicatives — vérifiez chaque plateforme avant toute décision. Sources live ou manuelles selon citation API.",
      apyNote: "* APY indicatif — never invented / non inventé.",
    };
  }
  if (locale.startsWith("es")) {
    return {
      brand: "AUROS · COMPARE REPORT",
      title: "Informe compare (indicativo)",
      subtitle:
        "Snapshot shortlist — no es consejo de inversión; APY nunca inventado.",
      asOf: "As of",
      colPlatform: "Plataforma",
      colProduct: "Producto",
      colApy: "APY*",
      colTvl: "TVL USD",
      colRisk: "Riesgo",
      colEntity: "entity_id",
      indicative:
        "Datos indicativos — verifique cada plataforma antes de decidir.",
      apyNote: "* APY indicativo — never invented.",
    };
  }
  if (locale.startsWith("ar")) {
    return {
      brand: "AUROS · COMPARE REPORT",
      title: "تقرير مقارنة (إرشادي)",
      subtitle: "لقطة shortlist — ليست نصيحة استثمارية؛ لا يُختلق APY.",
      asOf: "As of",
      colPlatform: "المنصة",
      colProduct: "المنتج",
      colApy: "APY*",
      colTvl: "TVL USD",
      colRisk: "المخاطر",
      colEntity: "entity_id",
      indicative: "بيانات إرشادية — تحقق من كل منصة قبل أي قرار.",
      apyNote: "* APY إرشادي — never invented.",
    };
  }
  if (locale.startsWith("zh")) {
    return {
      brand: "AUROS · COMPARE REPORT",
      title: "比较报告（示意）",
      subtitle: "短名单快照 — 非投资建议；从不编造 APY。",
      asOf: "As of",
      colPlatform: "平台",
      colProduct: "产品",
      colApy: "APY*",
      colTvl: "TVL USD",
      colRisk: "风险",
      colEntity: "entity_id",
      indicative: "示意数据 — 决策前请核实各平台。",
      apyNote: "* 示意 APY — never invented.",
    };
  }
  return {
    brand: "AUROS · COMPARE REPORT",
    title: "Compare Report (indicative)",
    subtitle:
      "Shortlist snapshot — not investment advice; APY never invented.",
    asOf: "As of",
    colPlatform: "Platform",
    colProduct: "Product",
    colApy: "APY*",
    colTvl: "TVL USD",
    colRisk: "Risk",
    colEntity: "entity_id",
    indicative:
      "Indicative data — verify each platform before any decision. Live or manual sources per API citation.",
    apyNote: "* Indicative APY — never invented.",
  };
}

function formatUsd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

export type CompareReportAttestation = {
  content_hash: string;
  signature: string | null;
  signed: boolean;
  prefix: string;
  as_of: string;
  product_ids: string[];
};

export function buildCompareReportAttestation(
  products: HubProduct[],
  asOf: string
): CompareReportAttestation {
  const rows = products.slice(0, COMPARE_REPORT_MAX).map((p) => {
    const entity = resolveCompareEntity(p);
    return {
      id: p.row.id,
      entity_id: entity.entity_id,
      issuer_key: entity.issuer_key,
      platform: p.row.platform,
      product: p.row.product,
      apy: p.row.apy,
      tvl_usd: p.row.tvlUsd,
      risk_tier: p.riskTier,
      live: p.row.live,
      chains: p.row.chains,
    };
  });
  const core = {
    schema: "auros.compare.report.pdf.v1" as const,
    as_of: asOf,
    products: rows,
    policy: {
      never_invent_apy: true as const,
      indicative_only: true as const,
    },
  };
  const proof = buildCompareProof(core);
  return {
    content_hash: proof.content_hash,
    signature: proof.signature,
    signed: proof.signed,
    prefix: proof.prefix,
    as_of: asOf,
    product_ids: rows.map((r) => r.id),
  };
}

function CompareReportDocument({
  products,
  asOf,
  locale,
  attestation,
}: {
  products: HubProduct[];
  asOf: string;
  locale: string;
  attestation: CompareReportAttestation;
}): ReactElement<DocumentProps> {
  const copy = compareReportPdfStrings(locale);
  const rows = products.slice(0, COMPARE_REPORT_MAX);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>{copy.brand}</Text>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
          <Text style={styles.meta}>
            {copy.asOf} {asOf}
          </Text>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.colPlatform]}>{copy.colPlatform}</Text>
          <Text style={[styles.th, styles.colProduct]}>{copy.colProduct}</Text>
          <Text style={[styles.th, styles.colApy]}>{copy.colApy}</Text>
          <Text style={[styles.th, styles.colTvl]}>{copy.colTvl}</Text>
          <Text style={[styles.th, styles.colRisk]}>{copy.colRisk}</Text>
          <Text style={[styles.th, styles.colEntity]}>{copy.colEntity}</Text>
        </View>

        {rows.map((p) => {
          const entity = resolveCompareEntity(p);
          return (
            <View key={p.row.id} style={styles.row} wrap={false}>
              <Text style={[styles.td, styles.colPlatform]}>
                {p.row.platform}
              </Text>
              <Text style={[styles.td, styles.colProduct]}>{p.row.product}</Text>
              <Text style={[styles.td, styles.colApy]}>
                {Number.isFinite(p.row.apy) ? `${p.row.apy}%` : "—"}
              </Text>
              <Text style={[styles.td, styles.colTvl]}>
                {formatUsd(p.row.tvlUsd)}
              </Text>
              <Text style={[styles.td, styles.colRisk]}>{p.riskTier}</Text>
              <Text style={[styles.td, styles.colEntity]}>
                {entity.entity_id}
              </Text>
            </View>
          );
        })}

        <Text style={styles.disclaimer}>
          {copy.indicative} {copy.apyNote}
        </Text>
        <Text style={styles.proof}>
          Attestation HMAC {attestation.prefix}
          {"\n"}
          content_hash={attestation.content_hash}
          {attestation.signature
            ? `\nsignature=${attestation.signature}`
            : "\nsigned=false (set ATTEST_SIGNING_KEY for HMAC)"}
          {"\n"}
          verify: POST /api/compare/verify
        </Text>
      </Page>
    </Document>
  );
}

export async function generateCompareReportPdf(input: {
  products: HubProduct[];
  asOf: string;
  locale?: string;
}): Promise<{ blob: Blob; attestation: CompareReportAttestation }> {
  const locale = input.locale ?? "en";
  const attestation = buildCompareReportAttestation(
    input.products,
    input.asOf
  );
  const doc = (
    <CompareReportDocument
      products={input.products}
      asOf={input.asOf}
      locale={locale}
      attestation={attestation}
    />
  );
  const blob = await pdf(doc).toBlob();
  return { blob, attestation };
}

export function compareReportPdfFilename(productIds: string[]): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const slug = productIds.slice(0, 3).join("_").slice(0, 48) || "shortlist";
  return `auros-compare-report-${slug}-${stamp}.pdf`;
}
