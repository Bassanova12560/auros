import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Intégrations BIM / ERP | AUROS",
  description:
    "Export JSON + OpenAPI + webhooks — friction zéro sans plugins Autodesk/SAP day-one.",
};

export default function IntegrationsWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES["/integrations"]!} />
  );
}
