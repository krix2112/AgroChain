export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'trader' | 'transporter';
  walletAddress: string;
}

export interface Trade {
  id: string;
  cropName: string;
  quantity: number;
  price: number;
  state: string;
  farmerName: string;
  traderName: string;
  transporterPhone?: string;
  createdAt?: string;
  agreedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  // Smart Route Bundling fields
  fromCity?: string;
  toCity?: string;
  deliveryDate?: string;
  bundleId?: string | null;
}

// ─── Smart Route Bundling Types ─────────────────────────────────────────────

export interface BundleCostBreakdown {
  baseCost: number;
  numberOfTrades: number;
  bundledCostPerTrade: number;
  soloCost: number;
  savingsPercent: number;
}

export interface BundleSuggestion {
  routeKey: string;
  fromCity: string;
  toCity: string;
  deliveryDate: string;
  trades: Trade[];
  totalWeight: number;
  cost: BundleCostBreakdown;
}

export interface DeliveryBundle {
  id: string;
  trades: string[];          // trade IDs
  fromCity: string;
  toCity: string;
  deliveryDate: string;
  transporter?: string;      // user ID
  totalWeight: number;
  costPerTrade: number;
  baseCost: number;
  state: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}