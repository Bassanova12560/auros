import { AmbientShell } from "./_components/ui/AmbientShell";
import { AiFirstPageJsonLd } from "./_components/ai-first/AiFirstPageJsonLd";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { LandingReferral } from "./_components/LandingReferral";
import { Nav } from "./_components/Nav";
import { TrustStrip } from "./_components/TrustStrip";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath("/");

/**
 * Landing: one primary path — hero CTA → wizard.
 * Depth (score, how-it-works, discover, trust, green) lives on dedicated routes.
 */
export default function HomePage() {
  return (
    <AmbientShell>
      <AiFirstPageJsonLd path="/" />
      <Nav />
      <LandingReferral />
      <main>
        <Hero />
        <TrustStrip />
      </main>
      <Footer />
    </AmbientShell>
  );
}
