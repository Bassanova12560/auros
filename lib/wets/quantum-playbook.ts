/**
 * Clause playbook — indicative SPV / transfer-agent language for post-quantum recourse.
 * Not legal advice.
 */

export const QUANTUM_PLAYBOOK_ROUTE = "/trust/quantum/playbook";

export const QUANTUM_PLAYBOOK_DISCLAIMER =
  "Modèle indicatif AUROS — pas un conseil juridique. Faire valider par counsel dans la juridiction du SPV.";

export const QUANTUM_PLAYBOOK_CLAUSES = [
  {
    id: "offchain_register",
    title: "Registre off-chain fait foi",
    body: `The official register of record for beneficial ownership shall be the books maintained by the Issuer / Transfer Agent / Registrar (the "Register"). Possession of a token or private key does not, by itself, constitute legal title. In the event of any conflict between on-chain records and the Register, the Register shall prevail.`,
  },
  {
    id: "key_compromise_remedy",
    title: "Gel / re-émission si clé compromise",
    body: `If the Issuer reasonably determines that cryptographic keys controlling tokens have been compromised, lost, or rendered insecure (including by cryptanalytic advance), the Issuer may freeze affected tokens and cancel / re-issue replacement instruments solely to the person recorded as owner on the Register, upon satisfactory KYC and indemnity.`,
  },
  {
    id: "token_vs_title",
    title: "Token = claim, pas titre",
    body: `Each Token represents a contractual claim against the Issuer SPV and does not itself convey legal title to the Underlying Asset. Legal title to the Underlying Asset remains with the SPV (or the titled holder named in the governing documents).`,
  },
  {
    id: "crypto_agility",
    title: "Chemin reseal / migration (PQC)",
    body: `The Issuer shall maintain a documented crypto-agility schedule, including the ability to re-seal evidence packs and migrate signing schemes (including hybrid / post-quantum profiles when available) without altering the primacy of the Register. Migration notices shall be recorded in the Register and, where applicable, anchored via AUROS Shield reseal receipts.`,
  },
] as const;

export function quantumPlaybookMarkdown(): string {
  const lines = [
    `# AUROS — Playbook recours post-quantique (indicatif)`,
    ``,
    QUANTUM_PLAYBOOK_DISCLAIMER,
    ``,
    `## Principe`,
    ``,
    `La question n'est pas « le quantum casse-t-il la chaîne demain » — c'est : si la clé est compromise, existe-t-il un registre légal qui réémet / gèle au profit du vrai propriétaire ?`,
    ``,
  ];
  for (const c of QUANTUM_PLAYBOOK_CLAUSES) {
    lines.push(`## ${c.title}`, ``, c.body, ``);
  }
  lines.push(
    `## Lien produit`,
    ``,
    `- Quantum Exposure Index: https://getauros.com/trust/quantum`,
    `- Scorer un projet (WETS): https://getauros.com/eau/trust`,
    `- Shield reseal: https://getauros.com/developers/shield`,
    ``
  );
  return lines.join("\n");
}
