import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wheat, HelpCircle, CheckCircle2, Mic } from 'lucide-react';

const FARM_BG =
  'https://images.unsplash.com/photo-1639360811878-f77267beacd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdCUyMHN1bnJpc2UlMjBmYXJtfGVufDF8fHx8MTc3NDYxOTY2MXww&ixlib=rb-4.1.0&q=80&w=1080';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

const inputBase: React.CSSProperties = {
  width: '100%',
  height: 52,
  borderRadius: 10,
  border: '1.5px solid #d1fae5',
  background: 'white',
  fontSize: 15,
  color: '#111827',
  fontFamily: font,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s, box-shadow 0.18s',
};

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export function AgroChainLogin({ onLogin, onRegister, onBack }: Props) {
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!showOtp || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showOtp, countdown]);

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) { setShowOtp(true); setCountdown(30); }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 3) document.getElementById(`ac-otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`ac-otp-${idx - 1}`)?.focus();
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#14532d';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20,83,45,0.12)';
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#d1fae5';
    e.currentTarget.style.boxShadow = 'none';
  };

  /* ─── GLASS CARD (right panel) ─── */
  const GlassCard = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.35, ease: 'easeOut' }}
      style={{
        width: '100%',
        maxWidth: 360,
        background: 'rgba(255,255,255,0.17)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.38)',
        borderRadius: 24,
        padding: '32px 36px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(74,222,128,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74,222,128,0.3)' }}>
          <Wheat style={{ width: 28, height: 28, color: '#4ade80' }} />
        </div>
      </div>
      <p style={{
        textAlign: 'center', fontSize: 24, fontWeight: 800, color: 'white',
        margin: 0, fontFamily: serif, textShadow: '0 2px 10px rgba(0,0,0,0.30)',
      }}>
        50,000+ farmers
      </p>
      <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.82)', marginTop: 6, marginBottom: 0 }}>
        already trading on AgroChain
      </p>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.28)', margin: '20px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          '₹2.4 Cr+ in trades completed',
          '1,200+ verified buyers',
          'Available in Hindi & English',
        ].map((s, i) => (
          <div key={i} style={{
            margin: 0, fontSize: 14, color: 'white', fontFamily: font,
            fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.28)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <CheckCircle2 style={{ width: 15, height: 15, color: '#4ade80', flexShrink: 0 }} />
            {s}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: font, overflow: 'hidden' }}>

      {/* ── LEFT PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="ac-login-left"
        style={{
          width: '50%',
          height: '100%',
          background: '#f0fdf4',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9, background: '#052e16',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(5,46,22,0.28)', flexShrink: 0,
          }}>
            <Wheat style={{ width: 20, height: 20, color: 'white' }} />
          </div>
          <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 800, color: '#052e16', letterSpacing: '-0.02em' }}>
            AgroChain
          </span>
        </div>

        {/* Middle — main form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 0' }}>
          {/* Tagline */}
          <p style={{ fontSize: 14, color: '#9ca3af', fontStyle: 'italic', marginBottom: 10 }}>
            Kisan ka digital bazaar
          </p>

          {/* Heading */}
          <h1 style={{
            fontFamily: serif, fontSize: 'clamp(28px, 2.6vw, 38px)', fontWeight: 800,
            color: '#052e16', lineHeight: 1.18, marginBottom: 10,
          }}>
            Welcome back, farmer.
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
            Log in to list your crops, check offers, and track your deliveries.
          </p>

          {/* FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

            {/* Mobile field */}
            <label style={{ display: 'block', fontSize: 14, color: '#374151', fontWeight: 500, marginBottom: 6 }}>
              Mobile Number
            </label>
            <div style={{
              display: 'flex', height: 52, borderRadius: 10,
              border: '1.5px solid #d1fae5', overflow: 'hidden', background: 'white',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', padding: '0 14px',
                background: '#f0fdf4', borderRight: '1.5px solid #d1fae5',
                fontSize: 15, fontWeight: 600, color: '#374151',
                flexShrink: 0, whiteSpace: 'nowrap', minWidth: 52, justifyContent: 'center',
              }}>
                +91
              </div>
              <input
                type="tel"
                placeholder="Enter your number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => e.key === 'Enter' && handlePhoneSubmit()}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  padding: '0 14px', fontSize: 15, color: '#111827',
                  background: 'transparent', fontFamily: font,
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginTop: 5, marginBottom: 16 }}>
              We'll send you a 4-digit OTP
            </p>

            {/* OTP fields */}
            <AnimatePresence>
              {showOtp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  style={{ marginBottom: 16 }}
                >
                  <label style={{ display: 'block', fontSize: 14, color: '#374151', fontWeight: 500, marginBottom: 12 }}>
                    Enter OTP
                  </label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`ac-otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        onFocus={e => { e.currentTarget.style.borderColor = '#14532d'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20,83,45,0.12)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#d1fae5'; e.currentTarget.style.boxShadow = 'none'; }}
                        style={{
                          width: 54, height: 54, textAlign: 'center',
                          fontSize: 22, fontWeight: 700, color: '#052e16',
                          border: '1.5px solid #d1fae5', borderRadius: 10,
                          background: 'white', outline: 'none', fontFamily: font,
                          transition: 'border-color 0.18s, box-shadow 0.18s',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Didn't receive OTP?"}
                    </span>
                    {countdown === 0 && (
                      <button
                        onClick={() => setCountdown(30)}
                        style={{
                          fontSize: 12, fontWeight: 600, color: '#166534',
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: font,
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
              whileHover={{ boxShadow: '0 8px 28px rgba(20,83,45,0.42)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { if (!showOtp) handlePhoneSubmit(); else onLogin(); }}
              style={{
                width: '100%', height: 52, background: '#14532d', color: 'white',
                border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700,
                cursor: 'pointer', fontFamily: font,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(20,83,45,0.30)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {showOtp ? 'Login & Continue' : 'Send OTP'}
            </motion.button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 13, color: '#9ca3af' }}>— OR —</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {/* Voice login */}
            <motion.button
              whileHover={{ borderColor: '#14532d', background: 'rgba(20,83,45,0.05)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogin}
              style={{
                width: '100%', height: 52, background: 'rgba(0,0,0,0)',
                border: '1.5px solid #d1fae5', borderRadius: 10,
                color: '#374151', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: font,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <Mic size={20} color="#374151" />
              Login with Voice
            </motion.button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginTop: 7, marginBottom: 0 }}>
              Speak your name and village to login
            </p>
          </div>
        </div>

        {/* Bottom — register link */}
        <div style={{ paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: 14, color: '#6b7280' }}>New farmer? </span>
          <button
            onClick={onRegister}
            style={{
              fontSize: 14, fontWeight: 700, color: '#166534',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, fontFamily: font,
            }}
          >
            Register here →
          </button>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="ac-login-right"
        style={{
          width: '50%', height: '100%',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <img
          src={FARM_BG}
          alt="Farm field"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: 'blur(4px)', transform: 'scale(1.06)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(5,46,22,0.50) 0%, rgba(20,83,45,0.28) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
        }}>
          {GlassCard}
        </div>
      </div>

      {/* ── Floating Help Button ── */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
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
        <HelpCircle size={20} color="white" />
      </motion.button>

      {/* ── Back to landing ── */}
      <button
        onClick={onBack}
        style={{
          position: 'fixed', top: 20, left: 20, zIndex: 200,
          background: 'rgba(255,255,255,0.90)', border: '1px solid #d1fae5',
          borderRadius: 99, padding: '7px 16px',
          fontSize: 13, fontWeight: 600, color: '#14532d',
          cursor: 'pointer', fontFamily: font,
          backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        ← Back
      </button>

      <style>{`
        @media (max-width: 767px) {
          .ac-login-left {
            width: 100% !important;
            padding: 32px 24px !important;
          }
          .ac-login-right { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .ac-login-left { width: 58% !important; padding: 40px 36px !important; }
          .ac-login-right { width: 42% !important; }
        }
      `}</style>
    </div>
  );
}
