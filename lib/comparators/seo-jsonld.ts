import { absoluteUrl } from "./site";

export type ComparatorFaqItem = {
  question: string;
  answer: string;
};

export function buildComparatorItemListJsonLd(input: {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    numberOfItems: input.items.length,
    itemListElement: input.items.slice(0, 25).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "FinancialProduct",
        name: item.name,
        url: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
      },
    })),
  };
}

export function buildComparatorFaqJsonLd(
  faqs: ComparatorFaqItem[],
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(pageUrl),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const COMPARE_HUB_FAQS: ComparatorFaqItem[] = [
  {
    question: "What is an RWA yield comparator?",
    answer:
      "AUROS Compare aggregates tokenized real-world asset products across classes (treasuries, real estate, private credit, equity, commodities, art). Yields are indicative — live rows come from DeFiLlama; others are manually curated and labeled.",
  },
  {
    question: "Are APYs investment advice?",
    answer:
      "No. Figures are educational and may be incomplete, delayed, or unavailable. Always verify access rules, liquidity, fees, and regulation on each issuer before investing.",
  },
  {
    question: "How do live vs manual sources differ?",
    answer:
      "Live products are refreshed from DeFiLlama yields (hourly cache). Manual products are curated public references when pools are not indexed — APY may be 0 when no honest public coupon exists.",
  },
  {
    question: "How should I use side-by-side compare?",
    answer:
      "Select 2–4 products, then open the compare panel to diff APY, TVL, chain, risk profile, liquidity proxy, and data source. Continue to /start for a dossier or /green for water & energy RWAs.",
  },
];
