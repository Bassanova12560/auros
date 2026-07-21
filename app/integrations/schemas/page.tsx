import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CONNECTOR_SPECS,
  CONNECTORS_DISCLAIMER,
  CONNECTORS_SCHEMAS_ROUTE,
} from "@/lib/resilience/connectors";

export const metadata: Metadata = {
  title: "Schémas connecteurs | AUROS",
  description: "Contrats JSON WELHR, playbook, brief, supplier — pour ERP / BI / middleware.",
};

export default function ConnectorSchemasPage() {
  return (
    <FocusPageShell path={CONNECTORS_SCHEMAS_ROUTE} width="3xl">
      <ContentPageLayout
        product="Integrations"
        eyebrow="Export-first"
        title="Contrats machine"
        intro="Appelez l’API Green, poussez le JSON vers votre ERP/BIM via middleware. Pas de plugin natif Autodesk/SAP dans cette version."
        cta={{ href: "/api/green/eau/connectors", label: "GET connectors JSON" }}
      >
        <ul className="space-y-6">
          {CONNECTOR_SPECS.map((c) => (
            <li key={c.id} className="border-t border-white/[0.08] pt-5">
              <p className="font-mono text-[10px] uppercase text-white/35">
                {c.kind}
              </p>
              <h2 className="mt-2 font-display text-lg text-white">{c.label}</h2>
              <p className="mt-2 text-sm text-white/55">{c.summary}</p>
              <p className="mt-2 font-mono text-[11px] text-sky-300/80">{c.path}</p>
              {c.sample_payload ? (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[10px] text-white/55">
                  {JSON.stringify(c.sample_payload, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs text-white/35">{CONNECTORS_DISCLAIMER}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href="/integrations" variant="ghost">
            Accueil intégrations
          </PrimaryButton>
          <PrimaryButton href="/green/api" variant="ghost">
            Green API
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
