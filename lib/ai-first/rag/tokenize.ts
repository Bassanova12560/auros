const STOP_WORDS = new Set([
  "a",
  "au",
  "aux",
  "avec",
  "ce",
  "ces",
  "dans",
  "de",
  "des",
  "du",
  "en",
  "et",
  "est",
  "for",
  "how",
  "il",
  "is",
  "la",
  "le",
  "les",
  "mon",
  "my",
  "on",
  "ou",
  "our",
  "par",
  "pour",
  "que",
  "qui",
  "the",
  "to",
  "un",
  "une",
  "what",
  "where",
  "which",
]);

/** Normalize French/English text for lexical search. */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  if (!normalized) return [];
  return normalized
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}
