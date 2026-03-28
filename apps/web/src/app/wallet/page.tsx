"use client";

import React, { useEffect, useState } from 'react';
import { authAPI } from '@agrochain/api';
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

export default function WalletPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getMe()
      .then(res => setUser(res.data.user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} activePath="/wallet" />
      
      <main className="flex-1 lg:ml-72 p-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AgroVault</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="max-w-2xl w-full p-16 rounded-[60px] bg-gradient-to-br from-zinc-900 via-black to-black border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[80px] -ml-24 -mb-24"></div>
            
            <div className="relative">
              <header className="mb-12">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-black tracking-tight mb-2">AgroVault</h2>
                <p className="text-zinc-500 font-medium">Securely managing your on-chain identities and assets</p>
              </header>

              <div className="space-y-10">
                <section>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Public Wallet Address</p>
                  <div className="group relative">
                    <p className="font-mono text-emerald-400 break-all bg-emerald-500/[0.03] p-6 rounded-3xl border border-emerald-500/10 group-hover:border-emerald-500/30 transition-all cursor-pointer">
                      {user?.walletAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'}
                    </p>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">COPY</span>
                    </div>
                  </div>
                </section>

                <section className="p-8 rounded-[40px] bg-amber-500/[0.02] border border-amber-500/10">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Warning</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-500 mb-1">Encrypted Security</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        Your keys are protected by AES-256 industrial encryption. AgroChain never stores raw private keys. They are only decrypted for signing trade agreements.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <Button className="py-6 bg-white text-black font-black hover:bg-emerald-400">
                    Refresh Balance
                  </Button>
                  <Button variant="outline" className="py-6 bg-white/5 text-white font-black border border-white/5 hover:bg-white/10">
                    Export Keys
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
