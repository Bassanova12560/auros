import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGreenMessages } from "@/lib/green";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import {
  filterCompareRowsBySnapshot,
  normalizeCompareSnapshotPayload,
} from "@/lib/green/compare-snapshot";
import {
  greenLabelApplicationsToCsv,
  suggestedGreenLabelApplicationsCsvFilename,
} from "@/lib/green/label-applications-csv";
import {
  GREEN_COMPARE_RWA_URL_PARAM,
  buildGreenCompareShareUrl,
  compareRwaRowIdsForShare,
  normalizeCompareRwaRowIds,
  parseCompareRwaRowIdsParam,
} from "@/lib/green/market/compare-selection";
import { registryPdfExportFooter } from "@/lib/green/registry-pdf";

describe("green/sprint15-registry-pdf-watermark", () => {
  it("builds localized export footer with date", () => {
    assert.equal(
      registryPdfExportFooter("2026-06-03", "fr"),
      "AUROS Green Registre — export 2026-06-03"
    );
    assert.equal(
      registryPdfExportFooter("2026-06-03", "en"),
      "AUROS Green Registry — export 2026-06-03"
    );
    assert.ok(getGreenMessages("fr").registry.exportOpsNote.length > 10);
  });
});

describe("green/sprint15-compare-rwa-selection", () => {
  it("normalizes and parses rwa row ids", () => {
    assert.deepEqual(normalizeCompareRwaRowIds(["toucan", "invalid", "toucan"]), ["toucan"]);
    assert.deepEqual(parseCompareRwaRowIdsParam("toucan,moss"), ["toucan", "moss"]);
    assert.equal(GREEN_COMPARE_RWA_URL_PARAM, "rwa");
  });

  it("omits rwa param when all rows selected for share", () => {
    const allIds = GREEN_COMPARE_ROWS.map((row) => row.id);
    assert.deepEqual(compareRwaRowIdsForShare(allIds), []);
    assert.deepEqual(compareRwaRowIdsForShare(["toucan"]), ["toucan"]);
  });

  it("builds share URL with rwa subset", () => {
    const url = buildGreenCompareShareUrl({
      offerIds: [],
      countries: [],
      rwaRowIds: ["toucan", "moss"],
      origin: "https://auros.example",
    });
    assert.equal(url, "https://auros.example/green/compare?rwa=toucan%2Cmoss");
  });

  it("accepts rwa-only snapshot payload", () => {
    const payload = normalizeCompareSnapshotPayload({
      countries: [],
      offerIds: [],
      rwaRowIds: ["toucan"],
    });
    assert.deepEqual(payload?.rwaRowIds, ["toucan"]);
    assert.equal(filterCompareRowsBySnapshot(["toucan"]).length, 1);
  });

  it("exposes compare rwa selection i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const c = getGreenMessages(locale).compare;
      assert.ok(c.rwaRowInclude.length > 0);
      assert.ok(c.rwaRowSelectAll.length > 0);
      assert.ok(c.rwaRowSelectClear.length > 0);
    }
  });
});

describe("green/sprint15-label-csv-export", () => {
  it("maps label applications to ops CSV columns", () => {
    const csv = greenLabelApplicationsToCsv([
      {
        id: "uuid-1",
        org: "Solar Co",
        email: "ops@example.com",
        status: "pending",
        preferredLocale: "fr",
        reminderSentAt: null,
        secondReminderSentAt: null,
        hasDocument: false,
        createdAt: "2026-06-01T12:00:00Z",
      },
    ]);
    assert.ok(csv.startsWith("id,org,email,status,preferred_locale"));
    assert.ok(csv.includes("Solar Co"));
    assert.ok(csv.includes(",no,"));
    assert.ok(suggestedGreenLabelApplicationsCsvFilename().includes("auros-green-label-applications"));
  });
});
