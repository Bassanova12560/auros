/** Dev/demo contact values — never restore into the wizard in production UX. */
const TEST_EMAIL_RE = /@(test|example)\.com$/i;
const TEST_EMAILS = new Set(["simulate@auros.test", "thomas.martin@test.com"]);

export function isDemoContactEmail(email: string | undefined | null): boolean {
  const e = email?.trim().toLowerCase() ?? "";
  if (!e) return false;
  return TEST_EMAIL_RE.test(e) || TEST_EMAILS.has(e);
}

export function isDemoContactFirstName(name: string | undefined | null): boolean {
  const n = name?.trim().toLowerCase() ?? "";
  return n === "thomas" || n === "test" || n === "demo";
}

import { STEP_STORAGE_KEYS } from "@/lib/wizard-constants";

/** Remove demo contact rows persisted in per-step localStorage. */
export function clearDemoContactStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STEP_STORAGE_KEYS[9]);
    if (!raw) return;
    const step9 = JSON.parse(raw) as { firstName?: string; email?: string };
    if (
      isDemoContactEmail(step9.email) ||
      isDemoContactFirstName(step9.firstName)
    ) {
      localStorage.removeItem(STEP_STORAGE_KEYS[9]);
    }
  } catch {
    // ignore
  }
}

export function sanitizeWizardContactPatch(patch: {
  firstName?: string;
  email?: string;
}): Partial<{ firstName: string; email: string }> {
  const out: Partial<{ firstName: string; email: string }> = {};
  if (patch.firstName && !isDemoContactFirstName(patch.firstName)) {
    out.firstName = patch.firstName;
  }
  if (patch.email && !isDemoContactEmail(patch.email)) {
    out.email = patch.email;
  }
  return out;
}
