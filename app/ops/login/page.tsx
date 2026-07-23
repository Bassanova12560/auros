import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COPILOT_OPS_ROUTE } from "@/lib/copilot/types";
import {
  hasOpsSessionFromCookieValue,
  OPS_SESSION_COOKIE,
} from "@/lib/ops/session";

import { OpsLoginForm } from "./_components/OpsLoginForm";

export const metadata: Metadata = {
  title: "Ops unlock | AUROS",
  robots: { index: false, follow: false },
};

export default async function OpsLoginPage() {
  const jar = await cookies();
  if (hasOpsSessionFromCookieValue(jar.get(OPS_SESSION_COOKIE)?.value)) {
    redirect(COPILOT_OPS_ROUTE);
  }

  return <OpsLoginForm />;
}
