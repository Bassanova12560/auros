import {
  createCertificateToken,
  parseCertificateToken,
} from "@/lib/academy/cert-token";
import {
  CURRICULUM_VERSION,
  INTEGRITY_LEVEL,
  MIN_CHALLENGE_MS,
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
} from "@/lib/academy/constants";
import { computeExpiresAt } from "@/lib/academy/issue-certificate";
import {
  gradeChallenge,
  startQuizSession,
  submitQuizSession,
} from "@/lib/academy/integrity-flow";
import { getQuestionById } from "@/lib/academy/quiz-bank";
import {
  ACADEMY_DEV_SECRET,
  academySecretsHealthy,
  isLegacyCertifyAllowed,
} from "@/lib/academy/security";
import {
  decodeSignedPayload,
  encodeSignedPayload,
} from "@/lib/academy/session-token";
import type { ChallengeSessionPayload } from "@/lib/academy/types";
import { check, warnCheck, type SimCheck } from "@/lib/simulation/types";

const AGENT = "academy";

function loadEnvLocal(): void {
  try {
    const { readFileSync } = require("node:fs") as typeof import("node:fs");
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // optional
  }
}

function fakeTimings(questionIds: string[]): Record<string, number> {
  const per = Math.max(MIN_QUESTION_MS, Math.ceil(MIN_QUIZ_TOTAL_MS / questionIds.length));
  return Object.fromEntries(questionIds.map((id) => [id, per]));
}

export function runAcademyLocalAgent(): SimCheck[] {
  const checks: SimCheck[] = [];

  const secrets = academySecretsHealthy();
  checks.push(
    secrets.ok
      ? check(AGENT, "cert secret configured", true, "ACADEMY_CERT_SECRET ok")
      : warnCheck(
          AGENT,
          "cert secret configured",
          false,
          "Set ACADEMY_CERT_SECRET (not dev default) in production"
        )
  );

  checks.push(
    check(
      AGENT,
      "legacy certify blocked in prod",
      !isLegacyCertifyAllowed() || process.env.NODE_ENV !== "production",
      isLegacyCertifyAllowed() ? "allowed (dev or ACADEMY_LEGACY_CERTIFY=1)" : "blocked"
    )
  );

  const issuedAt = new Date().toISOString();
  const validToken = createCertificateToken({
    id: "SIMTEST1",
    fullName: "Sim Agent",
    tier: "fundamentals",
    issuedAt,
    expiresAt: computeExpiresAt(issuedAt),
    curriculumVersion: CURRICULUM_VERSION,
    renewalGeneration: 0,
    integrityLevel: INTEGRITY_LEVEL,
  });
  checks.push(
    check(
      AGENT,
      "cert token round-trip",
      parseCertificateToken(validToken)?.id === "SIMTEST1",
      "HMAC sign/verify"
    )
  );

  checks.push(
    check(
      AGENT,
      "tampered cert rejected",
      parseCertificateToken(validToken.slice(0, -4) + "xxxx") === null,
      "signature mismatch"
    )
  );

  const session = startQuizSession("Security Agent");
  checks.push(
    check(
      AGENT,
      "quiz session starts",
      Boolean(session?.sessionToken),
      session ? `${session.questions.length} questions` : "failed"
    )
  );

  if (session) {
    const hasAnswersOnClient = session.questions.some(
      (q) => "correctOptionId" in (q as object)
    );
    checks.push(
      check(
        AGENT,
        "answers not exposed",
        !hasAnswersOnClient,
        "no correctOptionId in public questions"
      )
    );
  }

  const forged = Buffer.from(
    JSON.stringify({
      p: JSON.stringify({
        kind: "challenge",
        sessionId: "fake",
        fullName: "Hacker",
        scenarioId: "fundamentals-structured",
        quizSessionId: "x",
        quizScore: 10,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      }),
      s: "forged",
    })
  ).toString("base64url");

  checks.push(
    check(
      AGENT,
      "forged session rejected",
      decodeSignedPayload(forged) === null,
      "invalid HMAC"
    )
  );

  return checks;
}

