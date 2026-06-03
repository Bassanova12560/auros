import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGreenMessages } from "@/lib/green";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import {
  buildGreenCompareSnapshotPath,
  buildGreenCompareSnapshotUrl,
  filterCompareRowsBySnapshot,
  normalizeCompareSnapshotPayload,
} from "@/lib/green/compare-snapshot";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import {
  classifyLabelReminderBucket,
  getGreenLabelReminderStats,
} from "@/lib/green/label-reminder-stats";
import { isGreenLabelApplicationIncomplete } from "@/lib/green/label-incomplete-reminder";
import {
  greenRegistryExpertsToPdfRows,
  greenRegistryPdfMeta,
  greenRegistryProjectsToPdfRows,
} from "@/lib/green/registry-pdf";

describe("green/sprint14-registry-pdf-enriched", () => {
  it("maps registry PDF rows with location and RTMS snippet", async () => {
    const snapshot = await getGreenRegistrySnapshot();
    if (snapshot.projects.length === 0) return;

    const labels = getGreenMessages("fr");
    const rows = greenRegistryProjectsToPdfRows(
      snapshot.projects.slice(0, 1),
      labels.registry,
      labels.compare,
      "fr"
    );
    assert.ok(rows[0]!.location.length > 0);
    assert.ok(rows[0]!.rtmsSnippet.length > 0);
    assert.ok(rows[0]!.rtmsTierNote.includes("RTMS"));
  });

  it("builds PDF meta and expert rows", async () => {
    const snapshot = await getGreenRegistrySnapshot();
    const meta = greenRegistryPdfMeta(snapshot.projects, snapshot.experts);
    assert.equal(meta.projectCount, snapshot.projects.length);
    assert.equal(meta.expertCount, snapshot.experts.length);
    const expertRows = greenRegistryExpertsToPdfRows(snapshot.experts);
    assert.equal(expertRows.length, snapshot.experts.length);
  });
});

describe("green/sprint14-compare-snapshot", () => {
  it("normalizes snapshot payload", () => {
    const payload = normalizeCompareSnapshotPayload({
      countries: ["France", "France"],
      offerIds: ["offer-1"],
      rwaRowIds: ["toucan", "invalid"],
    });
    assert.deepEqual(payload?.countries, ["France"]);
    assert.deepEqual(payload?.offerIds, ["offer-1"]);
    assert.deepEqual(payload?.rwaRowIds, ["toucan"]);
  });

  it("rejects empty snapshot payload", () => {
    assert.equal(normalizeCompareSnapshotPayload({}), null);
  });

  it("filters compare rows by snapshot rwa ids", () => {
    const filtered = filterCompareRowsBySnapshot(["toucan", "moss"]);
    assert.equal(filtered.length, 2);
    assert.equal(filterCompareRowsBySnapshot([]).length, GREEN_COMPARE_ROWS.length);
  });

  it("builds snapshot share paths", () => {
    assert.equal(buildGreenCompareSnapshotPath("abc123"), "/green/compare/s/abc123");
    assert.ok(buildGreenCompareSnapshotUrl("abc123", "https://auros.example").includes("/s/abc123"));
  });

  it("exposes compare snapshot i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const c = getGreenMessages(locale).compare;
      assert.ok(c.saveSnapshotLink.length > 0);
      assert.ok(c.snapshotLoaded("x").includes("x"));
    }
  });
});

describe("green/sprint14-label-reminder-stats", () => {
  it("classifies reminder buckets", () => {
    const incomplete = {
      project_name: "P",
      contact_name: "A",
      email: "a@x.com",
      website: "https://x.com",
      country: "FR",
      description: "short",
      document_path: null,
      reminder_sent_at: null,
      second_reminder_sent_at: null,
    };
    assert.equal(classifyLabelReminderBucket(incomplete), "pendingIncomplete");

    assert.equal(
      classifyLabelReminderBucket({
        ...incomplete,
        description: "Long enough description for review purposes here.",
        reminder_sent_at: "2026-06-01T00:00:00Z",
      }),
      "remindedOnce"
    );

    const complete = {
      project_name: "P",
      contact_name: "A",
      email: "a@x.com",
      website: "https://x.com",
      country: "FR",
      description: "Long enough description for review purposes here.",
      document_path: "docs/x.pdf",
    };
    assert.equal(isGreenLabelApplicationIncomplete(complete).incomplete, false);
    assert.equal(classifyLabelReminderBucket(complete), "complete");
  });

  it("loads reminder stats without throwing when DB unavailable", async () => {
    const stats = await getGreenLabelReminderStats();
    if (stats) {
      assert.ok(stats.total >= 0);
      assert.equal(
        stats.pendingIncomplete + stats.remindedOnce + stats.remindedTwice + stats.complete,
        stats.total
      );
    }
  });
});
