/**
 * Proof-of-Resource consensus stub — weights proposers by declared capacityKw.
 * Not a real BFT implementation.
 */
export type PorValidator = {
  address: string;
  capacityKw: number;
  aurStaked: number;
};

export function pickProposer(validators: PorValidator[], randomness: number): PorValidator | null {
  const active = validators.filter((v) => v.capacityKw > 0 && v.aurStaked > 0);
  if (active.length === 0) return null;
  const total = active.reduce((s, v) => s + v.capacityKw, 0);
  let cursor = randomness * total;
  for (const v of active) {
    cursor -= v.capacityKw;
    if (cursor <= 0) return v;
  }
  return active[active.length - 1] ?? null;
}
