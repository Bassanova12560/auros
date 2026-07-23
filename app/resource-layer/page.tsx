import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ArlGlossaryStrip } from "@/app/_components/arl/PlainTerm";
import { MintTradeDemo } from "@/app/_components/arl/MintTradeDemo";

import { ResourceLayerLab } from "./_components/ResourceLayerLab";

export const metadata = {
  title: "Auros Resource Layer | The Liquidity Engine for the Tokenized World",
  description:
    "Institutional market making for tokenized energy, water, carbon — and the machine economy. Powered by WATT.",
};

const JOURNEY = [
  {
    n: "01",
    title: "Produce",
    body: "Solar farm / meter attests kWh. Lab wallet credits akWh.",
    href: "/lab",
  },
  {
    n: "02",
    title: "Convert",
    body: "Wrap akWh → WATT 1:1 (energy unit of account for machines).",
    href: "/watt",
  },
  {
    n: "03",
    title: "Trade",
    body: "Spot settles on the shared ledger; agents hedge load with HITL.",
    href: "/trade",
  },
] as const;

const PILLARS = [
  {
    title: "Tokenize Any Resource",
    body: "Turn physical units (kWh, litres, carbon) into digital units you can transfer — via IoT Proof-of-Resource minting (ERC-20 = standard transferable token).",
  },
  {
    title: "Instant Liquidity",
    body: "Bootstrap each new resource unit into a deep market (Uniswap V3 target) seeded by the Auros liquidity engine.",
  },
  {
    title: "Machine-Ready API",
    body: "AI agents, robots, and data centers place spot and forward orders over a signed agent API — settlement stays on-chain; paid paths stay human-gated.",
  },
] as const;

const ROADMAP = [
  {
    phase: "Phase 1",
    when: "Q3 2026",
    title: "Testnet & demos",
    body: "Protocol suite, agent API, IoT bridge, labeled UIs (/trade, /producer, /lab).",
  },
  {
    phase: "Phase 2",
    when: "H2 2026",
    title: "Mainnet beta pilots",
    body: "Geography-bound HITL pilots with metered producers — no fake volume badges.",
  },
  {
    phase: "Phase 3",
    when: "2027+",
    title: "WATT launch window",
    body: "Energy unit-of-account design exits preview when collateral + counsel clear — not a public sale today.",
  },
] as const;

const COMPARE = [
  {
    axis: "Who can create supply",
    classic: "Utility / offtaker paperwork",
    otherRwa: "Often issuer-minted claims",
    auros: "Only attested meters / oracles",
  },
  {
    axis: "Buyer interface",
    classic: "Phone + spreadsheet",
    otherRwa: "Wallet + generic DEX",
    auros: "Agent API + human dashboards",
  },
  {
    axis: "Honesty of depth",
    classic: "Opaque OTC",
    otherRwa: "Sometimes marketing TVL",
    auros: "Lab metrics labeled; caps on risk",
  },
] as const;

const FOR_YOU = [
  {
    who: "Solar / energy producer",
    plain:
      "You connect a verified meter. When you produce electricity, the system can mint tokens that represent those kWh. You sell them on the Auros market instead of waiting for opaque OTC quotes.",
    jargon: "tokenization · oracle · mint",
  },
  {
    who: "Data center or AI operator",
    plain:
      "You forecast tomorrow’s load, then lock energy ahead of time through the agent API — like a forward purchase order, settled in energy units.",
    jargon: "forward order · hedge · agent API",
  },
  {
    who: "IoT / OEM manufacturer",
    plain:
      "Your devices sign production readings. Auros registers them so only trusted hardware can create resource tokens.",
    jargon: "DeviceRegistry · Proof-of-Resource",
  },
] as const;

