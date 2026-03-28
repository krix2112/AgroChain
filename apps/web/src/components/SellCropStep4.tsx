import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Save, Zap } from 'lucide-react';
import { SellCropStepper } from './SellCropStepper';

const TOMATO_HERO =
    'https://images.unsplash.com/photo-1689154683800-391752e77996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzJTIwaGFydmVzdCUyMHJlYWxpc3RpY3xlbnwxfHx8fDE3NzQ1MDc2NDN8MA&ixlib=rb-4.1.0&q=80&w=1200';

interface SummaryRowProps {
    label: string;
    value: string;
    valueStyle?: React.CSSProperties;
    isLast?: boolean;
}

function SummaryRow({ label, value, valueStyle, isLast }: SummaryRowProps) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '13px 0',
                borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.07)',
            }}
        >
            <span
                style={{
                    fontSize: 14,
                    color: '#888',
                    fontFamily: "'Noto Sans', sans-serif",
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    fontFamily: "'Noto Sans', sans-serif",
                    textAlign: 'right',
                    ...valueStyle,
                }}
            >
                {value}
            </span>
        </div>
    );
}

interface SellCropStep4Props {
    language: 'en' | 'hi';
    onBack: () => void;
    onPost: () => void;
}

export function SellCropStep4({ language, onBack, onPost }: SellCropStep4Props) {
    const [listingMode, setListingMode] = useState<'live' | 'offline'>('live');
    const [posted, setPosted] = useState(false);

    const t = {
        pageTitle: language === 'en' ? 'Sell Crop' : 'फसल बेचें',
        pageSubtitle:
            language === 'en'
                ? 'List your produce, set quantity, quality, and get offers from buyers.'
                : 'अपनी फसल सूचीबद्ध करें, मात्रा, गुणवत्ता तय करें और खरीदारों से ऑफर पाएं।',
        panelHeading: language === 'en' ? 'Confirm Your Listing' : 'अपनी लिस्टिंग की पुष्टि करें',
        panelSub: language === 'en' ? 'Review your details before posting.' : 'पोस्ट करने से पहले अपना विवरण जांचें।',
        cropLabel: language === 'en' ? 'Crop' : 'फसल',
        cropValue: language === 'en' ? 'Tomato' : 'टमाटर',
        qtyLabel: language === 'en' ? 'Quantity' : 'मात्रा',
        qtyValue: language === 'en' ? '2,000 Kg' : '2,000 किग्रा',
        qualityLabel: language === 'en' ? 'Quality' : 'गुणवत्ता',
        qualityValue: language === 'en' ? 'Medium Grade · Very Fresh' : 'मध्यम ग्रेड · बहुत ताज़ा',
        moistureLabel: language === 'en' ? 'Freshness' : 'ताज़गी',
        moistureValue: language === 'en' ? 'Fresh' : 'ताज़ा',
        priceLabel: language === 'en' ? 'Expected Price' : 'अपेक्षित मूल्य',
        priceValue: '₹ 24 / Kg',
        totalLabel: language === 'en' ? 'Total Value' : 'कुल मूल्य',
        totalValue: '₹ 48,000',
        liveLabel: language === 'en' ? 'Will go live instantly' : 'तुरंत लाइव होगी',
        offlineLabel: language === 'en' ? 'Save offline for later' : 'बाद के लिए सहेजें',
        postBtn: language === 'en' ? '🌿 Post Listing' : '🌿 लिस्टिंग पोस्ट करें',
        backBtn: language === 'en' ? '← Back and Edit' : '← वापस और संपादित करें',
        successMsg: language === 'en' ? '🎉 Your listing is live!' : '🎉 आपकी लिस्टिंग लाइव है!',
        successSub:
            language === 'en'
                ? 'Buyers will start sending offers soon.'
                : 'खरीदार जल्द ही ऑफर भेजना शुरू करेंगे।',
    };

    if (posted) {
        return (
            <div
                style={{
                    paddingTop: 64,
                    minHeight: 'calc(100vh - 72px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    style={{
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1.5px solid rgba(255,255,255,0.60)',
                        borderRadius: 28,
                        padding: '60px 60px',
                        textAlign: 'center',
                        maxWidth: 480,
                        boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
                    }}
                >
                    {/* Green checkmark circle */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.15 }}
                        style={{
                            width: 84,
                            height: 84,
                            borderRadius: '50%',
                            background: '#2D6A2F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 6px 24px rgba(45,106,47,0.35)',
                        }}
                    >
                        <Check style={{ width: 44, height: 44, color: 'white', strokeWidth: 2.5 }} />
                    </motion.div>
                    <h2
                        style={{
                            fontFamily: "'Noto Serif', serif",
                            fontSize: 26,
                            fontWeight: 700,
                            color: '#1A1A1A',
                            marginBottom: 12,
                        }}
                    >
                        {t.successMsg}
                    </h2>
                    <p style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>{t.successSub}</p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPosted(false)}
                        style={{
                            background: '#2D6A2F',
                            border: 'none',
                            borderRadius: 12,
                            padding: '14px 36px',
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: "'Noto Sans', sans-serif",
                        }}
                    >
                        {language === 'en' ? 'View My Listings' : 'मेरी लिस्टिंग देखें'}
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="at-page-wrap"
            style={{
                paddingTop: 64,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                minHeight: 'calc(100vh - 72px)',
            }}
        >
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="at-page-header"
                style={{ paddingLeft: 80, paddingTop: 32, paddingBottom: 20 }}
            >
                <h1
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: 7,
                        textShadow: '0 1px 8px rgba(255,255,255,0.80)',
                    }}
                >
                    {t.pageTitle}
                </h1>
                <p style={{ fontSize: 15, color: '#555', textShadow: '0 1px 6px rgba(255,255,255,0.55)' }}>
                    {t.pageSubtitle}
                </p>
            </motion.div>

            {/* 720px centered column (slightly narrower for focus) */}
            <div className="at-sell-container" style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 40px' }}>
                {/* Stepper — keep 860px width feel, centered */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <SellCropStepper currentStep={4} language={language} />
                </motion.div>

                {/* ── Main Glass Panel ── */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{
                        background: 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1.5px solid rgba(255,255,255,0.50)',
                        borderRadius: 24,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                        overflow: 'hidden',
                        marginBottom: 22,
                    }}
                >
                    {/* Panel heading (inside padded area) */}
                    <div style={{ padding: '32px 36px 0' }}>
                        <h2
                            style={{
                                fontFamily: "'Noto Serif', serif",
                                fontSize: 24,
                                fontWeight: 700,
                                color: '#1A1A1A',
                                textAlign: 'center',
                                marginBottom: 6,
                            }}
                        >
                            {t.panelHeading}
                        </h2>
                        <p style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 }}>
                            {t.panelSub}
                        </p>
                    </div>

                    {/* ── Crop Hero Image ── */}
                    <div
                        style={{
                            margin: '0 36px 0',
                            borderRadius: 14,
                            overflow: 'hidden',
                            height: 160,
                            position: 'relative',
                        }}
                    >
                        <img
                            src={TOMATO_HERO}
                            alt="Tomato"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        />
                        {/* Warm overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg, rgba(180,40,20,0.55) 0%, rgba(220,80,30,0.30) 100%)',
                            }}
                        />
                        {/* Crop label over image */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 20,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <span style={{ fontSize: 32 }}>🍅</span>
                            <span
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: 'white',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                    fontFamily: "'Noto Serif', serif",
                                }}
                            >
                                {t.cropValue}
                            </span>
                        </div>
                    </div>

                    {/* ── Summary Table ── */}
                    <div style={{ padding: '4px 36px 0' }}>
                        <SummaryRow label={t.cropLabel} value={t.cropValue} />
                        <SummaryRow label={t.qtyLabel} value={t.qtyValue} />
                        <SummaryRow label={t.qualityLabel} value={t.qualityValue} />
                        <SummaryRow label={t.moistureLabel} value={t.moistureValue} />
                        <SummaryRow
                            label={t.priceLabel}
                            value={t.priceValue}
                            valueStyle={{ color: '#2D6A2F', fontSize: 18 }}
                        />
                        <SummaryRow
                            label={t.totalLabel}
                            value={t.totalValue}
                            valueStyle={{ color: '#2D6A2F', fontSize: 22 }}
                            isLast
                        />
                    </div>

                    {/* ── Listing mode options ── */}
                    <div style={{ padding: '20px 36px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Option 1 — Go live */}
                        <motion.button
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setListingMode('live')}
                            style={{
                                background: listingMode === 'live' ? '#E8F5E9' : 'rgba(255,255,255,0.50)',
                                border: listingMode === 'live' ? '2px solid #2D6A2F' : '1px solid #DDD',
                                borderRadius: 12,
                                padding: '14px 18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                textAlign: 'left',
                                transition: 'all 0.18s',
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: listingMode === 'live' ? '#2D6A2F' : 'transparent',
                                    border: listingMode === 'live' ? '2px solid #2D6A2F' : '2px solid #CCC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    transition: 'all 0.15s',
                                }}
                            >
                                {listingMode === 'live' && <Check style={{ width: 14, height: 14, color: 'white', strokeWidth: 3 }} />}
                            </div>
                            <Zap style={{ width: 18, height: 18, color: listingMode === 'live' ? '#2D6A2F' : '#AAA' }} />
                            <span
                                style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: listingMode === 'live' ? '#2D6A2F' : '#666',
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                }}
                            >
                                {t.liveLabel}
                            </span>
                        </motion.button>

                        {/* Option 2 — Save offline */}
                        <motion.button
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setListingMode('offline')}
                            style={{
                                background: listingMode === 'offline' ? '#E8F5E9' : 'rgba(255,255,255,0.50)',
                                border: listingMode === 'offline' ? '2px solid #2D6A2F' : '1px solid #DDD',
                                borderRadius: 12,
                                padding: '14px 18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                textAlign: 'left',
                                transition: 'all 0.18s',
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: listingMode === 'offline' ? '#2D6A2F' : 'transparent',
                                    border: listingMode === 'offline' ? '2px solid #2D6A2F' : '2px solid #CCC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    transition: 'all 0.15s',
                                }}
                            >
                                {listingMode === 'offline' && <Check style={{ width: 14, height: 14, color: 'white', strokeWidth: 3 }} />}
                            </div>
                            <Save style={{ width: 18, height: 18, color: listingMode === 'offline' ? '#2D6A2F' : '#AAA' }} />
                            <span
                                style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: listingMode === 'offline' ? '#2D6A2F' : '#666',
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                }}
                            >
                                {t.offlineLabel}
                            </span>
                        </motion.button>
                    </div>

                    {/* ── Action buttons ── */}
                    <div style={{ padding: '20px 36px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Primary: Post Listing */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(45,106,47,0.48)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                onPost();
                                setPosted(true);
                            }}
                            style={{
                                width: '100%',
                                height: 56,
                                background: '#2D6A2F',
                                border: 'none',
                                borderRadius: 14,
                                color: 'white',
                                fontSize: 17,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                boxShadow: '0 4px 18px rgba(45,106,47,0.40)',
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            }}
                        >
                            {t.postBtn}
                        </motion.button>

                        {/* Secondary: Back and Edit */}
                        <motion.button
                            whileHover={{ background: 'rgba(45,106,47,0.06)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onBack}
                            style={{
                                width: '100%',
                                height: 48,
                                background: 'transparent',
                                border: '1.5px solid #2D6A2F',
                                borderRadius: 12,
                                color: '#2D6A2F',
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            }}
                        >
                            {t.backBtn}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}