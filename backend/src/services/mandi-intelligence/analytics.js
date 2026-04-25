// backend/src/services/mandi-intelligence/analytics.js
// ─────────────────────────────────────────────────────────────
// Pure analytics functions for the Mandi Intelligence dashboard.
//
// All functions take pre-fetched MandiRecord arrays and return
// frontend-ready objects. No I/O happens here — fully deterministic.
//
// Sections covered (matching dashboard spec):
//  1. livePriceMonitor
//  2. nearbyComparison
//  3. trendView
//  4. forecastBand
//  5. sellSignal
//  6. marketComparisonBars
//  7. priceSpreadBand
//  8. heatmap
//  9. seasonality
// 10. momentum
// ─────────────────────────────────────────────────────────────

'use strict';

const { todayIST, addDays } = require('./normalizer');

// ─── Helpers ─────────────────────────────────────────────────

/** Arithmetic mean of a number array. Returns null for empty arrays. */
function mean(arr) {
    if (!arr.length) return null;
    return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/** Standard deviation (population) of a number array. */
function stddev(arr) {
    if (arr.length < 2) return 0;
    const avg = mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - avg) ** 2, 0) / arr.length);
}

/** Round to 2 decimal places. */
function r2(n) { return typeof n === 'number' ? Math.round(n * 100) / 100 : null; }

/**
 * Simple rolling moving average.
 * Returns array of same length as input; early entries will be null.
 * @param {number[]} values
 * @param {number}   window
 * @returns {(number|null)[]}
 */
function rollingMean(values, window) {
    return values.map((_, i) => {
        if (i < window - 1) return null;
        const slice = values.slice(i - window + 1, i + 1);
        return r2(mean(slice));
    });
}

/**
 * Sort records by date ascending.
 * @param {Array} records
 * @returns {Array}
 */
