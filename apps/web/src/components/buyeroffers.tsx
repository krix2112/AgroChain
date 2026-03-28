import { Phone, MapPin, Wheat, ChevronDown, Star } from 'lucide-react';

interface BuyerOffersProps {
    language: 'en' | 'hi';
    onBack?: () => void;
    onViewBuyer?: () => void;
}

interface Buyer {
    id: number;
    name: string;
    location: string;
    distance: string;
    needs: string;
    price: string;
    rating: number;
    reviewCount: number;
    avatarUrl: string;
}

const BUYERS: Buyer[] = [
    {
        id: 1,
        name: 'Raj Traders',
        location: 'Delhi',
        distance: '12 km',
        needs: '50 quintals',
        price: '₹2,400',
        rating: 4.5,
        reviewCount: 138,
        avatarUrl: 'https://images.unsplash.com/photo-1762885590877-0829975f2cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBidXNpbmVzc21hbiUyMHRyYWRlciUyMG1hbGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1MDM4NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
        id: 2,
        name: 'Vinay Grains',
        location: 'Gurgaon',
        distance: '30 km',
        needs: '80 quintals',
        price: '₹2,350',
        rating: 4.5,
        reviewCount: 92,
        avatarUrl: 'https://images.unsplash.com/photo-1739249432260-0bcfdc382e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBidXNpbmVzcyUyMGZvcm1hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NDUwMzg2MXww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
        id: 3,
        name: 'Patel Agro Traders',
        location: 'Faridabad',
        distance: '18 km',
        needs: '100 quintals',
        price: '₹2,300',
        rating: 4.0,
        reviewCount: 110,
        avatarUrl: 'https://images.unsplash.com/photo-1671450960874-0903baf942c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBlbnRyZXByZW5ldXIlMjBtYWxlJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0NTAzODYxfDA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
        id: 4,
        name: 'Yadav Enterprises',
        location: 'Noida',
        distance: '24 km',
        needs: '60 quintals',
        price: '₹2,250',
        rating: 4.5,
        reviewCount: 75,
        avatarUrl: 'https://images.unsplash.com/photo-1762885590877-0829975f2cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0JTIwbWlkZGxlJTIwYWdlZHxlbnwxfHx8fDE3NzQ1MDM4NjJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
        id: 5,
        name: 'Sharma Food Corp',
        location: 'Ghaziabad',
        distance: '20 km',
        needs: '45 quintals',
        price: '₹2,250',
        rating: 4.0,
        reviewCount: 75,
        avatarUrl: 'https://images.unsplash.com/photo-1671450960874-0903baf942c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBlbnRyZXByZW5ldXIlMjBtYWxlJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0NTAzODYxfDA&ixlib=rb-4.1.0&q=80&w=400',
    },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={i}
                        className="w-4 h-4"
                        style={{ fill: '#F5A623', color: '#F5A623' }}
                    />
                ))}
                {hasHalfStar && (
                    <div className="relative w-4 h-4">
                        <Star
                            className="absolute w-4 h-4"
                            style={{ fill: 'none', color: '#F5A623', stroke: '#F5A623' }}
                        />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                            <Star
                                className="w-4 h-4"
                                style={{ fill: '#F5A623', color: '#F5A623' }}
                            />
                        </div>
                    </div>
                )}
                {Array.from({ length: 5 - Math.ceil(rating) }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className="w-4 h-4"
                        style={{ fill: 'none', color: '#DDD', stroke: '#DDD' }}
                    />
                ))}
            </div>
            <span style={{ fontSize: 12, color: '#888', marginLeft: 4 }}>
                ({count})
            </span>
        </div>
    );
}

