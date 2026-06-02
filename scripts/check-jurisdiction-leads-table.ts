import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[t.slice(0, i).trim()]) {
      process.env[t.slice(0, i).trim()] = v;
    }
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const ref = url.match(/https:\/\/([^.]+)/)?.[1];
  console.log("project_ref:", ref);

  const sb = createClient(url, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: readErr } = await sb
    .from("jurisdiction_leads")
    .select("id")
    .limit(1);

  if (readErr) {
    console.log("read:", readErr.code, readErr.message);
  } else {
    console.log("read: OK");
  }

  const { data, error } = await sb
    .from("jurisdiction_leads")
    .insert({
      kind: "guide",
      first_name: "__migration_probe__",
      email: "probe@auros.invalid",
      project_type: "other",
      jurisdictions: ["fr", "lu"],
      locale: "fr",
    })
    .select("id")
    .single();

  if (error) {
    console.log("insert:", error.code, error.message);
    process.exit(1);
  }

  console.log("insert: OK", data.id);
  await sb.from("jurisdiction_leads").delete().eq("id", data.id);
  console.log("cleanup: OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
