import { createAssetDnaRecord } from "./create";
import { persistAssetDna } from "./store";
import type {
  AssetDnaClass,
  AssetDnaCreateInput,
  AssetDnaRecord,
} from "./types";
import type { GreenProjectType } from "@/lib/green/constants";

export function assetDnaClassFromGreenProject(
  projectType: GreenProjectType | string
): AssetDnaClass {
  if (projectType === "water") return "water_rights";
  if (
    projectType === "solar" ||
    projectType === "wind" ||
    projectType === "rec" ||
    projectType === "carbon" ||
    projectType === "ppa"
  ) {
    return "green_energy";
  }
  return "other";
}

/** Mint DNA, persist locally (+ Supabase when available), return record. */
export async function mintAssetDna(
  input: AssetDnaCreateInput
): Promise<AssetDnaRecord> {
  const record = createAssetDnaRecord(input);
  await persistAssetDna(record);
  return record;
}
