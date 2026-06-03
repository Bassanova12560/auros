import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGreenMessages } from "@/lib/green";
import {
  registryPdfContentSha256,
  registryPdfIntegrityLine,
  registryPdfSignedIntegrityLine,
} from "@/lib/green/registry-pdf-integrity";
import {
  isRegistryExportContentHash,
  signRegistryExportHash,
  verifyRegistryExportSignature,
} from "@/lib/green/registry-export-signing";
import { parseGreenLabelExportFilter } from "@/lib/green/label-export-filter";
import { suggestedGreenLabelApplicationsCsvFilename } from "@/lib/green/label-applications-csv";

describe("green/sprint17-registry-pdf-hmac", () => {
  const priorKey = process.env.GREEN_EXPORT_SIGNING_KEY;
  const priorCron = process.env.CRON_SECRET;

  it("validates SHA256 hex content hash", () => {
    assert.equal(isRegistryExportContentHash("not-a-hash"), false);
    assert.equal(
      isRegistryExportContentHash(
        "a".repeat(64)
      ),
      true
    );
  });

  it("signs and verifies registry export hash with server key", async () => {
    process.env.GREEN_EXPORT_SIGNING_KEY = "test-signing-key-sprint17";
    delete process.env.CRON_SECRET;

    const hash = await registryPdfContentSha256(["proj-1"], ["ex-1"]);
    const sig = signRegistryExportHash(hash);
    assert.ok(sig);
    assert.match(sig!, /^[a-f0-9]{64}$/);
    assert.equal(verifyRegistryExportSignature(hash, sig!), true);
    assert.equal(verifyRegistryExportSignature(hash, "deadbeef".repeat(8)), false);

    if (priorKey === undefined) delete process.env.GREEN_EXPORT_SIGNING_KEY;
    else process.env.GREEN_EXPORT_SIGNING_KEY = priorKey;
    if (priorCron === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = priorCron;
  });

  it("builds signed integrity footer line", async () => {
    const hash = await registryPdfContentSha256(["a"], []);
    const line = registryPdfSignedIntegrityLine(hash, "abc123sig", "fr");
    assert.ok(line.includes("SHA256"));
    assert.ok(line.includes(`sig=abc123sig`));
    assert.equal(
      registryPdfIntegrityLine(hash, "en"),
      `Integrity SHA256: ${hash}`
    );
  });

  it("documents HMAC in registry export ops note", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      assert.ok(getGreenMessages(locale).registry.exportOpsNote.includes("HMAC"));
    }
  });
});

describe("green/sprint17-compare-snapshot-expired-i18n", () => {
  it("exposes expired and not-found copy in FR/EN/ES", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const c = getGreenMessages(locale).compare;
      assert.ok(c.snapshotExpiredTitle.length > 5);
      assert.ok(c.snapshotExpiredBody.length > 10);
      assert.ok(c.snapshotNotFoundTitle.length > 5);
      assert.ok(c.snapshotNotFoundBody.length > 10);
      assert.ok(c.snapshotExpiredCta.length > 3);
    }
  });
});

describe("green/sprint17-label-weekly-export", () => {
  it("parses weekly export filter (all or incomplete)", () => {
    assert.equal(parseGreenLabelExportFilter("all"), "all");
    assert.equal(parseGreenLabelExportFilter("incomplete"), "incomplete");
    assert.equal(parseGreenLabelExportFilter(null), "all");
  });

  it("names weekly CSV attachment", () => {
    assert.ok(suggestedGreenLabelApplicationsCsvFilename("all").includes("applications"));
    assert.ok(suggestedGreenLabelApplicationsCsvFilename("incomplete").includes("_incomplete"));
  });
});
