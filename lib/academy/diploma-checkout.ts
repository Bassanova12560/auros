import type Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import { getStripe } from "@/lib/stripe/jurisdiction-checkout";

import { parseCertificateToken, tierLabel } from "./cert-token";
import { diplomaProduct, type DiplomaProductType } from "./diploma-pricing";
import { ACADEMY_DIPLOMA_SUCCESS_ROUTE } from "./constants";
import type { AcademyCertificate } from "./types";

/** Stripe metadata values are capped at 500 chars — never store the full cert token. */
export const STRIPE_METADATA_MAX = 500;

export type AcademyDiplomaMetadata = {
  productKind: "academy_diploma";
  diplomaType: DiplomaProductType;
  certId?: string;
  certSnapshot?: AcademyCertificate;
  organizationName?: string;
  contactEmail: string;
  contactName?: string;
};

type StoredCertSnapshot = Omit<AcademyCertificate, "tierLabel">;

export function certSnapshotForStripeMetadata(
  cert: AcademyCertificate
): string {
  const payload: StoredCertSnapshot = {
    id: cert.id,
    fullName: cert.fullName,
    tier: cert.tier,
    issuedAt: cert.issuedAt,
    expiresAt: cert.expiresAt,
    curriculumVersion: cert.curriculumVersion,
    renewalGeneration: cert.renewalGeneration,
    integrityLevel: cert.integrityLevel,
  };
  return JSON.stringify(payload);
}

export function parseCertSnapshotFromMetadata(
  raw: string | undefined
): AcademyCertificate | null {
  if (!raw?.trim()) return null;
  try {
    const data = JSON.parse(raw) as Partial<StoredCertSnapshot>;
    if (!data.id || !data.fullName || !data.tier || !data.issuedAt) return null;
    return {
      id: data.id,
      fullName: data.fullName,
      tier: data.tier,
      tierLabel: tierLabel(data.tier),
      issuedAt: data.issuedAt,
      expiresAt: data.expiresAt ?? data.issuedAt,
      curriculumVersion: data.curriculumVersion ?? "2026.05",
      renewalGeneration: data.renewalGeneration ?? 0,
      integrityLevel: data.integrityLevel ?? 2,
    };
  } catch {
    return null;
  }
}

export function parseAcademyDiplomaMetadata(
  meta: Record<string, string>
): AcademyDiplomaMetadata | null {
  if (meta.productKind !== "academy_diploma") return null;
  const diplomaType = meta.diplomaType?.trim();
  if (diplomaType !== "individual" && diplomaType !== "institution") return null;
  const contactEmail = meta.contactEmail?.trim().toLowerCase();
  if (!contactEmail) return null;

  const certSnapshot = parseCertSnapshotFromMetadata(meta.certSnapshot);

  return {
    productKind: "academy_diploma",
    diplomaType,
    certId: meta.certId?.trim() || certSnapshot?.id || undefined,
    certSnapshot: certSnapshot ?? undefined,
    organizationName: meta.organizationName?.trim() || undefined,
    contactName: meta.contactName?.trim() || undefined,
    contactEmail,
  };
}

export async function createDiplomaCheckoutSession(input: {
  diplomaType: DiplomaProductType;
  certToken?: string;
  organizationName?: string;
  contactEmail: string;
  contactName?: string;
}): Promise<{ url: string; sessionId: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "stripe_unconfigured" };

  const product = diplomaProduct(input.diplomaType);
  let certId: string | undefined;
  let certSnapshotJson = "";

  if (input.diplomaType === "individual") {
    if (!input.certToken?.trim()) return { error: "missing_cert" };
    const cert = parseCertificateToken(input.certToken.trim());
    if (!cert) return { error: "invalid_cert" };
    if (cert.tier !== "fundamentals") return { error: "unsupported_tier" };
    certId = cert.id;
    certSnapshotJson = certSnapshotForStripeMetadata(cert);
    if (certSnapshotJson.length > STRIPE_METADATA_MAX) {
      return { error: "checkout_failed" };
    }
  } else {
    const org = input.organizationName?.trim();
    if (!org || org.length < 2) return { error: "missing_organization" };
  }

  const origin = siteOrigin();
  const metadata: Record<string, string> = {
    productKind: "academy_diploma",
    diplomaType: input.diplomaType,
    contactEmail: input.contactEmail.trim().toLowerCase(),
    contactName: input.contactName?.trim() ?? "",
    organizationName: input.organizationName?.trim() ?? "",
    certId: certId ?? "",
    certSnapshot: certSnapshotJson,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.contactEmail.trim().toLowerCase(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.amountCents,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      metadata,
      success_url: `${origin}${ACADEMY_DIPLOMA_SUCCESS_ROUTE}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        input.diplomaType === "institution"
          ? `${origin}/academy/entreprise?cancelled=1`
          : `${origin}/academy/fondamentaux?cancelled=1`,
      allow_promotion_codes: true,
    });

    if (!session.url) return { error: "checkout_failed" };
    return { url: session.url, sessionId: session.id };
  } catch (err) {
    console.error("[academy/diploma] stripe checkout failed", err);
    return { error: "checkout_failed" };
  }
}

export async function retrievePaidCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    return session;
  } catch {
    return null;
  }
}
