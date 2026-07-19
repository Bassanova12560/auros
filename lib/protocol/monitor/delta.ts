import {
  filterFeedForMonitor,
  REGULATORY_RULES_VERSION,
  type RegulatoryFeedItem,
} from "@/lib/protocol/regulatory/feed";

export { REGULATORY_RULES_VERSION };

export type MonitorTwinSnapshot = {
  jurisdiction: string;
  asset_type: string;
  alert_on: string[];
  rules_version: string | null;
  baseline_feed_ids: string[] | null;
};

export type RegulatoryDeltaItem = {
  id: string;
  title: string;
  source: string;
  published_at: string;
  severity: RegulatoryFeedItem["severity"];
  event_type: string;
  impact_on_score: number;
  url: string;
  summary: string;
};

export type RegulatoryDeltaResult = {
  rules_version: string;
  monitor_rules_version: string | null;
  rules_version_changed: boolean;
  item_count: number;
  impact_sum: number;
  items: RegulatoryDeltaItem[];
};

/** Feed ids matched to the monitor profile at creation (Twin baseline). */
export function baselineFeedIdsForMonitor(monitor: {
  jurisdiction: string;
  asset_type: string;
  alert_on: string[];
}): string[] {
  return filterFeedForMonitor(monitor).map((item) => item.id);
}

/**
 * Regulatory Twin lite — items matching the monitor that are not in the
 * creation baseline (new curated feed entries since snapshot).
 */
export function computeMonitorRegulatoryDelta(
  monitor: MonitorTwinSnapshot
): RegulatoryDeltaResult {
  const matched = filterFeedForMonitor(monitor);
  const baseline = new Set(monitor.baseline_feed_ids ?? []);
  const deltaItems =
    monitor.baseline_feed_ids == null
      ? []
      : matched.filter((item) => !baseline.has(item.id));

  const items: RegulatoryDeltaItem[] = deltaItems.map((item) => ({
    id: item.id,
    title: item.title,
    source: item.source,
    published_at: item.published_at,
    severity: item.severity,
    event_type: item.event_type,
    impact_on_score: item.impact_on_score,
    url: item.url,
    summary: item.summary,
  }));

  const impact_sum = items.reduce((sum, item) => sum + item.impact_on_score, 0);
  const monitorVersion = monitor.rules_version;

  return {
    rules_version: REGULATORY_RULES_VERSION,
    monitor_rules_version: monitorVersion,
    rules_version_changed:
      monitorVersion != null && monitorVersion !== REGULATORY_RULES_VERSION,
    item_count: items.length,
    impact_sum,
    items,
  };
}
