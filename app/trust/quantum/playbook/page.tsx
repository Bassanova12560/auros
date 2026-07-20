import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { WETS_CONSOLE_ROUTE } from "@/lib/wets/constants";
import {
  QUANTUM_PLAYBOOK_CLAUSES,
  QUANTUM_PLAYBOOK_DISCLAIMER,
  QUANTUM_PLAYBOOK_ROUTE,
} from "@/lib/wets/quantum-playbook";

export const metadata: Metadata = {
  title: "Playbook recours post-quantique | AUROS",
  description:
    "Modèles de clauses SPV / transfer agent : registre off-chain, gel/re-émission, token=claim, reseal PQC.",
};

export default function QuantumPlaybookPage() {
  return (
    <FocusPageShell path={QUANTUM_PLAYBOOK_ROUTE} width="2xl">
      <ContentPageLayout
        product="Trust · Quantum"
        eyebrow="Playbook"
        title="Clauses de recours"
        intro="Si la clé tombe, qui réémet au vrai propriétaire ? Quatre clauses indicatives pour SPV / registrar — à faire valider par counsel."
        cta={{
          href: `${QUANTUM_PLAYBOOK_ROUTE}/download`,
          label: "Télécharger .md",
        }}
      >
        <p className="mb-8 text-xs text-amber-200/70">
          {QUANTUM_PLAYBOOK_DISCLAIMER}
        </p>

        <ol className="space-y-8">
          {QUANTUM_PLAYBOOK_CLAUSES.map((c, i) => (
            <li key={c.id} className="border-t border-white/[0.08] pt-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-violet-300/70">
                {i + 1} · {c.id}
              </p>
              <h2 className="mt-1 font-display text-xl text-white">{c.title}</h2>
              <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 font-mono text-[12px] leading-relaxed text-white/65">
                {c.body}
              </pre>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href={WETS_CONSOLE_ROUTE}>
            Scorer un projet
          </PrimaryButton>
          <PrimaryButton href="/trust/quantum" variant="ghost">
            Quantum index
          </PrimaryButton>
          <PrimaryButton href="/developers/shield" variant="ghost">
            Shield reseal
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
