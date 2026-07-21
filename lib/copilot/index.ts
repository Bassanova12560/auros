export {
  COPILOT_ROUTE,
  COPILOT_OPS_ROUTE,
  COPILOT_DISCLAIMER,
  buildCopilotHref,
  parseCopilotSearchParams,
  type CopilotDraft,
  type CopilotDraftKind,
  type CopilotDraftStatus,
  type CopilotCitation,
  type CopilotChatMessage,
  type CopilotChatRequest,
  type CopilotChatResponse,
  type CopilotPageContext,
  type CopilotSurface,
} from "./types";
export {
  suggestionsForContext,
  getCopilotUi,
  copilotBannerLabel,
  localizedSuggestionsForContext,
} from "./ui-i18n";
export { runCopilotChat } from "./chat";
export { runCopilotTools, collectSuggestedIds } from "./tools";
export {
  insertCopilotDraft,
  listCopilotDrafts,
  getCopilotDraft,
  reviewCopilotDraft,
} from "./drafts-store";
export { runCatalogDraftAgent, runContentDraftAgent, runSocialContentSignalsAgent } from "./agents";
export { runClientCareDraftAgent } from "./care-agent";
