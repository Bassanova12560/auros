type AssetType = "real_estate" | "private_fund" | "bonds" | "private_credit" | "commodities" | "stablecoins" | "other";
type IssuerType = "company_spv" | "existing_fund" | "individual" | "unsure";
type AssetClass = "financial_instrument" | "art_utility" | "e_money" | "unsure";
type EuNexus = "issuer_eu" | "asset_eu" | "investors_eu" | "no_eu" | "unsure";
type WhitepaperStatus = "ready" | "draft" | "none" | "unsure";
type InvestorType = "professional" | "retail" | "mixed" | "unsure";
type ScoreStatus = "ready" | "progress" | "early";
type MicaClassification = "utility_token" | "asset_referenced_token" | "e_money_token" | "other_crypto_asset" | "financial_instrument" | "out_of_scope" | "uncertain";
type ScoreRequest = {
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
type ScoreBreakdown = {
    legal_structure: number;
    kyc_aml: number;
    mica_compliance: number;
    data_room: number;
    investor_protection: number;
};
type RecommendedJurisdiction = {
    id: string;
    score: number;
    rationale: string;
};
type RecommendedPlatform = {
    id: string;
    name: string;
    category: string;
    apy: number;
};
type ProtocolMeta = {
    version: "1.0";
    computed_at: string;
    request_id?: string;
};
type ScoreHistoryEntry = {
    id: number;
    score: number;
    grade: string;
    status: ScoreStatus;
    breakdown: ScoreBreakdown;
    mica_classification: MicaClassification;
    request?: Record<string, unknown>;
    created_at: string;
};
type ScoreHistoryResponse = {
    disclaimer: string;
    score_id: string;
    kind: "session" | "monitor";
    total: number;
    entries: ScoreHistoryEntry[];
    meta: ProtocolMeta;
};
type ScoreResponse = {
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
type ScoreBatchRequest = {
    items: ScoreRequest[];
    record_history?: boolean;
};
type ScoreBatchSuccessItem = ScoreResponse & {
    index: number;
    ok: true;
};
type ScoreBatchErrorItem = {
    index: number;
    ok: false;
    error: {
        code: string;
        message: string;
    };
};
type ScoreBatchResultItem = ScoreBatchSuccessItem | ScoreBatchErrorItem;
type ScoreBatchResponse = {
    disclaimer: string;
    total: number;
    succeeded: number;
    failed: number;
    items: ScoreBatchResultItem[];
    meta: ProtocolMeta;
};
type ProductCategory = "stablecoins" | "real_estate" | "bonds" | "commodities" | "private_credit" | "all";
type ProductsQuery = {
    category?: ProductCategory;
    jurisdiction?: string;
    chain?: string;
    yield_min?: number;
    yield_max?: number;
    page?: number;
    limit?: number;
    sort?: "apy" | "tvl" | "name";
};
type ProductItem = {
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
type ProductsResponse = {
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
type CompareCellHighlight = "best" | "worst" | null;
type RiskTier = "conservative" | "core" | "advanced";
type CompareRequest = {
    product_ids?: string[];
    category?: ProductCategory;
    yield_min?: number;
    risk_tier?: RiskTier;
    jurisdiction?: string;
    limit?: number;
};
type CompareProduct = ProductItem & {
    asset_class: string;
    sub_category: string;
    risk_tier: RiskTier;
    liquidity_days: number;
    fees: string;
    accredited_only: boolean;
};
type CompareResponse = {
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
type JurisdictionsAssetType = "real_estate" | "bonds" | "private_credit" | "funds" | "all";
type JurisdictionsQuery = {
    asset_type?: JurisdictionsAssetType;
    investor_type?: "professional" | "retail" | "mixed" | "all";
    timeline_months?: number;
    budget?: number;
};
type JurisdictionItem = {
    id: string;
    score: number;
    rationale: string;
    fee_min_eur: number;
    fee_max_eur: number;
    license_max_months: number;
    asset_types: string[];
    kyc_level: string;
};
type JurisdictionsResponse = {
    disclaimer: string;
    jurisdictions: JurisdictionItem[];
    query: JurisdictionsQuery;
};
type ChecklistRequest = {
    asset_type: "real_estate" | "private_fund" | "bonds" | "private_credit";
    jurisdiction: string;
    structure?: "spv" | "fund" | "trust" | "other";
};
type ChecklistItem = {
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
type ChecklistResponse = {
    disclaimer: string;
    asset_type: string;
    jurisdiction: string;
    structure: string;
    items: ChecklistItem[];
    total_items: number;
    estimated_total_days: number;
    estimated_total_cost_eur: number;
};
type CreateKeyRequest = {
    email: string;
};
type CreateKeyResponse = {
    disclaimer: string;
    ok: boolean;
    api_key?: string;
    tier?: "free";
    monthly_limit?: number;
    message?: string;
};
type ProtocolErrorBody = {
    disclaimer: string;
    error: {
        code: string;
        message: string;
    };
};
type AurosProtocolOptions = {
    apiKey: string;
    baseUrl?: string;
    fetch?: typeof fetch;
};
type AlertType = "score_change" | "regulation_update" | "new_requirement" | "deadline_approaching";
type MonitorRequest = {
    asset_type: AssetType;
    jurisdiction: string;
    structure?: "spv" | "fund" | "trust" | "other";
    webhook_url?: string;
    email?: string;
    alert_on?: AlertType[];
    baseline_score?: number;
};
type MonitorResponse = {
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
type DossierSection = "executive_summary" | "score_breakdown" | "mica_classification" | "checklist" | "jurisdictions" | "platforms" | "disclaimers";
type DossierRequest = {
    score_id?: string;
    score?: ScoreRequest;
    format?: "pdf" | "json" | "zip";
    sections?: DossierSection[];
    branding?: {
        company_name?: string;
        logo_url?: string;
    };
    locale?: "fr" | "en" | "es";
};
type DossierResponse = {
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
type AttestCreateRequest = {
    dossier_id?: string;
    score_id?: string;
    score?: ScoreRequest;
    sections?: DossierSection[];
    locale?: "fr" | "en" | "es";
};
type AttestPublicSnapshot = {
    score: number;
    grade: string;
    status: string;
    mica_classification: string;
    sections: string[];
    generated_at: string;
};
type AttestResponse = {
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
type AttestVerifyResponse = {
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
type ChargeflowCreateRequest = {
    session: {
        external_session_id: string;
        started_at: string;
        ended_at: string;
        energy_kwh: number;
        operator_id?: string;
        source_format?: "ocpi" | "ocpp_summary" | "csv" | "json_custom";
        location?: {
            country?: string;
            site_id?: string;
            connector_id?: string;
        };
        vehicle_ref?: string;
    };
    attributes?: {
        renewable_claim?: "none" | "go" | "rec" | "ppa_matched" | "unknown";
        grid_mix_note?: string;
        compare_ref_id?: string;
    };
};
type ChargeflowWCreateRequest = {
    flow: {
        external_flow_id: string;
        started_at: string;
        ended_at: string;
        volume_m3: number;
        operator_id?: string;
        source_format?: "csv" | "scada_summary" | "json_custom";
        location?: {
            country?: string;
            site_id?: string;
            basin_id?: string;
        };
    };
    attributes?: {
        asset_class_hint?: string;
        compare_ref_id?: string;
        notes?: string;
    };
};
type ChargeflowFCreateRequest = {
    window: {
        external_window_id: string;
        started_at: string;
        ended_at: string;
        capacity_kw: number;
        direction?: "up" | "down" | "both";
        operator_id?: string;
        source_format?: "csv" | "scada_summary" | "json_custom";
        location?: {
            country?: string;
            site_id?: string;
            asset_id?: string;
        };
    };
    attributes?: {
        program_hint?: "fcr" | "afrr" | "mfrr" | "demand_response" | "unknown";
        compare_ref_id?: string;
        notes?: string;
    };
};
type ChargeflowResponse = {
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
type ChargeflowVerifyResponse = ChargeflowResponse | {
    valid: boolean;
    id?: string;
    content_hash?: string;
    signature?: string;
    reason?: string;
    disclaimer?: string;
};
type ChargeflowListQuery = {
    kind?: "e" | "w" | "f";
    status?: "active" | "retired";
    limit?: number;
    offset?: number;
};
type ChargeflowListItem = {
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
type ChargeflowListResponse = {
    total: number;
    limit: number;
    offset: number;
    items: ChargeflowListItem[];
    meta?: ProtocolMeta;
};
type ChargeflowBatchRequestE = {
    items: ChargeflowCreateRequest[];
};
type ChargeflowBatchRequestW = {
    items: ChargeflowWCreateRequest[];
};
type ChargeflowBatchRequestF = {
    items: ChargeflowFCreateRequest[];
};
type ChargeflowBatchSuccessItem = ChargeflowResponse & {
    index: number;
    ok: true;
};
type ChargeflowBatchErrorItem = {
    index: number;
    ok: false;
    error: {
        code: string;
        message: string;
    };
};
type ChargeflowBatchResponse = {
    total: number;
    succeeded: number;
    failed: number;
    items: Array<ChargeflowBatchSuccessItem | ChargeflowBatchErrorItem>;
    meta?: ProtocolMeta;
};
type WebhookRegisterRequest = {
    url: string;
    events?: AlertType[];
};
type WebhookItem = {
    id: string;
    url: string;
    events: string[];
    active: boolean;
    created_at: string;
};
type WebhooksListResponse = {
    disclaimer: string;
    webhooks: WebhookItem[];
    total: number;
};
type WebhookRegisterResponse = {
    disclaimer: string;
    id: string;
    url: string;
    events: string[];
    active: boolean;
    created_at: string;
    signature_header: string;
    signature_algorithm: string;
};
type WattScoreTier = "high" | "mid" | "early";
type WattScore = {
    rating: number;
    lifetime_gwh: number | null;
    energy_value_eur: number | null;
    tier: WattScoreTier;
};
type CarbonQualityTier = "premium" | "acceptable" | "caution" | "avoid";
type CarbonQualityScore = {
    score: number;
    tier: CarbonQualityTier;
    registry?: string;
    ccp_aligned?: boolean | null;
    priority_keys?: string[];
};
type GreenWattPublicResponse = {
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
type GreenCqsPublicResponse = {
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
type GreenBatchItemInput = {
    id?: string;
    text?: string;
};
type GreenWattBatchRequest = {
    items: GreenBatchItemInput[];
};
type GreenCqsBatchRequest = {
    items: GreenBatchItemInput[];
};
type GreenBatchErrorItem = {
    index: number;
    ok: false;
    error: {
        code: string;
        message: string;
    };
};
type GreenWattBatchSuccessItem = {
    index: number;
    ok: true;
    id: string | null;
    watt_score: WattScore;
};
type GreenCqsBatchSuccessItem = {
    index: number;
    ok: true;
    id: string | null;
    carbon_quality: CarbonQualityScore;
};
type GreenWattBatchResponse = {
    disclaimer: string;
    total: number;
    succeeded: number;
    failed: number;
    items: Array<GreenWattBatchSuccessItem | GreenBatchErrorItem>;
    meta: ProtocolMeta;
};
type GreenCqsBatchResponse = {
    disclaimer: string;
    total: number;
    succeeded: number;
    failed: number;
    items: Array<GreenCqsBatchSuccessItem | GreenBatchErrorItem>;
    meta: ProtocolMeta;
};

declare class AurosProtocol {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly fetchFn;
    constructor(options: AurosProtocolOptions);
    score(body: ScoreRequest): Promise<ScoreResponse>;
    scoreBatch(body: ScoreBatchRequest): Promise<ScoreBatchResponse>;
    scoreHistory(id: string): Promise<ScoreHistoryResponse>;
    products(query?: ProductsQuery): Promise<ProductsResponse>;
    compare(body: CompareRequest): Promise<CompareResponse>;
    jurisdictions(query?: JurisdictionsQuery): Promise<JurisdictionsResponse>;
    checklist(body: ChecklistRequest): Promise<ChecklistResponse>;
    monitor(body: MonitorRequest): Promise<MonitorResponse>;
    getMonitor(id: string): Promise<MonitorResponse>;
    deleteMonitor(id: string): Promise<{
        ok: boolean;
        id: string;
        deleted: boolean;
    }>;
    dossier(body: DossierRequest): Promise<DossierResponse>;
    attest(body: AttestCreateRequest): Promise<AttestResponse>;
    verifyAttest(query: {
        id?: string;
        hash?: string;
        sig?: string;
    }): Promise<AttestVerifyResponse>;
    createChargeflowE(body: ChargeflowCreateRequest): Promise<ChargeflowResponse>;
    createChargeflowW(body: ChargeflowWCreateRequest): Promise<ChargeflowResponse>;
    createChargeflowF(body: ChargeflowFCreateRequest): Promise<ChargeflowResponse>;
    createChargeflowEBatch(body: ChargeflowBatchRequestE): Promise<ChargeflowBatchResponse>;
    createChargeflowWBatch(body: ChargeflowBatchRequestW): Promise<ChargeflowBatchResponse>;
    createChargeflowFBatch(body: ChargeflowBatchRequestF): Promise<ChargeflowBatchResponse>;
    listChargeflow(query?: ChargeflowListQuery): Promise<ChargeflowListResponse>;
    getChargeflow(id: string): Promise<ChargeflowResponse>;
    verifyChargeflow(query: {
        id?: string;
        hash?: string;
        sig?: string;
    }): Promise<ChargeflowVerifyResponse>;
    retireChargeflow(id: string, body?: {
        reason?: string;
    }): Promise<ChargeflowResponse>;
    registerWebhook(body: WebhookRegisterRequest): Promise<WebhookRegisterResponse>;
    webhooks(): Promise<WebhooksListResponse>;
    deleteWebhook(id: string): Promise<{
        ok: boolean;
        id: string;
        deleted: boolean;
    }>;
    /** Create a free-tier API key (no auth required). */
    createKey(body: CreateKeyRequest): Promise<CreateKeyResponse>;
    /** Free public read — Watt Score for an AUROS Green compare reference. */
    greenWattScore(id: string): Promise<GreenWattPublicResponse>;
    /** Free public read — Carbon Quality Score for an AUROS Green compare reference. */
    greenCarbonQuality(id: string): Promise<GreenCqsPublicResponse>;
    /** Batch Watt Scores — up to 50 energy assets per call (1 quota unit). */
    greenWattBatch(body: GreenWattBatchRequest): Promise<GreenWattBatchResponse>;
    /** Batch Carbon Quality Scores — up to 50 carbon credits per call (1 quota unit). */
    greenCarbonQualityBatch(body: GreenCqsBatchRequest): Promise<GreenCqsBatchResponse>;
    private get;
    private getPublic;
    private post;
    private request;
}

declare class AurosProtocolError extends Error {
    readonly code: string;
    readonly status: number;
    constructor(code: string, message: string, status: number);
    static fromResponse(status: number, body: ProtocolErrorBody): AurosProtocolError;
}

export { type AlertType, type AssetClass, type AssetType, type AttestCreateRequest, type AttestPublicSnapshot, type AttestResponse, type AttestVerifyResponse, AurosProtocol, AurosProtocolError, type AurosProtocolOptions, type CarbonQualityScore, type CarbonQualityTier, type ChargeflowBatchErrorItem, type ChargeflowBatchRequestE, type ChargeflowBatchRequestF, type ChargeflowBatchRequestW, type ChargeflowBatchResponse, type ChargeflowBatchSuccessItem, type ChargeflowCreateRequest, type ChargeflowFCreateRequest, type ChargeflowListItem, type ChargeflowListQuery, type ChargeflowListResponse, type ChargeflowResponse, type ChargeflowVerifyResponse, type ChargeflowWCreateRequest, type ChecklistItem, type ChecklistRequest, type ChecklistResponse, type CompareCellHighlight, type CompareProduct, type CompareRequest, type CompareResponse, type CreateKeyRequest, type CreateKeyResponse, type DossierRequest, type DossierResponse, type DossierSection, type EuNexus, type GreenBatchErrorItem, type GreenBatchItemInput, type GreenCqsBatchRequest, type GreenCqsBatchResponse, type GreenCqsBatchSuccessItem, type GreenCqsPublicResponse, type GreenWattBatchRequest, type GreenWattBatchResponse, type GreenWattBatchSuccessItem, type GreenWattPublicResponse, type InvestorType, type IssuerType, type JurisdictionItem, type JurisdictionsAssetType, type JurisdictionsQuery, type JurisdictionsResponse, type MicaClassification, type MonitorRequest, type MonitorResponse, type ProductCategory, type ProductItem, type ProductsQuery, type ProductsResponse, type ProtocolErrorBody, type ProtocolMeta, type RecommendedJurisdiction, type RecommendedPlatform, type RiskTier, type ScoreBatchErrorItem, type ScoreBatchRequest, type ScoreBatchResponse, type ScoreBatchResultItem, type ScoreBatchSuccessItem, type ScoreBreakdown, type ScoreHistoryEntry, type ScoreHistoryResponse, type ScoreRequest, type ScoreResponse, type ScoreStatus, type WattScore, type WattScoreTier, type WebhookItem, type WebhookRegisterRequest, type WebhookRegisterResponse, type WebhooksListResponse, type WhitepaperStatus };
