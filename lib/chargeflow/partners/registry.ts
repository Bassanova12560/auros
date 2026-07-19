import { genericOcpiConnector } from "./generic-ocpi";
import { teslaFleetConnector } from "./tesla-fleet";
import { totalEnergiesConnector } from "./total-energies";
import type {
  ChargeflowPartnerCatalogEntry,
  ChargeflowPartnerConnector,
  ChargeflowPartnerId,
} from "./types";

const CONNECTORS: Record<ChargeflowPartnerId, ChargeflowPartnerConnector> = {
  tesla_fleet: teslaFleetConnector,
  total_energies: totalEnergiesConnector,
  generic_ocpi: genericOcpiConnector,
};

export function listChargeflowPartnerCatalog(): ChargeflowPartnerCatalogEntry[] {
  return Object.values(CONNECTORS).map((c) => c.catalog);
}

export function getChargeflowPartnerConnector(
  id: ChargeflowPartnerId
): ChargeflowPartnerConnector {
  return CONNECTORS[id];
}
