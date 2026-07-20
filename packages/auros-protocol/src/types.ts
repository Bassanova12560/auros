export type AssetType =
  | "real_estate"
  | "private_fund"
  | "bonds"
  | "private_credit"
  | "commodities"
  | "stablecoins"
  | "low_carbon_power"
  | "other";

export type IssuerType = "company_spv" | "existing_fund" | "individual" | "unsure";
export type AssetClass = "financial_instrument" | "art_utility" | "e_money" | "unsure";
export type EuNexus = "issuer_eu" | "asset_eu" | "investors_eu" | "no_eu" | "unsure";
export type WhitepaperStatus = "ready" | "draft" | "none" | "unsure";
export type InvestorType = "professional" | "retail" | "mixed" | "unsure";
export type ScoreStatus = "ready" | "progress" | "early";

export type MicaClassification =
  | "utility_token"
  | "asset_referenced_token"
  | "e_money_token"
  | "other_crypto_asset"
  | "financial_instrument"
  | "out_of_scope"
  | "uncertain";

export type ScoreRequest = {
  score_id?: string;
  monitor_id?: string;
  record_history?: boolean;
  description?: string;
  asset_type?: AssetType;
  issuer_type?: IssuerType;
  asset_class?: AssetClass;
  eu_nexus?: EuNexus;
  whitepaper?: WhitepaperStatus;
  investor_type?: InvestorType;
  value_eur?: number;
  jurisdiction?: string;
  has_kyc?: boolean;
  has_data_room?: boolean;
  documents_count?: number;
};

export type ScoreBreakdown = {
  legal_structure: number;
  kyc_aml: number;
  mica_compliance: number;
  data_room: number;
  investor_protection: number;
};

export type RecommendedJurisdiction = {
  id: string;
  score: number;
  rationale: string;
};

export type RecommendedPlatform = {
  id: string;
  name: string;
  category: string;
  apy: number;
};

export type ProtocolMeta = {
  version: "1.0";
  computed_at: string;
  request_id?: string;
};

export type ScoreHistoryEntry = {
  id: number;
  score: number;
  grade: string;
  status: ScoreStatus;
  breakdown: ScoreBreakdown;
  mica_classification: MicaClassification;
  request?: Record<string, unknown>;
  created_at: string;
};

export type ScoreHistoryResponse = {
  disclaimer: string;
  score_id: string;
  kind: "session" | "monitor";
  total: number;
  entries: ScoreHistoryEntry[];
  meta: ProtocolMeta;
};

export type ScoreResponse = {
  disclaimer: string;
  score_id?: string;
  history_url?: string;
  score: number;
  grade: string;
  status: ScoreStatus;
  breakdown: ScoreBreakdown;
  mica_classification: MicaClassification;
  critical_gaps: string[];
  recommendations: string[];
  recommended_jurisdictions: RecommendedJurisdiction[];
  recommended_platforms: RecommendedPlatform[];
  meta: ProtocolMeta & {
    full_report_url: string;
    parsed_keywords: string[];
  };
};

export type ScoreBatchRequest = {
  items: ScoreRequest[];
  record_history?: boolean;
};

export type ScoreBatchSuccessItem = ScoreResponse & {
  index: number;
  ok: true;
};

export type ScoreBatchErrorItem = {
  index: number;
  ok: false;
  error: { code: string; message: string };
};

export type ScoreBatchResultItem = ScoreBatchSuccessItem | ScoreBatchErrorItem;

export type ScoreBatchResponse = {
  disclaimer: string;
  total: number;
  succeeded: number;
  failed: number;
  items: ScoreBatchResultItem[];
  meta: ProtocolMeta;
};

export type ProductCategory =
  | "stablecoins"
  | "real_estate"
  | "bonds"
  | "commodities"
  | "private_credit"
  | "all";

export type ProductsQuery = {
  category?: ProductCategory;
  jurisdiction?: string;
  chain?: string;
  yield_min?: number;
  yield_max?: number;
  page?: number;
  limit?: number;
  sort?: "apy" | "tvl" | "name";
};

export type ProductItem = {
  id: string;
  name: string;
  platform: string;
  category: string;
  apy: number;
  tvl_usd: number;
  chains: string[];
  jurisdiction: string | null;
  affiliate_url: string;
  min_investment_usd: number | null;
  live: boolean;
};