export async function runAcademyAsyncAgent(): Promise<SimCheck[]> {
  const checks: SimCheck[] = [];

  loadEnvLocal();
  process.env.GEMINI_API_KEY = "";
  process.env.GROQ_API_KEY = "";

  const session = startQuizSession("Async Security");
  if (!session) {
    checks.push(check(AGENT, "full flow", false, "no session"));
    return checks;
  }

  const ids = session.questions.map((q) => q.id);
  const submit = submitQuizSession({
    sessionToken: session.sessionToken,
    answers: Object.fromEntries(ids.map((id) => [id, getQuestionById(id)!.correctOptionId])),
    timings: fakeTimings(ids),
  });

  checks.push(
    check(
      AGENT,
      "quiz submit valid",
      submit.ok === true,
      submit.ok ? `score ${submit.score}` : (submit as { reason: string }).reason
    )
  );

  if (!submit.ok) return checks;

  const payload = decodeSignedPayload<ChallengeSessionPayload>(submit.challengeToken);
  const challengeDef = payload
    ? (await import("@/lib/academy/structured-challenge")).getStructuredChallengeById(
        payload.scenarioId
      )
    : null;

  if (!challengeDef) {
    checks.push(check(AGENT, "challenge grade", false, "no structured challenge"));
    return checks;
  }

  const fields = (await import("@/lib/academy/structured-challenge")).buildPassFields(
    challengeDef
  );
  const graded = await gradeChallenge({
    challengeToken: submit.challengeToken,
    fields,
    elapsedMs: MIN_CHALLENGE_MS + 500,
  });

  checks.push(
    check(
      AGENT,
      "challenge grade valid",
      graded.ok === true,
      graded.ok ? `cert ${graded.certificate.id}` : (graded as { reason: string }).reason
    )
  );

  if (graded.ok) {
    const replay = await gradeChallenge({
      challengeToken: submit.challengeToken,
      fields,
      elapsedMs: MIN_CHALLENGE_MS + 500,
    });
    checks.push(
      check(
        AGENT,
        "challenge replay blocked",
        !replay.ok && replay.reason === "session_already_used",
        replay.ok ? "REPLAY VULNERABLE" : replay.reason
      )
    );
  }

  return checks;
}

export async function runAcademyHttpAgent(
  baseUrl: string,
  timeoutMs = 25_000
): Promise<SimCheck[]> {
  const base = baseUrl.replace(/\/$/, "");
  const checks: SimCheck[] = [];

  const pages = [
    "/academy",
    "/academy/fondamentaux",
    "/academy/reminders/unsubscribe",
  ];

  for (const path of pages) {
    try {
      const res = await fetch(`${base}${path}`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      checks.push(
        check(AGENT, `GET ${path}`, res.ok || res.status === 200, `HTTP ${res.status}`)
      );
    } catch (e) {
      checks.push(
        check(
          AGENT,
          `GET ${path}`,
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
    }
  }

  try {
    const legacy = await fetch(`${base}/api/academy/certify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Attacker", answers: {} }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const isProd = base.includes("vercel.app");
    checks.push(
      check(
        AGENT,
        "legacy certify blocked (prod)",
        isProd ? legacy.status === 410 : legacy.status !== 200,
        `HTTP ${legacy.status}${isProd ? " (expect 410)" : ""}`
      )
    );
  } catch (e) {
    checks.push(
      check(AGENT, "legacy certify blocked", false, e instanceof Error ? e.message : String(e))
    );
  }

  try {
    const bogus = await fetch(`${base}/api/academy/challenge/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeToken: "bogus",
        response: "x",
        elapsedMs: 999999,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    checks.push(
      check(
        AGENT,
        "bogus challenge rejected",
        bogus.status === 422,
        `HTTP ${bogus.status}`
      )
    );
  } catch (e) {
    checks.push(
      check(AGENT, "bogus challenge rejected", false, e instanceof Error ? e.message : String(e))
    );
  }

  try {
    const cron = await fetch(`${base}/api/cron/academy-reminders`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    checks.push(
      check(
        AGENT,
        "academy cron protected",
        cron.status === 401 || cron.status === 403,
        `HTTP ${cron.status}`
      )
    );
  } catch (e) {
    checks.push(
      check(AGENT, "academy cron protected", false, e instanceof Error ? e.message : String(e))
    );
  }

  try {
    const start = await fetch(`${base}/api/academy/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Probe Agent" }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const data = (await start.json()) as { sessionToken?: string; questions?: unknown[] };
    checks.push(
      check(
        AGENT,
        "session start API",
        start.ok && Boolean(data.sessionToken) && (data.questions?.length ?? 0) === 10,
        `HTTP ${start.status}`
      )
    );
  } catch (e) {
    checks.push(
      check(AGENT, "session start API", false, e instanceof Error ? e.message : String(e))
    );
  }

  return checks;
}

/** Guard: dev secret must not appear in production env checks */
export function runAcademyEnvAgent(): SimCheck[] {
  const raw = process.env.ACADEMY_CERT_SECRET?.trim() ?? "";
  return [
    check(
      AGENT,
      "not dev default secret",
      raw !== ACADEMY_DEV_SECRET || process.env.NODE_ENV !== "production",
      raw === ACADEMY_DEV_SECRET ? "INSECURE dev secret in prod" : "ok"
    ),
  ];
}
