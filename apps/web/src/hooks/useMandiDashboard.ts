// apps/web/src/hooks/useMandiDashboard.ts
// ─────────────────────────────────────────────────────────────
// Custom React hook for fetching the Mandi Intelligence dashboard.
// Provides loading, error, and data states.
// Re-fetches when params change.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchMandiDashboard,
    fetchCommodities,
    fetchStates,
    fetchDistricts,
    fetchMarkets,
    DashboardParams,
    DashboardData,
} from '../services/mandiIntelligenceApi';

// ─── Dashboard hook ───────────────────────────────────────────

export interface UseMandiDashboardReturn {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Fetches the full Mandi Intelligence dashboard payload.
 * Skips fetch if commodity is missing.
 *
 * @param params  - DashboardParams; must include commodity
 */
export function useMandiDashboard(params: DashboardParams): UseMandiDashboardReturn {
    const [data, setData]     = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState<string | null>(null);

    // Use ref to track current request so stale responses are discarded
    const abortRef = useRef<AbortController | null>(null);

    const fetch = useCallback(() => {
        if (!params.commodity) return;

        // Cancel any in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        fetchMandiDashboard(params)
            .then(result => {
                if (!controller.signal.aborted) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (!controller.signal.aborted) {
                    setError(err?.message || 'Failed to load mandi data.');
                    setLoading(false);
                }
            });
    }, [
        params.commodity,
        params.state,
        params.district,
        params.market,
        params.range,
        params.forecastHorizon,
        params.compareBy,
    ]);

    useEffect(() => {
        fetch();
        return () => { abortRef.current?.abort(); };
    }, [fetch]);

    return { data, loading, error, refetch: fetch };
}

// ─── Filter dropdown hooks ────────────────────────────────────

export function useCommodities() {
    const [commodities, setCommodities] = useState<string[]>([]);
    const [loading, setLoading]         = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchCommodities()
            .then(setCommodities)
            .catch(() => setCommodities([]))
            .finally(() => setLoading(false));
    }, []);

    return { commodities, loading };
}

export function useStates() {
    const [states, setStates] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchStates()
            .then(setStates)
            .catch(() => setStates([]))
            .finally(() => setLoading(false));
    }, []);

    return { states, loading };
}

export function useDistricts(state: string | undefined) {
    const [districts, setDistricts] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!state) { setDistricts([]); return; }
        setLoading(true);
        fetchDistricts(state)
            .then(setDistricts)
            .catch(() => setDistricts([]))
            .finally(() => setLoading(false));
    }, [state]);

    return { districts, loading };
}

export function useMarkets(params: { state?: string; district?: string }) {
    const [markets, setMarkets] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!params.state && !params.district) { setMarkets([]); return; }
        setLoading(true);
        fetchMarkets(params)
            .then(setMarkets)
            .catch(() => setMarkets([]))
            .finally(() => setLoading(false));
    }, [params.state, params.district]);

    return { markets, loading };
}
