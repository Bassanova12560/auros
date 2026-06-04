"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  escapeHtmlAttr,
  greenMarketActorSheetHref,
} from "@/lib/green/market/actor-routes";
import { globalLatLngBounds } from "@/lib/green/market/geo";
import { greenMarketMarkerHtml } from "@/lib/green/market/markers";
import type { GreenMarketActor, GreenMarketActorType } from "@/lib/green/market/types";
import { GREEN_MARKET_CENTER } from "@/lib/green/market/types";
import { formatGreenMarketLocation } from "@/lib/green/market-i18n";

import { GreenMarketMapStaticFallback } from "./GreenMarketMapStaticFallback";

type Props = {
  actors: GreenMarketActor[];
  center?: { lat: number; lon: number };
  radiusKm?: number;
  actorTypeLabels?: Record<GreenMarketActorType, string>;
  popupViewSheetLabel?: string;
  mapAriaLabel?: string;
  fitGlobal?: boolean;
  /** @deprecated Use fitGlobal */
  fitFrance?: boolean;
  className?: string;
};

const MAP_SHELL_CLASS =
  "green-market-map h-[min(420px,55vh)] min-h-[400px] w-full touch-pan-x touch-pan-y border border-white/[0.08]";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function scheduleInvalidateSize(map: import("leaflet").Map) {
  requestAnimationFrame(() => {
    map.invalidateSize({ animate: false });
  });
}

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
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const circleRef = useRef<import("leaflet").Circle | null>(null);
  const isMobileRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      isMobileRef.current = mq.matches;
      setIsMobile(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const worldBoundsKey = useMemo(() => globalLatLngBounds().join(","), []);

  const actorKey = useMemo(
    () => actors.map((a) => a.id).join(","),
    [actors]
  );

  useEffect(() => {
    if (mapFailed || !containerRef.current || mapRef.current) return;

    let cancelled = false;
    let tileErrors = 0;
    let loadTimeout: ReturnType<typeof setTimeout> | undefined;

    void (async () => {
      try {
        const L = (await import("leaflet")).default;
        if (cancelled || !containerRef.current) return;

        const [[swLat, swLon], [neLat, neLon]] = globalLatLngBounds();
        const worldBounds = L.latLngBounds([swLat, swLon], [neLat, neLon]);

        const map = L.map(containerRef.current, {
          center: [center.lat, center.lon],
          zoom: fitGlobal ? 3 : 6,
          scrollWheelZoom: true,
          attributionControl: true,
          zoomControl: false,
          minZoom: fitGlobal ? 2 : 4,
          maxZoom: 18,
          worldCopyJump: true,
        });

        L.control
          .zoom({ position: isMobileRef.current ? "bottomright" : "topright" })
          .addTo(map);

        const tiles = L.tileLayer(TILE_URL, {
          attribution: TILE_ATTRIBUTION,
          subdomains: "abcd",
          maxZoom: 19,
        });

        tiles.on("tileerror", () => {
          tileErrors += 1;
          if (tileErrors >= 12 && !cancelled) {
            setMapFailed(true);
            map.remove();
            mapRef.current = null;
          }
        });

        tiles.addTo(map);

        const initPad: [number, number] = isMobileRef.current ? [20, 20] : [12, 12];
        if (fitGlobal) {
          map.fitBounds(worldBounds, { padding: initPad, maxZoom: 4 });
        }

        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        map.whenReady(() => {
          if (cancelled) return;
          scheduleInvalidateSize(map);
          setMapReady(true);
        });

        loadTimeout = setTimeout(() => {
          if (!cancelled && tileErrors >= 12) {
            setMapFailed(true);
            map.remove();
            mapRef.current = null;
            layerRef.current = null;
          }
        }, 12000);
      } catch {
        if (!cancelled) setMapFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (loadTimeout) clearTimeout(loadTimeout);
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      circleRef.current = null;
      setMapReady(false);
    };
  }, [center.lat, center.lon, fitGlobal, worldBoundsKey, mapFailed]);

  useEffect(() => {
    if (!mapReady || mapFailed || !containerRef.current) return;

    const map = mapRef.current;
    if (!map) return;

    const ro = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    ro.observe(containerRef.current);

    const onResize = () => map.invalidateSize({ animate: false });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [mapReady, mapFailed]);

  useEffect(() => {
    if (!mapReady || mapFailed) return;

    void (async () => {
      const L = (await import("leaflet")).default;
      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;

      const [[swLat, swLon], [neLat, neLon]] = globalLatLngBounds();
      const worldBounds = L.latLngBounds([swLat, swLon], [neLat, neLon]);

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
          const bounds = L.latLngBounds(
            actors.map((a) => [a.lat, a.lon] as [number, number])
          );
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
        scheduleInvalidateSize(map);
        return;
      }

      if (actors.length > 0) {
        const bounds = L.latLngBounds(
          actors.map((a) => [a.lat, a.lon] as [number, number])
        );
        if (radiusKm) {
          bounds.extend([center.lat, center.lon]);
        }
        const pad: [number, number] = isMobile ? [48, 24] : [40, 40];
        map.fitBounds(bounds, { padding: pad, maxZoom: 10 });
      } else {
        map.setView([center.lat, center.lon], 6);
      }
      scheduleInvalidateSize(map);
    })();
  }, [
    mapReady,
    mapFailed,
    actorKey,
    actors,
    center.lat,
    center.lon,
    fitGlobal,
    radiusKm,
    actorTypeLabels,
    popupViewSheetLabel,
    isMobile,
  ]);

  if (mapFailed) {
    return (
      <GreenMarketMapStaticFallback
        actors={actors}
        actorTypeLabels={actorTypeLabels}
        mapAriaLabel={mapAriaLabel}
        className={`${MAP_SHELL_CLASS} ${className}`}
      />
    );
  }

  return (
    <div className={`relative ${MAP_SHELL_CLASS} ${className}`}>
      <div
        ref={containerRef}
        role="region"
        aria-label={mapAriaLabel}
        className="absolute inset-0 z-10 h-full w-full"
      />
      {!mapReady ? (
        <GreenMarketMapStaticFallback
          actors={actors}
          actorTypeLabels={actorTypeLabels}
          mapAriaLabel={mapAriaLabel}
          className="absolute inset-0 z-20"
        />
      ) : null}
    </div>
  );
}
