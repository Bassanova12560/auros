import { WATTS_RESERVE_DISCLAIMER } from "./types";
import type {
  WattSecondaryListing,
  WattSecondaryListingPublic,
} from "./types";

export const WATTS_SECONDARY_RWA_HINT =
  "RWA prep: link compare_ref_id to a Protocol product and open /compare — indicative only, not an offering or securities exchange.";

export function wattSecondaryCompareUrl(
  compareRefId: string | null | undefined
): string | null {
  if (!compareRefId?.trim()) return null;
  const id = encodeURIComponent(compareRefId.trim());
  return `/compare?ids=${id}`;
}

export function wattSecondaryPublic(
  row: WattSecondaryListing
): WattSecondaryListingPublic {
  return {
    listing_id: row.id,
    status: row.status,
    reservation_id: row.reservation_id,
    cfu_unit_id: row.cfu_unit_id,
    cfu_verify_url: row.cfu_verify_url,
    indicative_price_eur: row.indicative_price_eur,
    compare_ref_id: row.compare_ref_id,
    compare_url: wattSecondaryCompareUrl(row.compare_ref_id),
    label: row.label,
    note: row.note,
    energy_kwh: row.energy_kwh,
    capacity_kw: row.capacity_kw,
    zone: row.zone,
    firmness: row.firmness,
    interest_count: row.interest_count,
    created_at: row.created_at,
    rwa_hint: WATTS_SECONDARY_RWA_HINT,
    disclaimer: WATTS_RESERVE_DISCLAIMER,
  };
}
