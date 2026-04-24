import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, TrendingUp, Eye, Sparkles, X, BarChart3, Package, Trash2, CheckSquare } from 'lucide-react';
import heroImage from '../../imports/image-2.png';

interface Lot {
  id: number;
  crop: { name: string; image: string };
  quantity: string;
  quality: string;
  estimatedPrice: string;
  status: 'Draft' | 'Ready' | 'Published';
}

interface AvailableProduce {
  id: number;
  farmer: { name: string; avatar: string; location: string };
  crop: { name: string; image: string };
  quantity: string;
  quality: 'A+' | 'A' | 'B+';
  date: string;
  pricePerQtl: string;
}

export default function Lots() {
  const navigate = useNavigate();
  const [selectedLot, setSelectedLot] = useState<number | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showProduceModal, setShowProduceModal] = useState(false);
  const [lotItems, setLotItems] = useState<number[]>([]);
  const [editingLotId, setEditingLotId] = useState<number | null>(null);
  const [lots, setLots] = useState<Lot[]>([
    {
      id: 23,
      crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=600' },
      quantity: '50 qtl',
      quality: 'Grade A',
      estimatedPrice: '₹1.2L',
      status: 'Ready',
    },
    {
      id: 22,
      crop: { name: 'Rice (Basmati)', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=600' },
      quantity: '100 qtl',
      quality: 'Grade A',
      estimatedPrice: '₹3.8L',
      status: 'Published',
    },
    {
      id: 21,
      crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=600' },
      quantity: '30 qtl',
      quality: 'Grade B',
      estimatedPrice: '₹1.6L',
      status: 'Draft',
    },
  ]);
  const [lotProduceMap, setLotProduceMap] = useState<Record<number, number[]>>({
    23: [1],
    22: [2],
    21: [3],
  });

  const availableProduce: AvailableProduce[] = [
    {
      id: 1,
      farmer: { name: 'Ramesh Kumar', avatar: 'RK', location: 'Ludhiana, Punjab' },
      crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=400' },
      quantity: '50 qtl',
      quality: 'A+',
      date: '2026-04-20',
      pricePerQtl: '₹2,450',
    },
    {
      id: 2,
      farmer: { name: 'Sunita Devi', avatar: 'SD', location: 'Karnal, Haryana' },
      crop: { name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=400' },
      quantity: '80 qtl',
      quality: 'A+',
      date: '2026-04-21',
      pricePerQtl: '₹3,800',
    },
    {
      id: 3,
      farmer: { name: 'Vijay Singh', avatar: 'VS', location: 'Jaipur, Rajasthan' },
      crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=400' },
      quantity: '30 qtl',
      quality: 'A',
      date: '2026-04-22',
      pricePerQtl: '₹5,200',
    },
    {
      id: 4,
      farmer: { name: 'Lakshmi Patel', avatar: 'LP', location: 'Ahmedabad, Gujarat' },
      crop: { name: 'Chickpea', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=400' },
      quantity: '65 qtl',
      quality: 'A+',
      date: '2026-04-23',
      pricePerQtl: '₹4,100',
    },
    {
      id: 5,
      farmer: { name: 'Mohan Reddy', avatar: 'MR', location: 'Warangal, Telangana' },
      crop: { name: 'Cotton', image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc160?w=400' },
      quantity: '45 qtl',
      quality: 'B+',
      date: '2026-04-24',
      pricePerQtl: '₹6,500',
    },
    {
      id: 6,
      farmer: { name: 'Geeta Sharma', avatar: 'GS', location: 'Indore, Madhya Pradesh' },
      crop: { name: 'Soybean', image: 'https://images.unsplash.com/photo-1589927986089-35812378d72d?w=400' },
      quantity: '70 qtl',
      quality: 'A',
      date: '2026-04-25',
      pricePerQtl: '₹3,950',
    },
  ];

  const insights = {
    directTrader: { price: '₹2,450/qtl', total: '₹1.22L', badge: 'Good' },
    enam: { price: '₹2,570/qtl', total: '₹1.28L', badge: 'Best', confidence: '87%' },
    mandi: { price: '₹2,380/qtl', total: '₹1.19L', badge: 'Average' },
  };

  const toggleLotItem = (id: number) => {
    setLotItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const calculateLotDetails = (produceIds: number[]) => {
    const selectedProduce = availableProduce.filter(p => produceIds.includes(p.id));
    const totalQuantity = selectedProduce.reduce((sum, p) => {
      const qty = parseInt(p.quantity);
      return sum + qty;
    }, 0);

    const cropNames = [...new Set(selectedProduce.map(p => p.crop.name))];
    const cropName = cropNames.length === 1 ? cropNames[0] : `Mixed (${cropNames.length} crops)`;
    const cropImage = selectedProduce[0]?.crop.image || 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=600';

    const avgQuality = selectedProduce.every(p => p.quality === 'A+') ? 'Grade A+' :
                       selectedProduce.some(p => p.quality === 'A+' || p.quality === 'A') ? 'Grade A' : 'Grade B';

    const estimatedPrice = selectedProduce.reduce((sum, p) => {
      const qty = parseInt(p.quantity);
      const price = parseInt(p.pricePerQtl.replace(/[₹,]/g, ''));
      return sum + (qty * price);
    }, 0);

    const formattedPrice = estimatedPrice >= 100000
      ? `₹${(estimatedPrice / 100000).toFixed(1)}L`
      : `₹${(estimatedPrice / 1000).toFixed(0)}K`;

    return {
      quantity: `${totalQuantity} qtl`,
      cropName,
      cropImage,
      quality: avgQuality,
      estimatedPrice: formattedPrice,
    };
  };

  const handlePublishLot = () => {
    if (editingLotId !== null) {
      // Update existing lot
      const details = calculateLotDetails(lotItems);
      setLots(prev => prev.map(lot =>
        lot.id === editingLotId
          ? {
              ...lot,
              crop: { name: details.cropName, image: details.cropImage },
              quantity: details.quantity,
              quality: details.quality,
              estimatedPrice: details.estimatedPrice,
            }
          : lot
      ));
      setLotProduceMap(prev => ({ ...prev, [editingLotId]: lotItems }));
    } else {
      // Create new lot
      const newLotId = Math.max(...lots.map(l => l.id), 0) + 1;
      const details = calculateLotDetails(lotItems);

      const newLot: Lot = {
        id: newLotId,
        crop: { name: details.cropName, image: details.cropImage },
        quantity: details.quantity,
        quality: details.quality,
        estimatedPrice: details.estimatedPrice,
        status: 'Draft',
      };

      setLots(prev => [newLot, ...prev]);
      setLotProduceMap(prev => ({ ...prev, [newLotId]: lotItems }));
    }

    setShowProduceModal(false);
    setLotItems([]);
    setEditingLotId(null);
  };

  const handleEditLot = (lotId: number) => {
    const produceItems = lotProduceMap[lotId] || [];
    setLotItems(produceItems);
    setEditingLotId(lotId);
    setShowProduceModal(true);
  };

  const handleCreateNewLot = () => {
    setLotItems([]);
    setEditingLotId(null);
    setShowProduceModal(true);
  };

  return (
    <div className="space-y-6 -mt-6">
      {/* Hero Section */}
      <div className="relative h-48 -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: 'blur(2px)',
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20]/85 via-[#2E7D32]/80 to-[#388E3C]/75" />
        <div className="relative h-full flex items-center justify-between px-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Lots</h1>
            <p className="text-white/90">Manage and publish your produce lots</p>
          </div>
          <button
            onClick={handleCreateNewLot}
            className="backdrop-blur-xl bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Lot
          </button>
        </div>
      </div>

      {/* Lots Grid - Large Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lots.map((lot) => (
          <div
            key={lot.id}
            className="group relative backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(46,125,50,0.3)] transition-all duration-300"
          >
            {/* Crop Image Banner */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={lot.crop.image}
                alt={lot.crop.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-bold text-white">{lot.crop.name}</h3>
                <p className="text-white/90 text-sm">Lot #{lot.id}</p>
              </div>
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border-2 ${
                    lot.status === 'Published'
                      ? 'bg-green-500/30 text-white border-green-300/50'
                      : lot.status === 'Ready'
                      ? 'bg-blue-500/30 text-white border-blue-300/50'
                      : 'bg-gray-500/30 text-white border-gray-300/50'
                  }`}
                >
                  {lot.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="backdrop-blur-sm bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/10 rounded-2xl p-3">
                  <div className="text-xs text-gray-600 mb-1">Total Quantity</div>
                  <div className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                    {lot.quantity}
                  </div>
                </div>
                <div className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-3">
                  <div className="text-xs text-gray-600 mb-1">Avg Quality</div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-700 border border-blue-500/30">
                    {lot.quality}
                  </span>
                </div>
              </div>

              {/* Estimated Price */}
              <div className="backdrop-blur-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-200/50">
                <div className="text-xs text-gray-600 mb-1">Estimated Price</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                  {lot.estimatedPrice}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedLot(lot.id);
                    setShowInsights(true);
                  }}
                  className="px-4 py-3 rounded-xl border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Eye size={18} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">View</span>
                </button>
                <button
                  onClick={() => handleEditLot(lot.id)}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  <span className="text-sm">Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Panel */}
      {showInsights && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-4xl border border-white/50 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] p-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 size={28} />
                  Market Insights - Lot #{selectedLot}
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  Compare prices across different selling routes
                </p>
              </div>
              <button
                onClick={() => setShowInsights(false)}
                className="p-2 backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Direct Trader */}
                <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-green-500/30 backdrop-blur-md text-green-700 text-xs font-bold rounded-full border border-green-500/50">
                      {insights.directTrader.badge}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Direct Trader</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: '#2E7D32' }}>
                    {insights.directTrader.price}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Total: {insights.directTrader.total}
                  </div>
                </div>

                {/* eNAM - Best */}
                <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-cyan-500/20 rounded-2xl p-6 border-2 border-blue-500/50 ring-4 ring-blue-500/20 shadow-xl">
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Sparkles size={14} />
                      BEST ROUTE
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">eNAM Platform</div>
                  <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {insights.enam.price}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    Total: {insights.enam.total}
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">
                    {insights.enam.confidence} confidence
                  </div>
                </div>

                {/* Mandi */}
                <div className="backdrop-blur-sm bg-gradient-to-br from-amber-500/10 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-amber-500/30 backdrop-blur-md text-amber-700 text-xs font-bold rounded-full border border-amber-500/50">
                      {insights.mandi.badge}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Local Mandi</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: '#F57C00' }}>
                    {insights.mandi.price}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Total: {insights.mandi.total}
                  </div>
                </div>
              </div>

              {/* Mini Graph Visualization */}
              <div className="backdrop-blur-sm bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-sm font-semibold mb-4 text-gray-700">
                  Price Comparison Chart
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-medium w-24">Direct Trader</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full flex items-center justify-end pr-3"
                        style={{ width: '95%' }}
                      >
                        <span className="text-white text-xs font-bold">₹2,450</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-medium w-24">eNAM</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-full flex items-center justify-end pr-3 shadow-lg"
                        style={{ width: '100%' }}
                      >
                        <span className="text-white text-xs font-bold">₹2,570</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-medium w-24">Mandi</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full flex items-center justify-end pr-3"
                        style={{ width: '92%' }}
                      >
                        <span className="text-white text-xs font-bold">₹2,380</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border-2 border-blue-400/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                      AI Recommendation
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Based on current market trends, quality grade, and historical data, we
                      recommend selling via <span className="font-bold text-blue-700">eNAM Platform</span> with{' '}
                      <span className="font-bold">87% confidence</span>. You'll earn{' '}
                      <span className="font-bold text-green-700">₹6,000 more</span> compared to
                      local mandi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => {
                  setShowInsights(false);
                  navigate('/marketplace');
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <Sparkles size={24} />
                Sell via eNAM (Best Route)
                <TrendingUp size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Farmer Produce Modal */}
      {showProduceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-2xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-6xl border-2 border-white/50 transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Package size={32} />
                  {editingLotId ? `Edit Lot #${editingLotId}` : 'Select Farmer Produce'}
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  {editingLotId ? 'Add or remove items from this lot' : 'Add items to create a new lot for marketplace'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProduceModal(false);
                  setLotItems([]);
                  setEditingLotId(null);
                }}
                className="p-2 backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X size={28} className="text-white" />
              </button>
            </div>

            {/* Selected Items Bar */}
            {lotItems.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckSquare size={24} className="text-blue-600" />
                  <span className="font-bold text-blue-900">
                    {lotItems.length} items selected
                  </span>
                  <button
                    onClick={() => setLotItems([])}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Clear all
                  </button>
                </div>
                <button
                  onClick={handlePublishLot}
                  className="px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  {editingLotId ? `Update Lot (${lotItems.length})` : `Publish Lot (${lotItems.length})`}
                </button>
              </div>
            )}

            {/* Produce Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProduce.map((produce) => {
                  const isAdded = lotItems.includes(produce.id);
                  return (
                    <div
                      key={produce.id}
                      className={`group relative backdrop-blur-lg bg-white/90 rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                        isAdded
                          ? 'border-[#2E7D32] ring-4 ring-[#2E7D32]/30'
                          : 'border-white/60 hover:border-[#2E7D32]/50'
                      }`}
                    >
                      {/* Crop Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={produce.crop.image}
                          alt={produce.crop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Quality Badge */}
                        <div className={`absolute top-3 right-3 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-lg border-2 ${
                          produce.quality === 'A+'
                            ? 'bg-green-500/40 border-green-300/60'
                            : produce.quality === 'A'
                            ? 'bg-blue-500/40 border-blue-300/60'
                            : 'bg-amber-500/40 border-amber-300/60'
                        }`}>
                          <Sparkles size={14} className="text-white" />
                          <span className="text-white text-xs font-bold">{produce.quality}</span>
                        </div>

                        {/* Crop Name on Image */}
                        <div className="absolute bottom-3 left-3">
                          <h3 className="text-2xl font-bold text-white">{produce.crop.name}</h3>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        {/* Farmer Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#388E3C] flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {produce.farmer.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>
                              {produce.farmer.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {produce.farmer.location}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="backdrop-blur-sm bg-gray-50 rounded-xl p-3">
                            <div className="text-xs text-gray-600 mb-1">Quantity</div>
                            <div className="font-bold text-sm" style={{ color: '#1a1a1a' }}>
                              {produce.quantity}
                            </div>
                          </div>
                          <div className="backdrop-blur-sm bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/10 rounded-xl p-3">
                            <div className="text-xs text-gray-600 mb-1">Price/qtl</div>
                            <div className="font-bold text-sm bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                              {produce.pricePerQtl}
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="text-xs text-gray-500 pt-1">
                          Procured: {new Date(produce.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>

                        {/* Add/Remove Button */}
                        <button
                          onClick={() => toggleLotItem(produce.id)}
                          className={`w-full py-3 rounded-xl font-bold shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                            isAdded
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] hover:shadow-xl hover:shadow-[#2E7D32]/50 text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Trash2 size={18} />
                              Remove
                            </>
                          ) : (
                            <>
                              <Plus size={18} />
                              Add to Lot
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200/50 p-6 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {editingLotId
                    ? 'Add or remove items to update this lot'
                    : 'Select multiple items to create a combined lot for better pricing'}
                </div>
                {lotItems.length > 0 && (
                  <button
                    onClick={handlePublishLot}
                    className="px-8 py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <Sparkles size={22} />
                    {editingLotId ? `Update Lot with ${lotItems.length} items` : `Publish Lot with ${lotItems.length} items`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
