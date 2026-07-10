export type ProtocolDocSection = {
  heading: string;
  paragraphs: string[];
  code?: string;
  language?: "bash" | "typescript" | "python" | "json" | "html";
  links?: { href: string; label: string }[];
};

export type ProtocolDocPage = {
  slug: string;
  title: string;
  description: string;
  category: "getting-started" | "endpoints" | "guides";
  categoryLabel: string;
  sections: ProtocolDocSection[];
  relatedSlugs: string[];
};
