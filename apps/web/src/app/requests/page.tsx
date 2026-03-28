'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, requestAPI } from '@agrochain/api';
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

export default function BrowseRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const uRes = await authAPI.getMe();
        setUser(uRes.data.user);
        const rRes = await requestAPI.getOpenRequests();
        setRequests(rRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAccept = async (id: string) => {
    if (!confirm('By accepting, you commit to fulfilling this crop request. A trade agreement will be created.')) return;
    try {
        await requestAPI.acceptRequest(id);
        alert('✅ Request accepted! Check your dashboard for the new trade.');
        router.push('/dashboard/farmer');
    } catch (err: any) {
        alert('Acceptance failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar user={user} activePath="/requests" />
      
      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Trader Requests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-16">
            <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">Trader Requests</h1>
            <p className="text-zinc-500 font-medium text-lg">See what traders are looking for and fulfill their demand directly</p>
        </header>

        {requests.length === 0 ? (
            <div className="p-20 text-center rounded-[60px] bg-zinc-900/20 border border-dashed border-white/10">
                <p className="text-zinc-500 font-medium text-xl mb-6 italic opacity-50 px-24">"No active requests found. High demand seasons usually see requests for Wheat and Rice here."</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
                {requests.map((req) => (
                    <div key={req._id} className="group p-10 rounded-[50px] bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="px-4 py-2 border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 rounded-full text-[10px] font-black uppercase tracking-widest">WANTED</span>
                            </div>
                            
                            <h2 className="text-3xl font-black mb-2 uppercase group-hover:text-emerald-400 transition-colors">{req.cropName}</h2>
                            <p className="text-zinc-400 font-bold text-sm mb-6 flex items-center gap-2">
                                <svg className="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {req.deliveryCity}, {req.deliveryState}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Target Price</p>
                                    <p className="text-xl font-black text-emerald-400">₹{req.preferredPrice}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Quantity</p>
                                    <p className="text-xl font-black text-white">{req.quantity} Qt</p>
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={() => handleAccept(req._id)}
                            className="w-full py-5 bg-emerald-500 text-black font-black rounded-3xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] text-lg"
                        >
                            Accept Request
                        </Button>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
