import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'fpo' | 'trader' | null>(null);
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
      // Store role in localStorage or context
      localStorage.setItem('userRole', selectedRole || '');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F4EF' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
            FPO-Trader Marketplace
          </h1>
          <p className="text-sm" style={{ color: '#666' }}>
            One lot. Best route. Highest price.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#1a1a1a' }}>
              Select Your Role
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('fpo')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'fpo'
                    ? 'border-[#2E7D32] bg-[#2E7D32]/5'
                    : 'border-gray-200 hover:border-[#2E7D32]/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌾</div>
                  <div className="font-semibold" style={{ color: '#1a1a1a' }}>
                    FPO
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#666' }}>
                    Producer Organization
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('trader')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'trader'
                    ? 'border-[#2E7D32] bg-[#2E7D32]/5'
                    : 'border-gray-200 hover:border-[#2E7D32]/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-semibold" style={{ color: '#1a1a1a' }}>
                    Trader
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#666' }}>
                    Verified Buyer
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs" style={{ color: '#999' }}>
                Continue with
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>
              Login with Phone Number
            </h3>

            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: '#666' }}>
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 border border-gray-200 rounded-lg bg-gray-50">
                  <span style={{ color: '#666' }}>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent && (
              <button
                onClick={handleSendOTP}
                disabled={!selectedRole || phoneNumber.length !== 10}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#2E7D32' }}
              >
                Send OTP
              </button>
            )}

            {otpSent && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#666' }}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-sm"
                      style={{ color: '#2E7D32' }}
                    >
                      Change Number
                    </button>
                    <button className="text-sm" style={{ color: '#2E7D32' }}>
                      Resend OTP
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleVerifyLogin}
                  disabled={otp.length !== 6}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#2E7D32' }}
                >
                  Verify & Login
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: '#999' }}>
              New user? Complete KYC after login
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-8 text-xs" style={{ color: '#999' }}>
          <div className="flex items-center gap-1">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Verified Platform</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📞</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
