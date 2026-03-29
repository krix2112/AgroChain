"use client";

import React from 'react';
import StatusBadge from './StatusBadge';

interface TradeCardProps {
  id: number;
  cropName: string;
  quantity: number;
  price: number;
  state: string;
  farmerName: string;
  traderName: string;
  onPress: () => void;
}

const TradeCard: React.FC<TradeCardProps> = ({
  cropName,
  quantity,
  price,
  state,
  farmerName,
  traderName,
  onPress
}) => {
  return (
    <div 
      onClick={onPress}
      className="bg-zinc-900/40 border border-white/5 p-6 m-2 rounded-[32px] hover:border-emerald-500/20 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{cropName}</h3>
        <StatusBadge state={state} />
      </div>
      <p className="text-sm text-zinc-500 font-medium mb-4">{`${quantity}kg · ₹${price}`}</p>
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none flex-1">
          Farmer: {farmerName} <br/> <span className="text-emerald-500/40">→</span> Trader: {traderName}
        </p>
        <button className="p-2 bg-zinc-800 rounded-xl hover:bg-emerald-500 hover:text-black transition-all">
          <span className="font-black">→</span>
        </button>
      </div>
    </div>
  );
};

export default TradeCard;