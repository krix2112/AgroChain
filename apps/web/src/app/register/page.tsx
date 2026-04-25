'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Sprout, Phone, User, Building2, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'fpo_manager',
    organizationName: '',
    district: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('agrochain_token', data.token);
        localStorage.setItem('agrochain_user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-2xl flex items-center justify-center shadow-lg">
              <Sprout size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join India's trusted farm-to-buyer network</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>}
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
                  placeholder="Rahul Kumar"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
              <div className="relative flex">
                <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 text-sm font-medium">+91</div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
              >
                <option value="fpo_manager">FPO Manager</option>
                <option value="trader">Trader</option>
                <option value="farmer">Farmer</option>
                <option value="transporter">Transporter</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Organization / FPO Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
                  placeholder="Krishi Sangam FPO"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">District</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
                  placeholder="Indore"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
                placeholder="Madhya Pradesh"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : (
              <>
                Create Account <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => router.push('/login')} className="text-[#2E7D32] font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1"><Shield size={12}/> Secure</div>
          <div className="flex items-center gap-1"><CheckCircle size={12}/> Verified</div>
        </div>
      </div>
    </div>
  );
}
