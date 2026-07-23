"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Eyebrow } from "@/app/_components/ui/Eyebrow";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { PlatformLogo } from "./PlatformLogo";
import { ProductMetaBadges } from "./ProductMetaBadges";
import { ProductRowLink } from "./ProductRowLink";
import { ComparePanel } from "./ComparePanel";
import { CompareAiAssist } from "./CompareAiAssist";
import { CompareSelectCheckbox } from "./CompareSelectCheckbox";
import { CompareSelectionBar } from "./CompareSelectionBar";
import { RiskBadge } from "./RiskBadge";
import { useCompareSelection } from "./useCompareSelection";
import { useComparatorPage } from "./useComparatorPage";
import {
  assetTypeForId,
  DOSSIER_CTA,
  formatComparatorDate,
  formatLiquidity,
  formatMinInvestment,
  matchesMinInvestmentFilter,
  productDedupeKey,
  resolveComparatorProductLink,
} from "@/lib/comparators";
import type { CompareHubPayload, HubProduct } from "@/lib/comparators/compare-hub";
import type { ComparatorMessages } from "@/lib/comparators/i18n";
import { RISK_TIER_ORDER, type RiskTier } from "@/lib/comparators/risk";
import { track } from "@/lib/analytics";

type CompareHubContentProps = {
  payload: CompareHubPayload;
};

type MinInvestmentFilter = "all" | "under500" | "under5000";
type SortColumn = "apy" | "minInvestment" | "liquidity" | "fees";
type SortDirection = "asc" | "desc";

