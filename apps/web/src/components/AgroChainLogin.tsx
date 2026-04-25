'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@agrochain/api';
import { useAuthStore } from '@agrochain/store';
import { Store, Lock, Phone, Sprout, Shield, Package, TrendingUp, CheckCircle } from 'lucide-react';

export default function AgroChainLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const baseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;
      const loginUrl = `${baseUrl}/auth/login`;
      
      console.log('Attempting login at:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error('Failed to parse response as JSON:', parseErr);
        throw new Error('Server returned an invalid response. The backend might be starting up.');
      }
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('name', data.user.name);
        
        // Also keep store in sync
        useAuthStore.getState().setToken(data.token);
        useAuthStore.getState().setUser(data.user);

        console.log('Login successful, redirecting...');
        if (data.user.role === 'fpo_manager') {
          window.location.href = '/dashboard';
        } else if (data.user.role === 'trader') {
          window.location.href = '/trader/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login connection error:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Cannot connect to server. The backend might be offline or starting up.' 
        : (err.message || 'An unexpected error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-[#F5F7FA]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-xl flex items-center justify-center shadow-md">
              <Sprout size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-gray-900">AgroChain</span>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Sign In</h1>
            <p className="text-gray-600">Enter your phone number to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl">
                  <span className="text-gray-600 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length !== 10 || loading}
              className="w-full py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={20} />
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 flex justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gray-400" /><span>Secure</span></div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-gray-400" /><span>Verified</span></div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>Support</span></div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1595508064774-5ff825520bb0?q=80&w=1170&auto=format&fit=crop)', transform: 'scale(1.05)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/80 to-[#2E7D32]/60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="space-y-8">
              {[
                { icon: Shield, color: 'from-green-400/40 to-emerald-500/40', title: 'Blockchain Verified', desc: 'Secure immutable records' },
                { icon: Package, color: 'from-blue-400/40 to-cyan-500/40', title: 'Smart Aggregation', desc: 'Efficient lot management' },
                { icon: TrendingUp, color: 'from-amber-400/40 to-orange-500/40', title: 'Live Insights', desc: 'Real-time market analytics' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20`}>
                    <f.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{f.title}</div>
                    <div className="text-white/70 text-sm">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