function sortByDate(records) {
    return [...records].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Filter records to those within [startDate, endDate] inclusive.
 */
function filterDateRange(records, startDate, endDate) {
    return records.filter(r => r.date >= startDate && r.date <= endDate);
}

/**
 * Get today's date string in YYYY-MM-DD.
 * @returns {string}
 */
function today() { return todayIST(); }

// ─────────────────────────────────────────────────────────────
// 1. LIVE PRICE MONITOR
// ─────────────────────────────────────────────────────────────

/**
 * Returns the most recent available price record for the target market.
 *
 * @param {Array} records     - MandiRecord[] sorted by date asc
 * @param {string} market     - target market name (case-insensitive)
 * @returns {Object}
 */
function computeLivePriceMonitor(records, market) {
    const t = today();

    // Prefer exact market match; fall back to any record if market not specified
    const source = market
        ? records.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : records;

    if (!source.length) {
        return { available: false, reason: 'No records found for selected filters.' };
    }

    // Latest record by date
    const sorted = sortByDate(source);
    const latest = sorted[sorted.length - 1];

    const daysDiff = Math.ceil(
        (new Date(t) - new Date(latest.date)) / (1000 * 60 * 60 * 24)
    );

    let freshness;
    if (daysDiff === 0)      freshness = 'today';
    else if (daysDiff === 1) freshness = 'yesterday';
    else if (daysDiff <= 7)  freshness = `${daysDiff} days ago`;
    else                     freshness = 'older';

    return {
        available:   true,
        commodity:   latest.commodity,
        market:      latest.market,
        district:    latest.district,
        state:       latest.state,
        date:        latest.date,
        freshness,
        minPrice:    r2(latest.minPrice),
        maxPrice:    r2(latest.maxPrice),
        modalPrice:  r2(latest.modalPrice),
        priceSpread: r2(latest.maxPrice - latest.minPrice),
        variety:     latest.variety,
        grade:       latest.grade,
    };
}

// ─────────────────────────────────────────────────────────────
// 2. NEARBY MANDI COMPARISON
// ─────────────────────────────────────────────────────────────

/**
 * Returns comparison data across mandis within the same district/state.
 * Ranked by current modal price descending.
 *
 * @param {Array}  records     - MandiRecord[] all records for the commodity
 * @param {string} [district]
 * @param {string} [state]
 * @returns {Object}
 */
function computeNearbyComparison(records, district, state) {
    const t = today();
    const cutoff = addDays(t, -7); // use records within last 7 days as "current"

    // Scope to district first, then state
    let scoped = district
        ? records.filter(r => r.district.toLowerCase() === district.toLowerCase())
        : state
        ? records.filter(r => r.state.toLowerCase() === state.toLowerCase())
        : records;

    scoped = filterDateRange(scoped, cutoff, t);

    // Group by market — pick latest row per market
    const byMarket = new Map();
    for (const rec of sortByDate(scoped)) {
        byMarket.set(rec.market.toLowerCase(), rec);
    }

    const mandis = Array.from(byMarket.values())
        .map(r => ({
            market:     r.market,
            district:   r.district,
            state:      r.state,
            modalPrice: r2(r.modalPrice),
            minPrice:   r2(r.minPrice),
            maxPrice:   r2(r.maxPrice),
            spread:     r2(r.maxPrice - r.minPrice),
            date:       r.date,
        }))
        .sort((a, b) => b.modalPrice - a.modalPrice);

    const comparisonLevel = district ? 'district' : state ? 'state' : 'all';

    return {
        comparisonLevel,
        mandis,
        count: mandis.length,
        note: 'Geo-coordinates not available from API. Comparison is district/state-level.',
    };
}

// ─────────────────────────────────────────────────────────────
// 3. TREND VIEW
// ─────────────────────────────────────────────────────────────

/**
 * Build trend data for a given number of days.
 * Returns sparse actual observations (no price fabrication for missing dates).
 *
 * @param {Array}  records
 * @param {string} market
 * @param {number} days        - 7, 30, or 90
 * @returns {Object}
 */
function computeTrendView(records, market, days = 30) {
    const t      = today();
    const cutoff = addDays(t, -days);

    const source = market
        ? records.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : records;

    const inRange = sortByDate(filterDateRange(source, cutoff, t));

    if (!inRange.length) {
        return { days, available: false, series: [], movingAvg7: [], pctChange: null, direction: 'unknown' };
    }

    // Aggregate by date (multiple markets/varieties → average modal price)
    const byDate = new Map();
    for (const rec of inRange) {
        if (!byDate.has(rec.date)) byDate.set(rec.date, []);
        byDate.get(rec.date).push(rec.modalPrice);
    }

    const series = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, prices]) => ({
            date,
            modalPrice: r2(mean(prices)),
        }));

    const prices = series.map(s => s.modalPrice);
    const ma7raw = rollingMean(prices, Math.min(7, prices.length));

    // Merge MA7 into series
    const enriched = series.map((s, i) => ({ ...s, ma7: ma7raw[i] }));

    // Percentage change vs previous period
    const firstH = series.slice(0, Math.floor(series.length / 2));
    const lastH  = series.slice(Math.floor(series.length / 2));
    const prevAvg = mean(firstH.map(s => s.modalPrice));
    const currAvg = mean(lastH.map(s => s.modalPrice));
    const pctChange = prevAvg && prevAvg !== 0
        ? r2(((currAvg - prevAvg) / prevAvg) * 100)
        : null;

    // Direction: slope of last 3 data points
    let direction = 'flat';
    if (prices.length >= 3) {
        const recent = prices.slice(-3);
        const slope = recent[2] - recent[0];
        if (slope > recent[0] * 0.01)      direction = 'up';
        else if (slope < -recent[0] * 0.01) direction = 'down';
    }

    return {
        days,
        available:   true,
        series:      enriched,
        pctChange,
        direction,
        observationCount: series.length,
    };
}

// ─────────────────────────────────────────────────────────────
// 4. FORECAST BAND
// ─────────────────────────────────────────────────────────────

/**
 * Statistical short-term price forecast.
 *
 * Method (fully transparent):
 *  - Compute 30-day weighted average (recent weeks weighted higher)
 *  - Compute recent 7-day trend slope (% change per day)
 *  - Project forward horizon days, applying slope with dampening
 *  - Use recent volatility (stddev of 14-day prices) as ±1σ band
 *  - Confidence degrades with sparse data and high volatility
 *
 * No AI or ML — pure statistical extrapolation.
 *
 * @param {Array}  records
 * @param {string} market
 * @param {number} horizon    - days to forecast (7 or 14)
 * @returns {Object}
 */
