import "server-only";

/**
 * Server-only Watts persistence & lifecycle.
 * Client UI must import routes/types from `@/lib/watts` (or `./types`), never this module.
 */

export {
  insertWattReservation,
  getWattReservation,
  markWattReservationConfirmed,
  markWattReservationSettled,
} from "./store";
export {
  insertWattCapacityOffer,
  getWattCapacityOffer,
  listWattCapacityOffers,
  withdrawWattCapacityOffer,
} from "./offers-store";
export {
  insertWattSecondaryListing,
  getWattSecondaryListing,
  listWattSecondaryListings,
  withdrawWattSecondaryListing,
  expressWattSecondaryInterest,
} from "./secondary-store";
export { confirmWattReservation } from "./confirm";
export { settleWattReservation } from "./settle";
