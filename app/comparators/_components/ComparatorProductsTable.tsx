"use client";

import { useMemo, useState } from "react";

import { PlatformLogo } from "./PlatformLogo";
import { ProductMetaBadges } from "./ProductMetaBadges";
import { ProductRowLink } from "./ProductRowLink";
import { RiskBadge } from "./RiskBadge";
import { useComparatorPage } from "./useComparatorPage";
import {
  formatLiquidity,
  formatMinInvestment,
  formatTvl,
  matchesMinInvestmentFilter,
  resolveProductMeta,
} from "@/lib/comparators";
import type { ComparatorPageCopy } from "@/lib/comparators/i18n";
import type { ComparatorId } from "@/lib/comparators/registry";
import type {
  ComparatorProductRow,
  SortDirection,
  SortField,
} from "@/lib/comparators/types";
import { track } from "@/lib/analytics";

export type CategoryFilter = string;

type FilterOption = { id: CategoryFilter; label: string };
type MinInvestmentFilter = "all" | "under500" | "under5000";
type SortMode = "apy" | "liquidity";

type ComparatorProductsTableProps = {
  rows: ComparatorProductRow[];
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  copy: ComparatorPageCopy;
  comparatorId: ComparatorId;
  resolveLink: (row: ComparatorProductRow) => string;
  categoryFilters: FilterOption[];
};

const MOBILE_SORT_FIELDS: SortField[] = ["apy", "tvlUsd", "platform"];

export function ComparatorProductsTable({
  rows,
  category,
  onCategoryChange,
  copy,
  comparatorId,
  resolveLink,
  categoryFilters,
}: ComparatorProductsTableProps) {
  const { messages } = useComparatorPage();
  const hub = messages.compareHub;
  const t = copy;
  const [query, setQuery] = useState("");
  const [minFilter, setMinFilter] = useState<MinInvestmentFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("apy");
  const [sortField, setSortField] = useState<SortField>("apy");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const mobileSortLabels: Partial<Record<SortField, string>> = {
    apy: t.table.apy,
    tvlUsd: t.table.tvl,
    platform: t.table.protocol,
  };

  function toggleSort(field: SortField) {
    setSortMode("apy");
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(
        field === "platform" || field === "product" ? "asc" : "desc"
      );
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;

    if (category !== "all") {
      list = list.filter((r) => r.category === category);
    }

    if (q) {
      list = list.filter(
        (r) =>
          r.platform.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q) ||
          r.chains.some((c) => c.toLowerCase().includes(q))
      );
    }

    list = list.filter((row) =>
      matchesMinInvestmentFilter(
        resolveProductMeta(comparatorId, row),
        minFilter
      )
    );

    if (sortMode === "liquidity") {
      return [...list].sort(
        (a, b) =>
          resolveProductMeta(comparatorId, a).liquidityDays -
          resolveProductMeta(comparatorId, b).liquidityDays
      );
    }

    const dir = sortDirection === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortField === "platform" || sortField === "product") {
        return a[sortField].localeCompare(b[sortField]) * dir;
      }
      return (a[sortField] - b[sortField]) * dir;
    });
  }, [
    rows,
    query,
    category,
    minFilter,
    sortMode,
    sortField,
    sortDirection,
    comparatorId,
  ]);

  const topId =
    sortMode === "apy" &&
    sortField === "apy" &&
    sortDirection === "desc" &&
    !query &&
    minFilter === "all" &&
    filtered.length > 0
      ? filtered[0].id
      : null;

  const activeFilterLabel = categoryFilters.find((f) => f.id === category)?.label;
  const categorySuffix =
    category !== "all" && activeFilterLabel ? ` · ${activeFilterLabel}` : "";

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {categoryFilters.map((opt) => (
          <FilterPill
            key={opt.id}
            active={category === opt.id}
            onClick={() => onCategoryChange(opt.id)}
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>

      <div className="mt-4 space-y-4 md:mt-5">
        <fieldset>
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
            {hub.filters.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", hub.filters.all],
                ["under500", hub.filters.under500],
                ["under5000", hub.filters.under5000],
              ] as const
            ).map(([value, label]) => (
              <FilterRadio
                key={value}
                name="min-investment"
                checked={minFilter === value}
                onChange={() => setMinFilter(value)}
              >
                {label}
              </FilterRadio>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
            {hub.sort.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["apy", hub.sort.apy],
                ["liquidity", hub.sort.liquidity],
              ] as const
            ).map(([value, label]) => (
              <FilterRadio
                key={value}
                name="sort-mode"
                checked={sortMode === value}
                onChange={() => setSortMode(value)}
              >
                {label}
              </FilterRadio>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/30">
        {hub.metaDisclaimer}
      </p>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.table.search}
        enterKeyHint="search"
        className="mt-4 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 font-mono text-base text-white outline-none placeholder:text-white/25 focus:border-white/25 md:mt-5 md:max-w-xs md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-0 md:py-2 md:text-sm"
      />

      <div className="mt-4 flex items-center gap-2 md:hidden">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/35">
          {t.table.sortBy}
        </span>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MOBILE_SORT_FIELDS.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => toggleSort(field)}
              className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[11px] transition active:scale-[0.98] ${
                sortMode === "apy" && sortField === field
                  ? "border-white/30 bg-white/[0.08] text-white"
                  : "border-white/10 text-white/45"
              }`}
            >
              {mobileSortLabels[field] ?? field}
              {sortMode === "apy" && sortField === field ? (
                <span className="ml-1" aria-hidden>
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] text-white/30 md:mt-5">
        {t.table.productsCount(filtered.length)}
        {categorySuffix}
      </p>

      <div className="mt-6 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <SortTh
                label={t.table.protocol}
                field="platform"
                active={sortField}
                direction={sortDirection}
                onSort={toggleSort}
                disabled={sortMode === "liquidity"}
              />
              <SortTh
                label={t.table.product}
                field="product"
                active={sortField}
                direction={sortDirection}
                onSort={toggleSort}
                disabled={sortMode === "liquidity"}
              />
              <SortTh
                label={t.table.apy}
                field="apy"
                active={sortField}
                direction={sortDirection}
                onSort={toggleSort}
                align="right"
                disabled={sortMode === "liquidity"}
              />
              <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {hub.table.minInvestment}
              </th>
              <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {hub.table.liquidity}
              </th>
              <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {hub.table.fees}
              </th>
              <SortTh
                label={t.table.tvl}
                field="tvlUsd"
                active={sortField}
                direction={sortDirection}
                onSort={toggleSort}
                align="right"
                disabled={sortMode === "liquidity"}
              />
              <th className="pb-3 pl-4 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {t.table.chain}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <DesktopRow
                key={row.id}
                row={row}
                isTop={row.id === topId}
                labels={t.table}
                hub={hub}
                comparatorId={comparatorId}
                resolveLink={resolveLink}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 pb-4 lg:hidden">
        {filtered.map((row) => (
          <MobileRow
            key={row.id}
            row={row}
            isTop={row.id === topId}
            labels={t.table}
            hub={hub}
            comparatorId={comparatorId}
            resolveLink={resolveLink}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted md:py-16">
          {t.table.noResults}
        </p>
      ) : null}
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 snap-start rounded-full border px-4 py-2.5 font-mono text-[11px] transition active:scale-[0.98] md:px-3.5 md:py-1.5 md:text-[10px] ${
        active
          ? "border-white/30 bg-white/[0.08] text-white"
          : "border-white/10 text-white/45"
      }`}
    >
      {children}
    </button>
  );
}

