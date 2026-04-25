# Mandi Intelligence — Backend Feature Module

## Overview

A fully isolated backend integration for the AgroChain Mandi Intelligence dashboard, powering live price data from the **Government of India — data.gov.in Agmarknet mandi prices API**.

---

## 1. Configuration — Where to Put the API Key

Add the following line to `backend/.env`:

```
MANDI_GOV_API_KEY=<your-key-here>
```

The API key is consumed **server-side only** in `govApiClient.js` and is never included in any response body, log output, or frontend bundle.

---

## 2. Files Added / Changed

### Backend (new files)

| File | Purpose |
|---|---|
| `backend/src/models/MandiPrice.js` | Mongoose model for price snapshots |
| `backend/src/services/mandi-intelligence/govApiClient.js` | Secure API client with pagination |
| `backend/src/services/mandi-intelligence/normalizer.js` | Maps raw API rows to typed clean records |
| `backend/src/services/mandi-intelligence/cacheStore.js` | Feature-local in-process TTL cache |
| `backend/src/services/mandi-intelligence/dataFetcher.js` | API calls, DB upserts, history queries |
| `backend/src/services/mandi-intelligence/analytics.js` | All 10 analytics computation functions |
| `backend/src/services/mandi-intelligence/dashboardService.js` | Full dashboard payload assembly |
| `backend/src/services/mandi-intelligence/validators.js` | Input validation for query params |
| `backend/src/routes/mandiIntelligence.js` | Express router — 6 endpoints |

### Backend (modified — minimal)

| File | Change |
|---|---|
| `backend/server.js` | +1 line to mount the new router |
| `backend/.env.example` | Added MANDI_GOV_API_KEY placeholder |

### Frontend (new files)

| File | Purpose |
|---|---|
| `apps/web/src/services/mandiIntelligenceApi.ts` | Typed fetch functions and TypeScript interfaces |
| `apps/web/src/hooks/useMandiDashboard.ts` | React hooks with loading/error states |

---

## 3. API Endpoint Contract

### GET /api/mandi-intelligence/dashboard

Required: `?commodity=Tomato`
Optional: `&state=Karnataka&district=Mysore&market=Mysore&range=30&forecastHorizon=7&compareBy=market`

Response shape:
```json
{
  "success": true,
  "data": {
    "filters": {},
    "livePriceMonitor": {},
    "nearbyComparison": {},
    "trendView": {},
    "forecastBand": {},
    "sellSignal": {},
    "marketComparisonBars": {},
    "priceSpreadBand": {},
    "heatmap": {},
    "seasonality": {},
    "momentum": {},
    "meta": {}
  }
}
```

### GET /api/mandi-intelligence/commodities
Returns: `{ "success": true, "data": ["Tomato", "Onion", ...] }`

### GET /api/mandi-intelligence/states
Returns list of states.

### GET /api/mandi-intelligence/districts?state=Karnataka
Returns districts for the given state.

### GET /api/mandi-intelligence/markets?district=Mysore
Returns markets for a district or state.

### POST /api/mandi-intelligence/refresh
Body: `{ "commodity": "Tomato", "state": "Karnataka" }`
Returns: `{ "success": true, "count": 87, "message": "Fetched and stored 87 records." }`

---

## 4. Assumptions

- Government API resource ID: `9ef84268-d588-465a-a308-a864a43d0070`
- API date format: DD/MM/YYYY (normalized to YYYY-MM-DD internally)
- Price unit: INR per quintal as reported by the API
- API field names include Arrival_Date, Min_x0020_Price, Max_x0020_Price, Modal_x0020_Price
- The API does not provide geo-coordinates so geo-choropleth maps are not possible without enrichment
- Cache TTL: 15 minutes for dashboard, 30 minutes for dropdown lists
- Historical data accumulates in MongoDB; seasonality accuracy improves over time

---

## 5. Forecast Logic

Method: Weighted rolling average plus damped trend projection plus volatility band

1. Fetch 30-day history of daily modal prices
2. Compute linearly-weighted 30-day average with recent days weighted higher
3. Compute slope (percent change per day) from recent 7-day window
4. Project forward horizon days with damping factor 0.5^(d/7) to prevent runaway extrapolation
5. Use 14-day price standard deviation as the plus/minus 1-sigma band
6. Confidence = dataDensity multiplied by (1 - volatilityPenalty), degraded when data is sparse or volatile
7. Human-readable explanation always included in response

No ML, no AI, no black-box models. Purely statistical and fully traceable.

---

## 6. Sell Signal Logic

| Condition | Signal |
|---|---|
| Relative volatility greater than 12% or forecast confidence less than 30% | watch |
| Current price greater than 30d avg by 5% or more AND greater than 7d avg by 2% or more AND forecast flat or down | sell_now |
| Current price below 30d avg by 3% or more AND forecast trending upward | hold |
| All other cases | watch |

Every signal includes a human-readable explanation field.

---

## 7. Known Government API Limitations

| Limitation | Handling |
|---|---|
| Page size cap around 100 rows per request | Automatic pagination with offset loop |
| Sparse or missing dates | No price fabrication; sparse series returned as-is; forecast confidence degrades |
| No geo-coordinates | District and state level comparison only; heatmap is grid-based |
| Field name encoding with _x0020_ for spaces | Multiple alias lookups in normalizer.js |
| Rate limiting | Up to 2 automatic retries with exponential back-off; 429 surfaced to client |
| Stale government data | Freshness field in livePriceMonitor shows when latest record was published |
| Historical depth limited | Grows as backend caches snapshots over time |

---

## 8. Usage in a Page Component

```tsx
import { useMandiDashboard } from '@/hooks/useMandiDashboard';

const { data, loading, error, refetch } = useMandiDashboard({
    commodity: 'Tomato',
    state:     'Karnataka',
    range:     30,
});

// data.livePriceMonitor, data.trendView, data.forecastBand, etc.
```