function computeForecastBand(records, market, horizon = 7) {
    const t       = today();
    const c30     = addDays(t, -30);
    const c14     = addDays(t, -14);
    const c7      = addDays(t, -7);

    const source = market
        ? records.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : records;

    const hist30 = sortByDate(filterDateRange(source, c30, t));
    const hist14 = filterDateRange(source, c14, t);
    const hist7  = filterDateRange(source, c7, t);

    if (hist30.length < 3) {
        return {
            available:   false,
            horizon,
            reason:      'Insufficient historical data for forecast (need at least 3 records).',
            explanation: 'Not enough data.',
        };
    }

    // Daily aggregated modal prices (averaged where multiple entries per day)
    const byDate = new Map();
    for (const r of hist30) {
        if (!byDate.has(r.date)) byDate.set(r.date, []);
        byDate.get(r.date).push(r.modalPrice);
    }
    const dailySeries = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, prices]) => mean(prices));

    const n       = dailySeries.length;
    const lastPrice = dailySeries[n - 1];

    // Weighted 30-day average (linearly increasing weights)
    const weights = dailySeries.map((_, i) => i + 1);
    const wSum    = weights.reduce((s, w) => s + w, 0);
    const wAvg    = dailySeries.reduce((s, v, i) => s + v * weights[i], 0) / wSum;

    // 7-day trend slope (% change per day)
    const p7 = dailySeries.slice(-Math.min(7, n));
    const slopePerDay = p7.length >= 2
        ? (p7[p7.length - 1] - p7[0]) / (p7.length - 1) / (p7[0] || 1) // fractional
        : 0;

    // Volatility: stddev of 14-day prices
    const prices14 = hist14.map(r => r.modalPrice);
    const vol      = stddev(prices14.length > 0 ? prices14 : dailySeries);

    // Dampen slope by half every week to avoid runaway extrapolation
    const dampening = 0.5;

    const forecastPoints = [];
    for (let d = 1; d <= horizon; d++) {
        const dampFactor = Math.pow(dampening, d / 7);
        const projected  = lastPrice * (1 + slopePerDay * d * dampFactor);
        forecastPoints.push({
            date:       addDays(t, d),
            lower:      r2(Math.max(0, projected - vol)),
            expected:   r2(Math.max(0, projected)),
            upper:      r2(projected + vol),
        });
    }

    // Confidence: degrades with sparse data, high volatility, wide bands
    const dataDensity = Math.min(n / 30, 1);           // 0-1
    const relVol      = vol / (lastPrice || 1);         // coefficient of variation
    const volPenalty  = Math.min(relVol * 2, 0.6);      // 0-0.6 penalty
    const confidence  = Math.max(0.1, r2(dataDensity * (1 - volPenalty)));

    const dir = slopePerDay > 0.002 ? 'upward' : slopePerDay < -0.002 ? 'downward' : 'flat';

    return {
        available:    true,
        horizon,
        series:       forecastPoints,
        currentPrice: r2(lastPrice),
        direction:    dir,
        confidence,
        explanation: [
            `Forecast based on ${n}-day history with weighted 30-day average (₹${r2(wAvg)}/q).`,
            `Recent 7-day trend: ${(slopePerDay * 100).toFixed(2)}%/day (${dir}).`,
            `Market volatility (±1σ): ₹${r2(vol)}/q.`,
            `Confidence degrades with sparse data and high volatility.`,
        ].join(' '),
    };
}

// ─────────────────────────────────────────────────────────────
// 5. SELL SIGNAL
// ─────────────────────────────────────────────────────────────

/**
 * Derive sell / hold / watch recommendation.
 *
 * Logic:
 *  - currentVs7dAvg = (currentModal - avg7d) / avg7d
 *  - currentVs30dAvg = (currentModal - avg30d) / avg30d
 *  - forecastDirection from forecastBand
 *  - if high volatility → watch
 *  - if price well above avg AND forecast flat/down → sell_now
 *  - if price below avg AND forecast up → hold
 *  - otherwise → watch
 *
 * @param {Array}  records
 * @param {string} market
 * @param {Object} forecastBand  - output of computeForecastBand
 * @returns {Object}
 */
