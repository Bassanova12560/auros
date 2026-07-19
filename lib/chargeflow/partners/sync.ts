import {
  createChargeflowEBatch,
  summarizeChargeflowBatch,
  type ChargeflowBatchResultItem,
} from "../create";
import { mapOcpiCdrToCreateRequest } from "../ocpi-stub";
import { getChargeflowPartnerConnector } from "./registry";
import {
  PARTNER_FORMAT_DISCLAIMER,
  type ChargeflowPartnerCredentials,
  type ChargeflowPartnerId,
  type ChargeflowPartnerMode,
} from "./types";

export type SyncPartnerSessionsInput = {
  partner: ChargeflowPartnerId;
  mode: ChargeflowPartnerMode;
  keyHash: string;
  operator_id?: string;
  credentials?: ChargeflowPartnerCredentials;
  sessions?: Record<string, unknown>[];
  limit?: number;
};

export type SyncPartnerSessionsResult =
  | {
      ok: true;
      partner: ChargeflowPartnerId;
      mode: ChargeflowPartnerMode;
      source: string;
      disclaimer: string;
      total: number;
      succeeded: number;
      failed: number;
      items: ChargeflowBatchResultItem[];
    }
  | {
      ok: false;
      code: string;
      message: string;
      status: number;
    };

export async function syncPartnerSessions(
  input: SyncPartnerSessionsInput
): Promise<SyncPartnerSessionsResult> {
  const limit = input.limit ?? 50;
  const connector = getChargeflowPartnerConnector(input.partner);
  const fetched = await connector.fetchSessions({
    mode: input.mode,
    credentials: input.credentials,
    sessions: input.sessions,
    limit,
    operator_id: input.operator_id,
  });

  if (!fetched.ok) {
    return {
      ok: false,
      code: fetched.code,
      message: fetched.message,
      status: fetched.status,
    };
  }

  const createItems = fetched.cdrs.map((cdr) =>
    mapOcpiCdrToCreateRequest(cdr, {
      operator_id: input.operator_id ?? cdr.cpo_id ?? input.partner,
    })
  );

  const items = await createChargeflowEBatch(input.keyHash, createItems);
  const summary = summarizeChargeflowBatch(items);

  return {
    ok: true,
    partner: input.partner,
    mode: input.mode,
    source: fetched.source,
    disclaimer: PARTNER_FORMAT_DISCLAIMER,
    ...summary,
  };
}
