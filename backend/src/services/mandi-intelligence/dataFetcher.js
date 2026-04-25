// backend/src/services/mandi-intelligence/dataFetcher.js
// ─────────────────────────────────────────────────────────────
// Orchestrates fetching from the govt API, normalizing, de-duplicating,
// and persisting snapshots to MongoDB (MandiPrice collection).
//
// Also provides a high-level query interface that first checks MongoDB
// history before hitting the live API — enabling incremental ingestion.
// ─────────────────────────────────────────────────────────────

'use strict';

const govApiClient  = require('./govApiClient');
const { normalizeRecords, todayIST, addDays } = require('./normalizer');
const { buildKey, getOrSet, DEFAULT_TTL_MS }  = require('./cacheStore');
const MandiPrice = require('../../models/MandiPrice');

/**
 * Fetch, normalize, and upsert records for a commodity+location+range.
 * Returns the normalized records that were freshly pulled from the API.
 *
 * @param {Object} params
 * @param {string} params.commodity
 * @param {string} [params.state]
 * @param {string} [params.district]
 * @param {string} [params.market]
 * @returns {Promise<import('./normalizer').MandiRecord[]>}
 */
async function fetchAndStore({ commodity, state, district, market } = {}) {
    const filters = {};
    if (commodity) filters.commodity = commodity;
    if (state)     filters.state     = state;
    if (district)  filters.district  = district;
    if (market)    filters.market    = market;

    const rawRecords = await govApiClient.fetchAll({ filters, maxRecords: 2_000 });
    const normalized = normalizeRecords(rawRecords);

    if (normalized.length > 0) {
        // Bulk upsert — insert new, skip existing (unique index handles de-dup)
        const ops = normalized.map(rec => ({
            updateOne: {
                filter: {
                    commodity: rec.commodity,
                    state:     rec.state,
                    district:  rec.district,
                    market:    rec.market,
                    date:      rec.date,
                },
                update: { $setOnInsert: rec },
                upsert: true,
            },
        }));
        try {
            await MandiPrice.bulkWrite(ops, { ordered: false });
        } catch (bulkErr) {
            // Log but don't throw — cached data is still usable
            if (bulkErr.code !== 11000) { // ignore duplicate-key noise
                console.warn('[mandi-intelligence] bulkWrite warning:', bulkErr.message);
            }
        }
    }

    return normalized;
}

/**
 * Query historical MandiPrice documents from MongoDB.
 * Falls back to live API fetch if DB has no relevant records.
 *
 * @param {Object} params
 * @param {string} params.commodity
 * @param {string} [params.state]
 * @param {string} [params.district]
 * @param {string} [params.market]
 * @param {number} [params.days=90]   - how many days of history to retrieve
 * @returns {Promise<import('./normalizer').MandiRecord[]>}
 */
async function queryHistory({ commodity, state, district, market, days = 90 } = {}) {
    const today    = todayIST();
    const cutoff   = addDays(today, -days);
    const cacheKey = buildKey('history', { commodity, state, district, market, days });

    return getOrSet(cacheKey, async () => {
        const dbFilter = {
            commodity: new RegExp(`^${escapeRegex(commodity)}$`, 'i'),
            date: { $gte: cutoff },
        };
        if (state)    dbFilter.state    = new RegExp(`^${escapeRegex(state)}$`, 'i');
        if (district) dbFilter.district = new RegExp(`^${escapeRegex(district)}$`, 'i');
        if (market)   dbFilter.market   = new RegExp(`^${escapeRegex(market)}$`, 'i');

        let docs = await MandiPrice.find(dbFilter).sort({ date: 1 }).lean();

        // If DB is sparse (< 3 records), try a live fetch first then re-query
        if (docs.length < 3) {
            try {
                await fetchAndStore({ commodity, state, district, market });
                docs = await MandiPrice.find(dbFilter).sort({ date: 1 }).lean();
            } catch (fetchErr) {
                console.warn('[mandi-intelligence] live fetch failed, using sparse DB data:', fetchErr.message);
            }
        }

        return docs;
    }, DEFAULT_TTL_MS);
}

const COMMON_COMMODITIES = [
    'Apple', 'Banana', 'Bengal Gram(Gram)(Whole)', 'Cabbage', 'Cauliflower', 'Cotton',
    'Green Chilli', 'Groundnut', 'Maize', 'Mustard', 'Onion', 'Paddy(Dhan)(Common)',
    'Potato', 'Rice', 'Soyabean', 'Tomato', 'Wheat'
];

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

/**
 * Get distinct commodity names from DB (and supplement with live API sample and standard list).
 * @returns {Promise<string[]>}
 */
async function getCommodities() {
    return getOrSet(buildKey('commodities-expanded', {}), async () => {
        const fromDb = await MandiPrice.distinct('commodity');
        const seen = new Set([...COMMON_COMMODITIES]);
        fromDb.forEach(c => seen.add(c));
        try {
            const vals = await govApiClient.fetchDistinctValues('Commodity');
            vals.forEach(c => seen.add(c));
        } catch {}
        return Array.from(seen).sort();
    }, 30 * 60 * 1_000); // 30 min TTL
}

/**
 * Get distinct states from DB (supplemented with standard Indian states).
 * @returns {Promise<string[]>}
 */
async function getStates() {
    return getOrSet(buildKey('states-expanded', {}), async () => {
        const fromDb = await MandiPrice.distinct('state');
        const seen = new Set([...INDIAN_STATES]);
        fromDb.forEach(s => seen.add(s));
        try {
            const vals = await govApiClient.fetchDistinctValues('State');
            vals.forEach(s => seen.add(s));
        } catch {}
        return Array.from(seen).sort();
    }, 30 * 60 * 1_000);
}

/**
 * Get distinct districts for a given state.
 * @param {string} state
 * @returns {Promise<string[]>}
 */
async function getDistricts(state) {
    return getOrSet(buildKey('districts', { state }), async () => {
        const query = state
            ? { state: new RegExp(`^${escapeRegex(state)}$`, 'i') }
            : {};
        return MandiPrice.distinct('district', query);
    }, 30 * 60 * 1_000);
}

/**
 * Get distinct markets for a given district (and optionally state).
 * @param {Object} params
 * @param {string} [params.district]
 * @param {string} [params.state]
 * @returns {Promise<string[]>}
 */
async function getMarkets({ district, state } = {}) {
    return getOrSet(buildKey('markets', { district, state }), async () => {
        const query = {};
        if (state)    query.state    = new RegExp(`^${escapeRegex(state)}$`, 'i');
        if (district) query.district = new RegExp(`^${escapeRegex(district)}$`, 'i');
        return MandiPrice.distinct('market', query);
    }, 30 * 60 * 1_000);
}

function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { fetchAndStore, queryHistory, getCommodities, getStates, getDistricts, getMarkets };
