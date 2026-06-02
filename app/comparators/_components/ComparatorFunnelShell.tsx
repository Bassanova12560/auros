import type { ReactNode } from "react";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { ComparatorCrossLinks } from "@/app/comparators/_components/ComparatorCrossLinks";
import { ComparatorFooter } from "@/app/comparators/_components/ComparatorFooter";
import { ComparatorShellHeader } from "@/app/comparators/_components/ComparatorShellHeader";
import { MobileDossierBar } from "@/app/comparators/_components/MobileDossierBar";

export function ComparatorFunnelShell({ children }: { children: ReactNode }) {
  return (
    <AmbientShell>
      <ComparatorShellHeader />
      {children}
      <ComparatorCrossLinks />
      <ComparatorFooter />
      <MobileDossierBar />
    </AmbientShell>
  );
}
