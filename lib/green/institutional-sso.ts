/**
 * SSO SAML / OIDC tenant checklist — sales + ops runbook (no IdP broker).
 */

export type SsoTenantStatus = "draft" | "configured" | "live";

export type SsoTenantRecord = {
  tenantId: string;
  displayName: string;
  clerkOrgId?: string;
  domains: string[];
  idpProtocol: "saml" | "oidc";
  status: SsoTenantStatus;
  notes?: string;
};

export const SSO_RUNBOOK_STEPS = [
  {
    id: "clerk_enterprise",
    titleFr: "Activer Clerk Enterprise (SAML/OIDC)",
    titleEn: "Enable Clerk Enterprise (SAML/OIDC)",
  },
  {
    id: "create_org",
    titleFr: "Créer l’Organization Clerk du tenant",
    titleEn: "Create the tenant Clerk Organization",
  },
  {
    id: "configure_idp",
    titleFr: "Brancher l’IdP client (metadata SAML ou OIDC)",
    titleEn: "Connect client IdP (SAML metadata or OIDC)",
  },
  {
    id: "allowlist",
    titleFr: "Allowlist domaines + orgId (env AUROS_*)",
    titleEn: "Allowlist domains + orgId (AUROS_* env)",
  },
  {
    id: "desk_smoke",
    titleFr: "Smoke test /green/portfolio/desk + airgap export",
    titleEn: "Smoke-test /green/portfolio/desk + airgap export",
  },
] as const;

function parseTenantsJson(raw: string | undefined): SsoTenantRecord[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        const tenantId = String(r.tenantId ?? r.id ?? "")
          .trim()
          .toLowerCase()
          .slice(0, 40);
        const displayName = String(r.displayName ?? r.name ?? "").trim();
        if (!tenantId || !displayName) return null;
        const statusRaw = String(r.status ?? "draft");
        const status: SsoTenantStatus =
          statusRaw === "live" || statusRaw === "configured"
            ? statusRaw
            : "draft";
        const protocol = String(r.idpProtocol ?? r.protocol ?? "saml");
        return {
          tenantId,
          displayName: displayName.slice(0, 80),
          clerkOrgId: r.clerkOrgId
            ? String(r.clerkOrgId).trim()
            : undefined,
          domains: Array.isArray(r.domains)
            ? (r.domains as unknown[])
                .map((d) => String(d).trim().toLowerCase())
                .filter((d) => d.includes("."))
            : [],
          idpProtocol: protocol === "oidc" ? "oidc" : "saml",
          status,
          notes: r.notes ? String(r.notes).slice(0, 200) : undefined,
        } satisfies SsoTenantRecord;
      })
      .filter((t): t is SsoTenantRecord => Boolean(t));
  } catch {
    return [];
  }
}

export function listSsoTenants(
  envJson = process.env.AUROS_SSO_TENANTS
): SsoTenantRecord[] {
  return parseTenantsJson(envJson);
}

export function resolveSsoTenant(
  tenantId: string,
  tenants = listSsoTenants()
): SsoTenantRecord | null {
  const id = tenantId.trim().toLowerCase();
  return tenants.find((t) => t.tenantId === id) ?? null;
}
