import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AurosProtocol, AurosProtocolError } from "../packages/auros-protocol/src/index";

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    const path = typeof url === "string" ? url : url.toString();
    return handler(path, init);
  }) as typeof fetch;
}

describe("@auros/protocol SDK", () => {
  it("score() sends auth header and parses response", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      baseUrl: "https://getauros.com",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/score"));
        assert.equal(init?.method, "POST");
        const headers = init?.headers as Record<string, string>;
        assert.equal(headers.Authorization, "Bearer auros_pk_test_demo");
        return Response.json({
          disclaimer: "test",
          score: 72,
          grade: "B-",
          status: "progress",
          breakdown: {
            legal_structure: 70,
            kyc_aml: 70,
            mica_compliance: 70,
            data_room: 70,
            investor_protection: 70,
          },
          mica_classification: "financial_instrument",
          critical_gaps: [],
          recommendations: [],
          recommended_jurisdictions: [],
          recommended_platforms: [],
          meta: {
            version: "1.0",
            computed_at: "2026-06-11T00:00:00.000Z",
            full_report_url: "https://getauros.com/wizard",
            parsed_keywords: [],
          },
        });
      }),
    });

    const result = await client.score({ description: "Test asset description here" });
    assert.equal(result.score, 72);
    assert.equal(result.grade, "B-");
  });

  it("products() builds query string", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url) => {
        assert.ok(url.includes("category=bonds"));
        assert.ok(url.includes("limit=5"));
        return Response.json({
          disclaimer: "test",
          products: [],
          pagination: { page: 1, limit: 5, total: 0, total_pages: 0 },
          fetched_at: "2026-06-11T00:00:00.000Z",
        });
      }),
    });

    const result = await client.products({ category: "bonds", limit: 5 });
    assert.equal(result.products.length, 0);
  });

  it("jurisdictions() returns ranked list", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch(() =>
        Response.json({
          disclaimer: "test",
          jurisdictions: [{ id: "luxembourg", score: 88, rationale: "test" }],
          query: { asset_type: "real_estate" },
        })
      ),
    });

    const result = await client.jurisdictions({ asset_type: "real_estate" });
    assert.equal(result.jurisdictions[0]?.id, "luxembourg");
  });

  it("checklist() posts body", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url, init) => {
        assert.equal(init?.method, "POST");
        const body = JSON.parse(init?.body as string);
        assert.equal(body.jurisdiction, "luxembourg");
        return Response.json({
          disclaimer: "test",
          asset_type: "real_estate",
          jurisdiction: "luxembourg",
          structure: "spv",
          items: [],
          total_items: 0,
          estimated_total_days: 0,
          estimated_total_cost_eur: 0,
        });
      }),
    });

    await client.checklist({
      asset_type: "real_estate",
      jurisdiction: "luxembourg",
    });
  });

  it("createKey() works without auth header", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/keys"));
        const headers = init?.headers as Record<string, string>;
        assert.equal(headers.Authorization, undefined);
        return Response.json({
          disclaimer: "test",
          ok: true,
          api_key: "auros_pk_live_testkey",
          tier: "free",
          monthly_limit: 100,
        });
      }),
    });

    const result = await client.createKey({ email: "dev@test.com" });
    assert.equal(result.ok, true);
    assert.ok(result.api_key?.startsWith("auros_pk_"));
  });

  it("throws AurosProtocolError on API error", async () => {
    const client = new AurosProtocol({
      apiKey: "invalid",
      fetch: mockFetch(() =>
        Response.json(
          {
            disclaimer: "test",
            error: { code: "unauthorized", message: "Invalid API key" },
          },
          { status: 401 }
        )
      ),
    });

    await assert.rejects(
      () => client.score({ description: "Valid description here" }),
      (err: unknown) => {
        assert.ok(err instanceof AurosProtocolError);
        assert.equal(err.code, "unauthorized");
        assert.equal(err.status, 401);
        return true;
      }
    );
  });

  it("requires apiKey in constructor", () => {
    assert.throws(() => new AurosProtocol({ apiKey: "" }), /apiKey is required/);
  });
});
