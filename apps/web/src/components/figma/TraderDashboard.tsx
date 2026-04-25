'use client';
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, TrendingUp, Package, ShoppingCart, LayoutDashboard, LogOut, FileText, BarChart3 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import MandiPrices from './MandiPrices';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-orders' | 'mandi-prices'>('marketplace');
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'mandi-prices' || tab === 'my-orders' || tab === 'marketplace') {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const dummyOrders = [
    { id: 1, crop: 'Organic Tomatoes', quantity: '500 kg', dealValue: '₹12,500', status: 'In Delivery', date: '2023-10-25', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
    { id: 2, crop: 'Premium Wheat', quantity: '2,000 kg', dealValue: '₹49,000', status: 'Completed', date: '2023-10-22', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400' },
    { id: 3, crop: 'Red Onions', quantity: '800 kg', dealValue: '₹15,120', status: 'Agreed', date: '2023-10-24', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400' },
    { id: 4, crop: 'Golden Maize', quantity: '1,500 kg', dealValue: '₹31,500', status: 'Completed', date: '2023-10-20', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400' },
    { id: 5, crop: 'Basmati Rice', quantity: '3,000 kg', dealValue: '₹1,14,000', status: 'In Delivery', date: '2023-10-26', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 6, crop: 'Desi Chickpea', quantity: '400 kg', dealValue: '₹16,400', status: 'Completed', date: '2023-10-18', image: 'https://images.unsplash.com/photo-1626349351768-94a510988af3?w=400' },
    { id: 7, crop: 'Mustard Seeds', quantity: '600 kg', dealValue: '₹28,800', status: 'Agreed', date: '2023-10-27', image: 'https://images.unsplash.com/photo-1715289718087-66a61b7b4c0d?w=400' },
    { id: 8, crop: 'Sugarcane', quantity: '5,000 kg', dealValue: '₹40,000', status: 'Completed', date: '2023-10-15', image: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=400' },
  ];
  const displayedOrders = showAllOrders ? dummyOrders : dummyOrders.slice(0, 4);

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

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col lg:flex-row">
      {/* Sidebar for Trader Dashboard */}
      <aside className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#388E3C]">
              <span className="text-white font-bold">AT</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Trader Portal</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'marketplace' ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Marketplace</span>
          </button>
          <button onClick={() => setActiveTab('my-orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'my-orders' ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FileText size={20} />
            <span className="font-medium">My Orders</span>
          </button>
          <button onClick={() => setActiveTab('mandi-prices')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'mandi-prices' ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
            <BarChart3 size={20} />
            <span className="font-medium">Mandi Prices</span>
          </button>

        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:w-auto h-screen overflow-y-auto">
        {/* Header (Mobile) */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <SlidersHorizontal size={24} />
          </button>
          <span className="font-bold text-lg text-gray-900">AgroTrade</span>
        </div>

        {activeTab === 'marketplace' && (
          <>
            {/* Hero Header */}
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1548&auto=format&fit=crop)`,
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
                  className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-md border border-white/60 rounded-xl focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all shadow-lg text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 mb-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="group backdrop-blur-lg bg-white/90 rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
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
            <div className="group backdrop-blur-lg bg-white/90 rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
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
            <div className="group backdrop-blur-lg bg-white/90 rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
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

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filter by Grade:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGrade('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedGrade === 'all'
                      ? 'bg-[#2E7D32] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedGrade('Grade A+')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedGrade === 'Grade A+'
                      ? 'bg-[#2E7D32] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Grade A+
                </button>
                <button
                  onClick={() => setSelectedGrade('Grade A')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedGrade === 'Grade A'
                      ? 'bg-[#2E7D32] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Grade A
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Showing {filteredListings.length} listings
            </div>
          </div>

          {/* Crop Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {listing.grade}
                  </div>
                  {listing.verified && (
                    <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {listing.crop}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        {listing.farmer} • <MapPin size={12} className="inline" /> {listing.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Quantity</p>
                      <p className="text-sm font-semibold text-gray-900">{listing.quantity}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <p className="text-xs text-emerald-600 uppercase font-bold mb-1">Price per Kg</p>
                      <p className="text-lg font-bold text-emerald-700">{listing.pricePerKg}</p>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-bold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Place Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg">
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
          </>
        )}
        {activeTab === 'my-orders' && (
          <div className="w-full bg-[#F5F7FA] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{showAllOrders ? 'All Activity' : 'Recent Trades'}</h1>
                  <p className="text-gray-600">Track and manage your produce procurement.</p>
                </div>
                <button 
                  onClick={() => setShowAllOrders(!showAllOrders)} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#2E7D32] rounded-xl font-semibold shadow-sm hover:shadow-md hover:border-[#2E7D32]/50 transition-all"
                >
                  {showAllOrders ? 'Back to Recent' : 'See All Activity'} <TrendingUp size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {displayedOrders.map((order) => (
                  <div key={order.id} className="group backdrop-blur-md bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                      <img src={order.image} alt={order.crop} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 w-full">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Crop</p>
                        <p className="font-bold text-gray-900 text-lg">{order.crop}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                        <p className="font-bold text-gray-800 text-lg">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Deal Value</p>
                        <p className="font-bold text-gray-900 text-lg">{order.dealValue}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                          order.status === 'In Delivery' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]' :
                          order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
                          'bg-amber-50 text-amber-700 border border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'In Delivery' ? 'bg-blue-600 animate-pulse' : order.status === 'Completed' ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-gray-50 border border-gray-200 text-[#2E7D32] rounded-xl font-bold hover:bg-[#2E7D32] hover:text-white hover:shadow-lg hover:shadow-[#2E7D32]/30 transition-all whitespace-nowrap">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'mandi-prices' && (
          <div className="w-full bg-[#F5F7FA] min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
            <MandiPrices />
          </div>
        )}
      </div>
    </div>
  );
}
