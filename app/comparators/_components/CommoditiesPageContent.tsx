"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import { computeComparatorSummary, resolveCommodityLink } from "@/lib/comparators";
import type { CommoditiesPayload } from "@/lib/comparators";
import type { CommodityRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type CommoditiesPageContentProps = {
  rows: CommodityRow[];
  fetchedAt: CommoditiesPayload["fetchedAt"];
  source: CommoditiesPayload["source"];
};

export function CommoditiesPageContent({
  rows,
  fetchedAt,
  source,
}: CommoditiesPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.matieresPremieres;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "agricultural", label: copy.filters.agricultural },
    { id: "precious_metals", label: copy.filters.precious_metals },
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
        pageId="matieres-premieres"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="matieres-premieres"
        resolveLink={resolveCommodityLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
