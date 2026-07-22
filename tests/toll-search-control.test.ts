/**
 * Search Control Plane v0 — ranking / ACL / audit helpers (no live market I/O).
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { TollSearchHit, TollSearchResult } from "@/lib/toll/search";
import {
  appendSearchAudit,
  applyControlPlaneRanking,
  assignHitVisibility,
  canAudienceSeeVisibility,
  clampVisibilityForAudience,
  defaultVisibilityForAudience,
  isSearchAudience,
  listSearchAudit,
  permissionForAudience,
} from "@/lib/toll/search-control";

function hit(
  partial: Pick<TollSearchHit, "kind" | "id" | "title"> &
    Partial<TollSearchHit>
): TollSearchHit {
  return {
    href: `/x/${partial.id}`,
    ...partial,
  };
}

describe("toll-search-control", () => {
  it("maps audience → permission and default visibility", () => {
    assert.equal(permissionForAudience("ai"), "open");
    assert.equal(permissionForAudience("bank"), "restricted");
    assert.equal(permissionForAudience("trading"), "confidential");
    assert.equal(permissionForAudience("regulator"), "confidential");
    assert.equal(defaultVisibilityForAudience("ai"), "public");
    assert.equal(defaultVisibilityForAudience("trading"), "private");
    assert.equal(isSearchAudience("bank"), true);
    assert.equal(isSearchAudience("hacker"), false);
  });

  it("tags hits with indicative visibility", () => {
    assert.equal(
      assignHitVisibility(hit({ kind: "dna", id: "1", title: "A" })),
      "public"
    );
    assert.equal(
      assignHitVisibility(
        hit({ kind: "market_actor", id: "2", title: "B" })
      ),
      "partial"
    );
    assert.equal(
      assignHitVisibility(
        hit({ kind: "market_offer", id: "3", title: "C" })
      ),
      "private"
    );
  });

  it("enforces indicative ACL and clamps visibility", () => {
    assert.equal(canAudienceSeeVisibility("ai", "public"), true);
    assert.equal(canAudienceSeeVisibility("ai", "private"), false);
    assert.equal(canAudienceSeeVisibility("audit", "private"), true);
    assert.equal(clampVisibilityForAudience("ai", "private"), "public");
    assert.equal(clampVisibilityForAudience("bank", "private"), "partial");
    assert.equal(clampVisibilityForAudience("regulator", "private"), "private");
  });

  it("ranks trading toward offers and filters AI away from private", () => {
    const raw: TollSearchResult = {
      query: "demo",
      total: 3,
      hits: [
        hit({ kind: "dna", id: "d1", title: "DNA Plant" }),
        hit({ kind: "market_actor", id: "a1", title: "Actor Co" }),
        hit({ kind: "market_offer", id: "o1", title: "Offer kWh" }),
      ],
    };

    const trading = applyControlPlaneRanking(raw, {
      audience: "trading",
      visibility: "private",
    });
    assert.equal(trading.hits.length, 3);
    assert.equal(trading.hits[0]?.kind, "market_offer");
    assert.ok((trading.hits[0]?.score ?? 0) > (trading.hits[1]?.score ?? 0));

    const ai = applyControlPlaneRanking(raw, {
      audience: "ai",
      visibility: "public",
    });
    assert.equal(ai.hits.length, 1);
    assert.equal(ai.hits[0]?.kind, "dna");
    assert.equal(ai.filteredOut, 2);
  });

  it("appends and lists search audit entries", () => {
    const actorId = `actor_sc_test_${Date.now()}`;
    const row = appendSearchAudit({
      q: "hydro test",
      audience: "audit",
      visibility: "private",
      permissionLevel: "confidential",
      actorId,
      hitCount: 2,
      filteredOut: 1,
    });
    assert.ok(row.id.startsWith("sca_"));
    assert.equal(row.q, "hydro test");

    const listed = listSearchAudit({ actorId, limit: 10 });
    assert.ok(listed.length >= 1);
    assert.equal(listed[0]?.actorId, actorId);
    assert.equal(listed[0]?.audience, "audit");
  });
});
