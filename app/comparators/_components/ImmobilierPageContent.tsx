"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import {
  computeComparatorSummary,
  resolveImmobilierLink,
} from "@/lib/comparators";
import type { ImmobilierPayload } from "@/lib/comparators";
import type { RealEstateRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type ImmobilierPageContentProps = {
  rows: RealEstateRow[];
  fetchedAt: ImmobilierPayload["fetchedAt"];
  source: ImmobilierPayload["source"];
};

export function ImmobilierPageContent({
  rows,
  fetchedAt,
  source,
}: ImmobilierPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.immobilier;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "residential", label: copy.filters.residential },
    { id: "commercial", label: copy.filters.commercial },
    { id: "land", label: copy.filters.land },
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
        pageId="immobilier"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="immobilier"
        resolveLink={resolveImmobilierLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
