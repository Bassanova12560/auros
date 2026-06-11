export type GlossaryCategoryId =
  | "mica"
  | "token-standards"
  | "structures"
  | "markets"
  | "green-esg";

export type GlossaryInternalLink = {
  href: string;
  label: string;
};

export type GlossaryFaqItem = {
  question: string;
  answer: string;
};

export type GlossaryTerm = {
  slug: string;
  title: string;
  titleEn?: string;
  titleEs?: string;
  category: GlossaryCategoryId;
  shortDefinition: string;
  extended: string;
  relatedTerms: string[];
  internalLinks: GlossaryInternalLink[];
  faq?: GlossaryFaqItem[];
};

export type GlossaryCategory = {
  id: GlossaryCategoryId;
  label: string;
  labelEn: string;
  labelEs: string;
  description: string;
};
