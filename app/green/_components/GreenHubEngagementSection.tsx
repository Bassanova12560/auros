"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { GreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getGreenMessages } from "@/lib/green";

import { GreenHubRegistryWidget, type GreenHubRegistryStats } from "./GreenHubRegistryWidget";
import { GreenSectionTitle } from "./green-ui";

type Props = {
  registry: GreenRegistrySnapshot;
};

function registryStats(snapshot: GreenRegistrySnapshot): GreenHubRegistryStats {
  const verified = snapshot.projects.filter((p) => p.labelTier === "verified");
  const pilots = snapshot.projects.filter((p) => p.labelTier === "pilot");
  const latestVerified = verified.sort(
    (a, b) => new Date(b.certifiedAt).getTime() - new Date(a.certifiedAt).getTime()
  )[0];

  return {
    verifiedCount: verified.length,
    pilotCount: pilots.length,
    expertCount: snapshot.experts.length,
    latestVerifiedName: latestVerified?.name,
  };
}

export function GreenHubEngagementSection({ registry }: Props) {
  const { locale } = useLocale();
  const label = getGreenMessages(locale).hub.widgets.registry.label;

  return (
    <section aria-labelledby="green-engagement">
      <GreenSectionTitle>{label}</GreenSectionTitle>
      <div
        id="green-engagement"
        className="mt-6 border border-white/[0.08] bg-black"
      >
        <GreenHubRegistryWidget stats={registryStats(registry)} />
      </div>
    </section>
  );
}
