import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGreenMessages } from "@/lib/green";
import {
  GREEN_COMPARE_SNAPSHOT_AUTO_RENEW_DAYS,
  GREEN_COMPARE_SNAPSHOT_TTL_DAYS,
  isCompareSnapshotNearExpiry,
} from "@/lib/green/compare-snapshot";
import { buildGreenLabelWeeklyExportEmailHtml } from "@/lib/green/label-weekly-export-email";
import {
  parseRegistryPdfContentHash,
  parseRegistryPdfSignature,
} from "@/lib/green/registry-export-verify-client";

describe("green/sprint18-compare-snapshot-renew", () => {
  it("detects snapshot near expiry within auto-renew window", () => {
    const now = Date.parse("2026-06-01T00:00:00.000Z");
    const inFiveDays = new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString();
    const inTenDays = new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString();
    assert.equal(isCompareSnapshotNearExpiry(inFiveDays, now), true);
    assert.equal(isCompareSnapshotNearExpiry(inTenDays, now), false);
    assert.equal(GREEN_COMPARE_SNAPSHOT_AUTO_RENEW_DAYS, 7);
    assert.equal(GREEN_COMPARE_SNAPSHOT_TTL_DAYS, 30);
  });
});

describe("green/sprint18-registry-export-verify-ui", () => {
  it("parses hash and sig from PDF integrity footer line", () => {
    const hash = "a".repeat(64);
    const sig = "b".repeat(64);
    const line = `Intégrité SHA256 : ${hash} · sig=${sig}`;
    assert.equal(parseRegistryPdfContentHash(line), hash);
    assert.equal(parseRegistryPdfSignature(line), sig);
  });

  it("exposes registry export verify copy in FR/EN/ES", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const v = getGreenMessages(locale).registry.exportVerify;
      assert.ok(v.title.length > 5);
      assert.ok(v.submit.length > 3);
      assert.ok(v.hint.includes("verify-registry-export"));
    }
  });
});

describe("green/sprint18-label-weekly-export-email", () => {
  it("includes reminder stats table in weekly export e-mail body", () => {
    const html = buildGreenLabelWeeklyExportEmailHtml({
      filter: "all",
      rowCount: 12,
      filename: "auros-green-label-applications.csv",
      date: "2026-06-03",
      stats: {
        pendingIncomplete: 2,
        remindedOnce: 1,
        remindedTwice: 0,
        complete: 9,
        total: 12,
      },
    });
    assert.ok(html.includes("Relances dossiers incomplets"));
    assert.ok(html.includes("<strong>2</strong>"));
    assert.ok(html.includes("<strong>12</strong>"));
    assert.ok(html.includes("12 ligne(s)"));
  });

  it("handles missing stats gracefully", () => {
    const html = buildGreenLabelWeeklyExportEmailHtml({
      filter: "incomplete",
      rowCount: 0,
      filename: "auros-green-label-applications_incomplete.csv",
      date: "2026-06-03",
      stats: null,
    });
    assert.ok(html.includes("indisponibles"));
  });
});

describe("green/sprint19-compare-snapshot-i18n", () => {
  it("exposes renew and expiry copy in FR/EN/ES", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const c = getGreenMessages(locale).compare;
      assert.ok(c.snapshotRenewCta.length > 3);
      assert.ok(c.snapshotRenewing.length > 3);
      assert.ok(c.snapshotExpiresAt("2026-06-03").includes("2026-06-03"));
    }
  });
});
