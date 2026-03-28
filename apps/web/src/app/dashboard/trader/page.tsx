'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, tradeAPI } from '@agrochain/api';
import Sidebar from '../../../components/Sidebar';

export default function TraderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await authAPI.getMe();
        if (meRes.data.user.role !== 'trader') {
            router.push('/dashboard');
            return;
        }
        setUser(meRes.data.user);
        const tradesRes = await tradeAPI.getMyTrades();
        setTrades(tradesRes.data.filter((t: any) => t.trader._id === meRes.data.user._id || t.trader === meRes.data.user._id));
      } catch (err) {
        console.error(err);
        setUser({ name: 'Trader Vikram', role: 'trader' });
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
            <h1 className="text-4xl font-black mb-2 text-cyan-400">Trader Portal</h1>
            <p className="text-zinc-500 font-medium">Monitoring your acquisitions and requests</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/marketplace')}
              className="px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all text-sm"
            >
              Browse Marketplace
            </button>
            <button
              onClick={() => router.push('/request/create')}
              className="px-8 py-4 border border-cyan-500/30 text-cyan-400 font-black rounded-2xl hover:bg-cyan-500/10 transition-all text-sm"
            >
              + Post a Request
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl hover:border-white/10 transition-all">
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">Active Purchases</p>
                <p className="text-3xl font-black text-emerald-500">{trades.length}</p>
            </div>
            <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl hover:border-white/10 transition-all">
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">Total Spent</p>
                <p className="text-3xl font-black text-white">₹1.2M</p>
            </div>
            <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl hover:border-white/10 transition-all">
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">Trust Score</p>
                <p className="text-3xl font-black text-purple-400">4.9/5</p>
            </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-6 flex justify-between items-center">
            My Active Trades
            <span className="text-xs font-black uppercase text-zinc-500 tracking-widest">{trades.length} active</span>
          </h3>
          {trades.length === 0 ? (
            <div className="p-12 text-center rounded-[40px] bg-zinc-900/20 border border-dashed border-white/10">
                <p className="text-zinc-500 font-medium">Purchased nothing yet. Check out the marketplace!</p>
            </div>
          ) : (
            <div className="rounded-[40px] bg-zinc-900/20 border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-8 py-4 text-xs font-black text-zinc-500 uppercase">Crop</th>
                            <th className="px-8 py-4 text-xs font-black text-zinc-500 uppercase">Origin</th>
                            <th className="px-8 py-4 text-xs font-black text-zinc-500 uppercase">Status</th>
                            <th className="px-8 py-4 text-xs font-black text-zinc-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {trades.map((t: any) => (
                            <tr key={t._id} className="hover:bg-white/[0.02]">
                                <td className="px-8 py-6">
                                    <p className="font-bold">{t.cropName}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">₹{t.price}</p>
                                </td>
                                <td className="px-8 py-6 text-zinc-400 font-medium">{t.fromCity || 'Local'}</td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-black">{t.state}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <button
                                        onClick={() => router.push(`/trade/${t.tradeId || t._id}`)}
                                        className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}