export default function ResourceLayerPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/resource-layer" />
      <FocusPageShell path="/resource-layer" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Auros Resource Layer"
          title="The Liquidity Engine for the Tokenized World"
          intro="Auros expands its institutional market making to tokenized physical resources: energy (kWh), water, carbon, and beyond."
        >
          <div className="space-y-14 text-sm leading-relaxed text-white/65">
            <section className="flex flex-wrap gap-3">
              <PrimaryButton href="/builders">Explore the protocol</PrimaryButton>
              <PrimaryButton href="/lab" variant="ghost">
                Energy Lab
              </PrimaryButton>
              <PrimaryButton href="/watt" variant="ghost">
                WATT
              </PrimaryButton>
              <PrimaryButton
                href="mailto:resources@getauros.com?subject=ARL%20testnet%20access"
                variant="ghost"
              >
                Apply for testnet access
              </PrimaryButton>
            </section>

            <ArlGlossaryStrip />

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">From meter to market</h2>
              <p className="text-white/55">
                Three steps — no brochure fog. Same lab wallet across Lab, Producer, and Trade.
              </p>
              <ol className="grid gap-4 md:grid-cols-3">
                {JOURNEY.map((step) => (
                  <li key={step.n} className="border border-white/[0.08] bg-white/[0.02] px-4 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                      {step.n}
                    </p>
                    <h3 className="mt-2 font-display text-base text-white">{step.title}</h3>
                    <p className="mt-2 text-white/55">{step.body}</p>
                    <Link
                      href={step.href}
                      className="mt-3 inline-block font-mono text-[10px] uppercase tracking-wider text-white/50 underline-offset-2 hover:text-white hover:underline"
                    >
                      Open →
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Product in motion</h2>
              <p className="text-white/55">
                Animated lab loop — meter signs → mint → agent order → labeled fill. Not a staged
                partnership video.
              </p>
              <MintTradeDemo />
            </section>

            <ResourceLayerLab />

            <section id="watt" className="scroll-mt-28 space-y-3 border border-white/[0.08] bg-white/[0.02] px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Unit of account · WATT
              </p>
              <h2 className="font-display text-xl text-white">WATT — energy as money for machines</h2>
              <p>
                <strong className="font-medium text-white/90">WATT</strong> is the energy stablecoin
                design at the center of ARL monetization: collateralized by verified energy resource
                tokens (1:1 MVP intent). Machines whose “survival cost” is electricity need a unit
                that settles in power — not only USD stables.
              </p>
              <p className="text-white/50">
                Status: protocol + docs preview. Not a public token offering on this site. Speculative
                targets live in the whitepaper; pilots remain HITL.
              </p>
              <div className="flex flex-wrap gap-4 font-mono text-[11px]">
                <Link
                  href="/watt"
                  className="text-white/60 underline-offset-2 hover:text-white hover:underline"
                >
                  Full WATT page →
                </Link>
                <Link
                  href="/resource-layer/faq#watt"
                  className="text-white/60 underline-offset-2 hover:text-white hover:underline"
                >
                  FAQ · WATT →
                </Link>
                <Link
                  href="/lab"
                  className="text-white/60 underline-offset-2 hover:text-white hover:underline"
                >
                  Simulate kWh revenue →
                </Link>
              </div>
            </section>

            <section id="roadmap" className="scroll-mt-28 space-y-5">
              <div>
                <h2 className="font-display text-xl text-white">Roadmap</h2>
                <p className="mt-2 text-white/55">
                  Indicative timeline — ships move with pilots and counsel, not slideware dates alone.
                </p>
              </div>
              <ol className="grid gap-4 md:grid-cols-3">
                {ROADMAP.map((r) => (
                  <li key={r.phase} className="border-t border-white/15 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                      {r.phase} · {r.when}
                    </p>
                    <h3 className="mt-2 font-display text-base text-white">{r.title}</h3>
                    <p className="mt-2">{r.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Manifesto</h2>
              <p>
                We are building the settlement layer for the machine economy. AI
                agents, robots, and autonomous devices will trade resources
                on-chain with deep liquidity provided by Auros.
              </p>
              <p>
                Concrete picture: your EV — or a GPU rack — buys kWh automatically
                overnight through the agent API while you sleep. Forecast →
                forward order → meter-backed settlement. Humans still gate paid
                and compliance-sensitive steps.
              </p>
            </section>

            <section className="grid gap-8 md:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.title} className="space-y-2 border-t border-white/10 pt-4">
                  <h3 className="font-display text-base text-white">{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Why Auros</h2>
              <p className="text-white/55">
                Decision-makers compare. Here is the honest frame — not a claim that we already
                displaced incumbents.
              </p>
              <div className="overflow-x-auto border border-white/[0.08]">
                <table className="w-full min-w-[36rem] text-left text-xs">
                  <thead className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                    <tr className="border-b border-white/[0.08]">
                      <th className="px-3 py-3 font-normal">Axis</th>
                      <th className="px-3 py-3 font-normal">Classic energy trade</th>
                      <th className="px-3 py-3 font-normal">Generic RWA</th>
                      <th className="px-3 py-3 font-normal text-white/70">Auros ARL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE.map((row) => (
                      <tr key={row.axis} className="border-b border-white/[0.06] text-white/60">
                        <td className="px-3 py-3 font-display text-white/85">{row.axis}</td>
                        <td className="px-3 py-3">{row.classic}</td>
                        <td className="px-3 py-3">{row.otherRwa}</td>
                        <td className="px-3 py-3 text-white/80">{row.auros}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="get-started" className="space-y-4 scroll-mt-28">
              <h2 className="font-display text-xl text-white">Get started</h2>
              <p>
                Don’t leave with a brochure. Run the Energy Lab, mint a demo unit, or
                apply for testnet access — human review on every paid path.
              </p>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/why">Why Auros</PrimaryButton>
                <PrimaryButton href="/lab">1 · Produire (Lab)</PrimaryButton>
                <PrimaryButton href="/producer" variant="ghost">
                  2 · Convertir (WATT)
                </PrimaryButton>
                <PrimaryButton href="/trade" variant="ghost">
                  3 · Vendre (Trade)
                </PrimaryButton>
                <PrimaryButton href="/builders" variant="ghost">
                  Protocol
                </PrimaryButton>
                <a
                  href="mailto:resources@getauros.com?subject=ARL%20testnet%20access"
                  className="inline-flex items-center font-mono text-[11px] text-white/50 underline-offset-4 hover:text-white hover:underline"
                >
                  Apply for testnet access →
                </a>
              </div>
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="font-display text-xl text-white">
                  What does this mean for you?
                </h2>
                <p className="mt-2">
                  Plain language for operators who don’t live in crypto jargon.
                </p>
              </div>
              <ul className="space-y-6">
                {FOR_YOU.map((row) => (
                  <li key={row.who} className="border-t border-white/10 pt-4">
                    <h3 className="font-display text-base text-white">{row.who}</h3>
                    <p className="mt-2">{row.plain}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-white/30">
                      {row.jargon}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/resource-layer/faq"
                className="inline-block font-mono text-[11px] text-white/45 underline-offset-2 hover:text-white hover:underline"
              >
                Full FAQ & lexicon →
              </Link>
            </section>

            <section className="space-y-3 border-t border-white/10 pt-8">
              <h2 className="font-display text-xl text-white">Team & hiring</h2>
              <p>
                The Resource Layer is not a side project — we are staffing
                markets and IoT integration now.
              </p>
              <PrimaryButton href="/careers" variant="ghost">
                View open roles
              </PrimaryButton>
            </section>

            <section className="border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-white/80">
                Collaborators welcome: energy producers, IoT hardware makers,
                blockchain developers.
              </p>
              <a
                href="mailto:resources@getauros.com"
                className="mt-2 inline-block font-mono text-xs text-white/50 underline-offset-4 hover:text-white hover:underline"
              >
                resources@getauros.com
              </a>
            </section>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
