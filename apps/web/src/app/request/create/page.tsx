'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, requestAPI } from '@agrochain/api';
import Sidebar from '../../../components/Sidebar';

export default function CreateRequestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    preferredPrice: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryDate: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        const uRes = await authAPI.getMe();
        setUser(uRes.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
        await requestAPI.createRequest({
          cropName: formData.cropName,
          quantity: parseInt(formData.quantity),
          preferredPrice: parseInt(formData.preferredPrice),
          deliveryCity: formData.deliveryCity,
          deliveryState: formData.deliveryState,
          deliveryDate: formData.deliveryDate
        });
        alert('✅ Request posted successfully! Farmers will be notified.');
        router.push('/dashboard/trader');
    } catch (err: any) {
        alert('Failed to post request: ' + (err.response?.data?.error || err.message));
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar user={user} activePath="/dashboard" />
      
      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
        <div className="max-w-xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black mb-2 text-cyan-400">Post a Request</h1>
                <p className="text-zinc-500 font-medium">Tell farmers exactly what you need and where</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 p-10 rounded-[48px] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl">
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">What do you need?</label>
                    <input 
                        type="text" 
                        placeholder="Crop Name (e.g. Wheat)"
                        required
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold focus:border-cyan-500/50"
                        value={formData.cropName}
                        onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="number" 
                            placeholder="Qty (Quintals)"
                            required
                            className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                        <input 
                            type="number" 
                            placeholder="Max Price (₹/Qt)"
                            required
                            className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold"
                            value={formData.preferredPrice}
                            onChange={(e) => setFormData({...formData, preferredPrice: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Where & When?</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Destination City"
                            required
                            className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none"
                            value={formData.deliveryCity}
                            onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                        />
                        <input 
                            type="text" 
                            placeholder="State"
                            required
                            className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none"
                            value={formData.deliveryState}
                            onChange={(e) => setFormData({...formData, deliveryState: e.target.value})}
                        />
                    </div>
                    <input 
                        type="date" 
                        required
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-zinc-400"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                    />
                </div>

                <button 
                    disabled={submitting}
                    className="w-full py-6 bg-cyan-500 text-black font-black rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-lg"
                >
                    {submitting ? 'Posting...' : 'Post Request'}
                </button>
            </form>
        </div>
      </main>
    </div>
  );
}
