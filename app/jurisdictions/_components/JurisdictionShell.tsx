import type { ReactNode } from "react";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { JurisdictionFooter } from "./JurisdictionFooter";
import { JurisdictionMobileBar } from "./JurisdictionMobileBar";
import { JurisdictionSiteHeader } from "./JurisdictionSiteHeader";

export function JurisdictionShell({ children }: { children: ReactNode }) {
  return (
    <AmbientShell>
      <JurisdictionSiteHeader />
      {children}
      <JurisdictionFooter />
      <JurisdictionMobileBar />
    </AmbientShell>
  );
}
