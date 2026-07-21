import type { Metadata } from "next";

import { QuantumExposureIndexView } from "../_components/QuantumExposureIndexView";

export const metadata: Metadata = {
  title: "Index Quantum Exposure | AUROS",
  description:
    "Tableau des verticaux RWA — exposition structurelle post-quantique (custody, durée, recours légal).",
};

export default function QuantumExposureIndexPage() {
  return <QuantumExposureIndexView />;
}
