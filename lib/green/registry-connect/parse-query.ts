import type { RegistryConnectProvider } from "./types";

export type ParsedRegistryQuery = {
  provider: RegistryConnectProvider;
  /** Normalized serial, e.g. VCS-674 or GS-1234 */
  serial: string;
  raw: string;
};

const PROVIDER_ALIASES: Record<string, RegistryConnectProvider> = {
  verra: "verra",
  vcs: "verra",
  "gold standard": "gold_standard",
  gold_standard: "gold_standard",
  gs: "gold_standard",
  gs4gg: "gold_standard",
  puro: "puro",
  "puro.earth": "puro",
};

function normalizeProvider(raw: string): RegistryConnectProvider | null {
  const key = raw.trim().toLowerCase().replace(/[_\s]+/g, " ");
  return PROVIDER_ALIASES[key] ?? PROVIDER_ALIASES[key.replace(/\s/g, "_")] ?? null;
}

function normalizeSerial(provider: RegistryConnectProvider, serial: string): string {
  const s = serial.trim().toUpperCase().replace(/\s+/g, "");
  if (provider === "verra") {
    const digits = s.replace(/^VCS-?/i, "");
    if (/^\d+$/.test(digits)) return `VCS-${digits}`;
    return s;
  }
  if (provider === "gold_standard") {
    const digits = s.replace(/^GS-?/i, "");
    if (/^\d+$/.test(digits)) return `GS-${digits}`;
    return s;
  }
  if (provider === "puro") {
    const digits = s.replace(/^PURO-?/i, "");
    if (/^\d+$/.test(digits)) return `PURO-${digits}`;
    return s;
  }
  return s;
}

/** Extract provider + serial from a free-form string (URL, label, or serial). */
export function parseRegistryQuery(input: string): ParsedRegistryQuery | null {
  const raw = input.trim();
  if (!raw) return null;

  const verraFromText = raw.match(/\b(VCS[-\s]?\d{2,6})\b/i);
  if (verraFromText) {
    const serial = normalizeSerial("verra", verraFromText[1]!);
    return { provider: "verra", serial, raw };
  }

  const gsFromText = raw.match(/\b(GS[-\s]?\d{2,6})\b/i);
  if (gsFromText) {
    const serial = normalizeSerial("gold_standard", gsFromText[1]!);
    return { provider: "gold_standard", serial, raw };
  }

  if (/verra\.org|registry\.verra\.org/i.test(raw)) {
    const id = raw.match(/project\/(\d+)/i) ?? raw.match(/\b(\d{3,6})\b/);
    if (id) {
      const serial = normalizeSerial("verra", id[1]!);
      return { provider: "verra", serial, raw };
    }
  }

  if (/goldstandard\.org|registry\.goldstandard\.org/i.test(raw)) {
    const id = raw.match(/project\/(\d+)/i) ?? raw.match(/\b(\d{3,6})\b/);
    if (id) {
      const serial = normalizeSerial("gold_standard", id[1]!);
      return { provider: "gold_standard", serial, raw };
    }
  }

  if (/puro\.earth/i.test(raw)) {
    const id = raw.match(/\b(PURO[-\s]?\d+)\b/i);
    if (id) {
      return {
        provider: "puro",
        serial: normalizeSerial("puro", id[1]!),
        raw,
      };
    }
  }

  return null;
}

export function parseRegistryConnectInput(input: {
  serial?: string;
  registry?: string;
  q?: string;
}): ParsedRegistryQuery | null {
  if (input.serial && input.registry) {
    const provider = normalizeProvider(input.registry);
    if (!provider) return null;
    return {
      provider,
      serial: normalizeSerial(provider, input.serial),
      raw: `${input.registry}:${input.serial}`,
    };
  }

  if (input.serial) {
    const fromSerial = parseRegistryQuery(input.serial);
    if (fromSerial) return fromSerial;
    if (input.registry) {
      const provider = normalizeProvider(input.registry);
      if (provider) {
        return {
          provider,
          serial: normalizeSerial(provider, input.serial),
          raw: input.serial,
        };
      }
    }
  }

  if (input.q) return parseRegistryQuery(input.q);
  return null;
}

export { normalizeProvider, normalizeSerial };
