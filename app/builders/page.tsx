import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { MintTradeDemo } from "@/app/_components/arl/MintTradeDemo";

import { EarlyBuilderBadge } from "./_components/EarlyBuilderBadge";

export const metadata: Metadata = {
  title: "Builders — Auros Resource Layer | AUROS",
  description:
    "Architecture, animated mint→trade demo, protocol surface, and testnet access for Auros Resource Layer builders.",
};

const REPO = "https://github.com/Bassanova12560/auros";

const STACK = [
  {
    layer: "Devices",
    items: "Meters · inverters · OEM firmware",
  },
  {
    layer: "IoT bridge",
    items: "MQTT → ECDSA Proof-of-Resource → oracle mint",
  },
  {
    layer: "Protocol",
    items: "ResourceToken · Oracle · EnergyFutures · Options · Lending · Insurance",
  },
  {
    layer: "Agent API",
    items: "Spot / forward / perps / options · rate-limited · operator-keyed",
  },
  {
    layer: "Surfaces",
    items: "/trade · /producer · /agent · /market · /lab (demos labeled)",
  },
] as const;

export default function BuildersPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/builders" />
      <FocusPageShell path="/builders" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Builders"
          title="Explore the protocol"
          intro="Architecture, motion proof, source, and early access — for engineers who need substance before a pitch deck."
        >
          <div className="space-y-14 text-sm leading-relaxed text-white/65">
            <section className="flex flex-wrap gap-3">
              <PrimaryButton href="mailto:resources@getauros.com?subject=ARL%20testnet%20access">
                Request testnet access
              </PrimaryButton>
              <PrimaryButton href={REPO} variant="ghost">
                Open repository
              </PrimaryButton>
              <PrimaryButton href="/lab" variant="ghost">
                Energy Lab
              </PrimaryButton>
              <PrimaryButton href="/trade" variant="ghost">
                Open trade terminal
              </PrimaryButton>
              <PrimaryButton href="/status" variant="ghost">
                System status
              </PrimaryButton>
            </section>

            <section className="space-y-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-4">
              <h2 className="font-display text-xl text-white">5-minute site demo</h2>
              <p>
                No clone required. Run the labeled loop on getauros.com — same lab ledger across
                pages.
              </p>
              <ol className="list-decimal space-y-1.5 pl-5 text-white/60">
                <li>
                  <Link href="/lab" className="underline-offset-2 hover:underline">
                    /lab
                  </Link>{" "}
                  — mint akWh into your browser lab wallet
                </li>
                <li>
                  <Link href="/producer" className="underline-offset-2 hover:underline">
                    /producer
                  </Link>{" "}
                  — wrap akWh → WATT 1:1
                </li>
                <li>
                  <Link href="/trade?market=kwh-france" className="underline-offset-2 hover:underline">
                    /trade
                  </Link>{" "}
                  — settle spot (or{" "}
                  <Link href="/agent" className="underline-offset-2 hover:underline">
                    /agent
                  </Link>{" "}
                  for a lab hedge buy)
                </li>
              </ol>
              <p className="font-mono text-[10px] text-white/35">
                Live checks:{" "}
                <Link href="/status" className="underline-offset-2 hover:underline">
                  /status
                </Link>
                {" · "}
                caps &amp; HITL on paid paths
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Product in motion</h2>
              <p>
                No staged partnership video — a live loop of the path your code will implement:
                meter → mint → agent order → labeled fill.
              </p>
              <MintTradeDemo />
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Architecture</h2>
              <p>
                One path from meter to market. Settlement and paid paths stay human-gated;
                demos never wear Verified badges.
              </p>
              <ol className="space-y-0 border border-white/[0.08] bg-white/[0.02] font-mono text-[11px] leading-relaxed text-white/70">
                {STACK.map((row, i) => (
                  <li
                    key={row.layer}
                    className="grid gap-1 border-b border-white/[0.06] px-4 py-3 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-4"
                  >
                    <span className="text-white/35">
                      {String(i + 1).padStart(2, "0")} · {row.layer}
                    </span>
                    <span className="text-white/75">{row.items}</span>
                  </li>
                ))}
              </ol>
              <pre className="overflow-x-auto border border-white/[0.08] bg-black/40 p-4 font-mono text-[10px] leading-5 text-white/50">
{`Devices ──MQTT──► Mosquitto ──► iot-bridge ──► Oracle ──► protocol
                                                      ▲
Agents / dashboards ──HTTPS──► agent-api ─────────────┘
Users ──HTTPS──► Next.js (getauros.com)`}
              </pre>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Read the source</h2>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Security posture
                </p>
                <p className="mt-1 text-white/70">
                  Hardhat suites + caps/circuit-breakers shipped in-repo.{" "}
                  <strong className="font-medium text-white/90">No third-party audit badge claimed</strong>{" "}
                  — external audit is on the roadmap before mainnet collateral. Read{" "}
                  <a
                    href={`${REPO}/blob/main/docs/ARL-SECURITY.md`}
                    className="underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ARL-SECURITY.md
                  </a>
                  .
                </p>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href={REPO}
                    className="text-white/85 underline-offset-2 hover:text-white hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    github.com/Bassanova12560/auros
                  </a>
                  <span className="text-white/40">
                    {" "}
                    — monorepo (protocol / agent-api / iot-bridge / app)
                  </span>
                </li>
                <li>
                  <Link href="/resource-layer" className="underline-offset-2 hover:underline">
                    Vision
                  </Link>
                  {" · "}
                  <Link href="/watt" className="underline-offset-2 hover:underline">
                    WATT
                  </Link>
                  {" · "}
                  <Link href="/lab" className="underline-offset-2 hover:underline">
                    Energy Lab
                  </Link>
                  {" · "}
                  <Link href="/status" className="underline-offset-2 hover:underline">
                    Status
                  </Link>
                  {" · "}
                  <a
                    href={`${REPO}/blob/main/docs/WHITEPAPER.md`}
                    className="underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Whitepaper
                  </a>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Run a Resource Node (preview)</h2>
              <p>
                Commands below match the public monorepo layout. MQTT credentials and production
                keys ship after testnet approval (HITL).
              </p>
              <pre className="overflow-x-auto border border-white/[0.08] bg-black/40 p-4 font-mono text-[10px] leading-5 text-white/55">
{`git clone https://github.com/Bassanova12560/auros.git
cd auros/protocol && npm i && npm test
cd ../iot-bridge && npm i   # MQTT → Proof-of-Resource (access after approval)
cd ../agent-api && npm i && npm run dev
# Full stack (local): docker compose -f docker-compose.yml up
# Lab wallet (site): open /lab → mint → /producer wrap WATT → /trade spot`}
              </pre>
              <p className="font-mono text-[10px] text-white/35">
                Access granted after testnet approval · no silent mainnet keys
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Machine economy — concrete</h2>
              <p>
                Imagine an EV or a rack of GPUs buying kWh automatically overnight via the agent API:
                forecast load → forward order → oracle-backed settlement when meters clear —
                humans still approve paid and compliance-sensitive steps.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Early Builder badge</h2>
              <EarlyBuilderBadge />
            </section>

            <section className="space-y-3 border-t border-white/10 pt-8">
              <h2 className="font-display text-xl text-white">Request access</h2>
              <p>
                Tell us who you are (producer, OEM, agent builder, researcher), which stack you
                already run, and whether you need MQTT credentials, a Hardhat fork, or API keys.
              </p>
              <PrimaryButton href="mailto:resources@getauros.com?subject=ARL%20testnet%20access&body=Name%3A%0AOrg%3A%0ARole%3A%0ANeed%3A%20(MQTT%20%2F%20API%20%2F%20Hardhat)%0A">
                Apply for testnet access
              </PrimaryButton>
              <p className="font-mono text-[10px] text-white/35">
                resources@getauros.com · HITL review · no fake volume
              </p>
            </section>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
