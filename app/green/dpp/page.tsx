import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { GREEN_DPP_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { GreenDppView } from "./GreenDppView";

export const metadata = metadataFromPath(GREEN_DPP_ROUTE);

export default function GreenDppPage() {
  return (
    <FocusPageShell path={GREEN_DPP_ROUTE} width="3xl">
      <GreenDppView />
    </FocusPageShell>
  );
}