function computeSellSignal(records, market, forecastBand) {
    const t   = today();
    const c7  = addDays(t, -7);
    const c30 = addDays(t, -30);

    const source = market
        ? records.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : records;

    if (!source.length) {
        return { signal: 'watch', confidence: 0, explanation: 'No data available.' };
    }

    const latest = sortByDate(source).slice(-1)[0];
    const curr   = latest.modalPrice;

    const prices7  = filterDateRange(source, c7,  t).map(r => r.modalPrice);
    const prices30 = filterDateRange(source, c30, t).map(r => r.modalPrice);

    const avg7  = mean(prices7)  || curr;
    const avg30 = mean(prices30) || curr;
    const vol   = stddev(prices7);

    const vs7  = avg7  ? (curr - avg7)  / avg7  : 0;
    const vs30 = avg30 ? (curr - avg30) / avg30 : 0;
    const relVol = vol / (curr || 1);

    const fDir  = forecastBand?.direction || 'flat';
    const fConf = forecastBand?.confidence || 0.5;

    // High volatility → watch (can't trust signal)
    if (relVol > 0.12 || fConf < 0.3) {
        return {
            signal: 'watch',
            confidence: r2(fConf),
            currentModal:  r2(curr),
            vs7dAvgPct:    r2(vs7  * 100),
            vs30dAvgPct:   r2(vs30 * 100),
            volatility:    r2(relVol * 100),
            forecastDir:   fDir,
            explanation: `Volatility is high (${r2(relVol * 100)}%) and/or forecast confidence is low (${r2(fConf * 100)}%). Monitor closely before deciding.`,
        };
    }

    // Sell now: price above avg and forecast flat or dropping
    if (vs30 > 0.05 && vs7 > 0.02 && (fDir === 'flat' || fDir === 'downward')) {
        return {
            signal: 'sell_now',
            confidence: r2(Math.min(fConf, (vs30 + vs7) / 2 + 0.3)),
            currentModal:  r2(curr),
            vs7dAvgPct:    r2(vs7  * 100),
            vs30dAvgPct:   r2(vs30 * 100),
            volatility:    r2(relVol * 100),
            forecastDir:   fDir,
            explanation: `Current modal price (₹${r2(curr)}/q) is ${r2(vs30 * 100)}% above the 30-day average and the forecast trend is ${fDir}. Favourable sell conditions.`,
        };
    }

    // Hold: price below avg and forecast trending up
    if (vs30 < -0.03 && fDir === 'upward') {
        return {
            signal: 'hold',
            confidence: r2(fConf),
            currentModal:  r2(curr),
            vs7dAvgPct:    r2(vs7  * 100),
            vs30dAvgPct:   r2(vs30 * 100),
            volatility:    r2(relVol * 100),
            forecastDir:   fDir,
            explanation: `Price is ${r2(Math.abs(vs30) * 100)}% below the 30-day average but the short-term forecast trends upward. Consider holding for better prices.`,
        };
    }

    // Default: watch
    return {
        signal: 'watch',
        confidence: r2(fConf * 0.8),
        currentModal:  r2(curr),
        vs7dAvgPct:    r2(vs7  * 100),
        vs30dAvgPct:   r2(vs30 * 100),
        volatility:    r2(relVol * 100),
        forecastDir:   fDir,
        explanation: `Market conditions are mixed (vs 7d: ${r2(vs7 * 100)}%, vs 30d: ${r2(vs30 * 100)}%, forecast: ${fDir}). Observe for 2-3 more days before acting.`,
    };
}

// ─────────────────────────────────────────────────────────────
// 6. MARKET COMPARISON BAR CHART
// ─────────────────────────────────────────────────────────────

/**
 * Current modal prices across all mandis in scope, sorted descending.
 *
 * @param {Array}  records
 * @param {string} [district]
 * @param {string} [state]
 * @returns {Object}
 */
function computeMarketComparisonBars(records, district, state) {
    const t      = today();
    const cutoff = addDays(t, -7);

    let scoped = district
        ? records.filter(r => r.district.toLowerCase() === district.toLowerCase())
        : state
        ? records.filter(r => r.state.toLowerCase() === state.toLowerCase())
        : records;

    scoped = filterDateRange(scoped, cutoff, t);

    // Latest record per market
    const byMarket = new Map();
    for (const rec of sortByDate(scoped)) {
        byMarket.set(rec.market.toLowerCase(), rec);
    }

    const bars = Array.from(byMarket.values())
        .map(r => ({
            market:     r.market,
            district:   r.district,
            state:      r.state,
            modalPrice: r2(r.modalPrice),
            minPrice:   r2(r.minPrice),
            maxPrice:   r2(r.maxPrice),
            date:       r.date,
        }))
        .sort((a, b) => b.modalPrice - a.modalPrice);

    return { bars, count: bars.length };
}

