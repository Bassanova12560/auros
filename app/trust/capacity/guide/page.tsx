import type { Metadata } from "next";

import { CapacityRightsGuideView } from "../_components/CapacityRightsGuideView";

export const metadata: Metadata = {
  title: "Guide Capacity Rights | AUROS",
  description:
    "Questions et preuves pour scorer un RWA capacity — MW, interconnexion, cooling, allocation.",
};

export default function CapacityRightsGuidePage() {
  return <CapacityRightsGuideView />;
}
