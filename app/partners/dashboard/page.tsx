import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";

import { SITE_URL } from "@/lib/comparators/site";
import { buildPartnerWizardUrl } from "@/lib/partner-attribution";
import {
  getPartnerStats,
  resolvePartnerForClerkUser,
} from "@/lib/partners/registry";
import { metadataFromPath } from "@/lib/seo/metadata";

import { PartnerDashboardView } from "../_components/PartnerDashboardView";

export const metadata: Metadata = metadataFromPath("/partners/dashboard");

export const dynamic = "force-dynamic";

export default async function PartnerDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return <PartnerDashboardView state="none" />;
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;

  const partner = await resolvePartnerForClerkUser(userId, email);

  if (!partner) {
    return <PartnerDashboardView state="none" />;
  }

  if (partner.status === "pending" || partner.status === "disabled") {
    return <PartnerDashboardView state="pending" partner={partner} />;
  }

  const stats = await getPartnerStats(partner.code);
  const wizardUrl = buildPartnerWizardUrl(partner.code, SITE_URL);

  return (
    <PartnerDashboardView
      state="active"
      partner={partner}
      stats={stats}
      wizardUrl={wizardUrl}
    />
  );
}
