import { siteOrigin } from "@/lib/emails/constants";
import { sendGreenMarketAlert } from "@/lib/emails/send";
import { matchGreenMarketAlertsForActor } from "@/lib/green/market/alerts";
import { getGreenMarketActorByIdForAlerts } from "@/lib/green/market/green-market-db";

export async function notifyGreenMarketGeoAlerts(assetId: string): Promise<void> {
  const actor = await getGreenMarketActorByIdForAlerts(assetId);
  if (!actor) return;

  const alerts = await matchGreenMarketAlertsForActor({
    name: actor.name,
    city: actor.city,
    lat: actor.lat,
    lon: actor.lon,
    type: actor.type,
  });

  if (!alerts.length) return;

  const marketUrl = `${siteOrigin()}/green/market`;
  const notified = new Set<string>();

  for (const alert of alerts) {
    if (notified.has(alert.email)) continue;
    notified.add(alert.email);
    void sendGreenMarketAlert(alert.email, {
      alertCity: alert.city,
      actorName: actor.name,
      actorCity: actor.city,
      actorType: actor.type,
      marketUrl,
      locale: "fr",
    });
  }
}
