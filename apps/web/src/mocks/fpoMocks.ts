import { 
  FPOProfile, 
  MemberFarmer, 
  ProcurementEntry, 
  AggregatedLot, 
  TradeSummary, 
  FarmerPayout 
} from '@agrochain/api';

export const MOCK_FPO_PROFILE: FPOProfile = {
  id: 'fpo_001',
  name: 'Rajasthan Agri FPO',
  registrationNumber: 'RJ/FPO/2024/089',
  district: 'Jaipur',
  state: 'Rajasthan',
  cropsHandled: ['Wheat', 'Mustard', 'Onion'],
  totalMembers: 142,
  verifiedStatus: true,
  contactEmail: 'contact@rajagri.org',
  contactPhone: '+91 141 278 9000'
};

export const MOCK_MEMBERS: MemberFarmer[] = [
  {
    id: 'm_001',
    fpoId: 'fpo_001',
    name: 'Rajesh Kumar',
    phone: '+91 98290 12345',
    village: 'Chomu',
    district: 'Jaipur',
    crops: ['Wheat', 'Mustard'],
    totalSuppliedKg: 1250,
    kycStatus: 'verified',
    joinedAt: '2024-01-15'
  },
  {
    id: 'm_002',
    fpoId: 'fpo_001',
    name: 'Sunil Meena',
    phone: '+91 98290 54321',
    village: 'Bagru',
    district: 'Jaipur',
    crops: ['Wheat', 'Onion'],
    totalSuppliedKg: 800,
    kycStatus: 'verified',
    joinedAt: '2024-02-10'
  },
  {
    id: 'm_003',
    fpoId: 'fpo_001',
    name: 'Amit Sharma',
    phone: '+91 98290 67890',
    village: 'Phulera',
    district: 'Jaipur',
    crops: ['Mustard', 'Onion'],
    totalSuppliedKg: 450,
    kycStatus: 'pending',
    joinedAt: '2024-03-05'
  },
  {
    id: 'm_004',
    fpoId: 'fpo_001',
    name: 'Vikram Singh',
    phone: '+91 98290 33445',
    village: 'Sambhar',
    district: 'Jaipur',
    crops: ['Wheat'],
    totalSuppliedKg: 2100,
    kycStatus: 'verified',
    joinedAt: '2024-01-20'
  },
  {
    id: 'm_005',
    fpoId: 'fpo_001',
    name: 'Ganesharam',
    phone: '+91 98290 11223',
    village: 'Shahpura',
    district: 'Jaipur',
    crops: ['Mustard'],
    totalSuppliedKg: 300,
    kycStatus: 'verified',
    joinedAt: '2024-03-25'
  },
  {
    id: 'm_006',
    fpoId: 'fpo_001',
    name: 'Deepa Devi',
    phone: '+91 98290 99887',
    village: 'Bassi',
    district: 'Jaipur',
    crops: ['Onion', 'Wheat'],
    totalSuppliedKg: 650,
    kycStatus: 'pending',
    joinedAt: '2024-04-10'
  }
];

export const MOCK_PROCUREMENTS: ProcurementEntry[] = [
  {
    id: 'p_001',
    fpoId: 'fpo_001',
    farmerId: 'm_001',
    farmerName: 'Rajesh Kumar',
    cropType: 'Wheat',
    quantityKg: 500,
    grade: 'A',
    moisturePercent: 12.5,
    collectionCenter: 'Jaipur North',
    estimatedRate: 22.50,
    status: 'settled',
    createdAt: '2024-04-18T10:30:00Z'
  },
  {
    id: 'p_002',
    fpoId: 'fpo_001',
    farmerId: 'm_002',
    farmerName: 'Sunil Meena',
    cropType: 'Wheat',
    quantityKg: 300,
    grade: 'B',
    moisturePercent: 13.2,
    collectionCenter: 'Jaipur North',
    estimatedRate: 21.00,
    status: 'aggregated',
    createdAt: '2024-04-19T09:15:00Z'
  },
  {
    id: 'p_003',
    fpoId: 'fpo_001',
    farmerId: 'm_004',
    farmerName: 'Vikram Singh',
    cropType: 'Wheat',
    quantityKg: 1000,
    grade: 'A',
    moisturePercent: 11.8,
    collectionCenter: 'Jaipur North',
    estimatedRate: 22.75,
    status: 'aggregated',
    createdAt: '2024-04-20T11:00:00Z'
  },
  {
    id: 'p_004',
    fpoId: 'fpo_001',
    farmerId: 'm_001',
    farmerName: 'Rajesh Kumar',
    cropType: 'Mustard',
    quantityKg: 200,
    grade: 'A',
    moisturePercent: 8.0,
    collectionCenter: 'Jaipur South',
    estimatedRate: 54.00,
    status: 'pending',
    createdAt: '2024-04-21T14:20:00Z'
  },
  {
    id: 'p_005',
    fpoId: 'fpo_001',
    farmerId: 'm_005',
    farmerName: 'Ganesharam',
    cropType: 'Mustard',
    quantityKg: 300,
    grade: 'B',
    moisturePercent: 9.5,
    collectionCenter: 'Jaipur South',
    estimatedRate: 51.50,
    status: 'pending',
    createdAt: '2024-04-21T15:45:00Z'
  },
  {
    id: 'p_006',
    fpoId: 'fpo_001',
    farmerId: 'm_002',
    farmerName: 'Sunil Meena',
    cropType: 'Wheat',
    quantityKg: 500,
    grade: 'A',
    moisturePercent: 12.0,
    collectionCenter: 'Jaipur North',
    estimatedRate: 22.50,
    status: 'aggregated',
    createdAt: '2024-04-22T08:30:00Z'
  },
  {
    id: 'p_007',
    fpoId: 'fpo_001',
    farmerId: 'm_003',
    farmerName: 'Amit Sharma',
    cropType: 'Mustard',
    quantityKg: 150,
    grade: 'C',
    moisturePercent: 11.0,
    collectionCenter: 'Jaipur South',
    estimatedRate: 48.00,
    status: 'pending',
    createdAt: '2024-04-22T10:00:00Z'
  },
  {
    id: 'p_008',
    fpoId: 'fpo_001',
    farmerId: 'm_006',
    farmerName: 'Deepa Devi',
    cropType: 'Wheat',
    quantityKg: 250,
    grade: 'B',
    moisturePercent: 13.5,
    collectionCenter: 'Jaipur North',
    estimatedRate: 21.00,
    status: 'pending',
    createdAt: '2024-04-23T11:20:00Z'
  }
];

