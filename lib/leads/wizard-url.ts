import { siteOrigin } from "@/lib/emails/constants";

/** Wizard entry URL for lead nurture — explore mode with optional green prefill. */
export function wizardUrlForLead(input: {
  assetType?: string | null;
}): string {
  const url = new URL(`${siteOrigin()}/wizard`);
  url.searchParams.set("mode", "explore");
  const asset = input.assetType?.trim().toLowerCase() ?? "";
  if (asset.includes("renewable") || asset.includes("energy")) {
    url.searchParams.set("asset", "renewable");
  }
  return url.toString();
}
