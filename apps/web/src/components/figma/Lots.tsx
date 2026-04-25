'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, MapPin, Star, Edit2, Trash2, X, Shield, TrendingUp, Package, CheckCircle2 } from 'lucide-react';

interface ProduceItem {
  id: string;
  crop: { name: string; image: string };
  grade: string;
  farmer: { name: string; initials: string; location: string; color: string };
  quantity: number;
  pricePerQtl: number;
  procuredDate: string;
}

const availableProduce: ProduceItem[] = [
  { id: 'p1', crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=600' }, grade: 'A+', farmer: { name: 'Ramesh Kumar', initials: 'RK', location: 'Ludhiana, Punjab', color: 'bg-green-700' }, quantity: 50, pricePerQtl: 2450, procuredDate: '20 Apr 2026' },
  { id: 'p2', crop: { name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=600' }, grade: 'A+', farmer: { name: 'Sunita Devi', initials: 'SD', location: 'Karnal, Haryana', color: 'bg-green-700' }, quantity: 80, pricePerQtl: 3800, procuredDate: '21 Apr 2026' },
  { id: 'p3', crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=600' }, grade: 'A', farmer: { name: 'Vijay Singh', initials: 'VS', location: 'Jaipur, Rajasthan', color: 'bg-green-600' }, quantity: 30, pricePerQtl: 5200, procuredDate: '22 Apr 2026' },
  { id: 'p4', crop: { name: 'Chickpea', image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600' }, grade: 'A+', farmer: { name: 'Lakshmi Patel', initials: 'LP', location: 'Ahmedabad, Gujarat', color: 'bg-green-700' }, quantity: 65, pricePerQtl: 4100, procuredDate: '23 Apr 2026' },
  { id: 'p5', crop: { name: 'Cotton', image: 'https://images.unsplash.com/photo-1595231712325-9fd1565538d6?w=600' }, grade: 'B+', farmer: { name: 'Mohan Reddy', initials: 'MR', location: 'Warangal, Telangana', color: 'bg-green-600' }, quantity: 45, pricePerQtl: 6500, procuredDate: '24 Apr 2026' },
  { id: 'p6', crop: { name: 'Soybean', image: 'https://images.unsplash.com/photo-1599813533604-06c886862304?w=600' }, grade: 'A', farmer: { name: 'Geeta Sharma', initials: 'GS', location: 'Indore, Madhya Pradesh', color: 'bg-green-700' }, quantity: 70, pricePerQtl: 3950, procuredDate: '25 Apr 2026' },
];

interface Lot {
  id: number; crop: { name: string; image: string }; status: 'Published' | 'Draft' | 'Sold';
  quantity: string; quality: { moisture: number; protein: number; purity: number };
  pricePerQtl: string; location: string; farmers: number; recommendation: boolean;
  items?: ProduceItem[];
}

export default function Lots() {
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([
    { id: 23, crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=600' }, status: 'Published', quantity: '50 qtl', quality: { moisture: 12, protein: 11, purity: 98 }, pricePerQtl: '₹2,450', location: 'Ludhiana, Punjab', farmers: 5, recommendation: true },
    { id: 22, crop: { name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=600' }, status: 'Published', quantity: '100 qtl', quality: { moisture: 14, protein: 8, purity: 96 }, pricePerQtl: '₹3,800', location: 'Karnal, Haryana', farmers: 8, recommendation: false },
    { id: 21, crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=600' }, status: 'Draft', quantity: '30 qtl', quality: { moisture: 8, protein: 20, purity: 99 }, pricePerQtl: '₹5,200', location: 'Jaipur, Rajasthan', farmers: 3, recommendation: false },
    { id: 20, crop: { name: 'Chickpea', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=600' }, status: 'Sold', quantity: '75 qtl', quality: { moisture: 10, protein: 22, purity: 97 }, pricePerQtl: '₹4,100', location: 'Bhopal, MP', farmers: 6, recommendation: false },
  ]);

  const [activeFilter, setActiveFilter] = useState<'All' | 'Published' | 'Draft' | 'Sold'>('All');
  const filtered = activeFilter === 'All' ? lots : lots.filter(l => l.status === activeFilter);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLotId, setEditingLotId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<ProduceItem[]>([]);

  const openCreateModal = () => {
    setEditingLotId(null);
    setSelectedItems([]);
    setIsModalOpen(true);
  };

  const openEditModal = (lot: Lot) => {
    setEditingLotId(lot.id);
    setSelectedItems(lot.items || []);
    setIsModalOpen(true);
  };

  const toggleItem = (item: ProduceItem) => {
    setSelectedItems(prev => 
      prev.find(p => p.id === item.id) 
        ? prev.filter(p => p.id !== item.id) 
        : [...prev, item]
    );
  };

  const saveLot = () => {
    if (selectedItems.length === 0) return;

    // Calculate aggregates
    const totalQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    // Simple weighted average for price (for demo)
    const avgPrice = Math.round(selectedItems.reduce((sum, item) => sum + (item.pricePerQtl * item.quantity), 0) / totalQty);
    // Inherit crop details from first item
    const primaryItem = selectedItems[0];
    const farmerCount = new Set(selectedItems.map(i => i.farmer.name)).size;

    if (editingLotId) {
      setLots(prev => prev.map(lot => lot.id === editingLotId ? {
        ...lot,
        quantity: `${totalQty} qtl`,
        pricePerQtl: `₹${avgPrice.toLocaleString('en-IN')}`,
        farmers: farmerCount,
        crop: primaryItem.crop,
        location: primaryItem.farmer.location,
        items: selectedItems
      } : lot));
    } else {
      const newLot: Lot = {
        id: Math.max(...lots.map(l => l.id), 0) + 1,
        status: 'Draft',
        quantity: `${totalQty} qtl`,
        pricePerQtl: `₹${avgPrice.toLocaleString('en-IN')}`,
        farmers: farmerCount,
        crop: primaryItem.crop,
        location: primaryItem.farmer.location,
        quality: { moisture: 12, protein: 11, purity: 98 },
        recommendation: false,
        items: selectedItems
      };
      setLots([newLot, ...lots]);
    }
    setIsModalOpen(false);
  };

  const QualityBar = ({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>{value}%</span>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Lots</h1><p className="text-sm" style={{ color: '#666' }}>Manage and publish your crop lots</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 bg-gradient-to-r from-[#2E7D32] to-[#388E3C]"><Plus size={20} />Create Lot</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        {(['All', 'Published', 'Draft', 'Sold'] as const).map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-3 rounded-full font-semibold transition-all ${activeFilter === f ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-lg shadow-[#2E7D32]/30' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2E7D32]'}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map((lot) => (
          <div key={lot.id} className="group relative backdrop-blur-xl bg-white/90 rounded-3xl shadow-lg border border-white/60 overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(46,125,50,0.25)] transition-all duration-300 hover:scale-[1.01]">
            {lot.recommendation && (<div className="absolute top-4 right-4 z-10 w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full animate-pulse shadow-xl flex items-center justify-center"><Sparkles size={20} className="text-white" /></div>)}
            <div className="relative h-52 overflow-hidden">
              <img src={lot.crop.image} alt={lot.crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{lot.crop.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm"><MapPin size={14} />{lot.location}</div>
                </div>
                <div className={`backdrop-blur-md border-2 rounded-full px-3 py-1 text-xs font-bold ${lot.status === 'Published' ? 'bg-green-500/30 border-green-300/50 text-white' : lot.status === 'Draft' ? 'bg-amber-500/30 border-amber-300/50 text-white' : 'bg-blue-500/30 border-blue-300/50 text-white'}`}>{lot.status}</div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div><div className="text-xs text-gray-500 mb-1">Lot #{lot.id} • {lot.quantity}</div><div className="text-3xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">{lot.pricePerQtl}<span className="text-base text-gray-600 font-normal">/qtl</span></div></div>
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600">+{lot.farmers - 1}</div><div className="text-sm text-gray-600">{lot.farmers} farmers</div></div>
              </div>
              <div className="backdrop-blur-sm bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200/50 shadow-sm space-y-3">
                <div className="flex items-center justify-between mb-2"><div className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a1a1a' }}><Star size={16} className="text-amber-500 fill-amber-500" />Quality Metrics</div></div>
                <QualityBar label="Moisture" value={lot.quality.moisture} max={20} color="#2E7D32" />
                <QualityBar label="Protein" value={lot.quality.protein} max={25} color="#388E3C" />
                <QualityBar label="Purity" value={lot.quality.purity} color="#F57C00" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEditModal(lot)} className="flex-1 px-4 py-3 border-2 border-blue-500 text-blue-600 bg-blue-50 rounded-xl font-semibold hover:bg-blue-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"><Edit2 size={18} />Edit</button>
                <button className="p-3 border-2 border-red-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-500 transition-all transform hover:scale-105 flex items-center justify-center"><Trash2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Select Farmer Produce Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl border border-[#2E7D32]/20 flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Header */}
            <div className="p-6 bg-[#368b3a] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <Package size={32} className="opacity-90" />
                <div>
                  <h2 className="text-2xl font-bold">Select Farmer Produce</h2>
                  <p className="text-white/80 text-sm font-medium mt-0.5">Add items to create a new lot for marketplace</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Grid Content */}
            <div className="p-6 bg-[#f8fafc] overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(editingLotId && selectedItems.length > 0 ? [...selectedItems, ...availableProduce.filter(ap => !selectedItems.find(s => s.id === ap.id))] : availableProduce).map(item => {
                  const isSelected = selectedItems.some(s => s.id === item.id);
                  return (
                    <div key={item.id} className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSelected ? 'border-[#368b3a] shadow-md shadow-[#368b3a]/10 translate-y-[-2px]' : 'border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md'}`}>
                      {/* Image Top Half */}
                      <div className="relative h-44">
                        <img src={item.crop.image} alt={item.crop.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md ${isSelected ? 'bg-[#368b3a]/90 text-white' : 'bg-white/90 text-green-700'}`}>
                          <Sparkles size={12} /> {item.grade}
                        </div>
                        <h3 className="absolute bottom-3 left-4 text-white font-bold text-2xl drop-shadow-md">{item.crop.name}</h3>
                      </div>
                      
                      {/* Details Bottom Half */}
                      <div className="p-5">
                        {/* Farmer */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${item.farmer.color}`}>
                            {item.farmer.initials}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 leading-tight">{item.farmer.name}</div>
                            <div className="text-xs text-gray-500">{item.farmer.location}</div>
                          </div>
                        </div>

                        {/* Stats Boxes */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="bg-[#f0fdf4] rounded-xl p-3 border border-green-100/50">
                            <div className="text-[11px] font-semibold text-gray-500 mb-1">Quantity</div>
                            <div className="font-bold text-gray-900">{item.quantity} qtl</div>
                          </div>
                          <div className="bg-[#f0fdf4] rounded-xl p-3 border border-green-100/50">
                            <div className="text-[11px] font-semibold text-gray-500 mb-1">Price/qtl</div>
                            <div className="font-bold text-gray-900">₹{item.pricePerQtl.toLocaleString('en-IN')}</div>
                          </div>
                        </div>

                        {/* Procured Date */}
                        <div className="text-xs text-gray-400 font-medium mb-4">
                          Procured: {item.procuredDate}
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => toggleItem(item)}
                          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            isSelected 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                              : 'bg-[#368b3a] text-white hover:bg-[#2b702e] shadow-md hover:shadow-lg'
                          }`}
                        >
                          {isSelected ? (
                            <><Trash2 size={18} /> Remove from Lot</>
                          ) : (
                            <><Plus size={18} /> Add to Lot</>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-gray-400" />
                Select multiple items to create a combined lot for better pricing
              </p>
              
              <div className="flex gap-3 items-center">
                {selectedItems.length > 0 && (
                  <div className="text-right mr-4 hidden md:block">
                    <div className="text-sm text-gray-500">Total Quantity</div>
                    <div className="font-bold text-lg text-gray-900">{selectedItems.reduce((s, i) => s + i.quantity, 0)} qtl</div>
                  </div>
                )}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveLot}
                  disabled={selectedItems.length === 0}
                  className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
                    selectedItems.length > 0 
                      ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] hover:scale-105 hover:shadow-xl' 
                      : 'bg-gray-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  {editingLotId ? 'Save Changes' : `Create Combined Lot (${selectedItems.length})`}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

