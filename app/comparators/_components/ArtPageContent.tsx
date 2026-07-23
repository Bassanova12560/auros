"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import { computeComparatorSummary, resolveArtLink } from "@/lib/comparators";
import type { ArtPayload } from "@/lib/comparators";
import type { ArtRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type ArtPageContentProps = {
  rows: ArtRow[];
  fetchedAt: ArtPayload["fetchedAt"];
  source: ArtPayload["source"];
};

export function ArtPageContent({
  rows,
  fetchedAt,
  source,
}: ArtPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.artCollectibles;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "fine_art", label: copy.filters.fine_art },
    { id: "collectibles", label: copy.filters.collectibles },
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
        pageId="art-collectibles"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="art-collectibles"
        resolveLink={resolveArtLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
