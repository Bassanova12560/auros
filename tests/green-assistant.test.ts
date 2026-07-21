import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GREEN_ASSISTANT_ROUTE } from "@/lib/green";
import {
  greenAssistantMailDraft,
  greenAssistantNextSteps,
  greenAssistantSuggestions,
} from "@/lib/green/assistant-playbook";
import { COPILOT_GREEN_BRIEF_STORAGE_KEY } from "@/lib/copilot/types";

describe("green assistant surface", () => {
  it("exposes assistant route and brief storage key", () => {
    assert.equal(GREEN_ASSISTANT_ROUTE, "/green/assistant");
    assert.ok(COPILOT_GREEN_BRIEF_STORAGE_KEY.includes("green"));
  });

  it("returns max 3 personalized suggestions and next steps", () => {
    const profile = { role: "issuer", asset: "dc", region: "Texas" };
    const suggestions = greenAssistantSuggestions(profile);
    const steps = greenAssistantNextSteps(profile);
    assert.equal(suggestions.length, 3);
    assert.equal(steps.length, 3);
    assert.ok(suggestions.some((s) => /eau|WELHR|data center/i.test(s)));
    assert.ok(steps.some((s) => s.href.includes("/eau/")));
  });

  it("builds a copyable mail draft without auto-send claims", () => {
    const draft = greenAssistantMailDraft({
      role: "buyer",
      asset: "solar",
      region: "France",
    });
    assert.ok(draft.includes("Objet :"));
    assert.ok(draft.includes("getauros.com"));
    assert.ok(draft.includes("indicatives"));
    assert.ok(!/envoy[ée] automatiquement/i.test(draft));
  });
});
