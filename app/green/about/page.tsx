import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_ABOUT_ROUTE } from "@/lib/green";

import { GreenAboutView } from "../_components/GreenAboutView";

export const metadata: Metadata = {
  title: "Le standard | AUROS Green",
  description:
    "Positionnement RTMS, garanties, parcours label et profils — AUROS Green en détail. FR / EN / ES.",
  alternates: { canonical: GREEN_ABOUT_ROUTE },
  openGraph: {
    title: "About AUROS Green",
    url: absoluteUrl(GREEN_ABOUT_ROUTE),
    type: "website",
  },
};

export default function GreenAboutPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_ABOUT_ROUTE} />
      <GreenAboutView />
    </>
  );
}
