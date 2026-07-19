import type { AttestCreateRequest } from "./schema";
import {
  attestationContentSha256,
  buildAttestCanonical,
} from "./canonical";
import {
  attestationFromCanonical,
  attestVerifyUrl,
  createAttestationRecord,
  requireAttestSignature,
  type AttestationRecord,
} from "./store";
import {
  generateDossierPayload,
  getDossierPayload,
  type DossierPayload,
} from "../dossier/generate";
import type { DossierRequest } from "../schemas/dossier";

export type CreateAttestationResult = {
  record: AttestationRecord;
  verify_url: string;
};

async function resolveDossier(
  keyHash: string,
  input: AttestCreateRequest
): Promise<DossierPayload | { error: string }> {
  if (input.dossier_id?.trim()) {
    const existing = await getDossierPayload(input.dossier_id.trim(), keyHash);
    if (!existing) {
      return { error: "dossier_id not found for this API key" };
    }
    return existing;
  }

  const dossierInput: DossierRequest = {
    score_id: input.score_id,
    score: input.score,
    format: "json",
    sections: input.sections,
    locale: input.locale ?? "fr",
  };

  return generateDossierPayload(keyHash, dossierInput);
}

export async function createAttestation(
  keyHash: string,
  input: AttestCreateRequest
): Promise<CreateAttestationResult | { error: string; status: number }> {
  const dossierOrErr = await resolveDossier(keyHash, input);
  if ("error" in dossierOrErr) {
    return { error: dossierOrErr.error, status: 404 };
  }

  const dossier = dossierOrErr;
  const contentHash = attestationContentSha256(dossier);
  let signature: string;
  try {
    signature = requireAttestSignature(contentHash);
  } catch {
    return {
      error:
        "Attestation signing is not configured (set ATTEST_SIGNING_KEY or CRON_SECRET)",
      status: 503,
    };
  }

  const canonical = buildAttestCanonical(dossier);
  const draft = attestationFromCanonical(
    keyHash,
    contentHash,
    signature,
    canonical,
    input.locale
  );
  const record = await createAttestationRecord(draft);

  return {
    record,
    verify_url: attestVerifyUrl(record.id),
  };
}

export function attestationPublicResponse(record: AttestationRecord) {
  return {
    id: record.id,
    content_hash: record.content_hash,
    signature: record.signature,
    verify_url: attestVerifyUrl(record.id),
    dossier_id: record.dossier_id,
    locale: record.locale,
    public: record.public,
    created_at: record.created_at,
    disclaimer: record.disclaimer,
    valid: true,
  };
}
