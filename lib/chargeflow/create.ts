import {
  buildChargeflowCanonical,
  chargeflowContentSha256,
} from "./canonical";
import { enrichChargeflowWithWatt } from "./enrich";
import type { ChargeflowCreateRequest } from "./schema";
import {
  buildPublicSnapshot,
  chargeflowRecordFromParts,
  chargeflowVerifyUrl,
  createChargeflowRecord,
  requireChargeflowSignature,
  type ChargeflowRecord,
} from "./store";
import { newChargeflowUnitId } from "./signing";

export type CreateChargeflowResult = {
  record: ChargeflowRecord;
  verify_url: string;
};

export async function createChargeflowUnit(
  keyHash: string,
  input: ChargeflowCreateRequest
): Promise<CreateChargeflowResult | { error: string; status: number }> {
  const unitId = newChargeflowUnitId();
  const issuedAt = new Date().toISOString();
  const auros = enrichChargeflowWithWatt(input);
  const canonical = buildChargeflowCanonical(unitId, input, auros, issuedAt);
  const contentHash = chargeflowContentSha256(canonical);

  let signature: string;
  try {
    signature = requireChargeflowSignature(contentHash);
  } catch {
    return {
      error:
        "ChargeFlow signing is not configured (set ATTEST_SIGNING_KEY or CRON_SECRET)",
      status: 503,
    };
  }

  const publicSnapshot = buildPublicSnapshot(
    issuedAt,
    input.session.energy_kwh,
    input.session.external_session_id,
    input.session.started_at,
    input.session.ended_at,
    auros,
    {
      operator_id: input.session.operator_id,
      country: input.session.location?.country,
      renewable_claim: input.attributes?.renewable_claim,
    }
  );

  const draft = chargeflowRecordFromParts(
    keyHash,
    contentHash,
    signature,
    publicSnapshot,
    unitId
  );
  const record = await createChargeflowRecord(draft);

  return {
    record,
    verify_url: chargeflowVerifyUrl(record.id),
  };
}

export function chargeflowPublicResponse(record: ChargeflowRecord) {
  return {
    id: record.id,
    content_hash: record.content_hash,
    signature: record.signature,
    verify_url: chargeflowVerifyUrl(record.id),
    public: record.public,
    created_at: record.created_at,
    disclaimer: record.disclaimer,
    valid: true,
  };
}
