import type { ComparatorPageId } from "./constants";
import type { ComparatorMessages, ComparatorPageCopy } from "./i18n";
import type { ComparatorId } from "./registry";

export function getPageCopy(
  messages: ComparatorMessages,
  pageId: ComparatorPageId
): ComparatorPageCopy {
  switch (pageId) {
    case "stablecoins":
      return messages.stablecoins;
    case "immobilier":
      return messages.immobilier;
    case "obligations":
      return messages.obligations;
    case "matieres-premieres":
      return messages.matieresPremieres;
    case "private-credit":
      return messages.privateCredit;
  }
}

export function pageCopyForId(
  messages: ComparatorMessages,
  id: ComparatorId | undefined
): ComparatorPageCopy | null {
  switch (id) {
    case "stablecoins":
      return messages.stablecoins;
    case "immobilier":
      return messages.immobilier;
    case "obligations":
      return messages.obligations;
    case "matieres-premieres":
      return messages.matieresPremieres;
    case "private-credit":
      return messages.privateCredit;
    default:
      return null;
  }
}

export function footerDisclaimerForId(
  messages: ComparatorMessages,
  id: ComparatorId | undefined,
  isCompareHub?: boolean
): string {
  if (isCompareHub) return messages.compareHub.footerDisclaimer;
  return pageCopyForId(messages, id)?.footerDisclaimer ?? messages.footer.disclaimer;
}

export function comparatorIdToPageId(
  id: ComparatorId | undefined
): ComparatorPageId | null {
  switch (id) {
    case "stablecoins":
    case "immobilier":
    case "obligations":
    case "matieres-premieres":
    case "private-credit":
      return id;
    default:
      return null;
  }
}
