import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Users, Star, Eye, CheckCircle, MessageSquare, Sparkles, Shield, X } from 'lucide-react';
import heroImage from '../../imports/image-2.png';

interface Lot {
  id: number;
  crop: { name: string; image: string };
  quantity: string;
  location: string;
  basePrice: string;
  bidCount: number;
  verified: boolean;
}

interface Bid {
  id: number;
  buyer: string;
  reliability: number;
  price: string;
  verified: boolean;
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ crop: '', priceRange: 50000, distance: 100, verifiedOnly: false });
  const [selectedLot, setSelectedLot] = useState<number | null>(null);
  const [showBids, setShowBids] = useState(false);

  const lots: Lot[] = [
    {
      id: 23,
      crop: { name: 'Wheat', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=600' },
      quantity: '50 qtl',
      location: 'Ludhiana, Punjab',
      basePrice: '₹2,450/qtl',
      bidCount: 8,
      verified: true,
    },
    {
      id: 22,
      crop: { name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1645300636601-50ac2595730d?w=600' },
      quantity: '100 qtl',
      location: 'Karnal, Haryana',
      basePrice: '₹3,800/qtl',
      bidCount: 12,
      verified: true,
    },
    {
      id: 21,
      crop: { name: 'Mustard', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=600' },
      quantity: '30 qtl',
      location: 'Jaipur, Rajasthan',
      basePrice: '₹5,200/qtl',
      bidCount: 5,
      verified: false,
    },
  ];

  const bids: Bid[] = [
    { id: 1, buyer: 'Agro Enterprises Ltd', reliability: 4.8, price: '₹2,580/qtl', verified: true },
    { id: 2, buyer: 'Green Valley Traders', reliability: 4.5, price: '₹2,520/qtl', verified: true },
    { id: 3, buyer: 'National Grain Co.', reliability: 4.9, price: '₹2,600/qtl', verified: true },
  ];

  return (
    <div className="relative -mt-6 -mx-6 min-h-screen">
      {/* Hero Background - Full Width */}
      <div className="absolute inset-0 h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/95 via-[#2E7D32]/70 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 pt-16 pb-8 px-8">
        <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
        <p className="text-white/90 text-lg">Connect with verified buyers and get best prices</p>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex gap-0 px-6">
        {/* Left - Full Height Sticky Filter Sidebar */}
        <div className="w-80 flex-shrink-0 pr-6">
          <div className="sticky top-6 backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl border border-white/60 p-6 space-y-6" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)' }}>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1a1a1a' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>

            {/* Crop Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
                Crop Type
              </label>
              <select
                value={filters.crop}
                onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
                className="w-full px-5 py-4 backdrop-blur-sm bg-white/60 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/20 transition-all text-base font-medium shadow-sm hover:shadow-md"
              >
                <option value="">All Crops</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="mustard">Mustard</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
                Max Price: ₹{filters.priceRange.toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: parseInt(e.target.value) })}
                className="w-full h-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-full appearance-none cursor-pointer slider"
              />
            </div>

            {/* Distance Slider */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
                Distance: {filters.distance} km
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={filters.distance}
                onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                className="w-full h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full appearance-none cursor-pointer slider"
              />
            </div>

            {/* Verified Buyers Toggle */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/10 rounded-2xl p-4 border border-[#2E7D32]/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                  className="w-6 h-6 rounded-lg"
                />
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                    <Shield size={16} className="text-[#2E7D32]" />
                    Verified Buyers Only
                  </div>
                  <div className="text-xs text-gray-600">Show only trusted traders</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right - Scrollable Lot Cards Grid */}
        <div className="flex-1 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="group relative backdrop-blur-xl bg-white/90 rounded-3xl shadow-lg border border-white/60 overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(46,125,50,0.25)] transition-all duration-300 hover:scale-[1.01]"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
              >
                {/* Crop Image Banner */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={lot.crop.image}
                    alt={lot.crop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Verified Badge */}
                  {lot.verified && (
                    <div className="absolute top-4 right-4 backdrop-blur-md bg-green-500/30 border-2 border-green-300/50 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                      <CheckCircle size={16} className="text-white" />
                      <span className="text-white text-xs font-bold">Verified</span>
                    </div>
                  )}

                  {/* Buyer Interest Badge */}
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-blue-500/30 border-2 border-blue-300/50 rounded-full px-3 py-2 flex items-center gap-2 shadow-lg">
                    <Users size={16} className="text-white" />
                    <span className="text-white text-sm font-bold">{lot.bidCount} interested</span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{lot.crop.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin size={14} />
                      {lot.location}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantity</span>
                    <span className="text-lg font-bold" style={{ color: '#1a1a1a' }}>
                      {lot.quantity}
                    </span>
                  </div>

                  {/* Base Price - Highlighted */}
                  <div className="backdrop-blur-sm bg-gradient-to-r from-[#2E7D32]/20 via-[#388E3C]/20 to-[#2E7D32]/20 rounded-2xl p-4 border-2 border-[#2E7D32]/30 shadow-lg">
                    <div className="text-xs text-gray-600 mb-1">Base Price</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                      {lot.basePrice}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedLot(lot.id);
                        setShowBids(true);
                      }}
                      className="px-4 py-3 backdrop-blur-md bg-blue-500/10 border-2 border-blue-500 text-blue-700 rounded-xl font-semibold hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      View Bids
                    </button>
                    <button
                      onClick={() => navigate('/trades')}
                      className="px-4 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105"
                    >
                      Accept Offer
                    </button>
                  </div>
                  <button className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-[#2E7D32] hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Negotiate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Bids Modal */}
      {showBids && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-2xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-3xl border-2 border-white/50 transform transition-all">
            <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] p-6 rounded-t-3xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users size={28} />
                  Active Bids - Lot #{selectedLot}
                </h2>
                <p className="text-white/90 text-sm mt-1">{bids.length} buyers interested</p>
              </div>
              <button
                onClick={() => setShowBids(false)}
                className="p-2 backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="backdrop-blur-sm bg-white/90 rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:shadow-[#2E7D32]/20 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#388E3C] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {bid.buyer.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                          {bid.buyer}
                          {bid.verified && (
                            <Shield size={16} className="text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(bid.reliability) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}
                            />
                          ))}
                          <span className="text-sm ml-1" style={{ color: '#666' }}>
                            {bid.reliability}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Bid Price</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                        {bid.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-[#2E7D32] hover:bg-gray-50 transition-all transform hover:scale-105">
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowBids(false);
                        navigate('/trades');
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      Accept Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
