export type StarterKitTimelinePhase = {
  phase: string;
  duration: string;
  actions: string;
};

export type StarterKitTechMatch = {
  name: string;
  fit: string;
  note: string;
};

export type StarterKitContent = {
  executiveSummary: string;
  recommendedStructure: string;
  jurisdictionRationale: string;
  regulatoryChecklist: string[];
  timeline: StarterKitTimelinePhase[];
  techProviders: StarterKitTechMatch[];
  nextSteps: string[];
  disclaimer: string;
};

export type StarterKitLeadContext = {
  leadId: string;
  firstName: string;
  email: string;
  projectType: string;
  projectValue?: string | null;
  jurisdictions: string[];
  locale: string;
  aiBrief?: string | null;
  aiQuote?: string | null;
  paidTier: string;
};