export const MOCK_LOTS: AggregatedLot[] = [
  {
    id: 'lot_001',
    fpoId: 'fpo_001',
    lotCode: 'LOT-WHT-JPR-001',
    cropType: 'Wheat',
    totalQuantityKg: 1800,
    averageGrade: 'A',
    reservePrice: 24000,
    targetPrice: 26500,
    warehouseLocation: 'Jaipur Central Warehouse',
    availableDate: '2024-04-25',
    status: 'sold',
    procurementIds: ['p_002', 'p_003', 'p_006']
  },
  {
    id: 'lot_002',
    fpoId: 'fpo_001',
    lotCode: 'LOT-MST-JPR-002',
    cropType: 'Mustard',
    totalQuantityKg: 650,
    averageGrade: 'B+',
    reservePrice: 35000,
    targetPrice: 38000,
    warehouseLocation: 'Jaipur South Hub',
    availableDate: '2024-04-28',
    status: 'listed',
    procurementIds: ['p_004', 'p_005', 'p_007']
  },
  {
    id: 'lot_003',
    fpoId: 'fpo_001',
    lotCode: 'LOT-WHT-JPR-003',
    cropType: 'Wheat',
    totalQuantityKg: 250,
    averageGrade: 'B',
    reservePrice: 5500,
    targetPrice: 6000,
    warehouseLocation: 'Jaipur North Center',
    availableDate: '2024-05-01',
    status: 'draft',
    procurementIds: ['p_008']
  }
];

export const MOCK_TRADES: TradeSummary[] = [
  {
    id: 'tr_001',
    lotId: 'lot_001',
    fpoId: 'fpo_001',
    buyerId: 'b_999',
    buyerName: 'Adani Agri Logistics',
    agreedPrice: 25.50,
    totalAmount: 45900,
    status: 'paid',
    blockchainTxHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e2b1b3c4d5e6f7a8b9c0d1e2f',
    createdAt: '2024-04-23T16:45:00Z'
  },
  {
    id: 'tr_002',
    lotId: 'lot_001', // Example: Same lot, different trade (or split)
    fpoId: 'fpo_001',
    buyerId: 'b_888',
    buyerName: 'ITC Limited',
    agreedPrice: 26.00,
    totalAmount: 52000,
    status: 'agreed',
    blockchainTxHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    createdAt: '2024-04-24T10:20:00Z'
  }
];

export const MOCK_PAYOUTS: FarmerPayout[] = [
  {
    farmerId: 'm_002',
    farmerName: 'Sunil Meena',
    quantityKg: 300,
    grade: 'B',
    ratePerKg: 25.50,
    grossAmount: 7650,
    deductions: 150,
    netPayable: 7500,
    status: 'paid',
    utrReference: 'PAY-SBI-99887766'
  },
  {
    farmerId: 'm_004',
    farmerName: 'Vikram Singh',
    quantityKg: 1000,
    grade: 'A',
    ratePerKg: 25.50,
    grossAmount: 25500,
    deductions: 500,
    netPayable: 25000,
    status: 'paid',
    utrReference: 'PAY-HDFC-11223344'
  },
  {
    farmerId: 'm_002',
    farmerName: 'Sunil Meena',
    quantityKg: 500,
    grade: 'A',
    ratePerKg: 25.50,
    grossAmount: 12750,
    deductions: 250,
    netPayable: 12500,
    status: 'pending',
    utrReference: null
  },
  {
    farmerId: 'm_001',
    farmerName: 'Rajesh Kumar',
    quantityKg: 500,
    grade: 'A',
    ratePerKg: 22.50,
    grossAmount: 11250,
    deductions: 225,
    netPayable: 11025,
    status: 'paid',
    utrReference: 'PAY-PNB-55443322'
  },
  {
    farmerId: 'm_003',
    farmerName: 'Amit Sharma',
    quantityKg: 150,
    grade: 'C',
    ratePerKg: 18.00,
    grossAmount: 2700,
    deductions: 54,
    netPayable: 2646,
    status: 'pending',
    utrReference: null
  },
  {
    farmerId: 'm_005',
    farmerName: 'Ganesharam',
    quantityKg: 300,
    grade: 'B',
    ratePerKg: 21.00,
    grossAmount: 6300,
    deductions: 126,
    netPayable: 6174,
    status: 'pending',
    utrReference: null
  }
];
