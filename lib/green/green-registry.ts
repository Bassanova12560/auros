import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

import type { Locale } from "@/lib/i18n";

import type { GreenProjectType } from "./constants";

export type GreenLabelTier = "verified" | "pilot";

export type GreenRegistryProjectRow = {
  id: string;
  name: string;
  projectType: GreenProjectType;
  country: string;
  labelTier: GreenLabelTier;
  certifiedAt: string;
  verifyToken: string;
  summaries: Record<Locale, string>;
  website?: string;
};

export function greenProjectSummary(
  row: GreenRegistryProjectRow,
  locale: Locale
): string {
  return row.summaries[locale] ?? row.summaries.fr;
}

export type GreenRegistryExpertRow = {
  id: string;
  displayName: string;
  certifiedAt: string;
  verifyToken: string;
  specialty?: string;
};

export type GreenRegistrySnapshot = {
  available: boolean;
  projects: GreenRegistryProjectRow[];
  experts: GreenRegistryExpertRow[];
};

const FALLBACK_PROJECTS: Omit<GreenRegistryProjectRow, "summaries">[] = [
  {
    id: "pilot-solar-surplus-eu",
    name: "Cas pilote RTMS — Surplus solaire (EU)",
    projectType: "solar",
    country: "EU (anonymisé)",
    labelTier: "pilot",
    certifiedAt: "2026-05-29T10:00:00Z",
    verifyToken: "ag-pilot-solar-2026",
  },
  {
    id: "pilot-rec-traceability",
    name: "Cas pilote RTMS — Traçabilité REC",
    projectType: "rec",
    country: "EU (anonymisé)",
    labelTier: "pilot",
    certifiedAt: "2026-05-29T10:00:00Z",
    verifyToken: "ag-pilot-rec-2026",
  },
  {
    id: "verified-solar-aggregation-pt",
    name: "Auros Green Verified — Agrégation solaire (Portugal)",
    projectType: "solar",
    country: "Portugal",
    labelTier: "verified",
    certifiedAt: "2026-05-31T12:00:00Z",
    verifyToken: "ag-verified-solar-pt-2026",
  },
];

const FALLBACK_SUMMARIES: Record<
  string,
  Record<Locale, string>
> = {
  "pilot-solar-surplus-eu": {
    fr: "Dossier RTMS anonymisé — autoconsommation + injection, traçabilité kWh on-chain simulée. Démonstration méthodologique AUROS Green, pas un projet investissable listé.",
    en: "Anonymized RTMS dossier — self-consumption + feed-in, simulated on-chain kWh traceability. AUROS Green methodology demo, not a listed investable project.",
    es: "Dossier RTMS anonimizado — autoconsumo + inyección, trazabilidad kWh on-chain simulada. Demostración metodológica AUROS Green, no un proyecto invertible listado.",
  },
  "pilot-rec-traceability": {
    fr: "Revue documentaire RTMS sur chaîne REC agrégée — registre off-chain, mapping token, risques de double comptage identifiés. Cas pédagogique interne.",
    en: "RTMS document review on aggregated REC chain — off-chain registry, token mapping, double-counting risks flagged. Internal pedagogical case.",
    es: "Revisión documental RTMS sobre cadena REC agregada — registro off-chain, mapeo token, riesgos de doble conteo señalados. Caso pedagógico interno.",
  },
  "verified-solar-aggregation-pt": {
    fr: "Premier label Verified AUROS Green — revue RTMS complète sur dossier agrégation solaire anonymisé (PPA + traçabilité MWh). Audit documentaire validé ; pas de promesse de rendement.",
    en: "First Auros Green Verified label — full RTMS review on anonymized solar aggregation dossier (PPA + MWh traceability). Document audit passed; no return promise.",
    es: "Primer label Verified AUROS Green — revisión RTMS completa sobre dossier anonimizado de agregación solar (PPA + trazabilidad MWh). Auditoría documental validada; sin promesa de rendimiento.",
  },
};

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMissingTable(error: PostgrestError): boolean {
  const msg = error.message.toLowerCase();
  return (
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

function rowSummaries(
  id: string,
  row?: { summary_fr: string; summary_en: string; summary_es: string }
): Record<Locale, string> {
  if (row) {
    return { fr: row.summary_fr, en: row.summary_en, es: row.summary_es };
  }
  const fb = FALLBACK_SUMMARIES[id];
  return {
    fr: fb?.fr ?? "",
    en: fb?.en ?? fb?.fr ?? "",
    es: fb?.es ?? fb?.fr ?? "",
  };
}

function fallbackSnapshot(): GreenRegistrySnapshot {
  return {
    available: false,
    projects: FALLBACK_PROJECTS.map((p) => ({
      ...p,
      summaries: rowSummaries(p.id),
    })),
    experts: [],
  };
}

/** DB rows win on id conflict; fallback fills gaps (e.g. verified seed not yet in DB). */
function mergeRegistryProjects(
  dbProjects: GreenRegistryProjectRow[]
): GreenRegistryProjectRow[] {
  const byId = new Map<string, GreenRegistryProjectRow>();
  for (const p of FALLBACK_PROJECTS) {
    byId.set(p.id, { ...p, summaries: rowSummaries(p.id) });
  }
  for (const p of dbProjects) {
    byId.set(p.id, p);
  }
  return [...byId.values()].sort(
    (a, b) =>
      new Date(b.certifiedAt).getTime() - new Date(a.certifiedAt).getTime()
  );
}

export async function getGreenRegistrySnapshot(): Promise<GreenRegistrySnapshot> {
  const supabase = getAdminClient();
  if (!supabase) return fallbackSnapshot();

  try {
    const [projRes, expertRes] = await Promise.all([
      supabase
        .from("green_registry_projects")
        .select("*")
        .order("certified_at", { ascending: false }),
      supabase
        .from("green_registry_experts")
        .select("*")
        .order("certified_at", { ascending: false }),
    ]);

    if (projRes.error && isMissingTable(projRes.error)) {
      return fallbackSnapshot();
    }

    const projects: GreenRegistryProjectRow[] = (projRes.data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      projectType: row.project_type as GreenProjectType,
      country: String(row.country),
      labelTier: row.label_tier as GreenLabelTier,
      certifiedAt: String(row.certified_at),
      verifyToken: String(row.verify_token),
      summaries: rowSummaries(String(row.id), {
        summary_fr: String(row.summary_fr),
        summary_en: String(row.summary_en),
        summary_es: String(row.summary_es),
      }),
      website: row.website ? String(row.website) : undefined,
    }));

    const experts: GreenRegistryExpertRow[] = (expertRes.data ?? []).map((row) => ({
      id: String(row.id),
      displayName: String(row.display_name),
      certifiedAt: String(row.certified_at),
      verifyToken: String(row.verify_token),
      specialty: row.specialty ? String(row.specialty) : undefined,
    }));

    return {
      available: true,
      projects: mergeRegistryProjects(projects),
      experts,
    };
  } catch (err) {
    console.error("[green/registry] snapshot error", err);
    return fallbackSnapshot();
  }
}

