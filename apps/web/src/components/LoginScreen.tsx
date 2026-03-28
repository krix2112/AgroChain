import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout } from 'lucide-react';
import bgAsset from 'figma:asset/02a2b30228942223a501a2a4cb871849072179dd.png';

const LOGIN_BG =
    'https://images.unsplash.com/photo-1668398424217-18a8cade91f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwc3VucmlzZSUyMGRyYW1hdGljfGVufDF8fHx8MTc3NDUwNTczOXww&ixlib=rb-4.1.0&q=80&w=1440';

interface LoginScreenProps {
    onLogin: () => void;
    onRegister: () => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
    const [phone, setPhone] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (!showOtp) return;
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [showOtp, countdown]);

    const handlePhoneSubmit = () => {
        if (phone.length >= 10) {
            setShowOtp(true);
            setCountdown(30);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto-focus next
        if (value && index < 3) {
            const next = document.getElementById(`otp-${index + 1}`);
            next?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            prev?.focus();
        }
    };

    const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                fontFamily: font,
            }}
        >
            {/* ── Full-bleed Background ── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
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
                {/* Light warm overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255,252,235,0.15)',
                    }}
                />
            </div>

            {/* ── LEFT COLUMN — 52% — Frosted Glass Branding Panel ── */}
            <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="at-login-left"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '52%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderRight: '1.5px solid rgba(255,255,255,0.50)',
                    padding: '56px 52px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: '#2D6A2F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 10px rgba(45,106,47,0.30)',
                        }}
                    >
                        <Sprout style={{ width: 22, height: 22, color: 'white' }} />
                    </div>
                    <span
                        style={{
                            fontFamily: "'Noto Serif', serif",
                            fontSize: 26,
                            fontWeight: 700,
                            color: '#2D6A2F',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        AgroTrade
                    </span>
                </div>

                {/* Middle: Headlines */}
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, color: '#888', fontStyle: 'italic', marginBottom: 8 }}>
                        Kisan ka digital bazaar
                    </p>
                    <h1
                        style={{
                            fontFamily: "'Noto Serif', serif",
                            fontSize: 36,
                            fontWeight: 700,
                            color: '#1A1A1A',
                            lineHeight: 1.2,
                            marginBottom: 12,
                        }}
                    >
                        Welcome back, farmer.
                    </h1>
                    <p style={{ fontSize: 15, color: '#555', maxWidth: 380, lineHeight: 1.6 }}>
                        Log in to list your crops, check offers, and track your deliveries.
                    </p>

                    {/* Form */}
                    <div style={{ marginTop: 36 }}>
                        {/* Phone Number */}
                        <div style={{ marginBottom: showOtp ? 20 : 0 }}>
                            <label
                                style={{ display: 'block', fontSize: 14, color: '#555', marginBottom: 6, fontWeight: 500 }}
                            >
                                Mobile Number
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    height: 52,
                                    borderRadius: 12,
                                    border: '1.5px solid rgba(0,0,0,0.12)',
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.80)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 14px',
                                        background: '#F5F5F5',
                                        borderRight: '1.5px solid rgba(0,0,0,0.10)',
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: '#555',
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter your number"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    onKeyDown={e => e.key === 'Enter' && handlePhoneSubmit()}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        padding: '0 14px',
                                        fontSize: 16,
                                        color: '#1A1A1A',
                                        background: 'transparent',
                                        fontFamily: font,
                                    }}
                                />
                            </div>
                            <p style={{ marginTop: 6, fontSize: 12, color: '#AAA', fontStyle: 'italic' }}>
                                We'll send you a 4-digit OTP
                            </p>
                        </div>

                        {/* OTP Fields */}
                        <AnimatePresence>
                            {showOtp && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ marginBottom: 20 }}
                                >
                                    <label
                                        style={{ display: 'block', fontSize: 14, color: '#555', marginBottom: 12, fontWeight: 500 }}
                                    >
                                        Enter OTP
                                    </label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                id={`otp-${i}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                                style={{
                                                    width: 56,
                                                    height: 56,
                                                    textAlign: 'center',
                                                    fontSize: 24,
                                                    fontWeight: 700,
                                                    color: '#1A1A1A',
                                                    border: '1.5px solid rgba(0,0,0,0.12)',
                                                    borderRadius: 12,
                                                    background: 'rgba(255,255,255,0.80)',
                                                    outline: 'none',
                                                    fontFamily: font,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 12, color: '#888' }}>
                                            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Didn\'t receive OTP?'}
                                        </span>
                                        {countdown === 0 && (
                                            <button
                                                onClick={() => setCountdown(30)}
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: '#2D6A2F',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    fontFamily: font,
                                                }}
                                            >
                                                Resend
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Primary CTA */}
                        <motion.button
                            whileHover={{ boxShadow: '0 6px 28px rgba(45,106,47,0.50)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                if (!showOtp) {
                                    handlePhoneSubmit();
                                } else {
                                    onLogin();
                                }
                            }}
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
                                marginTop: showOtp ? 8 : 24,
                                boxShadow: '0 4px 18px rgba(45,106,47,0.35)',
                                fontFamily: font,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                            }}
                        >
                            <span>🌿</span>
                            {showOtp ? 'Login & Continue' : 'Send OTP'}
                        </motion.button>

                        {/* Divider */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                margin: '20px 0',
                            }}
                        >
                            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.10)' }} />
                            <span style={{ fontSize: 13, color: '#AAA' }}>— OR —</span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.10)' }} />
                        </div>

                        {/* Voice Login */}
                        <motion.button
                            whileHover={{ borderColor: '#2D6A2F', background: 'rgba(45,106,47,0.04)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onLogin}
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
                            Login with Voice
                        </motion.button>
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: 12,
                                color: '#888',
                                fontStyle: 'italic',
                                marginTop: 8,
                            }}
                        >
                            Speak your name and village to login
                        </p>
                    </div>
                </div>

                {/* Bottom: Register link */}
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    <span style={{ fontSize: 13, color: '#888' }}>New farmer? </span>
                    <button
                        onClick={onRegister}
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
                        Register here →
                    </button>
                </div>
            </motion.div>

            {/* ── RIGHT COLUMN — 48% — Background shows through ── */}
            <div
                className="at-login-right"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '48%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Floating Feature Card */}
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
                    {/* Large wheat emoji */}
                    <div style={{ textAlign: 'center', fontSize: 40, marginBottom: 12 }}>🌾</div>

                    {/* Main stat */}
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: 24,
                            fontWeight: 700,
                            color: 'white',
                            margin: 0,
                            fontFamily: font,
                            textShadow: '0 2px 8px rgba(0,0,0,0.30)',
                        }}
                    >
                        50,000+ farmers
                    </p>
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            color: 'rgba(255,255,255,0.80)',
                            marginTop: 6,
                            marginBottom: 0,
                        }}
                    >
                        already trading on AgroTrade
                    </p>

                    {/* Divider */}
                    <div
                        style={{
                            height: 1,
                            background: 'rgba(255,255,255,0.30)',
                            margin: '16px 0',
                        }}
                    />

                    {/* Stats rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            '✅  ₹2.4 Cr+ in trades completed',
                            '✅  1,200+ verified buyers',
                            '✅  Available in Hindi & English',
                        ].map((stat, i) => (
                            <p
                                key={i}
                                style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: 'white',
                                    textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                    fontFamily: font,
                                }}
                            >
                                {stat}
                            </p>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}