function parseFeesSortValue(fees: string): number {
  const matches = fees.replace(",", ".").match(/[\d.]+/g);
  if (!matches?.length) return Number.POSITIVE_INFINITY;
  const values = matches.map(Number).filter(Number.isFinite);
  if (!values.length) return Number.POSITIVE_INFINITY;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function multiProfileBadge(
  product: HubProduct,
  riskLabels: ComparatorMessages["risk"]
): string | null {
  const tiers: RiskTier[] = product.riskTiers ?? [product.riskTier];
  if (tiers.length <= 1) return null;
  const ordered = [...tiers].sort(
    (a, b) => RISK_TIER_ORDER.indexOf(a) - RISK_TIER_ORDER.indexOf(b)
  );
  return ordered.map((tier) => riskLabels[tier]).join(" · ");
}

function productRowKey(product: HubProduct): string {
  return productDedupeKey(product);
}

function assetTypesLabel(
  product: HubProduct,
  messages: ComparatorMessages
): string {
  const ids = product.comparatorIds ?? [product.comparatorId];
  const unique = [...new Set(ids)];
  if (unique.length <= 1) {
    return assetTypeForId(messages, unique[0]!);
  }
  return unique.map((id) => assetTypeForId(messages, id)).join(" · ");
}

export function CompareHubContent({ payload }: CompareHubContentProps) {
  const { messages, locale } = useComparatorPage();
  const copy = messages.compareHub;
  const riskLabels = messages.risk;
  const [minFilter, setMinFilter] = useState<MinInvestmentFilter>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("apy");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const {
    selectedIds,
    selectedProducts,
    panelOpen,
    setPanelOpen,
    toggleSelect,
    clearSelection,
    addProductIds,
    isSelected,
    maxReached,
  } = useCompareSelection(payload.products);

  const formattedDate = formatComparatorDate(payload.fetchedAt, locale);

  function toggleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection(column === "apy" ? "desc" : "asc");
    }
  }

  const filteredProducts = useMemo(() => {
    const list = payload.products.filter((product) =>
      matchesMinInvestmentFilter(product.meta, minFilter)
    );

    const dir = sortDirection === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sortColumn) {
        case "minInvestment":
          return (a.meta.minInvestmentUsd - b.meta.minInvestmentUsd) * dir;
        case "liquidity":
          return (a.meta.liquidityDays - b.meta.liquidityDays) * dir;
        case "fees":
          return (
            (parseFeesSortValue(a.meta.fees) - parseFeesSortValue(b.meta.fees)) *
            dir
          );
        default:
          return (a.row.apy - b.row.apy) * dir;
      }
    });
  }, [payload.products, minFilter, sortColumn, sortDirection]);

  return (
    <>
      <header className="mb-6 md:mb-10">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:mt-4 md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:mt-3 md:text-base">
          {copy.subtitle}
        </p>
        <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-white/35">
          {copy.disclaimer}
        </p>
        <p className="mt-4 font-mono text-[10px] text-white/30">
          {copy.updated(formattedDate)} · {copy.totalProducts(payload.totalProducts)}
        </p>
      </header>

      <CompareAiAssist
        selectedIds={selectedIds}
        onAddIds={addProductIds}
      />

      <aside className="mb-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p className="font-display text-base text-white">{copy.dossierBanner.title}</p>
          <p className="mt-1 max-w-xl text-sm text-white/55">
            {copy.dossierBanner.subtitle}
          </p>
          <p className="mt-3">
            <Link
              href="/tools/mica-checker"
              className="font-mono text-[11px] text-white/40 underline-offset-2 hover:text-white/65 hover:underline"
            >
              {copy.micaCheckerLink}
            </Link>
          </p>
        </div>
        <PrimaryButton
          href={DOSSIER_CTA.href}
          className="mt-4 shrink-0 md:mt-0"
          onClick={() =>
            track("comparator_dossier_cta", {
              source: "compare_hub_banner",
              comparator: "compare",
            })
          }
        >
          {copy.dossierBanner.cta}
        </PrimaryButton>
      </aside>

      <div className="grid gap-4 md:grid-cols-3">
        {payload.tiers.map((tierHighlight) => {
          const tierCopy = copy.tiers[tierHighlight.tier];
          const best = tierHighlight.best;

          return (
            <article
              key={tierHighlight.tier}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {tierCopy.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {tierCopy.description}
              </p>

              {best ? (
                <div className="mt-5 border-t border-white/[0.06] pt-5">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/35">
                    {copy.tierBest}
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <PlatformLogo
                      name={best.row.platform}
                      logo={best.row.logo}
                      size={36}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{best.row.platform}</p>
                      <p className="mt-0.5 font-mono text-xs text-white/50">
                        {best.row.product}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-display text-xl tabular-nums text-white">
                          {best.row.apy.toFixed(2)}%
                        </span>
                        <RiskBadge
                          comparatorId={best.comparatorId}
                          category={best.row.category}
                        />
                        <ProductMetaBadges meta={best.meta} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={best.comparatorHref}
                      className="font-mono text-[10px] text-white/50 transition hover:text-white"
                    >
                      {copy.viewComparator} ·{" "}
                      {assetTypeForId(messages, best.comparatorId)}
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="mt-5 border-t border-white/[0.06] pt-5 font-mono text-xs text-white/35">
                  —
                </p>
              )}

              <p className="mt-4 font-mono text-[10px] text-white/30">
                {copy.tierProducts(tierHighlight.productCount)}
              </p>
            </article>
          );
        })}
      </div>

      <section className="mt-10 md:mt-14">
        <div className="mb-5 space-y-4">
          <fieldset>
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
              {copy.filters.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", copy.filters.all],
                  ["under500", copy.filters.under500],
                  ["under5000", copy.filters.under5000],
                ] as const
              ).map(([value, label]) => (
                <FilterRadio
                  key={value}
                  name="min-investment"
                  value={value}
                  checked={minFilter === value}
                  onChange={() => setMinFilter(value)}
                >
                  {label}
                </FilterRadio>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="mb-5 font-mono text-[10px] leading-relaxed text-white/30">
          {copy.metaDisclaimer}
        </p>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="w-10 pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  <span className="sr-only">{copy.selection.selectProduct}</span>
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.protocol}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.product}
                </th>
                <SortableHeader
                  label={copy.table.apy}
                  column="apy"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={toggleSort}
                  align="right"
                />
                <SortableHeader
                  label={copy.table.minInvestment}
                  column="minInvestment"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label={copy.table.liquidity}
                  column="liquidity"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label={copy.table.fees}
                  column="fees"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={toggleSort}
                />
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.comparePanel.rows.jurisdiction}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.risk}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.assetType}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <HubDesktopRow
                  key={productRowKey(product)}
                  product={product}
                  assetType={assetTypesLabel(product, messages)}
                  copy={copy}
                  riskLabels={riskLabels}
                  selected={isSelected(product.row.id)}
                  onToggleSelect={() => toggleSelect(product.row.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filteredProducts.map((product) => (
            <HubMobileRow
              key={productRowKey(product)}
              product={product}
              assetType={assetTypesLabel(product, messages)}
              copy={copy}
              riskLabels={riskLabels}
              selected={isSelected(product.row.id)}
              onToggleSelect={() => toggleSelect(product.row.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">{copy.noResults}</p>
        ) : null}
      </section>

      <CompareSelectionBar
        count={selectedIds.length}
        canCompare={selectedIds.length >= 2}
        maxReached={maxReached}
        selectedIds={selectedIds}
        onCompare={() => setPanelOpen(true)}
        onClear={clearSelection}
      />
      <ComparePanel
        open={panelOpen}
        products={selectedProducts}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
}

function FilterRadio({
  children,
  name,
  value,
  checked,
  onChange,
}: {
  children: ReactNode;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-[11px] transition ${
        checked
          ? "border-white/30 bg-white/[0.08] text-white"
          : "border-white/10 text-white/45 hover:border-white/20"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  );
}

function SortableHeader({
  label,
  column,
  activeColumn,
  direction,
  onSort,
  align = "left",
}: {
  label: string;
  column: SortColumn;
  activeColumn: SortColumn;
  direction: SortDirection;
  onSort: (column: SortColumn) => void;
  align?: "left" | "right";
}) {
  const isActive = activeColumn === column;
  return (
    <th className={`pb-3 ${align === "right" ? "text-right" : ""}`}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`rounded-sm font-mono text-[10px] uppercase tracking-wider transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 ${
          isActive ? "text-white" : "text-white/35 hover:text-white/60"
        }`}
      >
        {label}
        {isActive ? (
          <span className="ml-1" aria-hidden>
            {direction === "asc" ? "↑" : "↓"}
          </span>
        ) : null}
      </button>
    </th>
  );
}

function openProductLink(product: HubProduct) {
  const href = resolveComparatorProductLink(product.comparatorId, product.row);
  track("comparator_platform_click", {
    platform: product.row.id,
    comparator: product.comparatorId,
    affiliate: Boolean(product.row.affiliate_link),
  });
  window.open(href, "_blank", "noopener,noreferrer");
}

function HubDesktopRow({
  product,
  assetType,
  copy,
  riskLabels,
  selected,
  onToggleSelect,
}: {
  product: HubProduct;
  assetType: string;
  copy: ComparatorMessages["compareHub"];
  riskLabels: ComparatorMessages["risk"];
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const profileBadge = multiProfileBadge(product, riskLabels);

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={() => openProductLink(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProductLink(product);
        }
      }}
      className={`cursor-pointer border-b border-white/[0.05] transition hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none ${
        selected ? "bg-white/[0.03]" : ""
      }`}
      aria-label={`${product.row.platform} — ${copy.viewPlatform}`}
    >
      <td className="py-4 pr-2">
        <CompareSelectCheckbox
          checked={selected}
          label={copy.selection.selectProduct}
          onToggle={onToggleSelect}
        />
      </td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <PlatformLogo name={product.row.platform} logo={product.row.logo} />
          <span className="font-medium text-white">{product.row.platform}</span>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="font-mono text-white/70">{product.row.product}</div>
        {profileBadge ? (
          <span
            className="mt-1 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/55"
            title={riskLabels.badgeHint}
          >
            {profileBadge}
          </span>
        ) : null}
      </td>
      <td className="py-4 pr-4 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="font-display text-xl tabular-nums text-white">
            {product.row.apy > 0 ? `${product.row.apy.toFixed(2)}%` : "—"}
          </span>
          <ProductMetaBadges meta={product.meta} />
        </div>
      </td>
      <td className="py-4 pr-4 font-mono text-sm tabular-nums text-white/70">
        {formatMinInvestment(product.meta.minInvestmentUsd)}
      </td>
      <td className="py-4 pr-4 font-mono text-sm text-white/70">
        {formatLiquidity(product.meta.liquidityDays, copy.liquidity)}
      </td>
      <td className="py-4 pr-4 font-mono text-xs text-white/55">
        {product.meta.fees}
      </td>
      <td className="py-4 pr-4 font-mono text-sm text-white/70">
        {product.meta.jurisdiction ?? copy.comparePanel.notAvailable}
      </td>
      <td className="py-4 pr-4">
        <RiskBadge
          comparatorId={product.comparatorId}
          category={product.row.category}
        />
      </td>
      <td className="py-4 font-mono text-[10px] text-white/45">{assetType}</td>
    </tr>
  );
}

function HubMobileRow({
  product,
  assetType,
  copy,
  riskLabels,
  selected,
  onToggleSelect,
}: {
  product: HubProduct;
  assetType: string;
  copy: ComparatorMessages["compareHub"];
  riskLabels: ComparatorMessages["risk"];
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const href = resolveComparatorProductLink(product.comparatorId, product.row);
  const profileBadge = multiProfileBadge(product, riskLabels);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition ${
        selected
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3 border-b border-white/[0.06] p-4">
        <CompareSelectCheckbox
          checked={selected}
          label={copy.selection.selectProduct}
          onToggle={onToggleSelect}
        />
        <PlatformLogo
          name={product.row.platform}
          logo={product.row.logo}
          size={40}
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white">{product.row.platform}</p>
          <p className="mt-0.5 font-mono text-sm text-white/55">
            {product.row.product}
          </p>
          {profileBadge ? (
            <span
              className="mt-1 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/55"
              title={riskLabels.badgeHint}
            >
              {profileBadge}
            </span>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RiskBadge
              comparatorId={product.comparatorId}
              category={product.row.category}
            />
            <ProductMetaBadges meta={product.meta} />
            <span className="font-mono text-[10px] text-white/35">{assetType}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            {copy.table.apy}
          </p>
          <p className="font-display text-2xl tabular-nums text-white">
            {product.row.apy > 0 ? `${product.row.apy.toFixed(2)}%` : "—"}
          </p>
        </div>
      </div>

      <ProductRowLink
        href={href}
        row={product.row}
        comparatorId={product.comparatorId}
        ariaLabel={`${product.row.platform} — ${copy.viewPlatform}`}
        className="block transition active:bg-white/[0.04]"
      >
        <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.06]">
          <MetaCell label={copy.table.minInvestment}>
            {formatMinInvestment(product.meta.minInvestmentUsd)}
          </MetaCell>
          <MetaCell label={copy.table.liquidity}>
            {formatLiquidity(product.meta.liquidityDays, copy.liquidity)}
          </MetaCell>
          <MetaCell label={copy.table.fees}>{product.meta.fees}</MetaCell>
          <MetaCell label={copy.comparePanel.rows.jurisdiction}>
            {product.meta.jurisdiction ?? copy.comparePanel.notAvailable}
          </MetaCell>
        </div>

        <p className="flex min-h-[44px] items-center justify-center border-t border-white/[0.06] font-mono text-xs text-white/50">
          {copy.viewPlatform} →
        </p>
      </ProductRowLink>
    </div>
  );
}

function MetaCell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-void/40 px-3 py-3">
      <p className="font-mono text-[9px] uppercase tracking-wider text-white/35">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-xs text-white/80">{children}</p>
    </div>
  );
}
