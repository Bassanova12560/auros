import { Resend } from "resend";

import { internalNotifyEmail, resendFrom } from "./constants";
import type { Locale } from "@/lib/i18n";
import {
  localizedStatusEmail,
  type StatusEmailKind,
} from "./locale-templates";
import {
  conciergeInternalEmail,
  conciergeUserEmail,
  leadScoreEmail,
  partnerInternalEmail,
  partnerUserEmail,
  jurisdictionGuideInternalEmail,
  jurisdictionGuideUserEmail,
  jurisdictionQuoteInternalEmail,
  jurisdictionQuoteUserEmail,
  jurisdictionNurtureEmail,
  jurisdictionPaymentUserEmail,
  jurisdictionPaymentInternalEmail,
  starterKitDeliveryEmail,
  starterKitTechIntroEmail,
  academyReminderJ14Email,
  academyReminderJ3Email,
  academyRenewalSuccessEmail,
  academyRemindersSubscribedEmail,
  dossierStatusUserEmail,
  submitDossierInternalEmail,
  submitDossierUserEmail,
  wizardCompleteEmail,
  greenMarketReceivedEmail,
  greenMarketApprovedEmail,
  greenMarketInternalEmail,
  greenLabelReceivedEmail,
  greenLabelApprovedEmail,
  greenLabelInternalEmail,
  greenLabelStatusEmail,
  greenMarketAlertEmail,
  greenOfferInterestInternalEmail,
  greenOfferInterestActorEmail,
  type ConciergeInternalEmailData,
  type SubmitDossierEmailData,
  type ConciergeUserEmailData,
  type LeadScoreEmailData,
  type PartnerInternalEmailData,
  type PartnerUserEmailData,
  type JurisdictionGuideInternalEmailData,
  type JurisdictionGuideUserEmailData,
  type JurisdictionQuoteInternalEmailData,
  type JurisdictionQuoteUserEmailData,
  type JurisdictionNurtureEmailData,
  type JurisdictionPaymentEmailData,
  type JurisdictionPaymentInternalEmailData,
  type StarterKitDeliveryEmailData,
  type StarterKitTechIntroEmailData,
  type AcademyReminderEmailData,
  type AcademyRenewalSuccessEmailData,
  type WizardCompleteEmailData,
  type GreenMarketReceivedEmailData,
  type GreenMarketApprovedEmailData,
  type GreenMarketInternalEmailData,
  type GreenLabelReceivedEmailData,
  type GreenLabelApprovedEmailData,
  type GreenLabelInternalEmailData,
  type GreenLabelStatusEmailData,
  type GreenLabelStatusEmailKind,
  type GreenMarketAlertEmailData,
  type GreenOfferInterestEmailData,
} from "./templates";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[email] RESEND_API_KEY missing — skip send");
    return null;
  }
  return new Resend(key);
}

