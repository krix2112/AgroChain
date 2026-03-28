import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, SlidersHorizontal, X, ShoppingCart, HelpCircle, RefreshCw, Package, Filter } from 'lucide-react';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
    listingId: string;
    cropName: string;
    cropNameHi?: string;
    quantity: number;   // kg
    price: number;   // ₹/kg
    description?: string;
    photoUrl?: string;
    farmerName: string;
    city: string;
    state: string;
    availableFrom: string;
    createdAt: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_LISTINGS: Listing[] = [
    {
        listingId: 'L001', cropName: 'Wheat', cropNameHi: 'गेहूं',
        quantity: 500, price: 24,
        description: 'High-quality Sharbati wheat. No pesticides used. Well-stored.',
        photoUrl: 'https://images.unsplash.com/photo-1627842822558-c1f15aef9838?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Ramesh Kumar', city: 'Indore', state: 'MP',
        availableFrom: '2025-04-10', createdAt: '2025-04-01',
    },
    {
        listingId: 'L002', cropName: 'Tomato', cropNameHi: 'टमाटर',
        quantity: 200, price: 18,
        description: 'Fresh hybrid tomatoes, perfect color and size.',
        photoUrl: 'https://images.unsplash.com/photo-1631292171396-26a654f51c48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Suresh Patel', city: 'Nashik', state: 'MH',
        availableFrom: '2025-04-05', createdAt: '2025-04-02',
    },
    {
        listingId: 'L003', cropName: 'Rice', cropNameHi: 'चावल',
        quantity: 1000, price: 32,
        description: 'Basmati rice from Punjab. Premium grade.',
        photoUrl: 'https://images.unsplash.com/photo-1759646850616-8bc3e6567ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Harpreet Singh', city: 'Amritsar', state: 'PB',
        availableFrom: '2025-04-15', createdAt: '2025-04-03',
    },
    {
        listingId: 'L004', cropName: 'Onion', cropNameHi: 'प्याज',
        quantity: 800, price: 12,
        description: 'Rabi onions. Dry and suitable for storage.',
        photoUrl: 'https://images.unsplash.com/photo-1668295037469-8b0e8d11cd2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Mohan Yadav', city: 'Lasalgaon', state: 'MH',
        availableFrom: '2025-04-08', createdAt: '2025-04-02',
    },
    {
        listingId: 'L005', cropName: 'Potato', cropNameHi: 'आलू',
        quantity: 600, price: 10,
        description: 'Chipsona variety. Ideal for chips and processing.',
        photoUrl: 'https://images.unsplash.com/photo-1614587477607-79563e3dd0d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Rajendra Verma', city: 'Agra', state: 'UP',
        availableFrom: '2025-04-12', createdAt: '2025-04-04',
    },
    {
        listingId: 'L006', cropName: 'Corn', cropNameHi: 'मक्का',
        quantity: 400, price: 14,
        description: 'Sweet corn variety. Good for both fresh market and processing.',
        photoUrl: 'https://images.unsplash.com/photo-1691326564837-51e3619f1d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Dinesh Choudhary', city: 'Jaipur', state: 'RJ',
        availableFrom: '2025-04-20', createdAt: '2025-04-05',
    },
    {
        listingId: 'L007', cropName: 'Soybean', cropNameHi: 'सोयाबीन',
        quantity: 300, price: 45,
        description: 'JS-335 variety soybean. Low moisture content.',
        photoUrl: 'https://images.unsplash.com/photo-1605351793013-780532cbdb66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Pramod Patil', city: 'Latur', state: 'MH',
        availableFrom: '2025-04-18', createdAt: '2025-04-06',
    },
    {
        listingId: 'L008', cropName: 'Wheat', cropNameHi: 'गेहूं',
        quantity: 750, price: 22,
        description: 'Lokwan wheat variety. Machine harvested and cleaned.',
        photoUrl: 'https://images.unsplash.com/photo-1627842822558-c1f15aef9838?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        farmerName: 'Bharat Sharma', city: 'Sehore', state: 'MP',
        availableFrom: '2025-04-22', createdAt: '2025-04-07',
    },
];

