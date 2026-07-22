import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

import {
  fingerprintAlerts,
  upsertPortfolioWatchlist,
  unsubscribePortfolioWatchlist,
} from "@/lib/green/portfolio-watchlist";
import { portfolioWatchlistDigestEmail } from "@/lib/emails/templates";
import {
  portfolioLimitForTier,
  streamLimitForTier,
} from "@/lib/green/dna-read-auth";

const FILE = join(process.cwd(), ".data", "portfolio-watchlists.json");

describe("portfolio-watchlist", () => {
  it("fingerprints alert ids stably", () => {
    assert.equal(
      fingerprintAlerts(["b", "a"]),
      fingerprintAlerts(["a", "b"])
    );
  });

  it("upserts local watchlist by email with unsubscribe token", async () => {
    if (existsSync(FILE)) unlinkSync(FILE);
    const a = await upsertPortfolioWatchlist({
      email: "Ops@Example.com",
      locale: "fr",
      assetDnaIds: [],
    });
    assert.equal(a.email, "ops@example.com");
    assert.equal(a.assetDnaIds.length, 0);
    assert.ok(a.unsubscribeToken.length >= 8);

    const b = await upsertPortfolioWatchlist({
      email: "ops@example.com",
      assetDnaIds: ["auros:dna:v1:ge:test"],
      locale: "en",
    });
    assert.equal(b.id, a.id);
    assert.equal(b.locale, "en");
    assert.deepEqual(b.assetDnaIds, ["auros:dna:v1:ge:test"]);
    assert.equal(b.unsubscribeToken, a.unsubscribeToken);
  });

  it("deactivates watchlist by unsubscribe token", async () => {
    if (existsSync(FILE)) unlinkSync(FILE);
    const row = await upsertPortfolioWatchlist({
      email: "unsub@example.com",
      locale: "fr",
    });
    assert.equal(await unsubscribePortfolioWatchlist(row.unsubscribeToken), true);
    assert.equal(await unsubscribePortfolioWatchlist("bogus-token-xx"), false);
  });
});

describe("portfolioWatchlistDigestEmail", () => {
  it("builds fr subject with alert count and unsubscribe link", () => {
    const { subject, html } = portfolioWatchlistDigestEmail({
      locale: "fr",
      alertCount: 2,
      watchedCount: 5,
      portfolioUrl: "https://example.com/green/portfolio",
      unsubscribeUrl: "https://example.com/green/portfolio/unsubscribe?token=abc",
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
    assert.match(html, /unsubscribe\?token=abc/);
  });
});

describe("dna-read-auth volume gates", () => {
  it("escalates portfolio and stream limits by tier", () => {
    assert.equal(portfolioLimitForTier("anonymous"), 20);
    assert.equal(portfolioLimitForTier("free"), 50);
    assert.equal(portfolioLimitForTier("premium"), 100);
    assert.equal(streamLimitForTier("anonymous"), 20);
    assert.equal(streamLimitForTier("enterprise"), 100);
  });
});
