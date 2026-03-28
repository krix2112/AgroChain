import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wheat, User, MapPin, ChevronDown, ChevronLeft, HelpCircle } from 'lucide-react';

const FARM_BG =
  'https://images.unsplash.com/photo-1639360811878-f77267beacd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdCUyMHN1bnJpc2UlMjBmYXJtfGVufDF8fHx8MTc3NDYxOTY2MXww&ixlib=rb-4.1.0&q=80&w=1080';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const CROPS = [
  { id: 'wheat',  emoji: '🌾', label: 'Wheat' },
  { id: 'tomato', emoji: '🍅', label: 'Tomato' },
  { id: 'onion',  emoji: '🧅', label: 'Onion' },
  { id: 'more',   emoji: '➕', label: 'More' },
];

interface Props {
  onBack: () => void;
  onSignUp: () => void;
}

export function AgroChainRegister({ onBack, onSignUp }: Props) {
  const [fullName, setFullName]           = useState('');
  const [phone, setPhone]                 = useState('');
  const [village, setVillage]             = useState('');
  const [state, setState]                 = useState('');
  const [selectedCrop, setSelectedCrop]   = useState('tomato');
  const [language, setLanguage]           = useState<'en' | 'hi'>('en');
  const [agreed, setAgreed]               = useState(false);
  const [showDrop, setShowDrop]           = useState(false);

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#14532d';
    e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(20,83,45,0.12)';
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#d1fae5';
    e.currentTarget.style.boxShadow   = 'none';
  };

  const inputBase: React.CSSProperties = {
    width: '100%', height: 50, borderRadius: 10,
    border: '1.5px solid #d1fae5', background: 'white',
    fontSize: 15, color: '#111827', fontFamily: font,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 14, color: '#374151',
    fontWeight: 500, marginBottom: 7, fontFamily: font,
  };

  /* ─── Right-panel glass card ─── */
  const GlassCard = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.35, ease: 'easeOut' }}
      style={{
        width: '100%', maxWidth: 360,
        background: 'rgba(255,255,255,0.17)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.38)',
        borderRadius: 24, padding: '32px 36px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ textAlign: 'center', fontSize: 44, marginBottom: 14 }}>🚀</div>
      <p style={{
        textAlign: 'center', fontSize: 22, fontWeight: 800, color: 'white',
        margin: 0, fontFamily: serif, textShadow: '0 2px 10px rgba(0,0,0,0.30)', lineHeight: 1.3,
      }}>
        Start selling in 3 minutes
      </p>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.28)', margin: '20px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { num: '1', text: 'Enter your mobile number' },
          { num: '2', text: 'Verify with OTP' },
          { num: '3', text: 'List your first crop & get offers' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#14532d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 13, fontWeight: 800, color: 'white',
              fontFamily: serif, boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            }}>
              {s.num}
            </div>
            <p style={{
              margin: 0, fontSize: 14, color: 'white', fontFamily: font,
              fontWeight: 500, textShadow: '0 1px 5px rgba(0,0,0,0.25)', lineHeight: 1.5,
            }}>
              {s.text}
            </p>
          </motion.div>
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.22)', margin: '20px 0' }} />
      <p style={{
        textAlign: 'center', margin: 0, fontSize: 13,
        color: 'rgba(255,255,255,0.78)', fontStyle: 'italic', fontFamily: font, lineHeight: 1.5,
      }}>
        Average first offer received within 2 hours
      </p>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', fontFamily: font, overflow: 'hidden' }}>

      {/* ── LEFT PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="ac-reg-left"
        style={{
          width: '50%', minHeight: '100vh',
          background: '#f0fdf4',
          padding: '40px 52px 48px',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto', boxSizing: 'border-box',
          position: 'relative', zIndex: 2,
        }}
      >
        {/* Top bar: Logo + Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
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
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: '#166534', fontFamily: font, padding: '6px 0',
            }}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
            Back to Login
          </button>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: serif, fontSize: 'clamp(26px, 2.4vw, 34px)', fontWeight: 800,
            color: '#052e16', margin: 0, lineHeight: 1.2,
          }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 8, marginBottom: 0, lineHeight: 1.6 }}>
            Join 50,000+ farmers already trading smarter.
          </p>
        </div>

        {/* FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>

          {/* Field 1 — Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                width: 16, height: 16, color: '#9ca3af', pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onFocus={focusBorder} onBlur={blurBorder}
                style={{ ...inputBase, paddingLeft: 42, paddingRight: 16 }}
              />
            </div>
          </div>

          {/* Field 2 — Mobile */}
          <div>
            <label style={labelStyle}>Mobile Number</label>
            <div style={{
              display: 'flex', height: 50, borderRadius: 10,
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
                placeholder="Enter your 10-digit number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  padding: '0 14px', fontSize: 15, color: '#111827',
                  background: 'transparent', fontFamily: font,
                }}
              />
            </div>
            <p style={{ marginTop: 5, fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
              A 4-digit OTP will be sent to verify
            </p>
          </div>

          {/* Field 3 — Village */}
          <div>
            <label style={labelStyle}>Village / District</label>
            <div style={{ position: 'relative' }}>
              <MapPin style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                width: 16, height: 16, color: '#9ca3af', pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="e.g. Mathura, Uttar Pradesh"
                value={village}
                onChange={e => setVillage(e.target.value)}
                onFocus={focusBorder} onBlur={blurBorder}
                style={{ ...inputBase, paddingLeft: 42, paddingRight: 16 }}
              />
            </div>
          </div>

          {/* Field 4 — State dropdown */}
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>State</label>
            <button
              onClick={() => setShowDrop(v => !v)}
              style={{
                ...inputBase,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', cursor: 'pointer', textAlign: 'left',
                borderColor: showDrop ? '#14532d' : '#d1fae5',
                boxShadow: showDrop ? '0 0 0 3px rgba(20,83,45,0.12)' : 'none',
              }}
            >
              <span style={{ color: state ? '#111827' : '#9ca3af', fontSize: 15 }}>
                {state || 'Select your state'}
              </span>
              <ChevronDown
                style={{
                  width: 16, height: 16, color: '#9ca3af', flexShrink: 0,
                  transform: showDrop ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            <AnimatePresence>
              {showDrop && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 4px)',
                    left: 0, right: 0,
                    background: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(12px)',
                    border: '1.5px solid #d1fae5',
                    borderRadius: 10, zIndex: 100,
                    maxHeight: 220, overflowY: 'auto',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  }}
                >
                  {INDIAN_STATES.map(s => (
                    <button
                      key={s}
                      onClick={() => { setState(s); setShowDrop(false); }}
                      style={{
                        display: 'block', width: '100%', padding: '11px 16px',
                        textAlign: 'left',
                        background: state === s ? 'rgba(20,83,45,0.08)' : 'rgba(0,0,0,0)',
                        border: 'none', cursor: 'pointer', fontSize: 14,
                        color: state === s ? '#14532d' : '#374151',
                        fontWeight: state === s ? 600 : 400, fontFamily: font,
                        transition: 'background 0.14s',
                      }}
                      onMouseEnter={e => { if (state !== s) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                      onMouseLeave={e => { if (state !== s) e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Field 5 — Primary Crop chips */}
          <div>
            <label style={labelStyle}>Primary Crop</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CROPS.map(c => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSelectedCrop(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 99,
                    border: `1.5px solid ${selectedCrop === c.id ? '#14532d' : '#d1fae5'}`,
                    background: selectedCrop === c.id ? '#14532d' : 'white',
                    color: selectedCrop === c.id ? 'white' : '#374151',
                    fontSize: 14, fontWeight: selectedCrop === c.id ? 600 : 400,
                    fontFamily: font, cursor: 'pointer',
                    transition: 'all 0.18s',
                    boxShadow: selectedCrop === c.id ? '0 2px 8px rgba(20,83,45,0.25)' : 'none',
                  }}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Field 6 — Language toggle */}
          <div>
            <label style={labelStyle}>Preferred Language</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'en', flag: '🇬🇧', label: 'English' },
                { id: 'hi', flag: '🇮🇳', label: 'हिंदी' },
              ].map(lang => (
                <motion.button
                  key={lang.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setLanguage(lang.id as 'en' | 'hi')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, padding: '12px 20px',
                    borderRadius: 10,
                    border: `1.5px solid ${language === lang.id ? '#14532d' : '#d1fae5'}`,
                    background: language === lang.id ? '#14532d' : 'white',
                    color: language === lang.id ? 'white' : '#374151',
                    fontSize: 14, fontWeight: 600, fontFamily: font,
                    cursor: 'pointer', transition: 'all 0.18s',
                    boxShadow: language === lang.id ? '0 2px 8px rgba(20,83,45,0.25)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{lang.flag}</span>
                  <span>{lang.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Terms checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <button
              onClick={() => setAgreed(v => !v)}
              style={{
                width: 20, height: 20, minWidth: 20, borderRadius: 5,
                border: `2px solid ${agreed ? '#14532d' : '#d1fae5'}`,
                background: agreed ? '#14532d' : 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginTop: 2, transition: 'all 0.18s', padding: 0,
              }}
            >
              {agreed && <span style={{ color: 'white', fontSize: 11, fontWeight: 800, lineHeight: 1 }}>✓</span>}
            </button>
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.55, fontFamily: font }}>
              I agree to the{' '}
              <span style={{ color: '#166534', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                Terms &amp; Conditions
              </span>
              {' '}and{' '}
              <span style={{ color: '#166534', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                Privacy Policy
              </span>
            </p>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ boxShadow: '0 8px 28px rgba(20,83,45,0.42)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onSignUp}
            style={{
              width: '100%', height: 52, background: '#14532d',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: font,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(20,83,45,0.30)',
              transition: 'box-shadow 0.2s',
            }}
          >
            🌱 Create Account
          </motion.button>

          {/* Already have account */}
          <div style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: '#6b7280' }}>Already have an account? </span>
            <button
              onClick={onBack}
              style={{
                fontSize: 14, fontWeight: 700, color: '#166534',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontFamily: font,
              }}
            >
              Login →
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="ac-reg-right"
        style={{
          width: '50%', minHeight: '100vh',
          position: 'sticky', top: 0, alignSelf: 'flex-start',
          height: '100vh', overflow: 'hidden',
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

      {/* ── Floating Help ── */}
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

      <style>{`
        @media (max-width: 767px) {
          .ac-reg-left {
            width: 100% !important;
            padding: 28px 24px 40px !important;
          }
          .ac-reg-right { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .ac-reg-left { width: 60% !important; padding: 36px 36px 48px !important; }
          .ac-reg-right { width: 40% !important; }
        }
      `}</style>
    </div>
  );
}
