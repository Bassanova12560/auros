import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  COPILOT_MAX_SESSION_TURNS,
  COPILOT_MEMORY_CONSENT_KEY,
  COPILOT_TURNS_STORAGE_KEY,
  clearCopilotSessionMemory,
  hasCopilotMemoryConsent,
  loadCopilotTurns,
  parseCopilotTurns,
  saveCopilotTurns,
  serializeCopilotTurns,
  setCopilotMemoryConsent,
} from "@/lib/copilot/session-memory";
import { COPILOT_GREEN_BRIEF_STORAGE_KEY } from "@/lib/copilot/types";

function mockSessionStorage() {
  const store = new Map<string, string>();
  const api = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
  Object.defineProperty(globalThis, "sessionStorage", {
    value: api,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "window", {
    value: globalThis,
    configurable: true,
    writable: true,
  });
  return store;
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "sessionStorage");
  Reflect.deleteProperty(globalThis, "window");
});

describe("copilot session memory (pure)", () => {
  it("serializes and clamps to max turns", () => {
    const turns = Array.from({ length: COPILOT_MAX_SESSION_TURNS + 5 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `m${i}`,
    }));
    const parsed = parseCopilotTurns(serializeCopilotTurns(turns));
    assert.equal(parsed.length, COPILOT_MAX_SESSION_TURNS);
    assert.equal(parsed[0]?.content, `m${5}`);
    assert.equal(parsed.at(-1)?.content, `m${COPILOT_MAX_SESSION_TURNS + 4}`);
  });

  it("parseCopilotTurns ignores invalid payloads", () => {
    assert.deepEqual(parseCopilotTurns(null), []);
    assert.deepEqual(parseCopilotTurns("not-json"), []);
    assert.deepEqual(parseCopilotTurns("{}"), []);
    assert.deepEqual(
      parseCopilotTurns(
        JSON.stringify([
          { role: "user", content: "ok" },
          { role: "system", content: "nope" },
          { role: "assistant" },
        ])
      ),
      [{ role: "user", content: "ok" }]
    );
  });
});

describe("copilot session memory (sessionStorage)", () => {
  it("gates save/load on consent and clears briefs + turns", () => {
    const store = mockSessionStorage();

    assert.equal(hasCopilotMemoryConsent(), false);
    saveCopilotTurns([{ role: "user", content: "hi" }]);
    assert.equal(store.has(COPILOT_TURNS_STORAGE_KEY), false);
    assert.deepEqual(loadCopilotTurns(), []);

    setCopilotMemoryConsent(true);
    assert.equal(hasCopilotMemoryConsent(), true);
    assert.equal(store.get(COPILOT_MEMORY_CONSENT_KEY), "1");

    saveCopilotTurns([
      { role: "user", content: "a" },
      { role: "assistant", content: "b" },
    ]);
    store.set(
      COPILOT_GREEN_BRIEF_STORAGE_KEY,
      JSON.stringify({ role: "issuer", asset: "solar", region: "FR" })
    );

    assert.deepEqual(loadCopilotTurns(), [
      { role: "user", content: "a" },
      { role: "assistant", content: "b" },
    ]);

    clearCopilotSessionMemory();
    assert.equal(store.has(COPILOT_TURNS_STORAGE_KEY), false);
    assert.equal(store.has(COPILOT_GREEN_BRIEF_STORAGE_KEY), false);
    assert.equal(hasCopilotMemoryConsent(), true);

    setCopilotMemoryConsent(false);
    assert.equal(hasCopilotMemoryConsent(), false);
  });
});
