import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GREEN_LABEL_REVIEW_AMOUNT_CENTS,
  greenLabelReviewProduct,
} from "@/lib/green/label-pricing";
import { parseGreenLabelCheckoutMetadata } from "@/lib/stripe/green-label-checkout";

describe("green/label-pricing", () => {
  it("charges 300 EUR for document review", () => {
    assert.equal(GREEN_LABEL_REVIEW_AMOUNT_CENTS, 30_000);
    const product = greenLabelReviewProduct();
    assert.equal(product.currency, "eur");
    assert.ok(product.name.fr.includes("300"));
  });
});

describe("stripe/green-label-checkout metadata", () => {
  it("parses valid metadata", () => {
    const parsed = parseGreenLabelCheckoutMetadata({
      product: "green_label_review",
      application_id: "550e8400-e29b-41d4-a716-446655440000",
      email: "partner@example.com",
      locale: "en",
    });
    assert.ok(parsed);
    assert.equal(parsed!.applicationId, "550e8400-e29b-41d4-a716-446655440000");
    assert.equal(parsed!.locale, "en");
  });

  it("rejects wrong product", () => {
    assert.equal(
      parseGreenLabelCheckoutMetadata({
        product: "green_impact_report",
        application_id: "x",
        email: "a@b.co",
      }),
      null,
    );
  });

  it("rejects missing email", () => {
    assert.equal(
      parseGreenLabelCheckoutMetadata({
        product: "green_label_review",
        application_id: "x",
        email: "not-an-email",
      }),
      null,
    );
  });
});
