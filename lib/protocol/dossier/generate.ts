import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import { computeProtocolScore } from "../scoring/compute-score";
import { generateChecklist } from "../checklist/generate";
import { parseDescription } from "../nlp/parse-description";
import type { DossierRequest } from "../schemas/dossier";
import type { ScoreRequest } from "../schemas/score";
import type { ProtocolScoreResult } from "../scoring/compute-score";
import { DOSSIER_SECTIONS } from "../schemas/dossier";

export type DossierPayload = {
  id: string;
  key_hash: string;
  score: ProtocolScoreResult;
  checklist: ReturnType<typeof generateChecklist> | null;
  sections: string[];
  branding?: {
    company_name?: string;
    logo_url?: string;
    primary_color?: string;
    hide_auros_branding?: boolean;
  };
  locale: "fr" | "en" | "es";
  created_at: string;
  full_report_url: string;
};

const memoryStore = new Map<string, DossierPayload>();
const DATA_DIR = join(process.cwd(), ".data");
const DOSSIER_FILE = join(DATA_DIR, "protocol-dossiers.json");

function loadFileStore(): DossierPayload[] {
  try {
    if (!existsSync(DOSSIER_FILE)) return [];
    return JSON.parse(readFileSync(DOSSIER_FILE, "utf8")) as DossierPayload[];
  } catch {
    return [];
  }
}

function saveFileStore(records: DossierPayload[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DOSSIER_FILE, JSON.stringify(records, null, 2), "utf8");
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

function resolveScoreInput(input: DossierRequest): ScoreRequest {
  if (input.score) return input.score;
  return {
    description: `Protocol dossier reference ${input.score_id}`,
    asset_type: "other",
  };
}

function assetTypeFromScore(scoreInput: ScoreRequest): string {
  if (scoreInput.asset_type) return scoreInput.asset_type;
  if (scoreInput.description) {
    return parseDescription(scoreInput.description).assetType;
  }
  return "other";
}

export async function generateDossierPayload(
  keyHash: string,
  input: DossierRequest
): Promise<DossierPayload> {
  const scoreInput = resolveScoreInput(input);
  const score = computeProtocolScore(scoreInput);
  const assetType = assetTypeFromScore(scoreInput);
  const jurisdiction =
    scoreInput.jurisdiction ??
    score.recommended_jurisdictions[0]?.id ??
    "luxembourg";

  const sections = input.sections ?? [...DOSSIER_SECTIONS];
  let checklist: ReturnType<typeof generateChecklist> | null = null;
  if (
    sections.includes("checklist") &&
    ["real_estate", "private_fund", "bonds", "private_credit"].includes(assetType)
  ) {
    checklist = generateChecklist({
      asset_type: assetType as "real_estate" | "private_fund" | "bonds" | "private_credit",
      jurisdiction,
      structure: "spv",
    });
  }

  const id = input.score_id?.trim() || `dos_${randomBytes(12).toString("hex")}`;
  const payload: DossierPayload = {
    id,
    key_hash: keyHash,
    score,
    checklist,
    sections,
    branding: input.branding,
    locale: input.locale,
    created_at: new Date().toISOString(),
    full_report_url: score.meta.full_report_url,
  };

  memoryStore.set(id, payload);
  saveFileStore([...memoryStore.values()]);
  return payload;
}

export async function getDossierPayload(
  id: string,
  keyHash: string
): Promise<DossierPayload | null> {
  const record = memoryStore.get(id);
  if (record && record.key_hash === keyHash) return record;
  const fromFile = loadFileStore().find((d) => d.id === id && d.key_hash === keyHash);
  if (fromFile) {
    memoryStore.set(id, fromFile);
    return fromFile;
  }
  return null;
}

export function dossierJsonExport(payload: DossierPayload): Record<string, unknown> {
  return {
    id: payload.id,
    generated_at: payload.created_at,
    locale: payload.locale,
    branding: payload.branding,
    full_report_url: payload.full_report_url,
    score: payload.score,
    checklist: payload.checklist,
    sections: payload.sections,
  };
}
