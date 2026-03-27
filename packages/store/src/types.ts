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
}