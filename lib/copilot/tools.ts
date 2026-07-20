import { searchRag } from "@/lib/ai-first/rag";
import { listProtocolProducts } from "@/lib/protocol/products/adapter";
import { buildProtocolCompare } from "@/lib/protocol/compare/build";
import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import {
  CHARGEFLOW_CONSOLE_ROUTE,
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
} from "@/lib/chargeflow/constants";

import type { CopilotCitation, CopilotPageContext } from "./types";

export type CopilotToolResult = {
  name: string;
  summary: string;
  citations: CopilotCitation[];
  data?: unknown;
};

function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://getauros.com"
  );
}

export async function toolSearchKnowledge(
  query: string
): Promise<CopilotToolResult> {
  const rag = searchRag({ query, limit: 6 });
  const citations: CopilotCitation[] = rag.sources.slice(0, 5).map((s) => ({
    title: s.title,
    url: s.canonicalUrl,
  }));
  return {
    name: "search_knowledge",
    summary: rag.context.slice(0, 3500),
    citations,
    data: { hits: rag.results.length, sources: rag.sources.length },
  };
}

export async function toolListProducts(query?: {
  category?: string;
  limit?: number;
  product_ids?: string[];
}): Promise<CopilotToolResult> {
  const category =
    (query?.category as
      | "all"
      | "stablecoins"
      | "real_estate"
      | "bonds"
      | "commodities"
      | "private_credit"
      | undefined) ?? "all";
  const listed = await listProtocolProducts({
    category,
    page: 1,
    limit: Math.min(query?.limit ?? 8, 20),
    sort: "apy",
  });
  let products = listed.products;
  if (query?.product_ids?.length) {
    const want = new Set(query.product_ids.map((id) => id.toLowerCase()));
    products = listed.products.filter((p) => want.has(p.id.toLowerCase()));
    if (products.length === 0) {
      // Hub page may not include all; try wider fetch
      const wide = await listProtocolProducts({
        category: "all",
        page: 1,
        limit: 100,
        sort: "tvl",
      });
      products = wide.products.filter((p) => want.has(p.id.toLowerCase()));
    }
  }
  const lines = products.map(
    (p) =>
      `- ${p.id}: ${p.name} (${p.platform}) · APY ${p.apy}% · TVL $${Math.round(p.tvl_usd).toLocaleString("en-US")} · ${p.jurisdiction ?? "n/a"}`
  );
  return {
    name: "list_products",
    summary:
      lines.length > 0
        ? `Products (${products.length}):\n${lines.join("\n")}`
        : "No products matched.",
    citations: [
      { title: "Comparateur RWA", url: `${siteBase()}/compare` },
      {
        title: "API products",
        url: `${siteBase()}/developers/docs/endpoint-products`,
      },
    ],
    data: { total: products.length, sample: products.slice(0, 5) },
  };
}

export async function toolCompareProducts(
  productIds: string[]
): Promise<CopilotToolResult> {
  const ids = productIds.slice(0, 4);
  if (ids.length < 2) {
    return {
      name: "compare_products",
      summary: "Need 2–4 product_ids to compare.",
      citations: [{ title: "Comparateur", url: `${siteBase()}/compare` }],
    };
  }
  const built = await buildProtocolCompare({
    product_ids: ids,
    category: "all",
    limit: 4,
  });
  if (!built.ok) {
    return {
      name: "compare_products",
      summary: built.message,
      citations: [{ title: "Comparateur", url: `${siteBase()}/compare` }],
    };
  }
  const lines = built.data.products.map(
    (p, i) =>
      `- ${p.id}: APY ${p.apy}% · TVL $${Math.round(p.tvl_usd).toLocaleString("en-US")} · highlight_apy=${built.data.comparison.highlights.apy[i] ?? "—"}`
  );
  return {
    name: "compare_products",
    summary: `Compared ${ids.join(", ")}.\n${lines.join("\n")}\nShare: ${built.data.comparison.share_url}`,
    citations: [
      { title: "Comparaison", url: built.data.comparison.share_url },
      {
        title: "Docs compare",
        url: `${siteBase()}/developers/docs/endpoint-compare`,
      },
    ],
    data: built.data,
  };
}

export function toolExplainChargeflow(): CopilotToolResult {
  return {
    name: "explain_chargeflow",
    summary: [
      "AUROS ChargeFlow registers off-chain flow units:",
      "- CFU-E: energy kWh (sessions / CPO / fleets)",
      "- CFU-W: water m³",
      "- CFU-F: capacity kW windows",
      "Premium mint + public verify. Partner connectors (Tesla Fleet / TotalEnergies / OCPI) are format-compatible adapters — not official manufacturer partnerships.",
      `UI: ${CHARGEFLOW_ROUTE}, fleets ${CHARGEFLOW_FLEETS_ROUTE}, console ${CHARGEFLOW_CONSOLE_ROUTE}.`,
    ].join("\n"),
    citations: [
      { title: "ChargeFlow pitch", url: `${siteBase()}${CHARGEFLOW_ROUTE}` },
      {
        title: "Fleets / CPO",
        url: `${siteBase()}${CHARGEFLOW_FLEETS_ROUTE}`,
      },
      {
        title: "Docs CFU-E",
        url: `${siteBase()}/developers/docs/endpoint-chargeflow`,
      },
    ],
  };
}

