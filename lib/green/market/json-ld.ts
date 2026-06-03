import { absoluteUrl } from "@/lib/comparators/site";

import type { GreenMarketActorDetail } from "./actor-detail";
import { greenMarketActorPath } from "./actor-routes";
import { formatGreenMarketOfferTitle } from "./offer-detail";
import type { GreenMarketOfferDetail } from "./offer-detail";
import { greenMarketOfferPath } from "./offer-routes";

function orgBlock() {
  return {
    "@type": "Organization" as const,
    name: "AUROS Green",
    url: absoluteUrl("/green"),
  };
}

/** schema.org Offer for a marketplace listing detail page. */
export function buildGreenMarketOfferJsonLd(
  offer: GreenMarketOfferDetail,
  locale: "fr" | "en" | "es" = "fr"
): Record<string, unknown> {
  const title = formatGreenMarketOfferTitle(offer, locale);
  const path = greenMarketOfferPath(offer.id);
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: title,
    description: offer.description.slice(0, 500),
    url: absoluteUrl(path),
    price: offer.pricePerKwh,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: offer.actorName,
      url: offer.actor ? absoluteUrl(greenMarketActorPath(offer.actor.id)) : undefined,
    },
    areaServed: {
      "@type": "Place",
      name: `${offer.city}, ${offer.country}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: offer.lat,
        longitude: offer.lon,
      },
    },
    offeredBy: orgBlock(),
  };
}

/** schema.org LocalBusiness for an actor profile page. */
export function buildGreenMarketActorJsonLd(
  actor: GreenMarketActorDetail,
  locale: "fr" | "en" | "es" = "fr"
): Record<string, unknown> {
  const path = greenMarketActorPath(actor.id);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: actor.name,
    description: actor.description.slice(0, 500),
    url: absoluteUrl(path),
    email: actor.contactEmail?.trim() || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: actor.city,
      addressCountry: actor.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: actor.lat,
      longitude: actor.lon,
    },
    makesOffer:
      actor.offers.length > 0
        ? actor.offers.slice(0, 5).map((o) => ({
            "@type": "Offer",
            name: formatGreenMarketOfferTitle(o, locale),
            url: absoluteUrl(greenMarketOfferPath(o.id)),
            price: o.pricePerKwh,
            priceCurrency: "EUR",
          }))
        : undefined,
  };
}
