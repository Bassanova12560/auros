"use client";

import type { ReactNode } from "react";

const PLAIN: Record<string, string> = {
  oracle:
    "Oracles = trusted bridges from meters/sensors to the chain — they attest production so tokens aren’t minted from thin air.",
  oracles:
    "Oracles = trusted bridges from meters/sensors to the chain — they attest production so tokens aren’t minted from thin air.",
  "erc-20":
    "ERC-20 = a standard digital unit (like a spreadsheet row everyone agrees how to transfer).",
  "smart contract":
    "Smart contract = automated rules on-chain (mint, transfer, settle) that run without a back-office clerk for each step.",
  "smart contracts":
    "Smart contracts = automated on-chain rules for mint, transfer, and settlement.",
  mint: "Mint = create resource tokens only when a verified meter reports real production.",
  watt: "WATT = energy unit-of-account design (stablecoin collateralized by verified energy tokens) — not a public sale here.",
  hitl: "HITL = human-in-the-loop: paid and compliance steps still need a person.",
  ltv: "LTV = loan-to-value: how much you can borrow against deposited collateral.",
};

type PlainTermProps = {
  term: keyof typeof PLAIN | string;
  children: ReactNode;
};

/** Inline term with plain-language title tooltip for non-crypto visitors. */
export function PlainTerm({ term, children }: PlainTermProps) {
  const key = term.toLowerCase();
  const tip = PLAIN[key] ?? `${children}: see /resource-layer/faq for plain definitions.`;
  return (
    <abbr
      title={tip}
      className="cursor-help border-b border-dotted border-white/35 font-normal text-white/85 no-underline"
    >
      {children}
    </abbr>
  );
}

export function ArlGlossaryStrip() {
  const items = [
    { t: "Oracle", d: "Meters that certify production" },
    { t: "Mint", d: "Create tokens from attested kWh" },
    { t: "ERC-20", d: "Transferable digital unit" },
    { t: "WATT", d: "Energy unit of account (design)" },
    { t: "HITL", d: "Humans gate paid paths" },
  ] as const;

  return (
    <section aria-label="Plain lexicon" className="border border-white/[0.08] bg-white/[0.02] px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
        Plain lexicon · hover / long-press
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item) => (
          <li key={item.t}>
            <PlainTerm term={item.t}>
              <span className="font-display text-sm text-white">{item.t}</span>
            </PlainTerm>
            <span className="ml-2 font-mono text-[10px] text-white/35">{item.d}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
