import { ocpiCdrStubSchema, type OcpiCdrStub } from "../ocpi-stub";
import {
  PARTNER_FORMAT_DISCLAIMER,
  type ChargeflowPartnerConnector,
} from "./types";

function genericSandboxFixtures(limit: number): OcpiCdrStub[] {
  const stamp = Date.now();
  return [
    {
      id: `OCPI-GEN-${stamp}-1`,
      start_date_time: "2026-07-19T10:00:00Z",
      end_date_time: "2026-07-19T10:40:00Z",
      total_energy: 22.5,
      country: "FR",
      location_id: "GEN-LOC-1",
      cpo_id: "generic_cpo",
      party_id: "FR*GEN",
    },
    {
      id: `OCPI-GEN-${stamp}-2`,
      start_date_time: "2026-07-19T12:00:00Z",
      end_date_time: "2026-07-19T12:55:00Z",
      total_energy: 39.1,
      country: "DE",
      location_id: "GEN-LOC-2",
      cpo_id: "generic_cpo",
      party_id: "DE*GEN",
    },
  ].slice(0, limit);
}

function parseSessions(
  sessions: Record<string, unknown>[],
  limit: number
): OcpiCdrStub[] {
  const out: OcpiCdrStub[] = [];
  for (const row of sessions) {
    if (out.length >= limit) break;
    const parsed = ocpiCdrStubSchema.safeParse(row);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

export const genericOcpiConnector: ChargeflowPartnerConnector = {
  id: "generic_ocpi",
  catalog: {
    id: "generic_ocpi",
    label: "Generic OCPI CDR",
    description:
      "Sandbox OCPI CDRs or live pull from any OCPI CPO CDR endpoint.",
    modes: ["sandbox", "live"],
    credential_fields: ["base_url", "token", "party_id?"],
    disclaimer: PARTNER_FORMAT_DISCLAIMER,
  },
  async fetchSessions({ mode, credentials, sessions, limit }) {
    if (mode === "sandbox") {
      if (sessions?.length) {
        const cdrs = parseSessions(sessions, limit);
        if (cdrs.length === 0) {
          return {
            ok: false,
            code: "no_sessions",
            message: "Sandbox sessions had no valid OCPI CDR stubs.",
            status: 422,
          };
        }
        return { ok: true, cdrs, source: "generic_ocpi_sandbox_sessions" };
      }
      return {
        ok: true,
        cdrs: genericSandboxFixtures(limit),
        source: "generic_ocpi_sandbox",
      };
    }

    if (sessions?.length && (credentials?.token || credentials?.access_token)) {
      const cdrs = parseSessions(sessions, limit);
      if (cdrs.length === 0) {
        return {
          ok: false,
          code: "no_sessions",
          message: "Live sessions had no valid OCPI CDR stubs.",
          status: 422,
        };
      }
      return { ok: true, cdrs, source: "generic_ocpi_live_push" };
    }

    const token = credentials?.token?.trim() || credentials?.access_token?.trim();
    const baseUrl = credentials?.base_url?.trim();
    if (!token || !baseUrl) {
      return {
        ok: false,
        code: "credentials_required",
        message:
          "Live generic OCPI sync requires credentials.base_url and credentials.token (or access_token).",
        status: 400,
      };
    }

    const url = `${baseUrl.replace(/\/$/, "")}/ocpi/cpo/2.2/cdrs?limit=${limit}`;
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
        message: `OCPI endpoint unreachable: ${e instanceof Error ? e.message : "network error"}`,
        status: 502,
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        code: res.status === 401 || res.status === 403
          ? "upstream_unauthorized"
          : "upstream_error",
        message: `OCPI CDR endpoint returned HTTP ${res.status}.`,
        status: 502,
      };
    }

    const json = (await res.json()) as Record<string, unknown>;
    const data = json.data ?? json.cdrs ?? json;
    const list = Array.isArray(data) ? data : [];
    const cdrs = parseSessions(list as Record<string, unknown>[], limit);
    if (cdrs.length === 0) {
      return {
        ok: false,
        code: "no_sessions",
        message: "OCPI response contained no valid CDRs.",
        status: 422,
      };
    }
    return { ok: true, cdrs, source: "generic_ocpi_live" };
  },
};
