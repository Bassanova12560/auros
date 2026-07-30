import { auth } from "@clerk/nextjs/server";

import type { AcademySchoolId } from "@/lib/academy/curriculum";
import {
  ACADEMY_SCHOOL_IDS,
  getCurriculumModule,
  scoreCurriculumQuiz,
} from "@/lib/academy/curriculum/load";
import {
  getLearnerProgress,
  upsertModuleProgress,
} from "@/lib/academy/curriculum/progress";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const progress = await getLearnerProgress(userId);
  return Response.json({ ok: true, progress });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const schoolId = typeof o.schoolId === "string" ? o.schoolId : "";
  const moduleSlug = typeof o.moduleSlug === "string" ? o.moduleSlug : "";
  const action = typeof o.action === "string" ? o.action : "";

  if (!ACADEMY_SCHOOL_IDS.includes(schoolId as AcademySchoolId)) {
    return Response.json({ error: "invalid_school" }, { status: 400 });
  }

  const found = getCurriculumModule(schoolId, moduleSlug);
  if (!found) {
    return Response.json({ error: "invalid_module" }, { status: 400 });
  }

  if (action === "complete_lesson") {
    const lessonId = typeof o.lessonId === "string" ? o.lessonId : "";
    if (!found.module.lessons.some((l) => l.id === lessonId)) {
      return Response.json({ error: "invalid_lesson" }, { status: 400 });
    }
    const row = await upsertModuleProgress({
      userId,
      schoolId: schoolId as AcademySchoolId,
      moduleId: found.module.id,
      lessonsCompleted: [lessonId],
    });
    if (!row) {
      return Response.json({ error: "save_failed" }, { status: 503 });
    }
    return Response.json({ ok: true, module: row });
  }

  if (action === "submit_quiz") {
    const answers =
      o.answers && typeof o.answers === "object" && !Array.isArray(o.answers)
        ? (o.answers as Record<string, string>)
        : null;
    if (!answers) {
      return Response.json({ error: "invalid_answers" }, { status: 400 });
    }

    const progress = await getLearnerProgress(userId);
    const prev = progress.modules.find(
      (m) => m.schoolId === schoolId && m.moduleId === found.module.id
    );
    const lessonIds = found.module.lessons.map((l) => l.id);
    const completed = new Set(prev?.lessonsCompleted ?? []);
    const allRead = lessonIds.every((id) => completed.has(id));
    if (!allRead) {
      return Response.json({ error: "lessons_incomplete" }, { status: 422 });
    }

    const score = scoreCurriculumQuiz(found.module.quiz.questions, answers);
    const passed = score >= found.module.quiz.passScore;
    const row = await upsertModuleProgress({
      userId,
      schoolId: schoolId as AcademySchoolId,
      moduleId: found.module.id,
      quizPassed: passed || Boolean(prev?.quizPassed),
      quizScore: score,
    });
    if (!row) {
      return Response.json({ error: "save_failed" }, { status: 503 });
    }

    return Response.json({
      ok: true,
      passed,
      score,
      passScore: found.module.quiz.passScore,
      total: found.module.quiz.questions.length,
      module: row,
    });
  }

  return Response.json({ error: "invalid_action" }, { status: 400 });
}
