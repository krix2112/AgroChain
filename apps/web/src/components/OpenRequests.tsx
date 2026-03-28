import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MapPin, Calendar, Package, HelpCircle, RefreshCw,
    CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TraderRequest {
    requestId: string;
    cropName: string;
    cropNameHi?: string;
    quantity: number;  // kg
    preferredPrice: number;  // ₹/kg
    deliveryCity: string;
    deliveryDate: string;
    traderName: string;
    traderRating?: number;
    note?: string;
    createdAt: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_REQUESTS: TraderRequest[] = [
    {
        requestId: 'R001', cropName: 'Wheat', cropNameHi: 'गेहूं',
        quantity: 500, preferredPrice: 23,
        deliveryCity: 'Delhi', deliveryDate: '2025-04-20',
        traderName: 'Raj Traders', traderRating: 4.5,
        note: 'Looking for Sharbati variety. Dry and clean.',
        createdAt: '2025-04-03',
    },
    {
        requestId: 'R002', cropName: 'Tomato', cropNameHi: 'टमाटर',
        quantity: 200, preferredPrice: 16,
        deliveryCity: 'Mumbai', deliveryDate: '2025-04-12',
        traderName: 'Vinay Grains', traderRating: 4.2,
        note: 'Need fresh batch for hotel chain. Grade A only.',
        createdAt: '2025-04-04',
    },
    {
        requestId: 'R003', cropName: 'Onion', cropNameHi: 'प्याज',
        quantity: 1000, preferredPrice: 11,
        deliveryCity: 'Ahmedabad', deliveryDate: '2025-04-25',
        traderName: 'Patel Agro', traderRating: 4.0,
        note: 'Medium to large size preferred. Storage onions.',
        createdAt: '2025-04-05',
    },
    {
        requestId: 'R004', cropName: 'Rice', cropNameHi: 'चावल',
        quantity: 800, preferredPrice: 30,
        deliveryCity: 'Hyderabad', deliveryDate: '2025-04-30',
        traderName: 'Sharma Foods', traderRating: 4.7,
        note: 'Basmati preferred. Will consider Sona Masoori.',
        createdAt: '2025-04-05',
    },
    {
        requestId: 'R005', cropName: 'Potato', cropNameHi: 'आलू',
        quantity: 600, preferredPrice: 9,
        deliveryCity: 'Pune', deliveryDate: '2025-04-18',
        traderName: 'Goyal Fresh', traderRating: 3.9,
        createdAt: '2025-04-06',
    },
];

const CROP_ACCENT: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    wheat: { bg: '#fef9c3', border: '#fde047', text: '#a16207', dot: '#eab308' },
    tomato: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
    rice: { bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46', dot: '#10b981' },
    onion: { bg: '#fdf4ff', border: '#e879f9', text: '#7e22ce', dot: '#d946ef' },
    potato: { bg: '#fff7ed', border: '#fdba74', text: '#9a3412', dot: '#f97316' },
    corn: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
};
function getCropAccent(name: string) {
    return CROP_ACCENT[name.toLowerCase()] ?? { bg: '#f0fdf4', border: '#86efac', text: '#14532d', dot: '#22c55e' };
}

function daysUntil(dateStr: string): number {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    language: 'en' | 'hi';
    onBack?: () => void;
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({
    req, index, language, isFarmer,
}: {
    req: TraderRequest; index: number; language: 'en' | 'hi'; isFarmer: boolean;
}) {
    const [hovered, setHovered] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const accent = getCropAccent(req.cropName);
    const days = daysUntil(req.deliveryDate);
    const urgent = days <= 7;

    async function handleAccept() {
        setAccepting(true);
        const token = localStorage.getItem('agrochain_token');
        try {
            await fetch(`http://localhost:5000/api/request/${req.requestId}/accept`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token ?? ''}` },
                signal: AbortSignal.timeout(3000),
            });
            setAccepted(true);
        } catch {
            setAccepted(true); // Demo mode
        } finally {
            setAccepting(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.40, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: hovered ? '1.5px solid rgba(22,163,74,0.28)' : '1.5px solid rgba(255,255,255,0.72)',
                borderRadius: 20,
                padding: '22px 26px',
                boxShadow: hovered
                    ? '0 12px 40px rgba(0,0,0,0.12), 0 0 0 2px rgba(22,163,74,0.10)'
                    : '0 4px 18px rgba(0,0,0,0.07)',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'transform 0.26s ease, box-shadow 0.26s ease, border-color 0.22s ease',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Left accent bar */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 4, background: accent.dot, borderRadius: '4px 0 0 4px',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                {/* Left content */}
                <div style={{ flex: 1, minWidth: 220 }}>
                    {/* Top row: Crop + urgency */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{
                            background: accent.bg, border: `1.5px solid ${accent.border}`,
                            borderRadius: 99, padding: '4px 12px',
                            fontSize: 12, fontWeight: 700, color: accent.text, fontFamily: font,
                        }}>
                            {language === 'hi' && req.cropNameHi ? req.cropNameHi : req.cropName}
                        </span>
                        {urgent && (
                            <span style={{
                                background: '#fff7ed', border: '1.5px solid #fed7aa',
                                borderRadius: 99, padding: '4px 10px',
                                fontSize: 11, fontWeight: 700, color: '#c2410c', fontFamily: font,
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                <AlertCircle size={11} />
                                {language === 'hi' ? `${days} दिन बचे` : `${days}d left`}
                            </span>
                        )}
                        <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: font }}>
                            #{req.requestId}
                        </span>
                    </div>

                    {/* Trader name */}
                    <div style={{
                        fontFamily: serif, fontSize: 18, fontWeight: 700, color: '#111827',
                        marginBottom: 6, lineHeight: 1.2,
                    }}>
                        {req.traderName}
                    </div>

                    {/* Note */}
                    {req.note && (
                        <div style={{
                            fontSize: 13, color: '#4b5563', fontFamily: font,
                            lineHeight: 1.5, marginBottom: 12,
                            background: '#f9fafb', borderRadius: 10, padding: '8px 12px',
                            borderLeft: `3px solid ${accent.dot}`,
                        }}>
                            "{req.note}"
                        </div>
                    )}

                    {/* Details grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '6px 24px', justifyContent: 'start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Package size={13} color="#9ca3af" />
                            <span style={{ fontSize: 13, color: '#374151', fontFamily: font }}>
                                {req.quantity.toLocaleString('en-IN')} kg
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d', fontFamily: font }}>
                                ₹{req.preferredPrice}/kg
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={13} color="#9ca3af" />
                            <span style={{ fontSize: 13, color: '#374151', fontFamily: font }}>
                                {req.deliveryCity}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={13} color="#9ca3af" />
                            <span style={{ fontSize: 13, color: urgent ? '#c2410c' : '#374151', fontWeight: urgent ? 600 : 400, fontFamily: font }}>
                                {new Date(req.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: total value + actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                    {/* Total value */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: font }}>
                            {language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
                        </div>
                        <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 800, color: '#15803d', lineHeight: 1.1, marginTop: 3 }}>
                            ₹{(req.quantity * req.preferredPrice).toLocaleString('en-IN')}
                        </div>
                    </div>

                    {/* Posted time */}
                    <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: font, textAlign: 'right' }}>
                        {language === 'hi' ? 'पोस्ट किया:' : 'Posted:'}{' '}
                        {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>

                    {/* Accept button — only for farmers */}
                    {isFarmer && (
                        <AnimatePresence mode="wait">
                            {accepted ? (
                                <motion.div
                                    key="accepted"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        background: '#dcfce7', border: '1.5px solid #86efac',
                                        borderRadius: 12, padding: '10px 18px',
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        fontSize: 13, fontWeight: 700, color: '#15803d', fontFamily: font,
                                    }}
                                >
                                    <CheckCircle2 size={15} color="#15803d" />
                                    {language === 'hi' ? 'स्वीकार किया!' : 'Accepted!'}
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="accept"
                                    whileHover={{ background: '#14532d', boxShadow: '0 8px 24px rgba(20,83,45,0.38)' }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleAccept}
                                    disabled={accepting}
                                    style={{
                                        background: '#15803d', color: '#ffffff',
                                        border: 'none', borderRadius: 12,
                                        padding: '10px 20px', fontSize: 13, fontWeight: 700,
                                        cursor: accepting ? 'not-allowed' : 'pointer', fontFamily: font,
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        boxShadow: '0 4px 14px rgba(21,128,61,0.30)',
                                        opacity: accepting ? 0.75 : 1,
                                        transition: 'background 0.20s',
                                    }}
                                >
                                    {accepting ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                            style={{
                                                display: 'inline-block', width: 13, height: 13,
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid #ffffff', borderRadius: '50%',
                                            }}
                                        />
                                    ) : (
                                        <CheckCircle2 size={14} />
                                    )}
                                    {accepting
                                        ? (language === 'hi' ? 'हो रहा है...' : 'Accepting...')
                                        : (language === 'hi' ? 'अनुरोध स्वीकारें' : 'Accept Request')
                                    }
                                </motion.button>
                            )}
                        </AnimatePresence>
                    )}

                    {/* For traders — show "Your Request" badge */}
                    {!isFarmer && (
                        <span style={{
                            background: '#dbeafe', border: '1.5px solid #93c5fd',
                            borderRadius: 99, padding: '5px 12px',
                            fontSize: 11, fontWeight: 600, color: '#1d4ed8', fontFamily: font,
                        }}>
                            {language === 'hi' ? 'खरीदार की मांग' : 'Buyer Demand'}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OpenRequests({ language, onBack }: Props) {
    const [requests, setRequests] = useState<TraderRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiLive, setApiLive] = useState(false);
    const [isFarmer, setIsFarmer] = useState(false);

    useEffect(() => {
        const userRaw = localStorage.getItem('agrochain_user');
        if (userRaw) {
            try {
                const u = JSON.parse(userRaw);
                setIsFarmer(u.role === 'farmer' || !u.role);  // default to farmer if no role
            } catch { /* ignore */ }
        }
        fetchRequests();
    }, []);

    async function fetchRequests() {
        setLoading(true);
        const token = localStorage.getItem('agrochain_token');
        try {
            const res = await fetch('http://localhost:5000/api/request/open', {
                headers: { Authorization: `Bearer ${token ?? ''}` },
                signal: AbortSignal.timeout(3000),
            });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            setRequests(Array.isArray(data) ? data : data.requests ?? DUMMY_REQUESTS);
            setApiLive(true);
        } catch {
            setRequests(DUMMY_REQUESTS);
            setApiLive(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', fontFamily: font, paddingTop: 16 }}>
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42 }}
                    style={{ marginBottom: 28 }}
                >
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

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <h1 style={{
                                fontFamily: serif, fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 800,
                                color: '#111827', margin: 0, lineHeight: 1.2,
                            }}>
                                {language === 'hi' ? 'व्यापारी मांगें' : 'Open Buyer Requests'}
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6, fontFamily: font }}>
                                {language === 'hi'
                                    ? 'व्यापारियों की मांग देखें और सीधे अपनी फसल बेचें'
                                    : 'Browse what buyers need and sell your crops directly'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, color: '#1d4ed8',
                                    background: '#dbeafe', borderRadius: 99, padding: '3px 10px',
                                    border: '1px solid #93c5fd',
                                }}>
                                    {language === 'hi' ? 'स्रोत:' : 'Source:'} GET /api/request/open
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
                                {isFarmer && (
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, color: '#15803d',
                                        background: '#dcfce7', borderRadius: 99, padding: '3px 10px',
                                        border: '1px solid #86efac',
                                    }}>
                                        {language === 'hi' ? 'किसान दृश्य — स्वीकार बटन दिख रहा है' : 'Farmer View — Accept button visible'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.4 }}
                            onClick={fetchRequests}
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
                    </div>
                </motion.div>

                {/* Stats bar */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.12 }}
                        style={{
                            background: 'rgba(255,255,255,0.88)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            border: '1.5px solid rgba(255,255,255,0.70)',
                            borderRadius: 16, padding: '14px 20px',
                            marginBottom: 20,
                            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d' }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: font }}>
                                {requests.length} {language === 'hi' ? 'खुले अनुरोध' : 'open requests'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <AlertCircle size={14} color="#f59e0b" />
                            <span style={{ fontSize: 13, color: '#b45309', fontFamily: font }}>
                                {requests.filter(r => daysUntil(r.deliveryDate) <= 7).length} {language === 'hi' ? 'अर्जेंट' : 'urgent (≤7 days)'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock size={14} color="#6b7280" />
                            <span style={{ fontSize: 13, color: '#6b7280', fontFamily: font }}>
                                {language === 'hi' ? 'कुल मूल्य:' : 'Total value:'}{' '}
                                <strong style={{ color: '#15803d' }}>
                                    ₹{requests.reduce((s, r) => s + r.quantity * r.preferredPrice, 0).toLocaleString('en-IN')}
                                </strong>
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* List */}
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
                            {language === 'hi' ? 'अनुरोध लोड हो रहे हैं...' : 'Loading requests...'}
                        </p>
                    </div>
                ) : requests.length === 0 ? (
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
                            <Package size={26} color="#86efac" />
                        </div>
                        <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
                            {language === 'hi' ? 'कोई खुला अनुरोध नहीं' : 'No open requests'}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: 14, fontFamily: font }}>
                            {language === 'hi'
                                ? 'अभी कोई व्यापारी अनुरोध उपलब्ध नहीं है।'
                                : 'No buyer requests available right now. Check back soon.'}
                        </p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {requests.map((req, i) => (
                            <RequestCard
                                key={req.requestId}
                                req={req}
                                index={i}
                                language={language}
                                isFarmer={isFarmer}
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