// ─────────────────────────────────────────────────────────────
// 7. PRICE SPREAD BAND CHART
// ─────────────────────────────────────────────────────────────

/**
 * Daily min / modal / max series for the spread band chart.
 *
 * @param {Array}  records
 * @param {string} market
 * @param {number} days
 * @returns {Object}
 */
function computePriceSpreadBand(records, market, days = 30) {
    const t      = today();
    const cutoff = addDays(t, -days);

    const source = market
        ? records.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : records;

    const inRange = sortByDate(filterDateRange(source, cutoff, t));

    if (!inRange.length) {
        return { days, available: false, series: [], avgSpread: null };
    }

    // Aggregate by date
    const byDate = new Map();
    for (const rec of inRange) {
        if (!byDate.has(rec.date)) byDate.set(rec.date, []);
        byDate.get(rec.date).push(rec);
    }

    const series = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, recs]) => ({
            date,
            minPrice:   r2(Math.min(...recs.map(r => r.minPrice))),
            modalPrice: r2(mean(recs.map(r => r.modalPrice))),
            maxPrice:   r2(Math.max(...recs.map(r => r.maxPrice))),
            spread:     r2(Math.max(...recs.map(r => r.maxPrice)) - Math.min(...recs.map(r => r.minPrice))),
        }));

    const avgSpread = r2(mean(series.map(s => s.spread)));

    return { days, available: true, series, avgSpread };
}

// ─────────────────────────────────────────────────────────────
// 8. HEATMAP
// ─────────────────────────────────────────────────────────────

/**
 * Grid/table heatmap of modal prices across markets × recent dates.
 * Normalizes prices to [0,1] for colour-mapping.
 *
 * @param {Array}  records
 * @param {string} [district]
 * @param {string} [state]
 * @param {string} compareBy    - 'market' | 'district' | 'state'
 * @returns {Object}
 */
function computeHeatmap(records, district, state, compareBy = 'market') {
    const t      = today();
    const cutoff = addDays(t, -30);

    let scoped = district
        ? records.filter(r => r.district.toLowerCase() === district.toLowerCase())
        : state
        ? records.filter(r => r.state.toLowerCase() === state.toLowerCase())
        : records;

    scoped = filterDateRange(scoped, cutoff, t);

    // Group dimension
    const dimKey = compareBy === 'district' ? 'district'
                 : compareBy === 'state'    ? 'state'
                 : 'market';

    // All unique dates and dimensions
    const dates = [...new Set(scoped.map(r => r.date))].sort();
    const dims  = [...new Set(scoped.map(r => r[dimKey]))].sort();

    // Build lookup: dim → date → avg modalPrice
    const lookup = new Map();
    for (const rec of scoped) {
        const d = rec[dimKey];
        const k = `${d}||${rec.date}`;
        if (!lookup.has(k)) lookup.set(k, []);
        lookup.get(k).push(rec.modalPrice);
    }

    // Build matrix rows
    const matrix = dims.map(dim => {
        const row = dates.map(date => {
            const prices = lookup.get(`${dim}||${date}`);
            return prices ? r2(mean(prices)) : null;
        });
        return { label: dim, values: row };
    });

    // Normalize for colour domain
    const allValues = matrix.flatMap(row => row.values.filter(v => v !== null));
    const minVal = allValues.length ? Math.min(...allValues) : 0;
    const maxVal = allValues.length ? Math.max(...allValues) : 0;

    const normalizedMatrix = matrix.map(row => ({
        label: row.label,
        values: row.values,
        normalized: row.values.map(v =>
            v === null ? null : maxVal !== minVal ? r2((v - minVal) / (maxVal - minVal)) : 0.5
        ),
    }));

    return {
        compareBy,
        dates,
        matrix:     normalizedMatrix,
        colorDomain: { min: r2(minVal), max: r2(maxVal) },
        missingCells: matrix.flatMap(r => r.values).filter(v => v === null).length,
        note: 'Geographic choropleth not available without geo-coordinates. Grid heatmap provided.',
    };
}

// ─────────────────────────────────────────────────────────────
// 9. SEASONALITY CURVE
// ─────────────────────────────────────────────────────────────

/**
 * Monthly average modal price across all available history.
 *
 * @param {Array}  allRecords   - full DB history (potentially multi-year)
 * @param {string} [market]
 * @returns {Object}
 */
