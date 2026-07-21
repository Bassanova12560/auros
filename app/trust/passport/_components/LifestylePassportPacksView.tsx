import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  TRUST_PACK_META,
  TRUST_PACKS_ROUTE,
  type TrustPackId,
} from "@/lib/trust-packs/taxonomy";
import {
  TRUST_PASSPORT_PACKS_PATH,
  TRUST_PASSPORT_WELCOME_PATH,
} from "@/lib/vertical-welcome/config";

import { TrustPacksNav } from "../../packs/_components/PackUi";

const LIFESTYLE: TrustPackId[] = [
  "real_estate",
  "luxury_collectible",
  "vehicle",
  "vessel",
  "sports_rights",
];

export function LifestylePassportPacksView() {
  return (
    <FocusPageShell path={TRUST_PASSPORT_PACKS_PATH} width="3xl">
      <ContentPageLayout
        product="Trust · Lifestyle"
        eyebrow="Lifestyle Passport"
        title="Patrimoine tokenisé, preuves d’admission"
        intro="Immo, sport, voiture, yacht, luxe : le volume démocratique des RWA. AUROS n’est pas la vitrine — c’est le passeport titre / custody / assurance / recours que plateformes et wealth desks peuvent exiger."
        cta={{
          href: `${TRUST_PACKS_ROUTE}/new?pack=real_estate`,
          label: "Pack immobilier",
        }}
      >
        <TrustPacksNav />

        <section className="space-y-3 text-sm text-white/55">
          <p>
            Même grammaire que le quantum playbook : si la clé tombe, le{" "}
            <em className="text-white/70">registre</em> réémet au vrai propriétaire. Le lifestyle
            sans filet = possession du token sans titre.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg text-white">Packs passport</h2>
          <ul className="space-y-4">
            {LIFESTYLE.map((id) => {
              const m = TRUST_PACK_META[id];
              return (
                <li key={id} className="border-t border-white/[0.08] pt-4">
                  <h3 className="font-display text-base text-white">{m.label}</h3>
                  <p className="mt-2 text-sm text-white/55">{m.short}</p>
                  <Link
                    href={`${TRUST_PACKS_ROUTE}/new?pack=${id}`}
                    className="mt-2 inline-block font-mono text-[11px] text-sky-300/80 hover:underline"
                  >
                    Ouvrir le pack →
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href={TRUST_PASSPORT_WELCOME_PATH} variant="ghost">
            Accueil Passport
          </PrimaryButton>
          <PrimaryButton href="/real-estate" variant="ghost">
            Comparator immo
          </PrimaryButton>
          <PrimaryButton href="/trust/quantum/playbook" variant="ghost">
            Playbook clauses
          </PrimaryButton>
          <PrimaryButton href="/trust/capacity" variant="ghost">
            Capacity rights
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
