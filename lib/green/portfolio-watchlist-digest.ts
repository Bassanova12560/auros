/**
 * Daily portfolio watchlist digest runner — server-only.
 */

import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";
import { sendPortfolioWatchlistDigest } from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import {
  fingerprintAlerts,
  listActivePortfolioWatchlists,
  markWatchlistDigestSent,
} from "@/lib/green/portfolio-watchlist";

export type PortfolioDigestRunResult = {
  watchlists: number;
  sent: number;
  skipped: number;
  errors: number;
};

export async function runPortfolioWatchlistDigest(): Promise<PortfolioDigestRunResult> {
  const result: PortfolioDigestRunResult = {
    watchlists: 0,
    sent: 0,
    skipped: 0,
    errors: 0,
  };

  const watchlists = await listActivePortfolioWatchlists();
  result.watchlists = watchlists.length;
  if (!watchlists.length) return result;

  const snapshot = await getGreenPortfolioSnapshot(100);

  for (const wl of watchlists) {
    try {
      const assets =
        wl.assetDnaIds.length === 0
          ? snapshot.assets
          : snapshot.assets.filter((a) =>
              wl.assetDnaIds.includes(a.assetDnaId)
            );

      const alerts = snapshot.alerts.filter((a) =>
        assets.some((asset) => asset.assetDnaId === a.assetDnaId)
      );

      if (alerts.length === 0) {
        result.skipped += 1;
        continue;
      }

      const fingerprint = fingerprintAlerts(alerts.map((a) => a.id));
      if (
        wl.lastDigestFingerprint === fingerprint &&
        wl.lastDigestAt &&
        Date.now() - new Date(wl.lastDigestAt).getTime() < 20 * 60 * 60 * 1000
      ) {
        result.skipped += 1;
        continue;
      }

      const ok = await sendPortfolioWatchlistDigest(wl.email, {
        locale: wl.locale,
        alertCount: alerts.length,
        alerts: alerts.slice(0, 12).map((a) => ({
          displayName: a.displayName,
          message: a.message,
          severity: a.severity,
        })),
        portfolioUrl: `${siteOrigin()}/green/portfolio`,
        watchedCount: assets.length,
      });

      if (ok) {
        await markWatchlistDigestSent({
          email: wl.email,
          fingerprint,
        });
        result.sent += 1;
      } else {
        result.errors += 1;
      }
    } catch (err) {
      console.error("[portfolio-watchlist-digest]", wl.email, err);
      result.errors += 1;
    }
  }

  return result;
}