function FilterRadio({
  children,
  name,
  checked,
  onChange,
}: {
  children: React.ReactNode;
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-[11px] transition md:text-[10px] ${
        checked
          ? "border-white/30 bg-white/[0.08] text-white"
          : "border-white/10 text-white/45 hover:border-white/20"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  );
}

function SortTh({
  label,
  field,
  active,
  direction,
  onSort,
  align = "left",
  disabled = false,
}: {
  label: string;
  field: SortField;
  active: SortField;
  direction: SortDirection;
  onSort: (f: SortField) => void;
  align?: "left" | "right";
  disabled?: boolean;
}) {
  const isActive = !disabled && active === field;
  return (
    <th className={`pb-3 ${align === "right" ? "text-right" : ""}`}>
      <button
        type="button"
        onClick={() => onSort(field)}
        disabled={disabled}
        className={`font-mono text-[10px] uppercase tracking-wider transition disabled:cursor-default disabled:opacity-40 ${
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

type TableLabels = ComparatorPageCopy["table"];
type HubCopy = ReturnType<typeof useComparatorPage>["messages"]["compareHub"];

function TopBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300/90">
      {label}
    </span>
  );
}

function DesktopRow({
  row,
  isTop,
  labels,
  hub,
  comparatorId,
  resolveLink,
}: {
  row: ComparatorProductRow;
  isTop: boolean;
  labels: TableLabels;
  hub: HubCopy;
  comparatorId: ComparatorId;
  resolveLink: (row: ComparatorProductRow) => string;
}) {
  const href = resolveLink(row);
  const meta = resolveProductMeta(comparatorId, row);
  const chainLabel =
    row.chains.length > 2
      ? `${row.chains[0]} +${row.chains.length - 1}`
      : row.chains.join(", ");

  function openRow() {
    track("comparator_platform_click", {
      platform: row.id,
      comparator: comparatorId,
      affiliate: Boolean(row.affiliate_link),
    });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={openRow}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openRow();
        }
      }}
      className={`group cursor-pointer border-b border-white/[0.05] transition focus-visible:bg-white/[0.04] focus-visible:outline-none ${
        isTop ? "bg-white/[0.04]" : "hover:bg-white/[0.04]"
      }`}
      aria-label={labels.viewPlatformAria(row.platform)}
    >
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <PlatformLogo name={row.platform} logo={row.logo} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium text-white">{row.platform}</span>
              {isTop ? <TopBadge label={labels.topBadge} /> : null}
              <RiskBadge comparatorId={comparatorId} category={row.category} />
              <ProductMetaBadges meta={meta} />
              {!row.live ? (
                <span
                  className="font-mono text-[9px] text-white/25"
                  title={labels.manualHint}
                >
                  {labels.manual}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4 font-mono text-white/70">{row.product}</td>
      <td className="py-4 pr-4 text-right">
        <span className="font-display text-xl tabular-nums text-white">
          {row.apy.toFixed(2)}%
        </span>
      </td>
      <td className="py-4 pr-4 font-mono text-sm tabular-nums text-white/70">
        {formatMinInvestment(meta.minInvestmentUsd)}
      </td>
      <td className="py-4 pr-4 font-mono text-sm text-white/70">
        {formatLiquidity(meta.liquidityDays, hub.liquidity)}
      </td>
      <td className="py-4 pr-4 font-mono text-xs text-white/55">{meta.fees}</td>
      <td className="py-4 pr-4 text-right tabular-nums text-muted">
        {row.tvlUsd > 0 ? formatTvl(row.tvlUsd) : "—"}
      </td>
      <td className="py-4 pl-4 font-mono text-xs text-white/45">{chainLabel}</td>
    </tr>
  );
}

function MobileRow({
  row,
  isTop,
  labels,
  hub,
  comparatorId,
  resolveLink,
}: {
  row: ComparatorProductRow;
  isTop: boolean;
  labels: TableLabels;
  hub: HubCopy;
  comparatorId: ComparatorId;
  resolveLink: (row: ComparatorProductRow) => string;
}) {
  const href = resolveLink(row);
  const meta = resolveProductMeta(comparatorId, row);
  const chainLabel =
    row.chains.length > 2
      ? `${row.chains[0]} +${row.chains.length - 1}`
      : row.chains.join(", ");

  return (
    <ProductRowLink
      href={href}
      row={row}
      comparatorId={comparatorId}
      ariaLabel={labels.viewPlatformAria(row.platform)}
      className={`overflow-hidden rounded-2xl border transition active:bg-white/[0.04] ${
        isTop
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <PlatformLogo name={row.platform} logo={row.logo} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-white">{row.platform}</h3>
            {isTop ? <TopBadge label={labels.topBadge} /> : null}
            <RiskBadge comparatorId={comparatorId} category={row.category} />
            <ProductMetaBadges meta={meta} />
          </div>
          <p className="mt-0.5 font-mono text-sm text-white/55">{row.product}</p>
          {!row.live ? (
            <p
              className="mt-1 font-mono text-[9px] uppercase text-white/25"
              title={labels.manualHint}
            >
              {labels.manual}
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            {labels.apy}
          </p>
          <p className="font-display text-2xl tabular-nums leading-none text-white">
            {row.apy.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.06]">
        <MetaCell label={hub.table.minInvestment}>
          {formatMinInvestment(meta.minInvestmentUsd)}
        </MetaCell>
        <MetaCell label={hub.table.liquidity}>
          {formatLiquidity(meta.liquidityDays, hub.liquidity)}
        </MetaCell>
        <MetaCell label={hub.table.fees}>{meta.fees}</MetaCell>
        <MetaCell label={labels.chain}>{chainLabel}</MetaCell>
      </div>

      <p className="flex min-h-[48px] items-center justify-center gap-2 border-t border-white/[0.06] bg-white/[0.02] px-4 py-3.5 font-mono text-xs text-white/70">
        {labels.viewPlatform}
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M3 11L11 3M11 3H5M11 3V9"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>
    </ProductRowLink>
  );
}

function MetaCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-void/40 px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-wider text-white/35">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm text-white/80">{children}</p>
    </div>
  );
}
