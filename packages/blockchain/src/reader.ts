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

const STATE_MAP = ["CREATED", "AGREED", "IN_DELIVERY", "DELIVERED", "COMPLETED"];

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
