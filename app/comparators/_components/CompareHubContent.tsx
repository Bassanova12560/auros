"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Eyebrow } from "@/app/_components/ui/Eyebrow";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { PlatformLogo } from "./PlatformLogo";
import { ProductMetaBadges } from "./ProductMetaBadges";
import { ProductRowLink } from "./ProductRowLink";
import { RiskBadge } from "./RiskBadge";
import { useComparatorPage } from "./useComparatorPage";
import {
  assetTypeForId,
  DOSSIER_CTA,
  formatComparatorDate,
  formatLiquidity,
  formatMinInvestment,
  matchesMinInvestmentFilter,
  resolveComparatorProductLink,
} from "@/lib/comparators";
import type { CompareHubPayload, HubProduct } from "@/lib/comparators/compare-hub";
import type { ComparatorMessages } from "@/lib/comparators/i18n";
import { track } from "@/lib/analytics";

type CompareHubContentProps = {
  payload: CompareHubPayload;
};

type MinInvestmentFilter = "all" | "under500" | "under5000";
type SortMode = "apy" | "liquidity";

export function CompareHubContent({ payload }: CompareHubContentProps) {
  const { messages, locale } = useComparatorPage();
  const copy = messages.compareHub;
  const [minFilter, setMinFilter] = useState<MinInvestmentFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("apy");

  const formattedDate = formatComparatorDate(payload.fetchedAt, locale);

  const filteredProducts = useMemo(() => {
    const list = payload.products.filter((product) =>
      matchesMinInvestmentFilter(product.meta, minFilter)
    );

    return [...list].sort((a, b) => {
      if (sortMode === "liquidity") {
        return a.meta.liquidityDays - b.meta.liquidityDays;
      }
      return b.row.apy - a.row.apy;
    });
  }, [payload.products, minFilter, sortMode]);

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

      <aside className="mb-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p className="font-display text-base text-white">{copy.dossierBanner.title}</p>
          <p className="mt-1 max-w-xl text-sm text-white/55">
            {copy.dossierBanner.subtitle}
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

          <fieldset>
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
              {copy.sort.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["apy", copy.sort.apy],
                  ["liquidity", copy.sort.liquidity],
                ] as const
              ).map(([value, label]) => (
                <FilterRadio
                  key={value}
                  name="sort-mode"
                  value={value}
                  checked={sortMode === value}
                  onChange={() => setSortMode(value)}
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
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.protocol}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.product}
                </th>
                <th className="pb-3 text-right font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.apy}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.minInvestment}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.liquidity}
                </th>
                <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {copy.table.fees}
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
                  key={`${product.comparatorId}-${product.row.id}`}
                  product={product}
                  assetType={assetTypeForId(messages, product.comparatorId)}
                  copy={copy}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filteredProducts.map((product) => (
            <HubMobileRow
              key={`${product.comparatorId}-${product.row.id}`}
              product={product}
              assetType={assetTypeForId(messages, product.comparatorId)}
              copy={copy}
            />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">{copy.noResults}</p>
        ) : null}
      </section>
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
}: {
  product: HubProduct;
  assetType: string;
  copy: ComparatorMessages["compareHub"];
}) {
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
      className="cursor-pointer border-b border-white/[0.05] transition hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none"
      aria-label={`${product.row.platform} — ${copy.viewPlatform}`}
    >
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <PlatformLogo name={product.row.platform} logo={product.row.logo} />
          <span className="font-medium text-white">{product.row.platform}</span>
        </div>
      </td>
      <td className="py-4 pr-4 font-mono text-white/70">{product.row.product}</td>
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
}: {
  product: HubProduct;
  assetType: string;
  copy: ComparatorMessages["compareHub"];
}) {
  const href = resolveComparatorProductLink(product.comparatorId, product.row);

  return (
    <ProductRowLink
      href={href}
      row={product.row}
      comparatorId={product.comparatorId}
      ariaLabel={`${product.row.platform} — ${copy.viewPlatform}`}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition active:bg-white/[0.04]"
    >
      <div className="flex items-start gap-3 p-4">
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

      <div className="grid grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.06]">
        <MetaCell label={copy.table.minInvestment}>
          {formatMinInvestment(product.meta.minInvestmentUsd)}
        </MetaCell>
        <MetaCell label={copy.table.liquidity}>
          {formatLiquidity(product.meta.liquidityDays, copy.liquidity)}
        </MetaCell>
        <MetaCell label={copy.table.fees}>{product.meta.fees}</MetaCell>
      </div>

      <p className="flex min-h-[44px] items-center justify-center border-t border-white/[0.06] font-mono text-xs text-white/50">
        {copy.viewPlatform} →
      </p>
    </ProductRowLink>
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
