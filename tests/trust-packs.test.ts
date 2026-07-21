import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { questionsForPack } from "@/lib/trust-packs/definitions";
import { INSTITUTION_RWA_INDEX } from "@/lib/trust-packs/institutions";
import { scoreTrustPack } from "@/lib/trust-packs/score";
import { TRUST_PACK_IDS, TRUST_PACK_META } from "@/lib/trust-packs/taxonomy";

describe("trust packs", () => {
  it("defines seven packs with weighted questions summing ~1", () => {
    assert.equal(TRUST_PACK_IDS.length, 7);
    for (const id of TRUST_PACK_IDS) {
      assert.ok(TRUST_PACK_META[id].label);
      const qs = questionsForPack(id);
      assert.ok(qs.length >= 4);
      const sum = qs.reduce((a, q) => a + q.weight, 0);
      assert.ok(Math.abs(sum - 1) < 0.02, `${id} weights=${sum}`);
    }
  });

  it("ignores unsourced checkboxes", () => {
    const bad = scoreTrustPack({
      packId: "real_estate",
      checklist: {
        legal_title: true,
        spv_register: true,
        token_vs_title: true,
        insurance: true,
        custody_ops: true,
        recourse_pqc: true,
      },
    });
    assert.equal(bad.sourced, 0);
    assert.ok(bad.score <= 2.5);

    const good = scoreTrustPack({
      packId: "real_estate",
      checklist: {
        legal_title: true,
        spv_register: true,
        token_vs_title: true,
        insurance: false,
        custody_ops: false,
        recourse_pqc: false,
      },
      evidence: {
        legal_title: { url: "https://example.com/deed.pdf" },
        spv_register: { excerpt: "Register shall prevail" },
        token_vs_title: { url: "https://example.com/om.md" },
      },
    });
    assert.equal(good.sourced, 3);
    assert.ok(good.score >= 5);
    assert.ok(good.grade === "B" || good.grade === "C" || good.grade === "A");
  });

  it("capacity pack scores queue/BTM question", () => {
    const r = scoreTrustPack({
      packId: "capacity_rights",
      checklist: { queue_or_btm: true, right_instrument: true },
      evidence: {
        queue_or_btm: { excerpt: "BTM limited export agreement" },
        right_instrument: { url: "https://example.com/interconnect.pdf" },
      },
    });
    assert.ok(r.sourced >= 2);
    assert.ok(r.score > 3);
  });

  it("institutions index has entries", () => {
    assert.ok(INSTITUTION_RWA_INDEX.length >= 8);
  });
});
