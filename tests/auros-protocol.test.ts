import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AurosProtocol, AurosProtocolError } from "../packages/auros-protocol/src/index";

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    const path = typeof url === "string" ? url : url.toString();
    return handler(path, init);
  }) as typeof fetch;
}

describe("@adrien1212balitrand/auros-protocol SDK", () => {
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

    const result = await client.score({ description: "Valid description here" });
    assert.equal(result.score, 72);
    assert.equal(result.grade, "B-");
  });

  it("attest() posts premium create payload", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      baseUrl: "https://getauros.com",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/attest"));
        assert.equal(init?.method, "POST");
        return Response.json({
          id: "att_abc",
          content_hash: "a".repeat(64),
          signature: "b".repeat(64),
          verify_url: "https://getauros.com/attest/att_abc",
          dossier_id: "dos_1",
          locale: "fr",
          public: {
            score: 70,
            grade: "B",
            status: "progress",
            mica_classification: "financial_instrument",
            sections: ["disclaimers"],
            generated_at: "2026-07-19T00:00:00.000Z",
          },
          created_at: "2026-07-19T00:00:00.000Z",
          disclaimer: "test",
          valid: true,
        });
      }),
    });

    const result = await client.attest({
      score: { description: "Entrepôt retail Luxembourg €2.5M SPV professionnels" },
    });
    assert.equal(result.id, "att_abc");
    assert.equal(result.valid, true);
  });

  it("createChargeflowE() posts CFU-E mint", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/chargeflow"));
        assert.equal(init?.method, "POST");
        return Response.json({
          id: "cfu_e_abc",
          unit_kind: "e",
          content_hash: "a".repeat(64),
          signature: "b".repeat(64),
          verify_url: "https://getauros.com/chargeflow/cfu_e_abc",
          status: "active",
          public: { energy_kwh: 10 },
          created_at: "2026-07-19T00:00:00.000Z",
          disclaimer: "test",
          valid: true,
        });
      }),
    });
    const result = await client.createChargeflowE({
      session: {
        external_session_id: "s1",
        started_at: "2026-07-19T10:00:00Z",
        ended_at: "2026-07-19T11:00:00Z",
        energy_kwh: 10,
      },
    });
    assert.equal(result.unit_kind, "e");
    assert.equal(result.id, "cfu_e_abc");
  });

  it("retireChargeflow() posts retire", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.includes("/api/v1/chargeflow/cfu_e_abc/retire"));
        assert.equal(init?.method, "POST");
        return Response.json({
          id: "cfu_e_abc",
          unit_kind: "e",
          content_hash: "a".repeat(64),
          signature: "b".repeat(64),
          verify_url: "https://getauros.com/chargeflow/cfu_e_abc",
          status: "retired",
          public: {},
          created_at: "2026-07-19T00:00:00.000Z",
          disclaimer: "test",
          valid: true,
        });
      }),
    });
    const result = await client.retireChargeflow("cfu_e_abc", {
      reason: "cited",
    });
    assert.equal(result.status, "retired");
  });

  it("wattsReserve() posts profile intent", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/watts/reserve"));
        assert.equal(init?.method, "POST");
        return Response.json({
          reservation_id: "11111111-1111-1111-1111-111111111111",
          status: "pending_confirm",
          match_score: 85,
          match_reasons: [],
          suggested_unit_kind: "e",
          disclaimer: "test",
          next_step: "confirm",
        });
      }),
    });
    const result = await client.wattsReserve({
      window: {
        start: "2026-07-20T18:00:00.000Z",
        end: "2026-07-20T22:00:00.000Z",
      },
      energy_kwh: 20,
      zone: { country: "FR" },
      firmness: "firm",
    });
    assert.equal(result.status, "pending_confirm");
    assert.equal(result.match_score, 85);
  });

  it("wattsSecondaryList() posts listing", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/watts/secondary"));
        assert.equal(init?.method, "POST");
        return Response.json({
          listing_id: "22222222-2222-2222-2222-222222222222",
          status: "open",
          indicative_price_eur: 1200,
          interest_count: 0,
          disclaimer: "test",
          compare_url: "/compare?ids=prod",
        });
      }),
    });
    const result = await client.wattsSecondaryList({
      indicative_price_eur: 1200,
      energy_kwh: 50,
      zone: { country: "FR" },
      compare_ref_id: "prod",
    });
    assert.equal(result.status, "open");
    assert.equal(result.indicative_price_eur, 1200);
  });

  it("listChargeflow() gets with query", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.includes("/api/v1/chargeflow?kind=e&status=active"));
        assert.equal(init?.method, "GET");
        return Response.json({
          total: 1,
          limit: 50,
          offset: 0,
          items: [
            {
              id: "cfu_e_abc",
              unit_kind: "e",
              status: "active",
              created_at: "2026-07-19T00:00:00.000Z",
              retired_at: null,
              operator_id: null,
              external_ref: "s1",
              content_hash: "a".repeat(64),
              energy_kwh: 10,
            },
          ],
        });
      }),
    });
    const result = await client.listChargeflow({ kind: "e", status: "active" });
    assert.equal(result.total, 1);
    assert.equal(result.items[0]?.id, "cfu_e_abc");
  });

  it("createChargeflowEBatch() posts batch", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/chargeflow/batch"));
        assert.equal(init?.method, "POST");
        return Response.json({
          total: 1,
          succeeded: 1,
          failed: 0,
          items: [
            {
              index: 0,
              ok: true,
              id: "cfu_e_batch",
              unit_kind: "e",
              content_hash: "a".repeat(64),
              signature: "b".repeat(64),
              verify_url: "https://getauros.com/chargeflow/cfu_e_batch",
              status: "active",
              public: {},
              created_at: "2026-07-19T00:00:00.000Z",
              disclaimer: "test",
              valid: true,
            },
          ],
        });
      }),
    });
    const result = await client.createChargeflowEBatch({
      items: [
        {
          session: {
            external_session_id: "s1",
            started_at: "2026-07-19T10:00:00Z",
            ended_at: "2026-07-19T11:00:00Z",
            energy_kwh: 10,
          },
        },
      ],
    });
    assert.equal(result.succeeded, 1);
  });

  it("createChargeflowFromOcpi() posts stub endpoint", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_live_xxx",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/chargeflow/from-ocpi"));
        assert.equal(init?.method, "POST");
        return Response.json({
          source: "ocpi_stub",
          disclaimer: "test",
          total: 1,
          succeeded: 1,
          failed: 0,
          items: [
            {
              index: 0,
              ok: true,
              id: "cfu_e_ocpi",
              unit_kind: "e",
              content_hash: "a".repeat(64),
              signature: "b".repeat(64),
              verify_url: "https://getauros.com/chargeflow/cfu_e_ocpi",
              status: "active",
              public: {},
              created_at: "2026-07-19T00:00:00.000Z",
              disclaimer: "test",
              valid: true,
            },
          ],
        });
      }),
    });
    const result = await client.createChargeflowFromOcpi({
      cdrs: [
        {
          id: "CDR-1",
          start_date_time: "2026-07-19T10:00:00Z",
          end_date_time: "2026-07-19T11:00:00Z",
          total_energy: 10,
        },
      ],
    });
    assert.equal(result.source, "ocpi_stub");
    assert.equal(result.succeeded, 1);
  });

  it("scoreBatch() posts items array", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/score/batch"));
        assert.equal(init?.method, "POST");
        const body = JSON.parse(init?.body as string);
        assert.equal(body.items.length, 2);
        return Response.json({
          disclaimer: "test",
          total: 2,
          succeeded: 2,
          failed: 0,
          items: [
            { index: 0, ok: true, score_id: "scr_abc123", score: 70, grade: "B" },
            { index: 1, ok: true, score_id: "scr_def456", score: 65, grade: "C+" },
          ],
          meta: { version: "1.0", computed_at: "2026-06-12T00:00:00.000Z" },
        });
      }),
    });

    const result = await client.scoreBatch({
      items: [
        { description: "Luxembourg warehouse SPV professional" },
        { asset_type: "bonds", issuer_type: "company_spv" },
      ],
    });
    assert.equal(result.total, 2);
    assert.equal(result.succeeded, 2);
  });

  it("scoreHistory() fetches session history", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url) => {
        assert.ok(url.includes("/api/v1/score/scr_abc123/history"));
        return Response.json({
          disclaimer: "test",
          score_id: "scr_abc123",
          kind: "session",
          total: 1,
          entries: [
            {
              id: 1,
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
              created_at: "2026-06-12T10:00:00.000Z",
            },
          ],
          meta: { version: "1.0", computed_at: "2026-06-12T10:00:00.000Z" },
        });
      }),
    });

    const history = await client.scoreHistory("scr_abc123");
    assert.equal(history.total, 1);
    assert.equal(history.entries[0]?.score, 72);
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

  it("greenWattScore() fetches public endpoint without auth", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/green/watt/sunexchange"));
        assert.equal(init?.method, "GET");
        const headers = init?.headers as Record<string, string>;
        assert.equal(headers.Authorization, undefined);
        return Response.json({
          ok: true,
          id: "sunexchange",
          name: "SunExchange",
          watt_score: {
            rating: 72,
            lifetime_gwh: 1.8,
            energy_value_eur: 270000,
            tier: "mid",
          },
          disclaimer: "test",
          batch_api: "/api/v1/green/watt/batch",
          docs: "/developers/docs/endpoint-green-watt",
          generated_at: "2026-06-28T00:00:00.000Z",
        });
      }),
    });

    const result = await client.greenWattScore("sunexchange");
    assert.equal(result.watt_score.rating, 72);
  });

  it("greenWattBatch() posts items array", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/v1/green/watt/batch"));
        const body = JSON.parse(init?.body as string);
        assert.equal(body.items.length, 2);
        return Response.json({
          disclaimer: "test",
          total: 2,
          succeeded: 2,
          failed: 0,
          items: [
            {
              index: 0,
              ok: true,
              id: "sunexchange",
              watt_score: { rating: 72, lifetime_gwh: 1.8, energy_value_eur: 270000, tier: "mid" },
            },
            {
              index: 1,
              ok: true,
              id: null,
              watt_score: { rating: 65, lifetime_gwh: 2.1, energy_value_eur: 300000, tier: "mid" },
            },
          ],
          meta: { version: "1.0", computed_at: "2026-06-28T00:00:00.000Z" },
        });
      }),
    });

    const result = await client.greenWattBatch({
      items: [{ id: "sunexchange" }, { text: "Solar farm 12 MW PPA production MWh" }],
    });
    assert.equal(result.succeeded, 2);
  });

  it("greenCarbonQuality() fetches public CQS endpoint", async () => {
    const client = new AurosProtocol({
      apiKey: "auros_pk_test_demo",
      fetch: mockFetch((url, init) => {
        assert.ok(url.endsWith("/api/green/carbon-quality/toucan"));
        assert.equal(init?.method, "GET");
        const headers = init?.headers as Record<string, string>;
        assert.equal(headers.Authorization, undefined);
        return Response.json({
          ok: true,
          id: "toucan",
          name: "Toucan",
          carbon_quality: { score: 62, tier: "acceptable" },
          disclaimer: "test",
          batch_api: "/api/v1/green/carbon-quality/batch",
          docs: "/developers/docs/endpoint-green-carbon-quality",
          generated_at: "2026-06-28T00:00:00.000Z",
        });
      }),
    });

    const result = await client.greenCarbonQuality("toucan");
    assert.equal(result.carbon_quality.score, 62);
  });
});
