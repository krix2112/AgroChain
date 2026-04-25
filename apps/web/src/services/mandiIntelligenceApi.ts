// apps/web/src/services/mandiIntelligenceApi.ts
// ─────────────────────────────────────────────────────────────
// Frontend API service for Mandi Intelligence.
// All calls go to the backend; the API key is NEVER in this file.
//
// Backend base URL is read from NEXT_PUBLIC_API_URL env variable.
// ─────────────────────────────────────────────────────────────

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const PREFIX   = `${BASE_URL}/mandi-intelligence`;

// ─── Types ───────────────────────────────────────────────────

export interface DashboardParams {
    commodity: string;
    state?: string;
    district?: string;
    market?: string;
    /** 7 | 30 | 90 */
    range?: number;
    /** 7 | 14 */
    forecastHorizon?: number;
    /** 'market' | 'district' | 'state' */
    compareBy?: string;
}

export interface LivePriceMonitor {
    available: boolean;
    commodity?: string;
    market?: string;
    district?: string;
    state?: string;
    date?: string;
    freshness?: string;
    minPrice?: number;
    maxPrice?: number;
    modalPrice?: number;
    priceSpread?: number;
    variety?: string;
    grade?: string;
    reason?: string;
}

export interface NearbyMandi {
    market: string;
    district: string;
    state: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    spread: number;
    date: string;
}

export interface NearbyComparison {
    comparisonLevel: string;
    mandis: NearbyMandi[];
    count: number;
    note: string;
}

export interface TrendPoint {
    date: string;
    modalPrice: number;
    ma7: number | null;
}

export interface TrendView {
    days: number;
    available: boolean;
    series: TrendPoint[];
    pctChange: number | null;
    direction: 'up' | 'down' | 'flat' | 'unknown';
    observationCount?: number;
}

export interface ForecastPoint {
    date: string;
    lower: number;
    expected: number;
    upper: number;
}

export interface ForecastBand {
    available: boolean;
    horizon: number;
    series: ForecastPoint[];
    currentPrice?: number;
    direction?: string;
    confidence?: number;
    explanation?: string;
    reason?: string;
}

export interface SellSignal {
    signal: 'sell_now' | 'hold' | 'watch';
    confidence: number;
    currentModal?: number;
    vs7dAvgPct?: number;
    vs30dAvgPct?: number;
    volatility?: number;
    forecastDir?: string;
    explanation: string;
}

export interface MarketBar {
    market: string;
    district: string;
    state: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    date: string;
}

export interface MarketComparisonBars {
    bars: MarketBar[];
    count: number;
}

export interface SpreadPoint {
    date: string;
    minPrice: number;
    modalPrice: number;
    maxPrice: number;
    spread: number;
}

export interface PriceSpreadBand {
    days: number;
    available: boolean;
    series: SpreadPoint[];
    avgSpread: number | null;
}

export interface HeatmapRow {
    label: string;
    values: (number | null)[];
    normalized: (number | null)[];
}

export interface Heatmap {
    compareBy: string;
    dates: string[];
    matrix: HeatmapRow[];
    colorDomain: { min: number; max: number };
    missingCells: number;
    note: string;
}

export interface SeasonalityMonth {
    month: number;
    label: string;
    avgModal: number | null;
    count: number;
}

export interface Seasonality {
    available: boolean;
    months: SeasonalityMonth[];
    distinctMonths?: number;
    reason?: string;
    note?: string;
}

export interface MomentumPoint {
    date: string;
    modalPrice: number | null;
    ma7: number | null;
    ma30: number | null;
}

export interface Crossover {
    date: string;
    type: 'golden_cross' | 'death_cross';
    note: string;
}

export interface Momentum {
    available: boolean;
    series: MomentumPoint[];
    crossovers: Crossover[];
    direction: string;
    currentModal?: number;
    currentMA7?: number | null;
    currentMA30?: number | null;
}

export interface DashboardMeta {
    source: string;
    fetchedAt: string;
    today: string;
    latestRecordDate: string | null;
    oldestRecordDate: string | null;
    dataCoverageDays: number;
    totalRecordsInScope: number;
    missingDataWarnings: string[];
    confidenceNote?: string;
}

export interface DashboardData {
    filters: DashboardParams;
    livePriceMonitor: LivePriceMonitor;
    nearbyComparison: NearbyComparison;
    trendView: TrendView;
    forecastBand: ForecastBand;
    sellSignal: SellSignal;
    marketComparisonBars: MarketComparisonBars;
    priceSpreadBand: PriceSpreadBand;
    heatmap: Heatmap;
    seasonality: Seasonality;
    momentum: Momentum;
    meta: DashboardMeta;
}

// ─── Helpers ─────────────────────────────────────────────────

function buildQS(params: Record<string, string | number | undefined | null>): string {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== '') {
            parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
        }
    }
    return parts.length ? `?${parts.join('&')}` : '';
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || `Request failed with status ${res.status}`);
    }

    return json.data as T;
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Fetch the full dashboard payload for a commodity/location combination.
 */
export async function fetchMandiDashboard(params: DashboardParams): Promise<DashboardData> {
    const plain: Record<string, string | number | undefined | null> = { ...params };
    const qs = buildQS(plain);
    return apiFetch<DashboardData>(`${PREFIX}/dashboard${qs}`);
}

/**
 * Fetch commodity list for the filter dropdown.
 */
export async function fetchCommodities(): Promise<string[]> {
    return apiFetch<string[]>(`${PREFIX}/commodities`);
}

/**
 * Fetch state list for the filter dropdown.
 */
export async function fetchStates(): Promise<string[]> {
    return apiFetch<string[]>(`${PREFIX}/states`);
}

/**
 * Fetch districts for a given state.
 */
export async function fetchDistricts(state: string): Promise<string[]> {
    return apiFetch<string[]>(`${PREFIX}/districts?state=${encodeURIComponent(state)}`);
}

/**
 * Fetch markets for a given district/state.
 */
export async function fetchMarkets(params: { state?: string; district?: string }): Promise<string[]> {
    const qs = buildQS(params);
    return apiFetch<string[]>(`${PREFIX}/markets${qs}`);
}

/**
 * Trigger a manual data refresh for a commodity+location.
 * Useful for "Refresh Data" buttons in the UI.
 */
export async function refreshMandiData(body: {
    commodity: string;
    state?: string;
    district?: string;
    market?: string;
}): Promise<{ count: number; message: string }> {
    return apiFetch<{ count: number; message: string }>(`${PREFIX}/refresh`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}
