/** BIM / ERP / webhook connector contracts — export-first, not native plugins. */

export const CONNECTORS_ROUTE = "/integrations";
export const CONNECTORS_SCHEMAS_ROUTE = "/integrations/schemas";

export type ConnectorSpec = {
  id: string;
  label: string;
  kind: "export_json" | "webhook" | "openapi";
  summary: string;
  path: string;
  sample_payload?: Record<string, unknown>;
};

export const CONNECTOR_SPECS: ConnectorSpec[] = [
  {
    id: "welhr_export",
    label: "Export WELHR → ERP / GRC",
    kind: "export_json",
    summary: "POST legal-risk puis pousser le JSON vers votre GRC (ServiceNow, SAP GRC…).",
    path: "/api/green/eau/legal-risk",
    sample_payload: {
      text: "Data center AI, Michigan, cooling towers, water contract review",
      region: "Michigan",
      asset_hint: "data_center",
    },
  },
  {
    id: "playbook_export",
    label: "Export playbook continuité",
    kind: "export_json",
    summary: "Scénarios CAPEX/OPEX pour dossier board / ERP projet.",
    path: "/api/green/eau/continuity-playbook",
    sample_payload: {
      text: "AI campus 100MW cooling, community hearings",
      region: "Michigan",
      mw_it: 100,
      cooling: "tower",
      project_label: "Meridian North",
    },
  },
  {
    id: "resilience_brief",
    label: "Resilience brief → dashboard BI",
    kind: "export_json",
    summary: "Score + 3 priorités pour Power BI / Looker / Notion.",
    path: "/api/green/eau/resilience-brief",
    sample_payload: {
      text: "Hyperscale cooling Arizona stress",
      region: "Arizona",
      asset_hint: "data_center",
    },
  },
  {
    id: "supplier_esg",
    label: "Supplier ESG screen",
    kind: "export_json",
    summary: "Hygiène de claim fournisseur avant onboarding ERP achats.",
    path: "/api/green/eau/supplier-screen",
    sample_payload: {
      supplier_name: "CoolTech Cooling SARL",
      claim_text: "100% green cooling, CSRD ready, GO certificates",
      evidence_urls: [],
    },
  },
  {
    id: "webhook_inbound",
    label: "Webhook inbound (placeholder)",
    kind: "webhook",
    summary:
      "POST JSON depuis BIM/ERP vers votre middleware → appels AUROS. Pas de connecteur Autodesk/SAP natif day-one.",
    path: "/api/green/eau/resilience",
    sample_payload: {
      event: "project.updated",
      project_id: "erp-123",
      region: "Michigan",
      mw_it: 80,
    },
  },
  {
    id: "openapi",
    label: "Green OpenAPI",
    kind: "openapi",
    summary: "Spécification machine pour générateurs de clients.",
    path: "/api/green/openapi",
  },
];

export const CONNECTORS_DISCLAIMER =
  "Intégrations export / webhook — pas de plugins BIM Autodesk ou modules SAP certifiés. Friction réduite via JSON + OpenAPI ; connecteurs natifs = chantier enterprise.";
