"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  WATTS_HUB_ROUTE,
  WATTS_INVENTORY_ROUTE,
  WATTS_RESERVE_ROUTE,
  WATTS_SECONDARY_ROUTE,
} from "@/lib/watts";

const LINKS = [
  { href: WATTS_HUB_ROUTE, label: "Hub", exact: true },
  { href: WATTS_RESERVE_ROUTE, label: "Réserver" },
  { href: WATTS_INVENTORY_ROUTE, label: "Inventaire" },
  { href: WATTS_SECONDARY_ROUTE, label: "Secondaire" },
] as const;

export function WattsFlowNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Watts Reserve"
      className="flex flex-wrap items-center justify-center gap-1"
    >
      {LINKS.map((link) => {
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname === link.href || pathname?.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
              active
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/developers/docs/endpoint-watts-reserve"
        className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/30 transition hover:text-white/55"
      >
        API
      </Link>
    </nav>
  );
}
