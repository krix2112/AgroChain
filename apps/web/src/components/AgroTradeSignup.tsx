import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AgroTradeSignup() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fcf9f2] text-[#1c1c18] font-['Inter'] antialiased">
      <main className="flex min-h-screen">
        {/* Left Panel: Functional Pane */}
        <section className="w-full lg:w-[55%] bg-[#fcf9f2] p-8 md:p-16 flex flex-col min-h-screen overflow-y-auto">
          {/* Top Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="grid grid-cols-3 gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-[#1a4d2e] rounded-full"></div>
                ))}
              </div>
              <span className="text-2xl font-bold text-[#1a4d2e] tracking-tight font-['Plus_Jakarta_Sans']">AgroTrade</span>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-[#1a4d2e] hover:opacity-70 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Login
            </button>
          </nav>

          {/* Heading & Subtext */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-[#1a4d2e] mb-3 font-['Plus_Jakarta_Sans']">Create your account</h1>
            <p className="text-[#1c1c18]/60 font-medium">Join 50,000+ farmers already trading smarter.</p>
          </header>

          {/* Signup Form */}
          <form className="space-y-8 max-w-xl">
            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-base">person</span>
                Full Name
              </label>
              <input 
                className="w-full px-5 py-4 bg-white border border-[#1a4d2e]/10 rounded-2xl focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none font-medium transition-all" 
                placeholder="Enter your full name" 
                type="text" 
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-base">smartphone</span>
                Mobile Number
              </label>
              <div className="flex gap-4">
                <div className="px-5 py-4 bg-[#f0eee7] rounded-2xl border border-[#1a4d2e]/10 font-bold text-[#1a4d2e]">
                  +91
                </div>
                <input 
                  className="flex-1 px-5 py-4 bg-white border border-[#1a4d2e]/10 rounded-2xl focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none font-medium transition-all" 
                  placeholder="98765 43210" 
                  type="tel" 
                />
              </div>
              <p className="text-[10px] text-[#1a4d2e]/40 font-bold uppercase tracking-wider italic">You will receive a 6-digit OTP for verification.</p>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  Village/District
                </label>
                <input 
                  className="w-full px-5 py-4 bg-white border border-[#1a4d2e]/10 rounded-2xl focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none font-medium transition-all" 
                  placeholder="Enter village name" 
                  type="text" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">map</span>
                  State
                </label>
                <select className="w-full px-5 py-4 bg-white border border-[#1a4d2e]/10 rounded-2xl focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none font-bold appearance-none cursor-pointer">
                  <option>Select State</option>
                  <option>Maharashtra</option>
                  <option>Punjab</option>
                  <option>Karnataka</option>
                  <option>Uttar Pradesh</option>
                </select>
              </div>
            </div>

            {/* Primary Crop Chips */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-base">agriculture</span>
                Primary Crop
              </label>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-2.5 rounded-full border border-[#1a4d2e]/10 hover:border-[#1a4d2e] transition-colors text-sm font-bold" type="button">Wheat</button>
                <button className="px-6 py-2.5 rounded-full bg-[#1a4d2e] text-white text-sm font-bold shadow-lg shadow-[#1a4d2e]/20" type="button">Tomato</button>
                <button className="px-6 py-2.5 rounded-full border border-[#1a4d2e]/10 hover:border-[#1a4d2e] transition-colors text-sm font-bold" type="button">Onion</button>
                <button className="px-6 py-2.5 rounded-full border border-[#1a4d2e]/10 hover:border-[#1a4d2e] transition-colors text-sm font-bold flex items-center gap-1" type="button">
                  More <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-[#1a4d2e] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-[#1a4d2e]/20" 
              type="button"
            >
              <span className="material-symbols-outlined">grass</span>
              Create Account
            </button>
          </form>

          {/* Footer Link */}
          <footer className="mt-16 text-center max-w-xl">
            <p className="text-sm font-medium text-[#1c1c18]/60">
              Already have an account? 
              <button onClick={() => navigate('/login')} className="text-[#1a4d2e] font-black ml-2 hover:underline">Login &rarr;</button>
            </p>
          </footer>
        </section>

        {/* Right Panel */}
        <aside className="hidden lg:flex w-[45%] sticky top-0 h-screen overflow-hidden items-center justify-center bg-[#1a4d2e]">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-60" 
              src="https://images.unsplash.com/photo-1594488650193-4a11c81096e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a4d2e] via-transparent to-[#1a4d2e]/20"></div>
          </div>
          
          <div className="relative z-10 w-4/5 max-w-md p-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[40px] shadow-2xl">
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 text-white">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">Blockchain Verified</p>
                  <p className="text-white/60 text-sm font-medium">Transparency from seed to sale.</p>
                </div>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-white/90">
                  <span className="material-symbols-outlined text-xl text-[#D4A853]">trending_up</span>
                  <span className="text-sm font-bold">Real-time market price tracking</span>
                </div>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="material-symbols-outlined text-xl text-[#D4A853]">contract</span>
                  <span className="text-sm font-bold">Secure smart-contract logistics</span>
                </div>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="material-symbols-outlined text-xl text-[#D4A853]">payments</span>
                  <span className="text-sm font-bold">Instant digital payments on delivery</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
