import { AmbientShell } from "./_components/ui/AmbientShell";
import { AiFirstPageJsonLd } from "./_components/ai-first/AiFirstPageJsonLd";
import { AurosLiveStrip } from "./_components/AurosLiveStrip";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { IntegrationTargetsStrip } from "./_components/IntegrationTargetsStrip";
import { LandingReferral } from "./_components/LandingReferral";
import { Nav } from "./_components/Nav";
import { ResourceLayerBanner } from "./_components/ResourceLayerBanner";
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
        <ResourceLayerBanner />
        <AurosLiveStrip />
        <IntegrationTargetsStrip />
        <TrustStrip />
      </main>
      <Footer />
    </AmbientShell>
  );
}