export function toolListJurisdictions(focusId?: string): CopilotToolResult {
  const top = [...JURISDICTIONS]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((j) => `- ${j.id}: score ${j.score}/5`)
    .join("\n");
  const focus = focusId
    ? JURISDICTIONS.find((j) => j.id === focusId)
    : undefined;
  const focusBlock = focus
    ? `\nFocus ${focus.id}: score ${focus.score}/5 · fee mid ~€${focus.totalCostMid.toLocaleString("en-US")} · delay ${focus.delayMinMonths}–${focus.delayMaxMonths} months.`
    : "";
  return {
    name: "list_jurisdictions",
    summary: `Top jurisdictions by AUROS score:\n${top}${focusBlock}`,
    citations: [
      { title: "Jurisdictions", url: `${siteBase()}/jurisdictions` },
      ...(focus
        ? [
            {
              title: `Juridiction ${focus.id}`,
              url: `${siteBase()}/jurisdictions?jid=${encodeURIComponent(focus.id)}`,
            },
          ]
        : []),
    ],
  };
}

/** Heuristic tool selection — no model tool-calling required. */
export async function runCopilotTools(
  message: string,
  context?: CopilotPageContext
): Promise<CopilotToolResult[]> {
  const q = message.toLowerCase();
  const results: CopilotToolResult[] = [];
  const productIds = context?.product_ids?.slice(0, 4) ?? [];

  results.push(await toolSearchKnowledge(message));

  const wantChargeflow =
    context?.surface === "chargeflow" ||
    /chargeflow|cfu-|cfu_e|cfu_w|cfu_f|ocpi|tesla|total.?energ|flotte|cpo/.test(
      q
    );
  if (wantChargeflow) {
    results.push(toolExplainChargeflow());
  }

  const wantJurisdictions =
    Boolean(context?.jurisdiction_id) ||
    context?.surface === "jurisdiction" ||
    /juridiction|jurisdiction|luxembourg|liechtenstein|swiss|suisse|dubai/.test(
      q
    );
  if (wantJurisdictions) {
    results.push(toolListJurisdictions(context?.jurisdiction_id));
  }

  if (productIds.length >= 2) {
    try {
      results.push(await toolCompareProducts(productIds));
    } catch (err) {
      console.warn("[copilot] compare_products context", err);
      results.push({
        name: "compare_products",
        summary: "Compare hub unavailable in this runtime.",
        citations: [{ title: "Comparateur", url: `${siteBase()}/compare` }],
      });
    }
  } else if (productIds.length === 1) {
    try {
      results.push(
        await toolListProducts({ product_ids: productIds, limit: 8 })
      );
    } catch (err) {
      console.warn("[copilot] list_products context", err);
    }
  } else {
    const compareMatch = q.match(
      /compare[r]?\s+([a-z0-9_-]+)\s+(?:et|and|,|vs|versus)\s+([a-z0-9_-]+)/i
    );
    if (compareMatch) {
      try {
        results.push(
          await toolCompareProducts([compareMatch[1]!, compareMatch[2]!])
        );
      } catch (err) {
        console.warn("[copilot] compare_products", err);
        results.push({
          name: "compare_products",
          summary: "Compare hub unavailable in this runtime.",
          citations: [{ title: "Comparateur", url: `${siteBase()}/compare` }],
        });
      }
    } else if (
      context?.surface === "compare" ||
      /produit|product|apy|tvl|comparat|yield|stablecoin|rwa/.test(q)
    ) {
      let category:
        | "all"
        | "stablecoins"
        | "real_estate"
        | "bonds"
        | "commodities"
        | "private_credit" = "all";
      if (/stablecoin/.test(q)) category = "stablecoins";
      else if (/immobilier|real.?estate|estate/.test(q))
        category = "real_estate";
      else if (/bond|obligation/.test(q)) category = "bonds";
      else if (/commodit|mati[eè]re/.test(q)) category = "commodities";
      else if (/private.?credit|cr[eé]dit/.test(q))
        category = "private_credit";
      try {
        results.push(await toolListProducts({ category, limit: 8 }));
      } catch (err) {
        console.warn("[copilot] list_products", err);
        results.push({
          name: "list_products",
          summary:
            "Product hub temporarily unavailable in this runtime. Use /compare on the site.",
          citations: [
            {
              title: "Comparateur RWA",
              url: `${siteBase()}/compare`,
            },
          ],
        });
      }
    }
  }

  return results;
}
