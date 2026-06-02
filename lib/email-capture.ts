/** localStorage key for landing-page score widget email capture. */
export const AUROS_EMAIL_CAPTURE_KEY = "auros_email_capture";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidCaptureEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}
