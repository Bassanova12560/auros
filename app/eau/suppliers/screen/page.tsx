import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { SupplierEsgConsole } from "../_components/SupplierEsgConsole";

export const metadata: Metadata = {
  title: "Scanner claim fournisseur | AUROS",
  description: "Hygiène ESG indicative — preuves URL obligatoires pour un score défendable.",
};

export default function SupplierScreenPage() {
  return (
    <FocusPageShell path="/eau/suppliers/screen" width="3xl">
      <ContentPageLayout
        product="Eau · ESG"
        eyebrow="Supplier screen"
        title="Claim vs preuve"
        intro="Collez le pitch fournisseur + URLs. AUROS flag les claims absolus sans source — vous validez."
      >
        <SupplierEsgConsole />
        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href="/eau/suppliers" variant="ghost">
            Accueil
          </PrimaryButton>
          <PrimaryButton href="/integrations" variant="ghost">
            Connecteurs ERP
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