export type ProductsResponse = {
  disclaimer: string;
  products: ProductItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  fetched_at: string;
};

export type CompareCellHighlight = "best" | "worst" | null;

export type RiskTier = "conservative" | "core" | "advanced";

export type CompareRequest = {
  product_ids?: string[];
  category?: ProductCategory;
  yield_min?: number;
  risk_tier?: RiskTier;
  jurisdiction?: string;
  limit?: number;
};

export type CompareProduct = ProductItem & {
  asset_class: string;
  sub_category: string;
  risk_tier: RiskTier;
  liquidity_days: number;
  fees: string;
  accredited_only: boolean;
};

export type CompareResponse = {
  disclaimer: string;
  mode: "product_ids" | "filter";
  products: CompareProduct[];
  comparison: {
    product_count: number;
    share_url: string;
    product_ids?: string[];
    filters?: {
      category: ProductCategory;
      yield_min?: number;
      risk_tier?: RiskTier;
      jurisdiction?: string;
      limit: number;
    };
    highlights: {
      apy: CompareCellHighlight[];
      tvl_usd: CompareCellHighlight[];
      min_investment_usd: CompareCellHighlight[];
      liquidity_days: CompareCellHighlight[];
    };
  };
  fetched_at: string;
  meta: ProtocolMeta;
};

export type JurisdictionsAssetType =
  | "real_estate"
  | "bonds"
  | "private_credit"
  | "funds"
  | "all";

export type JurisdictionsQuery = {
  asset_type?: JurisdictionsAssetType;
  investor_type?: "professional" | "retail" | "mixed" | "all";
  timeline_months?: number;
  budget?: number;
};

export type JurisdictionItem = {
  id: string;
  score: number;
  rationale: string;
  fee_min_eur: number;
  fee_max_eur: number;
  license_max_months: number;
  asset_types: string[];
  kyc_level: string;
};

export type JurisdictionsResponse = {
  disclaimer: string;
  jurisdictions: JurisdictionItem[];
  query: JurisdictionsQuery;
};

export type ChecklistRequest = {
  asset_type:
    | "real_estate"
    | "private_fund"
    | "bonds"
    | "private_credit"
    | "low_carbon_power";
  jurisdiction: string;
  structure?: "spv" | "fund" | "trust" | "other";
};

export type ChecklistItem = {
  id: string;
  category: string;
  title: string;
  regulatory_reference: string;
  required: boolean;
  estimated_time_days: number;
  estimated_cost_eur: number;
  dependencies: string[];
  auros_tip: string;
};

export type ChecklistResponse = {
  disclaimer: string;
  asset_type: string;
  jurisdiction: string;
  structure: string;
  items: ChecklistItem[];
  total_items: number;
  estimated_total_days: number;
  estimated_total_cost_eur: number;
};

export type CreateKeyRequest = {
  email: string;
};

export type CreateKeyResponse = {
  disclaimer: string;
  ok: boolean;
  api_key?: string;
  tier?: "free";
  monthly_limit?: number;
  message?: string;
};

export type ProtocolErrorBody = {
  disclaimer: string;
  error: {
    code: string;
    message: string;
  };
};

export type AurosProtocolOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type AlertType =
  | "score_change"
  | "regulation_update"
  | "new_requirement"
  | "deadline_approaching";

export type WebhookEventType =
  | AlertType
  | "regulatory.update"
  | "green.index.changelog"
  | "chargeflow.unit.minted"
  | "chargeflow.unit.retired";

export type MonitorRequest = {
  asset_type: AssetType;
  jurisdiction: string;
  structure?: "spv" | "fund" | "trust" | "other";
  webhook_url?: string;
  email?: string;
  alert_on?: AlertType[];
  baseline_score?: number;
};

export type MonitorResponse = {
  disclaimer: string;
  id: string;
  status: "active" | "paused";
  asset_type: string;
  jurisdiction: string;
  structure: string;
  alert_on: string[];
  webhook_url: string | null;
  email?: string | null;
  baseline_score?: number | null;
  created_at: string;
  pricing?: Record<string, unknown>;
};

export type DossierSection =
  | "executive_summary"
  | "score_breakdown"
  | "mica_classification"
  | "checklist"
  | "jurisdictions"
  | "platforms"
  | "disclaimers";

