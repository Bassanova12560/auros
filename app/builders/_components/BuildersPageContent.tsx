"use client";

import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { MintTradeDemo } from "@/app/_components/arl/MintTradeDemo";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { getBuildersMessages } from "@/lib/i18n/pages/builders";

import { EarlyBuilderBadge } from "./EarlyBuilderBadge";

const REPO = "https://github.com/Bassanova12560/auros";

const ARCH_PRE = `Devices ──MQTT──► Mosquitto ──► iot-bridge ──► Oracle ──► protocol
                                                      ▲
Agents / dashboards ──HTTPS──► agent-api ─────────────┘
Users ──HTTPS──► Next.js (getauros.com)`;

const NODE_PRE = `git clone https://github.com/Bassanova12560/auros.git
cd auros/protocol && npm i && npm test
cd ../iot-bridge && npm i   # MQTT → Proof-of-Resource (access after approval)
cd ../agent-api && npm i && npm run dev
# Full stack (local): docker compose -f docker-compose.yml up
# Lab wallet (site): open /lab → mint → /producer wrap WATT → /trade spot`;

export function BuildersPageContent() {
  const { locale } = useLocale();
  const m = getBuildersMessages(locale);

  return (
    <ContentPageLayout
      product={m.product}
      eyebrow={m.eyebrow}
      title={m.title}
      intro={m.intro}
    >
      <div className="space-y-14 text-sm leading-relaxed text-white/65">
        <section className="flex flex-wrap gap-3">
          <PrimaryButton href="mailto:resources@getauros.com?subject=ARL%20testnet%20access">
            {m.ctaTestnet}
          </PrimaryButton>
          <PrimaryButton href={REPO} variant="ghost">
            {m.ctaRepo}
          </PrimaryButton>
          <PrimaryButton href="/lab" variant="ghost">
            {m.ctaLab}
          </PrimaryButton>
          <PrimaryButton href="/trade" variant="ghost">
            {m.ctaTrade}
          </PrimaryButton>
          <PrimaryButton href="/status" variant="ghost">
            {m.ctaStatus}
          </PrimaryButton>
        </section>

        <section className="space-y-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-4">
          <h2 className="font-display text-xl text-white">{m.demoTitle}</h2>
          <p>{m.demoIntro}</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-white/60">
            <li>
              <Link href="/lab" className="underline-offset-2 hover:underline">
                /lab
              </Link>{" "}
              {m.demoLab}
            </li>
            <li>
              <Link href="/producer" className="underline-offset-2 hover:underline">
                /producer
              </Link>{" "}
              {m.demoProducer}
            </li>
            <li>
              <Link
                href="/trade?market=kwh-france"
                className="underline-offset-2 hover:underline"
              >
                /trade
              </Link>{" "}
              {m.demoTradeBefore}{" "}
              <Link href="/agent" className="underline-offset-2 hover:underline">
                /agent
              </Link>{" "}
              {m.demoTradeOr}
            </li>
          </ol>
          <p className="font-mono text-[10px] text-white/35">
            {m.demoLiveChecks}{" "}
            <Link href="/status" className="underline-offset-2 hover:underline">
              /status
            </Link>
            {" · "}
            {m.demoCaps}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-white">{m.motionTitle}</h2>
          <p>{m.motionBody}</p>
          <MintTradeDemo />
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-white">{m.archTitle}</h2>
          <p>{m.archBody}</p>
          <ol className="space-y-0 border border-white/[0.08] bg-white/[0.02] font-mono text-[11px] leading-relaxed text-white/70">
            {m.stack.map((row, i) => (
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
            {ARCH_PRE}
          </pre>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.sourceTitle}</h2>
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {m.securityEyebrow}
            </p>
            <p className="mt-1 text-white/70">
              {m.securityBodyBefore}{" "}
              <strong className="font-medium text-white/90">{m.securityStrong}</strong>{" "}
              {m.securityBodyAfter}{" "}
              <a
                href={`${REPO}/blob/main/docs/ARL-SECURITY.md`}
                className="underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {m.securityRead}
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
              <span className="text-white/40"> {m.repoNote}</span>
            </li>
            <li>
              <Link href="/resource-layer" className="underline-offset-2 hover:underline">
                {m.linkVision}
              </Link>
              {" · "}
              <Link href="/watt" className="underline-offset-2 hover:underline">
                {m.linkWatt}
              </Link>
              {" · "}
              <Link href="/lab" className="underline-offset-2 hover:underline">
                {m.linkLab}
              </Link>
              {" · "}
              <Link href="/status" className="underline-offset-2 hover:underline">
                {m.linkStatus}
              </Link>
              {" · "}
              <a
                href={`${REPO}/blob/main/docs/WHITEPAPER.md`}
                className="underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {m.linkWhitepaper}
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.nodeTitle}</h2>
          <p>{m.nodeIntro}</p>
          <pre className="overflow-x-auto border border-white/[0.08] bg-black/40 p-4 font-mono text-[10px] leading-5 text-white/55">
            {NODE_PRE}
          </pre>
          <p className="font-mono text-[10px] text-white/35">{m.nodeAccessNote}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.economyTitle}</h2>
          <p>{m.economyBody}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-white">{m.badgeSectionTitle}</h2>
          <EarlyBuilderBadge />
        </section>

        <section className="space-y-3 border-t border-white/10 pt-8">
          <h2 className="font-display text-xl text-white">{m.accessTitle}</h2>
          <p>{m.accessBody}</p>
          <PrimaryButton href="mailto:resources@getauros.com?subject=ARL%20testnet%20access&body=Name%3A%0AOrg%3A%0ARole%3A%0ANeed%3A%20(MQTT%20%2F%20API%20%2F%20Hardhat)%0A">
            {m.accessCta}
          </PrimaryButton>
          <p className="font-mono text-[10px] text-white/35">{m.accessFooter}</p>
        </section>
      </div>
    </ContentPageLayout>
  );
}
