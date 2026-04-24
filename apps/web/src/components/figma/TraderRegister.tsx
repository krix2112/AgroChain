'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Lock, Phone, CheckCircle } from 'lucide-react';

export default function TraderRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    traderName: '',
    companyName: '',
    phoneNumber: '',
    state: '',
    district: '',
    gstNumber: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Karnataka'];

  const handleSendOTP = () => {
    if (formData.phoneNumber.length === 10) {
      setOtpSent(true);
    }
  };

  const handleRegister = () => {
    if (otp.length === 6) {
      localStorage.setItem('userRole', 'trader');
      router.push('/trader/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center px-8 py-12 bg-[#F5F7FA]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-xl flex items-center justify-center shadow-md">
              <Store size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-gray-900">AgroTrade</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Create Trader Account
            </h1>
            <p className="text-gray-600">
              Join the largest network of verified farmers and FPOs
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {/* Trader Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Trader Name
              </label>
              <input
                type="text"
                value={formData.traderName}
                onChange={(e) => setFormData({ ...formData, traderName: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Company Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g., Global Agro Traders"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl">
                  <span className="text-gray-600 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                  disabled={otpSent}
                />
              </div>
              {!otpSent && formData.phoneNumber.length === 10 && (
                <button
                  onClick={handleSendOTP}
                  className="mt-2 text-sm text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors"
                >
                  Send OTP
                </button>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                />
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => setOtpSent(false)}
                    className="text-sm text-gray-600 hover:text-[#2E7D32] transition-colors"
                  >
                    Change Number
                  </button>
                  <button className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors">
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {/* GST Number */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                GST Number
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                placeholder="Enter GSTIN"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all uppercase"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Operating State
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              >
                <option value="">Select state...</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Base District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Enter district"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={!formData.traderName || !formData.state || !formData.district || otp.length !== 6 || !formData.gstNumber}
              className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Create Trader Account
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/trader/login')}
                className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold hover:underline transition-colors"
              >
                Login here
              </button>
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
