import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { greenLabelIncompleteReminderEmail } from "@/lib/emails/templates";
import { getGreenMessages } from "@/lib/green";
import {
  greenRegistryProjectsToCsv,
  suggestedGreenRegistryCsvFilename,
} from "@/lib/green/registry-csv";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import {
  isGreenLabelApplicationIncomplete,
  listIncompleteLabelApplicationsForReminder,
} from "@/lib/green/label-incomplete-reminder";
import {
  GREEN_COMPARE_COUNTRIES_URL_PARAM,
  GREEN_COMPARE_OFFERS_URL_PARAM,
  buildGreenCompareShareUrl,
  normalizeCompareCountries,
  parseCompareCountriesParam,
} from "@/lib/green/market/compare-selection";
import { GREEN_COMPARE_ROUTE } from "@/lib/green/constants";
import { parseRegistryTierParam } from "@/lib/green/registry-routes";

describe("green/sprint12-registry-csv", () => {
  it("exports filtered registry projects to CSV with i18n headers", async () => {
    const snapshot = await getGreenRegistrySnapshot();
    assert.ok(snapshot.projects.length > 0);

    const verified = snapshot.projects.filter((p) => p.labelTier === "verified");
    const labels = getGreenMessages("fr");
    const csv = greenRegistryProjectsToCsv(
      verified,
      labels.registry,
      labels.compare,
      "fr",
      { tierFilter: "verified" }
    );

    assert.ok(csv.includes(labels.registry.tierFilterVerified));
    assert.ok(csv.includes(labels.compare.projectTypes[verified[0]!.projectType]));
    assert.ok(csv.includes(verified[0]!.name));
    assert.equal(suggestedGreenRegistryCsvFilename("verified"), "auros-green-registry-verified.csv");
  });

  it("exposes registry export i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      assert.ok(getGreenMessages(locale).registry.exportCsv.length > 0);
    }
  });
});

describe("green/sprint12-compare-share", () => {
  it("builds share URL with offers and countries", () => {
    const url = buildGreenCompareShareUrl({
      offerIds: ["offer-001", "offer-002"],
      countries: ["Portugal", "France", "portugal"],
      origin: "https://auros.example",
    });
    assert.equal(
      url,
      "https://auros.example/green/compare?offers=offer-001%2Coffer-002&countries=Portugal%2CFrance"
    );
    assert.equal(GREEN_COMPARE_OFFERS_URL_PARAM, "offers");
    assert.equal(GREEN_COMPARE_COUNTRIES_URL_PARAM, "countries");
  });

  it("parses countries param and falls back to compare route", () => {
    assert.deepEqual(parseCompareCountriesParam("PT, FR ,pt"), ["PT", "FR"]);
    assert.equal(
      buildGreenCompareShareUrl({ offerIds: [], countries: [] }),
      GREEN_COMPARE_ROUTE
    );
    assert.deepEqual(normalizeCompareCountries(["  ", "ES", "ES"]), ["ES"]);
  });

  it("exposes compare share link i18n", () => {
    const fr = getGreenMessages("fr").compare;
    assert.ok(fr.copyCompareLink.includes("comparaison"));
    assert.ok(fr.shareCopied.length > 0);
  });
});

describe("green/sprint12-label-reminder", () => {
  it("detects incomplete dossier when PDF missing", () => {
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
    assert.equal(check.missingDocument, true);
  });

  it("treats complete dossier as not incomplete", () => {
    const check = isGreenLabelApplicationIncomplete({
      project_name: "Solar PT",
      contact_name: "Ada",
      email: "ada@example.com",
      website: "https://example.com",
      country: "Portugal",
      description: "Long enough description for RTMS review.",
      document_path: "app-id/file.pdf",
    });
    assert.equal(check.incomplete, false);
  });

  it("builds reminder email in candidate locale", () => {
    const email = greenLabelIncompleteReminderEmail({
      contactName: "Ada",
      projectName: "Solar PT",
      missingDocument: true,
      labelUrl: "https://auros.example/green/label",
      myUrl: "https://auros.example/green/my",
      locale: "en",
    });
    assert.ok(email.subject.includes("complete your label dossier"));
  });

  it("lists incomplete applications without throwing when DB unavailable", async () => {
    const rows = await listIncompleteLabelApplicationsForReminder();
    assert.ok(Array.isArray(rows));
  });
});

describe("green/sprint12-registry-tier-export", () => {
  it("still parses registry tier param for CSV filter context", () => {
    assert.equal(parseRegistryTierParam("verified"), "verified");
    assert.equal(parseRegistryTierParam("pilot"), "pilot");
  });
});
