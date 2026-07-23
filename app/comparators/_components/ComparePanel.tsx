"use client";

import Link from "next/link";
import { useEffect, useMemo, type ReactNode } from "react";

import { PlatformLogo } from "./PlatformLogo";
import { useComparatorPage } from "./useComparatorPage";
import {
  assetTypeForId,
  formatLiquidity,
  formatMinInvestment,
  formatTvl,
  resolveComparatorProductLink,
} from "@/lib/comparators";
import {
  compareCellHighlightClass,
  highlightNumericRow,
  parseFeesCompareValue,
} from "@/lib/comparators/compare-highlights";
import type { HubProduct } from "@/lib/comparators/compare-hub";

type ComparePanelProps = {
  open: boolean;
  products: HubProduct[];
  onClose: () => void;
};

function chainLabel(chains: string[]): string {
  if (chains.length === 0) return "—";
  if (chains.length > 2) return `${chains[0]} +${chains.length - 1}`;
  return chains.join(", ");
}

function internalFicheHref(link: string): string | null {
  return link.startsWith("/") ? link : null;
}

export function ComparePanel({ open, products, onClose }: ComparePanelProps) {
  const { messages } = useComparatorPage();
  const copy = messages.compareHub.comparePanel;
  const hub = messages.compareHub;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const apyHighlights = useMemo(
    () => highlightNumericRow(products.map((p) => p.row.apy), true),
    [products]
  );
  const minHighlights = useMemo(
    () =>
      highlightNumericRow(
        products.map((p) => p.meta.minInvestmentUsd),
        false
      ),
    [products]
  );
  const liquidityHighlights = useMemo(
    () =>
      highlightNumericRow(
        products.map((p) => p.meta.liquidityDays),
        false
      ),
    [products]
  );
  const feesHighlights = useMemo(
    () =>
      highlightNumericRow(
        products.map((p) => parseFeesCompareValue(p.meta.fees)),
        false
      ),
    [products]
  );

  if (!open || products.length === 0) return null;

  const rows: {
    key: string;
    label: string;
    render: (product: HubProduct, index: number) => ReactNode;
    highlights?: ReturnType<typeof highlightNumericRow>;
  }[] = [
    {
      key: "product",
      label: copy.rows.product,
      render: (product) => (
        <span className="font-mono text-sm text-white/80">{product.row.product}</span>
      ),
    },
    {
      key: "apy",
      label: copy.rows.apy,
      highlights: apyHighlights,
      render: (product) => (
        <span className="font-display text-lg tabular-nums text-white">
          {product.row.apy > 0 ? `${product.row.apy.toFixed(2)}%` : "—"}
        </span>
      ),
    },
    {
      key: "minInvestment",
      label: copy.rows.minInvestment,
      highlights: minHighlights,
      render: (product) => (
        <span className="font-mono text-sm tabular-nums text-white/80">
          {formatMinInvestment(product.meta.minInvestmentUsd)}
        </span>
      ),
    },
    {
      key: "liquidity",
      label: copy.rows.liquidity,
      highlights: liquidityHighlights,
      render: (product) => (
        <span className="font-mono text-sm text-white/80">
          {formatLiquidity(product.meta.liquidityDays, hub.liquidity)}
        </span>
      ),
    },
    {
      key: "fees",
      label: copy.rows.fees,
      highlights: feesHighlights,
      render: (product) => (
        <span className="font-mono text-xs text-white/70">{product.meta.fees}</span>
      ),
    },
    {
      key: "jurisdiction",
      label: copy.rows.jurisdiction,
      render: (product) => (
        <span className="font-mono text-sm text-white/80">
          {product.meta.jurisdiction ?? copy.notAvailable}
        </span>
      ),
    },
    {
      key: "accredited",
      label: copy.rows.accredited,
      render: (product) => (
        <span className="font-mono text-sm text-white/80">
          {product.meta.accreditedOnly ? copy.yes : copy.no}
        </span>
      ),
    },
    {
      key: "chain",
      label: copy.rows.chain,
      render: (product) => (
        <span className="font-mono text-xs text-white/70">
          {chainLabel(product.row.chains)}
        </span>
      ),
    },
    {
      key: "tvl",
      label: copy.rows.tvl,
      render: (product) => (
        <span className="font-mono text-sm tabular-nums text-white/80">
          {product.row.tvlUsd > 0 ? formatTvl(product.row.tvlUsd) : "—"}
        </span>
      ),
    },
    {
      key: "source",
      label: copy.rows.source,
      render: (product) => (
        <span className="font-mono text-xs text-white/70">
          {product.row.live ? hub.filters.sourceLive : hub.filters.sourceManual}
        </span>
      ),
    },
    {
      key: "risk",
      label: copy.rows.risk,
      render: (product) => (
        <span className="font-mono text-xs text-white/70">
          {messages.risk[product.riskTier]}
        </span>
      ),
    },
    {
      key: "fiche",
      label: copy.rows.fiche,
      render: (product) => {
        const fiche = internalFicheHref(product.row.link);
        if (!fiche) {
          return (
            <span className="font-mono text-xs text-white/35">{copy.notAvailable}</span>
          );
        }
        return (
          <Link
            href={fiche}
            className="font-mono text-xs text-white/55 transition hover:text-white"
            onClick={(event) => event.stopPropagation()}
          >
            {copy.viewFiche} →
          </Link>
        );
      },
    },
  ];

  return (
    <div
      className="modal-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-panel-title"
      onClick={onClose}
    >
      <div
        className="modal-sheet-panel !max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {copy.eyebrow}
            </p>
            <h2
              id="compare-panel-title"
              className="mt-2 font-display text-xl font-semibold text-white"
            >
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/45 transition hover:border-white/20 hover:text-white/70"
          >
            {copy.close}
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.rows.criterion}
                </th>
                {products.map((product) => (
                  <th
                    key={product.row.id}
                    className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-white/35 last:pr-0"
                  >
                    <div className="flex items-center gap-2">
                      <PlatformLogo
                        name={product.row.platform}
                        logo={product.row.logo}
                        size={28}
                      />
                      <div className="min-w-0 text-left">
                        <p className="font-medium normal-case text-white">
                          {product.row.platform}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] normal-case text-white/40">
                          {assetTypeForId(messages, product.comparatorId)}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-white/[0.05]">
                  <th
                    scope="row"
                    className="py-3 pr-4 align-top font-mono text-[10px] uppercase tracking-wider text-white/40"
                  >
                    {row.label}
                  </th>
                  {products.map((product, index) => {
                    const highlight = row.highlights?.[index] ?? null;
                    return (
                      <td key={product.row.id} className="py-3 pr-4 align-top last:pr-0">
                        <div
                          className={`inline-block px-2 py-1 ${compareCellHighlightClass(highlight)}`}
                        >
                          {row.render(product, index)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/[0.06] pt-5">
          {products.map((product) => {
            const href = resolveComparatorProductLink(
              product.comparatorId,
              product.row
            );
            return (
              <a
                key={product.row.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-white/45 transition hover:text-white"
              >
                {product.row.platform} — {hub.viewPlatform} →
              </a>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-[10px] leading-relaxed text-white/30">
          {hub.metaDisclaimer}
        </p>
      </div>
    </div>
  );
}
