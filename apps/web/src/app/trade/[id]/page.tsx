'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, tradeAPI, bundleAPI } from '@agrochain/api';
import { StatusBadge, Timeline, TradeCard } from '@agrochain/ui';
import Sidebar from '../../../components/Sidebar';

export default function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [trade, setTrade] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bundleSuggestion, setBundleSuggestion] = useState<any>(null);
  const [showBundlePopup, setShowBundlePopup] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const uRes = await authAPI.getMe();
        setUser(uRes.data.user);
        
        const tRes = await tradeAPI.getTrade(id);
        setTrade(tRes.data);

        // Check for bundling if trade is AGREED and not yet bundled
        if (tRes.data.state === 'AGREED' && !tRes.data.bundleId) {
            const bRes = await bundleAPI.checkBundle(id);
            if (bRes.data.suggestion) {
                setBundleSuggestion(bRes.data.suggestion);
                setShowBundlePopup(true);
            }
        }
      } catch (err) {
        console.error('Failed to load trade:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleBundleConfirm = async () => {
    try {
        await bundleAPI.confirmBundle({
            tradeIds: [id, ...bundleSuggestion.matchingTradeIds],
            fromCity: trade.fromCity,
            toCity: trade.toCity,
            deliveryDate: trade.deliveryDate
        });
        alert('✅ Successfully bundled! Delivery costs reduced.');
        setShowBundlePopup(false);
        window.location.reload();
    } catch (err) {
        alert('Bundling failed');
    }
  };

  if (loading) return <div className="min-h-screen bg-black" />;
  if (!trade) return <div className="min-h-screen bg-black text-white p-12">Trade not found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar user={user} activePath="/dashboard" />
      
      <main className="flex-1 lg:ml-72 p-8 lg:p-12 relative">
        <header className="mb-12">
            <button 
                onClick={() => router.back()}
                className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-6"
            >
                ← Back to Dashboard
            </button>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Trade #{trade.tradeId || id}</h1>
                    <p className="text-zinc-500 font-medium">On-chain transaction tracking</p>
                </div>
                <StatusBadge state={trade.state} />
            </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-12">
                <TradeCard trade={trade} highlight />
                
                <section className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5">
                    <h3 className="text-xl font-bold mb-8">Transaction Timeline</h3>
                    <Timeline state={trade.state} />
                </section>
            </div>

            <aside className="space-y-6">
                <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">Financial Summary</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-zinc-500 text-sm">Escrow Status</span>
                            <span className="text-white text-sm font-bold">LOCKED</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500 text-sm">Platform Fee</span>
                            <span className="text-white text-sm font-bold">₹{(trade.price * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-white/5 pt-4 flex justify-between">
                            <span className="text-zinc-500 font-bold uppercase text-xs">Total payout</span>
                            <span className="text-emerald-400 font-black text-xl">₹{trade.price}</span>
                        </div>
                    </div>
                </div>

                {trade.txHash && (
                    <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">On-Chain Proof</h4>
                        <p className="text-[10px] break-all font-mono text-cyan-400 mb-4">{trade.txHash}</p>
                        <a 
                            href={`https://explorer-mezame.shardeum.org/tx/${trade.txHash}`}
                            target="_blank"
                            className="text-xs font-black text-white hover:underline"
                        >
                            View on Explorer ↗
                        </a>
                    </div>
                )}
            </aside>
        </div>

        {/* Bundling Suggestion Popup */}
        {showBundlePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                <div className="max-w-md w-full p-10 rounded-[48px] bg-zinc-900 border border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8">
                        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black mb-4">Smart Route Found!</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                        We found a similar delivery! Save <span className="text-emerald-400 font-bold">₹{bundleSuggestion.savings || '500'}</span> by bundling 
                        with Trade <span className="text-white font-bold">#{bundleSuggestion.matchingTradeIds?.[0] || '2042'}</span>.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleBundleConfirm}
                            className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl hover:scale-105 transition-all"
                        >
                            Bundle & Save
                        </button>
                        <button 
                            onClick={() => setShowBundlePopup(false)}
                            className="w-full py-4 text-zinc-500 font-black rounded-2xl hover:bg-white/5 transition-all text-sm"
                        >
                            No, deliver separately
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
