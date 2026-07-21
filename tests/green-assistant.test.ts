import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GREEN_ASSISTANT_ROUTE } from "@/lib/green";
import { getGreenAssistantUi } from "@/lib/green/assistant-i18n";
import {
  greenAssistantMailDraft,
  greenAssistantNextSteps,
  greenAssistantSuggestions,
} from "@/lib/green/assistant-playbook";
import { COPILOT_GREEN_BRIEF_STORAGE_KEY } from "@/lib/copilot/types";
import { suggestionsForContext } from "@/lib/copilot/ui-i18n";

describe("green assistant surface", () => {
  it("exposes assistant route and brief storage key", () => {
    assert.equal(GREEN_ASSISTANT_ROUTE, "/green/assistant");
    assert.ok(COPILOT_GREEN_BRIEF_STORAGE_KEY.includes("green"));
  });

  it("returns max 3 personalized suggestions and next steps (fr)", () => {
    const profile = { role: "issuer", asset: "dc", region: "Texas" };
    const suggestions = greenAssistantSuggestions(profile, "fr");
    const steps = greenAssistantNextSteps(profile, "fr");
    assert.equal(suggestions.length, 3);
    assert.equal(steps.length, 3);
    assert.ok(suggestions.some((s) => /eau|WELHR|data center/i.test(s)));
    assert.ok(steps.some((s) => s.href.includes("/eau/")));
  });

  it("localizes suggestions and mail draft for en and ar", () => {
    const profile = { role: "buyer", asset: "solar", region: "France" };
    const enSug = greenAssistantSuggestions(profile, "en");
    const arSug = greenAssistantSuggestions(profile, "ar");
    assert.equal(enSug.length, 3);
    assert.equal(arSug.length, 3);
    assert.ok(enSug.some((s) => /check|compare|verify|PPA|solar/i.test(s)));
    assert.ok(arSug.some((s) => /تحقق|قارن|PPA|شمسي/.test(s)));

    const enMail = greenAssistantMailDraft(profile, "en");
    const arMail = greenAssistantMailDraft(profile, "ar");
    assert.ok(enMail.startsWith("Subject:"));
    assert.ok(arMail.includes("الموضوع:"));
    assert.ok(enMail.includes("getauros.com"));
    assert.ok(!/Objet :/.test(enMail));
  });

  it("exposes UI strings for all five locales", () => {
    for (const locale of ["fr", "en", "es", "ar", "zh"] as const) {
      const ui = getGreenAssistantUi(locale);
      assert.ok(ui.title.length > 0);
      assert.ok(ui.navAssistant.length > 0);
      assert.ok(ui.fabTitle.length > 0);
    }
  });
});

describe("copilot suggestions i18n", () => {
  it("returns three localized green suggestions", () => {
    const ctx = { surface: "green" as const };
    const fr = suggestionsForContext(ctx, "fr");
    const zh = suggestionsForContext(ctx, "zh");
    assert.equal(fr.length, 3);
    assert.equal(zh.length, 3);
    assert.notEqual(fr[0], zh[0]);
  });
});