export type DossierRequest = {
  score_id?: string;
  score?: ScoreRequest;
  format?: "pdf" | "json" | "zip";
  sections?: DossierSection[];
  branding?: { company_name?: string; logo_url?: string };
  locale?: "fr" | "en" | "es";
};

export type DossierResponse = {
  disclaimer: string;
  dossier_id: string;
  format: string;
  download_url?: string;
  expires_in_hours?: number;
  filename?: string;
  full_report_url?: string;
  sections?: string[];
  data?: Record<string, unknown>;
};

export type AttestCreateRequest = {
  dossier_id?: string;
  score_id?: string;
  score?: ScoreRequest;
  sections?: DossierSection[];
  locale?: "fr" | "en" | "es";
};

export type AttestPublicSnapshot = {
  score: number;
  grade: string;
  status: string;
  mica_classification: string;
  sections: string[];
  generated_at: string;
};

export type AttestResponse = {
  id: string;
  content_hash: string;
  signature: string;
  verify_url: string;
  dossier_id: string;
  locale: string;
  public: AttestPublicSnapshot;
  created_at: string;
  disclaimer: string;
  valid: boolean;
};

export type AttestVerifyResponse = {
  valid: boolean;
  id?: string;
  content_hash?: string;
  signature?: string;
  reason?: string;
  disclaimer?: string;
  public?: AttestPublicSnapshot;
  verify_url?: string;
  dossier_id?: string;
  locale?: string;
  created_at?: string;
};

export type ChargeflowCreateRequest = {
  session: {
    external_session_id: string;
    started_at: string;
    ended_at: string;
    energy_kwh: number;
    operator_id?: string;
    source_format?: "ocpi" | "ocpp_summary" | "csv" | "json_custom";
    location?: { country?: string; site_id?: string; connector_id?: string };
    vehicle_ref?: string;
  };
  attributes?: {
    renewable_claim?: "none" | "go" | "rec" | "ppa_matched" | "unknown";
    generation_source?:
      | "solar"
      | "wind"
      | "hydro"
      | "nuclear"
      | "battery"
      | "mixed"
      | "unknown";
    grid_mix_note?: string;
    compare_ref_id?: string;
    reservation_id?: string;
  };
};

export type ChargeflowWCreateRequest = {
  flow: {
    external_flow_id: string;
    started_at: string;
    ended_at: string;
    volume_m3: number;
    operator_id?: string;
    source_format?: "csv" | "scada_summary" | "json_custom";
    location?: { country?: string; site_id?: string; basin_id?: string };
  };
  attributes?: {
    asset_class_hint?: string;
    compare_ref_id?: string;
    notes?: string;
  };
};

export type ChargeflowFCreateRequest = {
  window: {
    external_window_id: string;
    started_at: string;
    ended_at: string;
    capacity_kw: number;
    direction?: "up" | "down" | "both";
    operator_id?: string;
    source_format?: "csv" | "scada_summary" | "json_custom";
    location?: { country?: string; site_id?: string; asset_id?: string };
  };
  attributes?: {
    program_hint?: "fcr" | "afrr" | "mfrr" | "demand_response" | "unknown";
    compare_ref_id?: string;
    notes?: string;
  };
};

export type ChargeflowResponse = {
  id: string;
  unit_kind: "e" | "w" | "f";
  content_hash: string;
  signature: string;
  verify_url: string;
  status: "active" | "retired";
  retired_at?: string | null;
  retire_reason?: string | null;
  public: Record<string, unknown>;
  created_at: string;
  disclaimer: string;
  valid: boolean;
};

export type ChargeflowVerifyResponse = ChargeflowResponse | {
  valid: boolean;
  id?: string;
  content_hash?: string;
  signature?: string;
  reason?: string;
  disclaimer?: string;
};

export type ChargeflowListQuery = {
  kind?: "e" | "w" | "f";
  status?: "active" | "retired";
  operator_id?: string;
  limit?: number;
  offset?: number;
};

export type ChargeflowListItem = {
  id: string;
  unit_kind: "e" | "w" | "f";
  status: "active" | "retired";
  created_at: string;
  retired_at: string | null;
  operator_id: string | null;
  external_ref: string;
  content_hash: string;
  energy_kwh?: number;
  volume_m3?: number;
  capacity_kw?: number;
};

