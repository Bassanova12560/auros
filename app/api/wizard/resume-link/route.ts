import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { setRateLimitContext } from "@/lib/protocol/rate-limit-context";
import { sendWizardResumeReminder } from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import { isLocale, type Locale } from "@/lib/i18n";

const LIMIT = 8;
const WINDOW_MS = 3_600_000;

/**
 * Free resume link by email — anti-exit for non-pro drafts.
 * Does not require Stripe purchase; points to /wizard with email hint.
 */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = checkRateLimit(`wizard-resume:${ip}`, LIMIT, WINDOW_MS);
  setRateLimitContext({
    limit: LIMIT,
    remaining: rate.remaining,
    reset: rate.reset,
  });
  if (!rate.allowed) {
    return protocolError("rate_limit", "Too many resume requests", 429);
  }

  let body: { email?: string; locale?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return protocolError("invalid_json", "JSON required", 400);
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email || !email.includes("@") || email.length > 200) {
    return protocolError("validation_error", "Valid email required", 400);
  }

  const locale: Locale = isLocale(body.locale ?? "") ? (body.locale as Locale) : "fr";
  const origin = siteOrigin();
  const resumeUrl = `${origin}/wizard?expert=1&resume_email=${encodeURIComponent(email)}`;

  const ok = await sendWizardResumeReminder(email, {
    locale,
    resumeUrl,
  });

  if (!ok) {
    // Still return ok if email provider missing in dev — UX shouldn't hard-fail.
    return protocolJson({
      ok: true,
      delivered: false,
      resume_url: resumeUrl,
      message: "Link ready — email delivery skipped or failed",
    });
  }

  return protocolJson({
    ok: true,
    delivered: true,
    message: "Resume link emailed",
  });
});
