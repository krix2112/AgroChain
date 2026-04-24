import { useNavigate } from 'react-router';
import { ArrowRight, Package, FileText, Handshake, Shield, TrendingUp, Award, Sparkles, Rocket, Sprout, Warehouse, BarChart3, ShoppingBag, CheckCircle2, Layers, Route } from 'lucide-react';
import heroImage from '../../imports/image-14.png';
import statsImage from '../../imports/image-7.png';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center">
              <Sprout size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-white">AgroTrade</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-white/80 hover:text-white transition-colors text-sm font-medium">EN</button>
            <button className="text-white/80 hover:text-white transition-colors text-sm font-medium">हिंदी</button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: 'scale(1.1)',
            filter: 'blur(3px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20]/70 via-[#2E7D32]/60 to-[#1B5E20]/65" />

        <div className="relative min-h-screen max-w-7xl mx-auto px-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-32">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-block">
                <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-full px-4 py-2 text-white/90 text-sm font-medium">
                  6 years on Digital BAZAAR
                </div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                India's trusted platform for farm-to-buyer trade.
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Empowering Indian agriculture with direct market access, secure payments, and premium logistics support.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white text-[#2E7D32] rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  Get Started Now
                </button>
                <button className="px-8 py-4 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/40 text-white rounded-xl font-bold transition-all transform hover:scale-105">
                  View Live Prices
                </button>
              </div>
            </div>

            {/* Right Stats Card - Compact Grid */}
            <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Large Card - Top Spanning 2 columns */}
                <div className="col-span-2 backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-5xl font-bold text-white mb-1">50,000+</div>
                      <div className="text-sm text-white/70">Farmers Empowered</div>
                    </div>
                    <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                      <Package size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Small Card - Bottom Left */}
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-5 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-1">₹12.4 Cr</div>
                  <div className="text-xs text-white/70">Trade Value</div>
                </div>

                {/* Small Card - Bottom Right */}
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center">
                      <Shield size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-white/70">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600">
              Join as an FPO or Trader and start trading smarter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* FPO Card */}
            <div className="group backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg border border-white/60 p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2E7D32]/30 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#2E7D32]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/5 rounded-2xl flex items-center justify-center border border-[#2E7D32]/20 group-hover:scale-110 group-hover:border-[#2E7D32]/40 transition-all">
                  <Warehouse size={40} className="text-[#2E7D32]" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                For FPOs
              </h3>
              <p className="text-gray-600 mb-6">
                Manage farmers, create lots, sell in bulk, and get best prices for your produce
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Continue as FPO
                <ArrowRight size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Trader Card */}
            <div className="group backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg border border-white/60 p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 group-hover:border-blue-500/40 transition-all">
                  <BarChart3 size={40} className="text-blue-600" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                For Traders
              </h3>
              <p className="text-gray-600 mb-6">
                Discover verified bulk produce and place competitive bids on quality lots
              </p>
              <button
                onClick={() => navigate('/trader/login')}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Continue as Trader
                <ArrowRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent, and efficient trading process
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[#2E7D32] via-blue-500 to-[#388E3C] opacity-20" style={{ width: '80%', left: '10%' }} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-[#2E7D32]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/5 rounded-2xl flex items-center justify-center shadow-lg border border-[#2E7D32]/20 group-hover:scale-110 group-hover:border-[#2E7D32]/40 group-hover:shadow-xl transition-all">
                    <ShoppingBag size={44} className="text-[#2E7D32]" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-[#2E7D32] rounded-full flex items-center justify-center font-bold text-[#2E7D32] shadow-md">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                  Add Procurement
                </h3>
                <p className="text-gray-600">
                  FPO collects produce from farmers and records quality metrics
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl flex items-center justify-center shadow-lg border border-blue-500/20 group-hover:scale-110 group-hover:border-blue-500/40 group-hover:shadow-xl transition-all">
                    <Layers size={44} className="text-blue-600" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-500 shadow-md">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                  Create Lot & Publish
                </h3>
                <p className="text-gray-600">
                  Combine produce into lots and publish to marketplace
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl flex items-center justify-center shadow-lg border border-amber-500/20 group-hover:scale-110 group-hover:border-amber-500/40 group-hover:shadow-xl transition-all">
                    <Handshake size={44} className="text-amber-600" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center font-bold text-amber-500 shadow-md">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                  Get Bids & Close Trade
                </h3>
                <p className="text-gray-600">
                  Receive bids from verified traders and complete the sale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Why Choose AgroTrade
            </h2>
            <p className="text-xl text-gray-600">
              Built for the modern agri-trade ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group backdrop-blur-lg bg-white/90 rounded-2xl shadow-lg border border-white/60 p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-green-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:border-green-500/40 group-hover:scale-110 transition-all">
                  <Shield size={32} className="text-green-600" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
                Secure Escrow
              </h3>
              <p className="text-sm text-gray-600">
                Protecting every rupee. Funds held securely and released only on delivery confirmation
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group backdrop-blur-lg bg-white/90 rounded-2xl shadow-lg border border-white/60 p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 group-hover:scale-110 transition-all">
                  <TrendingUp size={32} className="text-blue-600" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
                Live Mandi Prices
              </h3>
              <p className="text-sm text-gray-600">
                Access real-time Mandi prices across 2,000+ locations to make informed decisions
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group backdrop-blur-lg bg-white/90 rounded-2xl shadow-lg border border-white/60 p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 group-hover:scale-110 transition-all">
                  <CheckCircle2 size={32} className="text-purple-600" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
                Quality Assurance
              </h3>
              <p className="text-sm text-gray-600">
                Integrated quality testing partners provide digital certificates
              </p>
            </div>

            {/* Feature 4 - Highlighted */}
            <div className="group relative backdrop-blur-lg bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/10 rounded-2xl shadow-lg border-2 border-[#2E7D32]/50 p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2E7D32]/40 transition-all duration-300">
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                RECOMMENDED
              </div>
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#2E7D32]/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#2E7D32]/20 to-[#388E3C]/10 rounded-xl flex items-center justify-center border-2 border-[#2E7D32]/40 group-hover:border-[#2E7D32]/60 group-hover:scale-110 transition-all shadow-lg">
                  <Route size={32} className="text-[#2E7D32]" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
                Smart Route Recommendation
              </h3>
              <p className="text-sm text-gray-600">
                AI-powered route suggestions (Direct/eNAM/Mandi) to maximize your profits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${statsImage})`,
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/90 to-[#2E7D32]/80" />

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">₹500Cr+</div>
              <div className="text-sm uppercase tracking-wider text-white/80">Total Trade Volume</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">2,500+</div>
              <div className="text-sm uppercase tracking-wider text-white/80">Trading Clusters</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm uppercase tracking-wider text-white/80">Expert Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-[#2E7D32]/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/5 rounded-2xl flex items-center justify-center border-2 border-[#2E7D32]/30 shadow-xl">
              <Rocket size={40} className="text-[#2E7D32]" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
            Ready to grow your income with AgroTrade?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful farmers and traders today. Modernizing agriculture, one trade at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-2xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Register for Free
              <ArrowRight size={22} />
            </button>
            <button className="px-10 py-4 border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 rounded-2xl font-bold transition-all transform hover:scale-105">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-lg flex items-center justify-center">
              <Sprout size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold">AgroTrade</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering farmers and traders across India
          </p>
          <div className="text-sm text-gray-500">
            © 2026 AgroTrade. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