export type ChargeflowListResponse = {
  total: number;
  limit: number;
  offset: number;
  items: ChargeflowListItem[];
  meta?: ProtocolMeta;
};

export type ChargeflowBatchRequestE = {
  items: ChargeflowCreateRequest[];
};

export type ChargeflowBatchRequestW = {
  items: ChargeflowWCreateRequest[];
};

export type ChargeflowBatchRequestF = {
  items: ChargeflowFCreateRequest[];
};

export type ChargeflowBatchSuccessItem = ChargeflowResponse & {
  index: number;
  ok: true;
};

export type ChargeflowBatchErrorItem = {
  index: number;
  ok: false;
  error: { code: string; message: string };
};

export type ChargeflowBatchResponse = {
  total: number;
  succeeded: number;
  failed: number;
  items: Array<ChargeflowBatchSuccessItem | ChargeflowBatchErrorItem>;
  meta?: ProtocolMeta;
};

export type ChargeflowFromOcpiRequest = {
  cdrs?: Array<{
    id: string;
    start_date_time: string;
    end_date_time: string;
    total_energy: number;
    country?: string;
    location_id?: string;
    evse_uid?: string;
    connector_id?: string;
    cpo_id?: string;
    party_id?: string;
    auth_id?: string;
  }>;
  csv_rows?: Array<{
    external_session_id: string;
    started_at: string;
    ended_at: string;
    energy_kwh: number;
    country?: string;
    site_id?: string;
    connector_id?: string;
    operator_id?: string;
    vehicle_ref?: string;
  }>;
  default_operator_id?: string;
  attributes?: ChargeflowCreateRequest["attributes"];
};

export type ChargeflowFromOcpiResponse = ChargeflowBatchResponse & {
  source: "ocpi_stub";
  disclaimer: string;
};

export type ChargeflowPartnerId =
  | "tesla_fleet"
  | "total_energies"
  | "generic_ocpi";

export type ChargeflowPartnerCatalogEntry = {
  id: ChargeflowPartnerId;
  label: string;
  description: string;
  modes: Array<"sandbox" | "live">;
  credential_fields: string[];
  disclaimer: string;
};

export type ChargeflowPartnersListResponse = {
  disclaimer: string;
  partners: ChargeflowPartnerCatalogEntry[];
};

export type ChargeflowPartnerSyncRequest = {
  partner: ChargeflowPartnerId;
  mode?: "sandbox" | "live";
  operator_id?: string;
  limit?: number;
  credentials?: {
    access_token?: string;
    vin?: string;
    base_url?: string;
    token?: string;
    party_id?: string;
  };
  sessions?: Record<string, unknown>[];
};

export type ChargeflowPartnerSyncResponse = ChargeflowBatchResponse & {
  partner: ChargeflowPartnerId;
  mode: "sandbox" | "live";
  source: string;
  disclaimer: string;
};

export type WebhookRegisterRequest = {
  url: string;
  events?: WebhookEventType[];
};

export type WebhookItem = {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
};

export type WebhooksListResponse = {
  disclaimer: string;
  webhooks: WebhookItem[];
  total: number;
};

export type WebhookRegisterResponse = {
  disclaimer: string;
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  signature_header: string;
  signature_algorithm: string;
};

export type WattScoreTier = "high" | "mid" | "early";

export type WattScore = {
  rating: number;
  lifetime_gwh: number | null;
  energy_value_eur: number | null;
  tier: WattScoreTier;
};

export type CarbonQualityTier = "premium" | "acceptable" | "caution" | "avoid";

export type CarbonQualityScore = {
  score: number;
  tier: CarbonQualityTier;
  registry?: string;
  ccp_aligned?: boolean | null;
  priority_keys?: string[];
};

export type GreenWattPublicResponse = {
  ok: true;
  id: string;
  name: string;
  watt_score: WattScore;
  disclaimer: string;
  batch_api: string;
  companion_api?: string;
  docs: string;
  generated_at: string;
};

export type GreenCqsPublicResponse = {
  ok: true;
  id: string;
  name: string;
  carbon_quality: CarbonQualityScore;
  disclaimer: string;
  batch_api: string;
  companion_api?: string;
  docs: string;
  generated_at: string;
};

