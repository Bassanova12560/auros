import { ContentFaqList, ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AUROS_FAQ_ROUTE } from "@/lib/green/constants";
import { MAIN_FAQ_ITEMS } from "@/lib/seo/content/main-faq";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(AUROS_FAQ_ROUTE);

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MAIN_FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <FocusPageShell path={AUROS_FAQ_ROUTE}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <ContentPageLayout
        eyebrow="Aide"
        title="Questions fréquentes"
        intro="Réponses claires sur AUROS, le wizard gratuit, les juridictions et la relation avec AUROS Green. Analyses indicatives — counsel requis avant émission."
      >
        <ContentFaqList items={MAIN_FAQ_ITEMS} />
      </ContentPageLayout>
    </FocusPageShell>
  );
}
