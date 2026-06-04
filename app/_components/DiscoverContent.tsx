import { AssetUniverse } from "./AssetUniverse";
import { DossierDeliverables } from "./DossierDeliverables";
import { LandingGreenPromo } from "./LandingGreenPromo";
import { LandingStory } from "./LandingStory";
import { RegulatoryTrust } from "./RegulatoryTrust";
import { SocialProof } from "./SocialProof";
import { Stats } from "./Stats";
import { Ticker } from "./Ticker";

/** Full depth content — used on /discover (always expanded). */
export function DiscoverContent() {
  return (
    <div className="space-y-0">
      <Ticker />
      <LandingStory act={1} />
      <AssetUniverse />
      <LandingStory act={2} />
      <RegulatoryTrust />
      <LandingStory act={3} />
      <SocialProof />
      <DossierDeliverables />
      <Stats />
      <LandingGreenPromo />
    </div>
  );
}
