// apps/web/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, getMyTrades } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import CreateTradeModal from '../../components/CreateTradeModal';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        const tradesData = await getMyTrades();
        setTrades(tradesData);
      } catch (err) {
        console.error(err);
        // router.push('/login'); // Commented for demo safety
        // Mock data for demo if backend is offline
        setUser({ name: 'Farmer Ramesh', role: 'farmer', walletAddress: '0x742d...44e' });
        setTrades([
          { tradeId: 1001, cropName: 'Basmati Rice', quantity: 50, price: 4500, state: 'AGREED', farmer: { name: 'Ramesh' } },
          { tradeId: 1002, cropName: 'Wheat', quantity: 100, price: 2100, state: 'IN_DELIVERY', farmer: { name: 'Ramesh' } }
        ]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar user={user} activePath="/dashboard" />
      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black mb-2">My Dashboard</h1>
              <p className="text-zinc-500 font-medium">Monitoring your on-chain agricultural assets</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
            >
              Create New Trade
            </button>
          </header>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Active Pipeline', val: '2 Trades', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-emerald-500' },
              { label: 'Wallet Balance', val: '1.42 ETH', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16V15m0 1v1', color: 'text-cyan-400' },
              { label: 'Agro Score', val: '98/100', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-purple-400' }
            ].map((stat, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl hover:border-white/10 transition-all">
                <svg className={`w-10 h-10 ${stat.color} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black">{stat.val}</p>
              </div>
            ))}
          </section>

          {/* Trade Table */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Recent Transactions
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-black uppercase">Live</span>
            </h3>
            <div className="rounded-[40px] bg-zinc-900/20 border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase">Crop Name</th>
                    <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase">Quantity</th>
                    <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase">Total Price</th>
                    <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase">Status</th>
                    <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trades.map((trade, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-8 font-bold text-lg">{trade.cropName}</td>
                      <td className="px-8 py-8 text-zinc-400">{trade.quantity} Quintals</td>
                      <td className="px-8 py-8 font-black text-emerald-400">₹{trade.price}</td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-2 rounded-full text-xs font-black border ${
                          trade.state === 'AGREED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          trade.state === 'IN_DELIVERY' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {trade.state}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex gap-2">
                          {/* Farmer Actions */}
                          {user?.role === 'farmer' && trade.state === 'CREATED' && (
                            <span className="text-xs text-zinc-500 italic">Waiting for Trader</span>
                          )}
                          
                          {/* Trader Actions */}
                          {user?.role === 'trader' && trade.state === 'CREATED' && (
                            <button 
                              onClick={async () => {
                                try {
                                  await (await import('../../services/api')).agreeTrade(trade.tradeId);
                                  alert('✅ Trade Agreed!'); window.location.reload();
                                } catch (err) { alert('Action failed'); }
                              }}
                              className="px-4 py-2 bg-emerald-500 text-black font-black rounded-lg text-xs hover:scale-105 transition-all"
                            >
                              Agree
                            </button>
                          )}

                          {/* Transporter Actions */}
                          {user?.role === 'transporter' && trade.state === 'AGREED' && (
                            <button 
                              onClick={async () => {
                                try {
                                  await (await import('../../services/api')).markPickedUp(trade.tradeId);
                                  alert('✅ Picked Up!'); window.location.reload();
                                } catch (err) { alert('Action failed'); }
                              }}
                              className="px-4 py-2 bg-cyan-500 text-black font-black rounded-lg text-xs hover:scale-105 transition-all"
                            >
                              Mark Picked Up
                            </button>
                          )}

                          {user?.role === 'transporter' && trade.state === 'IN_DELIVERY' && (
                            <button 
                              onClick={async () => {
                                try {
                                  await (await import('../../services/api')).markDelivered(trade.tradeId);
                                  alert('✅ Delivered!'); window.location.reload();
                                } catch (err) { alert('Action failed'); }
                              }}
                              className="px-4 py-2 bg-purple-500 text-white font-black rounded-lg text-xs hover:scale-105 transition-all"
                            >
                              Confirm Delivery
                            </button>
                          )}

                          {/* Completion Action */}
                          {(user?.role === 'farmer' || user?.role === 'trader') && trade.state === 'DELIVERED' && (
                            <button 
                              onClick={async () => {
                                try {
                                  await (await import('../../services/api')).completeTrade(trade.tradeId);
                                  alert('✅ Trade Completed & Settled!'); window.location.reload();
                                } catch (err) { alert('Action failed'); }
                              }}
                              className="px-4 py-2 bg-emerald-500 text-black font-black rounded-lg text-xs hover:scale-105 transition-all"
                            >
                              Finalize & Pay
                            </button>
                          )}

                          <button className="px-3 py-2 border border-white/10 text-white font-bold rounded-lg text-[10px] hover:bg-white/5 transition-all">
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <CreateTradeModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => window.location.reload()} 
          />
        </main>
    </div>
  );
}
