/**
 * Honest social proof: stack & venue *targets*, never implied client logos.
 */
const TARGETS = [
  { name: "Uniswap V3", note: "AMM bootstrap" },
  { name: "MQTT / Mosquitto", note: "IoT ingress" },
  { name: "Ethereum L2s", note: "settlement target" },
  { name: "Hardhat", note: "protocol testnet" },
  { name: "OpenZeppelin", note: "UUPS / ERC-20" },
] as const;

export function IntegrationTargetsStrip() {
  return (
    <section className="px-4 py-10 md:px-6" aria-label="Integration targets">
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Stack &amp; venue targets — not “Trusted by” / not client logos
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TARGETS.map((t) => (
            <li key={t.name} className="text-center">
              <span className="font-display text-sm text-white/70">{t.name}</span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider text-white/28">
                {t.note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
