import type { OcpiCdrStub } from "../ocpi-stub";
import { ocpiCdrStubSchema } from "../ocpi-stub";
import {
  PARTNER_FORMAT_DISCLAIMER,
  type ChargeflowPartnerConnector,
  type ChargeflowPartnerCredentials,
  type PartnerFetchResult,
} from "./types";

function mapOcpiLikeRows(
  rows: unknown[],
  opts?: { party_id?: string; limit?: number }
): OcpiCdrStub[] {
  const limit = opts?.limit ?? 50;
  const out: OcpiCdrStub[] = [];
  for (const raw of rows) {
    if (out.length >= limit) break;
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const candidate = {
      id: String(row.id ?? row.cdr_id ?? row.session_id ?? "").trim(),
      start_date_time: String(
        row.start_date_time ?? row.start_date ?? row.started_at ?? ""
      ).trim(),
      end_date_time: String(
        row.end_date_time ?? row.end_date ?? row.ended_at ?? ""
      ).trim(),
      total_energy:
        typeof row.total_energy === "number"
          ? row.total_energy
          : typeof row.energy_kwh === "number"
            ? row.energy_kwh
            : Number.NaN,
      country: row.country ? String(row.country) : "FR",
      location_id: row.location_id
        ? String(row.location_id)
        : row.location && typeof row.location === "object"
          ? String((row.location as { id?: string }).id ?? "")
          : undefined,
      evse_uid: row.evse_uid ? String(row.evse_uid) : undefined,
      connector_id: row.connector_id ? String(row.connector_id) : undefined,
      cpo_id: row.cpo_id
        ? String(row.cpo_id)
        : opts?.party_id
          ? opts.party_id
          : "total_energies",
      party_id: row.party_id
        ? String(row.party_id)
        : opts?.party_id,
      auth_id: row.auth_id
        ? String(row.auth_id)
        : row.cdr_token && typeof row.cdr_token === "object"
          ? String((row.cdr_token as { uid?: string }).uid ?? "")
          : undefined,
    };
    const parsed = ocpiCdrStubSchema.safeParse(candidate);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

export function totalEnergiesSandboxFixtures(limit: number): OcpiCdrStub[] {
  const stamp = Date.now();
  return mapOcpiLikeRows(
    [
      {
        id: `TE-CDR-${stamp}-1`,
        start_date_time: "2026-07-17T09:00:00Z",
        end_date_time: "2026-07-17T09:41:00Z",
        total_energy: 33.4,
        country: "FR",
        location_id: "TOTAL-STATION-PARIS-12",
        party_id: "FR*TOT",
        cpo_id: "total_energies",
        auth_id: "RFID-TE-1001",
      },
      {
        id: `TE-CDR-${stamp}-2`,
        start_date_time: "2026-07-18T16:20:00Z",
        end_date_time: "2026-07-18T17:05:00Z",
        total_energy: 47.8,
        country: "FR",
        location_id: "TOTAL-STATION-LYON-03",
        party_id: "FR*TOT",
        cpo_id: "total_energies",
      },
    ],
    { party_id: "FR*TOT", limit }
  );
}

async function fetchTotalLive(
  credentials: ChargeflowPartnerCredentials,
  limit: number
): Promise<PartnerFetchResult> {
  const token = credentials.token?.trim() || credentials.access_token?.trim();
  const baseUrl = credentials.base_url?.trim();
  if (!token || !baseUrl) {
    return {
      ok: false,
      code: "credentials_required",
      message:
        "Live Total Energies OCPI sync requires credentials.base_url and credentials.token (or access_token).",
      status: 400,
    };
  }

  const base = baseUrl.replace(/\/$/, "");
  const url = `${base}/ocpi/cpo/2.2/cdrs?limit=${limit}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    return {
      ok: false,
      code: "upstream_unreachable",
      message: `OCPI CDR endpoint unreachable: ${e instanceof Error ? e.message : "network error"}`,
      status: 502,
    };
  }

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      code: "upstream_unauthorized",
      message: "OCPI endpoint rejected the token.",
      status: 502,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      code: "upstream_error",
      message: `OCPI CDR endpoint returned HTTP ${res.status}.`,
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
      message: "OCPI endpoint returned non-JSON body.",
      status: 502,
    };
  }

  const root = json as Record<string, unknown>;
  const data = root.data ?? root.cdrs ?? root;
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { cdrs?: unknown[] }).cdrs)
      ? (data as { cdrs: unknown[] }).cdrs
      : [];

  const cdrs = mapOcpiLikeRows(list, {
    party_id: credentials.party_id,
    limit,
  });
  if (cdrs.length === 0) {
    return {
      ok: false,
      code: "no_sessions",
      message: "OCPI response contained no mappable CDRs.",
      status: 422,
    };
  }
  return { ok: true, cdrs, source: "total_energies_live" };
}

export const totalEnergiesConnector: ChargeflowPartnerConnector = {
  id: "total_energies",
  catalog: {
    id: "total_energies",
    label: "TotalEnergies OCPI (format-compatible)",
    description:
      "Maps TotalEnergies-style / generic OCPI CDRs to CFU-E units.",
    modes: ["sandbox", "live"],
    credential_fields: ["base_url", "token", "party_id?"],
    disclaimer: PARTNER_FORMAT_DISCLAIMER,
  },
  async fetchSessions({ mode, credentials, sessions, limit }) {
    if (mode === "sandbox") {
      if (sessions?.length) {
        const cdrs = mapOcpiLikeRows(sessions, {
          party_id: credentials?.party_id ?? "FR*TOT",
          limit,
        });
        if (cdrs.length === 0) {
          return {
            ok: false,
            code: "no_sessions",
            message: "Sandbox sessions had no mappable OCPI CDRs.",
            status: 422,
          };
        }
        return { ok: true, cdrs, source: "total_energies_sandbox_sessions" };
      }
      return {
        ok: true,
        cdrs: totalEnergiesSandboxFixtures(limit),
        source: "total_energies_sandbox",
      };
    }

    if (sessions?.length && (credentials?.token || credentials?.access_token)) {
      const cdrs = mapOcpiLikeRows(sessions, {
        party_id: credentials?.party_id,
        limit,
      });
      if (cdrs.length === 0) {
        return {
          ok: false,
          code: "no_sessions",
          message: "Live sessions had no mappable OCPI CDRs.",
          status: 422,
        };
      }
      return { ok: true, cdrs, source: "total_energies_live_push" };
    }

    return fetchTotalLive(credentials ?? {}, limit);
  },
};
