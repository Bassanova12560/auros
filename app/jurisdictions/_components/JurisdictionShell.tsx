import type { ReactNode } from "react";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { AurosHeader } from "@/app/_components/AurosHeader";
import { JurisdictionFooter } from "./JurisdictionFooter";
import { JurisdictionMobileBar } from "./JurisdictionMobileBar";

export function JurisdictionShell({ children }: { children: ReactNode }) {
  return (
    <AmbientShell>
      <AurosHeader />
      {children}
      <JurisdictionFooter />
      <JurisdictionMobileBar />
    </AmbientShell>
  );
}
