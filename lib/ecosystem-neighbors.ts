/**
 * @deprecated Prefer NextStepStrip preset + getArlUi(locale).neighbors
 * Kept as EN fallbacks for any leftover imports.
 */
export { getEcosystemPreset as getEcosystemNeighbors } from "@/lib/arl/ui-i18n";

import { getArlUi } from "@/lib/arl/ui-i18n";

/** English-only presets — prefer NextStepStrip `preset` prop for locale. */
export const ECOSYSTEM = getArlUi("en").neighbors;
