import { createHash } from "node:crypto";

import { siteOrigin } from "@/lib/emails/constants";

import { createH2oPreviewVerifyToken } from "./preview-token";

/** Stable preview id for a hydrological description (not a verified passport). */
export function h2oPreviewId(text: string): string {
  const hash = createHash("sha256")
    .update(text.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
  return `h2o-preview-${hash}`;
}

export function eauPassportVerifyPath(previewIdOrToken: string): string {
  return `/eau/verify/${encodeURIComponent(previewIdOrToken)}`;
}

export function eauPassportVerifyPathForScore(
  result: Parameters<typeof createH2oPreviewVerifyToken>[0],
): string {
  const token = createH2oPreviewVerifyToken(result);
  return eauPassportVerifyPath(token);
}

export function eauHubUrl(): string {
  return `${siteOrigin()}/eau`;
}

export function eauPassportUnlockPath(): string {
  return "/comment-tokeniser/eau";
}
