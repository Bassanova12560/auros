import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  defaultSlaDueAt,
  isTollExceptionKind,
  isTollExceptionSeverity,
  isTollExceptionStatus,
  normalizeOptionalText,
  parseCreateExceptionInput,
  parseResolveExceptionInput,
  parseUpdateExceptionInput,
} from "@/lib/toll/exceptions";

describe("toll exceptions helpers", () => {
  it("recognizes status / severity / kind", () => {
    assert.equal(isTollExceptionStatus("open"), true);
    assert.equal(isTollExceptionStatus("escalated"), true);
    assert.equal(isTollExceptionStatus("resolved"), true);
    assert.equal(isTollExceptionStatus("closed"), true);
    assert.equal(isTollExceptionStatus("pending"), false);

    assert.equal(isTollExceptionSeverity("high"), true);
    assert.equal(isTollExceptionSeverity("critical"), false);

    assert.equal(isTollExceptionKind("missing_docs"), true);
    assert.equal(isTollExceptionKind("jurisdiction_conflict"), true);
    assert.equal(isTollExceptionKind("stale_data"), true);
    assert.equal(isTollExceptionKind("partial_availability"), true);
    assert.equal(isTollExceptionKind("broker"), false);
  });

  it("trims optional text", () => {
    assert.equal(normalizeOptionalText("  hello  ", 10), "hello");
    assert.equal(normalizeOptionalText("   ", 10), undefined);
    assert.equal(normalizeOptionalText(12, 10), undefined);
  });

  it("computes default SLA by severity", () => {
    const now = Date.parse("2026-07-22T12:00:00.000Z");
    const high = defaultSlaDueAt("high", now);
    const medium = defaultSlaDueAt("medium", now);
    const low = defaultSlaDueAt("low", now);
    assert.equal(high, "2026-07-23T12:00:00.000Z");
    assert.equal(medium, "2026-07-25T12:00:00.000Z");
    assert.equal(low, "2026-07-29T12:00:00.000Z");
  });

  it("parses a valid create body", () => {
    const parsed = parseCreateExceptionInput({
      kind: "stale_data",
      severity: "high",
      title: "  Trail older than 90d  ",
      summary: "Docs not refreshed since Q1",
      assetDnaId: "auros:dna:v1:demo",
      autoSla: true,
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.data.kind, "stale_data");
    assert.equal(parsed.data.severity, "high");
    assert.equal(parsed.data.title, "Trail older than 90d");
    assert.ok(parsed.data.dueAt);
  });

  it("rejects invalid create bodies", () => {
    assert.equal(parseCreateExceptionInput(null).ok, false);
    assert.equal(
      parseCreateExceptionInput({
        kind: "broker",
        severity: "high",
        title: "x",
        summary: "y",
      }).ok,
      false
    );
    const noTitle = parseCreateExceptionInput({
      kind: "other",
      severity: "low",
      title: "  ",
      summary: "ok",
    });
    assert.equal(noTitle.ok, false);
    if (noTitle.ok) return;
    assert.equal(noTitle.error, "invalid_title");
  });

  it("parses updates and blocks resolve-via-status", () => {
    const ok = parseUpdateExceptionInput({
      status: "escalated",
      note: "needs legal",
    });
    assert.equal(ok.ok, true);

    const viaResolve = parseUpdateExceptionInput({ status: "resolved" });
    assert.equal(viaResolve.ok, false);
    if (viaResolve.ok) return;
    assert.equal(viaResolve.error, "use_resolve_action");

    assert.equal(parseUpdateExceptionInput({}).ok, false);
  });

  it("requires a resolution note for HITL resolve", () => {
    const bad = parseResolveExceptionInput({ action: "resolve" });
    assert.equal(bad.ok, false);

    const good = parseResolveExceptionInput({
      resolutionNote: "  Verified registry extract attached  ",
      close: true,
    });
    assert.equal(good.ok, true);
    if (!good.ok) return;
    assert.equal(good.data.resolutionNote, "Verified registry extract attached");
    assert.equal(good.data.close, true);
  });
});