export async function getGreenRegistryProjectByToken(
  token: string
): Promise<GreenRegistryProjectRow | null> {
  const snapshot = await getGreenRegistrySnapshot();
  return snapshot.projects.find((p) => p.verifyToken === token) ?? null;
}

export async function getGreenRegistryProjectById(
  id: string
): Promise<GreenRegistryProjectRow | null> {
  const snapshot = await getGreenRegistrySnapshot();
  return snapshot.projects.find((p) => p.id === id) ?? null;
}

export async function listGreenRegistryProjectSitemapIds(): Promise<
  { id: string; certifiedAt: string }[]
> {
  const snapshot = await getGreenRegistrySnapshot();
  return snapshot.projects.map((p) => ({
    id: p.id,
    certifiedAt: p.certifiedAt,
  }));
}

export async function getGreenRegistryExpertByToken(
  token: string
): Promise<GreenRegistryExpertRow | null> {
  const snapshot = await getGreenRegistrySnapshot();
  return snapshot.experts.find((e) => e.verifyToken === token) ?? null;
}

export function greenVerifyPath(token: string): string {
  return `/green/verify/${encodeURIComponent(token)}`;
}

export type RegisterGreenExpertInput = {
  certId: string;
  displayName: string;
  email: string;
  verifyToken: string;
  score: number;
  quizTotal: number;
  issuedAt: string;
  expiresAt: string;
  locale: Locale;
};

export async function registerGreenExpert(
  input: RegisterGreenExpertInput
): Promise<{ ok: true } | { ok: false }> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false };

  const expertId = `expert-${input.certId}`;

  const { error: certErr } = await supabase.from("green_praticien_certs").insert({
    cert_id: input.certId,
    display_name: input.displayName,
    email: input.email,
    verify_token: input.verifyToken,
    score: input.score,
    quiz_total: input.quizTotal,
    issued_at: input.issuedAt,
    expires_at: input.expiresAt,
    locale: input.locale,
  });

  if (certErr && !isMissingTable(certErr)) {
    console.error("[registerGreenExpert] cert", certErr);
    return { ok: false };
  }

  if (certErr && isMissingTable(certErr)) {
    console.warn("[registerGreenExpert] cert table missing — expert registry only");
  }

  const { error: expertErr } = await supabase.from("green_registry_experts").upsert(
    {
      id: expertId,
      display_name: input.displayName,
      certified_at: input.issuedAt,
      verify_token: input.verifyToken,
      specialty: "RTMS · Green RWA",
    },
    { onConflict: "id" }
  );

  if (expertErr) {
    console.error("[registerGreenExpert] registry", expertErr);
    return { ok: false };
  }

  return { ok: true };
}
