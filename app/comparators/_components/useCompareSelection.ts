"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  COMPARE_HUB_URL_PARAM,
  encodeCompareProductIdsParam,
  normalizeCompareProductIds,
  parseCompareProductIdsParam,
  toggleCompareProductId,
} from "@/lib/comparators/compare-selection";
import type { HubProduct } from "@/lib/comparators/compare-hub";

export function useCompareSelection(products: HubProduct[]) {
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [maxReached, setMaxReached] = useState(false);
  const autoOpenedRef = useRef(false);

  const validIds = useMemo(() => new Set(products.map((p) => p.row.id)), [products]);

  const productById = useMemo(() => {
    const map = new Map<string, HubProduct>();
    for (const product of products) {
      map.set(product.row.id, product);
    }
    return map;
  }, [products]);

  useEffect(() => {
    const urlIds = parseCompareProductIdsParam(searchParams.get(COMPARE_HUB_URL_PARAM));
    const valid = urlIds.filter((id) => validIds.has(id));
    if (valid.length > 0) {
      setSelectedIds(normalizeCompareProductIds(valid));
      if (!autoOpenedRef.current && valid.length >= 2) {
        setPanelOpen(true);
        autoOpenedRef.current = true;
      }
    }
  }, [searchParams, validIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = encodeCompareProductIdsParam(selectedIds);
    if (encoded) {
      params.set(COMPARE_HUB_URL_PARAM, encoded);
    } else {
      params.delete(COMPARE_HUB_URL_PARAM);
    }
    const query = params.toString();
    const next = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, "", next);
  }, [selectedIds]);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => productById.get(id))
        .filter((product): product is HubProduct => Boolean(product)),
    [selectedIds, productById]
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((current) => {
      const result = toggleCompareProductId(current, id);
      if (result.reason === "full") {
        setMaxReached(true);
        window.setTimeout(() => setMaxReached(false), 2500);
      }
      return result.ids;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setPanelOpen(false);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return {
    selectedIds,
    selectedProducts,
    panelOpen,
    setPanelOpen,
    toggleSelect,
    clearSelection,
    isSelected,
    maxReached,
  };
}
