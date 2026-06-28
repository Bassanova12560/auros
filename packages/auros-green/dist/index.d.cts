type AurosGreenOptions = {
    /** Bearer API key (optional for anonymous tier — rate limited). */
    apiKey?: string;
    /** Defaults to https://getauros.com */
    baseUrl?: string;
    fetch?: typeof fetch;
};
type GreenApiErrorBody = {
    ok?: false;
    error?: {
        code?: string;
        message?: string;
    };
};
type GreenScoreResponse = {
    ok: true;
    score: {
        id: string;
        name: string;
        composite_score: number;
        carbon_quality: {
            score: number;
            tier: string;
        } | null;
        watt: {
            rating: number;
        } | null;
        nature_score: {
            score: number;
            tier: string;
        } | null;
        benchmark: {
            percentile: number;
            label: string;
        };
    };
};
type GreenRegistryResponse = {
    ok: true;
    registry_connect: {
        serial: string;
        project_name: string;
        match: string;
        scores: {
            carbon_quality: {
                score: number;
            };
        };
    };
};
type GreenChangelogResponse = {
    ok: true;
    changelog: Record<string, unknown>;
};
type GreenNatureIndexResponse = {
    ok: true;
    payload: {
        editionIso: string;
        referenceCount: number;
        entries: Array<{
            id: string;
            name: string;
            rank: number;
            nature_score: number;
            cqs: number | null;
        }>;
    };
};
type GreenNatureScoreResponse = {
    ok: true;
    nature_score: {
        score: number;
        tier: string;
        ecosystem: string;
    };
};
type GreenScoreHistoryResponse = {
    ok: true;
    history: {
        id: string;
        name: string;
        entries: Array<{
            edition: string;
            composite_score: number;
        }>;
        trend: {
            composite_delta: number;
            months: number;
        } | null;
    };
};
type GreenDppResponse = {
    ok: true;
    dpp: Record<string, unknown>;
};

declare class AurosGreen {
    private readonly apiKey?;
    private readonly baseUrl;
    private readonly fetchFn;
    constructor(options?: AurosGreenOptions);
    getScore(id: string): Promise<GreenScoreResponse>;
    getScores(ids: string[]): Promise<{
        ok: true;
        scores: GreenScoreResponse["score"][];
    }>;
    analyzeCarbon(text: string): Promise<{
        ok: true;
        carbon_quality: {
            score: number;
        };
    }>;
    getRegistry(serial: string): Promise<GreenRegistryResponse>;
    getChangelog(): Promise<GreenChangelogResponse>;
    getNatureIndex(): Promise<GreenNatureIndexResponse>;
    getNatureScore(id: string): Promise<GreenNatureScoreResponse>;
    getScoreHistory(id: string): Promise<GreenScoreHistoryResponse>;
    getDpp(id: string, format?: "json" | "jsonld"): Promise<GreenDppResponse | Record<string, unknown>>;
    private headers;
    private get;
    private post;
    private parse;
}

declare class AurosGreenError extends Error {
    readonly code: string;
    readonly status: number;
    constructor(code: string, message: string, status: number);
    static fromResponse(status: number, body: GreenApiErrorBody): AurosGreenError;
}

export { AurosGreen, AurosGreenError, type AurosGreenOptions, type GreenApiErrorBody, type GreenChangelogResponse, type GreenDppResponse, type GreenNatureIndexResponse, type GreenNatureScoreResponse, type GreenRegistryResponse, type GreenScoreHistoryResponse, type GreenScoreResponse };
