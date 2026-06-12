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
    assert.ok(released.length >= 4);
    assert.equal(released[0]?.id, "compare-endpoint");
    assert.ok(released.every((e) => e.status === "released"));
  });

  it("includes upcoming rate limit headers", () => {
    const upcoming = getUpcomingChangelogEntries();
    assert.equal(upcoming.length, 1);
    assert.equal(upcoming[0]?.id, "rate-limit-headers");
    assert.equal(upcoming[0]?.roadmapItem, 5);
  });

  it("builds JSON payload for /api/v1/changelog", () => {
    const payload = getProtocolChangelogPayload();
    assert.equal(payload.version, "1.0");
    assert.equal(payload.page_url, "/developers/changelog");
    assert.ok(payload.generated_at);
    assert.equal(payload.entries.length + payload.upcoming.length, PROTOCOL_CHANGELOG.length);
  });
});
