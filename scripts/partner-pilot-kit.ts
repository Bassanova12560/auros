/**
 * Génère le kit d'onboarding pilote partenaire (utilities, cabinets, FO).
 *
 * Usage:
 *   PARTNER_CODE=UTILITIES_FR npm run partner:pilot-kit
 *   PARTNER_CODE=UTILITIES_FR CONTACT_NAME="Jean" COMPANY="Veolia" npm run partner:pilot-kit -- --email
 *   PARTNER_CODE=UTILITIES_FR npm run partner:pilot-kit -- --write
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildPartnerPilotKit,
  formatPartnerPilotKitMarkdown,
} from "../lib/partners/pilot-kit";
import {
  buildPartnerPilotOutreach,
  formatPartnerPilotOutreachEmail,
} from "../lib/partners/pilot-outreach";
import type { Locale } from "../lib/i18n";

function parseLocale(): Locale {
  const raw = process.env.LOCALE?.trim().slice(0, 2);
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

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

  const emailFlag = process.argv.includes("--email");
  const writeFlag = process.argv.includes("--write");

  if (emailFlag) {
    const outreach = buildPartnerPilotOutreach(kit, {
      contactName: process.env.CONTACT_NAME,
      companyName: process.env.COMPANY,
      locale: parseLocale(),
    });
    console.log(formatPartnerPilotOutreachEmail(outreach));
    console.log("\n--- HTML (paste in rich email client) ---\n");
    console.log(outreach.bodyHtml);
  } else {
    console.log(formatPartnerPilotKitMarkdown(kit));
  }

  if (writeFlag) {
    const dir = join(process.cwd(), "docs", "pilots");
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `partner-${kit.partnerCode.toLowerCase()}.md`);
    let content = formatPartnerPilotKitMarkdown(kit);
    const outreach = buildPartnerPilotOutreach(kit, {
      contactName: process.env.CONTACT_NAME,
      companyName: process.env.COMPANY,
      locale: parseLocale(),
    });
    content += `\n## Email pilote (brouillon)\n\n\`\`\`\n${formatPartnerPilotOutreachEmail(outreach)}\n\`\`\`\n`;
    writeFileSync(file, content, "utf8");
    console.log(`\nWritten: ${file}`);
  }
}

main();
