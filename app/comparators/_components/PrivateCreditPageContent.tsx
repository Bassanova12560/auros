"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import {
  computeComparatorSummary,
  resolvePrivateCreditLink,
} from "@/lib/comparators";
import type { PrivateCreditPayload } from "@/lib/comparators";
import type { PrivateCreditRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type PrivateCreditPageContentProps = {
  rows: PrivateCreditRow[];
  fetchedAt: PrivateCreditPayload["fetchedAt"];
  source: PrivateCreditPayload["source"];
};

export function PrivateCreditPageContent({
  rows,
  fetchedAt,
  source,
}: PrivateCreditPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.privateCredit;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "prime", label: copy.filters.prime },
    { id: "emerging", label: copy.filters.emerging },
    { id: "alternative", label: copy.filters.alternative },
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
        pageId="private-credit"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="private-credit"
        resolveLink={resolvePrivateCreditLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
