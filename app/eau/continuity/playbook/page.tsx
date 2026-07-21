import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { CONTINUITY_PLAYBOOK_ROUTE, CONTINUITY_WELCOME_ROUTE } from "@/lib/wets/continuity-playbook";

import { ContinuityPlaybookConsole } from "../_components/ContinuityPlaybookConsole";

export const metadata: Metadata = {
  title: "Générer un playbook continuité | AUROS",
  description:
    "Playbook hydrique indicatif — CAPEX/OPEX, 3 scénarios, export Markdown.",
};

export default function ContinuityPlaybookToolPage() {
  return (
    <FocusPageShell path={CONTINUITY_PLAYBOOK_ROUTE} width="3xl">
      <ContentPageLayout
        product="Eau · Resilience"
        eyebrow="Outil · Continuity"
        title="Playbook de continuité"
        intro="WELHR + paramètres site → 3 scénarios max. Vous validez ; AUROS n’exécute rien."
      >
        <ContinuityPlaybookConsole />
        <p className="mt-12 font-mono text-[11px] text-white/40">
          <a href={CONTINUITY_WELCOME_ROUTE} className="hover:text-white/60">
            ← Accueil continuité
          </a>
        </p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
