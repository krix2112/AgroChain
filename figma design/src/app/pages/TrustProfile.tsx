import { MapPin, Users, Award, Edit2, ExternalLink, Star, TrendingUp, Package, Target } from 'lucide-react';

interface Review {
  id: number;
  buyer: string;
  rating: number;
  feedback: string;
  date: string;
}

export default function TrustProfile() {
  const profile = {
    name: 'Punjab Farmers Producer Organization',
    location: 'Ludhiana, Punjab',
    members: 245,
    established: '2018',
    certifications: ['Organic Certified', 'FSSAI Licensed', 'FPO Registered', 'Quality Assured'],
  };

  const stats = {
    totalVolume: '12,500 qtl',
    successRate: '98.5%',
    avgPriceAdvantage: '+₹180/qtl',
  };

  const reviews: Review[] = [
    {
      id: 1,
      buyer: 'Agro Enterprises Ltd',
      rating: 5,
      feedback: 'Excellent quality wheat. Packaging was perfect and delivery was on time.',
      date: '2026-04-15',
    },
    {
      id: 2,
      buyer: 'Green Valley Traders',
      rating: 4.5,
      feedback: 'Good experience overall. Quality met expectations.',
      date: '2026-04-10',
    },
    {
      id: 3,
      buyer: 'National Grain Co.',
      rating: 5,
      feedback: 'Reliable FPO. Would recommend for consistent supply.',
      date: '2026-04-05',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
          Trust Profile
        </h1>
        <p className="text-sm" style={{ color: '#666' }}>
          Your reputation and verification status
        </p>
      </div>

      {/* Profile Card - Centered, Premium */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 shadow-xl">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2E7D32] to-[#388E3C] flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
              {profile.name.charAt(0)}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                {profile.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} className="text-[#2E7D32]" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={18} className="text-[#2E7D32]" />
                  <span>{profile.members} Members</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Award size={18} className="text-[#2E7D32]" />
                  <span>Est. {profile.established}</span>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#2E7D32] border border-green-300 shadow-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="px-6 py-3 border-2 border-[#2E7D32] text-[#2E7D32] rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  <ExternalLink size={18} />
                  View Public Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
              <Package size={24} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">Total Volume Traded</div>
          </div>
          <div className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>
            {stats.totalVolume}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
              <Target size={24} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">Success Rate</div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats.successRate}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">Avg Price Advantage</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
            {stats.avgPriceAdvantage}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
          Buyer Reviews
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-md hover:bg-white transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg mb-1" style={{ color: '#1a1a1a' }}>
                      {review.buyer}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(review.rating)
                              ? 'fill-amber-500 text-amber-500'
                              : i < review.rating
                              ? 'fill-amber-300 text-amber-300'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="text-sm ml-2 text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <p className="text-gray-700">{review.feedback}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Star size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No reviews yet</h3>
            <p className="text-gray-600">
              Complete your first trade to receive buyer reviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
