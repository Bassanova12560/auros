"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  /** Accessible name for the map region (WCAG landmark) */
  mapAriaLabel?: string;
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
  mapAriaLabel = "Green marketplace map",
  fitGlobal: fitGlobalProp,
  fitFrance = false,
  className = "",
}: Props) {
  const fitGlobal = fitGlobalProp ?? fitFrance;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

    const initPad: [number, number] = isMobile ? [20, 20] : [12, 12];
    if (fitGlobal) {
      map.fitBounds(worldBounds, { padding: initPad, maxZoom: 4 });
    }

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      circleRef.current = null;
    };
  }, [center.lat, center.lon, fitGlobal, worldBounds, isMobile]);

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
        .bindPopup(popupHtml, {
          maxWidth: isMobile ? 280 : 320,
          minWidth: isMobile ? 200 : 220,
          closeButton: true,
          autoPanPaddingTopLeft: isMobile ? [16, 16] : [12, 12],
          autoPanPaddingBottomRight: isMobile ? [16, 56] : [12, 12],
          className: "green-market-popup",
        })
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
        const pad: [number, number] = isMobile ? [48, 24] : [32, 32];
        map.fitBounds(bounds.pad(worldwide ? 0.2 : 0.15), {
          padding: pad,
          maxZoom: worldwide ? 3 : 8,
        });
      } else {
        const pad: [number, number] = isMobile ? [24, 20] : [16, 16];
        map.fitBounds(worldBounds, { padding: pad, maxZoom: 4 });
      }
      return;
    }

    if (actors.length > 0) {
      const bounds = L.latLngBounds(actors.map((a) => [a.lat, a.lon] as [number, number]));
      if (radiusKm) {
        bounds.extend([center.lat, center.lon]);
      }
      const pad: [number, number] = isMobile ? [48, 24] : [40, 40];
      map.fitBounds(bounds, { padding: pad, maxZoom: 10 });
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
    isMobile,
  ]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={mapAriaLabel}
      className={`h-[min(280px,42vh)] min-h-[240px] w-full touch-pan-x touch-pan-y border border-white/[0.08] sm:h-[min(380px,50vh)] md:h-[min(420px,55vh)] ${className}`}
    />
  );
}
