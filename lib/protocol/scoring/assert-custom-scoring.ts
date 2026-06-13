import { checkPremiumAccess } from "../auth/premium";
import type { ApiKeyRecord } from "../auth/keys";
import { protocolError } from "../response";
import { requiresPremiumWeights } from "./weight-profiles";
import type { ScoreWeightProfileId, DimensionWeightsPct } from "./weight-profiles";

export function assertCustomScoringAllowed(
  rawKey: string,
  record: ApiKeyRecord | null,
  isDemo: boolean,
  input: { profile?: ScoreWeightProfileId; weights?: Partial<DimensionWeightsPct> }
): { ok: true } | { ok: false; response: ReturnType<typeof protocolError> } {
  if (!requiresPremiumWeights(input)) return { ok: true };
  if (isDemo) {
    return {
      ok: false,
      response: protocolError(
        "premium_required",
        "Custom scoring weights and profiles require a premium key (auros_pk_live_*). Demo keys use default weights only.",
        403
      ),
    };
  }
  const premium = checkPremiumAccess(rawKey, record ?? undefined);
  if (!premium.allowed) return { ok: false, response: premium.response };
  return { ok: true };
}
