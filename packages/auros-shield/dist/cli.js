#!/usr/bin/env node
import {
  startShieldServer
} from "./chunk-OERHKOKF.js";
import {
  SHIELD_VERSION,
  buildCbom,
  importPortfolioAirgapPack,
  sealLocal,
  tapLocal,
  verifyLocal
} from "./chunk-5FUSY5DM.js";

// src/cli.ts
import { readFileSync } from "fs";
function usage() {
  console.log(`AUROS Shield ${SHIELD_VERSION}

Usage:
  auros-shield init
  auros-shield cbom
  auros-shield tap (--hash <hex> | --file <path>)
  auros-shield seal --kind <attest|cfu_e|cfu_w|cfu_f|audit> (--hash <hex> | --file <path>)
  auros-shield verify --kind <\u2026> --hash <hex> --sig <hex>
  auros-shield airgap-import --file <pack.json>
  auros-shield serve [--port 8787]

Env:
  AUROS_SHIELD_SIGNING_KEY   customer-held HMAC secret (HSM/KMS inject)
  AUROS_SHIELD_PQC_MODE=ready  mark hybrid profile as pending PQC key
`);
  process.exit(1);
}
var args = process.argv.slice(2);
var cmd = args[0];
function flag(name) {
  const i = args.indexOf(name);
  if (i === -1) return void 0;
  return args[i + 1];
}
if (!cmd || cmd === "-h" || cmd === "--help") usage();
if (cmd === "cbom") {
  console.log(JSON.stringify(buildCbom("on_prem"), null, 2));
  process.exit(0);
}
if (cmd === "init") {
  console.log(`# AUROS Shield \u2014 copy/paste

# Portfolio air-gap pack (offline verify)
# curl -OJ "https://getauros.com/api/v1/green/portfolio/airgap?download=1" \\
#   -H "Authorization: Bearer $AUROS_API_KEY"
# npx auros-shield airgap-import --file ./auros-portfolio-airgap-\u2026.json

# Docs: https://getauros.com/developers/shield
`);
  process.exit(0);
}
if (cmd === "tap") {
  const hash = flag("--hash");
  const file = flag("--file");
  let payload;
  if (file) payload = readFileSync(file, "utf8");
  const result = tapLocal({
    body: payload,
    content_hash: hash,
    profile: flag("--profile")
  });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
if (cmd === "seal") {
  const kind = flag("--kind") ?? "audit";
  const hash = flag("--hash");
  const file = flag("--file");
  const profile = flag("--profile");
  let payload;
  const content_hash = hash;
  if (file) {
    payload = readFileSync(file, "utf8");
  }
  const seal = sealLocal({
    kind,
    payload,
    content_hash,
    profile,
    tenant_ref: flag("--tenant")
  });
  console.log(JSON.stringify(seal, null, 2));
  process.exit(0);
}
if (cmd === "verify") {
  const kind = flag("--kind") ?? "audit";
  const hash = flag("--hash");
  const sig = flag("--sig");
  if (!hash || !sig) usage();
  const result = verifyLocal({ kind, content_hash: hash, signature: sig });
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.valid ? 0 : 2);
}
if (cmd === "airgap-import") {
  const file = flag("--file");
  if (!file) usage();
  const raw = readFileSync(file, "utf8");
  const result = importPortfolioAirgapPack(raw);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 2);
}
if (cmd === "serve") {
  const port = Number(flag("--port") ?? process.env.PORT ?? 8787);
  startShieldServer(port);
} else {
  usage();
}
