// backend/src/routes/mandiIntelligence.js
// ─────────────────────────────────────────────────────────────
// Express routes for Mandi Intelligence feature.
// All routes are namespaced under /api/mandi-intelligence (mounted in server.js).
//
// Routes:
//   GET /api/mandi-intelligence/dashboard    ← main aggregated dashboard
//   GET /api/mandi-intelligence/commodities  ← dropdown
//   GET /api/mandi-intelligence/states       ← dropdown
//   GET /api/mandi-intelligence/districts    ← dropdown (requires ?state=)
//   GET /api/mandi-intelligence/markets      ← dropdown (requires ?district= or ?state=)
//   POST /api/mandi-intelligence/refresh     ← manual data refresh (optional, admin-use)
// ─────────────────────────────────────────────────────────────

'use strict';

const express = require('express');
const router  = express.Router();

const dashboardService = require('../services/mandi-intelligence/dashboardService');
const dataFetcher      = require('../services/mandi-intelligence/dataFetcher');
const { buildKey, getOrSet } = require('../services/mandi-intelligence/cacheStore');
const {
    validateDashboardParams,
    validateFilterParams,
} = require('../services/mandi-intelligence/validators');

// ─── Helpers ─────────────────────────────────────────────────

/** Wrap async route handlers to forward errors to Express error middleware. */
const asyncWrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Standard error responder. */
function sendError(res, status, message, details) {
    return res.status(status).json({
        success: false,
        error: message,
        ...(details ? { details } : {}),
    });
}

// ─── GET /dashboard ──────────────────────────────────────────

/**
 * Main aggregated dashboard endpoint.
 *
 * Required query: commodity
 * Optional:       state, district, market, range (7|30|90), forecastHorizon (7|14), compareBy
 *
 * Returns a full dashboard payload with all 10 analytics sections + meta.
 */
router.get('/dashboard', asyncWrap(async (req, res) => {
    const validation = validateDashboardParams(req.query);
    if (!validation.valid) {
        return sendError(res, 400, validation.error);
    }

    const cacheKey = buildKey('dashboard-full', validation.params);

    const payload = await getOrSet(cacheKey, () =>
        dashboardService.buildDashboard(validation.params)
    );

    return res.json({ success: true, data: payload });
}));

// ─── GET /commodities ────────────────────────────────────────

/**
 * Returns list of commodity names for the filter dropdown.
 * Pulls from DB first; falls back to live API sample.
 */
router.get('/commodities', asyncWrap(async (req, res) => {
    const commodities = await dataFetcher.getCommodities();
    return res.json({ success: true, data: commodities });
}));

// ─── GET /states ─────────────────────────────────────────────

/**
 * Returns list of state names for the filter dropdown.
 */
router.get('/states', asyncWrap(async (req, res) => {
    const states = await dataFetcher.getStates();
    return res.json({ success: true, data: states });
}));

// ─── GET /districts ──────────────────────────────────────────

/**
 * Returns districts for a given state.
 * Query: ?state=Karnataka
 */
router.get('/districts', asyncWrap(async (req, res) => {
    const validation = validateFilterParams(req.query, 'state');
    if (!validation.valid) {
        return sendError(res, 400, validation.error);
    }
    const districts = await dataFetcher.getDistricts(validation.params.state);
    return res.json({ success: true, data: districts });
}));

// ─── GET /markets ────────────────────────────────────────────

/**
 * Returns markets for a given district and/or state.
 * Query: ?district=Mysore  OR  ?state=Karnataka
 */
router.get('/markets', asyncWrap(async (req, res) => {
    const { state, district } = req.query;
    const markets = await dataFetcher.getMarkets({
        state:    state    ? String(state).trim().slice(0, 100)    : undefined,
        district: district ? String(district).trim().slice(0, 100) : undefined,
    });
    return res.json({ success: true, data: markets });
}));

// ─── POST /refresh ───────────────────────────────────────────

/**
 * Manually trigger a fresh fetch from the government API and store results.
 * Useful for admin/cron invocation. Requires: { commodity, state?, district?, market? }
 *
 * This endpoint does NOT require auth to keep the feature self-contained,
 * but can be wrapped with the existing `auth` middleware in production
 * if admin-only access is desired.
 */
router.post('/refresh', asyncWrap(async (req, res) => {
    const { commodity, state, district, market } = req.body || {};

    if (!commodity) {
        return sendError(res, 400, 'Field "commodity" is required in request body.');
    }

    const fetched = await dataFetcher.fetchAndStore({
        commodity: String(commodity).trim().slice(0, 100),
        state:     state    ? String(state).trim().slice(0, 100)    : undefined,
        district:  district ? String(district).trim().slice(0, 100) : undefined,
        market:    market   ? String(market).trim().slice(0, 100)   : undefined,
    });

    return res.json({
        success: true,
        message: `Fetched and stored ${fetched.length} records.`,
        count: fetched.length,
    });
}));

// ─── Error handler for this router ───────────────────────────

router.use((err, req, res, _next) => {
    // Never expose API key or internal paths to response
    const isRateLimit   = err.code === 'RATE_LIMIT';
    const isAuthError   = err.code === 'AUTH_ERROR';
    const isUpstream    = err.code === 'UPSTREAM_ERROR';

    if (isRateLimit) {
        return res.status(429).json({ success: false, error: 'Government API rate limit reached. Please try again shortly.' });
    }
    if (isAuthError) {
        return res.status(502).json({ success: false, error: 'Government API authentication error. Check server configuration.' });
    }
    if (isUpstream) {
        return res.status(502).json({ success: false, error: 'Government mandi data API is temporarily unavailable.', fallback: true });
    }

    // Generic — no stack traces to client
    console.error('[mandi-intelligence] unhandled error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error in mandi-intelligence module.' });
});

module.exports = router;
