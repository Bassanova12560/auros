import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";

import {
  mintArlLabCookieValue,
  resolveArlLabMutationAccount,
  verifyArlLabCookieValue,
} from "../lib/arl/lab-session.ts";
import {
  isValidOpsUnlockSecret,
  mintOpsSessionCookieValue,
  verifyOpsSessionCookieValue,
} from "../lib/ops/session.ts";

describe("arl lab session cookie", () => {
  const priorLab = process.env.ARL_LAB_SIGNING_KEY;
  const priorCron = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.ARL_LAB_SIGNING_KEY = "test-arl-lab-key-32chars-minimum!!";
    delete process.env.CRON_SECRET;
  });

  afterEach(() => {
    if (priorLab === undefined) delete process.env.ARL_LAB_SIGNING_KEY;
    else process.env.ARL_LAB_SIGNING_KEY = priorLab;
    if (priorCron === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = priorCron;
  });

  it("mints and verifies lab cookie", () => {
    const value = mintArlLabCookieValue("lab_abc123");
    assert.ok(value);
    assert.equal(verifyArlLabCookieValue(value), "lab_abc123");
  });

  it("rejects tampered lab cookie", () => {
    const value = mintArlLabCookieValue("lab_abc123");
    assert.ok(value);
    const tampered = value.replace("lab_abc123", "lab_evil999");
    assert.equal(verifyArlLabCookieValue(tampered), null);
  });

  it("mutation rejects account mismatch vs cookie", () => {
    const cookie = mintArlLabCookieValue("lab_owner_01");
    assert.ok(cookie);
    const req = new Request("https://getauros.com/api/arl/mint", {
      headers: { cookie: `auros_arl_lab=${cookie}` },
    });
    const result = resolveArlLabMutationAccount(req, "lab_other_99");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.status, 403);
  });

  it("mutation soft-binds claimed account when no cookie", () => {
    const req = new Request("https://getauros.com/api/arl/mint");
    const result = resolveArlLabMutationAccount(req, "lab_soft_01");
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.accountId, "lab_soft_01");
      assert.ok(result.cookieValue);
    }
  });
});

describe("ops session cookie", () => {
  const priorOps = process.env.OPS_SESSION_SECRET;
  const priorCron = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.OPS_SESSION_SECRET = "test-ops-session-secret-value";
    process.env.CRON_SECRET = "test-cron-secret-value";
  });

  afterEach(() => {
    if (priorOps === undefined) delete process.env.OPS_SESSION_SECRET;
    else process.env.OPS_SESSION_SECRET = priorOps;
    if (priorCron === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = priorCron;
  });

  it("mints and verifies ops cookie", () => {
    const value = mintOpsSessionCookieValue();
    assert.ok(value);
    assert.equal(verifyOpsSessionCookieValue(value), true);
  });

  it("accepts ops or cron secret for unlock", () => {
    assert.equal(isValidOpsUnlockSecret("test-ops-session-secret-value"), true);
    assert.equal(isValidOpsUnlockSecret("test-cron-secret-value"), true);
    assert.equal(isValidOpsUnlockSecret("wrong"), false);
  });
});
