/** Client-side marketplace search (city, country, actor name). */
export function matchesGreenMarketSearch(
  query: string,
  fields: { name?: string; city?: string; country?: string; region?: string }
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [fields.name, fields.city, fields.country, fields.region]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
