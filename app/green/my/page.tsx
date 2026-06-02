import type { Metadata } from "next";

import { GreenMyView } from "../_components/GreenMyView";

export const metadata: Metadata = {
  title: "Mes fiches Green | AUROS",
  description:
    "Suivez vos fiches acteur et alertes géographiques sur la place de marché AUROS Green.",
  robots: { index: false, follow: false },
};

export default function GreenMyPage() {
  return <GreenMyView />;
}
