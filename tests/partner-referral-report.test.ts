import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  partnerReferralSummaryToCsv,
  partnerReferralsToCsv,
  suggestedPartnerReferralFilename,
  summarizePartnerReferrals,
  type PartnerReferralRow,
} from "@/lib/partners/referral-report";

const SAMPLE: PartnerReferralRow[] = [
  {
    recordType: "lead",
    id: "lead-1",
    partnerCode: "ALPHA",
    email: "a@example.com",
    assetType: "Real estate",
    score: 72,
    status: null,
    source: "score_widget",
    createdAt: "2026-07-05T10:00:00.000Z",
  },
  {
    recordType: "dossier",
    id: "dos-1",
    partnerCode: "ALPHA",
    email: null,
    assetType: "Renewable energy",
    score: 81,
    status: "submitted",
    source: null,
    createdAt: "2026-07-05T11:00:00.000Z",
  },
  {
    recordType: "lead",
    id: "lead-2",
    partnerCode: "BETA",
    email: "b@example.com",
    assetType: null,
    score: null,
    status: null,
    source: "wizard_step_9",
    createdAt: "2026-07-04T09:00:00.000Z",
  },
];

describe("partners/referral-report", () => {
  it("builds detail CSV with header", () => {
    const csv = partnerReferralsToCsv(SAMPLE);
    assert.match(csv, /^record_type,id,partner_code/);
    assert.ok(csv.includes("ALPHA"));
    assert.ok(csv.includes("score_widget"));
  });

  it("summarizes by partner code", () => {
    const summary = summarizePartnerReferrals(SAMPLE);
    assert.equal(summary.length, 2);
    const alpha = summary.find((s) => s.partnerCode === "ALPHA");
    assert.ok(alpha);
    assert.equal(alpha!.leads, 1);
    assert.equal(alpha!.dossiers, 1);
    assert.equal(alpha!.total, 2);
  });

  it("builds summary CSV", () => {
    const csv = partnerReferralSummaryToCsv(summarizePartnerReferrals(SAMPLE));
    assert.match(csv, /^partner_code,leads,dossiers,total/);
    assert.ok(csv.includes("BETA,1,0,1"));
  });

  it("suggests export filename", () => {
    assert.match(suggestedPartnerReferralFilename("alpha"), /auros-partner-referrals-ALPHA-/);
  });
});
