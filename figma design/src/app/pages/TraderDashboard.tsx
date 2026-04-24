import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import heroImage from '../../imports/image-13.png';

interface CropListing {
  id: number;
  crop: string;
  farmer: string;
  location: string;
  grade: string;
  quantity: string;
  pricePerKg: string;
  image: string;
  verified: boolean;
}

export default function TraderDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const cropListings: CropListing[] = [
    {
      id: 1,
      crop: 'Wheat',
      farmer: 'Rajesh Kumar',
      location: 'Punjab',
      grade: 'Grade A',
      quantity: '8,000 Kg',
      pricePerKg: '₹24.50',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      verified: true,
    },
    {
      id: 2,
      crop: 'Tomatoes',
      farmer: 'Amit Patel',
      location: 'Gujarat',
      grade: 'Grade A+',
      quantity: '2,500 Kg',
      pricePerKg: '₹32.00',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      verified: true,
    },
    {
      id: 3,
      crop: 'Onion',
      farmer: 'Suresh Rao',
      location: 'Solapur',
      grade: 'Grade A',
      quantity: '12,000 Kg',
      pricePerKg: '₹18.90',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
      verified: true,
    },
    {
      id: 4,
      crop: 'Maize',
      farmer: 'Kiran Devi',
      location: 'Rohtak',
      grade: 'Grade A',
      quantity: '4,500 Kg',
      pricePerKg: '₹21.00',
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400',
      verified: true,
    },
    {
      id: 5,
      crop: 'Rice',
      farmer: 'Arun Singh',
      location: 'Haryana',
      grade: 'Grade A+',
      quantity: '15,000 Kg',
      pricePerKg: '₹38.00',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      verified: true,
    },
    {
      id: 6,
      crop: 'Chickpea',
      farmer: 'Meena Sharma',
      location: 'Rajasthan',
      grade: 'Grade A',
      quantity: '6,200 Kg',
      pricePerKg: '₹41.00',
      image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=400',
      verified: true,
    },
  ];

  const filteredListings = cropListings.filter((listing) => {
    const matchesSearch = listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || listing.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero Header */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/90 via-[#2E7D32]/70 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            Marketplace
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Discover verified produce from trusted farmers
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for crops, farmers, or locations..."
                className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-md border border-white/60 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-8 -mt-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="group backdrop-blur-lg bg-white/80 rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/10 rounded-xl blur-md group-hover:blur-lg transition-all" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:border-green-500/40 group-hover:scale-110 transition-all">
                  <Package size={24} className="text-green-600" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredListings.length}</div>
                <div className="text-xs text-gray-600">Available Listings</div>
              </div>
            </div>
          </div>
          <div className="group backdrop-blur-lg bg-white/80 rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-md group-hover:blur-lg transition-all" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 group-hover:scale-110 transition-all">
                  <Star size={24} className="text-blue-600" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-600">Verified Farmers</div>
              </div>
            </div>
          </div>
          <div className="group backdrop-blur-lg bg-white/80 rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/10 rounded-xl blur-md group-hover:blur-lg transition-all" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:border-amber-500/40 group-hover:scale-110 transition-all">
                  <TrendingUp size={24} className="text-amber-600" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹18-₹41</div>
                <div className="text-xs text-gray-600">Price Range/Kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filter by Grade:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedGrade === 'all'
                    ? 'bg-[#2E7D32] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedGrade('Grade A+')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedGrade === 'Grade A+'
                    ? 'bg-[#2E7D32] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Grade A+
              </button>
              <button
                onClick={() => setSelectedGrade('Grade A')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedGrade === 'Grade A'
                    ? 'bg-[#2E7D32] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Grade A
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredListings.length} listings
          </div>
        </div>

        {/* Crop Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="group backdrop-blur-lg bg-white/90 rounded-2xl shadow-lg border border-white/60 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              {/* Crop Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.crop}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  {listing.grade}
                </div>
                {listing.verified && (
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {listing.crop}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      {listing.farmer} • <MapPin size={12} className="inline" /> {listing.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Quantity</p>
                    <p className="text-sm font-semibold text-gray-900">{listing.quantity}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Price per Kg</p>
                    <p className="text-lg font-bold text-emerald-700">{listing.pricePerKg}</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  Place Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-lg" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto border border-gray-200">
                <Package size={40} className="text-gray-400" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