function computeSeasonality(allRecords, market) {
    const source = market
        ? allRecords.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : allRecords;

    if (source.length < 10) {
        return {
            available:   false,
            reason:      'Insufficient data for seasonality computation (need ≥ 10 records across multiple months).',
            months:      [],
        };
    }

    // Group by calendar month (1-12)
    const byMonth = new Map();
    for (const rec of source) {
        const month = parseInt(rec.date.slice(5, 7), 10); // YYYY-MM-DD
        if (!byMonth.has(month)) byMonth.set(month, []);
        byMonth.get(month).push(rec.modalPrice);
    }

    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const months = Array.from({ length: 12 }, (_, i) => {
        const m      = i + 1;
        const prices = byMonth.get(m) || [];
        return {
            month:      m,
            label:      MONTH_NAMES[i],
            avgModal:   prices.length ? r2(mean(prices)) : null,
            count:      prices.length,
        };
    });

    const distinctMonths = months.filter(m => m.count > 0).length;

    return {
        available:     distinctMonths >= 3,
        months,
        distinctMonths,
        note: distinctMonths < 6
            ? 'Limited seasonal coverage. More accurate seasonality patterns will emerge as historical data accumulates.'
            : undefined,
    };
}

// ─────────────────────────────────────────────────────────────
// 10. MOMENTUM CHART
// ─────────────────────────────────────────────────────────────

/**
 * 7-day and 30-day moving averages with crossover detection.
 *
 * @param {Array}  records
 * @param {string} market
 * @returns {Object}
 */
function computeMomentum(records, market) {
    const t      = today();
    const cutoff = addDays(t, -90);

    const source = market
        ? records.filter(r => r.market.toLowerCase() === market.toLowerCase())
        : records;

    const inRange = sortByDate(filterDateRange(source, cutoff, t));

    if (inRange.length < 7) {
        return { available: false, series: [], crossovers: [], direction: 'unknown' };
    }

    // Daily aggregation
    const byDate = new Map();
    for (const rec of inRange) {
        if (!byDate.has(rec.date)) byDate.set(rec.date, []);
        byDate.get(rec.date).push(rec.modalPrice);
    }

    const dailyEntries = Array.from(byDate.entries()).sort(([a],[b]) => a.localeCompare(b));
    const dates  = dailyEntries.map(([d]) => d);
    const prices = dailyEntries.map(([, p]) => mean(p));

    const ma7  = rollingMean(prices, 7);
    const ma30 = rollingMean(prices, 30);

    // Detect crossovers (7d crosses above/below 30d)
    const crossovers = [];
    for (let i = 1; i < prices.length; i++) {
        const prev7  = ma7[i - 1];
        const prev30 = ma30[i - 1];
        const curr7  = ma7[i];
        const curr30 = ma30[i];
        if (prev7 === null || prev30 === null || curr7 === null || curr30 === null) continue;

        if (prev7 <= prev30 && curr7 > curr30) {
            crossovers.push({ date: dates[i], type: 'golden_cross', note: '7d MA crossed above 30d MA (bullish)' });
        } else if (prev7 >= prev30 && curr7 < curr30) {
            crossovers.push({ date: dates[i], type: 'death_cross', note: '7d MA crossed below 30d MA (bearish)' });
        }
    }

    // Current momentum direction
    const last = prices.length - 1;
    const currMA7  = ma7[last];
    const currMA30 = ma30[last];
    let direction = 'flat';
    if (currMA7 !== null && currMA30 !== null) {
        if (currMA7 > currMA30 * 1.01)     direction = 'up';
        else if (currMA7 < currMA30 * 0.99) direction = 'down';
    }

    const series = dates.map((date, i) => ({
        date,
        modalPrice: r2(prices[i]),
        ma7:        ma7[i],
        ma30:       ma30[i],
    }));

    return {
        available:  true,
        series,
        crossovers: crossovers.slice(-5), // last 5 crossovers
        direction,
        currentModal: r2(prices[last]),
        currentMA7:   currMA7,
        currentMA30:  currMA30,
    };
}

module.exports = {
    computeLivePriceMonitor,
    computeNearbyComparison,
    computeTrendView,
    computeForecastBand,
    computeSellSignal,
    computeMarketComparisonBars,
    computePriceSpreadBand,
    computeHeatmap,
    computeSeasonality,
    computeMomentum,
};
