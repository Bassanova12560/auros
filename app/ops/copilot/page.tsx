import type { Metadata } from "next";
import Link from "next/link";

import { COPILOT_OPS_ROUTE, COPILOT_ROUTE } from "@/lib/copilot/types";

import { CopilotOpsInboxView } from "./CopilotOpsInboxView";

export const metadata: Metadata = {
  title: "Ops Copilot inbox | AUROS",
  description: "Review Copilot catalog and content drafts before merge.",
  robots: { index: false, follow: false },
};

export default function CopilotOpsPage() {
  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <p className="mb-6 text-xs text-white/40">
        <Link href={COPILOT_ROUTE} className="underline-offset-2 hover:underline">
          ← Copilot public
        </Link>
        {" · "}
        {COPILOT_OPS_ROUTE}
      </p>
      <CopilotOpsInboxView />
    </div>
  );
}
