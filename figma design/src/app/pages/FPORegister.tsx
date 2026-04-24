import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Package, Lock, TrendingUp, X, Sprout } from 'lucide-react';
import heroImage from '../../imports/image-16.png';

export default function FPORegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fpoName: '',
    managerName: '',
    phoneNumber: '',
    state: '',
    district: '',
    numFarmers: '',
  });
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Mustard', 'Chickpea', 'Soybean', 'Maize'];
  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Karnataka'];

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const handleSendOTP = () => {
    if (formData.phoneNumber.length === 10) {
      setOtpSent(true);
    }
  };

  const handleRegister = () => {
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
              Create FPO Account
            </h1>
            <p className="text-gray-600">
              Manage farmers, lots, and trades in one place
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {/* FPO Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                FPO Name
              </label>
              <input
                type="text"
                value={formData.fpoName}
                onChange={(e) => setFormData({ ...formData, fpoName: e.target.value })}
                placeholder="e.g., Green Valley FPO"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>

            {/* Manager Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Manager Name
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="Full name"
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

            {/* State */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                State
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
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Enter district"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>

            {/* Number of Farmers */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Number of Farmers <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                value={formData.numFarmers}
                onChange={(e) => setFormData({ ...formData, numFarmers: e.target.value })}
                placeholder="e.g., 250"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>

            {/* Primary Crops */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Primary Crops
              </label>
              <div className="flex flex-wrap gap-2">
                {crops.map(crop => (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCrops.includes(crop)
                        ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#2E7D32]'
                    }`}
                  >
                    {crop}
                    {selectedCrops.includes(crop) && (
                      <X size={14} className="inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={!formData.fpoName || !formData.managerName || !formData.state || !formData.district || otp.length !== 6}
              className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Create FPO Account
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold hover:underline transition-colors"
              >
                Login here
              </button>
            </p>
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
