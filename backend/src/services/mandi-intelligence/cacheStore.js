// backend/src/services/mandi-intelligence/cacheStore.js
// ─────────────────────────────────────────────────────────────
// Feature-local cache store for mandi intelligence.
// Uses a simple in-process Map with TTL eviction.
//
// Does NOT touch any other backend cache or global state.
// Heavy fetches (full paginated pulls) are cached here so repeated
// dashboard page loads within the TTL window return instantly.
// ─────────────────────────────────────────────────────────────

'use strict';

/** @type {Map<string, { value: any, expiresAt: number }>} */
const _store = new Map();

/** Default TTL: 15 minutes. Dashboard is fast, data is fresh enough. */
const DEFAULT_TTL_MS = 15 * 60 * 1_000;

/**
 * Store a value under a key with an optional TTL.
 * @param {string} key
 * @param {any}    value
 * @param {number} [ttlMs]
 */
function set(key, value, ttlMs = DEFAULT_TTL_MS) {
    _store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/**
 * Retrieve a value. Returns undefined if missing or expired.
 * @param {string} key
 * @returns {any|undefined}
 */
function get(key) {
    const entry = _store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
        _store.delete(key);
        return undefined;
    }
    return entry.value;
}

/**
 * Invalidate a single key.
 * @param {string} key
 */
function del(key) {
    _store.delete(key);
}

/**
 * Invalidate all keys whose prefix matches.
 * @param {string} prefix
 */
function deleteByPrefix(prefix) {
    for (const key of _store.keys()) {
        if (key.startsWith(prefix)) _store.delete(key);
    }
}

/**
 * Build a deterministic cache key from a params object.
 * Sorts keys alphabetically for consistency regardless of param ordering.
 *
 * @param {string} namespace  - e.g. 'dashboard', 'commodities'
 * @param {Object} params     - query params
 * @returns {string}
 */
function buildKey(namespace, params = {}) {
    const sorted = Object.keys(params)
        .sort()
        .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
        .map(k => `${k}=${String(params[k]).toLowerCase().trim()}`)
        .join('&');
    return `mandi:${namespace}:${sorted}`;
}

/**
 * Get or compute: returns cached value if fresh, otherwise runs factory(),
 * caches the result, and returns it.
 *
 * @param {string}   key
 * @param {Function} factory    - async function returning the value to cache
 * @param {number}   [ttlMs]
 * @returns {Promise<any>}
 */
async function getOrSet(key, factory, ttlMs = DEFAULT_TTL_MS) {
    const cached = get(key);
    if (cached !== undefined) return cached;

    const value = await factory();
    set(key, value, ttlMs);
    return value;
}

module.exports = { set, get, del, deleteByPrefix, buildKey, getOrSet, DEFAULT_TTL_MS };
