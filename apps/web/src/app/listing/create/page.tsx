'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, listingAPI } from '@agrochain/api';
import Sidebar from '../../../components/Sidebar';
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CreateListingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    price: '',
    description: '',
    location: 'Amritsar, Punjab'
  });
  const [photo, setPhoto] = useState<File | null>(null);

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
        const data = new FormData();
        data.append('cropName', formData.cropName);
        data.append('quantity', formData.quantity);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('location', formData.location);
        if (photo) data.append('photo', photo);

        await listingAPI.createListing(data);
        alert('✅ Crop listed successfully in the marketplace!');
        router.push('/dashboard/farmer');
    } catch (err: any) {
        alert('Failed to create listing: ' + (err.response?.data?.error || err.message));
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar user={user} activePath="/dashboard" />
      
      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>List Harvest</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black mb-2 text-emerald-500">List Your Harvest</h1>
                <p className="text-zinc-500 font-medium">Create a marketplace listing for traders to discover</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 p-10 rounded-[48px] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Crop Details</label>
                    <input 
                        type="text" 
                        placeholder="Crop Name (e.g. Basmati Rice)"
                        required
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all outline-none font-bold"
                        value={formData.cropName}
                        onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="number" 
                            placeholder="Quantity (Quintals)"
                            required
                            className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none font-bold"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                        <input 
                            type="number" 
                            placeholder="Price per Quintal (₹)"
                            required
                            className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none font-bold"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Location & About</label>
                    <input 
                        type="text" 
                        placeholder="Farming Location"
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                    <textarea 
                        placeholder="Crop description, harvest date, and quality details..."
                        rows={4}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Visual Proof (Optional)</label>
                    <div className="relative group border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center hover:border-emerald-500/30 transition-all">
                        <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
                        />
                        <div className="text-zinc-500 font-bold group-hover:text-emerald-400 transition-colors">
                            {photo ? photo.name : 'Click or Drag to Upload Crop Photo'}
                        </div>
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-8 bg-emerald-500 text-black font-black rounded-3xl group relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 disabled:opacity-50"
                >
                    <span className="relative z-10">{submitting ? 'Creating Listing...' : 'Submit Listing to Marketplace'}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </Button>
            </form>
        </div>
      </main>
    </div>
  );
}
