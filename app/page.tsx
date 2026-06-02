import { AmbientShell } from "./_components/ui/AmbientShell";
import { AiFirstPageJsonLd } from "./_components/ai-first/AiFirstPageJsonLd";
import { FinalCta } from "./_components/FinalCta";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { LandingGreenPromo } from "./_components/LandingGreenPromo";
import { LandingExplore } from "./_components/LandingExplore";
import { LandingReferral } from "./_components/LandingReferral";
import { Nav } from "./_components/Nav";
import { ScoreWidget } from "./_components/ScoreWidget";
import { ProfessionalTrustBar } from "./_components/ProfessionalTrustBar";
import { TrustStrip } from "./_components/TrustStrip";

/**
 * Landing cognitive flow: one primary path (hero → score → 3 steps → CTA).
 * Depth content lives in collapsible LandingExplore — same features, less noise.
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
        <ScoreWidget />
        <HowItWorks />
        <LandingGreenPromo />
        <FinalCta />
        <section className="mx-auto max-w-3xl px-4 pb-8 md:px-6">
          <ProfessionalTrustBar variant="panel" />
        </section>
        <LandingExplore />
      </main>
      <Footer />
    </AmbientShell>
  );
}
