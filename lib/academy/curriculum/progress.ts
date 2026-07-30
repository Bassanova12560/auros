import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

import { isAcademyProduction } from "@/lib/academy/security";

import type {
  AcademySchoolId,
  LearnerProgress,
  ModuleProgress,
} from "./types";

const memoryStore = new Map<string, LearnerProgress>();

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
    error.code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

type ProgressRow = {
  clerk_user_id: string;
  school_id: string;
  module_id: string;
  lessons_completed: string[] | null;
  quiz_passed: boolean | null;
  quiz_score: number | null;
  updated_at: string;
};

function rowsToProgress(userId: string, rows: ProgressRow[]): LearnerProgress {
  const modules: ModuleProgress[] = rows.map((row) => ({
    schoolId: row.school_id as AcademySchoolId,
    moduleId: row.module_id,
    lessonsCompleted: row.lessons_completed ?? [],
    quizPassed: Boolean(row.quiz_passed),
    quizScore: row.quiz_score ?? undefined,
    updatedAt: row.updated_at,
  }));
  const updatedAt =
    modules.map((m) => m.updatedAt).sort().at(-1) ?? new Date(0).toISOString();
  return { userId, modules, updatedAt };
}

function memoryGet(userId: string): LearnerProgress {
  return (
    memoryStore.get(userId) ?? {
      userId,
      modules: [],
      updatedAt: new Date(0).toISOString(),
    }
  );
}

export async function getLearnerProgress(userId: string): Promise<LearnerProgress> {
  if (!userId.trim()) {
    return { userId: "", modules: [], updatedAt: new Date(0).toISOString() };
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return memoryGet(userId);
  }

  try {
    const { data, error } = await supabase
      .from("academy_learning_progress")
      .select(
        "clerk_user_id, school_id, module_id, lessons_completed, quiz_passed, quiz_score, updated_at"
      )
      .eq("clerk_user_id", userId);

    if (error) {
      if (isMissingTable(error) && !isAcademyProduction()) {
        console.warn("[academy] learning_progress table missing — memory fallback");
        return memoryGet(userId);
      }
      console.error("[academy] getLearnerProgress", error);
      if (!isAcademyProduction()) return memoryGet(userId);
      return { userId, modules: [], updatedAt: new Date(0).toISOString() };
    }

    return rowsToProgress(userId, (data ?? []) as ProgressRow[]);
  } catch (err) {
    console.error("[academy] getLearnerProgress error", err);
    if (!isAcademyProduction()) return memoryGet(userId);
    return { userId, modules: [], updatedAt: new Date(0).toISOString() };
  }
}

export type UpsertProgressInput = {
  userId: string;
  schoolId: AcademySchoolId;
  moduleId: string;
  lessonsCompleted?: string[];
  quizPassed?: boolean;
  quizScore?: number;
};

export async function upsertModuleProgress(
  input: UpsertProgressInput
): Promise<ModuleProgress | null> {
  const now = new Date().toISOString();
  const existing = await getLearnerProgress(input.userId);
  const prev = existing.modules.find(
    (m) => m.schoolId === input.schoolId && m.moduleId === input.moduleId
  );

  const lessonsCompleted = Array.from(
    new Set([
      ...(prev?.lessonsCompleted ?? []),
      ...(input.lessonsCompleted ?? []),
    ])
  );

  const next: ModuleProgress = {
    schoolId: input.schoolId,
    moduleId: input.moduleId,
    lessonsCompleted,
    quizPassed: input.quizPassed ?? prev?.quizPassed ?? false,
    quizScore: input.quizScore ?? prev?.quizScore,
    updatedAt: now,
  };

  const supabase = getAdminClient();
  if (!supabase) {
    const modules = existing.modules.filter(
      (m) => !(m.schoolId === input.schoolId && m.moduleId === input.moduleId)
    );
    modules.push(next);
    memoryStore.set(input.userId, { userId: input.userId, modules, updatedAt: now });
    return next;
  }

  try {
    const { error } = await supabase.from("academy_learning_progress").upsert(
      {
        clerk_user_id: input.userId,
        school_id: input.schoolId,
        module_id: input.moduleId,
        lessons_completed: lessonsCompleted,
        quiz_passed: next.quizPassed,
        quiz_score: next.quizScore ?? null,
        updated_at: now,
      },
      { onConflict: "clerk_user_id,school_id,module_id" }
    );

    if (error) {
      if (isMissingTable(error) && !isAcademyProduction()) {
        const modules = existing.modules.filter(
          (m) => !(m.schoolId === input.schoolId && m.moduleId === input.moduleId)
        );
        modules.push(next);
        memoryStore.set(input.userId, {
          userId: input.userId,
          modules,
          updatedAt: now,
        });
        return next;
      }
      console.error("[academy] upsertModuleProgress", error);
      return null;
    }

    return next;
  } catch (err) {
    console.error("[academy] upsertModuleProgress error", err);
    if (!isAcademyProduction()) {
      const modules = existing.modules.filter(
        (m) => !(m.schoolId === input.schoolId && m.moduleId === input.moduleId)
      );
      modules.push(next);
      memoryStore.set(input.userId, { userId: input.userId, modules, updatedAt: now });
      return next;
    }
    return null;
  }
}
