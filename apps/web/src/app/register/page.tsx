// apps/web/src/app/register/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { register, login } from '../../services/api';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = searchParams.get('role');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: queryRole || 'farmer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (queryRole) {
      setFormData(prev => ({ ...prev, role: queryRole }));
    }
  }, [queryRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const regRes = await register(formData);
      // Backend registration response should contain token and user
      // If not, we log them in via phone
      let authData = regRes;
      if (!regRes.token) {
        authData = await login({ phone: formData.phone });
      }

      localStorage.setItem('agrochain_token', authData.token);
      localStorage.setItem('agrochain_user', JSON.stringify(authData.user));

      // Redirect based on role
      const rolePath = authData.user.role || formData.role;
      router.push(`/dashboard/${rolePath}`);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'farmer', label: 'Farmer', color: 'emerald' },
    { id: 'trader', label: 'Trader', color: 'cyan' },
    { id: 'transporter', label: 'Transporter', color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[32px] shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
            <p className="text-zinc-400">Join the digital agricultural revolution</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Select Your Role</label>
              {queryRole ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 py-4 px-5 rounded-2xl flex items-center justify-between">
                  <span className="text-emerald-400 font-bold capitalize">{queryRole}</span>
                  <span className="text-[10px] font-black uppercase text-emerald-500/50 tracking-tighter bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Active Selection</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                        formData.role === r.id 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                          : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'
                      }`}
                    >
                      <span className="font-bold">{r.label}</span>
                      {formData.role === r.id && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 py-4 rounded-2xl text-black font-black text-lg hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <Link href="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
              Already have an account? Sign In
            </Link>
          </div>
        </div>

        <Link href="/" className="block mt-10 text-center text-zinc-500 font-medium hover:text-zinc-300 transition-colors">
          ← Back to safety
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-widest uppercase text-sm">Initializing...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
