/** When true: template AI, webhook logs only, /api/simulate enabled in prod if set. */
export function isSimulationMode(): boolean {
  return process.env.AUROS_SIMULATION === "true";
}

export function isSimulateApiAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return isSimulationMode();
}
