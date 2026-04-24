'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, Truck, Package, DollarSign, Shield, XCircle, Calendar, MapPin, ArrowLeft, FileText } from 'lucide-react';

interface Trade {
  id: string; buyer: string; crop: { name: string; image: string };
  quantity: string; price: string; total: string;
  status: 'In Transit' | 'Delivered' | 'Paid'; estimatedDelivery: string;
}

const initialTrades: Trade[] = [
  { id: 'TRD-2024-001', buyer: 'Agro Enterprises Ltd', crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200' }, quantity: '50 qtl', price: '₹2,580/qtl', total: '₹1,29,000', status: 'In Transit', estimatedDelivery: '2026-04-28' },
  { id: 'TRD-2024-002', buyer: 'Green Valley Traders', crop: { name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=200' }, quantity: '100 qtl', price: '₹3,800/qtl', total: '₹3,80,000', status: 'Delivered', estimatedDelivery: '2026-04-25' },
  { id: 'TRD-2024-003', buyer: 'National Grain Co.', crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=200' }, quantity: '30 qtl', price: '₹5,200/qtl', total: '₹1,56,000', status: 'Paid', estimatedDelivery: '2026-04-22' },
];

export default function Trades() {
  const [tradeList, setTradeList] = useState<Trade[]>(initialTrades);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'In Transit' | 'Delivered' | 'Paid'>('All');
  
  const filteredTrades = activeFilter === 'All' ? tradeList : tradeList.filter(t => t.status === activeFilter);

  const updateTradeStatus = (id: string, newStatus: 'In Transit' | 'Delivered' | 'Paid') => {
    setTradeList(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setSelectedTrade(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  };

  const steps = [
    { id: 0, label: 'Accepted', icon: CheckCircle, completed: true },
    { id: 1, label: 'Dispatched', icon: Truck, completed: true },
    { id: 2, label: 'In Transit', icon: Package, completed: selectedTrade?.status === 'Delivered' || selectedTrade?.status === 'Paid', active: selectedTrade?.status === 'In Transit' },
    { id: 3, label: 'Delivered', icon: CheckCircle, completed: selectedTrade?.status === 'Delivered' || selectedTrade?.status === 'Paid', active: selectedTrade?.status === 'Delivered' },
    { id: 4, label: 'Paid', icon: DollarSign, completed: selectedTrade?.status === 'Paid', active: selectedTrade?.status === 'Paid' },
  ];

  if (selectedTrade) {
    return (
      <div className="space-y-8">
        <button onClick={() => setSelectedTrade(null)} className="flex items-center gap-2 px-4 py-2 text-[#2E7D32] hover:bg-green-50 rounded-xl transition-all font-semibold"><ArrowLeft size={20} />Back to Trades</button>
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Trade ID', val: selectedTrade.id, color: 'from-[#2E7D32]/10 to-[#388E3C]/10', border: 'border-[#2E7D32]/30' },
              { label: 'Buyer', val: selectedTrade.buyer, color: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/30' },
              { label: 'Quantity', val: `${selectedTrade.quantity} ${selectedTrade.crop.name}`, color: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/30' },
              { label: 'Total Value', val: selectedTrade.total, color: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/30' },
            ].map((c, i) => (
              <div key={i} className={`backdrop-blur-sm bg-gradient-to-br ${c.color} rounded-2xl p-5 border ${c.border}`}>
                <div className="text-sm text-gray-600 mb-2">{c.label}</div>
                <div className={`font-bold ${i === 3 ? 'text-2xl bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent' : 'text-xl'}`} style={i !== 3 ? { color: '#1a1a1a' } : {}}>{c.val}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div className={`backdrop-blur-md border-2 rounded-full px-6 py-3 shadow-lg ${selectedTrade.status === 'In Transit' ? 'bg-blue-500/20 border-blue-400/50' : selectedTrade.status === 'Delivered' ? 'bg-green-500/20 border-green-400/50' : 'bg-emerald-500/20 border-emerald-400/50'}`}>
              <span className={`font-bold flex items-center gap-2 ${selectedTrade.status === 'In Transit' ? 'text-blue-700' : selectedTrade.status === 'Delivered' ? 'text-green-700' : 'text-emerald-700'}`}>
                <Circle className={`animate-pulse ${selectedTrade.status === 'In Transit' ? 'fill-blue-600 text-blue-600' : selectedTrade.status === 'Delivered' ? 'fill-green-600 text-green-600' : 'fill-emerald-600 text-emerald-600'}`} size={12} />{selectedTrade.status}
              </span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Trade Progress</h2>
          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-full transition-all duration-500 shadow-lg shadow-[#2E7D32]/50" style={{ width: `${(steps.filter(s => s.completed).length / (steps.length - 1)) * 100}%` }} />
            </div>
            <div className="relative flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-lg ${step.completed ? 'bg-gradient-to-br from-[#2E7D32] to-[#388E3C] border-[#2E7D32] shadow-[#2E7D32]/50' : step.active ? 'bg-blue-500 border-blue-400 animate-pulse shadow-blue-500/50 scale-110' : 'bg-gray-200 border-gray-300 opacity-50'}`}>
                      <Icon size={28} className={step.completed || step.active ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div className="mt-3 text-center"><div className={`text-sm font-semibold ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</div></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1a1a1a' }}><Truck size={28} className="text-[#2E7D32]" />Delivery Status</h2>
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-3"><Package size={24} className="text-blue-600" /><div className="text-lg font-bold text-blue-900">{selectedTrade.status}</div></div>
                <div className="text-sm text-blue-700">
                  {selectedTrade.status === 'In Transit' && 'Your shipment is on the way to the buyer'}
                  {selectedTrade.status === 'Delivered' && 'Shipment has been delivered successfully'}
                  {selectedTrade.status === 'Paid' && 'Payment has been completed'}
                </div>
              </div>
              <div className="flex items-center gap-3"><Calendar size={20} className="text-gray-600" /><div><div className="text-sm text-gray-600">Estimated Delivery</div><div className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{new Date(selectedTrade.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div></div>
              <div className="flex items-center gap-3"><MapPin size={20} className="text-gray-600" /><div><div className="text-sm text-gray-600">Destination</div><div className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Delhi Grain Market</div></div></div>
              <div className="space-y-3 pt-4">
                {selectedTrade.status === 'In Transit' && (
                  <>
                    <button onClick={() => alert('Transit status updated on the blockchain!')} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"><Truck size={20} />Update Transit Status</button>
                    <button onClick={() => updateTradeStatus(selectedTrade.id, 'Delivered')} className="w-full py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"><CheckCircle size={20} />Mark as Delivered</button>
                  </>
                )}
                {selectedTrade.status === 'Delivered' && (
                  <button onClick={() => updateTradeStatus(selectedTrade.id, 'Paid')} className="w-full py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"><DollarSign size={20} />Confirm Payment Received</button>
                )}
              </div>
            </div>
          </div>
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>Trade Actions</h2>
            <div className="space-y-4">
              <div className="backdrop-blur-sm bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border-2 border-green-500/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg animate-pulse"><Shield size={28} className="text-white" /></div>
                  <div><div className="font-bold text-lg flex items-center gap-2" style={{ color: '#1a1a1a' }}>Blockchain Verified <CheckCircle size={18} className="text-green-600" /></div><div className="text-sm text-gray-600">Trade recorded on chain #0x4f7a...</div></div>
                </div>
              </div>
              <div className="backdrop-blur-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/30">
                <div className="flex items-center gap-4 mb-4"><DollarSign size={24} className="text-amber-600" /><div className="font-bold text-lg" style={{ color: '#1a1a1a' }}>Payment Details</div></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Price per qtl</span><span className="font-semibold">{selectedTrade.price}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Total Quantity</span><span className="font-semibold">{selectedTrade.quantity}</span></div>
                  <div className="border-t border-amber-200 my-2 pt-2"></div>
                  <div className="flex justify-between text-lg"><span className="font-bold">Total Amount</span><span className="font-bold text-[#2E7D32]">{selectedTrade.total}</span></div>
                </div>
              </div>
              <button className="w-full backdrop-blur-sm bg-red-50 border-2 border-red-300 rounded-2xl p-4 hover:bg-red-100 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:scale-[1.02] group">
                <div className="flex items-center justify-center gap-2"><XCircle size={20} className="text-red-600" /><span className="font-bold text-red-600">Cancel Trade</span></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Trades</h1>
        <p className="text-sm" style={{ color: '#666' }}>Track active and completed trades</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        {(['All', 'In Transit', 'Delivered', 'Paid'] as const).map((filter) => (
          <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-3 rounded-full font-semibold transition-all ${activeFilter === filter ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-lg shadow-[#2E7D32]/30' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2E7D32]'}`}>{filter}</button>
        ))}
      </div>
      {filteredTrades.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTrades.map((trade) => (
            <div key={trade.id} onClick={() => setSelectedTrade(trade)} className="backdrop-blur-md bg-white/90 rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 ring-2 ring-gray-200 group-hover:ring-[#2E7D32]/50 transition-all">
                  <img src={trade.crop.image} alt={trade.crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div><div className="text-xs text-gray-500 mb-1">Trade ID</div><div className="font-bold text-lg" style={{ color: '#1a1a1a' }}>{trade.id}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Crop</div><div className="font-semibold" style={{ color: '#1a1a1a' }}>{trade.crop.name}</div><div className="text-sm text-gray-600">{trade.quantity}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Buyer</div><div className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{trade.buyer}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Total Value</div><div className="text-xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">{trade.total}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Status</div><span className={`inline-block px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border ${trade.status === 'In Transit' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : trade.status === 'Delivered' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30'}`}>{trade.status}</span></div>
                </div>
                <div className="flex-shrink-0 ml-2 hidden sm:block">
                  <div className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold group-hover:border-[#2E7D32] group-hover:text-[#2E7D32] transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
                    View Trade Details
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No {activeFilter.toLowerCase()} trades</h3>
          <p className="text-gray-600">{activeFilter === 'All' ? 'No trades found' : `No trades in ${activeFilter.toLowerCase()} status`}</p>
        </div>
      )}
    </div>
  );
}
