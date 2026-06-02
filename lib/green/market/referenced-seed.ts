/**

 * Pilotes « Référencé » — crédibilité marketplace (France + international).

 * Statut available + listing_tier referenced (pas demo).

 */



import type { SupabaseClient } from "@supabase/supabase-js";



import type { GreenMarketActorType, GreenMarketEnergyType } from "./types";



type ReferencedPilot = {

  externalId: string;

  type: GreenMarketActorType;

  name: string;

  city: string;

  country: string;

  region: string;

  lat: number;

  lon: number;

  capacityKwh: number;

  pricePerKwh: number | null;

  energyType: GreenMarketEnergyType;

  description: string;

  contactEmail: string;

};



export const GREEN_REFERENCED_PILOTS: ReferencedPilot[] = [

  {

    externalId: "ref-pilot-stocker-lyon",

    type: "storer",

    name: "Stockage Énergie Lyon Métropole",

    city: "Lyon",

    country: "France",

    region: "Auvergne-Rhône-Alpes",

    lat: 45.764,

    lon: 4.8357,

    capacityKwh: 420_000,

    pricePerKwh: 0.112,

    energyType: "battery",

    description:

      "Stockage batteries lithium — arbitrage et effacement pour producteurs solaires locaux. Capacité 420 MWh équivalent, contrats PPA courts.",

    contactEmail: "contact@stockage-lyon-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-producer-bretagne",

    type: "producer",

    name: "Éoliennes Côtes d'Armor Coop",

    city: "Saint-Brieuc",

    country: "France",

    region: "Bretagne",

    lat: 48.5138,

    lon: -2.7653,

    capacityKwh: 1_850_000,

    pricePerKwh: 0.078,

    energyType: "wind",

    description:

      "Parc éolien coopératif — production mesurée, garanties d'origine et traçabilité blockchain via partenaire Energy Web.",

    contactEmail: "production@eoliennes-bretagne-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-consumer-toulouse",

    type: "consumer",

    name: "Industrie Agro Sud-Ouest",

    city: "Toulouse",

    country: "France",

    region: "Occitanie",

    lat: 43.6047,

    lon: 1.4442,

    capacityKwh: 680_000,

    pricePerKwh: null,

    energyType: "solar",

    description:

      "Consommateur industriel — achat surplus solaire et stockage virtuel pour décarboner la ligne de conditionnement.",

    contactEmail: "energie@agro-sud-ouest-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-storer-berlin",

    type: "storer",

    name: "Mitte Battery Cooperative",

    city: "Berlin",

    country: "Germany",

    region: "Berlin",

    lat: 52.52,

    lon: 13.405,

    capacityKwh: 310_000,

    pricePerKwh: 0.105,

    energyType: "battery",

    description:

      "Community BESS — flex services for SMEs, transparent metering and EU GO linkage on discharge.",

    contactEmail: "contact@mitte-bess-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-producer-texas",

    type: "producer",

    name: "Gulf Coast Solar PPA",

    city: "Houston",

    country: "United States",

    region: "Texas",

    lat: 29.7604,

    lon: -95.3698,

    capacityKwh: 3_200_000,

    pricePerKwh: 0.062,

    energyType: "solar",

    description:

      "Utility-scale solar portfolio — hourly blocks, REC retirement data and corporate offtake ready for tokenized tranches.",

    contactEmail: "ppa@gulfcoast-solar-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-consumer-singapore",

    type: "consumer",

    name: "Jurong Industrial Energy Buyers",

    city: "Singapore",

    country: "Singapore",

    region: "West",

    lat: 1.3521,

    lon: 103.8198,

    capacityKwh: 420_000,

    pricePerKwh: null,

    energyType: "mixed",

    description:

      "Industrial cluster — seeking verified solar imports and storage-as-a-service for 24/7 green supply.",

    contactEmail: "procurement@jurong-energy-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-producer-madrid",

    type: "producer",

    name: "Madrid Solar District",

    city: "Madrid",

    country: "Spain",

    region: "Community of Madrid",

    lat: 40.4168,

    lon: -3.7038,

    capacityKwh: 580_000,

    pricePerKwh: 0.067,

    energyType: "solar",

    description:

      "Rooftop solar cooperative — hourly surplus blocks and GO-linked attestations for local buyers.",

    contactEmail: "surplus@madrid-solar-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-storer-london",

    type: "storer",

    name: "Thames Battery Hub",

    city: "London",

    country: "United Kingdom",

    region: "Greater London",

    lat: 51.5074,

    lon: -0.1278,

    capacityKwh: 185_000,

    pricePerKwh: 0.112,

    energyType: "battery",

    description:

      "Urban BESS — flex services for commercial towers, transparent metering and REGO linkage.",

    contactEmail: "flex@thames-bess-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-producer-toronto",

    type: "producer",

    name: "Ontario Clean Export Co-op",

    city: "Toronto",

    country: "Canada",

    region: "Ontario",

    lat: 43.6532,

    lon: -79.3832,

    capacityKwh: 720_000,

    pricePerKwh: 0.071,

    energyType: "solar",

    description:

      "Ground-mount and rooftop mix — IESO export data ready for tokenized PPA tranches.",

    contactEmail: "export@ontario-clean-pilot.auros.green",

  },

  {

    externalId: "ref-pilot-consumer-mumbai",

    type: "consumer",

    name: "Mumbai Tech Campus Buyers",

    city: "Mumbai",

    country: "India",

    region: "Maharashtra",

    lat: 19.076,

    lon: 72.8777,

    capacityKwh: 390_000,

    pricePerKwh: null,

    energyType: "solar",

    description:

      "IT campus cluster — seeking verified solar imports and storage bundles for 24/7 supply.",

    contactEmail: "procurement@mumbai-tech-pilot.auros.green",

  },

];



async function upsertReferenced(

  supabase: SupabaseClient,

  pilot: ReferencedPilot

): Promise<void> {

  const row = {

    type: pilot.type,

    name: pilot.name,

    city: pilot.city,

    country: pilot.country,

    region: pilot.region,

    lat: pilot.lat,

    lon: pilot.lon,

    capacity_kwh: pilot.capacityKwh,

    price_per_kwh: pilot.pricePerKwh,

    energy_type: pilot.energyType,

    description: pilot.description,

    contact_email: pilot.contactEmail,

    listing_tier: "referenced",

    is_certified: false,

    status: "available",

  };



  const { data: existing } = await supabase

    .from("green_market_assets")

    .select("id")

    .eq("external_id", pilot.externalId)

    .maybeSingle();



  if (existing?.id) {

    const { error } = await supabase

      .from("green_market_assets")

      .update(row)

      .eq("external_id", pilot.externalId);

    if (error) throw new Error(`referenced update ${pilot.externalId}: ${error.message}`);

    return;

  }



  const { error } = await supabase

    .from("green_market_assets")

    .insert({ external_id: pilot.externalId, ...row });

  if (error) throw new Error(`referenced insert ${pilot.externalId}: ${error.message}`);

}



export async function seedGreenReferencedPilots(

  supabase: SupabaseClient

): Promise<void> {

  for (const pilot of GREEN_REFERENCED_PILOTS) {

    await upsertReferenced(supabase, pilot);

  }

}

