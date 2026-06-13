"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getCsrdCheckerCopy } from "@/lib/green/csrd-check/i18n";

/** Locale-aware FAQPage JSON-LD for CSRD Checker (FR / EN / ES). */
export function CsrdFaqJsonLd() {
  const { locale } = useLocale();
  const faq = getCsrdCheckerCopy(locale).faq;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
