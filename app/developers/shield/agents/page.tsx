import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export const metadata: Metadata = {
  title: "Snippets agents (Cursor / Claude) | AUROS Shield",
  description:
    "Trois prompts prêts à coller pour intégrer AUROS Shield via un agent.",
};

const SNIPPETS = [
  {
    title: "1 · Cursor — brancher ingest",
    body: `Dans ce repo Next.js, ajoute un Proof Tap AUROS Shield :
1. POST brut vers https://getauros.com/api/v1/shield/ingest (Bearer AUROS_API_KEY)
2. Ou wrap fetch avec instrumentFetch / withShieldTap depuis @adrien1212balitrand/auros-shield
3. Ne stocke jamais le payload — seulement content_hash / receipt id
Docs: https://getauros.com/developers/shield`,
  },
  {
    title: "2 · Claude — auto-tap export CFU",
    body: `Quand tu génères un export ChargeFlow, appelle :
GET /api/v1/chargeflow/export?format=json&shield=1
avec Authorization Bearer. Inclus shield.verify_url dans la réponse utilisateur.
Nucléaire / bas-carbone = generation_source + /power — jamais sous Green Verified.`,
  },
  {
    title: "3 · Agent banque — Evidence Pack",
    body: `Pour un dossier crédit/ESG RWA :
1. POST /api/v1/shield/pack (Premium)
2. Joins pack_hash + bank_actions au dossier
3. Propose verify via POST /api/v1/shield/verify
Exemple: https://getauros.com/examples/shield-evidence-pack.example.json
Page banques: https://getauros.com/developers/shield/banks`,
  },
] as const;

export default function ShieldAgentsPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/developers/shield/agents" />
      <FocusPageShell path="/developers/shield/agents" width="3xl">
        <ContentPageLayout
          eyebrow="AUROS Shield · Agents"
          title="Trois snippets à coller"
          intro="Pour Cursor, Claude ou tout agent qui code / opère — sans réécrire le métier."
          cta={{ href: "/developers/shield", label: "Essayer Shield" }}
        >
          <div className="space-y-8">
            {SNIPPETS.map((s) => (
              <section key={s.title} className="space-y-2">
                <h2 className="font-display text-base text-white">{s.title}</h2>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                  {s.body}
                </pre>
              </section>
            ))}
            <PrimaryButton href="/developers/shield/case-study">
              Voir le case study flotte → banque
            </PrimaryButton>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
