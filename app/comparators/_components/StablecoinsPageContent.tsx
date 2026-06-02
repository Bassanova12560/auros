"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import {
  computeComparatorSummary,
  resolvePlatformLink,
} from "@/lib/comparators";
import type { StablecoinsPayload } from "@/lib/comparators";
import type { StablecoinRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type StablecoinsPageContentProps = {
  rows: StablecoinRow[];
  fetchedAt: StablecoinsPayload["fetchedAt"];
  source: StablecoinsPayload["source"];
};

export function StablecoinsPageContent({
  rows,
  fetchedAt,
  source,
}: StablecoinsPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.stablecoins;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "treasury", label: copy.filters.treasury },
    { id: "credit", label: copy.filters.credit },
  ];

  const summary = useMemo(() => {
    const scoped =
      category === "all"
        ? rows
        : rows.filter((row) => row.category === category);
    return computeComparatorSummary(scoped);
  }, [rows, category]);

  return (
    <>
      <ComparatorPageHeader
        pageId="stablecoins"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="stablecoins"
        resolveLink={resolvePlatformLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
