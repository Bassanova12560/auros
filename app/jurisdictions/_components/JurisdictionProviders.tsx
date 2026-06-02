"use client";

import type { ReactNode } from "react";

import { JurisdictionPrefillProvider } from "./JurisdictionPrefillProvider";

export function JurisdictionProviders({ children }: { children: ReactNode }) {
  return <JurisdictionPrefillProvider>{children}</JurisdictionPrefillProvider>;
}
