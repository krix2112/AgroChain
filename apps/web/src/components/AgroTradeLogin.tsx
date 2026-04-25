import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AgroTradeLogin() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fcf9f2] text-[#1c1c18] font-['Inter'] antialiased">
      <main className="flex min-h-screen w-full">
        {/* Left Panel: Functional Portal */}
        <section className="w-full lg:w-[55%] h-full bg-[#fcf9f2] p-12 overflow-y-auto flex flex-col justify-between">
          <div className="max-w-md mx-auto lg:mx-0 w-full space-y-12">
            {/* Branding Header */}
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
            
            {/* Welcome Text */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-[#1a4d2e] leading-tight font-['Plus_Jakarta_Sans']">Welcome back, farmer.</h1>
              <p className="text-[#1c1c18]/60 font-medium">Log in to list your crops, check offers, and track your deliveries.</p>
            </div>
            
            {/* Form Section */}
            <form className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1a4d2e] uppercase tracking-widest" htmlFor="mobile">Mobile Number</label>
                <div className="flex h-14 shadow-sm group">
                  <div className="bg-[#f0eee7] border border-r-0 border-[#1a4d2e]/10 px-5 flex items-center rounded-l-2xl text-[#1a4d2e] font-bold">
                    +91
                  </div>
                  <input 
                    className="flex-1 border border-[#1a4d2e]/10 rounded-r-2xl px-5 focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none font-medium transition-all" 
                    id="mobile" 
                    placeholder="Enter your number" 
                    type="tel" 
                  />
                </div>
                <p className="text-xs text-[#1a4d2e]/40 font-medium italic">We'll send you a 4-digit OTP</p>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-[#1a4d2e] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#1a4d2e]/20" 
                type="button"
              >
                Send OTP
              </button>
              
              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-1 bg-[#1a4d2e]/10"></div>
                <span className="text-[10px] text-[#1a4d2e]/30 font-black uppercase tracking-[0.2em]">OR</span>
                <div className="h-[1px] flex-1 bg-[#1a4d2e]/10"></div>
              </div>
              
              <button 
                onClick={() => navigate('/signup')}
                className="w-full bg-white border border-[#1a4d2e]/10 hover:bg-[#f0eee7] text-[#1a4d2e] h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all" 
                type="button"
              >
                <span className="material-symbols-outlined">person_add</span> Sign Up
              </button>
            </form>
          </div>
          
          {/* Bottom Link */}
          <div className="mt-12 text-center lg:text-left">
            <p className="text-sm font-medium text-[#1c1c18]/60">
              New farmer? <button onClick={() => navigate('/signup')} className="text-[#1a4d2e] font-bold hover:underline decoration-2 underline-offset-4 ml-1">Register here</button>
            </p>
          </div>
        </section>
        
        {/* Right Panel: Immersive Visuals */}
        <section className="hidden lg:flex w-[45%] min-h-screen relative overflow-hidden bg-[#1a4d2e]">
          <img 
            alt="Golden wheat field at sunset" 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a4d2e] via-[#1a4d2e]/40 to-transparent"></div>
          
          {/* Centered Glass Card */}
          <div className="relative z-10 m-auto px-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[32px] p-12 max-w-sm shadow-2xl"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D4A853] rounded-2xl flex items-center justify-center text-[#3e2a00]">
                    <span className="material-symbols-outlined font-bold">rocket_launch</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Start selling in 3 minutes</h2>
                </div>
                <ul className="space-y-6 text-white/80 font-medium">
                  <li className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black border border-white/20">1</span>
                    <span>Enter your mobile number</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black border border-white/20">2</span>
                    <span>Verify with secure OTP</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black border border-white/20">3</span>
                    <span>List your crop and get offers</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
