import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AgroTradeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f0f4f0] text-[#1c1c18] font-['Inter'] antialiased min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <header className="bg-[#1a4d2e] text-white h-16 flex items-center px-8 sticky top-0 z-50 shadow-lg shadow-black/10">
        <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
              ))}
            </div>
            <span className="text-lg font-bold tracking-tight">AgroTrade</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest opacity-80">
            <a href="#" className="opacity-100 border-b-2 border-white pb-1 transition-all">Dashboard</a>
            <a href="#" className="hover:opacity-100 transition-all">Marketplace</a>
            <a href="#" className="hover:opacity-100 transition-all">Contracts</a>
          </nav>

          {/* Profile Area */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-white/40">
              <span className="material-symbols-outlined text-xl cursor-pointer hover:text-white">notifications</span>
              <span className="material-symbols-outlined text-xl cursor-pointer hover:text-white">settings</span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <p className="text-sm font-bold hidden sm:block">Ramesh Kumar</p>
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 overflow-hidden shadow-inner">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Profile" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        {/* ── Hero Banner ── */}
        <section className="relative h-[300px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Grass background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          
          <div className="relative z-10 max-w-[1440px] mx-auto px-10 h-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                  <span className="material-symbols-outlined text-sm text-green-400">verified</span> Verified Farmer
                </div>
                <h1 className="text-5xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">Ramesh Kumar</h1>
                <p className="text-white/70 font-medium text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span> Mathura, UP · Wheat · Tomato · Onion
                </p>
              </div>

              <div className="flex gap-4">
                {[
                  { label: 'LISTINGS', val: '12' },
                  { label: 'TOTAL EARNED', val: '₹1.2L' },
                  { label: 'RATING', val: '4.8', sub: 'star' }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/20 backdrop-blur-xl border border-white/10 p-6 rounded-[28px] min-w-[150px] shadow-2xl">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">{stat.val}</p>
                      {stat.sub && <span className="material-symbols-outlined text-yellow-500 text-xl fill-current">{stat.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Dashboard Grid ── */}
        <div className="max-w-[1440px] mx-auto px-10 -mt-16 relative z-20 space-y-12">
          
          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div whileHover={{ y: -8 }} className="bg-[#1a4d2e] p-10 rounded-[32px] shadow-2xl text-white space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">agriculture</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">Sell Crop</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed">List your fresh harvest on the global marketplace instantly.</p>
              </div>
              <button className="bg-white text-[#1a4d2e] px-8 py-3 rounded-full font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2">
                Start Listing <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div whileHover={{ y: -8 }} className="bg-white p-10 rounded-[32px] shadow-xl border border-black/5 space-y-6">
              <div className="w-12 h-12 bg-[#D4A853]/10 rounded-2xl flex items-center justify-center text-[#D4A853]">
                <span className="material-symbols-outlined text-2xl">sell</span>
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-2xl font-bold text-[#1a4d2e] font-['Plus_Jakarta_Sans']">View mandi prices</h3>
                <p className="text-[#1a4d2e]/40 text-sm font-medium leading-relaxed">View mandi prices, compare and list</p>
              </div>
              <button 
                onClick={() => navigate('/mandi-prices')}
                className="bg-white border border-[#1a4d2e]/10 text-[#1a4d2e] px-8 py-3 rounded-full font-bold text-sm hover:bg-[#fcf9f2] transition-all flex items-center gap-2"
              >
                View prices <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div whileHover={{ y: -8 }} className="bg-white p-10 rounded-[32px] shadow-xl border border-black/5 space-y-6">
              <div className="w-12 h-12 bg-[#1a4d2e]/5 rounded-2xl flex items-center justify-center text-[#1a4d2e]">
                <span className="material-symbols-outlined text-2xl">inventory_2</span>
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-2xl font-bold text-[#1a4d2e] font-['Plus_Jakarta_Sans']">My listed crops</h3>
                <p className="text-[#1a4d2e]/40 text-sm font-medium leading-relaxed">Track logistics and payment for your active contracts.</p>
              </div>
              <button className="bg-white border border-[#1a4d2e]/10 text-[#1a4d2e] px-8 py-3 rounded-full font-bold text-sm hover:bg-[#fcf9f2] transition-all flex items-center gap-2">
                Track Status <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </motion.div>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'TOTAL TRADES', val: '24', icon: 'analytics', color: 'bg-green-100 text-green-600' },
              { label: 'ACTIVE DEALS', val: '6', icon: 'trending_up', color: 'bg-orange-100 text-orange-600' },
              { label: 'COMPLETED', val: '18', icon: 'check_circle', color: 'bg-blue-100 text-blue-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] border border-black/5 flex justify-between items-center shadow-sm">
                <div className="text-left">
                  <p className="text-[10px] font-black text-[#1a4d2e]/40 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1a4d2e] font-['Plus_Jakarta_Sans']">{stat.val}</p>
                </div>
                <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Trades Table */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a4d2e] font-['Plus_Jakarta_Sans']">My Recent Trades</h2>
              <button className="text-[#1a4d2e]/60 font-bold text-sm hover:text-[#1a4d2e] flex items-center gap-1">See All Activity <span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>

            <div className="space-y-4">
              {[
                { crop: 'Organic Tomatoes', qty: '500 Kg', val: '₹22,500', status: 'In Delivery', sColor: 'bg-green-100 text-green-700', img: 'https://images.unsplash.com/photo-1518977676601-b53f02bad177?auto=format&fit=crop&w=100&q=80' },
                { crop: 'Premium Wheat', qty: '2,000 Kg', val: '₹48,000', status: 'Completed', sColor: 'bg-gray-100 text-gray-700', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75ec89?auto=format&fit=crop&w=100&q=80' },
                { crop: 'Red Onions', qty: '800 Kg', val: '₹16,000', status: 'Agreed', sColor: 'bg-orange-100 text-orange-700', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=100&q=80' }
              ].map((trade, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] border border-black/5 flex items-center gap-10 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                    <img src={trade.img} alt={trade.crop} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-8">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-[#1a4d2e]/30 uppercase tracking-widest mb-1">Crop Type</p>
                      <p className="font-bold text-[#1a4d2e]">{trade.crop}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-[#1a4d2e]/30 uppercase tracking-widest mb-1">Quantity</p>
                      <p className="font-bold text-[#1a4d2e]">{trade.qty}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-[#1a4d2e]/30 uppercase tracking-widest mb-1">Deal Value</p>
                      <p className="font-bold text-[#1a4d2e]">{trade.val}</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`${trade.sColor} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                        {trade.status}
                      </div>
                    </div>
                  </div>
                  <button className="text-[#1a4d2e] font-bold text-sm hover:underline decoration-2 underline-offset-4">View Details</button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="bg-[#1a4d2e] rounded-[32px] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 text-left space-y-2">
              <h3 className="text-3xl font-bold font-['Plus_Jakarta_Sans']">List your harvest in minutes</h3>
              <p className="text-white/60 text-sm font-medium">Connect directly with verified buyers and skip the middlemen.</p>
            </div>
            <button className="relative z-10 bg-white text-[#1a4d2e] px-10 py-4 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               Start Listing
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
