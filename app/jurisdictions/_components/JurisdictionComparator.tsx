"use client";

import { useMemo, useState } from "react";

import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { useJurisdictionPage } from "./useJurisdictionPage";
import { useJurisdictionPrefill } from "./JurisdictionPrefillProvider";
import { StabilityDots } from "./StabilityDots";
import {
  filterJurisdictions,
  getJurisdictionDetail,
  JURISDICTIONS,
  jurisdictionLabel,
} from "@/lib/jurisdictions";
import type {
  AssetFilter,
  BudgetFilter,
  DelayFilter,
  Jurisdiction,
  QuickFilter,
} from "@/lib/jurisdictions";
import type { JurisdictionMessages } from "@/lib/jurisdictions/i18n";
import type { Locale } from "@/lib/i18n";

export function JurisdictionComparator() {
  const { locale, messages } = useJurisdictionPage();
  const [quick, setQuick] = useState<QuickFilter>("all");
  const [asset, setAsset] = useState<AssetFilter>("all");
  const [budget, setBudget] = useState<BudgetFilter>("all");
  const [delay, setDelay] = useState<DelayFilter>("all");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const filtered = useMemo(
    () => filterJurisdictions(JURISDICTIONS, asset, budget, delay, quick),
    [asset, budget, delay, quick]
  );

  return (
    <section id="comparator" className="scroll-mt-28 py-16 md:py-20">
      <SectionHeader
        eyebrow={messages.comparatorSection.eyebrow}
        title={messages.comparatorSection.title}
        subtitle={messages.comparatorSection.subtitle}
        align="left"
      />

      <div className="mt-10">
      <FilterGroup
        legend={messages.filters.quickLabel}
        options={[
          ["all", messages.filters.quickAll],
          ["bestCost", messages.filters.quickCost],
          ["fastDelay", messages.filters.quickDelay],
        ]}
        value={quick}
        onChange={(v) => setQuick(v as QuickFilter)}
      />

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className="font-mono text-[10px] uppercase tracking-wider text-white/40 transition hover:text-white/70"
          aria-expanded={advancedOpen}
        >
          {messages.filters.advancedLabel} {advancedOpen ? "▾" : "▸"}
        </button>
        {advancedOpen ? (
          <div className="mt-4 space-y-4">
            <FilterGroup
              legend={messages.filters.assetLabel}
              options={[
                ["all", messages.filters.assetAll],
                ["real_estate", messages.filters.assetRealEstate],
                ["bonds", messages.filters.assetBonds],
                ["private_credit", messages.filters.assetPrivateCredit],
                ["funds", messages.filters.assetFunds],
              ]}
              value={asset}
              onChange={(v) => setAsset(v as AssetFilter)}
            />
            <FilterGroup
              legend={messages.filters.budgetLabel}
              options={[
                ["all", messages.filters.budgetAll],
                ["under15k", messages.filters.budgetUnder15k],
                ["mid15_40", messages.filters.budgetMid15_40],
                ["over40", messages.filters.budgetOver40],
              ]}
              value={budget}
              onChange={(v) => setBudget(v as BudgetFilter)}
            />
            <FilterGroup
              legend={messages.filters.delayLabel}
              options={[
                ["all", messages.filters.delayAll],
                ["under3", messages.filters.delayUnder3],
                ["mid3_6", messages.filters.delayMid3_6],
                ["over6", messages.filters.delayOver6],
              ]}
              value={delay}
              onChange={(v) => setDelay(v as DelayFilter)}
            />
          </div>
        ) : null}
      </div>

      <p className="mt-4 font-mono text-[10px] leading-relaxed text-white/30">
        {messages.table.disclaimer}
      </p>

      <p className="mt-4 font-mono text-[10px] text-white/35">
        {messages.table.count(filtered.length)}
      </p>

      <div className="jurisdiction-table-shell mt-6 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {[
                messages.table.jurisdiction,
                messages.table.fees,
                messages.table.delay,
                messages.table.taxInvestor,
                messages.table.stability,
                messages.table.language,
                messages.table.actions,
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 pb-3 pt-4 font-mono text-[10px] uppercase tracking-wider text-white/35 first:pl-6 last:pr-6"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <DesktopRow
                key={item.id}
                item={item}
                locale={locale}
                messages={messages}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 lg:hidden">
        {filtered.map((item) => (
          <MobileCard key={item.id} item={item} locale={locale} messages={messages} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          {messages.table.noResults}
        </p>
      ) : null}
      </div>
    </section>
  );
}

function FilterGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly (readonly [string, string])[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
        {legend}
      </legend>
        <div className="scroll-x-touch flex flex-nowrap gap-2 md:flex-wrap">
        {options.map(([id, label]) => (
          <label
            key={id}
            className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 font-mono text-[11px] transition md:text-[10px] ${
              value === id
                ? "border-white/30 bg-white/[0.08] text-white"
                : "border-white/10 text-white/45 hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name={legend}
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function JurisdictionBadges({
  item,
  messages,
}: {
  item: Jurisdiction;
  messages: JurisdictionMessages;
}) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {item.recommended ? (
        <span className="rounded-full border border-white/20 bg-white/[0.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
          {messages.table.recommended}
        </span>
      ) : null}
      {item.bestValue ? (
        <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-200/90">
          {messages.table.bestValue}
        </span>
      ) : null}
    </div>
  );
}

function SplitCell({
  topLabel,
  topValue,
  bottomLabel,
  bottomValue,
}: {
  topLabel: string;
  topValue: string;
  bottomLabel: string;
  bottomValue: string;
}) {
  return (
    <div className="space-y-1 font-mono text-xs text-white/55">
      <div>
        <span className="text-white/35">{topLabel} </span>
        <strong className="font-medium text-white/75">{topValue}</strong>
      </div>
      <div>
        <span className="text-white/35">{bottomLabel} </span>
        <strong className="font-medium text-white/75">{bottomValue}</strong>
      </div>
    </div>
  );
}

function TaxCell({
  detail,
  alertPrefix,
}: {
  detail: ReturnType<typeof getJurisdictionDetail>;
  alertPrefix: string;
}) {
  return (
    <div>
      <p className="font-mono text-xs text-white/70">{detail.taxInvestor}</p>
      {detail.taxAlert ? (
        <span
          className="mt-1 inline-block font-mono text-[10px] text-amber-200/75"
          title={detail.taxTip ?? detail.taxAlert}
        >
          {alertPrefix} · {detail.taxAlert}
        </span>
      ) : null}
    </div>
  );
}

function RowActions({ jurisdictionId }: { jurisdictionId: string }) {
  const { messages } = useJurisdictionPage();
  const { openGuideChecklist, openQuote } = useJurisdictionPrefill();

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={() => openGuideChecklist(jurisdictionId)}
        className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[10px] text-white/55 transition hover:border-white/25 hover:text-white active:scale-[0.98]"
      >
        {messages.table.actionCompare}
      </button>
      <button
        type="button"
        onClick={() => openQuote(jurisdictionId)}
        className="rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[10px] text-white transition hover:bg-white/[0.1] active:scale-[0.98]"
      >
        {messages.table.actionQuote}
      </button>
      <a
        href={`/copilot?context=jurisdiction&jid=${encodeURIComponent(jurisdictionId)}`}
        className="rounded-full border border-emerald-500/25 px-3.5 py-1.5 text-center font-mono text-[10px] text-emerald-300/80 transition hover:border-emerald-400/40 hover:text-emerald-200"
      >
        Copilot
      </a>
    </div>
  );
}

function DesktopRow({
  item,
  locale,
  messages,
}: {
  item: Jurisdiction;
  locale: Locale;
  messages: JurisdictionMessages;
}) {
  const detail = getJurisdictionDetail(locale, item.id);

  return (
    <tr
      className={`border-b border-white/[0.05] transition hover:bg-white/[0.03] ${
        item.recommended || item.bestValue ? "bg-white/[0.02]" : ""
      }`}
    >
      <td className="px-4 py-4 align-top first:pl-6 last:pr-6">
        <div className="font-medium text-white">
          {jurisdictionLabel(messages, item.id)}
        </div>
        <JurisdictionBadges item={item} messages={messages} />
      </td>
      <td className="px-4 py-4 align-top first:pl-6 last:pr-6">
        <SplitCell
          topLabel={messages.table.feeState}
          topValue={detail.stateFees}
          bottomLabel={messages.table.feeAdvisory}
          bottomValue={detail.advisoryFees}
        />
      </td>
      <td className="px-4 py-4 align-top first:pl-6 last:pr-6">
        <SplitCell
          topLabel={messages.table.delayLicense}
          topValue={detail.licenseDelay}
          bottomLabel={messages.table.delayProduction}
          bottomValue={detail.productionDelay}
        />
      </td>
      <td className="px-4 py-4 align-top first:pl-6 last:pr-6">
        <TaxCell detail={detail} alertPrefix={messages.table.taxAlertPrefix} />
      </td>
      <td className="px-4 py-4 align-top first:pl-6 last:pr-6">
        <StabilityDots
          level={item.stabilityLevel}
          tier={item.stabilityTier}
          label={messages.stabilityLabels[item.stabilityTier]}
        />
      </td>
      <td className="py-4 pr-3 align-top font-mono text-xs text-white/60">
        {detail.language}
      </td>
      <td className="py-4 align-top">
        <RowActions jurisdictionId={item.id} />
      </td>
    </tr>
  );
}

function MobileCard({
  item,
  locale,
  messages,
}: {
  item: Jurisdiction;
  locale: Locale;
  messages: JurisdictionMessages;
}) {
  const detail = getJurisdictionDetail(locale, item.id);

  return (
    <article
      className={`overflow-hidden rounded-2xl border ${
        item.recommended || item.bestValue
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      <div className="p-4">
        <h3 className="font-display text-lg text-white">
          {jurisdictionLabel(messages, item.id)}
        </h3>
        <JurisdictionBadges item={item} messages={messages} />
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.06]">
        <MetaItem
          label={messages.table.fees}
          value={`${detail.stateFees} / ${detail.advisoryFees}`}
        />
        <MetaItem
          label={messages.table.delay}
          value={`${detail.licenseDelay} · ${detail.productionDelay}`}
        />
        <MetaItem label={messages.table.taxInvestor} value={detail.taxInvestor} />
        <MetaItem label={messages.table.language} value={detail.language} />
        <div className="col-span-2 bg-void/40 px-4 py-3">
          <dt className="font-mono text-[9px] uppercase tracking-wider text-white/35">
            {messages.table.stability}
          </dt>
          <dd className="mt-1">
            <StabilityDots
              level={item.stabilityLevel}
              tier={item.stabilityTier}
              label={messages.stabilityLabels[item.stabilityTier]}
            />
          </dd>
        </div>
      </dl>

      <div className="border-t border-white/[0.06] p-4">
        <RowActions jurisdictionId={item.id} />
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-void/40 px-4 py-3">
      <dt className="font-mono text-[9px] uppercase tracking-wider text-white/35">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-xs text-white/80">{value}</dd>
    </div>
  );
}
