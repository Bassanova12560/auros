import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { dueReminderKind } from "../lib/academy/reminder-schedule";

const MS_DAY = 86_400_000;

function expiresInDays(days: number): string {
  return new Date(Date.now() + days * MS_DAY).toISOString();
}

describe("academy/reminder-schedule", () => {
  it("returns j14 when 10 days left and not sent", () => {
    assert.equal(
      dueReminderKind(expiresInDays(10), Date.now(), { j14: false, j3: false }),
      "j14"
    );
  });

  it("returns j3 when 2 days left and not sent", () => {
    assert.equal(
      dueReminderKind(expiresInDays(2), Date.now(), { j14: true, j3: false }),
      "j3"
    );
  });

  it("returns null when expired", () => {
    assert.equal(
      dueReminderKind(new Date(Date.now() - MS_DAY).toISOString(), Date.now(), {
        j14: false,
        j3: false,
      }),
      null
    );
  });

  it("returns null when already sent", () => {
    assert.equal(
      dueReminderKind(expiresInDays(10), Date.now(), { j14: true, j3: false }),
      null
    );
  });

  it("prefers j3 over j14 when both windows overlap logic", () => {
    assert.equal(
      dueReminderKind(expiresInDays(2), Date.now(), { j14: false, j3: false }),
      "j3"
    );
  });
});
