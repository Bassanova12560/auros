import type { NextLink } from "@/app/_components/NextStepStrip";

/**
 * Central neighbor presets — one story per door, no button farms.
 */
export const ECOSYSTEM = {
  afterLab: {
    primary: { href: "/producer", label: "Next · Wrap on Producer" },
    secondary: [{ href: "/resource-layer", label: "Vision", hint: "why ARL" }],
    neighbors: [
      { href: "/watt", label: "WATT" },
      { href: "/builders", label: "Builders" },
      { href: "/trade", label: "Trade" },
    ],
  },
  afterProducer: {
    primary: { href: "/trade?market=kwh-france&side=sell", label: "Next · Sell on Trade" },
    secondary: [{ href: "/watt", label: "WATT unit" }],
    neighbors: [
      { href: "/lab", label: "Lab" },
      { href: "/earn", label: "Earn" },
      { href: "/market", label: "Market" },
    ],
  },
  afterTrade: {
    primary: { href: "/agent", label: "Optional · Agent hedge" },
    secondary: [{ href: "/earn", label: "Earn preview" }],
    neighbors: [
      { href: "/market", label: "Market" },
      { href: "/builders", label: "Builders" },
      { href: "/status", label: "Status" },
    ],
  },
  afterAgent: {
    primary: { href: "/trade", label: "Back to Trade" },
    secondary: [{ href: "/builders", label: "Agent API path" }],
    neighbors: [
      { href: "/producer", label: "Producer" },
      { href: "/market", label: "Market" },
      { href: "/investors", label: "Investors" },
    ],
  },
  company: {
    primary: { href: "/lab", label: "Run the lab loop" },
    secondary: [{ href: "mailto:resources@getauros.com?subject=AUROS%20diligence", label: "Talk to us" }],
    neighbors: [
      { href: "/investors", label: "Investors" },
      { href: "/press", label: "Press" },
      { href: "/careers", label: "Careers" },
      { href: "/status", label: "Status" },
      { href: "/why", label: "Why" },
    ],
  },
  vision: {
    primary: { href: "/lab", label: "Open Energy Lab" },
    secondary: [{ href: "/builders", label: "Builders" }],
    neighbors: [
      { href: "/why", label: "Why" },
      { href: "/watt", label: "WATT" },
      { href: "/investors", label: "Investors" },
    ],
  },
} as const satisfies Record<
  string,
  { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] }
>;
