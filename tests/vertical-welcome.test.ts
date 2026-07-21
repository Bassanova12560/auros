import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  H2O_RWA_PATH,
  VERTICAL_WELCOMES,
  WETS_WELCOME_PATH,
} from "@/lib/vertical-welcome/config";

describe("vertical welcome landings", () => {
  it("each welcome has at most 3 features and at least one CTA", () => {
    for (const cfg of Object.values(VERTICAL_WELCOMES)) {
      assert.ok(cfg.features.length <= 3, cfg.path);
      assert.ok(cfg.features.length >= 1, cfg.path);
      assert.ok(cfg.ctas.length >= 1, cfg.path);
      assert.ok(cfg.ctas.some((c) => c.primary), cfg.path);
    }
  });

  it("H2O RWA landing points to eau hub", () => {
    const h = VERTICAL_WELCOMES[H2O_RWA_PATH]!;
    assert.ok(h.ctas.some((c) => c.href === "/eau" && c.primary));
  });

  it("WETS welcome points to console paths", () => {
    const w = VERTICAL_WELCOMES[WETS_WELCOME_PATH]!;
    assert.ok(w.ctas.some((c) => c.href.includes("/eau/trust/console")));
  });
});
