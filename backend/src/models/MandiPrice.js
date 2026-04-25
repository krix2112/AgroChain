// backend/src/models/MandiPrice.js
// Mandi Intelligence feature — isolated model for government mandi price snapshots.
// Do NOT use this model in any other feature; keep it scoped to mandi-intelligence.

const mongoose = require('mongoose');

/**
 * Normalized mandi price record.
 * Raw government API rows are parsed, validated, and stored here for caching
 * and historical trend/seasonality/forecast computation.
 */
const MandiPriceSchema = new mongoose.Schema(
    {
        // Canonical record date (yyyy-mm-dd normalized)
        date: { type: String, required: true, index: true },

        // Government API fields (normalized to lowercase-trimmed strings)
        state:     { type: String, required: true, index: true },
        district:  { type: String, required: true, index: true },
        market:    { type: String, required: true, index: true },
        commodity: { type: String, required: true, index: true },
        variety:   { type: String, default: '' },
        grade:     { type: String, default: '' },

        // Price values (INR per quintal — as reported by API)
        minPrice:   { type: Number, required: true },
        maxPrice:   { type: Number, required: true },
        modalPrice: { type: Number, required: true },

        // Provenance
        source:        { type: String, default: 'data.gov.in' },
        lastFetchedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        // Prevent duplicate storage of the same physical record
        // compound unique: one row = one commodity+market+date combination
    }
);

// Compound index for fast dashboard queries and de-duplication
MandiPriceSchema.index(
    { commodity: 1, state: 1, district: 1, market: 1, date: 1 },
    { unique: true }
);

// TTL index is NOT used here — we want to keep historical data indefinitely
// for seasonality and trend computation. Eviction is handled at application layer.

module.exports = mongoose.model('MandiPrice', MandiPriceSchema);