const CROP_COLORS: Record<string, { bg: string; border: string; tag: string }> = {
    wheat: { bg: '#fef9c3', border: '#fde047', tag: '#a16207' },
    tomato: { bg: '#fee2e2', border: '#fca5a5', tag: '#991b1b' },
    rice: { bg: '#ecfdf5', border: '#6ee7b7', tag: '#065f46' },
    onion: { bg: '#fdf4ff', border: '#e879f9', tag: '#7e22ce' },
    potato: { bg: '#fff7ed', border: '#fdba74', tag: '#9a3412' },
    corn: { bg: '#fef3c7', border: '#fcd34d', tag: '#92400e' },
    soybean: { bg: '#f0fdf4', border: '#86efac', tag: '#14532d' },
};
function getCropColor(name: string) {
    return CROP_COLORS[name.toLowerCase()] ?? { bg: '#f0fdf4', border: '#d1fae5', tag: '#14532d' };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    language: 'en' | 'hi';
    onBack?: () => void;
    onCreateListing?: () => void;
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ listing, index, language }: { listing: Listing; index: number; language: 'en' | 'hi' }) {
    const [hovered, setHovered] = useState(false);
    const [buying, setBuying] = useState(false);
    const [bought, setBought] = useState(false);
    const cropColor = getCropColor(listing.cropName);

    async function handleBuy() {
        setBuying(true);
        const token = localStorage.getItem('agrochain_token');
        try {
            await fetch('http://localhost:5000/api/listing/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token ?? ''}`,
                },
                body: JSON.stringify({ listingId: listing.listingId }),
                signal: AbortSignal.timeout(3000),
            });
            setBought(true);
        } catch {
            setBought(true); // show success in demo mode
        } finally {
            setBuying(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.40, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: hovered ? '1.5px solid rgba(22,163,74,0.30)' : '1.5px solid rgba(255,255,255,0.70)',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: hovered
                    ? '0 16px 48px rgba(0,0,0,0.14), 0 0 0 2px rgba(22,163,74,0.12)'
                    : '0 4px 20px rgba(0,0,0,0.07)',
                transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.24s ease',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Crop photo */}
            <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0 }}>
                <img
                    src={listing.photoUrl ?? 'https://images.unsplash.com/photo-1627842822558-c1f15aef9838?w=400&q=80'}
                    alt={listing.cropName}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: hovered ? 'scale(1.07)' : 'scale(1)',
                        transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                />
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 60%)',
                }} />
                {/* Crop tag */}
                <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: cropColor.bg,
                    border: `1px solid ${cropColor.border}`,
                    borderRadius: 99,
                    padding: '4px 11px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: cropColor.tag,
                    fontFamily: font,
                }}>
                    {language === 'hi' && listing.cropNameHi ? listing.cropNameHi : listing.cropName}
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Crop name + price row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                        <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                            {listing.cropName}
                            {language === 'hi' && listing.cropNameHi && (
                                <span style={{ fontSize: 13, fontWeight: 500, color: '#6b7280', marginLeft: 6 }}>
                                    ({listing.cropNameHi})
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, fontFamily: font }}>
                            {listing.quantity.toLocaleString('en-IN')} kg {language === 'hi' ? 'उपलब्ध' : 'available'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: '#15803d', lineHeight: 1 }}>
                            ₹{listing.price}
                        </div>
                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, fontFamily: font }}>
                            {language === 'hi' ? 'प्रति किग्रा' : 'per kg'}
                        </div>
                    </div>
                </div>

                {/* Farmer location */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 12, color: '#6b7280', fontFamily: font,
                    marginBottom: 12,
                }}>
                    <MapPin size={12} color="#9ca3af" />
                    <span>{listing.farmerName} · {listing.city}, {listing.state}</span>
                </div>

                {/* Description */}
                {listing.description && (
                    <div style={{
                        fontSize: 12, color: '#6b7280', fontFamily: font,
                        lineHeight: 1.5, marginBottom: 12,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    } as React.CSSProperties}>
                        {listing.description}
                    </div>
                )}

                {/* Available from */}
                <div style={{
                    fontSize: 11, color: '#9ca3af', fontFamily: font,
                    marginBottom: 14,
                    display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#86efac', display: 'inline-block' }} />
                    {language === 'hi' ? 'उपलब्ध:' : 'Available:'}{' '}
                    {new Date(listing.availableFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>

                {/* Total value row */}
                <div style={{
                    background: '#f0fdf4', borderRadius: 10, padding: '8px 12px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 14,
                }}>
                    <span style={{ fontSize: 11, color: '#6b7280', fontFamily: font }}>
                        {language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d', fontFamily: font }}>
                        ₹{(listing.quantity * listing.price).toLocaleString('en-IN')}
                    </span>
                </div>

                {/* Buy Now button */}
                <AnimatePresence mode="wait">
                    {bought ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                background: '#dcfce7', border: '1.5px solid #86efac',
                                borderRadius: 12, padding: '11px',
                                textAlign: 'center', fontSize: 13, fontWeight: 700,
                                color: '#15803d', fontFamily: font,
                            }}
                        >
                            {language === 'hi' ? 'अनुरोध भेजा गया!' : 'Interest Sent!'}
                        </motion.div>
                    ) : (
                        <motion.button
                            key="buy"
                            whileTap={{ scale: 0.97 }}
                            onClick={handleBuy}
                            disabled={buying}
                            style={{
                                width: '100%',
                                background: hovered ? '#14532d' : '#15803d',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 12,
                                padding: '11px 0',
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: buying ? 'not-allowed' : 'pointer',
                                fontFamily: font,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: hovered ? '0 8px 24px rgba(20,83,45,0.40)' : '0 4px 14px rgba(21,128,61,0.28)',
                                transition: 'background 0.20s, box-shadow 0.20s',
                                opacity: buying ? 0.75 : 1,
                            }}
                        >
                            {buying ? (
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                    style={{
                                        display: 'inline-block', width: 14, height: 14,
                                        border: '2px solid rgba(255,255,255,0.30)',
                                        borderTop: '2px solid #ffffff', borderRadius: '50%',
                                    }}
                                />
                            ) : (
                                <ShoppingCart size={14} />
                            )}
                            {buying
                                ? (language === 'hi' ? 'प्रोसेस हो रहा है...' : 'Processing...')
                                : (language === 'hi' ? 'अभी खरीदें' : 'Buy Now')
                            }
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PublicListingsMarketplace({ language, onBack, onCreateListing }: Props) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiLive, setApiLive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userRaw = localStorage.getItem('agrochain_user');
        if (userRaw) {
            try { setUserRole(JSON.parse(userRaw).role ?? ''); } catch { /* ignore */ }
        }
        fetchListings();
    }, []);

    async function fetchListings() {
        setLoading(true);
        const token = localStorage.getItem('agrochain_token');
        try {
            const res = await fetch('http://localhost:5000/api/listing/all', {
                headers: { Authorization: `Bearer ${token ?? ''}` },
                signal: AbortSignal.timeout(3000),
            });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            setListings(Array.isArray(data) ? data : data.listings ?? DUMMY_LISTINGS);
            setApiLive(true);
        } catch {
            setListings(DUMMY_LISTINGS);
            setApiLive(false);
        } finally {
            setLoading(false);
        }
    }

    const filteredListings = useMemo(() => {
        return listings.filter(l => {
            const q = searchQuery.toLowerCase();
            if (q && !l.cropName.toLowerCase().includes(q) && !(l.cropNameHi ?? '').includes(q)) return false;
            const loc = locationQuery.toLowerCase();
            if (loc && !l.city.toLowerCase().includes(loc) && !l.state.toLowerCase().includes(loc) && !l.farmerName.toLowerCase().includes(loc)) return false;
            if (priceMin && l.price < parseFloat(priceMin)) return false;
            if (priceMax && l.price > parseFloat(priceMax)) return false;
            return true;
        });
    }, [listings, searchQuery, locationQuery, priceMin, priceMax]);

    const hasFilters = !!(searchQuery || locationQuery || priceMin || priceMax);

    function clearFilters() {
        setSearchQuery('');
        setLocationQuery('');
        setPriceMin('');
        setPriceMax('');
    }

    return (
        <div style={{ minHeight: '100vh', fontFamily: font, paddingTop: 16 }}>
            <style>{`
        .plm-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1200px) { .plm-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px)  { .plm-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  { .plm-grid { grid-template-columns: 1fr; } }
        .plm-filter-row { display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 640px)  { .plm-filter-row { flex-direction: column; } }
      `}</style>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42 }}
                    style={{ marginBottom: 28 }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            {onBack && (
                                <motion.button
                                    whileHover={{ x: -3 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={onBack}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20,
                                        padding: '6px 14px', fontSize: 12, fontWeight: 500,
                                        color: '#374151', cursor: 'pointer', fontFamily: font,
                                        marginBottom: 14,
                                    }}
                                >
                                    ← {language === 'hi' ? 'वापस' : 'Back'}
                                </motion.button>
                            )}

                            <h1 style={{
                                fontFamily: serif, fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 800,
                                color: '#111827', margin: 0, lineHeight: 1.2,
                            }}>
                                {language === 'hi' ? 'फसल मंडी' : 'Crop Marketplace'}
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6, fontFamily: font }}>
                                {language === 'hi'
                                    ? 'किसानों से सीधे ताज़ी फसल खरीदें — ब्लॉकचेन सुरक्षित'
                                    : 'Buy fresh produce directly from farmers — blockchain secured'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, color: '#15803d',
                                    background: '#dcfce7', borderRadius: 99, padding: '3px 10px',
                                    border: '1px solid #86efac',
                                }}>
                                    {language === 'hi' ? 'स्रोत:' : 'Source:'} GET /api/listing/all
                                </span>
                                {!apiLive && (
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, color: '#b45309',
                                        background: '#fef3c7', borderRadius: 99, padding: '3px 10px',
                                        border: '1px solid #fcd34d',
                                    }}>
                                        {language === 'hi' ? 'डेमो डेटा' : 'Demo Data'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <motion.button
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.4 }}
                                onClick={fetchListings}
                                style={{
                                    width: 38, height: 38, borderRadius: '50%',
                                    border: '1.5px solid rgba(255,255,255,0.60)',
                                    background: 'rgba(255,255,255,0.72)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#374151',
                                }}
                            >
                                <RefreshCw size={15} />
                            </motion.button>

                            {(userRole === 'farmer' || !userRole) && onCreateListing && (
                                <motion.button
                                    whileHover={{ background: '#14532d', boxShadow: '0 8px 24px rgba(20,83,45,0.40)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onCreateListing}
                                    style={{
                                        background: '#15803d', color: '#ffffff',
                                        border: 'none', borderRadius: 12,
                                        padding: '10px 20px', fontSize: 13, fontWeight: 700,
                                        cursor: 'pointer', fontFamily: font,
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        boxShadow: '0 4px 16px rgba(21,128,61,0.30)',
                                        transition: 'background 0.20s',
                                    }}
                                >
                                    <Package size={14} />
                                    {language === 'hi' ? 'फसल सूचीबद्ध करें' : 'List a Crop'}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Filter Bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.08 }}
                    style={{
                        background: 'rgba(255,255,255,0.88)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1.5px solid rgba(255,255,255,0.70)',
                        borderRadius: 18,
                        padding: '16px 20px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        marginBottom: 24,
                    }}
                >
                    <div className="plm-filter-row">
                        {/* Search */}
                        <div style={{
                            flex: '2 1 220px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: '#f9fafb', border: '1.5px solid #e5e7eb',
                            borderRadius: 12, padding: '0 14px', height: 44,
                        }}>
                            <Search size={16} color="#9ca3af" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={language === 'hi' ? 'फसल का नाम खोजें...' : 'Search crop name...'}
                                style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    fontSize: 13, fontFamily: font, color: '#111827',
                                    flex: 1,
                                }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Location */}
                        <div style={{
                            flex: '1.5 1 160px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: '#f9fafb', border: '1.5px solid #e5e7eb',
                            borderRadius: 12, padding: '0 14px', height: 44,
                        }}>
                            <MapPin size={16} color="#9ca3af" />
                            <input
                                type="text"
                                value={locationQuery}
                                onChange={e => setLocationQuery(e.target.value)}
                                placeholder={language === 'hi' ? 'शहर या राज्य...' : 'City or state...'}
                                style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    fontSize: 13, fontFamily: font, color: '#111827',
                                    flex: 1,
                                }}
                            />
                            {locationQuery && (
                                <button onClick={() => setLocationQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Price toggle */}
                        <button
                            onClick={() => setShowFilters(v => !v)}
                            style={{
                                flex: '0 0 auto',
                                display: 'flex', alignItems: 'center', gap: 7,
                                background: showFilters ? '#f0fdf4' : '#f9fafb',
                                border: `1.5px solid ${showFilters ? '#86efac' : '#e5e7eb'}`,
                                borderRadius: 12, padding: '0 16px', height: 44,
                                fontSize: 13, fontWeight: 600,
                                color: showFilters ? '#15803d' : '#374151',
                                cursor: 'pointer', fontFamily: font,
                                transition: 'all 0.18s',
                            }}
                        >
                            <SlidersHorizontal size={15} />
                            {language === 'hi' ? 'मूल्य फ़िल्टर' : 'Price Filter'}
                        </button>

                        {hasFilters && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={clearFilters}
                                style={{
                                    flex: '0 0 auto',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: '#fef2f2', border: '1.5px solid #fecaca',
                                    borderRadius: 12, padding: '0 14px', height: 44,
                                    fontSize: 12, fontWeight: 600, color: '#dc2626',
                                    cursor: 'pointer', fontFamily: font,
                                }}
                            >
                                <X size={13} />
                                {language === 'hi' ? 'साफ़ करें' : 'Clear'}
                            </motion.button>
                        )}
                    </div>

                    {/* Price range row */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    paddingTop: 14, flexWrap: 'wrap',
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: font }}>
                                        {language === 'hi' ? 'मूल्य (₹/किग्रा):' : 'Price (₹/kg):'}
                                    </span>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        background: '#f9fafb', border: '1.5px solid #e5e7eb',
                                        borderRadius: 10, padding: '0 12px', height: 38,
                                    }}>
                                        <input
                                            type="number"
                                            value={priceMin}
                                            onChange={e => setPriceMin(e.target.value)}
                                            placeholder={language === 'hi' ? 'न्यूनतम' : 'Min'}
                                            style={{
                                                background: 'none', border: 'none', outline: 'none',
                                                fontSize: 13, fontFamily: font, color: '#111827', width: 80,
                                            }}
                                        />
                                        <span style={{ color: '#d1d5db' }}>—</span>
                                        <input
                                            type="number"
                                            value={priceMax}
                                            onChange={e => setPriceMax(e.target.value)}
                                            placeholder={language === 'hi' ? 'अधिकतम' : 'Max'}
                                            style={{
                                                background: 'none', border: 'none', outline: 'none',
                                                fontSize: 13, fontFamily: font, color: '#111827', width: 80,
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: font }}>
                                        {language === 'hi' ? 'उदा. 10 – 50' : 'e.g. 10 – 50'}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Results count ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.14 }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 20, flexWrap: 'wrap', gap: 8,
                    }}
                >
                    <span style={{ fontSize: 13, color: '#6b7280', fontFamily: font }}>
                        {loading
                            ? (language === 'hi' ? 'लोड हो रहा है...' : 'Loading...')
                            : `${filteredListings.length} ${language === 'hi' ? 'लिस्टिंग मिली' : 'listings found'}`
                        }
                        {hasFilters && ` (${language === 'hi' ? 'फ़िल्टर किया गया' : 'filtered'})`}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {['all', 'wheat', 'tomato', 'rice', 'onion', 'potato'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSearchQuery(tag === 'all' ? '' : tag)}
                                style={{
                                    background: (tag === 'all' ? !searchQuery : searchQuery.toLowerCase() === tag)
                                        ? '#14532d' : 'rgba(255,255,255,0.70)',
                                    color: (tag === 'all' ? !searchQuery : searchQuery.toLowerCase() === tag)
                                        ? '#ffffff' : '#374151',
                                    border: '1.5px solid rgba(0,0,0,0.08)',
                                    borderRadius: 99, padding: '4px 12px', fontSize: 11,
                                    fontWeight: 600, cursor: 'pointer', fontFamily: font,
                                    transition: 'all 0.16s',
                                }}
                            >
                                {tag === 'all' ? (language === 'hi' ? 'सभी' : 'All') : tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── Grid ── */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{
                                width: 40, height: 40, border: '3px solid #d1fae5',
                                borderTop: '3px solid #15803d', borderRadius: '50%',
                                margin: '0 auto 16px',
                            }}
                        />
                        <p style={{ color: '#6b7280', fontFamily: font, fontSize: 14 }}>
                            {language === 'hi' ? 'लिस्टिंग लोड हो रही हैं...' : 'Loading listings...'}
                        </p>
                    </div>
                ) : filteredListings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(255,255,255,0.88)', border: '2px dashed #d1fae5',
                            borderRadius: 20, padding: '72px 32px', textAlign: 'center',
                        }}
                    >
                        <div style={{
                            width: 56, height: 56, borderRadius: 16, background: '#f0fdf4',
                            margin: '0 auto 18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Filter size={26} color="#86efac" />
                        </div>
                        <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
                            {language === 'hi' ? 'कोई लिस्टिंग नहीं मिली' : 'No listings found'}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: 14, fontFamily: font, marginBottom: 20 }}>
                            {language === 'hi'
                                ? 'अपनी खोज या फ़िल्टर बदलने का प्रयास करें।'
                                : 'Try adjusting your search or filters.'}
                        </p>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                style={{
                                    background: '#15803d', color: '#ffffff',
                                    border: 'none', borderRadius: 12, padding: '10px 24px',
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                                }}
                            >
                                {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="plm-grid">
                        {filteredListings.map((listing, i) => (
                            <ListingCard
                                key={listing.listingId}
                                listing={listing}
                                index={i}
                                language={language}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating help */}
            <motion.button
                whileHover={{ scale: 1.10, boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
                whileTap={{ scale: 0.92 }}
                style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 200,
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#374151', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
                }}
                title="Help"
            >
                <HelpCircle size={20} color="#ffffff" />
            </motion.button>
        </div>
    );
}
