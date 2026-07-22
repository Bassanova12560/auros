/**
 * AUROS Exception Management OS v0 — HITL ops queue for messy cases.
 * Institutions pay for escalate / assign / resolve with evidence trail.
 * Never auto-resolves or claims compliance.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type TollExceptionStatus =
  | "open"
  | "escalated"
  | "resolved"
  | "closed";

export type TollExceptionSeverity = "low" | "medium" | "high";

export type TollExceptionKind =
  | "missing_docs"
  | "jurisdiction_conflict"
  | "stale_data"
  | "partial_availability"
  | "other";

export type TollExceptionEvidenceKind =
  | "create"
  | "update"
  | "escalate"
  | "assign"
  | "resolve"
  | "close"
  | "note";

export type TollExceptionEvidence = {
  at: string;
  by?: string;
  note: string;
  kind: TollExceptionEvidenceKind;
};

export type TollExceptionRecord = {
  id: string;
  kind: TollExceptionKind;
  severity: TollExceptionSeverity;
  status: TollExceptionStatus;
  title: string;
  summary: string;
  assetDnaId?: string;
  assignee?: string;
  /** Optional SLA deadline (ISO). */
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  evidence: TollExceptionEvidence[];
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "toll-exceptions.json");

const STATUSES = new Set<TollExceptionStatus>([
  "open",
  "escalated",
  "resolved",
  "closed",
]);
const SEVERITIES = new Set<TollExceptionSeverity>(["low", "medium", "high"]);
const KINDS = new Set<TollExceptionKind>([
  "missing_docs",
  "jurisdiction_conflict",
  "stale_data",
  "partial_availability",
  "other",
]);

/** Default SLA horizon from now by severity (ms). */
const SLA_MS: Record<TollExceptionSeverity, number> = {
  high: 24 * 3_600_000,
  medium: 72 * 3_600_000,
  low: 7 * 24 * 3_600_000,
};

export function isTollExceptionStatus(
  value: unknown
): value is TollExceptionStatus {
  return typeof value === "string" && STATUSES.has(value as TollExceptionStatus);
}

export function isTollExceptionSeverity(
  value: unknown
): value is TollExceptionSeverity {
  return (
    typeof value === "string" && SEVERITIES.has(value as TollExceptionSeverity)
  );
}

export function isTollExceptionKind(
  value: unknown
): value is TollExceptionKind {
  return typeof value === "string" && KINDS.has(value as TollExceptionKind);
}

export function normalizeOptionalText(
  value: unknown,
  max: number
): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

export function normalizeRequiredText(
  value: unknown,
  max: number
): string | null {
  const t = normalizeOptionalText(value, max);
  return t ?? null;
}

/** Suggested SLA dueAt for a severity (HITL may override). */
export function defaultSlaDueAt(
  severity: TollExceptionSeverity,
  nowMs = Date.now()
): string {
  return new Date(nowMs + SLA_MS[severity]).toISOString();
}

export function parseIsoDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const t = Date.parse(trimmed);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
}