export type GreenBatchItemInput = {
  id?: string;
  text?: string;
};

export type GreenWattBatchRequest = {
  items: GreenBatchItemInput[];
};

export type GreenCqsBatchRequest = {
  items: GreenBatchItemInput[];
};

export type GreenBatchErrorItem = {
  index: number;
  ok: false;
  error: { code: string; message: string };
};

export type GreenWattBatchSuccessItem = {
  index: number;
  ok: true;
  id: string | null;
  watt_score: WattScore;
};

export type GreenCqsBatchSuccessItem = {
  index: number;
  ok: true;
  id: string | null;
  carbon_quality: CarbonQualityScore;
};

export type GreenWattBatchResponse = {
  disclaimer: string;
  total: number;
  succeeded: number;
  failed: number;
  items: Array<GreenWattBatchSuccessItem | GreenBatchErrorItem>;
  meta: ProtocolMeta;
};

export type GreenCqsBatchResponse = {
  disclaimer: string;
  total: number;
  succeeded: number;
  failed: number;
  items: Array<GreenCqsBatchSuccessItem | GreenBatchErrorItem>;
  meta: ProtocolMeta;
};

/** Watts Reserve — buyer profile for reserve / offers match */
export type WattsReserveRequest = {
  window: { start: string; end: string };
  energy_kwh?: number;
  capacity_kw?: number;
  zone: { country: string; zone_id?: string };
  carbon_intensity_max_gco2_kwh?: number;
  firmness?: "firm" | "flex";
  buyer_ref?: string;
  generation_source?:
    | "solar"
    | "wind"
    | "hydro"
    | "nuclear"
    | "battery"
    | "mixed"
    | "unknown";
};

export type WattsReserveResponse = {
  reservation_id: string;
  status: string;
  match_score: number;
  match_reasons: Array<{ code: string; detail: string; delta: number }>;
  suggested_unit_kind: "e" | "f";
  disclaimer: string;
  next_step: string;
  cfu_unit_id?: string | null;
  cfu_verify_url?: string | null;
  unit?: ChargeflowResponse;
  meta?: ProtocolMeta;
};

export type WattsSettleRequest = {
  delivery_ref?: string;
  delivered_at?: string;
  energy_kwh_delivered?: number;
  capacity_kw_delivered?: number;
  reason?: string;
};

export type WattsCapacityOfferRequest = {
  window: { start: string; end: string };
  capacity_kw?: number;
  energy_kwh?: number;
  zone: { country: string; zone_id?: string };
  carbon_intensity_gco2_kwh?: number;
  firmness?: "firm" | "flex";
  producer_ref?: string;
  label?: string;
  generation_source?:
    | "solar"
    | "wind"
    | "hydro"
    | "nuclear"
    | "battery"
    | "mixed"
    | "unknown";
};

export type WattsCapacityOfferResponse = {
  offer_id: string;
  status: string;
  firmness: string;
  disclaimer: string;
  meta?: ProtocolMeta;
};

export type WattsOffersListResponse = {
  offers: WattsCapacityOfferResponse[];
  count: number;
  meta?: ProtocolMeta;
};

export type WattsOffersMatchResponse = {
  matches: Array<{
    offer_id: string;
    match_score: number;
    match_reasons: Array<{ code: string; detail: string; delta: number }>;
    offer: WattsCapacityOfferResponse;
  }>;
  count: number;
  meta?: ProtocolMeta;
};

export type WattsSecondaryListingRequest = {
  reservation_id?: string;
  indicative_price_eur: number;
  compare_ref_id?: string;
  label?: string;
  note?: string;
  energy_kwh?: number;
  capacity_kw?: number;
  zone?: { country: string; zone_id?: string };
  firmness?: "firm" | "flex";
  cfu_unit_id?: string;
  cfu_verify_url?: string;
};

export type WattsSecondaryListingResponse = {
  listing_id: string;
  status: string;
  indicative_price_eur: number;
  compare_ref_id?: string | null;
  compare_url?: string | null;
  interest_count: number;
  disclaimer: string;
  rwa_hint?: string;
  meta?: ProtocolMeta;
};

export type WattsSecondaryListResponse = {
  listings: WattsSecondaryListingResponse[];
  count: number;
  meta?: ProtocolMeta;
};
