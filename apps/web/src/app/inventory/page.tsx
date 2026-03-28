"use client";

import React, { useEffect, useState } from 'react';
import { authAPI, tradeAPI } from '@agrochain/api';
import Sidebar from '../../components/Sidebar';
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function InventoryPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const uRes = await authAPI.getMe();
        setUser(uRes.data.user);
        const tradesRes = await tradeAPI.getMyTrades();
        const data = tradesRes.data;
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
      <Sidebar user={user} activePath="/inventory" />
      
      <main className="flex-1 lg:ml-72 p-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Inventory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">My Inventory</h1>
            <p className="text-zinc-500 font-medium">Managing your agricultural listings and trade states</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/listing/create'}
            className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-emerald-400"
          >
            + New Listing
          </Button>
        </header>

        <div className="rounded-[40px] bg-zinc-900/20 border border-white/5 overflow-hidden backdrop-blur-3xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Crop Asset</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Volume (Qtl)</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Value</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trades.map((trade) => (
                <tr key={trade._id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => window.location.href = `/trade/${trade._id}`}>
                  <td className="px-8 py-8">
                    <p className="font-bold text-lg group-hover:text-emerald-400 transition-colors uppercase">{trade.cropName}</p>
                    <p className="text-xs text-zinc-600 font-mono">ID: {trade.tradeId}</p>
                  </td>
                  <td className="px-8 py-8 text-zinc-400 font-medium">{trade.quantity}</td>
                  <td className="px-8 py-8 font-black text-emerald-400">₹{trade.price}</td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-2 bg-zinc-900/50 rounded-full text-[10px] font-black uppercase text-zinc-400 border border-white/5 group-hover:border-emerald-500/30 transition-all">
                      {trade.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trades.length === 0 && (
            <div className="p-20 text-center text-zinc-600 font-bold italic">
              No crops found in your inventory.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
