import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import type { AttestCanonicalPayload } from "./canonical";
import { newAttestationId, signAttestHash } from "./signing";

export type AttestationRecord = {
  id: string;
  content_hash: string;
  signature: string;
  key_hash: string;
  dossier_id: string;
  locale: "fr" | "en" | "es";
  /** Public snapshot — no PII */
  public: {
    score: number;
    grade: string;
    status: string;
    mica_classification: string;
    sections: string[];
    generated_at: string;
  };
  created_at: string;
  disclaimer: string;
};

const DISCLAIMER =
  "AUROS Readiness Attestation — indicative MiCA/RWA readiness signal. Not a legal opinion, regulatory approval, or investment advice.";

const memoryStore = new Map<string, AttestationRecord>();
const DATA_DIR = join(process.cwd(), ".data");
const ATTEST_FILE = join(DATA_DIR, "protocol-attestations.json");

function loadFileStore(): AttestationRecord[] {
  try {
    if (!existsSync(ATTEST_FILE)) return [];
    const parsed = JSON.parse(readFileSync(ATTEST_FILE, "utf8")) as AttestationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: AttestationRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(ATTEST_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemoryFromFile(): void {
  for (const record of loadFileStore()) {
    memoryStore.set(record.id, record);
  }
}

syncMemoryFromFile();

async function trySupabaseInsert(record: AttestationRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    await supabase.from("protocol_attestations").insert({
      id: record.id,
      content_hash: record.content_hash,
      signature: record.signature,
      key_hash: record.key_hash,
      dossier_id: record.dossier_id,
      locale: record.locale,
      public_snapshot: record.public,
      created_at: record.created_at,
      disclaimer: record.disclaimer,
    });
  } catch {
    // table may not exist yet — file/memory still work
  }
}

async function trySupabaseFindById(id: string): Promise<AttestationRecord | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("protocol_attestations")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as {
      id: string;
      content_hash: string;
      signature: string;
      key_hash: string;
      dossier_id: string;
      locale: "fr" | "en" | "es";
      public_snapshot: AttestationRecord["public"];
      created_at: string;
      disclaimer: string;
    };
    return {
      id: row.id,
      content_hash: row.content_hash,
      signature: row.signature,
      key_hash: row.key_hash,
      dossier_id: row.dossier_id,
      locale: row.locale,
      public: row.public_snapshot,
      created_at: row.created_at,
      disclaimer: row.disclaimer,
    };
  } catch {
    return null;
  }
}

export function attestationFromCanonical(
  keyHash: string,
  contentHash: string,
  signature: string,
  canonical: AttestCanonicalPayload,
  locale: "fr" | "en" | "es"
): AttestationRecord {
  return {
    id: newAttestationId(),
    content_hash: contentHash,
    signature,
    key_hash: keyHash,
    dossier_id: canonical.dossier_id,
    locale,
    public: {
      score: canonical.score,
      grade: canonical.grade,
      status: canonical.status,
      mica_classification: canonical.mica_classification,
      sections: canonical.sections,
      generated_at: canonical.generated_at,
    },
    created_at: new Date().toISOString(),
    disclaimer: DISCLAIMER,
  };
}

export async function createAttestationRecord(
  record: AttestationRecord
): Promise<AttestationRecord> {
  memoryStore.set(record.id, record);
  saveFileStore([...memoryStore.values()]);
  await trySupabaseInsert(record);
  return record;
}

export async function getAttestationById(id: string): Promise<AttestationRecord | null> {
  const mem = memoryStore.get(id);
  if (mem) return mem;
  const fromFile = loadFileStore().find((r) => r.id === id);
  if (fromFile) {
    memoryStore.set(id, fromFile);
    return fromFile;
  }
  const fromDb = await trySupabaseFindById(id);
  if (fromDb) {
    memoryStore.set(id, fromDb);
    return fromDb;
  }
  return null;
}

export function siteOriginForAttest(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://getauros.com"
  );
}

export function attestVerifyPath(id: string): string {
  return `/attest/${encodeURIComponent(id)}`;
}

export function attestVerifyUrl(id: string): string {
  return `${siteOriginForAttest()}${attestVerifyPath(id)}`;
}

export function requireAttestSignature(contentHash: string): string {
  const sig = signAttestHash(contentHash);
  if (!sig) {
    throw new Error("ATTEST_SIGNING_KEY (or GREEN_EXPORT_SIGNING_KEY / CRON_SECRET) required");
  }
  return sig;
}
