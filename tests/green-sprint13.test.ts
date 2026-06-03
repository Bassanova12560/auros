import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  greenLabelIncompleteReminderEmail,
  greenLabelIncompleteSecondReminderEmail,
} from "@/lib/emails/templates";
import { getGreenMessages } from "@/lib/green";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import {
  greenRegistryProjectsToPdfRows,
  suggestedGreenRegistryPdfFilename,
} from "@/lib/green/registry-pdf";
import {
  isGreenLabelApplicationIncomplete,
  listIncompleteLabelApplicationsForReminder,
} from "@/lib/green/label-incomplete-reminder";
import {
  encodeCompareCountriesParam,
  parseCompareCountriesParam,
  projectMatchesCompareCountries,
} from "@/lib/green/market/compare-selection";

describe("green/sprint13-registry-pdf", () => {
  it("maps filtered registry rows for PDF export", async () => {
    const snapshot = await getGreenRegistrySnapshot();
    const verified = snapshot.projects.filter((p) => p.labelTier === "verified");
    if (verified.length === 0) return;

    const labels = getGreenMessages("fr");
    const rows = greenRegistryProjectsToPdfRows(
      verified,
      labels.registry,
      labels.compare,
      "fr"
    );
    assert.equal(rows[0]!.name, verified[0]!.name);
    assert.equal(rows[0]!.tier, labels.registry.tierVerified);
    assert.equal(suggestedGreenRegistryPdfFilename("verified", "fr"), expectFilenameVerifiedFr());
  });

  it("exposes registry PDF export i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const r = getGreenMessages(locale).registry;
      assert.ok(r.exportPdf.length > 0);
      assert.ok(r.exportPdfGenerating.length > 0);
    }
  });
});

function expectFilenameVerifiedFr(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `AUROS_Green_Registre_verified_${date}.pdf`;
}

describe("green/sprint13-compare-countries", () => {
  it("restores and encodes countries param", () => {
    assert.deepEqual(parseCompareCountriesParam("France,Portugal"), [
      "France",
      "Portugal",
    ]);
    assert.equal(encodeCompareCountriesParam(["France", "France"]), "France");
  });

  it("filters registry projects by selected countries", () => {
    assert.equal(projectMatchesCompareCountries("France", []), true);
    assert.equal(projectMatchesCompareCountries("France", ["Portugal"]), false);
    assert.equal(projectMatchesCompareCountries("france", ["France"]), true);
  });

  it("exposes compare country filter i18n", () => {
    const fr = getGreenMessages("fr").compare;
    assert.ok(fr.countryFilterLabel.includes("pays"));
    assert.ok(fr.countryFilterClear.length > 0);
  });
});

describe("green/sprint13-label-second-reminder", () => {
  it("detects incomplete dossier for second reminder eligibility", () => {
    const check = isGreenLabelApplicationIncomplete({
      project_name: "Solar PT",
      contact_name: "Ada",
      email: "ada@example.com",
      website: "https://example.com",
      country: "Portugal",
      description: "Long enough description for RTMS review.",
      document_path: null,
    });
    assert.equal(check.incomplete, true);
  });

  it("builds second reminder email in candidate locale", () => {
    const email = greenLabelIncompleteSecondReminderEmail({
      contactName: "Ada",
      projectName: "Solar PT",
      missingDocument: true,
      labelUrl: "https://auros.example/green/label",
      myUrl: "https://auros.example/green/my",
      locale: "en",
    });
    assert.ok(email.subject.toLowerCase().includes("reminder"));
    assert.ok(email.html.includes("One week ago"));
  });

  it("still builds first reminder email", () => {
    const email = greenLabelIncompleteReminderEmail({
      contactName: "Ada",
      projectName: "Solar PT",
      missingDocument: true,
      labelUrl: "https://auros.example/green/label",
      myUrl: "https://auros.example/green/my",
      locale: "fr",
    });
    assert.ok(email.subject.includes("complétez"));
  });

  it("lists incomplete applications without throwing when DB unavailable", async () => {
    const rows = await listIncompleteLabelApplicationsForReminder();
    assert.ok(Array.isArray(rows));
    for (const row of rows) {
      assert.ok(row.reminderRound === 1 || row.reminderRound === 2);
    }
  });
});
