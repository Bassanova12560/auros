import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGreenMessages } from "@/lib/green";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import {
  buildCompareUrlFromSnapshotPayload,
} from "@/lib/green/compare-snapshot-share";
import { normalizeCompareSnapshotPayload } from "@/lib/green/compare-snapshot";
import {
  matchesGreenLabelExportFilter,
  parseGreenLabelExportFilter,
} from "@/lib/green/label-export-filter";
import { suggestedGreenLabelApplicationsCsvFilename } from "@/lib/green/label-applications-csv";
import { buildGreenCompareShareUrl } from "@/lib/green/market/compare-selection";
import {
  registryPdfCertifiedLabel,
  registryPdfContentSha256,
  registryPdfIntegrityLine,
  registryPdfRowIdsPayload,
} from "@/lib/green/registry-pdf-integrity";
import { registryPdfExportFooter } from "@/lib/green/registry-pdf";

describe("green/sprint16-registry-pdf-certified", () => {
  it("builds certified label with UTC ISO timestamp", () => {
    const iso = "2026-06-03T12:34:56.789Z";
    assert.equal(registryPdfCertifiedLabel(iso, "fr"), `Export certifié AUROS — ${iso}`);
    assert.equal(registryPdfCertifiedLabel(iso, "en"), `AUROS certified export — ${iso}`);
    assert.ok(registryPdfExportFooter("2026-06-03", "fr").includes("2026-06-03"));
  });

  it("computes stable SHA256 from sorted row ids", async () => {
    const payload = registryPdfRowIdsPayload(["b", "a"], ["ex-2", "ex-1"]);
    assert.equal(payload, "a|b|ex-1|ex-2");
    const hash = await registryPdfContentSha256(["b", "a"], ["ex-2", "ex-1"]);
    assert.match(hash, /^[a-f0-9]{64}$/);
    assert.equal(
      await registryPdfContentSha256(["a", "b"], ["ex-1", "ex-2"]),
      hash
    );
    assert.ok(registryPdfIntegrityLine(hash, "fr").includes("SHA256"));
  });

  it("documents certified export ops note in i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      assert.ok(getGreenMessages(locale).registry.exportOpsNote.includes("SHA256"));
    }
  });
});

describe("green/sprint16-compare-snapshot-combined", () => {
  it("builds share URL with countries, offers and rwa together", () => {
    const payload = normalizeCompareSnapshotPayload({
      countries: ["France", "Portugal"],
      offerIds: ["offer-1", "offer-2"],
      rwaRowIds: ["toucan", "moss"],
    });
    assert.ok(payload);
    const url = buildCompareUrlFromSnapshotPayload(payload!, "https://auros.example");
    assert.ok(url.includes("countries=France%2CPortugal"));
    assert.ok(url.includes("offers=offer-1%2Coffer-2"));
    assert.ok(url.includes("rwa=toucan%2Cmoss"));
  });

  it("matches direct share URL builder for combined dimensions", () => {
    const payload = {
      countries: ["France"],
      offerIds: ["abc"],
      rwaRowIds: ["toucan"],
    };
    assert.equal(
      buildCompareUrlFromSnapshotPayload(payload, "https://auros.example"),
      buildGreenCompareShareUrl({ ...payload, origin: "https://auros.example" })
    );
  });

  it("accepts countries-only snapshot payload", () => {
    const payload = normalizeCompareSnapshotPayload({
      countries: ["Spain"],
      offerIds: [],
      rwaRowIds: [],
    });
    assert.deepEqual(payload?.countries, ["Spain"]);
  });

  it("restores rwa subset from snapshot payload", () => {
    const payload = normalizeCompareSnapshotPayload({
      countries: [],
      offerIds: [],
      rwaRowIds: ["toucan"],
    });
    assert.deepEqual(payload?.rwaRowIds, ["toucan"]);
    assert.notEqual(payload?.rwaRowIds.length, GREEN_COMPARE_ROWS.length);
  });
});

describe("green/sprint16-label-csv-filter", () => {
  it("parses export filter param", () => {
    assert.equal(parseGreenLabelExportFilter("pending"), "pending");
    assert.equal(parseGreenLabelExportFilter("reminded_2"), "reminded_2");
    assert.equal(parseGreenLabelExportFilter("bogus"), "all");
  });

  it("filters by status and reminder buckets", () => {
    const base = {
      id: "1",
      org: "Solar",
      email: "a@x.com",
      preferredLocale: "fr" as const,
      createdAt: "2026-06-01T00:00:00Z",
      contactName: "Ada",
      website: "https://x.com",
      country: "FR",
      description: "Short",
      reminderSentAt: null,
      secondReminderSentAt: null,
      hasDocument: false,
    };

    assert.equal(
      matchesGreenLabelExportFilter({ ...base, status: "pending" }, "pending"),
      true
    );
    assert.equal(
      matchesGreenLabelExportFilter({ ...base, status: "in_review" }, "pending"),
      false
    );
    assert.equal(matchesGreenLabelExportFilter(base, "incomplete"), true);
    assert.equal(
      matchesGreenLabelExportFilter(
        {
          ...base,
          status: "pending",
          description: "Long enough description for review purposes here.",
          reminderSentAt: "2026-06-02T00:00:00Z",
        },
        "reminded_1"
      ),
      true
    );
  });

  it("names filtered CSV files", () => {
    assert.ok(suggestedGreenLabelApplicationsCsvFilename("pending").includes("_pending"));
  });

  it("exposes admin export filter i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const a = getGreenMessages(locale).admin;
      assert.ok(a.exportFilterLabel.length > 0);
      assert.ok(a.exportFilterReminded2.length > 0);
    }
  });
});
