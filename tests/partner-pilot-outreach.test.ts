import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildPartnerPilotKit } from "@/lib/partners/pilot-kit";
import {
  buildPartnerPilotOutreach,
  formatPartnerPilotOutreachEmail,
} from "@/lib/partners/pilot-outreach";

describe("partners/pilot-outreach", () => {
  const origin = "https://getauros.com";

  it("builds FR outreach email with partner links", () => {
    const kit = buildPartnerPilotKit("UTILITIES_FR", origin);
    assert.ok(kit);
    const email = buildPartnerPilotOutreach(kit, {
      contactName: "Marie",
      companyName: "UtilityCo",
      locale: "fr",
    });
    assert.match(email.subject, /UTILITIES_FR/);
    assert.match(email.subject, /UtilityCo/);
    assert.match(email.bodyPlain, /Bonjour Marie/);
    assert.match(email.bodyPlain, /UTILITIES_FR/);
    assert.ok(email.bodyPlain.includes(kit.embedUrl));
    assert.ok(email.bodyHtml.includes(kit.embedUrl));
  });

  it("formats plain email with subject line", () => {
    const kit = buildPartnerPilotKit("CAB01", origin);
    assert.ok(kit);
    const formatted = formatPartnerPilotOutreachEmail(
      buildPartnerPilotOutreach(kit, { locale: "en" }),
    );
    assert.match(formatted, /^Subject: /);
    assert.match(formatted, /CAB01/);
  });
});
