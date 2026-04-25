// backend/src/services/mandi-intelligence/validators.js
// ─────────────────────────────────────────────────────────────
// Input validation for mandi-intelligence query params.
// Returns { valid: true, params } or { valid: false, error: string }.
// Keeps validation logic out of the controller.
// ─────────────────────────────────────────────────────────────

'use strict';

const ALLOWED_RANGES           = [7, 30, 90];
const ALLOWED_FORECAST_HORIZONS = [7, 14];
const ALLOWED_COMPARE_BY       = ['market', 'district', 'state'];
const MAX_PARAM_LENGTH         = 100;

/** Sanitize a string param: trim, max length, or null. */
function cleanStr(val) {
    if (!val || typeof val !== 'string') return null;
    return val.trim().slice(0, MAX_PARAM_LENGTH) || null;
}

/** Parse a positive integer from a string, with an allowed-values check. */
function cleanInt(val, allowed, defaultVal) {
    const n = parseInt(val, 10);
    if (isNaN(n)) return defaultVal;
    return allowed.includes(n) ? n : defaultVal;
}

/**
 * Validate dashboard query params.
 * @param {Object} query  - req.query
 * @returns {{ valid: boolean, params?: Object, error?: string }}
 */
function validateDashboardParams(query) {
    const commodity = cleanStr(query.commodity);
    if (!commodity) {
        return { valid: false, error: 'Query parameter "commodity" is required.' };
    }

    return {
        valid: true,
        params: {
            commodity,
            state:          cleanStr(query.state),
            district:       cleanStr(query.district),
            market:         cleanStr(query.market),
            range:          cleanInt(query.range,           ALLOWED_RANGES,           30),
            forecastHorizon: cleanInt(query.forecastHorizon, ALLOWED_FORECAST_HORIZONS, 7),
            compareBy:      ALLOWED_COMPARE_BY.includes(query.compareBy) ? query.compareBy : 'market',
        },
    };
}

/**
 * Validate filter-dropdown query params.
 * @param {Object} query
 * @param {string} [requiredField]  - if provided, this field must be present
 * @returns {{ valid: boolean, params?: Object, error?: string }}
 */
function validateFilterParams(query, requiredField) {
    const state    = cleanStr(query.state);
    const district = cleanStr(query.district);

    if (requiredField === 'state' && !state) {
        return { valid: false, error: 'Query parameter "state" is required.' };
    }
    if (requiredField === 'district' && !district) {
        return { valid: false, error: 'Query parameter "district" is required.' };
    }

    return { valid: true, params: { state, district } };
}

module.exports = { validateDashboardParams, validateFilterParams };
