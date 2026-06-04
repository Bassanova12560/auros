import type { ReactNode } from "react";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { ComparatorCrossLinks } from "@/app/comparators/_components/ComparatorCrossLinks";
import { ComparatorFooter } from "@/app/comparators/_components/ComparatorFooter";
import { CompareSiteHeader } from "@/app/comparators/_components/CompareSiteHeader";
import { ComparatorSubNav } from "@/app/comparators/_components/ComparatorSubNav";
import { MobileDossierBar } from "@/app/comparators/_components/MobileDossierBar";

export function ComparatorFunnelShell({ children }: { children: ReactNode }) {
  return (
    <AmbientShell>
      <CompareSiteHeader />
      <ComparatorSubNav />
      {children}
      <ComparatorCrossLinks />
      <ComparatorFooter />
      <MobileDossierBar />
    </AmbientShell>
  );
}
