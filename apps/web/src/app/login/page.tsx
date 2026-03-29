// apps/web/src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, register } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'farmer',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let authResponse;
      if (isRegister) {
        await register(formData);
        authResponse = await login({ phone: formData.phone });
      } else {
        authResponse = await login({ phone: formData.phone });
      }

      if (authResponse && authResponse.token && authResponse.user) {
        localStorage.setItem('agrochain_token', authResponse.token);
        localStorage.setItem('agrochain_user', JSON.stringify(authResponse.user));
        
        const role = authResponse.user.role?.toLowerCase();
        router.push(`/dashboard/${role}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[32px] shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-zinc-400">
              {isRegister ? 'Join the AgroChain revolution' : 'Sign in using your mobile number'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Role</label>
                  <select
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="farmer">Farmer</option>
                    <option value="trader">Trader</option>
                    <option value="transporter">Transporter</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 py-4 rounded-2xl text-black font-black text-lg hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                isRegister ? 'Sign Up' : 'Continue'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <Link href="/" className="block mt-10 text-center text-zinc-500 font-medium hover:text-zinc-300 transition-colors">
          ← Back to safety
        </Link>
      </div>
    </div>
  );
}
