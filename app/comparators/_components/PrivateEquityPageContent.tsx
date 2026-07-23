"use client";

import { useMemo, useState } from "react";

import { ComparatorPageHeader } from "./ComparatorPageHeader";
import {
  ComparatorProductsTable,
  type CategoryFilter,
} from "./ComparatorProductsTable";
import {
  computeComparatorSummary,
  resolvePrivateEquityLink,
} from "@/lib/comparators";
import type { PrivateEquityPayload } from "@/lib/comparators";
import type { PrivateEquityRow } from "@/lib/comparators/types";
import { useComparatorPage } from "./useComparatorPage";

type PrivateEquityPageContentProps = {
  rows: PrivateEquityRow[];
  fetchedAt: PrivateEquityPayload["fetchedAt"];
  source: PrivateEquityPayload["source"];
};

export function PrivateEquityPageContent({
  rows,
  fetchedAt,
  source,
}: PrivateEquityPageContentProps) {
  const { messages } = useComparatorPage();
  const copy = messages.privateEquity;
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryFilters = [
    { id: "all", label: copy.filters.all },
    { id: "funds", label: copy.filters.funds },
    { id: "public_equity", label: copy.filters.public_equity },
    { id: "infrastructure", label: copy.filters.infrastructure },
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
        pageId="private-equity"
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
      />
      <ComparatorProductsTable
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        copy={copy}
        comparatorId="private-equity"
        resolveLink={resolvePrivateEquityLink}
        categoryFilters={categoryFilters}
      />
    </>
  );
}
