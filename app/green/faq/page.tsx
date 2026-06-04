import Link from "next/link";

import { ContentFaqList, ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { GREEN_FAQ_ROUTE, GREEN_LABEL_ROUTE, GREEN_ROUTE } from "@/lib/green";
import { GREEN_FAQ_ITEMS } from "@/lib/seo/content/green-faq";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GREEN_FAQ_ROUTE);

export default function GreenFaqPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_FAQ_ROUTE} />
      <ContentPageLayout
        eyebrow="AUROS Green · Aide"
        title="Questions fréquentes"
        intro="RTMS, label Verified, marketplace mondiale, registre et parcours producteur — réponses directes, statuts honnêtes."
        cta={{ href: GREEN_LABEL_ROUTE, label: "Candidater au label Verified" }}
      >
        <ContentFaqList items={GREEN_FAQ_ITEMS} />
        <p className="mt-8">
          <Link
            href={GREEN_ROUTE}
            className="auros-btn auros-btn--link"
          >
            ← Retour hub Green
          </Link>
        </p>
      </ContentPageLayout>
    </>
  );
}
