import { GREEN_ESG_TERMS } from "./green-esg";
import { MARKETS_TERMS } from "./markets";
import { MICA_TERMS } from "./mica";
import { STRUCTURES_TERMS } from "./structures";
import { TOKEN_STANDARDS_TERMS } from "./token-standards";
import type { GlossaryCategoryId, GlossaryTerm } from "../types";

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  ...MICA_TERMS,
  ...TOKEN_STANDARDS_TERMS,
  ...STRUCTURES_TERMS,
  ...MARKETS_TERMS,
  ...GREEN_ESG_TERMS,
];

const bySlug = new Map<string, GlossaryTerm>(
  GLOSSARY_TERMS.map((term) => [term.slug, term])
);

export function getGlossaryTerm(slug: string): GlossaryTerm | null {
  return bySlug.get(slug) ?? null;
}

export function getAllGlossarySlugs(): string[] {
  return GLOSSARY_TERMS.map((t) => t.slug);
}

export function getGlossaryTermsByCategory(
  category: GlossaryCategoryId
): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((t) => t.category === category);
}

export function getRelatedGlossaryTerms(term: GlossaryTerm): GlossaryTerm[] {
  return term.relatedTerms
    .map((slug) => bySlug.get(slug))
    .filter((t): t is GlossaryTerm => t != null);
}

export function getDefaultTermFaq(term: GlossaryTerm): {
  question: string;
  answer: string;
}[] {
  if (term.faq?.length) return term.faq;
  return [
    {
      question: `Qu'est-ce que ${term.title} en tokenisation RWA ?`,
      answer: `${term.shortDefinition} ${term.extended.split(".")[0]}.`,
    },
    {
      question: `${term.title} : où approfondir avec AUROS ?`,
      answer:
        term.internalLinks.length > 0
          ? `Consultez ${term.internalLinks.map((l) => l.label).join(", ")} sur AUROS — analyses indicatives, counsel requis avant décision.`
          : "Parcourez le glossaire et le wizard AUROS pour structurer votre dossier — sans engagement.",
    },
  ];
}
