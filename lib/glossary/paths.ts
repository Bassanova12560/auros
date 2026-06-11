export const GLOSSARY_ROUTE = "/glossary";

export function glossaryTermPath(slug: string): string {
  return `${GLOSSARY_ROUTE}/${slug}`;
}
