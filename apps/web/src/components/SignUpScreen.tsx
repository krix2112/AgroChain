import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, ChevronLeft, User, MapPin } from 'lucide-react';
import bgAsset from 'figma:asset/02a2b30228942223a501a2a4cb871849072179dd.png';

interface SignUpScreenProps {
    onBack: () => void;
    onSignUp: () => void;
}

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const CROP_OPTIONS = [
    { id: 'wheat', emoji: '🌾', label: 'Wheat' },
    { id: 'tomato', emoji: '🍅', label: 'Tomato' },
    { id: 'onion', emoji: '🧅', label: 'Onion' },
    { id: 'more', emoji: '➕', label: 'More' },
];

export function SignUpScreen({ onBack, onSignUp }: SignUpScreenProps) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [village, setVillage] = useState('');
    const [state, setState] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('tomato');
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [agreed, setAgreed] = useState(false);
    const [showStateDropdown, setShowStateDropdown] = useState(false);

    const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

    const inputStyle: React.CSSProperties = {
        height: 52,
        borderRadius: 12,
        border: '1.5px solid rgba(0,0,0,0.12)',
        background: 'rgba(255,255,255,0.85)',
        width: '100%',
        fontSize: 15,
        color: '#1A1A1A',
        fontFamily: font,
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: 14,
        color: '#444',
        fontWeight: 600,
        marginBottom: 6,
        fontFamily: font,
    };

    return (
        <div
            style={{
                width: '100vw',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                fontFamily: font,
            }}
        >
            {/* ── Full-bleed Background ── */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <img
                    src={bgAsset}
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        filter: 'blur(10px)',
                        transform: 'scale(1.04)',
                    }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,252,235,0.15)' }} />
            </div>

            {/* ── LEFT COLUMN — 52% ── */}
            <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '52%',
                    minHeight: '100vh',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderRight: '1.5px solid rgba(255,255,255,0.50)',
                    padding: '40px 52px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                }}
                className="signup-left-col"
            >
                {/* ── Logo + Back ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                background: '#2D6A2F',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 3px 10px rgba(45,106,47,0.30)',
                                flexShrink: 0,
                            }}
                        >
                            <Sprout style={{ width: 20, height: 20, color: 'white' }} />
                        </div>
                        <span
                            style={{
                                fontFamily: "'Noto Serif', serif",
                                fontSize: 22,
                                fontWeight: 700,
                                color: '#2D6A2F',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            AgroTrade
                        </span>
                    </div>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#2D6A2F',
                            fontFamily: font,
                            padding: '6px 0',
                        }}
                    >
                        <ChevronLeft style={{ width: 16, height: 16 }} />
                        Back to Login
                    </button>
                </div>

                {/* ── Heading ── */}
                <div style={{ marginTop: 28 }}>
                    <h1
                        style={{
                            fontFamily: "'Noto Serif', serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#1A1A1A',
                            margin: 0,
                            lineHeight: 1.2,
                        }}
                    >
                        Create your account
                    </h1>
                    <p style={{ fontSize: 15, color: '#555', marginTop: 8, marginBottom: 0, lineHeight: 1.6 }}>
                        Join 50,000+ farmers already trading smarter.
                    </p>
                </div>

                {/* ── Form ── */}
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Field 1 — Full Name */}
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User
                                style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 17,
                                    height: 17,
                                    color: '#AAA',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="e.g. Ramesh Kumar"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: 42, paddingRight: 16 }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#2D6A2F'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,47,0.12)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    {/* Field 2 — Mobile Number */}
                    <div>
                        <label style={labelStyle}>Mobile Number</label>
                        <div
                            style={{
                                display: 'flex',
                                height: 52,
                                borderRadius: 12,
                                border: '1.5px solid rgba(0,0,0,0.12)',
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.85)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0 14px',
                                    background: '#F5F5F5',
                                    borderRight: '1px solid #DDD',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: '#555',
                                    flexShrink: 0,
                                    whiteSpace: 'nowrap',
                                    minWidth: 48,
                                    justifyContent: 'center',
                                }}
                            >
                                +91
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter your 10-digit number"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    padding: '0 14px',
                                    fontSize: 15,
                                    color: '#1A1A1A',
                                    background: 'transparent',
                                    fontFamily: font,
                                }}
                            />
                        </div>
                        <p style={{ marginTop: 5, fontSize: 12, color: '#888', fontStyle: 'italic' }}>
                            A 4-digit OTP will be sent to verify
                        </p>
                    </div>

                    {/* Field 3 — Village / District */}
                    <div>
                        <label style={labelStyle}>Village / District</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin
                                style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 17,
                                    height: 17,
                                    color: '#AAA',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="e.g. Mathura, Uttar Pradesh"
                                value={village}
                                onChange={e => setVillage(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: 42, paddingRight: 16 }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#2D6A2F'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,47,0.12)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    {/* Field 4 — State */}
                    <div style={{ position: 'relative' }}>
                        <label style={labelStyle}>State</label>
                        <button
                            onClick={() => setShowStateDropdown(v => !v)}
                            style={{
                                ...inputStyle,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 16px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                background: 'rgba(255,255,255,0.85)',
                            }}
                        >
                            <span style={{ color: state ? '#1A1A1A' : '#888', fontSize: 15 }}>
                                {state || 'Select your state'}
                            </span>
                            <span style={{ color: '#888', fontSize: 12, transform: showStateDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                        </button>
                        <AnimatePresence>
                            {showStateDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 4px)',
                                        left: 0,
                                        right: 0,
                                        background: 'rgba(255,255,255,0.97)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1.5px solid rgba(0,0,0,0.10)',
                                        borderRadius: 12,
                                        zIndex: 100,
                                        maxHeight: 220,
                                        overflowY: 'auto',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                    }}
                                >
                                    {INDIAN_STATES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setState(s); setShowStateDropdown(false); }}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '11px 16px',
                                                textAlign: 'left',
                                                background: state === s ? 'rgba(45,106,47,0.08)' : 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: 14,
                                                color: state === s ? '#2D6A2F' : '#333',
                                                fontWeight: state === s ? 600 : 400,
                                                fontFamily: font,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => { if (state !== s) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                                            onMouseLeave={e => { if (state !== s) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Field 5 — Primary Crop */}
                    <div>
                        <label style={labelStyle}>Primary Crop</label>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {CROP_OPTIONS.map(crop => (
                                <motion.button
                                    key={crop.id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCrop(crop.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '8px 14px',
                                        borderRadius: 20,
                                        border: selectedCrop === crop.id ? '1.5px solid #2D6A2F' : '1.5px solid #DDD',
                                        background: selectedCrop === crop.id ? '#2D6A2F' : 'rgba(255,255,255,0.85)',
                                        color: selectedCrop === crop.id ? 'white' : '#555',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        fontFamily: font,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span>{crop.emoji}</span>
                                    <span>{crop.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Field 6 — Language Preference */}
                    <div>
                        <label style={labelStyle}>Preferred Language</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {[
                                { id: 'en', flag: '🇬🇧', label: 'English' },
                                { id: 'hi', flag: '🇮🇳', label: 'हिंदी' },
                            ].map(lang => (
                                <motion.button
                                    key={lang.id}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setLanguage(lang.id as 'en' | 'hi')}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        padding: '10px 20px',
                                        borderRadius: 10,
                                        border: language === lang.id ? '1.5px solid #2D6A2F' : '1.5px solid #DDD',
                                        background: language === lang.id ? '#2D6A2F' : 'rgba(255,255,255,0.85)',
                                        color: language === lang.id ? 'white' : '#555',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fontFamily: font,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span style={{ fontSize: 18 }}>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Terms */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <button
                            onClick={() => setAgreed(v => !v)}
                            style={{
                                width: 20,
                                height: 20,
                                minWidth: 20,
                                borderRadius: 5,
                                border: `2px solid ${agreed ? '#2D6A2F' : '#CCC'}`,
                                background: agreed ? '#2D6A2F' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 1,
                                transition: 'all 0.2s',
                                padding: 0,
                            }}
                        >
                            {agreed && <span style={{ color: 'white', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                        </button>
                        <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.5, fontFamily: font }}>
                            I agree to the{' '}
                            <span style={{ color: '#2D6A2F', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                                Terms &amp; Conditions
                            </span>
                            {' '}and{' '}
                            <span style={{ color: '#2D6A2F', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                                Privacy Policy
                            </span>
                        </p>
                    </div>

                    {/* Primary CTA */}
                    <motion.button
                        whileHover={{ boxShadow: '0 6px 28px rgba(45,106,47,0.50)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onSignUp}
                        style={{
                            width: '100%',
                            height: 56,
                            background: '#2D6A2F',
                            color: 'white',
                            border: 'none',
                            borderRadius: 14,
                            fontSize: 17,
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginTop: 4,
                            boxShadow: '0 4px 18px rgba(45,106,47,0.35)',
                            fontFamily: font,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <span>🌿</span>
                        Create Account
                    </motion.button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.10)' }} />
                        <span style={{ fontSize: 13, color: '#AAA' }}>— OR —</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.10)' }} />
                    </div>

                    {/* Voice Signup */}
                    <div>
                        <motion.button
                            whileHover={{ borderColor: '#2D6A2F', background: 'rgba(45,106,47,0.04)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onSignUp}
                            style={{
                                width: '100%',
                                height: 52,
                                background: 'transparent',
                                border: '1.5px solid #2D6A2F',
                                borderRadius: 14,
                                color: '#2D6A2F',
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: font,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                transition: 'all 0.2s',
                            }}
                        >
                            <span>🎤</span>
                            Register with Voice
                        </motion.button>
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 7, marginBottom: 0 }}>
                            Speak your name, village and crop to register
                        </p>
                    </div>
                </div>

                {/* Bottom: Already have account */}
                <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    <span style={{ fontSize: 13, color: '#888' }}>Already have an account? </span>
                    <button
                        onClick={onBack}
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#2D6A2F',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            fontFamily: font,
                        }}
                    >
                        Login →
                    </button>
                </div>
            </motion.div>

            {/* ── RIGHT COLUMN — 48% ── */}
            <div
                className="signup-right-col"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '48%',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    style={{
                        width: 380,
                        background: 'rgba(255,255,255,0.22)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.40)',
                        borderRadius: 20,
                        padding: '28px 32px',
                    }}
                >
                    {/* Rocket emoji */}
                    <div style={{ textAlign: 'center', fontSize: 40, marginBottom: 12 }}>🚀</div>

                    {/* Heading */}
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: 22,
                            fontWeight: 700,
                            color: 'white',
                            margin: 0,
                            fontFamily: font,
                            textShadow: '0 2px 8px rgba(0,0,0,0.30)',
                            lineHeight: 1.3,
                        }}
                    >
                        Start selling in 3 minutes
                    </p>

                    {/* Divider */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.30)', margin: '16px 0' }} />

                    {/* Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { num: '①', text: 'Enter your mobile number' },
                            { num: '②', text: 'Verify with OTP' },
                            { num: '③', text: 'List your first crop & get offers' },
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                            >
                                <span
                                    style={{
                                        fontSize: 18,
                                        lineHeight: 1.2,
                                        flexShrink: 0,
                                        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.20))',
                                    }}
                                >
                                    {step.num}
                                </span>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 13,
                                        color: 'white',
                                        fontFamily: font,
                                        textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {step.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom stat */}
                    <div
                        style={{
                            marginTop: 16,
                            paddingTop: 14,
                            borderTop: '1px solid rgba(255,255,255,0.25)',
                        }}
                    >
                        <p
                            style={{
                                textAlign: 'center',
                                margin: 0,
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.80)',
                                fontStyle: 'italic',
                                fontFamily: font,
                                textShadow: '0 1px 4px rgba(0,0,0,0.20)',
                                lineHeight: 1.5,
                            }}
                        >
                            Average first offer received within 2 hours
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── Responsive styles ── */}
            <style>{`
        @media (max-width: 767px) {
          .signup-left-col {
            width: 100% !important;
            padding: 24px 20px !important;
            border-right: none !important;
            min-height: 100vh !important;
          }
          .signup-right-col {
            display: none !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .signup-left-col {
            width: 60% !important;
            padding: 36px 36px !important;
          }
          .signup-right-col {
            width: 40% !important;
          }
        }
      `}</style>
        </div>
    );
}
