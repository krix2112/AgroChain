// apps/web/src/app/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/hero-bg.png"
          alt="AgroChain Hero Background"
          fill
          style={{ objectFit: 'cover' }}
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343l.707-.707" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-emerald-400">AgroChain</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-zinc-400 font-medium">
          <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it works</Link>
          <Link href="#security" className="hover:text-emerald-400 transition-colors">Security</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-6 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
            Login
          </Link>
          <Link href="/login" className="px-6 py-2.5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl">
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-6 animate-pulse">
            Next-Gen Agricultural Supply Chain
          </h2>
          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-8">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Fair Trade
            </span>
          </h1>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
            Eliminating middlemen and ensuring instant payments. Secure your harvest on the blockchain with real-time tracking and automated trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="px-10 py-5 bg-emerald-500 text-black text-lg font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Register as Farmer
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="px-10 py-5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-lg font-bold rounded-2xl hover:bg-zinc-800 transition-colors">
              I'm a Trader
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Trades', val: '1.2K+' },
            { label: 'Active Farmers', val: '450+' },
            { label: 'On-chain Value', val: '$2.4M' },
            { label: 'Avg. Delivery', val: '18 Hrs' }
          ].map((stat, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl hover:border-emerald-500/30 transition-all group">
              <span className="block text-4xl font-black mb-1 text-white group-hover:text-emerald-400 transition-colors">{stat.val}</span>
              <span className="text-zinc-500 text-sm font-medium tracking-wider uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
}
