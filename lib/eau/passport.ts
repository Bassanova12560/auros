import { createHash } from "node:crypto";

import { siteOrigin } from "@/lib/emails/constants";

/** Stable preview id for a hydrological description (not a verified passport). */
export function h2oPreviewId(text: string): string {
  const hash = createHash("sha256")
    .update(text.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
  return `h2o-preview-${hash}`;
}

export function eauPassportVerifyPath(previewId: string): string {
  return `/eau/verify/${encodeURIComponent(previewId)}`;
}

export function eauHubUrl(): string {
  return `${siteOrigin()}/eau`;
}

export function eauPassportUnlockPath(): string {
  return "/comment-tokeniser/eau";
}
