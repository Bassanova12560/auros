import { AmbientShell } from "./_components/ui/AmbientShell";
import { AiFirstPageJsonLd } from "./_components/ai-first/AiFirstPageJsonLd";
import { AurosLiveStrip } from "./_components/AurosLiveStrip";
import { ConsoleBuildersEgg } from "./_components/ConsoleBuildersEgg";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { HomeSolutions } from "./_components/HomeSolutions";
import { IntegrationTargetsStrip } from "./_components/IntegrationTargetsStrip";
import { LandingReferral } from "./_components/LandingReferral";
import { Nav } from "./_components/Nav";
import { ResourceLayerBanner } from "./_components/ResourceLayerBanner";
import { TrustStrip } from "./_components/TrustStrip";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath("/");

/**
 * Landing: one liquidity story → live proof → three audience paths → resource frontier.
 */
export default function HomePage() {
  return (
    <AmbientShell>
      <AiFirstPageJsonLd path="/" />
      <ConsoleBuildersEgg />
      <Nav />
      <LandingReferral />
      <main>
        <Hero />
        <AurosLiveStrip />
        <HomeSolutions />
        <ResourceLayerBanner />
        <IntegrationTargetsStrip />
        <TrustStrip />
      </main>
      <Footer />
    </AmbientShell>
  );
}
