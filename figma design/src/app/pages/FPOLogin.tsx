import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Package, Lock, TrendingUp, Sprout, Phone, CheckCircle } from 'lucide-react';
import heroImage from '../../imports/image-15.png';

export default function FPOLogin() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyLogin = () => {
    if (otp.length === 6) {
      localStorage.setItem('userRole', 'fpo');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-[#F5F7FA]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-xl flex items-center justify-center shadow-md">
              <Sprout size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-gray-900">AgroTrade</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
              Welcome back, FPO Manager
            </h1>
            <p className="text-gray-600">
              Manage farmers, lots, and trades in one place
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                  disabled={otpSent}
                />
              </div>
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                onClick={handleSendOTP}
                disabled={phoneNumber.length !== 10}
                className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Send OTP
              </button>
            )}

            {/* OTP Input */}
            {otpSent && (
              <div className="space-y-4">
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

                <button
                  onClick={handleVerifyLogin}
                  disabled={otp.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Login to Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold hover:underline transition-colors"
              >
                Create FPO Account
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
        </div>
      </div>

      {/* Right Side - Image with Features */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/80 to-[#2E7D32]/60" />

        {/* Features Glass Card - Centered */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm w-full">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400/40 to-emerald-500/40 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield size={28} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-lg mb-1">Blockchain Verified</div>
                  <div className="text-white/80 text-sm">Every trade recorded securely</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400/40 to-cyan-500/40 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Package size={28} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-lg mb-1">Bulk Trade Management</div>
                  <div className="text-white/80 text-sm">Manage lots efficiently</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400/40 to-orange-500/40 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Lock size={28} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-lg mb-1">Secure Escrow Payments</div>
                  <div className="text-white/80 text-sm">100% payment protection</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400/40 to-pink-500/40 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <TrendingUp size={28} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-lg mb-1">Real-time Mandi Insights</div>
                  <div className="text-white/80 text-sm">Live price updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
