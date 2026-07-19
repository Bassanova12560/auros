import type { OcpiCdrStub } from "../ocpi-stub";
import {
  PARTNER_FORMAT_DISCLAIMER,
  type ChargeflowPartnerConnector,
  type ChargeflowPartnerCredentials,
  type PartnerFetchResult,
} from "./types";

const DEFAULT_TESLA_BASE = "https://fleet-api.prd.eu.vn.cloud.tesla.com";

function energyKwhFromWh(wh: unknown): number | null {
  if (typeof wh !== "number" || !Number.isFinite(wh) || wh <= 0) return null;
  return Math.round((wh / 1000) * 1000) / 1000;
}

/** Map Tesla Fleet-like charge history rows → OCPI CDR stubs. */
export function mapTeslaChargeRowsToCdrs(
  rows: Record<string, unknown>[],
  opts?: { vin?: string; limit?: number }
): OcpiCdrStub[] {
  const limit = opts?.limit ?? 50;
  const out: OcpiCdrStub[] = [];
  for (const row of rows) {
    if (out.length >= limit) break;
    const chargeId =
      String(row.chargeId ?? row.charge_id ?? row.session_id ?? row.id ?? "").trim();
    const start = String(
      row.chargeStartDateTime ??
        row.charge_start_date_time ??
        row.started_at ??
        row.start_date_time ??
        ""
    ).trim();
    const end = String(
      row.chargeStopDateTime ??
        row.charge_stop_date_time ??
        row.ended_at ??
        row.end_date_time ??
        ""
    ).trim();
    const kwhDirect =
      typeof row.energy_kwh === "number"
        ? row.energy_kwh
        : typeof row.kwh === "number"
          ? row.kwh
          : null;
    const fromWh = energyKwhFromWh(
      row.energyAddedWh ?? row.energy_added_wh ?? row.chargeEnergyAdded
    );
    const energy = kwhDirect && kwhDirect > 0 ? kwhDirect : fromWh;
    if (!chargeId || !start || !end || energy == null || energy <= 0) continue;

    const vin = String(opts?.vin ?? row.vin ?? row.vehicle_vin ?? "").trim();
    out.push({
      id: chargeId.slice(0, 128),
      start_date_time: start.slice(0, 40),
      end_date_time: end.slice(0, 40),
      total_energy: energy,
      country: String(row.country ?? "FR").slice(0, 64) || "FR",
      location_id: String(row.siteLocationId ?? row.location_id ?? "tesla_site")
        .slice(0, 128),
      connector_id: row.connector_id
        ? String(row.connector_id).slice(0, 128)
        : undefined,
      cpo_id: "tesla_fleet",
      auth_id: vin ? vin.slice(0, 128) : undefined,
    });
  }
  return out;
}

export function teslaSandboxFixtures(limit: number): OcpiCdrStub[] {
  const stamp = Date.now();
  const rows: Record<string, unknown>[] = [
    {
      chargeId: `tesla-sandbox-${stamp}-a`,
      chargeStartDateTime: "2026-07-18T08:12:00Z",
      chargeStopDateTime: "2026-07-18T08:54:00Z",
      energyAddedWh: 42_500,
      vin: "5YJ3E1EA0KF000001",
      country: "FR",
      siteLocationId: "SC-PARIS-01",
    },
    {
      chargeId: `tesla-sandbox-${stamp}-b`,
      chargeStartDateTime: "2026-07-19T14:00:00Z",
      chargeStopDateTime: "2026-07-19T14:35:00Z",
      energyAddedWh: 28_200,
      vin: "5YJ3E1EA0KF000002",
      country: "FR",
      siteLocationId: "SC-LYON-02",
    },
    {
      chargeId: `tesla-sandbox-${stamp}-c`,
      chargeStartDateTime: "2026-07-19T19:10:00Z",
      chargeStopDateTime: "2026-07-19T19:48:00Z",
      kwh: 51.3,
      vin: "5YJ3E1EA0KF000001",
      country: "BE",
      siteLocationId: "SC-BRU-01",
    },
  ];
  return mapTeslaChargeRowsToCdrs(rows, { limit });
}

