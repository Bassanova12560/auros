import type { GreenRegistryProjectRow } from "./green-registry";
import { greenProjectSummary } from "./green-registry";
import type { GreenMessages } from "./i18n";
import type { GreenRegistryTierFilter } from "./registry-routes";
import type { Locale } from "@/lib/i18n";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export type GreenRegistryCsvOptions = {
  tierFilter?: GreenRegistryTierFilter;
};

/** Client-safe CSV export for filtered registry projects. */
export function greenRegistryProjectsToCsv(
  projects: GreenRegistryProjectRow[],
  labels: GreenMessages["registry"],
  compareLabels: GreenMessages["compare"],
  locale: Locale,
  options: GreenRegistryCsvOptions = {}
): string {
  const header = [
    labels.projectsTitle.replace(/s$/i, ""),
    compareLabels.table.type,
    labels.projectDetail.locationTitle,
    labels.tierVerified,
    labels.projectDetail.certifiedAtTitle,
    labels.projectDetail.descriptionTitle,
  ]
    .map(csvEscape)
    .join(",");

  const tierLabel = (tier: "verified" | "pilot"): string =>
    tier === "verified" ? labels.tierVerified : labels.tierPilot;

  const body = projects.map((proj) =>
    [
      proj.name,
      compareLabels.projectTypes[proj.projectType],
      proj.country,
      tierLabel(proj.labelTier),
      proj.certifiedAt.slice(0, 10),
      greenProjectSummary(proj, locale),
    ]
      .map(csvEscape)
      .join(",")
  );

  const parts: string[] = [header, ...body];

  if (options.tierFilter && options.tierFilter !== "all") {
    const filterLabel =
      options.tierFilter === "verified"
        ? labels.tierFilterVerified
        : labels.tierFilterPilot;
    parts.unshift(`${csvEscape(labels.tierFilterAll)}: ${csvEscape(filterLabel)}`);
  }

  return parts.join("\n");
}

export function suggestedGreenRegistryCsvFilename(
  tierFilter: GreenRegistryTierFilter = "all"
): string {
  if (tierFilter === "verified") return "auros-green-registry-verified.csv";
  if (tierFilter === "pilot") return "auros-green-registry-pilot.csv";
  return "auros-green-registry.csv";
}

export function downloadGreenRegistryCsv(
  csv: string,
  filename = "auros-green-registry.csv"
): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
