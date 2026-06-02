"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import { computeComparatorSummary, resolveBondLink } from "@/lib/comparators";
import type { BondsPayload } from "@/lib/comparators";
import type { BondRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type BondsPageContentProps = {
  rows: BondRow[];
  fetchedAt: BondsPayload["fetchedAt"];
  source: BondsPayload["source"];
};

export function BondsPageContent({
  rows,
  fetchedAt,
  source,
}: BondsPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.obligations;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "sovereign", label: copy.filters.sovereign },
    { id: "corporate", label: copy.filters.corporate },
    { id: "structured", label: copy.filters.structured },
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
        pageId="obligations"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="obligations"
        resolveLink={resolveBondLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