export function BuyerOffers({ language, onViewBuyer }: BuyerOffersProps) {
    const text = {
        title: language === 'en' ? 'Buyer Offers' : 'खरीदार ऑफ़र',
        subtitle:
            language === 'en'
                ? 'See current offers from buyers interested in your produce.'
                : 'अपनी उपज में रुचि रखने वाले खरीदारों के वर्तमान ऑफ़र देखें।',
        sortPrice: language === 'en' ? 'Sort by Price' : 'कीमत से क्रमबद्ध करें',
        distance: language === 'en' ? 'Distance' : 'दूरी',
        needs: language === 'en' ? 'Needs' : 'जरूरत',
        callBuyer: language === 'en' ? 'Call Buyer' : 'खरीदार को कॉल करें',
        view: language === 'en' ? 'View ›' : 'देखें ›',
    };

    return (
        <div className="at-page-wrap pt-[80px] pb-10 px-8">
            {/* Page Header */}
            <div className="mb-6 at-page-header" style={{ paddingLeft: 80 }}>
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

            {/* Sort Controls Row */}
            <div className="flex justify-end mb-5" style={{ paddingRight: 80 }}>
                <div className="flex items-center gap-2.5">
                    <button
                        className="flex items-center gap-2 transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.70)',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: 20,
                            padding: '8px 16px',
                            fontSize: 14,
                            color: '#444',
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.90)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.70)';
                        }}
                    >
                        {text.sortPrice}
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                        className="flex items-center gap-2 transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.70)',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: 20,
                            padding: '8px 16px',
                            fontSize: 14,
                            color: '#444',
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.90)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.70)';
                        }}
                    >
                        {text.distance}
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Glass Panel */}
            <div
                className="mx-auto at-glass-panel"
                style={{
                    maxWidth: 900,
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1.5px solid rgba(255,255,255,0.50)',
                    borderRadius: 24,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                    padding: '12px 0',
                }}
            >
                {/* Buyer Rows */}
                {BUYERS.map((buyer, index) => (
                    <div key={buyer.id}>
                        <div
                            className="at-buyer-card-row flex items-center transition-all duration-200"
                            style={{
                                height: 88,
                                padding: '0 32px',
                                background:
                                    index === 0 ? 'rgba(45,106,47,0.04)' : 'transparent',
                            }}
                        >
                            {/* Avatar */}
                            <img
                                src={buyer.avatarUrl}
                                alt={buyer.name}
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '50%',
                                    border: '2px solid rgba(0,0,0,0.08)',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                }}
                            />

                            {/* Buyer Info */}
                            <div className="at-buyer-info-row" style={{ marginLeft: 16, flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 17,
                                        fontWeight: 700,
                                        color: '#1A1A1A',
                                        marginBottom: 4,
                                    }}
                                >
                                    {buyer.name}
                                </div>
                                <div
                                    className="flex items-center gap-1.5 mb-1.5"
                                    style={{
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 13,
                                        color: '#888',
                                    }}
                                >
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{buyer.location}</span>
                                    <span style={{ margin: '0 2px' }}>·</span>
                                    <span>{buyer.distance}</span>
                                </div>
                                <div
                                    className="flex items-center gap-1.5"
                                    style={{
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 13,
                                        color: '#555',
                                    }}
                                >
                                    <Wheat className="w-4 h-4" style={{ color: '#2D6A2F' }} />
                                    <span>
                                        {text.needs} {buyer.needs}
                                    </span>
                                </div>
                            </div>

                            {/* Price & Rating */}
                            <div className="at-buyer-rating-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                <div
                                    className="at-buyer-price"
                                    style={{
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: '#2D6A2F',
                                        marginBottom: 6,
                                    }}
                                >
                                    {buyer.price}/quintal
                                </div>
                                <StarRating rating={buyer.rating} count={buyer.reviewCount} />
                            </div>

                            {/* CTA Button */}
                            <div className="at-buyer-cta-row flex items-center gap-2.5 flex-shrink-0">
                                <button
                                    onClick={onViewBuyer}
                                    className="at-buyer-view-btn flex items-center gap-2 transition-all duration-200"
                                    style={{
                                        background: 'transparent',
                                        color: '#2D6A2F',
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        borderRadius: 10,
                                        padding: '10px 18px',
                                        height: 48,
                                        border: '1.5px solid #2D6A2F',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45,106,47,0.06)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {text.view}
                                </button>
                                <button
                                    className="at-buyer-call-btn flex items-center gap-2 transition-all duration-200"
                                    style={{
                                        background: '#2D6A2F',
                                        color: 'white',
                                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        borderRadius: 10,
                                        padding: '12px 24px',
                                        height: 48,
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 3px 10px rgba(45,106,47,0.30)',
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#245022'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#2D6A2F'; }}
                                >
                                    <Phone className="w-4 h-4" />
                                    {text.callBuyer}
                                </button>
                            </div>
                        </div>
                        {/* Divider */}
                        {index < BUYERS.length - 1 && (
                            <div
                                style={{
                                    height: 1,
                                    background: 'rgba(0,0,0,0.06)',
                                    margin: '0 32px',
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Sort Button */}
            <div className="flex justify-center mt-6">
                <button
                    className="flex items-center gap-2 transition-all duration-200"
                    style={{
                        background: 'rgba(255,255,255,0.70)',
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: 20,
                        padding: '8px 16px',
                        fontSize: 14,
                        color: '#444',
                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                        cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.90)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.70)';
                    }}
                >
                    {text.sortPrice}
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}