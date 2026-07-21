import type { Metadata } from "next";

import { InstitutionsIndexView } from "../_components/InstitutionsIndexView";

export const metadata: Metadata = {
  title: "Index institutions RWA | AUROS",
  description:
    "Radar indicatif — régulateurs, cadres et infrastructures RWA / tokenisation.",
};

export default function InstitutionsIndexPage() {
  return <InstitutionsIndexView />;
}
