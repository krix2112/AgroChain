'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Package, Lock, TrendingUp, Sprout, Phone, CheckCircle } from 'lucide-react';

export default function FPOLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);
      setError('');
      try {
        let baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
        // Remove trailing slash if present
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
        // Ensure /api is at the end
        const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
        
        const res = await fetch(`${apiUrl}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber }),
        });
        const data = await res.json();
        if (res.ok) {
          setOtpSent(true);
          // For dev convenience, show dummy code if returned
          if (data.dummyCode) {
            console.log("DEV: OTP is", data.dummyCode);
            setOtp(data.dummyCode); // Automatically fill the OTP for the user
          }
        } else {
          setError(data.error || 'Failed to send OTP');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyLogin = async () => {
    if (otp.length === 6) {
      setLoading(true);
      setError('');
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
        
        const res = await fetch(`${apiUrl}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber, otp }),
        });
        const data = await res.json();
        
        if (res.ok && data.token) {
          localStorage.setItem('agrochain_token', data.token);
          localStorage.setItem('agrochain_user', JSON.stringify(data.user));
          localStorage.setItem('userRole', data.user.role || 'fpo');
          router.push('/dashboard');
        } else {
          setError(data.error || 'Invalid OTP');
        }
      } catch (err) {
        setError('Verification failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
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
            <span className="text-2xl font-bold text-gray-900">AgroTrade</span>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Welcome back, FPO Manager</h1>
            <p className="text-gray-600">Manage farmers, lots, and trades in one place</p>
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Mobile Number</label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl">
                  <span className="text-gray-600 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                  disabled={otpSent}
                />
              </div>
            </div>
            {!otpSent && (
              <button
                onClick={handleSendOTP}
                disabled={phoneNumber.length !== 10 || loading}
                className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
            {otpSent && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button onClick={() => setOtpSent(false)} className="text-sm text-gray-600 hover:text-[#2E7D32] transition-colors">Change Number</button>
                    <button className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors">Resend OTP</button>
                  </div>
                </div>
                <button
                  onClick={handleVerifyLogin}
                  disabled={otp.length !== 6 || loading}
                  className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Verifying...' : 'Login to Dashboard'}
                </button>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => router.push('/register')} className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold hover:underline transition-colors">Create FPO Account</button>
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-2"><Lock size={14} className="text-gray-400" /><span>Secure</span></div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-gray-400" /><span>Verified Platform</span></div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>24/7 Support</span></div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1595508064774-5ff825520bb0?q=80&w=1170&auto=format&fit=crop)', transform: 'scale(1.05)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/80 to-[#2E7D32]/60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm w-full">
            <div className="space-y-6">
              {[
                { icon: Shield, color: 'from-green-400/40 to-emerald-500/40', title: 'Blockchain Verified', desc: 'Every trade recorded securely' },
                { icon: Package, color: 'from-blue-400/40 to-cyan-500/40', title: 'Bulk Trade Management', desc: 'Manage lots efficiently' },
                { icon: Lock, color: 'from-amber-400/40 to-orange-500/40', title: 'Secure Escrow Payments', desc: '100% payment protection' },
                { icon: TrendingUp, color: 'from-purple-400/40 to-pink-500/40', title: 'Real-time Mandi Insights', desc: 'Live price updates' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <f.icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-lg mb-1">{f.title}</div>
                    <div className="text-white/80 text-sm">{f.desc}</div>
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
