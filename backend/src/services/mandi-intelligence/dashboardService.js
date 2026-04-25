// backend/src/services/mandi-intelligence/dashboardService.js
// ─────────────────────────────────────────────────────────────
// Orchestrates full dashboard payload assembly.
// Called by the controller — pulls data, runs analytics, returns frontend-ready JSON.
// ─────────────────────────────────────────────────────────────

'use strict';

const dataFetcher = require('./dataFetcher');
const analytics   = require('./analytics');
const { todayIST } = require('./normalizer');

/**
 * Build the complete dashboard payload for the Mandi Intelligence page.
 *
 * @param {Object} params
 * @param {string} params.commodity
 * @param {string} [params.state]
 * @param {string} [params.district]
 * @param {string} [params.market]
 * @param {number} [params.range=30]           - trend days
 * @param {number} [params.forecastHorizon=7]
 * @param {string} [params.compareBy='market']
 * @returns {Promise<Object>}  - complete frontend-ready dashboard payload
 */
async function buildDashboard({
    commodity,
    state,
    district,
    market,
    range = 30,
    forecastHorizon = 7,
    compareBy = 'market',
} = {}) {
    const fetchedAt = new Date().toISOString();
    const warnings  = [];

    // ── Fetch history records (90 days by default for full analysis) ──────────
    let records = [];
    try {
        records = await dataFetcher.queryHistory({
            commodity, state, district, market,
            days: Math.max(90, range),
        });
    } catch (err) {
        warnings.push(`Data fetch error: ${err.message}`);
    }

    if (!records.length) {
        warnings.push('No records found for selected filters. Try broader filter values.');
    }

    // ── Run all analytics ────────────────────────────────────────────────────

    const liveMonitor   = analytics.computeLivePriceMonitor(records, market);
    const nearby        = analytics.computeNearbyComparison(records, district, state);
    const trend         = analytics.computeTrendView(records, market, range);
    const forecast      = analytics.computeForecastBand(records, market, forecastHorizon);
    const sellSignal    = analytics.computeSellSignal(records, market, forecast);
    const compBars      = analytics.computeMarketComparisonBars(records, district, state);
    const spreadBand    = analytics.computePriceSpreadBand(records, market, range);
    const heatmap       = analytics.computeHeatmap(records, district, state, compareBy);
    const seasonality   = analytics.computeSeasonality(records, market);
    const momentum      = analytics.computeMomentum(records, market);

    // ── Meta ──────────────────────────────────────────────────────────────────

    const dates         = records.map(r => r.date).sort();
    const latestDate    = dates.length ? dates[dates.length - 1] : null;
    const oldestDate    = dates.length ? dates[0]                : null;
    const coverageDays  = latestDate && oldestDate
        ? Math.ceil((new Date(latestDate) - new Date(oldestDate)) / (1000 * 60 * 60 * 24))
        : 0;

    return {
        filters: { commodity, state, district, market, range, forecastHorizon, compareBy },

        livePriceMonitor:   liveMonitor,
        nearbyComparison:   nearby,
        trendView:          trend,
        forecastBand:       forecast,
        sellSignal,
        marketComparisonBars: compBars,
        priceSpreadBand:    spreadBand,
        heatmap,
        seasonality,
        momentum,

        meta: {
            source:              'Government of India – data.gov.in (Agmarknet Mandi Prices)',
            fetchedAt,
            today:               todayIST(),
            latestRecordDate:    latestDate,
            oldestRecordDate:    oldestDate,
            dataCoverageDays:    coverageDays,
            totalRecordsInScope: records.length,
            missingDataWarnings: warnings,
            confidenceNote: records.length < 10
                ? 'Low data coverage — analytics reliability is limited. Broaden filters or wait for more data.'
                : undefined,
        },
    };
}

module.exports = { buildDashboard };