export function parseCreateExceptionInput(raw: unknown):
  | {
      ok: true;
      data: {
        kind: TollExceptionKind;
        severity: TollExceptionSeverity;
        title: string;
        summary: string;
        assetDnaId?: string;
        assignee?: string;
        dueAt?: string;
        by?: string;
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  if (!isTollExceptionKind(body.kind)) {
    return { ok: false, error: "invalid_kind" };
  }
  if (!isTollExceptionSeverity(body.severity)) {
    return { ok: false, error: "invalid_severity" };
  }
  const title = normalizeRequiredText(body.title, 160);
  if (!title) return { ok: false, error: "invalid_title" };
  const summary = normalizeRequiredText(body.summary, 800);
  if (!summary) return { ok: false, error: "invalid_summary" };

  let dueAt = parseIsoDate(body.dueAt);
  if (body.dueAt !== undefined && body.dueAt !== null && body.dueAt !== "" && !dueAt) {
    return { ok: false, error: "invalid_due_at" };
  }
  if (!dueAt && body.autoSla === true) {
    dueAt = defaultSlaDueAt(body.severity);
  }

  return {
    ok: true,
    data: {
      kind: body.kind,
      severity: body.severity,
      title,
      summary,
      assetDnaId: normalizeOptionalText(body.assetDnaId, 120),
      assignee: normalizeOptionalText(body.assignee, 120),
      dueAt,
      by: normalizeOptionalText(body.by, 120),
    },
  };
}

export function parseUpdateExceptionInput(raw: unknown):
  | {
      ok: true;
      data: {
        status?: TollExceptionStatus;
        severity?: TollExceptionSeverity;
        /** string = set; null = clear */
        assignee?: string | null;
        dueAt?: string | null;
        note?: string;
        by?: string;
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  const data: {
    status?: TollExceptionStatus;
    severity?: TollExceptionSeverity;
    assignee?: string | null;
    dueAt?: string | null;
    note?: string;
    by?: string;
  } = {};

  if (body.status !== undefined) {
    if (!isTollExceptionStatus(body.status)) {
      return { ok: false, error: "invalid_status" };
    }
    if (body.status === "resolved") {
      return { ok: false, error: "use_resolve_action" };
    }
    data.status = body.status;
  }
  if (body.severity !== undefined) {
    if (!isTollExceptionSeverity(body.severity)) {
      return { ok: false, error: "invalid_severity" };
    }
    data.severity = body.severity;
  }
  if (body.assignee !== undefined) {
    if (body.assignee === null || body.assignee === "") {
      data.assignee = null;
    } else {
      const a = normalizeOptionalText(body.assignee, 120);
      if (!a) return { ok: false, error: "invalid_assignee" };
      data.assignee = a;
    }
  }
  if (body.dueAt !== undefined) {
    if (body.dueAt === null || body.dueAt === "") {
      data.dueAt = null;
    } else {
      const d = parseIsoDate(body.dueAt);
      if (!d) return { ok: false, error: "invalid_due_at" };
      data.dueAt = d;
    }
  }
  data.note = normalizeOptionalText(body.note, 800);
  data.by = normalizeOptionalText(body.by, 120);

  if (
    data.status === undefined &&
    data.severity === undefined &&
    body.assignee === undefined &&
    body.dueAt === undefined &&
    !data.note
  ) {
    return { ok: false, error: "empty_update" };
  }

  return { ok: true, data };
}

export function parseResolveExceptionInput(raw: unknown):
  | {
      ok: true;
      data: {
        resolutionNote: string;
        by?: string;
        close?: boolean;
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  const resolutionNote = normalizeRequiredText(
    body.resolutionNote ?? body.note,
    1200
  );
  if (!resolutionNote) return { ok: false, error: "invalid_resolution_note" };
  return {
    ok: true,
    data: {
      resolutionNote,
      by: normalizeOptionalText(body.by, 120),
      close: body.close === true,
    },
  };
}

function load(): TollExceptionRecord[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(
      readFileSync(FILE, "utf8")
    ) as TollExceptionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: TollExceptionRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-2_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

function pushEvidence(
  row: TollExceptionRecord,
  kind: TollExceptionEvidenceKind,
  note: string,
  by?: string
): void {
  row.evidence.push({
    at: new Date().toISOString(),
    kind,
    note: note.slice(0, 800),
    by,
  });
  if (row.evidence.length > 100) {
    row.evidence = row.evidence.slice(-100);
  }
}

export function createTollException(input: {
  kind: TollExceptionKind;
  severity: TollExceptionSeverity;
  title: string;
  summary: string;
  assetDnaId?: string;
  assignee?: string;
  dueAt?: string;
  by?: string;
}): TollExceptionRecord {
  const now = new Date().toISOString();
  const row: TollExceptionRecord = {
    id: `exc_${randomBytes(8).toString("hex")}`,
    kind: input.kind,
    severity: input.severity,
    status: "open",
    title: input.title,
    summary: input.summary,
    assetDnaId: input.assetDnaId,
    assignee: input.assignee,
    dueAt: input.dueAt,
    createdAt: now,
    updatedAt: now,
    evidence: [],
  };
  pushEvidence(
    row,
    "create",
    `Opened ${input.kind} (${input.severity}): ${input.title}`,
    input.by
  );
  if (input.assignee) {
    pushEvidence(row, "assign", `Assigned to ${input.assignee}`, input.by);
  }
  const all = load();
  all.push(row);
  save(all);
  return row;
}

export function listTollExceptions(opts?: {
  status?: TollExceptionStatus;
  limit?: number;
}): TollExceptionRecord[] {
  let rows = load().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (opts?.status) {
    rows = rows.filter((r) => r.status === opts.status);
  }
  const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 200);
  return rows.slice(0, limit);
}

export function getTollException(id: string): TollExceptionRecord | null {
  return load().find((r) => r.id === id) ?? null;
}

export function updateTollException(
  id: string,
  patch: {
    status?: TollExceptionStatus;
    severity?: TollExceptionSeverity;
    assignee?: string | null;
    dueAt?: string | null;
    note?: string;
    by?: string;
  }
): TollExceptionRecord | null {
  const all = load();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const row = { ...all[idx], evidence: [...all[idx].evidence] };

  if (row.status === "closed") {
    return null;
  }

  if (patch.severity !== undefined && patch.severity !== row.severity) {
    pushEvidence(
      row,
      "update",
      `Severity ${row.severity} → ${patch.severity}`,
      patch.by
    );
    row.severity = patch.severity;
  }

  if (patch.assignee !== undefined) {
    const next = patch.assignee === null ? undefined : patch.assignee;
    if (next !== row.assignee) {
      pushEvidence(
        row,
        "assign",
        next ? `Assigned to ${next}` : "Unassigned",
        patch.by
      );
      row.assignee = next;
    }
  }

  if (patch.dueAt !== undefined) {
    row.dueAt = patch.dueAt === null ? undefined : patch.dueAt;
    pushEvidence(
      row,
      "update",
      row.dueAt ? `SLA dueAt set to ${row.dueAt}` : "SLA dueAt cleared",
      patch.by
    );
  }

  if (patch.status !== undefined && patch.status !== row.status) {
    if (patch.status === "resolved") {
      return null;
    }
    const kind: TollExceptionEvidenceKind =
      patch.status === "escalated"
        ? "escalate"
        : patch.status === "closed"
          ? "close"
          : "update";
    pushEvidence(
      row,
      kind,
      `Status ${row.status} → ${patch.status}`,
      patch.by
    );
    row.status = patch.status;
    if (patch.status === "closed") {
      row.resolvedAt = row.resolvedAt ?? new Date().toISOString();
    }
  }

  if (patch.note) {
    pushEvidence(row, "note", patch.note, patch.by);
  }

  row.updatedAt = new Date().toISOString();
  all[idx] = row;
  save(all);
  return row;
}

/**
 * HITL resolve — requires a human resolution note. Never auto-claims compliance.
 */
export function resolveTollException(
  id: string,
  input: {
    resolutionNote: string;
    by?: string;
    close?: boolean;
  }
): TollExceptionRecord | null {
  const all = load();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const row = { ...all[idx], evidence: [...all[idx].evidence] };
  if (row.status === "closed") return null;

  const now = new Date().toISOString();
  row.status = input.close ? "closed" : "resolved";
  row.resolvedAt = now;
  row.resolutionNote = input.resolutionNote.slice(0, 1200);
  row.updatedAt = now;
  pushEvidence(
    row,
    input.close ? "close" : "resolve",
    row.resolutionNote,
    input.by
  );
  all[idx] = row;
  save(all);
  return row;
}
