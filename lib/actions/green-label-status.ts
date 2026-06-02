"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import {
  listGreenLabelApplicationsByEmail,
  type GreenLabelApplicationRow,
} from "@/lib/green/label-applications";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type LookupGreenLabelApplicationsResult =
  | { ok: true; applications: GreenLabelApplicationRow[] }
  | { ok: false; error: "invalid" | "rate_limit" | "unauthenticated" };

export async function lookupGreenLabelApplicationsAction(input?: {
  email?: string;
}): Promise<LookupGreenLabelApplicationsResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-label-lookup:${ip}`, 12, 3_600_000);
  if (!allowed) return { ok: false, error: "rate_limit" };

  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const clerkEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  const email = (input?.email?.trim().toLowerCase() || clerkEmail || "").trim();

  if (!email || !isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid" };
  }

  if (!userId && !input?.email?.trim()) {
    return { ok: false, error: "unauthenticated" };
  }

  const applications = await listGreenLabelApplicationsByEmail(email);
  return { ok: true, applications };
}
