'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Plus, Edit2, Trash2, Package, CheckSquare } from 'lucide-react';

interface ProcurementEntry {
  id: number; farmer: { name: string; avatar: string };
  crop: { name: string; image: string }; quantity: string;
  date: string; status: 'Verified' | 'Pending' | 'Quality Check'; selected: boolean;
}

export default function Procurement() {
  const router = useRouter();
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [filters, setFilters] = useState({ farmer: '', crop: '', date: '' });
  const [showModal, setShowModal] = useState(false);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [entries, setEntries] = useState<ProcurementEntry[]>([
    { id: 1, farmer: { name: 'Ramesh Kumar', avatar: 'RK' }, crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200' }, quantity: '50 qtl', date: '2026-04-20', status: 'Verified', selected: false },
    { id: 2, farmer: { name: 'Sunita Devi', avatar: 'SD' }, crop: { name: 'Rice', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=200' }, quantity: '80 qtl', date: '2026-04-21', status: 'Pending', selected: false },
    { id: 3, farmer: { name: 'Vijay Singh', avatar: 'VS' }, crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=200' }, quantity: '30 qtl', date: '2026-04-22', status: 'Quality Check', selected: false },
    { id: 4, farmer: { name: 'Lakshmi Patel', avatar: 'LP' }, crop: { name: 'Chickpea', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200' }, quantity: '65 qtl', date: '2026-04-23', status: 'Verified', selected: false },
  ]);
  const [newEntry, setNewEntry] = useState({ farmer: '', crop: '', quantity: '', date: '' });

  const toggleSelection = (id: number) => {
    setSelectedEntries(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 -mt-6">
      <div className="relative h-40 -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1632&auto=format&fit=crop)', filter: 'blur(2px)', transform: 'scale(1.05)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20]/85 via-[#2E7D32]/80 to-[#388E3C]/75" />
        <div className="relative h-full flex items-center px-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Procurement Ledger</h1>
            <p className="text-white/90 text-sm">Track all farmer procurement entries</p>
          </div>
        </div>
      </div>

      {selectedEntries.length > 0 && (
        <div className="sticky top-20 z-20 backdrop-blur-xl bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-2xl p-4 shadow-2xl border border-white/30 flex items-center justify-between">
          <span className="text-white font-semibold">{selectedEntries.length} entries selected</span>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-white text-[#2E7D32] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            <Package size={20} />Create Lot from Selected
          </button>
        </div>
      )}

      <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 backdrop-blur-sm bg-white/50 rounded-2xl px-4 py-2 border border-gray-200/50">
            <Filter size={20} style={{ color: '#666' }} />
            <input type="text" placeholder="Filter by farmer..." value={filters.farmer} onChange={(e) => setFilters({ ...filters, farmer: e.target.value })} className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <input type="text" placeholder="Filter by crop..." value={filters.crop} onChange={(e) => setFilters({ ...filters, crop: e.target.value })} className="backdrop-blur-sm bg-white/50 rounded-2xl px-4 py-3 border border-gray-200/50 outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all text-sm" />
          <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="backdrop-blur-sm bg-white/50 rounded-2xl px-4 py-3 border border-gray-200/50 outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all text-sm" />
          <button onClick={() => setShowNewEntryModal(true)} className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
            <Plus size={20} />New Entry
          </button>
        </div>

        <div className="space-y-4">
          {entries
            .filter(e => (!filters.farmer || e.farmer.name.toLowerCase().includes(filters.farmer.toLowerCase())) && (!filters.crop || e.crop.name.toLowerCase().includes(filters.crop.toLowerCase())))
            .map((entry) => (
              <div key={entry.id} className={`relative backdrop-blur-sm bg-white/90 rounded-2xl p-5 shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#2E7D32]/20 group ${selectedEntries.includes(entry.id) ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/30' : 'border-white/50'}`}>
                <div className="flex items-center gap-5">
                  <button onClick={() => toggleSelection(entry.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedEntries.includes(entry.id) ? 'bg-[#2E7D32] border-[#2E7D32]' : 'border-gray-300 hover:border-[#2E7D32]'}`}>
                    {selectedEntries.includes(entry.id) && <CheckSquare size={16} className="text-white" />}
                  </button>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#388E3C] flex items-center justify-center text-white font-bold shadow-md">{entry.farmer.avatar}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg" style={{ color: '#1a1a1a' }}>{entry.farmer.name}</div>
                    <div className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md ring-2 ring-gray-200 group-hover:ring-[#2E7D32]/50 transition-all">
                      <img src={entry.crop.image} alt={entry.crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: '#1a1a1a' }}>{entry.crop.name}</div>
                      <div className="text-sm text-gray-600">{entry.quantity}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border ${entry.status === 'Verified' ? 'bg-green-500/20 text-green-700 border-green-500/30' : entry.status === 'Pending' ? 'bg-amber-500/20 text-amber-700 border-amber-500/30' : 'bg-blue-500/20 text-blue-700 border-blue-500/30'}`}>{entry.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><Edit2 size={18} style={{ color: '#666' }} /></button>
                    <button className="p-2 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={18} className="text-red-500" /></button>
                    <button onClick={() => { setSelectedEntries([entry.id]); setShowModal(true); }} className="px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100">Add to Lot</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50">
            <div className="p-6 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Create Lot from Selected</h2>
              <p className="text-sm mt-1" style={{ color: '#666' }}>{selectedEntries.length} entries will be bundled into a new lot</p>
            </div>
            <div className="p-6">
              <div className="backdrop-blur-sm bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/10 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><div className="text-2xl font-bold" style={{ color: '#2E7D32' }}>{selectedEntries.length}</div><div className="text-xs text-gray-600">Entries</div></div>
                  <div><div className="text-2xl font-bold" style={{ color: '#2E7D32' }}>225 qtl</div><div className="text-xs text-gray-600">Total Quantity</div></div>
                  <div><div className="text-2xl font-bold" style={{ color: '#2E7D32' }}>₹5.5L</div><div className="text-xs text-gray-600">Est. Value</div></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all" style={{ color: '#1a1a1a' }}>Cancel</button>
                <button onClick={() => { setShowModal(false); router.push('/lots'); }} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">Create Lot</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewEntryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50">
            <div className="p-6 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>New Procurement Entry</h2>
              <p className="text-sm mt-1" style={{ color: '#666' }}>Record a new crop procurement from a farmer</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Farmer Name</label>
                <select value={newEntry.farmer} onChange={(e) => setNewEntry({ ...newEntry, farmer: e.target.value })} className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/20 transition-all">
                  <option value="">Select farmer...</option>
                  <option value="ramesh">Ramesh Kumar</option>
                  <option value="sunita">Sunita Devi</option>
                  <option value="vijay">Vijay Singh</option>
                  <option value="lakshmi">Lakshmi Patel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Crop Type</label>
                <select value={newEntry.crop} onChange={(e) => setNewEntry({ ...newEntry, crop: e.target.value })} className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/20 transition-all">
                  <option value="">Select crop...</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="mustard">Mustard</option>
                  <option value="chickpea">Chickpea</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Quantity (qtl)</label>
                  <input type="number" placeholder="0" value={newEntry.quantity} onChange={(e) => setNewEntry({ ...newEntry, quantity: e.target.value })} className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Date</label>
                  <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/20 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowNewEntryModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all" style={{ color: '#1a1a1a' }}>Cancel</button>
                <button
                  onClick={() => {
                    if (newEntry.farmer && newEntry.crop && newEntry.quantity && newEntry.date) {
                      const cropImages: Record<string, string> = { wheat: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200', rice: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=200', mustard: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=200', chickpea: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=200' };
                      const farmerNames: Record<string, { name: string; avatar: string }> = { ramesh: { name: 'Ramesh Kumar', avatar: 'RK' }, sunita: { name: 'Sunita Devi', avatar: 'SD' }, vijay: { name: 'Vijay Singh', avatar: 'VS' }, lakshmi: { name: 'Lakshmi Patel', avatar: 'LP' } };
                      const newId = Math.max(...entries.map(e => e.id), 0) + 1;
                      setEntries(prev => [{ id: newId, farmer: farmerNames[newEntry.farmer], crop: { name: newEntry.crop.charAt(0).toUpperCase() + newEntry.crop.slice(1), image: cropImages[newEntry.crop] }, quantity: `${newEntry.quantity} qtl`, date: newEntry.date, status: 'Pending', selected: false }, ...prev]);
                      setShowNewEntryModal(false);
                      setNewEntry({ farmer: '', crop: '', quantity: '', date: '' });
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
