import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { WIZARD_EXPRESS_HREF, START_HREF } from "@/lib/wizard-routes";

describe("wizard express CTAs", () => {
  it("exposes express and start routes", () => {
    assert.equal(WIZARD_EXPRESS_HREF, "/wizard?expert=1");
    assert.equal(START_HREF, "/start");
  });
});

describe("growth care agent", () => {
  it("produces HITL email_care drafts", async () => {
    const { runClientCareDraftAgent } = await import("@/lib/copilot/care-agent");
    const drafts = await runClientCareDraftAgent({ limit: 2 });
    assert.equal(drafts.length, 2);
    assert.equal(drafts[0]?.proposed_patch?.content_kind, "email_care");
    assert.match(
      String(drafts[0]?.proposed_patch?.merge_hint ?? ""),
      /no auto-email/i
    );
  });
});
