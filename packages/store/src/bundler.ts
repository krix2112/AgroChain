// packages/store/src/bundler.ts
// Smart Route Bundling Algorithm
// Groups AGREED trades with matching fromCity/toCity and deliveryDates within 2 days

import type { Trade, BundleSuggestion, BundleCostBreakdown } from './types';

/** Base delivery cost per route (in ₹). In production this would come from a rate API / config. */
const BASE_DELIVERY_COST = 5000;

/** Maximum days apart two deliveryDates can be to still qualify for the same bundle. */
const MAX_DATE_SPREAD_DAYS = 2;

// ─── helpers ────────────────────────────────────────────────────────────────────

function normalizeCity(city: string): string {
  return city.trim().toLowerCase();
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.abs(a.getTime() - b.getTime()) / msPerDay;
}

/**
 * Given an array of dates, returns true if every date is within
 * MAX_DATE_SPREAD_DAYS of every other date.
 */
function datesAreClose(dates: Date[]): boolean {
  for (let i = 0; i < dates.length; i++) {
    for (let j = i + 1; j < dates.length; j++) {
      if (daysBetween(dates[i], dates[j]) > MAX_DATE_SPREAD_DAYS) return false;
    }
  }
  return true;
}

// ─── cost calculation ───────────────────────────────────────────────────────────

/**
 * Calculate the cost breakdown for a bundle.
 *
 * • bundledCostPerTrade = baseCost / numberOfTrades  (split evenly)
 * • soloCost            = baseCost                   (full price if trader opts out)
 *
 * Both numbers are exposed so the trader can make an informed decision.
 */
export function calculateCost(
  numberOfTrades: number,
  baseCost: number = BASE_DELIVERY_COST,
): BundleCostBreakdown {
  return {
    baseCost,
    numberOfTrades,
    bundledCostPerTrade: Math.ceil(baseCost / numberOfTrades),
    soloCost: baseCost,
    savingsPercent: Math.round(((baseCost - baseCost / numberOfTrades) / baseCost) * 100),
  };
}

// ─── main bundler ───────────────────────────────────────────────────────────────

/**
 * Given an array of AGREED trades (with fromCity, toCity, deliveryDate populated),
 * return an array of BundleSuggestions — one per qualifying route group.
 *
 * A group qualifies when:
 *   1. fromCity matches (case-insensitive)
 *   2. toCity   matches (case-insensitive)
 *   3. Every deliveryDate in the group is within 2 days of every other
 *   4. Group contains 2 or more trades
 */
export function findBundleSuggestions(trades: Trade[]): BundleSuggestion[] {
  // Only consider AGREED trades that have the required location data
  const eligible = trades.filter(
    (t) =>
      t.state === 'AGREED' &&
      t.fromCity &&
      t.toCity &&
      t.deliveryDate &&
      !t.bundleId, // skip already-bundled trades
  );

  // Group by normalised fromCity→toCity route key
  const routeGroups = new Map<string, Trade[]>();

  for (const trade of eligible) {
    const key = `${normalizeCity(trade.fromCity!)}→${normalizeCity(trade.toCity!)}`;
    const group = routeGroups.get(key) ?? [];
    group.push(trade);
    routeGroups.set(key, group);
  }

  const suggestions: BundleSuggestion[] = [];

  for (const [routeKey, group] of routeGroups.entries()) {
    if (group.length < 2) continue;

    // Within each route, further cluster by date proximity
    const dateClusters = clusterByDate(group);

    for (const cluster of dateClusters) {
      if (cluster.length < 2) continue;

      const totalWeight = cluster.reduce((sum, t) => sum + (t.quantity ?? 0), 0);
      const cost = calculateCost(cluster.length);

      // Use earliest delivery date in cluster as the bundle delivery date
      const deliveryDates = cluster.map(
        (t) => new Date(t.deliveryDate!),
      );
      deliveryDates.sort((a, b) => a.getTime() - b.getTime());

      suggestions.push({
        routeKey,
        fromCity: cluster[0].fromCity!,
        toCity: cluster[0].toCity!,
        deliveryDate: deliveryDates[0].toISOString(),
        trades: cluster,
        totalWeight,
        cost,
      });
    }
  }

  return suggestions;
}

/**
 * Find a bundle suggestion that includes a specific trade.
 * This is what the `/api/bundle/check` endpoint calls — it returns the
 * suggestion containing the requested tradeId (or null).
 */
export function findBundleForTrade(
  tradeId: string,
  allTrades: Trade[],
): BundleSuggestion | null {
  const suggestions = findBundleSuggestions(allTrades);
  return suggestions.find((s) => s.trades.some((t) => t.id === tradeId)) ?? null;
}

// ─── date clustering ────────────────────────────────────────────────────────────

/**
 * Simple greedy clustering: sort trades by deliveryDate, then sweep through
 * and start a new cluster whenever a trade is > MAX_DATE_SPREAD_DAYS from the
 * first trade in the current cluster.
 */
function clusterByDate(trades: Trade[]): Trade[][] {
  const sorted = [...trades].sort(
    (a, b) =>
      new Date(a.deliveryDate!).getTime() - new Date(b.deliveryDate!).getTime(),
  );

  const clusters: Trade[][] = [];
  let current: Trade[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const first = new Date(current[0].deliveryDate!);
    const cur = new Date(sorted[i].deliveryDate!);

    if (daysBetween(first, cur) <= MAX_DATE_SPREAD_DAYS) {
      current.push(sorted[i]);
    } else {
      clusters.push(current);
      current = [sorted[i]];
    }
  }
  clusters.push(current);
  return clusters;
}
