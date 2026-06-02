import type { ReactNode } from "react";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { JurisdictionFooter } from "./JurisdictionFooter";
import { JurisdictionHeader } from "./JurisdictionHeader";
import { JurisdictionMobileBar } from "./JurisdictionMobileBar";

export function JurisdictionShell({ children }: { children: ReactNode }) {
  return (
    <AmbientShell>
      <JurisdictionHeader />
      {children}
      <JurisdictionFooter />
      <JurisdictionMobileBar />
    </AmbientShell>
  );
}
