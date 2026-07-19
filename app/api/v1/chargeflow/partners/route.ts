import { protocolJson, protocolRoute } from "@/lib/protocol";
import {
  listChargeflowPartnerCatalog,
  PARTNER_FORMAT_DISCLAIMER,
} from "@/lib/chargeflow";

/** Public catalogue of ChargeFlow partner connectors (sandbox + live-ready). */
export const GET = protocolRoute(async () => {
  return protocolJson({
    disclaimer: PARTNER_FORMAT_DISCLAIMER,
    partners: listChargeflowPartnerCatalog(),
  });
});
