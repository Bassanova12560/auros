import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

import {
  fingerprintAlerts,
  upsertPortfolioWatchlist,
} from "@/lib/green/portfolio-watchlist";
import { portfolioWatchlistDigestEmail } from "@/lib/emails/templates";

const FILE = join(process.cwd(), ".data", "portfolio-watchlists.json");

describe("portfolio-watchlist", () => {
  it("fingerprints alert ids stably", () => {
    assert.equal(
      fingerprintAlerts(["b", "a"]),
      fingerprintAlerts(["a", "b"])
    );
  });

  it("upserts local watchlist by email", async () => {
    if (existsSync(FILE)) unlinkSync(FILE);
    const a = await upsertPortfolioWatchlist({
      email: "Ops@Example.com",
      locale: "fr",
      assetDnaIds: [],
    });
    assert.equal(a.email, "ops@example.com");
    assert.equal(a.assetDnaIds.length, 0);

    const b = await upsertPortfolioWatchlist({
      email: "ops@example.com",
      assetDnaIds: ["auros:dna:v1:ge:test"],
      locale: "en",
    });
    assert.equal(b.id, a.id);
    assert.equal(b.locale, "en");
    assert.deepEqual(b.assetDnaIds, ["auros:dna:v1:ge:test"]);
  });
});

describe("portfolioWatchlistDigestEmail", () => {
  it("builds fr subject with alert count", () => {
    const { subject, html } = portfolioWatchlistDigestEmail({
      locale: "fr",
      alertCount: 2,
      watchedCount: 5,
      portfolioUrl: "https://example.com/green/portfolio",
      alerts: [
        {
          displayName: "Site A",
          message: "Flux silencieux",
          severity: "warn",
        },
      ],
    });
    assert.match(subject, /2 alertes/);
    assert.match(html, /Site A/);
    assert.match(html, /Portfolio Console/);
  });
});
