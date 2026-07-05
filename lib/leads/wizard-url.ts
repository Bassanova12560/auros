import { siteOrigin } from "@/lib/emails/constants";

/** Wizard entry URL for lead nurture — explore or Green path from asset type. */
export function wizardUrlForLead(input: {
  assetType?: string | null;
}): string {
  const url = new URL(`${siteOrigin()}/wizard`);
  const asset = input.assetType?.trim().toLowerCase() ?? "";

  const isWater =
    /eau|water|hydrique|hydro|concession|desal|blue bond|m³|m3/.test(asset);
  const isEnergy =
    asset.includes("renewable") || asset.includes("energy") || asset.includes("énergie");

  if (isWater || isEnergy) {
    url.searchParams.set("type", "green");
    url.searchParams.set("asset", "renewable");
    return url.toString();
  }

  url.searchParams.set("mode", "explore");
  return url.toString();
}
