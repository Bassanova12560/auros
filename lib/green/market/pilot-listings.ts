/** Example marketplace listings shown when no real offers exist (UX audit B1). */

export type GreenMarketPilotListing = {
  id: string;
  actorName: string;
  side: "sell" | "buy";
  energyLabel: string;
  volumeLabel: string;
  priceLabel: string;
  location: string;
};

export const GREEN_MARKET_PILOT_LISTINGS: GreenMarketPilotListing[] = [
  {
    id: "pilot-solar-provence",
    actorName: "Ferme solaire Provence (exemple)",
    side: "sell",
    energyLabel: "Solaire",
    volumeLabel: "450 kWh",
    priceLabel: "0.09 €/kWh",
    location: "Aix-en-Provence",
  },
  {
    id: "pilot-wind-bretagne",
    actorName: "Parc éolien Bretagne (exemple)",
    side: "sell",
    energyLabel: "Éolien",
    volumeLabel: "1 200 kWh",
    priceLabel: "0.08 €/kWh",
    location: "Brest",
  },
  {
    id: "pilot-hub-lyon",
    actorName: "Hub industriel Lyon (exemple)",
    side: "buy",
    energyLabel: "Mixte",
    volumeLabel: "800 kWh",
    priceLabel: "0.10 €/kWh",
    location: "Lyon",
  },
];

export const GREEN_MARKET_PILOT_BADGE_FR = "Exemple pilote";

export const GREEN_MARKET_PILOT_NOTE_FR =
  "Données pilotes — publiez une annonce pour apparaître ici.";
