'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export function AgroTradeMandiPrices() {
  const router = useRouter();

  return (
    <div className="bg-[#fcf9f2] text-[#1c1c18] font-['Inter'] antialiased min-h-screen">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#1c1c18]/5 h-[72px]">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-[#1a4d2e] rounded-full"></div>
              ))}
            </div>
            <span className="text-2xl font-bold text-[#1a4d2e] tracking-tight font-['Plus_Jakarta_Sans']">AgroTrade</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-[#1a4d2e] font-bold text-sm hover:opacity-70 transition-opacity"
            >
              Dashboard
            </button>
            <div className="w-10 h-10 rounded-full bg-[#1a4d2e]/10 flex items-center justify-center text-[#1a4d2e]">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8 max-w-[1440px] mx-auto">
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-[#1a4d2e] mb-4 font-['Plus_Jakarta_Sans']"
          >
            Live Mandi Prices
          </motion.h1>
          <p className="text-[#1c1c18]/60 font-medium text-lg">Real-time market rates from 2,000+ verified Mandis across India.</p>
        </header>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 custom-scrollbar">
          {['All Crops', 'Wheat', 'Tomato', 'Onion', 'Potato', 'Rice', 'Garlic', 'Maize'].map((crop, idx) => (
            <button 
              key={idx}
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                idx === 0 ? 'bg-[#1a4d2e] text-white shadow-lg shadow-[#1a4d2e]/20' : 'bg-white border border-[#1a4d2e]/10 text-[#1a4d2e] hover:bg-[#fcf9f2]'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { name: 'Tomato', price: '₹48/kg', trend: '+12%', icon: 'trending_up', img: 'https://images.unsplash.com/photo-1518977676601-b53f02bad177?auto=format&fit=crop&w=800&q=80', status: 'HIGH TREND' },
            { name: 'Wheat', price: '₹24/kg', trend: 'STABLE', icon: 'trending_flat', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75ec89?auto=format&fit=crop&w=800&q=80', status: 'STABLE' },
            { name: 'Red Onion', price: '₹31/kg', trend: '-5%', icon: 'trending_down', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80', status: 'DOWN' }
          ].map((crop, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-[#1a4d2e]/5 group"
            >
              <div className="h-48 relative">
                <img src={crop.img} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#1a4d2e] tracking-widest border border-white/50">
                  {crop.status}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1a4d2e]">{crop.name}</h3>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#1a4d2e]">{crop.price}</p>
                    <p className={`text-xs font-bold ${crop.icon === 'trending_down' ? 'text-red-500' : 'text-green-600'}`}>{crop.trend}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-end h-12">
                  {[40, 60, 45, 80, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#1a4d2e]/10 rounded-t-lg relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-[#1a4d2e]" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full py-4 bg-[#1a4d2e] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#1a4d2e]/10"
                >
                  Sell at this Price
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
