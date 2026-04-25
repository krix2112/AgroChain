'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export function AgroTradeHomepage() {
  const router = useRouter();

  return (
    <div className="bg-[#fcf9f2] text-[#1c1c18] font-['Inter'] antialiased overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#1c1c18]/5 h-[72px]">
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

          {/* Nav Actions */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-sm font-bold text-[#1a4d2e]">
              <span>EN</span>
              <span className="opacity-20">|</span>
              <span className="opacity-50 font-medium">हिंदी</span>
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="bg-[#1a4d2e] text-white px-8 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-[#1a4d2e]/20"
            >
              login
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-[72px] min-h-screen flex flex-col justify-between">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Sunset Field" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full pt-20 pb-10 flex-grow grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] tracking-widest uppercase">
              <span className="material-symbols-outlined text-sm text-yellow-400">agriculture</span>
              KISAN KA DIGITAL BAZAAR
            </div>
            <h1 className="text-6xl md:text-[84px] font-bold text-white leading-[1.02] font-['Plus_Jakarta_Sans'] tracking-tight">
              India's trusted <br />
              platform for <br />
              <span className="relative inline-block border-b-4 border-white/30 pb-1">farm-to-buyer</span> <br />
              trade.
            </h1>
            <p className="text-xl text-white/80 max-w-lg leading-relaxed font-medium">
              Empowering Indian agriculture with direct market access, secure payments, and premium logistics support.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={() => router.push('/login')}
                className="bg-[#1a4d2e] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#1a4d2e]/90 transition-all shadow-2xl shadow-black/30"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => router.push('/trader/dashboard?tab=mandi-prices')}
                className="bg-[#D4A853]/20 backdrop-blur-md text-white border border-[#D4A853]/30 px-12 py-5 rounded-full font-bold text-lg hover:bg-[#D4A853]/30 transition-all"
              >
                View Live Prices
              </button>
            </div>
          </motion.div>

          {/* Hero Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[48px] shadow-2xl">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <h2 className="text-5xl font-bold text-white font-['Plus_Jakarta_Sans']">50,000+</h2>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Verified Farmers</p>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white/40">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500 mb-6">
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                  </div>
                  <p className="text-white font-bold text-2xl">₹12.4 Cr</p>
                  <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mt-2">Monthly Trade</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500 mb-6">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                  </div>
                  <p className="text-white font-bold text-2xl">100%</p>
                  <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mt-2">Secure Escrow</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Role Selection Cards (Overlaying Hero Bottom) */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full -mb-36">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'For Farmers', desc: 'List your harvest and get discovered by premium buyers nationwide.', icon: 'potted_plant', color: 'bg-yellow-500/20', text: 'text-yellow-500' },
              { title: 'For Traders', desc: 'Sourced premium quality crops with verified quality certificates.', icon: 'storefront', color: 'bg-green-500/20', text: 'text-green-500' },
              { title: 'For Transporters', desc: 'Find logistics leads and optimize your agricultural supply routes.', icon: 'local_shipping', color: 'bg-white/10', text: 'text-white' }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -12 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] cursor-pointer group shadow-2xl"
                onClick={() => router.push('/login')}
              >
                <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center ${card.text} mb-8 shadow-sm`}>
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 font-['Plus_Jakarta_Sans']">{card.title}</h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed mb-12">{card.desc}</p>
                <div className="flex items-center gap-3 font-bold text-white group-hover:gap-5 transition-all text-sm opacity-60">
                  Continue as {card.title.split(' ')[1]} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Simple & Transparent ── */}
      <section className="pt-64 pb-32 bg-[#fcf9f2]">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold text-[#1a4d2e] mb-6 font-['Plus_Jakarta_Sans'] tracking-tight">Simple & Transparent</h2>
          <p className="text-xl text-[#1a4d2e]/60 mb-24 max-w-2xl mx-auto font-medium">
            Trading with AgroTrade takes less than 3 minutes. Secure, fast, and digital.
          </p>

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 max-w-5xl mx-auto">
            {/* Dashed Line */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px border-t border-dashed border-[#1a4d2e]/20"></div>
            
            {[
              { step: 'Register Account', desc: 'Sign up via OTP and complete your KYC in minutes.', icon: 'smartphone' },
              { step: 'List & Negotiate', desc: 'Post your requirement and get competitive bids from verified partners.', icon: 'post_add' },
              { step: 'Instant Settlement', desc: 'Receive payments directly to your bank once delivery is confirmed.', icon: 'payments' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-[#fcf9f2] text-[#1a4d2e] mb-12">
                  <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                </div>
                <h4 className="text-2xl font-bold text-[#1a4d2e] mb-4 font-['Plus_Jakarta_Sans']">{item.step}</h4>
                <p className="text-[#1c1c18]/50 text-sm font-medium leading-relaxed px-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-[#fcf9f2]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-10 items-stretch">
            {/* Feature Card 1 */}
            <div className="bg-white p-12 rounded-[48px] shadow-sm border border-[#1a4d2e]/5 flex flex-col text-left">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-[#1a4d2e] mb-12">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <h4 className="text-3xl font-bold text-[#1a4d2e] mb-5 font-['Plus_Jakarta_Sans']">Secure Escrow</h4>
              <p className="text-[#1c1c18]/50 text-sm font-medium leading-relaxed">
                Protecting every rupee. Funds are held in a secure escrow and released only upon verification.
              </p>
            </div>
            
            {/* Feature Card 2 - Highlighted */}
            <div className="bg-[#1a4d2e] p-12 rounded-[48px] shadow-2xl flex flex-col text-left text-white relative overflow-hidden transform md:-translate-y-10">
              <div className="absolute top-10 right-10 bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-5 py-2 rounded-full border border-yellow-500/20 tracking-[0.2em]">RECOMMENDED</div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-12">
                <span className="material-symbols-outlined text-2xl">analytics</span>
              </div>
              <h4 className="text-3xl font-bold mb-5 font-['Plus_Jakarta_Sans']">Live Market Insights</h4>
              <p className="text-white/60 text-sm font-medium leading-relaxed mb-12">
                Access real-time Mandi prices across 2,000+ locations to make informed trading decisions.
              </p>
              <button 
                onClick={() => router.push('/trader/dashboard?tab=mandi-prices')}
                className="mt-auto w-full py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-sm transition-all tracking-wider"
              >
                View Prices Index
              </button>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-12 rounded-[48px] shadow-sm border border-[#1a4d2e]/5 flex flex-col text-left">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-[#1a4d2e] mb-12">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <h4 className="text-3xl font-bold text-[#1a4d2e] mb-5 font-['Plus_Jakarta_Sans']">Quality Assurance</h4>
              <p className="text-[#1c1c18]/50 text-sm font-medium leading-relaxed">
                Integrated quality testing partners provide digital certificates for every listing on our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Stats Section ── */}
      <section className="relative py-40 mt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1594488650193-4a11c81096e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Tractor" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a4d2e]/92"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-20 text-center text-white">
            <div className="space-y-4">
              <h2 className="text-7xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">₹500 Cr+</h2>
              <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">Total Trade Volume</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-7xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">2,500+</h2>
              <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">Trading Clusters</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-7xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">24/7</h2>
              <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">Expert Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ready Section ── */}
      <section className="py-48 bg-[#fcf9f2]">
        <div className="max-w-[1440px] mx-auto px-8 text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-white rounded-[28px] shadow-2xl flex items-center justify-center mx-auto text-[#1a4d2e] border border-[#1a4d2e]/5"
          >
            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
          </motion.div>
          <div className="space-y-8">
            <h2 className="text-6xl md:text-[88px] font-bold text-[#1a4d2e] leading-[1.05] font-['Plus_Jakarta_Sans'] tracking-tight">
              Ready to grow your income <br /> with AgroTrade?
            </h2>
            <p className="text-xl text-[#1a4d2e]/50 font-medium max-w-2xl mx-auto">
              Join thousands of successful farmers and traders today. Modernizing agriculture, one trade at a time.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <button 
              onClick={() => router.push('/signup')}
              className="bg-[#1a4d2e] text-white px-14 py-6 rounded-[32px] font-bold text-xl hover:scale-105 transition-transform shadow-2xl shadow-[#1a4d2e]/30"
            >
              Register For Free
            </button>
            <button className="bg-white text-[#1a4d2e] border border-[#1a4d2e]/10 px-14 py-6 rounded-[32px] font-bold text-xl hover:bg-white/50 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-[#1a4d2e]/5 py-32">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-20 mb-24">
            <div className="col-span-1 space-y-10">
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-[#1a4d2e] rounded-full"></div>
                  ))}
                </div>
                <span className="text-2xl font-bold text-[#1a4d2e] tracking-tight">AgroTrade</span>
              </div>
              <p className="text-[#1a4d2e]/40 text-sm font-medium leading-relaxed">
                The definitive digital marketplace for modern Indian agriculture. Empowering millions through technology and transparency.
              </p>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-[#1a4d2e]/5 flex items-center justify-center text-[#1a4d2e] hover:bg-[#1a4d2e]/10 cursor-pointer transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-xl">share</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#1a4d2e]/5 flex items-center justify-center text-[#1a4d2e] hover:bg-[#1a4d2e]/10 cursor-pointer transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-xl">public</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-[#1a4d2e] text-[11px] tracking-[0.3em] uppercase mb-12 opacity-40">Platform</h5>
              <ul className="space-y-5 text-[#1a4d2e]/60 font-bold text-sm">
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Logistics Network</a></li>
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Trade Finance</a></li>
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Advisory Board</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-[#1a4d2e] text-[11px] tracking-[0.3em] uppercase mb-12 opacity-40">Company</h5>
              <ul className="space-y-5 text-[#1a4d2e]/60 font-bold text-sm">
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Sustainability Report</a></li>
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#1a4d2e] transition-colors">Newsroom</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-[#1a4d2e] text-[11px] tracking-[0.3em] uppercase mb-12 opacity-40">Contact</h5>
              <ul className="space-y-8 text-[#1a4d2e]/60 font-bold text-sm">
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-xl opacity-40">mail</span>
                  support@agrotrade.com
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-xl opacity-40">call</span>
                  1800-AGRO-TRADE
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-xl opacity-40">location_on</span>
                  New Delhi, India
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-16 border-t border-[#1a4d2e]/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[#1a4d2e]/30 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>© 2024 AgroTrade. Premium Agrarian Excellence. All Rights Reserved.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-[#1a4d2e]">Terms of Trade</a>
              <a href="#" className="hover:text-[#1a4d2e]">Privacy Protocol</a>
              <a href="#" className="hover:text-[#1a4d2e]">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