async function fetchTeslaLive(
  credentials: ChargeflowPartnerCredentials,
  limit: number
): Promise<PartnerFetchResult> {
  const token = credentials.access_token?.trim();
  if (!token) {
    return {
      ok: false,
      code: "credentials_required",
      message:
        "Live Tesla Fleet sync requires credentials.access_token (Bearer from Tesla Fleet API).",
      status: 400,
    };
  }

  const base = (credentials.base_url?.trim() || DEFAULT_TESLA_BASE).replace(
    /\/$/,
    ""
  );
  const vin = credentials.vin?.trim();
  const url = vin
    ? `${base}/api/1/vehicles/${encodeURIComponent(vin)}/charge_history?limit=${limit}`
    : `${base}/api/1/dx/charging/history?limit=${limit}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    return {
      ok: false,
      code: "upstream_unreachable",
      message: `Tesla Fleet API unreachable: ${e instanceof Error ? e.message : "network error"}`,
      status: 502,
    };
  }

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      code: "upstream_unauthorized",
      message: "Tesla Fleet API rejected the access_token.",
      status: 502,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      code: "upstream_error",
      message: `Tesla Fleet API returned HTTP ${res.status}. Register a Fleet app and use a valid token, or sync sandbox / POST sessions.`,
      status: 502,
    };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return {
      ok: false,
      code: "upstream_invalid_json",
      message: "Tesla Fleet API returned non-JSON body.",
      status: 502,
    };
  }

  const root = json as Record<string, unknown>;
  const response = (root.response ?? root.data ?? root) as Record<
    string,
    unknown
  >;
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response.charges)
      ? response.charges
      : Array.isArray(response.data)
        ? response.data
        : Array.isArray(root.charges)
          ? root.charges
          : [];

  const cdrs = mapTeslaChargeRowsToCdrs(
    list as Record<string, unknown>[],
    { vin, limit }
  );
  if (cdrs.length === 0) {
    return {
      ok: false,
      code: "no_sessions",
      message: "Tesla Fleet response contained no mappable charge sessions.",
      status: 422,
    };
  }
  return { ok: true, cdrs, source: "tesla_fleet_live" };
}

export const teslaFleetConnector: ChargeflowPartnerConnector = {
  id: "tesla_fleet",
  catalog: {
    id: "tesla_fleet",
    label: "Tesla Fleet (format-compatible)",
    description:
      "Maps Tesla Fleet-style charge history (Wh / kWh, VIN, chargeId) to CFU-E.",
    modes: ["sandbox", "live"],
    credential_fields: ["access_token", "vin?", "base_url?"],
    disclaimer: PARTNER_FORMAT_DISCLAIMER,
  },
  async fetchSessions({ mode, credentials, sessions, limit }) {
    if (mode === "sandbox") {
      if (sessions?.length) {
        const cdrs = mapTeslaChargeRowsToCdrs(sessions, {
          vin: credentials?.vin,
          limit,
        });
        if (cdrs.length === 0) {
          return {
            ok: false,
            code: "no_sessions",
            message: "Sandbox sessions array had no mappable Tesla rows.",
            status: 422,
          };
        }
        return { ok: true, cdrs, source: "tesla_fleet_sandbox_sessions" };
      }
      return {
        ok: true,
        cdrs: teslaSandboxFixtures(limit),
        source: "tesla_fleet_sandbox",
      };
    }

    if (sessions?.length && credentials?.access_token?.trim()) {
      const cdrs = mapTeslaChargeRowsToCdrs(sessions, {
        vin: credentials.vin,
        limit,
      });
      if (cdrs.length === 0) {
        return {
          ok: false,
          code: "no_sessions",
          message: "Live sessions array had no mappable Tesla rows.",
          status: 422,
        };
      }
      return { ok: true, cdrs, source: "tesla_fleet_live_push" };
    }

    return fetchTeslaLive(credentials ?? {}, limit);
  },
};
