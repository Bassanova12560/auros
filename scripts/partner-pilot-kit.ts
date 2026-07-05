/**
 * Génère le kit d'onboarding pilote partenaire (utilities, cabinets, FO).
 *
 * Usage:
 *   PARTNER_CODE=UTILITIES_FR npm run partner:pilot-kit
 *   PARTNER_CODE=UTILITIES_FR SITE_URL=https://getauros.com npm run partner:pilot-kit -- --write
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildPartnerPilotKit,
  formatPartnerPilotKitMarkdown,
} from "../lib/partners/pilot-kit";

function main() {
  const code = process.env.PARTNER_CODE?.trim();
  if (!code) {
    console.error("PARTNER_CODE required — e.g. PARTNER_CODE=UTILITIES_FR");
    process.exit(1);
  }

  const origin =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://getauros.com";

  const kit = buildPartnerPilotKit(code, origin);
  if (!kit) {
    console.error("Invalid partner code — min 2 alphanumeric characters.");
    process.exit(1);
  }

  const markdown = formatPartnerPilotKitMarkdown(kit);
  console.log(markdown);

  if (process.argv.includes("--write")) {
    const dir = join(process.cwd(), "docs", "pilots");
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `partner-${kit.partnerCode.toLowerCase()}.md`);
    writeFileSync(file, markdown, "utf8");
    console.log(`\nWritten: ${file}`);
  }
}

main();
