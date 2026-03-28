import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SHARDEUM_RPC } from './config';

export interface Trade {
  id: number;
  farmer: string;
  trader: string;
  transporter: string;
  cropName: string;
  quantity: number;
  price: string;
  state: string;
  utrHash: string;
  ipfsDocHash: string;
  createdAt: number;
}

export interface CropRequest {
  requestId: number;
  trader: string;
  cropName: string;
  quantity: number;
  preferredPrice: number;
  state: string;
  linkedTradeId: number;
  createdAt: string;
}

const STATE_MAP = ["CREATED", "AGREED", "IN_DELIVERY", "DELIVERED", "COMPLETED"];
const REQUEST_STATE_MAP = ["OPEN", "ACCEPTED", "CANCELLED"];

export function getProvider() {
  return new ethers.JsonRpcProvider(SHARDEUM_RPC);
}

export function getContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export function parseTrade(tradeData: any): Trade {
  return {
    id: Number(tradeData.id),
    farmer: tradeData.farmer,
    trader: tradeData.trader,
    transporter: tradeData.transporter,
    cropName: tradeData.cropName,
    quantity: Number(tradeData.quantity),
    // Using string to handle BigInt safety for price easily
    price: tradeData.price ? tradeData.price.toString() : "0",
    state: STATE_MAP[Number(tradeData.state)] || "UNKNOWN",
    utrHash: tradeData.utrHash,
    ipfsDocHash: tradeData.ipfsDocHash,
    createdAt: Number(tradeData.createdAt)
  };
}

export async function getTrade(id: number): Promise<Trade> {
  const contract = getContract();
  const tradeData = await contract.getTrade(id);
  return parseTrade(tradeData);
}

export async function getTradesByFarmer(address: string): Promise<Trade[]> {
  const contract = getContract();
  const tradesData = await contract.getTradesByFarmer(address);
  return tradesData.map(parseTrade);
}

export async function getTradesByTrader(address: string): Promise<Trade[]> {
  const contract = getContract();
  const tradesData = await contract.getTradesByTrader(address);
  return tradesData.map(parseTrade);
}

export async function getTradeState(id: number): Promise<string> {
  const contract = getContract();
  const tradeData = await contract.getTrade(id);
  return STATE_MAP[Number(tradeData.state)] || "UNKNOWN";
}

export async function getCropRequest(requestId: number): Promise<CropRequest> {
  const contract = getContract();
  const raw = await contract.getCropRequest(requestId);
  
  return {
    requestId: Number(raw.requestId),
    trader: raw.trader,
    cropName: raw.cropName,
    quantity: Number(raw.quantity),
    preferredPrice: Number(raw.preferredPrice),
    state: REQUEST_STATE_MAP[Number(raw.state)] || "UNKNOWN",
    linkedTradeId: Number(raw.linkedTradeId),
    createdAt: new Date(Number(raw.createdAt) * 1000).toISOString()
  };
}

export async function getOpenRequests(): Promise<CropRequest[]> {
  const contract = getContract();
  const rawArray = await contract.getAllOpenRequests();
  
  const mapped = rawArray.map((raw: any) => ({
    requestId: Number(raw.requestId),
    trader: raw.trader,
    cropName: raw.cropName,
    quantity: Number(raw.quantity),
    preferredPrice: Number(raw.preferredPrice),
    state: REQUEST_STATE_MAP[Number(raw.state)] || "UNKNOWN",
    linkedTradeId: Number(raw.linkedTradeId),
    createdAt: new Date(Number(raw.createdAt) * 1000).toISOString()
  }));

  return mapped.filter((req: CropRequest) => req.state === 'OPEN');
}
