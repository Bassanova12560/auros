import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";

import { COPILOT_OPS_ROUTE } from "@/lib/copilot/types";
import {
  hasOpsSessionFromCookieValue,
  OPS_SESSION_COOKIE,
} from "@/lib/ops/session";

import { CopilotOpsInboxView } from "./CopilotOpsInboxView";

export const metadata: Metadata = {
  title: "Ops Copilot inbox | AUROS",
  description: "Authenticated ops inbox — not for public indexing.",
  robots: { index: false, follow: false },
};

export default async function CopilotOpsPage() {
  const jar = await cookies();
  const session = jar.get(OPS_SESSION_COOKIE)?.value;
  if (!hasOpsSessionFromCookieValue(session)) {
    notFound();
  }

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <p className="mb-6 text-xs text-white/40">
        Authenticated tools · {COPILOT_OPS_ROUTE}
        {" · "}
        <Link href="/ops/login" className="underline-offset-2 hover:underline">
          re-auth
        </Link>
      </p>
      <CopilotOpsInboxView />
    </div>
  );
}
