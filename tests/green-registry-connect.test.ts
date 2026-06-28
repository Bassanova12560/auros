import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseRegistryConnectInput,
  parseRegistryQuery,
  lookupRegistryConnect,
  findRegistryCatalogEntry,
  listRegistryConnectSerials,
} from "@/lib/green/registry-connect";
import { resolveCarbonQualityBatchItem } from "@/lib/green/scoring/carbon-quality-batch";

describe("green/registry-connect/parse", () => {
  it("parses VCS serial from text", () => {
    const parsed = parseRegistryQuery("VCS-674 Brazil REDD+");
    assert.ok(parsed);
    assert.equal(parsed!.provider, "verra");
    assert.equal(parsed!.serial, "VCS-674");
  });

  it("parses Gold Standard serial", () => {
    const parsed = parseRegistryConnectInput({ registry: "gold_standard", serial: "5678" });
    assert.ok(parsed);
    assert.equal(parsed!.serial, "GS-5678");
  });

  it("parses verra registry URL", () => {
    const parsed = parseRegistryQuery("https://registry.verra.org/app/projectDetail/VCS/1112");
    assert.ok(parsed);
    assert.equal(parsed!.serial, "VCS-1112");
  });
});

describe("green/registry-connect/lookup", () => {
  it("returns catalog match for VCS-674 with CQS", async () => {
    const outcome = await lookupRegistryConnect({ serial: "VCS-674" });
    assert.ok(outcome.ok);
    assert.equal(outcome.data.match, "catalog");
    assert.equal(outcome.data.project_name, findRegistryCatalogEntry("verra", "VCS-674")!.project_name);
    assert.ok(outcome.data.scores.carbon_quality.score >= 0);
    assert.ok(outcome.data.scores.nature_score);
    assert.equal(outcome.data.compare_id, "moss");
  });

  it("infers unknown VCS serial when live fetch unavailable", async () => {
    const outcome = await lookupRegistryConnect({ serial: "VCS-99999" });
    assert.ok(outcome.ok);
    assert.ok(outcome.data.match === "inferred" || outcome.data.match === "live");
    assert.ok(outcome.data.registry_urls.project?.includes("verra.org"));
  });

  it("rejects empty query", async () => {
    const outcome = await lookupRegistryConnect({});
    assert.equal(outcome.ok, false);
  });

  it("lists pilot serials including VCS-2195", () => {
    assert.ok(listRegistryConnectSerials().length >= 5);
    assert.ok(listRegistryConnectSerials().includes("VCS-2195"));
  });
});

describe("green/registry-connect/batch", () => {
  it("resolves batch item by serial", async () => {
    const outcome = await resolveCarbonQualityBatchItem({ serial: "VCS-674" });
    assert.ok(outcome.ok);
    assert.equal(outcome.registry_serial, "VCS-674");
  });
});
