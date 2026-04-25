// backend/src/services/mandi-intelligence/normalizer.js
// ─────────────────────────────────────────────────────────────
// Maps raw government API rows → clean internal MandiRecord objects.
// Validates types, parses numbers defensively, standardizes dates.
// Invalid/malformed rows are returned as null and filtered by callers.
// ─────────────────────────────────────────────────────────────

'use strict';

/**
 * @typedef {Object} MandiRecord
 * @property {string} date        - ISO date string "YYYY-MM-DD"
 * @property {string} state
 * @property {string} district
 * @property {string} market
 * @property {string} commodity
 * @property {string} variety
 * @property {string} grade
 * @property {number} minPrice
 * @property {number} maxPrice
 * @property {number} modalPrice
 * @property {string} source
 * @property {Date}   lastFetchedAt
 */

/**
 * Safely parse a number from a string or number value.
 * Returns NaN if the value is null, empty, or non-numeric.
 */
function safeNum(val) {
    if (val === null || val === undefined || val === '') return NaN;
    const n = Number(String(val).replace(/,/g, '').trim());
    return isNaN(n) ? NaN : n;
}

/**
 * Standardize a date string from the government API.
 * The API returns dates in DD/MM/YYYY or DD-MM-YYYY format.
 * Returns "YYYY-MM-DD" or null if unparseable.
 *
 * @param {string} raw
 * @returns {string|null}
 */
function parseDate(raw) {
    if (!raw) return null;
    const cleaned = String(raw).trim();

    // Try DD/MM/YYYY or DD-MM-YYYY
    const dmy = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmy) {
        const day   = dmy[1].padStart(2, '0');
        const month = dmy[2].padStart(2, '0');
        const year  = dmy[3];
        const candidate = `${year}-${month}-${day}`;
        const d = new Date(candidate);
        if (!isNaN(d)) return candidate;
    }

    // Try YYYY-MM-DD directly
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
        const d = new Date(cleaned);
        if (!isNaN(d)) return cleaned;
    }

    return null;
}

/**
 * Normalize a single raw API record into a MandiRecord.
 * Returns null if the record is fundamentally invalid (missing prices/date).
 *
 * Government API field names (as of 2024):
 *   State, District, Market, Commodity, Variety, Grade,
 *   Arrival_Date, Min_x0020_Price, Max_x0020_Price, Modal_x0020_Price
 *
 * Field names can vary slightly — we try both_exact and lowercased variants.
 *
 * @param {Object} raw   - one element from API records array
 * @returns {MandiRecord|null}
 */
function normalizeRow(raw) {
    if (!raw || typeof raw !== 'object') return null;

    // Helper: try multiple key aliases (API field names have spaces encoded as _x0020_)
    const get = (...keys) => {
        for (const k of keys) {
            if (raw[k] !== undefined && raw[k] !== null && raw[k] !== '') return raw[k];
        }
        return undefined;
    };

    const date = parseDate(
        get('Arrival_Date', 'arrival_date', 'Date', 'date')
    );
    if (!date) return null;  // record without a date is unusable

    const minPrice   = safeNum(get('Min_x0020_Price',   'min_price',   'MinPrice',   'Min Price'));
    const maxPrice   = safeNum(get('Max_x0020_Price',   'max_price',   'MaxPrice',   'Max Price'));
    const modalPrice = safeNum(get('Modal_x0020_Price', 'modal_price', 'ModalPrice', 'Modal Price'));

    // All three prices must be valid non-negative numbers
    if (isNaN(minPrice) || isNaN(maxPrice) || isNaN(modalPrice)) return null;
    if (minPrice < 0 || maxPrice < 0 || modalPrice < 0)          return null;
    // Sanity: min ≤ modal ≤ max (with tolerance for data quirks)
    if (minPrice > maxPrice) return null;

    const state     = String(get('State',     'state')     || '').trim();
    const district  = String(get('District',  'district')  || '').trim();
    const market    = String(get('Market',    'market')    || '').trim();
    const commodity = String(get('Commodity', 'commodity') || '').trim();

    if (!state || !district || !market || !commodity) return null;

    return {
        date,
        state,
        district,
        market,
        commodity,
        variety:       String(get('Variety', 'variety') || '').trim(),
        grade:         String(get('Grade',   'grade')   || '').trim(),
        minPrice,
        maxPrice,
        modalPrice,
        source:        'data.gov.in',
        lastFetchedAt: new Date(),
    };
}

/**
 * Normalize an array of raw API records.
 * Filters out null (invalid) rows.
 *
 * @param {Array} rawRecords
 * @returns {MandiRecord[]}
 */
function normalizeRecords(rawRecords) {
    if (!Array.isArray(rawRecords)) return [];
    const results = [];
    for (const row of rawRecords) {
        const norm = normalizeRow(row);
        if (norm) results.push(norm);
    }
    return results;
}

/**
 * Today's date as "YYYY-MM-DD" in local IST context.
 * The government API reports IST dates.
 */
function todayIST() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // returns YYYY-MM-DD
}

/**
 * Add (or subtract) N days from a "YYYY-MM-DD" string.
 * @param {string} dateStr
 * @param {number} days
 * @returns {string}
 */
function addDays(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

module.exports = { normalizeRow, normalizeRecords, parseDate, safeNum, todayIST, addDays };
