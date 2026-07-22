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
                  <Link href="/lab" className="underline-offset-2 hover:underline">
                    Energy Lab
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
                  {" · "}
                  <a
                    href={`${REPO}/blob/main/docs/ARL-SECURITY.md`}
                    className="underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Security notes
                  </a>
                </li>
              </ul>
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
