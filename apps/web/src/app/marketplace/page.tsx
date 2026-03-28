"use client";

import React, { useEffect, useState } from 'react';
import { authAPI, listingAPI } from '@agrochain/api';
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

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const uRes = await authAPI.getMe();
        setUser(uRes.data.user);
        const lRes = await listingAPI.getListings();
        setListings(lRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleBuy = async (id: string) => {
    if (!confirm('Are you sure you want to buy this crop? This will create a blockchain-tracked trade.')) return;
    try {
      await listingAPI.buyListing(id);
      alert('✅ Purchase successful! Trade created.');
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert('Purchase failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} activePath="/marketplace" />
      
      <main className="flex-1 lg:ml-72 p-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Marketplace</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-4xl font-black mb-12">Crop Marketplace</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div key={item._id} className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.cropName}</h3>
                  <p className="text-zinc-500 text-sm font-medium">{item.location?.city || 'Local'}, {item.location?.state || ''} • {item.quantity} Quintals</p>
                </div>
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  {item.state}
                </span>
              </div>
              
              <div className="space-y-4 mb-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Price per Quintal</span>
                  <span className="font-black text-emerald-400 text-lg">₹{item.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                  <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Total</span>
                  <span className="font-black text-white text-lg">₹{item.price * item.quantity}</span>
                </div>
              </div>

              <Button 
                onClick={() => handleBuy(item._id)}
                disabled={item.state !== 'OPEN'}
                className={`w-full py-6 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] ${
                  item.state === 'OPEN' 
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {item.state === 'OPEN' ? 'Buy Now' : 'Sold'}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
