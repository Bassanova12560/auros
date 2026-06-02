export type ReadinessItem = {
  id: string;
  label: string;
  done: boolean;
};

export type ReadinessSnapshot = {
  score: number;
  percent: number;
  items: ReadinessItem[];
};

const QUICK_KEYS = ["asset", "value", "location"] as const;

export function readinessFromQuickInput(
  input: {
    assetType?: string;
    estimatedValue?: number;
    country?: string;
    score: number;
  },
  labels: Record<(typeof QUICK_KEYS)[number] | "description" | "documents" | "dossier", string>
): ReadinessSnapshot {
  const items: ReadinessItem[] = [
    {
      id: "asset",
      label: labels.asset,
      done: !!input.assetType?.trim(),
    },
    {
      id: "value",
      label: labels.value,
      done: (input.estimatedValue ?? 0) > 0,
    },
    {
      id: "location",
      label: labels.location,
      done: !!input.country?.trim(),
    },
    {
      id: "description",
      label: labels.description,
      done: false,
    },
    {
      id: "documents",
      label: labels.documents,
      done: false,
    },
    {
      id: "dossier",
      label: labels.dossier,
      done: false,
    },
  ];

  const done = items.filter((i) => i.done).length;
  const percent = Math.round((done / items.length) * 100);

  return {
    score: input.score,
    percent: Math.max(percent, Math.min(100, Math.round(input.score * 0.85))),
    items,
  };
}

export const READINESS_STORAGE_KEY = "auros_readiness_snapshot";

export function saveReadinessSnapshot(snapshot: ReadinessSnapshot) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
}

export function loadReadinessSnapshot(): ReadinessSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(READINESS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadinessSnapshot) : null;
  } catch {
    return null;
  }
}
