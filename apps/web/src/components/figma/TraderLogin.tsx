'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, Phone, CheckCircle } from 'lucide-react';

export default function TraderLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userRole', 'trader');
    router.push('/trader/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center px-8 py-12 bg-[#F5F7FA]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-xl flex items-center justify-center shadow-md">
                <Store size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-gray-900">AgroTrade</span>
            </div>
            <p className="text-gray-500 italic text-sm">Modern Trader Portal</p>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              Welcome back, trader.
            </h1>
            <p className="text-gray-600">
              Log in to manage your inventory, bids, and contracts.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/Phone Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@agrotrade.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button type="button" className="text-sm font-medium text-[#2E7D32] hover:text-[#1B5E20] transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Store size={20} />
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              New trader?{' '}
              <button onClick={() => router.push('/trader/register')} className="text-[#2E7D32] font-bold hover:underline transition-colors">
                Register here
              </button>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-gray-400" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-gray-400" />
              <span>Verified Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              © 2026 AgroTrade Protocol. Securely powering global grain logistics.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image with Features */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1548&auto=format&fit=crop)`,
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-[#2E7D32]/10" />

        {/* Features Glass Card - Centered */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="backdrop-blur-xl bg-white/60 border border-emerald-200 rounded-3xl p-10 max-w-sm w-full shadow-2xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-[#2E7D32] to-[#388E3C] rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Join 1,200+ verified traders.</h2>
            </div>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="text-[#2E7D32] font-bold text-sm">01</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Verify Identity</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    KYC integrated blockchain verification for trusted trade.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="text-[#2E7D32] font-bold text-sm">02</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">List Inventory</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Real-time yield estimates synced directly from sensors.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="text-[#2E7D32] font-bold text-sm">03</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Execute Contracts</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Automated escrow and settlements in the field.
                  </p>
                </div>
              </li>
            </ul>

            {/* Verified Network */}
            <div className="mt-8 pt-8 border-t border-white/40 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-emerald-500" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-cyan-500" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-orange-500" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#2E7D32] flex items-center justify-center text-[10px] text-white font-bold">
                  +2k
                </div>
              </div>
              <span className="text-sm font-semibold text-[#2E7D32]">Verified Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
