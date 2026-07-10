import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildEauCheckApiSnippet,
  buildEauEmbedIframeSnippet,
  buildEauEmbedUrl,
  buildHydrologicalPassportUrl,
} from "@/lib/eau/embed";

describe("eau/embed", () => {
  const origin = "https://getauros.com";

  it("builds embed URL with partner code", () => {
    const url = buildEauEmbedUrl({ partner: "utilities_fr", origin });
    assert.match(url, /\/eau\/embed/);
    assert.match(url, /partner=UTILITIES_FR/);
  });

  it("builds passport wizard URL with green params", () => {
    const url = buildHydrologicalPassportUrl({ partner: "FO01", origin });
    assert.match(url, /type=green/);
    assert.match(url, /asset=renewable/);
    assert.match(url, /partner=FO01/);
  });

  it("generates iframe snippet", () => {
    const html = buildEauEmbedIframeSnippet({ partner: "TEST", origin });
    assert.match(html, /<iframe/);
    assert.match(html, /partner=TEST/);
    assert.match(html, /H₂O Score/);
  });

  it("generates API curl snippet", () => {
    const curl = buildEauCheckApiSnippet(origin);
    assert.match(curl, /\/api\/eau\/check/);
    assert.match(curl, /Mm³/);
  });
});
