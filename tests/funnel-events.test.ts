import { describe, expect, it } from "vitest";

import { FUNNEL_EVENTS } from "../lib/funnel/events";

describe("funnel events", () => {
  it("covers detect → decide → prove", () => {
    expect(FUNNEL_EVENTS.detect_welhr).toBe("funnel_detect_welhr");
    expect(FUNNEL_EVENTS.decide_playbook).toBe("funnel_decide_playbook");
    expect(FUNNEL_EVENTS.decide_roi).toBe("funnel_decide_roi");
    expect(FUNNEL_EVENTS.prove_verify).toBe("funnel_prove_verify");
  });
});
