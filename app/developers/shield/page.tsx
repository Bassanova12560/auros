import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import { SHIELD_DISCLAIMER, SHIELD_VERSION } from "@/lib/shield";

export const SHIELD_ROUTE = "/developers/shield";

export const metadata: Metadata = {
  ...metadataFromPath(SHIELD_ROUTE),
  title: "AUROS Shield | Sous-couche crypto on-prem",
  description:
    "Runtime on-prem pour sceller et vérifier CFU/attest avec clés locales, CBOM crypto et enveloppes PQC-ready. Indicatif — pas une certification HSM.",
};

export default function ShieldPage() {
  return (
    <>
      <AiFirstPageJsonLd path={SHIELD_ROUTE} />
      <FocusPageShell path={SHIELD_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow={`AUROS Shield · v${SHIELD_VERSION}`}
          title="La sous-couche que les entreprises installent chez elles"
          intro="Comme les appliances de protection quantique : on l’installe tôt parce que l’évidence RWA/ESG doit rester vérifiable 7–30 ans. Clés dans le périmètre client. Protocol reste l’intelligence cloud."
          cta={{ href: "/api/v1/shield/cbom", label: "Voir un CBOM exemple" }}
        >
          <div className="space-y-10">
            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">Pourquoi maintenant</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-white/55">
                <li>
                  <strong className="text-white/80">Résidence des clés</strong> — le
                  secret de scellement ne quitte pas le DMZ / HSM du client.
                </li>
                <li>
                  <strong className="text-white/80">CBOM</strong> — inventaire crypto
                  pour risk & procurement (préparation migration PQC).
                </li>
                <li>
                  <strong className="text-white/80">Agilité</strong> — profils{" "}
                  <code className="text-white/70">classical_hmac_sha256_v1</code> et{" "}
                  <code className="text-white/70">hybrid_pqc_ready_v1</code> pour
                  dual-verify dès que les clés NIST sont branchées.
                </li>
                <li>
                  <strong className="text-white/80">Avance client</strong> — audits CFU /
                  attest vérifiables localement, sans exposer la data room cloud.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">Installer</h2>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                {`npm install @adrien1212balitrand/auros-shield
export AUROS_SHIELD_SIGNING_KEY="…HSM/KMS…"
npx auros-shield serve --port 8787
# GET  /v1/cbom  · POST /v1/seal  · POST /v1/verify`}
              </pre>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/developers/institutions">
                  Pack institutions
                </PrimaryButton>
                <PrimaryButton href="/developers/docs/endpoint-attest" variant="ghost">
                  Attest cloud
                </PrimaryButton>
                <PrimaryButton href="/auros-openapi.yaml" variant="ghost">
                  OpenAPI
                </PrimaryButton>
              </div>
            </section>

            <p className="text-xs leading-relaxed text-white/35">
              {SHIELD_DISCLAIMER}{" "}
              <Link
                href="/developers"
                className="underline-offset-2 hover:underline"
              >
                Hub développeurs
              </Link>
              .
            </p>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
