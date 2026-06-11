export const PROTOCOL_DOCS_ROUTE = "/developers/docs";

export function protocolDocPath(slug: string): string {
  return `${PROTOCOL_DOCS_ROUTE}/${slug}`;
}
