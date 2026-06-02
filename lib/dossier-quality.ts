/**
 * Dossier report completeness — 100 points across wizard fields.
 */

const DOC_NONE = "None yet";

export type DossierQualityInput = {
  description?: string;
  value: number;
  country?: string;
  city?: string;
  documents?: string[];
  email?: string;
  firstName?: string;
};

export type QualityItemDef = {
  key: string;
  label: string;
  points: number;
  tip: string;
  check: (d: DossierQualityInput) => boolean;
};

export const QUALITY_ITEMS: QualityItemDef[] = [
  {
    key: "description",
    label: "Asset description",
    check: (d) => (d.description?.split(/\s+/).filter(Boolean).length ?? 0) >= 20,
    points: 15,
    tip: "Add more detail to your description",
  },
  {
    key: "valuation",
    label: "Estimated value",
    check: (d) => d.value > 0,
    points: 10,
    tip: "Value is required",
  },
  {
    key: "location",
    label: "Location",
    check: (d) => Boolean(d.country?.trim() && d.city?.trim()),
    points: 10,
    tip: "Add city and country",
  },
  {
    key: "documents_basic",
    label: "Basic documentation",
    check: (d) => {
      const docs = d.documents?.filter((doc) => doc && doc !== DOC_NONE) ?? [];
      return docs.length >= 1;
    },
    points: 15,
    tip: "Upload at least one document",
  },
  {
    key: "documents_strong",
    label: "Strong documentation",
    check: (d) => {
      const docs = d.documents?.filter((doc) => doc && doc !== DOC_NONE) ?? [];
      return docs.length >= 3;
    },
    points: 10,
    tip: "Add more supporting documents",
  },
  {
    key: "expert_valuation",
    label: "Expert valuation",
    check: (d) =>
      (d.documents ?? []).some(
        (doc) =>
          doc.toLowerCase().includes("valuation") ||
          doc.toLowerCase().includes("expert")
      ),
    points: 20,
    tip: "Add a professional valuation report",
  },
  {
    key: "insurance",
    label: "Insurance policy",
    check: (d) =>
      (d.documents ?? []).some((doc) =>
        doc.toLowerCase().includes("insurance")
      ),
    points: 10,
    tip: "Add proof of insurance",
  },
  {
    key: "contact",
    label: "Contact information",
    check: (d) => Boolean(d.email?.trim() && d.firstName?.trim()),
    points: 10,
    tip: "Complete your contact details",
  },
];

export const QUALITY_MAX_POINTS = QUALITY_ITEMS.reduce(
  (sum, item) => sum + item.points,
  0
);

export type QualityScoreResult = {
  percent: number;
  earnedPoints: number;
  maxPoints: number;
  missing: QualityItemDef[];
  fillColor: string;
  badge: {
    label: string;
    color: string;
    background: string;
  };
};

const COLORS = {
  red: "#E63329",
  orange: "#E67329",
  yellow: "#E6C829",
  green: "#4CAF7D",
} as const;

export function qualityFillColor(percent: number): string {
  if (percent >= 90) return COLORS.green;
  if (percent >= 75) return COLORS.yellow;
  if (percent >= 50) return COLORS.orange;
  return COLORS.red;
}

export function qualityBadge(percent: number): QualityScoreResult["badge"] {
  if (percent >= 90) {
    return {
      label: "READY FOR SUBMISSION",
      color: COLORS.green,
      background: "rgba(76, 175, 125, 0.12)",
    };
  }
  if (percent >= 75) {
    return {
      label: "GOOD STANDING",
      color: COLORS.yellow,
      background: "rgba(230, 200, 41, 0.12)",
    };
  }
  return {
    label: "NEEDS COMPLETION",
    color: COLORS.red,
    background: "rgba(230, 51, 41, 0.12)",
  };
}

export function calculateDossierQuality(
  data: DossierQualityInput
): QualityScoreResult {
  let earnedPoints = 0;
  const missing: QualityItemDef[] = [];

  for (const item of QUALITY_ITEMS) {
    if (item.check(data)) {
      earnedPoints += item.points;
    } else {
      missing.push(item);
    }
  }

  const percent = Math.min(
    100,
    Math.round((earnedPoints / QUALITY_MAX_POINTS) * 100)
  );

  return {
    percent,
    earnedPoints,
    maxPoints: QUALITY_MAX_POINTS,
    missing,
    fillColor: qualityFillColor(percent),
    badge: qualityBadge(percent),
  };
}
