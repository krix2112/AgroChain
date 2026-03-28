import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
    id: string;
    cropName: string;
    emoji: string;
    farmerName: string;
    farmerLocation: string;
    farmerRating: number;
    farmerTrades: number;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    quality: 'Premium' | 'Medium' | 'Standard';
    moisture: string;
    foreignMatter: string;
    dispatchDays: number;
    postedAt: string;
    image: string;
    gradient: string;
    verified: boolean;
    description: string;
}

// ─── Hardcoded listings ───────────────────────────────────────────────────────

const ALL_LISTINGS: Listing[] = [
    {
        id: 'L001',
        cropName: 'Wheat',
        emoji: '🌾',
        farmerName: 'Ramesh Kumar',
        farmerLocation: 'Mathura, UP',
        farmerRating: 4.8,
        farmerTrades: 24,
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 28,
        quality: 'Premium',
        moisture: '10–12%',
        foreignMatter: '< 1%',
        dispatchDays: 2,
        postedAt: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
        gradient: 'from-[#1B4332]/80 to-[#1B4332]/20',
        verified: true,
        description: 'Well-cleaned wheat with uniform grain size. No pesticides used. Direct from farm.',
    },
    {
        id: 'L002',
        cropName: 'Tomato',
        emoji: '🍅',
        farmerName: 'Suresh Patel',
        farmerLocation: 'Nashik, Maharashtra',
        farmerRating: 4.6,
        farmerTrades: 18,
        quantity: 2000,
        unit: 'kg',
        pricePerUnit: 22,
        quality: 'Premium',
        moisture: 'Fresh',
        foreignMatter: 'None',
        dispatchDays: 1,
        postedAt: '4 hours ago',
        image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80',
        gradient: 'from-[#7F1D1D]/80 to-[#7F1D1D]/20',
        verified: true,
        description: 'Grade A tomatoes, uniform red color, firm texture. Packed and ready for transport.',
    },
    {
        id: 'L003',
        cropName: 'Onion',
        emoji: '🧅',
        farmerName: 'Mohan Singh',
        farmerLocation: 'Lasalgaon, Maharashtra',
        farmerRating: 4.5,
        farmerTrades: 31,
        quantity: 1000,
        unit: 'kg',
        pricePerUnit: 18,
        quality: 'Medium',
        moisture: '12–14%',
        foreignMatter: '< 2%',
        dispatchDays: 3,
        postedAt: '6 hours ago',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
        gradient: 'from-[#4C1D95]/80 to-[#4C1D95]/20',
        verified: true,
        description: 'Red onions, medium to large size. Stored in dry conditions. Bulk quantity available.',
    },
    {
        id: 'L004',
        cropName: 'Rice',
        emoji: '🌾',
        farmerName: 'Vijay Reddy',
        farmerLocation: 'Warangal, Telangana',
        farmerRating: 4.9,
        farmerTrades: 42,
        quantity: 800,
        unit: 'kg',
        pricePerUnit: 55,
        quality: 'Premium',
        moisture: '< 10%',
        foreignMatter: '< 1%',
        dispatchDays: 2,
        postedAt: '1 day ago',
        image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80',
        gradient: 'from-[#713F12]/80 to-[#713F12]/20',
        verified: true,
        description: 'Sona Masuri variety. Machine cleaned, no broken grains. Excellent taste and aroma.',
    },
    {
        id: 'L005',
        cropName: 'Potato',
        emoji: '🥔',
        farmerName: 'Raju Verma',
        farmerLocation: 'Agra, UP',
        farmerRating: 4.3,
        farmerTrades: 15,
        quantity: 3000,
        unit: 'kg',
        pricePerUnit: 15,
        quality: 'Standard',
        moisture: '12–14%',
        foreignMatter: '1–2%',
        dispatchDays: 4,
        postedAt: '1 day ago',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
        gradient: 'from-[#78350F]/80 to-[#78350F]/20',
        verified: false,
        description: 'Kufri Jyoti variety. Large size, suitable for chips and processing industry.',
    },
    {
        id: 'L006',
        cropName: 'Corn',
        emoji: '🌽',
        farmerName: 'Dilip Sharma',
        farmerLocation: 'Rajkot, Gujarat',
        farmerRating: 4.7,
        farmerTrades: 28,
        quantity: 600,
        unit: 'kg',
        pricePerUnit: 20,
        quality: 'Medium',
        moisture: '10–12%',
        foreignMatter: '< 1%',
        dispatchDays: 2,
        postedAt: '2 days ago',
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
        gradient: 'from-[#7C2D12]/80 to-[#7C2D12]/20',
        verified: true,
        description: 'Sweet corn, freshly harvested. Good for retail and wholesale markets.',
    },
    {
        id: 'L007',
        cropName: 'Chilli',
        emoji: '🌶️',
        farmerName: 'Narasimha Rao',
        farmerLocation: 'Guntur, Andhra Pradesh',
        farmerRating: 4.9,
        farmerTrades: 56,
        quantity: 200,
        unit: 'kg',
        pricePerUnit: 120,
        quality: 'Premium',
        moisture: '< 10%',
        foreignMatter: '< 1%',
        dispatchDays: 1,
        postedAt: '3 days ago',
        image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=600&q=80',
        gradient: 'from-[#881337]/80 to-[#881337]/20',
        verified: true,
        description: 'Guntur red chilli, high capsaicin content. Dry and well sorted. Export quality.',
    },
    {
        id: 'L008',
        cropName: 'Wheat',
        emoji: '🌾',
        farmerName: 'Harpal Singh',
        farmerLocation: 'Ludhiana, Punjab',
        farmerRating: 4.7,
        farmerTrades: 33,
        quantity: 1200,
        unit: 'kg',
        pricePerUnit: 30,
        quality: 'Premium',
        moisture: '10–12%',
        foreignMatter: '< 1%',
        dispatchDays: 1,
        postedAt: '3 days ago',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
        gradient: 'from-[#1B4332]/80 to-[#1B4332]/20',
        verified: true,
        description: 'HD 2967 variety wheat. Machine harvested, cleaned and stored. Ready for flour mills.',
    },
];

