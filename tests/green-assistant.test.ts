import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GREEN_ASSISTANT_ROUTE } from "@/lib/green";
import { COPILOT_GREEN_BRIEF_STORAGE_KEY } from "@/lib/copilot/types";

describe("green assistant surface", () => {
  it("exposes assistant route and brief storage key", () => {
    assert.equal(GREEN_ASSISTANT_ROUTE, "/green/assistant");
    assert.ok(COPILOT_GREEN_BRIEF_STORAGE_KEY.includes("green"));
  });
});