async function sendSafe(options: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const to = Array.isArray(options.to) ? options.to : [options.to];
    const { error } = await resend.emails.send({
      from: resendFrom(),
      to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

export async function sendWizardComplete(
  to: string,
  data: WizardCompleteEmailData
): Promise<boolean> {
  const { subject, html } = wizardCompleteEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendConciergeConfirmation(
  to: string,
  data: ConciergeUserEmailData
): Promise<boolean> {
  const { subject, html } = conciergeUserEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendConciergeInternal(
  data: ConciergeInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) {
    console.warn("[email] RESEND_INTERNAL_EMAIL missing — skip concierge internal");
    return false;
  }
  const { subject, html } = conciergeInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendPartnerConfirmation(
  to: string,
  data: PartnerUserEmailData
): Promise<boolean> {
  const { subject, html } = partnerUserEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendPartnerInternal(
  data: PartnerInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) {
    console.warn("[email] RESEND_INTERNAL_EMAIL missing — skip partner internal");
    return false;
  }
  const { subject, html } = partnerInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendLeadScore(
  to: string,
  data: LeadScoreEmailData
): Promise<boolean> {
  const { subject, html } = leadScoreEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendSubmitDossierConfirmation(
  to: string,
  data: SubmitDossierEmailData
): Promise<boolean> {
  const { subject, html } = submitDossierUserEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendSubmitDossierInternal(
  data: SubmitDossierEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = submitDossierInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

/** Solo ops — après changement de statut dans Supabase (script ops). */
export async function sendDossierStatusUpdate(
  to: string,
  kind: StatusEmailKind,
  locale: Locale,
  firstName: string,
  assetType: string
): Promise<boolean> {
  const { subject, html } = dossierStatusUserEmail(
    kind,
    locale,
    firstName,
    assetType
  );
  return sendSafe({ to, subject, html });
}

export async function sendJurisdictionGuideConfirmation(
  to: string,
  data: JurisdictionGuideUserEmailData
): Promise<boolean> {
  const { subject, html } = jurisdictionGuideUserEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendJurisdictionGuideInternal(
  data: JurisdictionGuideInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = jurisdictionGuideInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendJurisdictionQuoteConfirmation(
  to: string,
  data: JurisdictionQuoteUserEmailData
): Promise<boolean> {
  const { subject, html } = jurisdictionQuoteUserEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendJurisdictionQuoteInternal(
  data: JurisdictionQuoteInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = jurisdictionQuoteInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendJurisdictionNurture(
  to: string,
  data: JurisdictionNurtureEmailData
): Promise<boolean> {
  const { subject, html } = jurisdictionNurtureEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendJurisdictionPaymentConfirmation(
  to: string,
  data: JurisdictionPaymentEmailData
): Promise<boolean> {
  const { subject, html } = jurisdictionPaymentUserEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendJurisdictionPaymentInternal(
  data: JurisdictionPaymentInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = jurisdictionPaymentInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendStarterKitDelivery(
  to: string,
  data: StarterKitDeliveryEmailData
): Promise<boolean> {
  const { subject, html } = starterKitDeliveryEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendStarterKitTechIntro(
  to: string,
  data: StarterKitTechIntroEmailData
): Promise<boolean> {
  if (!data.providers.length) return false;
  const { subject, html } = starterKitTechIntroEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendAcademyReminderJ14(
  to: string,
  data: AcademyReminderEmailData
): Promise<boolean> {
  const { subject, html } = academyReminderJ14Email(data);
  return sendSafe({ to, subject, html });
}

export async function sendAcademyReminderJ3(
  to: string,
  data: AcademyReminderEmailData
): Promise<boolean> {
  const { subject, html } = academyReminderJ3Email(data);
  return sendSafe({ to, subject, html });
}

export async function sendAcademyRenewalSuccess(
  to: string,
  data: AcademyRenewalSuccessEmailData
): Promise<boolean> {
  const { subject, html } = academyRenewalSuccessEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendAcademyRemindersSubscribed(
  to: string,
  data: AcademyReminderEmailData
): Promise<boolean> {
  const { subject, html } = academyRemindersSubscribedEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenMarketReceived(
  to: string,
  data: GreenMarketReceivedEmailData
): Promise<boolean> {
  const { subject, html } = greenMarketReceivedEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenMarketApproved(
  to: string,
  data: GreenMarketApprovedEmailData
): Promise<boolean> {
  const { subject, html } = greenMarketApprovedEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenMarketInternal(
  data: GreenMarketInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = greenMarketInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendGreenLabelReceived(
  to: string,
  data: GreenLabelReceivedEmailData
): Promise<boolean> {
  const { subject, html } = greenLabelReceivedEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenLabelApproved(
  to: string,
  data: GreenLabelApprovedEmailData
): Promise<boolean> {
  const { subject, html } = greenLabelApprovedEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenLabelStatusUpdate(
  to: string,
  kind: GreenLabelStatusEmailKind,
  data: GreenLabelStatusEmailData
): Promise<boolean> {
  const { subject, html } = greenLabelStatusEmail(kind, data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenLabelInternal(
  data: GreenLabelInternalEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = greenLabelInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendGreenMarketAlert(
  to: string,
  data: GreenMarketAlertEmailData
): Promise<boolean> {
  const { subject, html } = greenMarketAlertEmail(data);
  return sendSafe({ to, subject, html });
}

export async function sendGreenOfferInterestInternal(
  data: GreenOfferInterestEmailData
): Promise<boolean> {
  const internal = internalNotifyEmail();
  if (!internal) return false;
  const { subject, html } = greenOfferInterestInternalEmail(data);
  return sendSafe({ to: internal, subject, html });
}

export async function sendGreenOfferInterestActor(
  to: string,
  data: GreenOfferInterestEmailData
): Promise<boolean> {
  const { subject, html } = greenOfferInterestActorEmail(data);
  return sendSafe({ to, subject, html });
}
