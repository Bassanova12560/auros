import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FUNNEL_EVENTS } from "@/lib/funnel/events";

describe("funnel events", () => {
  it("covers detect → decide → prove", () => {
    assert.equal(FUNNEL_EVENTS.detect_welhr, "funnel_detect_welhr");
    assert.equal(FUNNEL_EVENTS.decide_playbook, "funnel_decide_playbook");
    assert.equal(FUNNEL_EVENTS.decide_roi, "funnel_decide_roi");
    assert.equal(FUNNEL_EVENTS.prove_verify, "funnel_prove_verify");
  });
});
