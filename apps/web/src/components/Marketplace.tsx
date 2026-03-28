import {
    Search,
    MapPin,
    ChevronDown,
    TrendingUp,
    TrendingDown,
    Star,
    Wheat,
    ChevronRight,
} from 'lucide-react';

interface MarketplaceProps {
    language: 'en' | 'hi';
}

interface CropPrice {
    name: string;
    nameHindi: string;
    priceRange: string;
    change: 'up' | 'down' | 'neutral';
    changeAmount?: string;
}

interface BuyerOffer {
    name: string;
    location: string;
    distance: string;
    needs: string;
    price: string;
    rating: number;
    reviewCount: number;
    avatarUrl: string;
}

const CROP_PRICES: CropPrice[] = [
    {
        name: 'Wheat',
        nameHindi: 'गेहूँ',
        priceRange: '₹2,300–2,450',
        change: 'up',
        changeAmount: '₹20',
    },
    {
        name: 'Rice',
        nameHindi: 'सारल',
        priceRange: '₹3,100–3,280',
        change: 'neutral',
    },
    {
        name: 'Soybean',
        nameHindi: 'सोयाबीन',
        priceRange: '₹4,800–4,900',
        change: 'down',
        changeAmount: '₹50',
    },
    {
        name: 'Onions',
        nameHindi: 'प्याज',
        priceRange: '₹600–800',
        change: 'neutral',
    },
];

const BUYER_OFFERS: BuyerOffer[] = [
    {
        name: 'Raj Traders',
        location: 'Delhi',
        distance: '12 km',
        needs: '50 quintals',
        price: '₹2,400',
        rating: 4.5,
        reviewCount: 133,
        avatarUrl:
            'https://images.unsplash.com/photo-1762885590877-0829975f2cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBidXNpbmVzc21hbiUyMHRyYWRlciUyMG1hbGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1MDM4NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
        name: 'Vinay Grains',
        location: 'Gurgaon',
        distance: '30 km',
        needs: '80 quintals',
        price: '₹2,350',
        rating: 4.5,
        reviewCount: 92,
        avatarUrl:
            'https://images.unsplash.com/photo-1739249432260-0bcfdc382e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBidXNpbmVzcyUyMGZvcm1hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NDUwMzg2MXww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
        name: 'Patel Agro Traders',
        location: 'Faridabad',
        distance: '18 km',
        needs: '100 quintals',
        price: '₹2,300',
        rating: 4.0,
        reviewCount: 110,
        avatarUrl:
            'https://images.unsplash.com/photo-1671450960874-0903baf942c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBlbnRyZXByZW5ldXIlMjBtYWxlJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0NTAzODYxfDA&ixlib=rb-4.1.0&q=80&w=400',
    },
];

function MiniStarRating({ rating, count }: { rating: number; count: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={i}
                        className="w-3 h-3"
                        style={{ fill: '#F5A623', color: '#F5A623' }}
                    />
                ))}
                {hasHalfStar && (
                    <div className="relative w-3 h-3">
                        <Star
                            className="absolute w-3 h-3"
                            style={{ fill: 'none', color: '#F5A623', stroke: '#F5A623' }}
                        />
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: '50%' }}
                        >
                            <Star
                                className="w-3 h-3"
                                style={{ fill: '#F5A623', color: '#F5A623' }}
                            />
                        </div>
                    </div>
                )}
                {Array.from({ length: 5 - Math.ceil(rating) }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className="w-3 h-3"
                        style={{ fill: 'none', color: '#DDD', stroke: '#DDD' }}
                    />
                ))}
            </div>
            <span style={{ fontSize: 11, color: '#888', marginLeft: 2 }}>
                ({count})
            </span>
        </div>
    );
}

