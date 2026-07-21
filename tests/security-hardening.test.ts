import { describe, expect, it } from "vitest";

import {
  CONTENT_SECURITY_POLICY,
  HSTS_VALUE,
  MAIN_SECURITY_HEADERS,
} from "../lib/security/headers";
import {
  isBlockedProbePath,
  isSensitiveApiPath,
} from "../lib/security/paths";
import {
  escapeHtml,
  sanitizeEmail,
  sanitizeUserText,
} from "../lib/security/sanitize";

describe("security/headers", () => {
  it("includes HSTS preload and CSP frame-ancestors self", () => {
    expect(HSTS_VALUE).toContain("preload");
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("upgrade-insecure-requests");
    const keys = MAIN_SECURITY_HEADERS.map((h) => h.key);
    expect(keys).toContain("Strict-Transport-Security");
    expect(keys).toContain("Content-Security-Policy");
    expect(keys).toContain("Cross-Origin-Opener-Policy");
  });
});

describe("security/request-guard", () => {
  it("blocks scanner and traversal paths", () => {
    expect(isBlockedProbePath("/.env")).toBe(true);
    expect(isBlockedProbePath("/wp-admin/login")).toBe(true);
    expect(isBlockedProbePath("/.git/config")).toBe(true);
    expect(isBlockedProbePath("/api/../.env")).toBe(true);
    expect(isBlockedProbePath("/security")).toBe(false);
    expect(isBlockedProbePath("/api/green/eau/roi")).toBe(false);
  });

  it("flags sensitive API prefixes", () => {
    expect(isSensitiveApiPath("/api/ops/copilot/drafts")).toBe(true);
    expect(isSensitiveApiPath("/api/admin/bootstrap-green")).toBe(true);
    expect(isSensitiveApiPath("/api/cron/content-signals")).toBe(true);
    expect(isSensitiveApiPath("/api/green/eau/roi")).toBe(false);
  });
});

describe("security/sanitize", () => {
  it("escapes HTML", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("sanitizes user text and email", () => {
    expect(sanitizeUserText("  hello\u0000world  ")).toBe("helloworld");
    expect(sanitizeUserText("a".repeat(50), 10)).toBe("a".repeat(10));
    expect(sanitizeEmail("  User@GetAuros.COM ")).toBe("user@getauros.com");
    expect(sanitizeEmail("not-an-email")).toBeNull();
  });
});
