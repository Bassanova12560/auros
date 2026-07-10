import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function collectTests(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      files.push(...collectTests(path));
      continue;
    }
    if (entry.endsWith(".test.ts")) files.push(path);
  }
  return files;
}

const tests = collectTests("tests");
if (tests.length === 0) {
  console.error("No test files found under tests/");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", ...tests],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
