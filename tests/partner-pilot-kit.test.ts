import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPartnerPilotKit,
  formatPartnerPilotKitMarkdown,
} from "@/lib/partners/pilot-kit";

describe("partners/pilot-kit", () => {
  const origin = "https://getauros.com";

  it("builds kit for valid partner code", () => {
    const kit = buildPartnerPilotKit("utilities_fr", origin);
    assert.ok(kit);
    assert.equal(kit.partnerCode, "UTILITIES_FR");
    assert.match(kit.wizardUrl, /partner=UTILITIES_FR/);
    assert.match(kit.embedUrl, /\/eau\/embed/);
    assert.match(kit.iframeSnippet, /<iframe/);
    assert.match(kit.scriptSnippet, /auros:h2o:score/);
    assert.equal(kit.smokeChecks.length, 3);
  });

  it("rejects invalid partner code", () => {
    assert.equal(buildPartnerPilotKit("x", origin), null);
  });

  it("formats markdown kit", () => {
    const kit = buildPartnerPilotKit("CAB01", origin);
    assert.ok(kit);
    const md = formatPartnerPilotKitMarkdown(kit);
    assert.match(md, /# Kit pilote partenaire — CAB01/);
    assert.match(md, /postMessage/);
    assert.match(md, /CAB01/);
  });
});
