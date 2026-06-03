import type { GreenCompareSnapshotPayload } from "./compare-snapshot";
import { buildGreenCompareShareUrl } from "./market/compare-selection";

/** Build a public compare URL that encodes all snapshot dimensions (countries, offers, RWA). */
export function buildCompareUrlFromSnapshotPayload(
  payload: GreenCompareSnapshotPayload,
  origin = ""
): string {
  return buildGreenCompareShareUrl({
    offerIds: payload.offerIds,
    countries: payload.countries,
    rwaRowIds: payload.rwaRowIds,
    origin,
  });
}
