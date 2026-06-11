import {
  DOSSIER_STORAGE_KEY,
  LEGACY_STORAGE_KEY_V1,
  STEP_STORAGE_KEYS,
  STORAGE_KEY,
} from "@/lib/wizard-constants";
import type { WizardData } from "@/lib/wizard-types";
import { initialWizardData } from "@/lib/wizard-constants";

const MIGRATION_FLAG = "auros_wizard_storage_v2_migrated";

type V1CombinedState = {
  step?: number;
  data?: Partial<WizardData>;
  expertMode?: boolean;
  wizardMode?: "explore" | "pro";
  pathChosen?: boolean;
  ts?: number;
};

type V2CombinedState = V1CombinedState & {
  schemaVersion: 2;
};

/** One-time client migration from tokenization_wizard_state_v1 → v2 key. */
export function migrateWizardStorageV1ToV2(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(MIGRATION_FLAG) === "1") return false;

    const v2Raw = localStorage.getItem(STORAGE_KEY);
    if (v2Raw) {
      localStorage.setItem(MIGRATION_FLAG, "1");
      return false;
    }

    const v1Raw = localStorage.getItem(LEGACY_STORAGE_KEY_V1);
    if (!v1Raw) {
      localStorage.setItem(MIGRATION_FLAG, "1");
      return false;
    }

    let parsed: V1CombinedState;
    try {
      parsed = JSON.parse(v1Raw) as V1CombinedState;
    } catch {
      localStorage.setItem(MIGRATION_FLAG, "1");
      return false;
    }

    const merged: Partial<WizardData> = { ...initialWizardData, ...parsed.data };
    for (const key of Object.values(STEP_STORAGE_KEYS)) {
      const stepRaw = localStorage.getItem(key);
      if (!stepRaw) continue;
      try {
        const stepData = JSON.parse(stepRaw) as Record<string, unknown>;
        for (const [k, v] of Object.entries(stepData)) {
          if (k === "ts") continue;
          if (merged[k as keyof WizardData] === undefined) {
            (merged as Record<string, unknown>)[k] = v;
          }
        }
      } catch {
        // skip malformed step blob
      }
    }

    const v2: V2CombinedState = {
      schemaVersion: 2,
      step: parsed.step,
      data: merged,
      wizardMode:
        parsed.wizardMode ??
        (parsed.expertMode ? "explore" : parsed.wizardMode),
      pathChosen: parsed.pathChosen ?? false,
      ts: parsed.ts ?? Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(v2));
    localStorage.removeItem(LEGACY_STORAGE_KEY_V1);
    localStorage.setItem(MIGRATION_FLAG, "1");
    return true;
  } catch {
    return false;
  }
}

/** Re-export for dossier hydration after migration. */
export { DOSSIER_STORAGE_KEY };
