export * as authAPI from './auth'
export * as tradeAPI from './trade'
export * as paymentAPI from './payment'
export * as listingAPI from './listing'
export * as requestAPI from './request'
export * as bundleAPI from './bundle'
export { default as apiClient } from './client'

export interface FPOProfile {
  id: string;
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  cropsHandled: string[];
  totalMembers: number;
  verifiedStatus: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface MemberFarmer {
  id: string;
  fpoId: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  crops: string[];
  totalSuppliedKg: number;
  kycStatus: 'verified' | 'pending';
  joinedAt: string;
}

export interface ProcurementEntry {
  id: string;
  fpoId: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  quantityKg: number;
  grade: 'A' | 'B' | 'C';
  moisturePercent: number;
  collectionCenter: string;
  estimatedRate: number;
  status: 'pending' | 'aggregated' | 'settled';
  createdAt: string;
}

export interface AggregatedLot {
  id: string;
  fpoId: string;
  lotCode: string;
  cropType: string;
  totalQuantityKg: number;
  averageGrade: string;
  reservePrice: number;
  targetPrice: number;
  warehouseLocation: string;
  availableDate: string;
  status: 'draft' | 'listed' | 'negotiated' | 'sold';
  procurementIds: string[];
}

export interface TradeSummary {
  id: string;
  lotId: string;
  fpoId: string;
  buyerId: string;
  buyerName: string;
  agreedPrice: number;
  totalAmount: number;
  status: 'created' | 'agreed' | 'in_delivery' | 'delivered' | 'paid' | 'completed';
  blockchainTxHash: string;
  createdAt: string;
}

export interface FarmerPayout {
  farmerId: string;
  farmerName: string;
  quantityKg: number;
  grade: 'A' | 'B' | 'C';
  ratePerKg: number;
  grossAmount: number;
  deductions: number;
  netPayable: number;
  status: 'pending' | 'paid';
  utrReference: string | null;
}
