import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildEauCheckApiSnippet,
  buildEauEmbedIframeSnippet,
  buildEauEmbedScriptSnippet,
  buildEauEmbedUrl,
  buildHydrologicalPassportUrl,
} from "@/lib/eau/embed";
import {
  AUROS_EMBED_SOURCE,
  isAurosH2oEmbedEvent,
} from "@/lib/eau/embed-events";

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

  it("generates JS embed snippet with postMessage listener", () => {
    const html = buildEauEmbedScriptSnippet({ partner: "UTIL", origin });
    assert.match(html, /auros-h2o-embed/);
    assert.match(html, /auros:h2o:score/);
    assert.match(html, /partner=UTIL/);
    assert.match(html, /addEventListener\("message"/);
  });
});

describe("eau/embed-events", () => {
  it("recognizes AUROS embed postMessage payloads", () => {
    assert.equal(
      isAurosH2oEmbedEvent({
        source: AUROS_EMBED_SOURCE,
        type: "auros:h2o:score",
        payload: {
          rating: 72,
          tier: "ready",
          preview_id: "h2o-preview-abc",
          asset_class: "concession",
          passport_required: true,
        },
      }),
      true,
    );
    assert.equal(isAurosH2oEmbedEvent({ foo: "bar" }), false);
  });
});
