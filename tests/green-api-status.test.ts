import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildGreenApiStatus, GREEN_API_STATUS_PATHS } from "@/lib/green/api/status";
import { GREEN_PRESS_ROUTE } from "@/lib/green/constants";

describe("green/api/status", () => {
  it("defines probe paths", () => {
    assert.ok(GREEN_API_STATUS_PATHS.length >= 4);
    assert.ok(GREEN_API_STATUS_PATHS.some((p) => p.includes("toucan")));
  });

  it("builds status payload shape", async () => {
    const payload = await buildGreenApiStatus("https://getauros.com");
    assert.equal(payload.service, "auros-green-api");
    assert.equal(payload.press, "/green/press");
    assert.ok(payload.checks.length >= 4);
  });
});

describe("green/press", () => {
  it("has stable route", () => {
    assert.equal(GREEN_PRESS_ROUTE, "/green/press");
  });
});
