import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { GREEN_ROUTE } from "@/lib/green";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";
import { metadataFromPath } from "@/lib/seo/metadata";
import {
  GREEN_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = mergeAuditOg(
  metadataFromPath(GREEN_ROUTE),
  auditOgImage(
    "/green",
    "AUROS+Green+%E2%80%94+%C3%89nergie+locale",
    "AUROS Green"
  ),
  { siteName: "AUROS" }
);

export default function GreenWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[GREEN_WELCOME_PATH]!} />
  );
}
