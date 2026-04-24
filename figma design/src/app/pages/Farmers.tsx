import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, X, MapPin, TrendingUp, Wheat, DollarSign, ArrowRight, User } from 'lucide-react';

interface Farmer {
  id: number;
  name: string;
  landSize: string;
  crops: string[];
  totalContribution: string;
  earnings: string;
  location: string;
  phone: string;
  activeCrops: number;
}

export default function Farmers() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const farmers: Farmer[] = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      landSize: '5 acres',
      crops: ['Wheat', 'Rice'],
      totalContribution: '250 qtl',
      earnings: '₹3.2L',
      location: 'Punjab',
      phone: '+91 98765 43210',
      activeCrops: 2,
    },
    {
      id: 2,
      name: 'Sunita Devi',
      landSize: '3 acres',
      crops: ['Rice', 'Mustard'],
      totalContribution: '180 qtl',
      earnings: '₹2.8L',
      location: 'Haryana',
      phone: '+91 98765 43211',
      activeCrops: 2,
    },
    {
      id: 3,
      name: 'Vijay Singh',
      landSize: '7 acres',
      crops: ['Wheat', 'Chickpea', 'Mustard'],
      totalContribution: '420 qtl',
      earnings: '₹5.6L',
      location: 'Madhya Pradesh',
      phone: '+91 98765 43212',
      activeCrops: 3,
    },
    {
      id: 4,
      name: 'Lakshmi Patel',
      landSize: '4 acres',
      crops: ['Rice'],
      totalContribution: '200 qtl',
      earnings: '₹2.9L',
      location: 'Gujarat',
      phone: '+91 98765 43213',
      activeCrops: 1,
    },
    {
      id: 5,
      name: 'Mohan Reddy',
      landSize: '6 acres',
      crops: ['Wheat', 'Rice'],
      totalContribution: '350 qtl',
      earnings: '₹4.5L',
      location: 'Telangana',
      phone: '+91 98765 43214',
      activeCrops: 2,
    },
  ];

  const handleRowClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setShowProfile(true);
  };

  return (
    <div className="space-y-6 relative">
      {/* Parallax Background */}
      <div
        className="fixed top-0 left-0 right-0 h-[400px] -z-10 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1707721690626-10e5f0366bcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwaW5kaWElMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzcwNDM2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
            Farmers
          </h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>
            Manage your farmer network and member information
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          style={{ backgroundColor: '#2E7D32' }}
        >
          <Plus size={20} />
          Add Farmer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-md bg-white/80 rounded-xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <User size={24} style={{ color: '#2E7D32' }} />
            <TrendingUp size={18} style={{ color: '#2E7D32' }} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
            {farmers.length}
          </div>
          <div className="text-sm" style={{ color: '#666' }}>
            Total Farmers
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/80 rounded-xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <Wheat size={24} style={{ color: '#F57C00' }} />
            <TrendingUp size={18} style={{ color: '#2E7D32' }} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
            1,400 qtl
          </div>
          <div className="text-sm" style={{ color: '#666' }}>
            Total Contribution
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/80 rounded-xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} style={{ color: '#388E3C' }} />
            <TrendingUp size={18} style={{ color: '#2E7D32' }} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
            ₹19.0L
          </div>
          <div className="text-sm" style={{ color: '#666' }}>
            Total Earnings
          </div>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#2E7D32]/10 to-[#388E3C]/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Land Size
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Crops
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Contribution
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {farmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  onClick={() => handleRowClick(farmer)}
                  className="hover:bg-[#2E7D32]/5 cursor-pointer transition-all transform hover:scale-[1.01]"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#388E3C] text-white font-semibold shadow-md">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: '#1a1a1a' }}>
                          {farmer.name}
                        </div>
                        <div className="text-xs flex items-center gap-1" style={{ color: '#666' }}>
                          <MapPin size={12} />
                          {farmer.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium" style={{ color: '#1a1a1a' }}>
                      {farmer.landSize}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {farmer.crops.map((crop, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#2E7D32]/20 to-[#388E3C]/20"
                          style={{ color: '#2E7D32' }}
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                      {farmer.totalContribution}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold" style={{ color: '#2E7D32' }}>
                      {farmer.earnings}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                Add New Farmer
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
                  Farmer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter farmer name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
                  Land Size (acres)
                </label>
                <input
                  type="number"
                  placeholder="Enter land size"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Village, District, State"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: '#1a1a1a' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  // Add farmer logic
                }}
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ backgroundColor: '#2E7D32' }}
              >
                Add Farmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Farmer Profile Side Panel */}
      {showProfile && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto transform transition-all">
            {/* Profile Header with Parallax */}
            <div
              className="relative h-48 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] overflow-hidden"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1626349351768-94a510988af3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGNyb3AlMjBmaWVsZHxlbnwxfHx8fDE3NzcwNDM2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/80 to-[#388E3C]/80" />
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
              <div className="absolute bottom-6 left-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl font-bold mb-3" style={{ color: '#2E7D32' }}>
                  {selectedFarmer.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedFarmer.name}
                </h2>
                <p className="text-white/90 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {selectedFarmer.location}
                </p>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-[#2E7D32]/10 to-[#388E3C]/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#2E7D32' }}>
                    {selectedFarmer.totalContribution}
                  </div>
                  <div className="text-xs" style={{ color: '#666' }}>
                    Total Contribution
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#388E3C]/10 to-[#2E7D32]/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#388E3C' }}>
                    {selectedFarmer.earnings}
                  </div>
                  <div className="text-xs" style={{ color: '#666' }}>
                    Total Earnings
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#F57C00]/10 to-[#FF9800]/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#F57C00' }}>
                    {selectedFarmer.activeCrops}
                  </div>
                  <div className="text-xs" style={{ color: '#666' }}>
                    Active Crops
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#666' }}>
                    Land Size
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                    {selectedFarmer.landSize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#666' }}>
                    Phone
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                    {selectedFarmer.phone}
                  </span>
                </div>
                <div>
                  <span className="text-sm block mb-2" style={{ color: '#666' }}>
                    Crops
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedFarmer.crops.map((crop, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-white shadow-sm"
                        style={{ color: '#2E7D32' }}
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate('/procurement');
                  }}
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#2E7D32' }}
                >
                  Add Procurement
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate('/procurement');
                  }}
                  className="w-full py-3 border-2 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  style={{ borderColor: '#2E7D32', color: '#2E7D32' }}
                >
                  View Ledger
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
