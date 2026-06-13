import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getProtocolChangelogPayload,
  getReleasedChangelogEntries,
  getUpcomingChangelogEntries,
  PROTOCOL_CHANGELOG,
} from "../lib/protocol/changelog";

describe("protocol/changelog", () => {
  it("lists released entries newest first", () => {
    const released = getReleasedChangelogEntries();
    assert.ok(released.some((e) => e.id === "benchmarks-endpoint"));
    assert.ok(released.some((e) => e.id === "mcp-server"));
    assert.ok(released.some((e) => e.id === "webhook-replay-dlq"));
    assert.ok(released.some((e) => e.id === "regulatory-feed-endpoint"));
    assert.ok(released.length >= 9);
    assert.ok(released.every((e) => e.status === "released"));
    for (let i = 1; i < released.length; i++) {
      assert.ok(released[i - 1]!.date >= released[i]!.date);
    }
  });

  it("has no upcoming entries", () => {
    const upcoming = getUpcomingChangelogEntries();
    assert.equal(upcoming.length, 0);
  });

  it("builds JSON payload for /api/v1/changelog", () => {
    const payload = getProtocolChangelogPayload();
    assert.equal(payload.version, "1.0");
    assert.equal(payload.page_url, "/developers/changelog");
    assert.ok(payload.generated_at);
    assert.equal(payload.entries.length + payload.upcoming.length, PROTOCOL_CHANGELOG.length);
  });
});