const QUALITY_COLOR: Record<string, string> = {
    Premium: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Standard: 'bg-gray-100 text-gray-600',
};

const CROPS_FILTER = ['All', 'Wheat', 'Tomato', 'Onion', 'Rice', 'Potato', 'Corn', 'Chilli'];
const SORT_OPTIONS = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Quantity'];

// ─── Component ────────────────────────────────────────────────────────────────

interface BrowseListingsProps {
    onBack: () => void;
    onStartTrade: (farmer: string, crop: string, price: number) => void;
    onLogout: () => void;
}

export function BrowseListings({ onBack, onStartTrade, onLogout }: BrowseListingsProps) {
    const [cropFilter, setCropFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [contactShown, setContactShown] = useState<string | null>(null);

    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('agrochain_user') : null;
    const user = userRaw ? JSON.parse(userRaw) : null;

    // ── Filter + sort ────────────────────────────────────────────────────────

    let filtered = ALL_LISTINGS.filter(l => {
        const matchesCrop = cropFilter === 'All' || l.cropName === cropFilter;
        const matchesSearch = l.cropName.toLowerCase().includes(searchQuery.toLowerCase())
            || l.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
            || l.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCrop && matchesSearch;
    });

    filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'Price: High to Low') return b.pricePerUnit - a.pricePerUnit;
        if (sortBy === 'Quantity') return b.quantity - a.quantity;
        return 0; // Latest = default order
    });

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#F0FFF4]">

            {/* ── Navbar ─────────────────────────────────────────────────────── */}
            <nav className="bg-[#1B4332] px-6 md:px-12 h-16 flex items-center justify-between sticky top-0 z-50 shadow-lg">
                <button onClick={onBack} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white text-lg">🌱</div>
                    <span className="text-white font-bold text-lg tracking-tight">AgroChain</span>
                </button>
                <span className="hidden md:block text-white/75 text-sm">
                    🏠 Dashboard &nbsp;/&nbsp;
                    <span className="text-white font-semibold">Browse Listings</span>
                </span>
                <div className="flex items-center gap-3">
                    <span className="hidden md:block text-white/75 text-sm">
                        {user?.name ?? 'Trader'}
                    </span>
                    <button
                        onClick={onLogout}
                        className="text-white/80 border border-white/30 rounded-full px-4 py-1.5 text-sm hover:bg-white/10 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">

                {/* ── Page header ──────────────────────────────────────────────── */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Browse Crop Listings</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filtered.length} listings available · Contact farmers directly to start a trade
                    </p>
                </div>

                {/* ── Search + Sort bar ────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">

                    {/* Search */}
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by crop, farmer, or location..."
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition shadow-sm"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 shadow-sm cursor-pointer"
                    >
                        {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>

                {/* ── Crop filter chips ─────────────────────────────────────────── */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {CROPS_FILTER.map(crop => (
                        <button
                            key={crop}
                            onClick={() => setCropFilter(crop)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${cropFilter === crop
                                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B4332] hover:text-[#1B4332]'
                                }`}
                        >
                            {crop}
                        </button>
                    ))}
                </div>

                {/* ── Listings grid ─────────────────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-dashed border-[#D1FAE5] rounded-2xl p-12 text-center">
                        <div className="text-4xl mb-3">🌱</div>
                        <h3 className="font-semibold text-[#1A1A1A] mb-1">No listings found</h3>
                        <p className="text-gray-400 text-sm">Try a different crop or search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                onView={() => setSelectedListing(listing)}
                                onContact={() => setContactShown(listing.id)}
                                contactShown={contactShown === listing.id}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Detail Modal ─────────────────────────────────────────────────── */}
            {selectedListing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedListing(null)}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                        style={{ animation: 'modalIn 0.25s ease-out' }}
                    >
                        {/* Hero image */}
                        <div
                            className="relative h-44 bg-cover bg-center"
                            style={{ backgroundImage: `url('${selectedListing.image}')` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-t ${selectedListing.gradient}`} />
                            <div className="absolute bottom-4 left-5 flex items-end gap-3">
                                <span className="text-4xl drop-shadow-lg">{selectedListing.emoji}</span>
                                <div>
                                    <div className="text-white font-bold text-2xl drop-shadow">{selectedListing.cropName}</div>
                                    <div className="text-white/75 text-sm">{selectedListing.farmerLocation}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedListing(null)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition"
                            >×</button>
                        </div>

                        <div className="p-6">
                            {/* Farmer info */}
                            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                                <div className="w-12 h-12 bg-[#F0FFF4] rounded-full flex items-center justify-center text-2xl border-2 border-[#D1FAE5]">
                                    👨‍🌾
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1A1A1A]">{selectedListing.farmerName}</span>
                                        {selectedListing.verified && (
                                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">✓ Verified</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-0.5">
                                        📍 {selectedListing.farmerLocation} · ⭐ {selectedListing.farmerRating} · {selectedListing.farmerTrades} trades
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${QUALITY_COLOR[selectedListing.quality]}`}>
                                    {selectedListing.quality}
                                </span>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <DetailBox label="Quantity" value={`${selectedListing.quantity} ${selectedListing.unit}`} />
                                <DetailBox label="Price / kg" value={`₹${selectedListing.pricePerUnit}`} green />
                                <DetailBox label="Total Value" value={`₹${(selectedListing.quantity * selectedListing.pricePerUnit).toLocaleString('en-IN')}`} green large />
                                <DetailBox label="Dispatch In" value={`${selectedListing.dispatchDays} day${selectedListing.dispatchDays > 1 ? 's' : ''}`} />
                                <DetailBox label="Moisture" value={selectedListing.moisture} />
                                <DetailBox label="Foreign Matter" value={selectedListing.foreignMatter} />
                            </div>

                            {/* Description */}
                            <div className="bg-[#F0FFF4] border border-[#D1FAE5] rounded-xl p-4 mb-5">
                                <div className="text-xs font-semibold text-gray-400 mb-1">Farmer's Note</div>
                                <p className="text-sm text-gray-600 italic">"{selectedListing.description}"</p>
                            </div>

                            {/* CTA buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedListing(null);
                                        onStartTrade(selectedListing.farmerName, selectedListing.cropName, selectedListing.pricePerUnit);
                                    }}
                                    className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md"
                                >
                                    🤝 Start Trade
                                </button>
                                <button
                                    onClick={() => setContactShown(selectedListing.id)}
                                    className="px-5 border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#F0FFF4] font-bold py-3.5 rounded-xl text-sm transition"
                                >
                                    📞 Contact
                                </button>
                            </div>

                            {/* Contact reveal */}
                            {contactShown === selectedListing.id && (
                                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-gray-400">Farmer's Number</div>
                                        <div className="font-bold text-[#1B4332] text-lg tracking-wider">+91 98765 43210</div>
                                    </div>
                                    <span className="text-2xl">📱</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ListingCard({
    listing, onView, onContact, contactShown,
}: {
    listing: Listing;
    onView: () => void;
    onContact: () => void;
    contactShown: boolean;
}) {
    const totalValue = (listing.quantity * listing.pricePerUnit).toLocaleString('en-IN');

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#D1FAE5] transition-all duration-300 group">

            {/* Card hero image */}
            <div className="relative h-36 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${listing.image}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${listing.gradient}`} />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {listing.verified && (
                        <span className="bg-white/90 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            ✓ Verified
                        </span>
                    )}
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${QUALITY_COLOR[listing.quality]}`}>
                        {listing.quality}
                    </span>
                </div>

                {/* Posted time */}
                <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    {listing.postedAt}
                </div>

                {/* Crop name on image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="text-2xl drop-shadow-lg">{listing.emoji}</span>
                    <span className="text-white font-bold text-lg drop-shadow-lg">{listing.cropName}</span>
                </div>
            </div>

            {/* Card body */}
            <div className="p-4">

                {/* Farmer info */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-[#F0FFF4] rounded-full flex items-center justify-center text-sm border border-[#D1FAE5]">
                        👨‍🌾
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1A1A1A] text-sm truncate">{listing.farmerName}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                            📍 {listing.farmerLocation} · ⭐ {listing.farmerRating}
                        </div>
                    </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-[#F0FFF4] rounded-xl p-2 text-center">
                        <div className="text-xs text-gray-400">Qty</div>
                        <div className="font-bold text-[#1A1A1A] text-sm">{listing.quantity}{listing.unit}</div>
                    </div>
                    <div className="bg-[#F0FFF4] rounded-xl p-2 text-center">
                        <div className="text-xs text-gray-400">Price</div>
                        <div className="font-bold text-[#1B4332] text-sm">₹{listing.pricePerUnit}/kg</div>
                    </div>
                    <div className="bg-[#F0FFF4] rounded-xl p-2 text-center">
                        <div className="text-xs text-gray-400">Ships in</div>
                        <div className="font-bold text-[#1A1A1A] text-sm">{listing.dispatchDays}d</div>
                    </div>
                </div>

                {/* Total value */}
                <div className="flex items-center justify-between mb-3 bg-green-50 rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-500">Total Value</span>
                    <span className="font-bold text-[#1B4332]">₹{totalValue}</span>
                </div>

                {/* Contact reveal */}
                {contactShown && (
                    <div className="mb-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-400">Contact Farmer</div>
                            <div className="font-bold text-[#1B4332] text-sm">+91 98765 43210</div>
                        </div>
                        <span className="text-lg">📱</span>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onView}
                        className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold py-2.5 rounded-xl text-xs transition active:scale-95"
                    >
                        View Details
                    </button>
                    <button
                        onClick={onContact}
                        className="px-4 border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#F0FFF4] font-semibold py-2.5 rounded-xl text-xs transition"
                    >
                        📞 Contact
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailBox({
    label, value, green, large,
}: {
    label: string; value: string; green?: boolean; large?: boolean;
}) {
    return (
        <div className="bg-[#F0FFF4] rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-0.5">{label}</div>
            <div className={`font-bold ${large ? 'text-base' : 'text-sm'} ${green ? 'text-[#1B4332]' : 'text-[#1A1A1A]'}`}>
                {value}
            </div>
        </div>
    );
}
