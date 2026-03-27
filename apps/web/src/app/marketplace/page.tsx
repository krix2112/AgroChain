// apps/web/src/app/marketplace/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { getMarketplace, getMe } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import BiddingModal from '../../components/BiddingModal';

export default function MarketplacePage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await getMe();
        setUser(u);
        const data = await getMarketplace();
        setTrades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} activePath="/marketplace" />
      
      <main className="flex-1 lg:ml-72 p-12">
        <h1 className="text-4xl font-black mb-12">Crop Marketplace</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trades.map((trade) => (
            <div key={trade._id} className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{trade.cropName}</h3>
                  <p className="text-zinc-500 text-sm font-medium">{trade.location?.name || 'Local'} • {trade.quantity} Quintals</p>
                </div>
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  {trade.state}
                </span>
              </div>
              
              <div className="space-y-4 mb-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Target Price</span>
                  <span className="font-black text-emerald-400 text-lg">₹{trade.price}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTrade(trade)}
                className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Place a Bid
              </button>
            </div>
          ))}
        </div>

        <BiddingModal 
            isOpen={!!selectedTrade}
            trade={selectedTrade}
            onClose={() => setSelectedTrade(null)}
            onSuccess={() => window.location.reload()}
        />
      </main>
    </div>
  );
}
