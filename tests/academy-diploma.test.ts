import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DIPLOMA_PRODUCTS } from "../lib/academy/diploma-pricing";
import {
  certSnapshotForStripeMetadata,
  parseAcademyDiplomaMetadata,
  STRIPE_METADATA_MAX,
} from "../lib/academy/diploma-checkout";
import {
  generateIndividualDiplomaPdf,
  generateInstitutionDiplomaPdf,
} from "../lib/academy/diploma-pdf";

describe("academy/diploma", () => {
  it("exposes individual and institution pricing", () => {
    assert.equal(DIPLOMA_PRODUCTS.individual.amountCents, 3_900);
    assert.equal(DIPLOMA_PRODUCTS.institution.amountCents, 24_900);
  });

  it("parses academy diploma checkout metadata", () => {
    const certSnapshot = certSnapshotForStripeMetadata({
      id: "ABC123",
      fullName: "Test User",
      tier: "fundamentals",
      tierLabel: "Certification Fondamentaux RWA",
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      curriculumVersion: "2026.05",
      renewalGeneration: 0,
      integrityLevel: 2,
    });
    assert.ok(certSnapshot.length <= STRIPE_METADATA_MAX);

    const meta = parseAcademyDiplomaMetadata({
      productKind: "academy_diploma",
      diplomaType: "individual",
      contactEmail: "test@example.com",
      certId: "ABC123",
      certSnapshot,
    });
    assert.ok(meta);
    assert.equal(meta!.diplomaType, "individual");
    assert.equal(meta!.certId, "ABC123");
    assert.equal(meta!.certSnapshot?.fullName, "Test User");
  });

  it("generates individual diploma PDF blob", async () => {
    const blob = await generateIndividualDiplomaPdf({
      certificate: {
        id: "TEST01",
        fullName: "Test User",
        tier: "fundamentals",
        tierLabel: "Certification Fondamentaux RWA",
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        curriculumVersion: "2026.05",
        renewalGeneration: 0,
        integrityLevel: 2,
      },
      verifyUrl: "https://example.com/academy/verify/x",
    });
    assert.ok(blob.size > 500);
  });

  it("generates institution diploma PDF blob", async () => {
    const blob = await generateInstitutionDiplomaPdf({
      organizationName: "Acme Corp",
      purchaseId: "INST-ABC",
      issuedAt: new Date().toISOString(),
      verifyUrl: "https://example.com/academy/entreprise?cert=INST-ABC",
    });
    assert.ok(blob.size > 500);
  });
});
