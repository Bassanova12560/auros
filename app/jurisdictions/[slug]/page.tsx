import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { JurisdictionProviders } from "@/app/jurisdictions/_components/JurisdictionProviders";

import { JurisdictionSeoLandingView } from "@/app/jurisdictions/_components/JurisdictionSeoLandingView";

import { absoluteUrl } from "@/lib/comparators/site";

import {

  getJurisdictionMessages,

  jurisdictionLabel,

  JURISDICTIONS_ROUTE,

} from "@/lib/jurisdictions";

import {

  getAllSeoLandings,

  getSeoLandingCopy,

  parseSeoLandingSlug,

} from "@/lib/jurisdictions/seo-landings";



type PageProps = { params: Promise<{ slug: string }> };



export async function generateStaticParams() {

  return getAllSeoLandings().map((l) => ({ slug: l.slug }));

}



function seoMetadataForLocale(

  landing: NonNullable<ReturnType<typeof parseSeoLandingSlug>>,

  locale: "fr" | "en" | "es"

) {

  const messages = getJurisdictionMessages(locale);

  const jurisdictionName = jurisdictionLabel(messages, landing.jurisdictionId);

  const assetLabel =

    messages.forms.projectTypes[landing.assetType] ?? landing.assetType;

  return getSeoLandingCopy(locale, landing, jurisdictionName, assetLabel);

}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { slug } = await params;

  const landing = parseSeoLandingSlug(slug);

  if (!landing) return { title: "Not found | AUROS" };



  const copyEn = seoMetadataForLocale(landing, "en");

  const url = `${JURISDICTIONS_ROUTE}/${landing.slug}`;

  const abs = absoluteUrl(url);



  return {

    title: copyEn.title,

    description: copyEn.description,

    alternates: {

      canonical: url,

      languages: {

        en: abs,

        fr: abs,

        es: abs,

      },

    },

    openGraph: {

      title: copyEn.title,

      description: copyEn.description,

      url: abs,

      siteName: "AUROS",

      type: "article",

    },

  };

}



export default async function JurisdictionSeoLandingPage({ params }: PageProps) {

  const { slug } = await params;

  const landing = parseSeoLandingSlug(slug);

  if (!landing) notFound();



  return (
    <JurisdictionProviders>
      <AiFirstPageJsonLd path={`${JURISDICTIONS_ROUTE}/${landing.slug}`} />
      <JurisdictionSeoLandingView landing={landing} />
    </JurisdictionProviders>
  );

}


