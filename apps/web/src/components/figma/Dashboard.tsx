'use client';
import { useRouter } from 'next/navigation';
import { TrendingUp, Package, FileText, ArrowRight, Sparkles, ShoppingCart, Wallet, Eye, Edit2 } from 'lucide-react';

const heroStats = [
  { label: 'Procured Today', value: '85 qtl', icon: ShoppingCart, trend: '+12%' },
  { label: 'Active Lots', value: '24', icon: Package, trend: '+3' },
  { label: 'Pending Deals', value: '12', icon: FileText, trend: '6 closing' },
  { label: 'Pending Payouts', value: '₹4.2L', icon: Wallet, trend: '3 invoices' },
];

const myLots = [
  { id: 23, crop: 'Wheat', quantity: '50 qtl', status: 'Ready', bestPrice: '₹2,450/qtl', recommendation: true, image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200' },
  { id: 22, crop: 'Rice', quantity: '100 qtl', status: 'Active Bids', bestPrice: '₹3,800/qtl', recommendation: false, image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=200' },
  { id: 21, crop: 'Mustard', quantity: '30 qtl', status: 'In Procurement', bestPrice: '₹5,200/qtl', recommendation: false, image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=200' },
  { id: 20, crop: 'Chickpea', quantity: '75 qtl', status: 'Ready', bestPrice: '₹4,100/qtl', recommendation: false, image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200' },
];

export default function Dashboard() {
  const router = useRouter();
  const gradients = ['from-green-400 to-emerald-500', 'from-blue-400 to-cyan-500', 'from-amber-400 to-orange-500', 'from-purple-400 to-pink-500'];

  return (
    <div className="space-y-12 -mt-6">
      <div className="relative h-64 -mx-6 -mt-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1632&auto=format&fit=crop)', transform: 'scale(1.05)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/85 via-[#2E7D32]/60 to-transparent" />
        <div className="relative h-full px-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-lg text-white/80">Track your lots and trades</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {heroStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="backdrop-blur-lg bg-white/70 rounded-2xl p-6 border border-white/50 shadow-lg hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02] transition-all duration-250" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.6), 0 8px 24px rgba(0,0,0,0.08)' }}>
              <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index]} rounded-xl flex items-center justify-center mb-4 shadow-md`}><Icon size={24} className="text-white" /></div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#1a1a1a' }}>{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.trend}</div>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2E7D32] to-[#FDD835] shadow-xl">
        <div className="p-6 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-lg animate-pulse" />
            <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"><TrendingUp size={28} className="text-white" strokeWidth={2.5} /></div>
          </div>
          <div className="flex-1">
            <div className="inline-block backdrop-blur-md bg-white rounded-full px-4 py-1 mb-2"><span className="text-sm font-bold text-green-700">eNAM showing ₹2,570/qtl</span></div>
            <p className="text-white/90 text-sm">Lot #23 (Wheat, 50 qtl) can earn <span className="font-bold text-white">+₹120/qtl</span> via eNAM</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button className="px-5 py-2.5 bg-white text-[#2E7D32] rounded-xl font-semibold text-sm hover:shadow-lg transition-all transform hover:scale-105">View Insights</button>
            <button onClick={() => router.push('/lots')} className="px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105">Create Lot</button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>My Lots</h2>
            <p className="text-sm mt-1 text-gray-600">Quick overview of your recent lots</p>
          </div>
          <button onClick={() => router.push('/lots')} className="px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            View All <ArrowRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myLots.map((lot) => (
            <div key={lot.id} className="relative backdrop-blur-md bg-white/90 rounded-3xl shadow-lg border border-white/60 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-[#2E7D32]/30 transition-all duration-250 group" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              {lot.recommendation && (
                <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full animate-pulse shadow-lg flex items-center justify-center"><Sparkles size={16} className="text-white" /></div>
              )}
              <div className="flex gap-6 p-6">
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                  <img src={lot.image} alt={lot.crop} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#1a1a1a' }}>{lot.crop}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-600">Lot #{lot.id}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm font-semibold text-gray-700">{lot.quantity}</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${lot.status === 'Ready' ? 'bg-green-500/20 text-green-700 border-green-500/30' : lot.status === 'Active Bids' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : 'bg-gray-500/20 text-gray-700 border-gray-500/30'}`}>{lot.status}</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-1">Best Price</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent mb-4">{lot.bestPrice}</div>
                    <div className="flex gap-2">
                      <button onClick={() => router.push('/lots')} className="flex-1 px-4 py-2 text-sm font-semibold border-2 border-blue-500 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all transform hover:scale-105 flex items-center justify-center gap-1"><Eye size={16} />View</button>
                      <button onClick={() => router.push('/lots')} className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#2E7D32] to-[#388E3C] shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-1"><Edit2 size={16} />Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Create Procurement', desc: 'Start a new procurement cycle', path: '/procurement', color: 'green', icon: Package, gradient: 'from-[#2E7D32] to-[#388E3C]', bg: 'from-green-500/10 to-emerald-500/20', border: 'border-green-500/30', shadow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]', text: 'text-green-600' },
          { label: 'Create Lot', desc: 'Bundle produce into a lot', path: '/lots', color: 'blue', icon: FileText, gradient: 'from-blue-600 to-cyan-600', bg: 'from-blue-500/10 to-cyan-500/20', border: 'border-blue-500/30', shadow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]', text: 'text-blue-600' },
          { label: 'Browse Buyers', desc: 'Find verified traders', path: '/marketplace', color: 'amber', icon: TrendingUp, gradient: 'from-amber-600 to-orange-600', bg: 'from-amber-500/10 to-orange-500/20', border: 'border-amber-500/30', shadow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]', text: 'text-amber-600' },
        ].map((action, i) => (
          <button key={i} onClick={() => router.push(action.path)} className={`relative overflow-hidden backdrop-blur-md bg-gradient-to-br ${action.bg} rounded-2xl p-6 border ${action.border} shadow-xl hover:shadow-2xl hover:-translate-y-2 ${action.shadow} transition-all duration-300 text-left group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform`}><action.icon size={28} className="text-white" /></div>
                <ArrowRight size={24} className={`${action.text} group-hover:translate-x-1 transition-transform`} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>{action.label}</h3>
              <p className="text-sm" style={{ color: '#666' }}>{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
