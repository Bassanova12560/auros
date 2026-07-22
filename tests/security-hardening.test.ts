import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CONTENT_SECURITY_POLICY,
  HSTS_VALUE,
  MAIN_SECURITY_HEADERS,
} from "@/lib/security/headers";
import {
  isBlockedProbePath,
  isSensitiveApiPath,
} from "@/lib/security/paths";
import {
  escapeHtml,
  sanitizeEmail,
  sanitizeUserText,
} from "@/lib/security/sanitize";

describe("security/headers", () => {
  it("includes HSTS preload and CSP frame-ancestors self", () => {
    assert.match(HSTS_VALUE, /preload/);
    assert.match(CONTENT_SECURITY_POLICY, /frame-ancestors 'self'/);
    assert.match(CONTENT_SECURITY_POLICY, /upgrade-insecure-requests/);
    const keys = MAIN_SECURITY_HEADERS.map((h) => h.key);
    assert.ok(keys.includes("Strict-Transport-Security"));
    assert.ok(keys.includes("Content-Security-Policy"));
    assert.ok(keys.includes("Cross-Origin-Opener-Policy"));
  });
});

describe("security/request-guard", () => {
  it("blocks scanner and traversal paths", () => {
    assert.equal(isBlockedProbePath("/.env"), true);
    assert.equal(isBlockedProbePath("/wp-admin/login"), true);
    assert.equal(isBlockedProbePath("/.git/config"), true);
    assert.equal(isBlockedProbePath("/api/../.env"), true);
    assert.equal(isBlockedProbePath("/security"), false);
    assert.equal(isBlockedProbePath("/api/green/eau/roi"), false);
  });

  it("flags sensitive API prefixes", () => {
    assert.equal(isSensitiveApiPath("/api/ops/copilot/drafts"), true);
    assert.equal(isSensitiveApiPath("/api/admin/bootstrap-green"), true);
    assert.equal(isSensitiveApiPath("/api/cron/content-signals"), true);
    assert.equal(isSensitiveApiPath("/api/green/eau/roi"), false);
  });
});

describe("security/sanitize", () => {
  it("escapes HTML", () => {
    assert.equal(
      escapeHtml(`<script>alert("x")</script>`),
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("sanitizes user text and email", () => {
    assert.equal(sanitizeUserText("  hello\u0000world  "), "helloworld");
    assert.equal(sanitizeUserText("a".repeat(50), 10), "a".repeat(10));
    assert.equal(sanitizeEmail("  User@GetAuros.COM "), "user@getauros.com");
    assert.equal(sanitizeEmail("not-an-email"), null);
  });
});
