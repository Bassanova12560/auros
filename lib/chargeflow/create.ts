import {
  buildChargeflowCanonical,
  buildChargeflowFCanonical,
  buildChargeflowWCanonical,
  chargeflowContentSha256,
} from "./canonical";
import {
  enrichChargeflowWithFlex,
  enrichChargeflowWithH2o,
  enrichChargeflowWithWatt,
} from "./enrich";
import type {
  ChargeflowCreateRequest,
  ChargeflowFCreateRequest,
  ChargeflowWCreateRequest,
} from "./schema";
import { newChargeflowUnitId, requireChargeflowSignature } from "./signing";
import {
  buildPublicSnapshotE,
  buildPublicSnapshotF,
  buildPublicSnapshotW,
  chargeflowRecordFromParts,
  chargeflowVerifyUrl,
  createChargeflowRecord,
  findActiveChargeflowConflict,
  retireChargeflowRecord,
  type ChargeflowRecord,
} from "./store";

export type CreateChargeflowResult = {
  record: ChargeflowRecord;
  verify_url: string;
};

export async function createChargeflowUnit(
  keyHash: string,
  input: ChargeflowCreateRequest
): Promise<CreateChargeflowResult | { error: string; status: number }> {
  const externalRef = input.session.external_session_id;
  const conflict = await findActiveChargeflowConflict(
    "e",
    keyHash,
    input.session.operator_id,
    externalRef
  );
  if (conflict) {
    return {
      error: `Active CFU-E already exists for this session (${conflict.id}). Retire it before re-minting.`,
      status: 409,
    };
  }

  const unitId = newChargeflowUnitId("e");
  const issuedAt = new Date().toISOString();
  const auros = enrichChargeflowWithWatt(input);
  const canonical = buildChargeflowCanonical(unitId, input, auros, issuedAt);
  const contentHash = chargeflowContentSha256(canonical);

  let signature: string;
  try {
    signature = requireChargeflowSignature(contentHash, "e");
  } catch {
    return {
      error:
        "ChargeFlow signing is not configured (set ATTEST_SIGNING_KEY or CRON_SECRET)",
      status: 503,
    };
  }

  const publicSnapshot = buildPublicSnapshotE(
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

  const draft = chargeflowRecordFromParts({
    keyHash,
    contentHash,
    signature,
    publicSnapshot,
    unitKind: "e",
    externalRef,
    operatorId: input.session.operator_id,
    unitId,
  });
  const record = await createChargeflowRecord(draft);

  return {
    record,
    verify_url: chargeflowVerifyUrl(record.id),
  };
}

export async function createChargeflowWUnit(
  keyHash: string,
  input: ChargeflowWCreateRequest
): Promise<CreateChargeflowResult | { error: string; status: number }> {
  const externalRef = input.flow.external_flow_id;
  const conflict = await findActiveChargeflowConflict(
    "w",
    keyHash,
    input.flow.operator_id,
    externalRef
  );
  if (conflict) {
    return {
      error: `Active CFU-W already exists for this flow (${conflict.id}). Retire it before re-minting.`,
      status: 409,
    };
  }

  const unitId = newChargeflowUnitId("w");
  const issuedAt = new Date().toISOString();
  const auros = enrichChargeflowWithH2o(input);
  const canonical = buildChargeflowWCanonical(unitId, input, auros, issuedAt);
  const contentHash = chargeflowContentSha256(canonical);

  let signature: string;
  try {
    signature = requireChargeflowSignature(contentHash, "w");
  } catch {
    return {
      error:
        "ChargeFlow signing is not configured (set ATTEST_SIGNING_KEY or CRON_SECRET)",
      status: 503,
    };
  }

  const publicSnapshot = buildPublicSnapshotW(
    issuedAt,
    input.flow.volume_m3,
    input.flow.external_flow_id,
    input.flow.started_at,
    input.flow.ended_at,
    auros,
    {
      operator_id: input.flow.operator_id,
      country: input.flow.location?.country,
    }
  );

  const draft = chargeflowRecordFromParts({
    keyHash,
    contentHash,
    signature,
    publicSnapshot,
    unitKind: "w",
    externalRef,
    operatorId: input.flow.operator_id,
    unitId,
  });
  const record = await createChargeflowRecord(draft);

  return {
    record,
    verify_url: chargeflowVerifyUrl(record.id),
  };
}

export async function createChargeflowFUnit(
  keyHash: string,
  input: ChargeflowFCreateRequest
): Promise<CreateChargeflowResult | { error: string; status: number }> {
  const externalRef = input.window.external_window_id;
  const conflict = await findActiveChargeflowConflict(
    "f",
    keyHash,
    input.window.operator_id,
    externalRef
  );
  if (conflict) {
    return {
      error: `Active CFU-F already exists for this window (${conflict.id}). Retire it before re-minting.`,
      status: 409,
    };
  }

  const unitId = newChargeflowUnitId("f");
  const issuedAt = new Date().toISOString();
  const auros = enrichChargeflowWithFlex(input);
  const canonical = buildChargeflowFCanonical(unitId, input, auros, issuedAt);
  const contentHash = chargeflowContentSha256(canonical);

  let signature: string;
  try {
    signature = requireChargeflowSignature(contentHash, "f");
  } catch {
    return {
      error:
        "ChargeFlow signing is not configured (set ATTEST_SIGNING_KEY or CRON_SECRET)",
      status: 503,
    };
  }

  const publicSnapshot = buildPublicSnapshotF(
    issuedAt,
    input.window.capacity_kw,
    input.window.external_window_id,
    input.window.started_at,
    input.window.ended_at,
    auros,
    {
      operator_id: input.window.operator_id,
      country: input.window.location?.country,
      direction: input.window.direction,
    }
  );

  const draft = chargeflowRecordFromParts({
    keyHash,
    contentHash,
    signature,
    publicSnapshot,
    unitKind: "f",
    externalRef,
    operatorId: input.window.operator_id,
    unitId,
  });
  const record = await createChargeflowRecord(draft);

  return {
    record,
    verify_url: chargeflowVerifyUrl(record.id),
  };
}

export function chargeflowPublicResponse(record: ChargeflowRecord) {
  return {
    id: record.id,
    unit_kind: record.unit_kind,
    content_hash: record.content_hash,
    signature: record.signature,
    verify_url: chargeflowVerifyUrl(record.id),
    status: record.status,
    retired_at: record.retired_at,
    retire_reason: record.retire_reason,
    public: record.public,
    created_at: record.created_at,
    disclaimer: record.disclaimer,
    valid: true,
  };
}

function errorCodeForCreateStatus(status: number): string {
  if (status === 409) return "conflict";
  if (status === 503) return "service_unavailable";
  return "bad_request";
}

export type ChargeflowBatchResultItem =
  | (ReturnType<typeof chargeflowPublicResponse> & {
      index: number;
      ok: true;
    })
  | {
      index: number;
      ok: false;
      error: { code: string; message: string };
    };

export function summarizeChargeflowBatch(items: ChargeflowBatchResultItem[]) {
  const succeeded = items.filter((i) => i.ok).length;
  return {
    total: items.length,
    succeeded,
    failed: items.length - succeeded,
    items,
  };
}

export async function createChargeflowEBatch(
  keyHash: string,
  items: ChargeflowCreateRequest[]
): Promise<ChargeflowBatchResultItem[]> {
  return Promise.all(
    items.map(async (item, index) => {
      const result = await createChargeflowUnit(keyHash, item);
      if ("error" in result) {
        return {
          index,
          ok: false as const,
          error: {
            code: errorCodeForCreateStatus(result.status),
            message: result.error,
          },
        };
      }
      return {
        index,
        ok: true as const,
        ...chargeflowPublicResponse(result.record),
      };
    })
  );
}

export async function createChargeflowWBatch(
  keyHash: string,
  items: ChargeflowWCreateRequest[]
): Promise<ChargeflowBatchResultItem[]> {
  return Promise.all(
    items.map(async (item, index) => {
      const result = await createChargeflowWUnit(keyHash, item);
      if ("error" in result) {
        return {
          index,
          ok: false as const,
          error: {
            code: errorCodeForCreateStatus(result.status),
            message: result.error,
          },
        };
      }
      return {
        index,
        ok: true as const,
        ...chargeflowPublicResponse(result.record),
      };
    })
  );
}

export async function createChargeflowFBatch(
  keyHash: string,
  items: ChargeflowFCreateRequest[]
): Promise<ChargeflowBatchResultItem[]> {
  return Promise.all(
    items.map(async (item, index) => {
      const result = await createChargeflowFUnit(keyHash, item);
      if ("error" in result) {
        return {
          index,
          ok: false as const,
          error: {
            code: errorCodeForCreateStatus(result.status),
            message: result.error,
          },
        };
      }
      return {
        index,
        ok: true as const,
        ...chargeflowPublicResponse(result.record),
      };
    })
  );
}

export { retireChargeflowRecord };
