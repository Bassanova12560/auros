"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  escapeHtmlAttr,
  greenMarketActorSheetHref,
} from "@/lib/green/market/actor-routes";
import { globalLatLngBounds } from "@/lib/green/market/geo";
import { greenMarketMarkerHtml } from "@/lib/green/market/markers";
import type { GreenMarketActor, GreenMarketActorType } from "@/lib/green/market/types";
import { GREEN_MARKET_CENTER } from "@/lib/green/market/types";
import { formatGreenMarketLocation } from "@/lib/green/market-i18n";

type Props = {
  actors: GreenMarketActor[];
  center?: { lat: number; lon: number };
  radiusKm?: number;
  actorTypeLabels?: Record<GreenMarketActorType, string>;
  popupViewSheetLabel?: string;
  /** Fit map to worldwide actor bounds (default for marketplace hub) */
  fitGlobal?: boolean;
  /** @deprecated Use fitGlobal */
  fitFrance?: boolean;
  className?: string;
};

export function GreenMarketMap({
  actors,
  center = GREEN_MARKET_CENTER,
  radiusKm,
  actorTypeLabels,
  popupViewSheetLabel = "View listing",
  fitGlobal: fitGlobalProp,
  fitFrance = false,
  className = "",
}: Props) {
  const fitGlobal = fitGlobalProp ?? fitFrance;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const worldBounds = useMemo(() => {
    const [[swLat, swLon], [neLat, neLon]] = globalLatLngBounds();
    return L.latLngBounds([swLat, swLon], [neLat, neLon]);
  }, []);

  const actorKey = useMemo(
    () => actors.map((a) => a.id).join(","),
    [actors]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lon],
      zoom: fitGlobal ? 3 : 6,
      scrollWheelZoom: true,
      attributionControl: true,
      minZoom: fitGlobal ? 2 : 4,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    if (fitGlobal) {
      map.fitBounds(worldBounds, { padding: [12, 12], maxZoom: 4 });
    }

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      circleRef.current = null;
    };
  }, [center.lat, center.lon, fitGlobal, worldBounds]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    circleRef.current?.remove();
    circleRef.current = null;

    if (radiusKm) {
      circleRef.current = L.circle([center.lat, center.lon], {
        radius: radiusKm * 1000,
        color: "rgba(255,255,255,0.35)",
        fillColor: "rgba(10,92,56,0.08)",
        fillOpacity: 0.4,
        weight: 1,
        dashArray: "4 6",
      }).addTo(map);
    }

    for (const actor of actors) {
      const icon = L.divIcon({
        className: "green-market-marker",
        html: greenMarketMarkerHtml(actor.type),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const location = formatGreenMarketLocation(actor.city, actor.country);
      const typeLabel = actorTypeLabels?.[actor.type] ?? actor.type;
      const priceLine =
        actor.pricePerKwh != null
          ? `<br/>${actor.pricePerKwh.toFixed(3)} €/kWh`
          : "";
      const sheetHref = greenMarketActorSheetHref(actor);
      const popupHtml = [
        `<strong>${escapeHtmlAttr(actor.name)}</strong>`,
        `<span style="opacity:0.75;font-size:11px;text-transform:uppercase;letter-spacing:0.06em">${escapeHtmlAttr(typeLabel)}</span>`,
        escapeHtmlAttr(location),
        `${actor.capacityKwh.toLocaleString()} kWh${priceLine}`,
        `<a href="${escapeHtmlAttr(sheetHref)}" style="display:inline-block;margin-top:8px;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:#4ade80">${escapeHtmlAttr(popupViewSheetLabel)} →</a>`,
      ].join("<br/>");
      L.marker([actor.lat, actor.lon], { icon })
        .bindPopup(popupHtml)
        .addTo(layer);
    }

    if (fitGlobal) {
      if (actors.length > 0) {
        const bounds = L.latLngBounds(actors.map((a) => [a.lat, a.lon] as [number, number]));
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const lonSpan = ne.lng - sw.lng;
        const latSpan = ne.lat - sw.lat;
        const worldwide = lonSpan > 50 || latSpan > 35;
        map.fitBounds(bounds.pad(worldwide ? 0.2 : 0.15), {
          padding: [32, 32],
          maxZoom: worldwide ? 3 : 8,
        });
      } else {
        map.fitBounds(worldBounds, { padding: [16, 16], maxZoom: 4 });
      }
      return;
    }

    if (actors.length > 0) {
      const bounds = L.latLngBounds(actors.map((a) => [a.lat, a.lon] as [number, number]));
      if (radiusKm) {
        bounds.extend([center.lat, center.lon]);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    } else {
      map.setView([center.lat, center.lon], 6);
    }
  }, [
    actorKey,
    actors,
    center.lat,
    center.lon,
    fitGlobal,
    worldBounds,
    radiusKm,
    actorTypeLabels,
    popupViewSheetLabel,
  ]);

  return (
    <div
      ref={containerRef}
      className={`h-[min(420px,55vh)] w-full border border-white/[0.08] ${className}`}
    />
  );
}