export function Marketplace({ language }: MarketplaceProps) {
    const text = {
        title: language === 'en' ? 'Marketplace' : 'बाज़ार',
        subtitle:
            language === 'en'
                ? 'Stay updated with mandi prices and latest offers'
                : 'मंडी कीमतों और नवीनतम ऑफ़र के साथ अपडेट रहें',
        mandiPrices: language === 'en' ? 'Mandi Prices' : 'मंडी कीमतें',
        updatedDate: language === 'en' ? 'Updated for April 25, 2024' : '25 अप्रैल 2024 के लिए अपडेट किया गया',
        all: language === 'en' ? 'All' : 'सभी',
        wheat: language === 'en' ? 'Wheat' : 'गेहूँ',
        rice: language === 'en' ? 'Rice' : 'चावल',
        pulses: language === 'en' ? 'Pulses' : 'दालें',
        searchPlaceholder: language === 'en' ? 'Search...' : 'खोजें...',
        location: language === 'en' ? 'Mathura, UP, India' : 'मथुरा, उ.प्र., भारत',
        viewAll: language === 'en' ? 'View All' : 'सभी देखें',
        pricesNote:
            language === 'en'
                ? '*Prices from local mandis, updated daily.'
                : '*स्थानीय मंडियों से कीमतें, प्रतिदिन अपडेट की जाती हैं।',
        latestOffers: language === 'en' ? 'Latest Offers' : 'नवीनतम ऑफ़र',
        latestOffersSubtitle:
            language === 'en'
                ? 'See buyers interested in your crop'
                : 'अपनी फसल में रुचि रखने वाले खरीदारों को देखें',
        needs: language === 'en' ? 'Needs' : 'जरूरत',
        view: language === 'en' ? 'View' : 'देखें',
    };

    return (
        <div className="at-page-wrap pt-[80px] pb-10 px-8">
            {/* Page Header */}
            <div className="mb-8 text-center at-page-header">
                <h1
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: 6,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {text.title}
                </h1>
                <p
                    style={{
                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                        fontSize: 15,
                        color: '#555',
                        lineHeight: 1.5,
                    }}
                >
                    {text.subtitle}
                </p>
            </div>

            {/* Main Glass Panel */}
            <div
                className="mx-auto"
                style={{
                    maxWidth: 1100,
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1.5px solid rgba(255,255,255,0.50)',
                    borderRadius: 24,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                    padding: '32px 36px',
                }}
            >
                <div className="flex gap-6">
                    {/* LEFT COLUMN - Mandi Prices */}
                    <div style={{ flex: '0 0 45%' }}>
                        {/* Column Heading */}
                        <div className="mb-4">
                            <h2
                                style={{
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: '#1A1A1A',
                                    marginBottom: 4,
                                }}
                            >
                                {text.mandiPrices}
                            </h2>
                            <p
                                style={{
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    fontSize: 13,
                                    color: '#888',
                                }}
                            >
                                {text.updatedDate}
                            </p>
                        </div>

                        {/* Filter Chips */}
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                style={{
                                    background: '#2D6A2F',
                                    color: 'white',
                                    borderRadius: 20,
                                    padding: '5px 14px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {text.all}
                            </button>
                            <button
                                style={{
                                    background: 'transparent',
                                    color: '#555',
                                    borderRadius: 20,
                                    padding: '5px 14px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    border: '1px solid #CCC',
                                    cursor: 'pointer',
                                }}
                            >
                                {text.wheat}
                            </button>
                            <button
                                style={{
                                    background: 'transparent',
                                    color: '#555',
                                    borderRadius: 20,
                                    padding: '5px 14px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    border: '1px solid #CCC',
                                    cursor: 'pointer',
                                }}
                            >
                                {text.rice}
                            </button>
                            <button
                                className="flex items-center gap-1"
                                style={{
                                    background: 'transparent',
                                    color: '#555',
                                    borderRadius: 20,
                                    padding: '5px 14px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    border: '1px solid #CCC',
                                    cursor: 'pointer',
                                }}
                            >
                                {text.pulses}
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Search + Location Row */}
                        <div className="flex gap-2 mb-5">
                            <div
                                className="flex items-center gap-2 flex-1"
                                style={{
                                    background: 'rgba(255,255,255,0.80)',
                                    border: '1px solid rgba(0,0,0,0.10)',
                                    borderRadius: 10,
                                    padding: '0 12px',
                                    height: 40,
                                }}
                            >
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={text.searchPlaceholder}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: 13,
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        color: '#333',
                                        width: '100%',
                                    }}
                                />
                            </div>
                            <button
                                className="flex items-center gap-2"
                                style={{
                                    background: 'rgba(255,255,255,0.80)',
                                    border: '1px solid rgba(0,0,0,0.10)',
                                    borderRadius: 10,
                                    padding: '0 12px',
                                    height: 40,
                                    fontSize: 13,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    color: '#555',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <MapPin className="w-4 h-4" />
                                {text.location}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Price Rows */}
                        <div className="mb-5">
                            {CROP_PRICES.map((crop, index) => (
                                <div key={crop.name}>
                                    <div
                                        className="flex items-center justify-between"
                                        style={{
                                            height: 52,
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontFamily:
                                                        "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: '#1A1A1A',
                                                }}
                                            >
                                                {crop.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily:
                                                        "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                    fontSize: 13,
                                                    color: '#888',
                                                    marginTop: 2,
                                                }}
                                            >
                                                ({crop.nameHindi})
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                style={{
                                                    fontFamily:
                                                        "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: '#1A1A1A',
                                                }}
                                            >
                                                {crop.priceRange}
                                            </div>
                                            {crop.change !== 'neutral' && crop.changeAmount && (
                                                <div
                                                    className="flex items-center justify-end gap-1 mt-1"
                                                    style={{
                                                        fontFamily:
                                                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                        fontSize: 12,
                                                        color: crop.change === 'up' ? '#2D6A2F' : '#E53935',
                                                    }}
                                                >
                                                    {crop.change === 'up' ? (
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <TrendingDown className="w-3.5 h-3.5" />
                                                    )}
                                                    {crop.changeAmount}
                                                </div>
                                            )}
                                            {crop.change === 'neutral' && (
                                                <div
                                                    className="mt-1"
                                                    style={{
                                                        fontFamily:
                                                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                        fontSize: 12,
                                                        color: '#888',
                                                    }}
                                                >
                                                    —
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {index < CROP_PRICES.length - 1 && (
                                        <div
                                            style={{
                                                height: 1,
                                                background: 'rgba(0,0,0,0.07)',
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="flex justify-center mb-3">
                            <button
                                style={{
                                    background: '#2D6A2F',
                                    color: 'white',
                                    borderRadius: 10,
                                    padding: '10px 32px',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {text.viewAll}
                            </button>
                        </div>

                        {/* Footer Note */}
                        <p
                            className="text-center"
                            style={{
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                fontSize: 11,
                                fontStyle: 'italic',
                                color: '#AAA',
                            }}
                        >
                            {text.pricesNote}
                        </p>
                    </div>

                    {/* VERTICAL DIVIDER */}
                    <div
                        style={{
                            width: 1,
                            background: 'rgba(0,0,0,0.08)',
                            margin: '0 24px',
                        }}
                    />

                    {/* RIGHT COLUMN - Latest Offers */}
                    <div style={{ flex: '0 0 50%' }}>
                        {/* Column Heading */}
                        <div className="mb-4">
                            <h2
                                style={{
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: '#1A1A1A',
                                    marginBottom: 4,
                                }}
                            >
                                {text.latestOffers}
                            </h2>
                            <p
                                style={{
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    fontSize: 13,
                                    color: '#888',
                                }}
                            >
                                {text.latestOffersSubtitle}
                            </p>
                        </div>

                        {/* Buyer Offer Mini-Cards */}
                        <div className="space-y-3 mb-4">
                            {BUYER_OFFERS.map((buyer) => (
                                <div
                                    key={buyer.name}
                                    className="flex items-center gap-3"
                                    style={{
                                        background: 'rgba(255,255,255,0.60)',
                                        border: '1px solid rgba(255,255,255,0.50)',
                                        borderRadius: 14,
                                        padding: '14px 16px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    {/* Avatar */}
                                    <img
                                        src={buyer.avatarUrl}
                                        alt={buyer.name}
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            flexShrink: 0,
                                        }}
                                    />

                                    {/* Buyer Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontFamily:
                                                    "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: '#1A1A1A',
                                                marginBottom: 3,
                                            }}
                                        >
                                            {buyer.name}
                                        </div>
                                        <div
                                            className="flex items-center gap-1 mb-1"
                                            style={{
                                                fontFamily:
                                                    "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                fontSize: 12,
                                                color: '#888',
                                            }}
                                        >
                                            <MapPin className="w-3 h-3" />
                                            <span>
                                                {buyer.location} · {buyer.distance}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontFamily:
                                                    "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                fontSize: 12,
                                                color: '#555',
                                            }}
                                        >
                                            {text.needs} {buyer.needs}
                                        </div>
                                    </div>

                                    {/* Price & Rating */}
                                    <div className="text-right" style={{ marginRight: 12 }}>
                                        <div
                                            style={{
                                                fontFamily:
                                                    "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                                fontSize: 16,
                                                fontWeight: 700,
                                                color: '#2D6A2F',
                                                marginBottom: 3,
                                            }}
                                        >
                                            {buyer.price}/q
                                        </div>
                                        <MiniStarRating
                                            rating={buyer.rating}
                                            count={buyer.reviewCount}
                                        />
                                    </div>

                                    {/* View Button */}
                                    <button
                                        className="flex items-center gap-1"
                                        style={{
                                            background: '#2D6A2F',
                                            color: 'white',
                                            borderRadius: 8,
                                            padding: '8px 16px',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            fontFamily:
                                                "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                            border: 'none',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {text.view}
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* View All > Button */}
                        <div className="flex justify-end">
                            <button
                                className="flex items-center gap-1"
                                style={{
                                    background: 'transparent',
                                    color: '#2D6A2F',
                                    border: '1.5px solid #2D6A2F',
                                    borderRadius: 10,
                                    padding: '8px 20px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    cursor: 'pointer',
                                }}
                            >
                                {text.viewAll}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}