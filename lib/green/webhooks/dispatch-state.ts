import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), ".data");
const STATE_FILE = join(DATA_DIR, "green-changelog-dispatch.json");

type State = { last_edition_dispatched: string | null };

function readState(): State {
  try {
    if (!existsSync(STATE_FILE)) return { last_edition_dispatched: null };
    return JSON.parse(readFileSync(STATE_FILE, "utf8")) as State;
  } catch {
    return { last_edition_dispatched: null };
  }
}

function writeState(state: State): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

export function shouldDispatchGreenChangelog(edition: string): boolean {
  const state = readState();
  return state.last_edition_dispatched !== edition;
}

export function markGreenChangelogDispatched(edition: string): void {
  writeState({ last_edition_dispatched: edition });
}

export function resetGreenChangelogDispatchState(): void {
  writeState({ last_edition_dispatched: null });
}
