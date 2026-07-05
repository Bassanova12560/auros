import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildEauEmbedUrl } from "@/lib/eau/embed";
import { maskPartnerEmail } from "@/lib/partners/mask-email";
import {
  estimateIndicativeCommission,
  PARTNER_INDICATIVE_COMMISSION_EUR,
} from "@/lib/partners/portal-data";

describe("partners/mask-email", () => {
  it("masks local part of email", () => {
    assert.equal(maskPartnerEmail("jean.dupont@cabinet.fr"), "j•••@cabinet.fr");
  });

  it("handles invalid email", () => {
    assert.equal(maskPartnerEmail("invalid"), "•••");
  });
});

describe("partners/portal-data commission", () => {
  it("estimates indicative commission", () => {
    const total = estimateIndicativeCommission(2, 3, 1);
    const expected =
      2 * PARTNER_INDICATIVE_COMMISSION_EUR.perLead +
      2 * PARTNER_INDICATIVE_COMMISSION_EUR.perDossier +
      1 * PARTNER_INDICATIVE_COMMISSION_EUR.perSubmittedDossier;
    assert.equal(total, expected);
  });

  it("builds partner embed toolkit URLs", () => {
    const embed = buildEauEmbedUrl({ partner: "CAB01", origin: "https://getauros.com" });
    assert.match(embed, /partner=CAB01/);
    assert.match(embed, /\/eau\/embed/);
  });
});
