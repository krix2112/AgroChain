import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ExternalLink, Mic } from 'lucide-react';
import { AgroChainLogo } from './AgroChainLogo';

const font  = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

// ── Background ────────────────────────────────────────────────────────────────

const PARALLAX_BG = 'https://images.unsplash.com/photo-1658720798948-10a0924c1e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHJpY2UlMjBwYWRkeSUyMGZpZWxkJTIwYmx1cnJlZCUyMGJva2VoJTIwZmFybXxlbnwxfHx8fDE3NzQ2OTEyNDB8MA&ixlib=rb-4.1.0&q=80&w=1600';

// ── Crop data ─────────────────────────────────────────────────────────────────

const CROPS = [
  {
    id: 'wheat',
    nameEn: 'Wheat', nameHi: 'गेहूं',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1771208680359-28cf7faf1040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB3aGVhdCUyMHN0YWxrcyUyMGhhcnZlc3QlMjBmaWVsZHxlbnwxfHx8fDE3NzQ0Njg0NDR8MA&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(27,67,50,0.90) 0%, rgba(27,67,50,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
  {
    id: 'tomato',
    nameEn: 'Tomato', nameHi: 'टमाटर',
    emoji: '🍅',
    image: 'https://images.unsplash.com/photo-1760562796048-099c8d914490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXBlJTIwcmVkJTIwdG9tYXRvZXMlMjBvbiUyMHZpbmV8ZW58MXx8fHwxNzc0NDY4NDQ1fDA&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(127,29,29,0.90) 0%, rgba(127,29,29,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
  {
    id: 'rice',
    nameEn: 'Rice', nameHi: 'चावल',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1709607389132-7d4cad84aef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2UlMjBncmFpbnMlMjBwYWRkeSUyMGZpZWxkfGVufDF8fHx8MTc3NDQ2ODQ0NXww&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(113,63,18,0.90) 0%, rgba(113,63,18,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
  {
    id: 'onion',
    nameEn: 'Onion', nameHi: 'प्याज',
    emoji: '🧅',
    image: 'https://images.unsplash.com/photo-1685399246790-917f3b59934e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjByZWQlMjBvbmlvbnMlMjBmcmVzaCUyMGhhcnZlc3R8ZW58MXx8fHwxNzc0NDY4NDQ2fDA&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(76,29,149,0.90) 0%, rgba(76,29,149,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
  {
    id: 'potato',
    nameEn: 'Potato', nameHi: 'आलू',
    emoji: '🥔',
    image: 'https://images.unsplash.com/photo-1723763246578-99e614b2a91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBwb3RhdG9lcyUyMHNvaWwlMjBmYXJtfGVufDF8fHx8MTc3NDQ2ODQ0Nnww&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(120,53,15,0.90) 0%, rgba(120,53,15,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
  {
    id: 'corn',
    nameEn: 'Corn', nameHi: 'मक्का',
    emoji: '🌽',
    image: 'https://images.unsplash.com/photo-1762725770569-9a454aad8247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBjb3JuJTIwY29icyUyMGhhcnZlc3R8ZW58MXx8fHwxNzc0NDY4NDQ3fDA&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(124,45,18,0.90) 0%, rgba(124,45,18,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
  {
    id: 'chilli',
    nameEn: 'Chilli', nameHi: 'मिर्च',
    emoji: '🌶️',
    image: 'https://images.unsplash.com/photo-1637683085083-fa760c1fd0af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjByZWQlMjBjaGlsbGklMjBwZXBwZXJzfGVufDF8fHx8MTc3NDQ2ODQ0N3ww&ixlib=rb-4.1.0&q=80&w=600',
    overlay: 'linear-gradient(to top, rgba(136,19,55,0.90) 0%, rgba(136,19,55,0.45) 60%, rgba(0,0,0,0.02) 100%)',
  },
];

const STEP_LABELS = [
  { en: 'Select Crop', hi: 'फसल चुनें' },
  { en: 'Set Quantity', hi: 'मात्रा तय करें' },
  { en: 'Set Quality', hi: 'गुणवत्ता' },
  { en: 'Confirm', hi: 'पुष्टि करें' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface TradeResult {
  tradeId: string;
  txHash?: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  language:     'en' | 'hi';
  onBack:       () => void;
  onViewTrade:  (tradeId: string) => void;
  onBackToDash: () => void;
}

// ── Quality chip selector ─────────────────────────────────────────────────────

function ChipGroup({
  label, options, value, onChange, helper,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  helper?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: font }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '6px 16px',
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: font,
              cursor: 'pointer',
              border: value === opt ? '2px solid #1b4332' : '1.5px solid #e5e7eb',
              background: value === opt ? '#1b4332' : '#ffffff',
              color: value === opt ? '#ffffff' : '#6b7280',
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {helper && value && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              fontSize: 12, color: '#6b7280', marginTop: 6,
              fontFamily: font, lineHeight: 1.5, overflow: 'hidden',
            }}
          >
            {helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Summary row ───────────────────────────────────────────────────────────────

function SumRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid #f0fdf4',
    }}>
      <span style={{ fontSize: 13, color: '#9ca3af', fontFamily: font }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 700, fontFamily: font,
        color: green ? '#166534' : '#1a1a1a',
      }}>{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AgroChainCreateTrade({ language, onBack, onViewTrade, onBackToDash }: Props) {

  // ── Parallax
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── User
  const userRaw = localStorage.getItem('agrochain_user');
  const user    = userRaw ? JSON.parse(userRaw) : null;
  const name    = user?.name ?? 'Ramesh';

  // ── Form state
  const [step,          setStep]          = useState<Step>(1);
  const [selectedCrop,  setSelectedCrop]  = useState('tomato');
  const [customCrop,    setCustomCrop]    = useState('');
  const [quantity,      setQuantity]      = useState<number>(500);
  const [price,         setPrice]         = useState<number>(25);
  const [traderPhone,   setTraderPhone]   = useState('');
  const [dispatchDays,  setDispatchDays]  = useState<number>(2);
  const [freshness,     setFreshness]     = useState('10-12%');
  const [quality,       setQuality]       = useState('Medium');
  const [foreignMatter, setForeignMatter] = useState('<1%');
  const [comments,      setComments]      = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [success,       setSuccess]       = useState<TradeResult | null>(null);

  const cropName  = selectedCrop === '__custom__' ? customCrop : (CROPS.find(c => c.id === selectedCrop)?.nameEn ?? '');
  const cropData  = CROPS.find(c => c.id === selectedCrop);
  const totalPrice = quantity > 0 && price > 0 ? (quantity * price).toLocaleString('en-IN') : null;

  function goNext() {
    if (step === 1 && !cropName.trim()) { setError(language === 'hi' ? 'कृपया फसल चुनें।' : 'Please select a crop.'); return; }
    if (step === 2) {
      if (!quantity || quantity <= 0) { setError(language === 'hi' ? 'वैध मात्रा दर्ज करें।' : 'Enter a valid quantity.'); return; }
      if (!price || price <= 0)       { setError(language === 'hi' ? 'वैध मूल्य दर्ज करें।' : 'Enter a valid price.'); return; }
      if (!traderPhone.trim() || traderPhone.replace(/\D/g, '').length < 10) {
        setError(language === 'hi' ? 'व्यापारी का 10 अंकीय नंबर दर्ज करें।' : "Enter trader's 10-digit phone number."); return;
      }
    }
    setError('');
    setStep(s => (s + 1) as Step);
  }

  function goBack() {
    setError('');
    if (step === 1) onBack();
    else setStep(s => (s - 1) as Step);
  }

  async function handleSubmit() {
    const token = localStorage.getItem('agrochain_token');
    if (!token) { onBack(); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/trade/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          traderPhone: traderPhone.trim(),
          cropName:    cropName.trim(),
          quantity,
          price,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to create trade.');
      setSuccess({ tradeId: data.tradeId ?? data.id ?? `DEMO-${Date.now()}`, txHash: data.txHash });
    } catch (err: unknown) {
      // Offline demo fallback
      const tradeId = `DEMO-${Date.now()}`;
      setSuccess({ tradeId });
    } finally {
      setLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', fontFamily: font }}>

      {/* ── Parallax background ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url(${PARALLAX_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.3}px)`,
          filter: 'brightness(0.60) saturate(1.1)',
          willChange: 'transform',
        }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.12)' }} />

      {/* ── Frosted glass navbar ── */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          height: 52,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          boxShadow: '0 1px 12px rgba(0,0,0,0.07)',
        }}
      >
        {/* Logo */}
        <button
          onClick={onBackToDash}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <AgroChainLogo size={28} bgColor="#1b4332" borderRadius={8} />
          <span style={{ fontFamily: serif, fontWeight: 800, fontSize: 16, color: '#1b4332', letterSpacing: '-0.01em' }}>
            AgroChain
          </span>
        </button>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
          <span>🏠</span>
          <button
            onClick={onBackToDash}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#6b7280', fontFamily: font }}
          >
            {language === 'hi' ? 'होम' : 'Home'}
          </button>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontWeight: 600, color: '#1b4332' }}>
            {language === 'hi' ? 'फसल बेचें' : 'Sell Crop'}
          </span>
        </div>

        {/* Right side: language + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, color: '#6b7280', fontWeight: 600,
            background: '#f3f4f6', borderRadius: 99, padding: '3px 10px',
            border: '1px solid #e5e7eb',
          }}>
            {language === 'en' ? 'EN' : 'हिं'} | {language === 'en' ? 'हिं' : 'EN'}
          </span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: '#f97316',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#ffffff',
          }}>
            {name[0]?.toUpperCase() ?? 'R'}
          </div>
          <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
            🙏 {language === 'hi' ? 'नमस्ते,' : 'Namaste,'} {name}
          </span>
        </div>
      </nav>

      {/* ── Page content (relative z-10) ── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
          style={{ marginBottom: 16 }}
        >
          <h1 style={{
            fontFamily: serif, fontSize: 26, fontWeight: 800,
            color: '#ffffff', margin: '0 0 4px',
            textShadow: '0 2px 14px rgba(0,0,0,0.45)',
          }}>
            {language === 'hi' ? 'उत्पाद जोड़ें' : 'Add Produce'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: font }}>
            {language === 'hi' ? 'बस कुछ आसान चरणों में अपनी फसल बेचें।' : 'Sell your harvest in just a few steps.'}
          </p>
        </motion.div>

        {/* ── Step indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.08 }}
          style={{
            background: 'rgba(255,255,255,0.68)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.52)',
            borderRadius: 12,
            padding: '8px 16px',
            display: 'flex', alignItems: 'center',
            marginBottom: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            gap: 0,
          }}
        >
          {STEP_LABELS.map((lbl, i) => {
            const num = i + 1;
            const isActive    = step === num;
            const isCompleted = step > num;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                {i > 0 && (
                  <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.10)', marginRight: 4, flexShrink: 0 }} />
                )}
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: isActive ? 700 : 500,
                    fontFamily: font, whiteSpace: 'nowrap', flexShrink: 0,
                    padding: isActive ? '5px 13px' : '5px 6px',
                    borderRadius: isActive ? 8 : 0,
                    background: isActive ? '#1b4332' : 'transparent',
                    color: isActive ? '#ffffff' : isCompleted ? '#1b4332' : '#9ca3af',
                    transition: 'all 0.2s',
                  }}
                >
                  {isCompleted && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 14, height: 14, borderRadius: '50%', background: '#1b4332', flexShrink: 0,
                    }}>
                      <span style={{ color: '#ffffff', fontSize: 9, fontWeight: 900 }}>✓</span>
                    </span>
                  )}
                  {num}. {language === 'hi' ? lbl.hi : lbl.en}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* ── Glass panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.32 }}
            style={{
              background: 'rgba(255,255,255,0.90)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.60)',
              borderRadius: 20,
              boxShadow: '0 10px 44px rgba(0,0,0,0.16)',
              padding: '24px 28px',
              marginBottom: 16,
            }}
          >
            {/* ══════════════════════════════
                STEP 1 — Select Crop
            ══════════════════════════════ */}
            {step === 1 && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>1/4</span>
                  <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>
                    {language === 'hi' ? 'चरण 1: फसल चुनें' : 'Step 1: Select Crop'}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    {language === 'hi' ? 'वह फसल चुनें जिसे आप बेचना चाहते हैं।' : 'Choose the crop you want to sell.'}
                  </p>
                </div>

                {/* Crop grid — 2 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  {CROPS.map((crop, idx) => {
                    const isSelected = selectedCrop === crop.id;
                    return (
                      <motion.div
                        key={crop.id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.04, duration: 0.28 }}
                        onClick={() => { setSelectedCrop(crop.id); setError(''); }}
                        style={{
                          position: 'relative', overflow: 'hidden',
                          borderRadius: 10, cursor: 'pointer', height: 76,
                          border: isSelected ? '2.5px solid #ffffff' : '2px solid transparent',
                          boxShadow: isSelected
                            ? '0 0 0 2px #1b4332, 0 4px 14px rgba(27,67,50,0.28)'
                            : '0 2px 8px rgba(0,0,0,0.12)',
                          transition: 'box-shadow 0.18s, border-color 0.18s',
                        }}
                        className="ct-crop-tile"
                      >
                        {/* Photo bg with CSS hover zoom via group */}
                        <div
                          className="ct-tile-photo"
                          style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${crop.image})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                          }}
                        />
                        {/* Overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: crop.overlay }} />
                        {/* Shimmer on hover */}
                        <div className="ct-shimmer" style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(255,255,255,0)',
                          transition: 'background 0.25s',
                        }} />
                        {/* Content */}
                        <div style={{ position: 'absolute', inset: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: 16, lineHeight: 1, marginBottom: 3 }}>{crop.emoji}</div>
                          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 14, fontFamily: font, textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
                            {language === 'hi' ? crop.nameHi : crop.nameEn}
                          </div>
                        </div>
                        {/* "Select →" hover badge */}
                        <div className="ct-select-badge" style={{
                          position: 'absolute', top: 8, left: 8,
                          background: 'rgba(255,255,255,0.92)',
                          color: '#1b4332', fontSize: 10, fontWeight: 700,
                          padding: '2px 8px', borderRadius: 99,
                          opacity: 0, transition: 'opacity 0.22s, transform 0.22s',
                          transform: 'translateY(3px)',
                          fontFamily: font, pointerEvents: 'none',
                        }}>
                          {language === 'hi' ? 'चुनें →' : 'Select →'}
                        </div>
                        {/* Checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                            style={{
                              position: 'absolute', top: 7, right: 7,
                              width: 22, height: 22, borderRadius: '50%',
                              background: '#ffffff', border: '2px solid #1b4332',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
                            }}
                          >
                            <span style={{ color: '#1b4332', fontSize: 11, fontWeight: 900 }}>✓</span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Custom crop tile */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: CROPS.length * 0.04, duration: 0.28 }}
                    onClick={() => { setSelectedCrop('__custom__'); setError(''); }}
                    style={{
                      position: 'relative', height: 76, borderRadius: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      background: selectedCrop === '__custom__' ? 'rgba(27,67,50,0.05)' : 'rgba(255,255,255,0.70)',
                      border: selectedCrop === '__custom__'
                        ? '2px solid #1b4332'
                        : '2px dashed rgba(27,67,50,0.35)',
                      transition: 'all 0.15s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ fontSize: 18, lineHeight: 1, marginBottom: 2 }}>✏️</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#1b4332', whiteSpace: 'nowrap', fontFamily: font }}>
                        {language === 'hi' ? 'नाम लिखें' : 'Type crop name'}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={customCrop}
                      onChange={e => { setCustomCrop(e.target.value); }}
                      onClick={e => { e.stopPropagation(); setSelectedCrop('__custom__'); }}
                      placeholder={language === 'hi' ? 'उदा. गन्ना, बाजरा...' : 'e.g. Sugarcane, Bajra...'}
                      style={{
                        flex: 1, height: 34, borderRadius: 8, minWidth: 0,
                        border: selectedCrop === '__custom__' ? '1.5px solid #1b4332' : '1.5px solid rgba(0,0,0,0.10)',
                        background: 'rgba(255,255,255,0.85)',
                        padding: '0 10px', fontSize: 12,
                        color: customCrop ? '#1a1a1a' : '#9ca3af',
                        outline: 'none', fontFamily: font,
                        boxShadow: selectedCrop === '__custom__' ? '0 0 0 2px rgba(27,67,50,0.13)' : 'none',
                        transition: 'all 0.15s',
                      }}
                    />
                    {selectedCrop === '__custom__' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: 'absolute', top: 6, right: 6,
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#1b4332',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <span style={{ color: '#ffffff', fontSize: 9, fontWeight: 900 }}>✓</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Voice row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.60)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 10, padding: '9px 14px',
                }}>
                  <span style={{ fontSize: 12, color: '#6b7280', flexShrink: 0 }}>
                    {language === 'hi' ? 'फसल नहीं मिली?' : "Can't find your crop?"}
                  </span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#1b4332', textDecoration: 'underline', textDecorationColor: 'rgba(27,67,50,0.35)', padding: 0, fontFamily: font, flexShrink: 0 }}>
                    {language === 'hi' ? 'बोलकर बताएं' : 'Speak instead'}
                  </button>
                  <div style={{ flex: 1, borderTop: '1.5px dashed #d1d5db', height: 0 }} />
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    border: '1.5px solid #1b4332', borderRadius: 8,
                    padding: '6px 14px', background: 'transparent',
                    color: '#1b4332', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: font, whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Mic size={13} />
                    {language === 'hi' ? 'बोलकर बताएं' : 'Speak instead'}
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 2 — Set Quantity
            ══════════════════════════════ */}
            {step === 2 && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>2/4</span>
                  <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>
                    {language === 'hi' ? 'चरण 2: मात्रा तय करें' : 'Step 2: Set Quantity'}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    {language === 'hi' ? 'अपनी फसल की ���ात्रा और कीमत दर्ज करें।' : 'Enter the quantity and your expected price.'}
                  </p>
                </div>

                {/* Selected crop badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#f0fdf4', border: '1.5px solid #d1fae5',
                  borderRadius: 12, padding: '10px 16px', marginBottom: 18,
                }}>
                  <span style={{ fontSize: 24 }}>{cropData?.emoji ?? '🌱'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 15, fontFamily: serif }}>{cropName}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>
                      {language === 'hi' ? 'चुनी गई फसल' : 'Selected crop'}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#b45309', background: '#fef3c7', padding: '3px 10px', borderRadius: 99, border: '1px solid #fde68a' }}>
                    {language === 'hi' ? 'बाज़ार: ₹25/किग्रा' : 'Market: ₹25/kg'}
                  </span>
                </div>

                {/* Quantity stepper */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: font }}>
                    {language === 'hi' ? 'मात्रा (किग्रा)' : 'Quantity (kg)'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 10))}
                      style={{
                        width: 44, height: 44, borderRadius: 10,
                        border: '2px solid #e5e7eb', background: '#ffffff',
                        fontSize: 20, fontWeight: 700, color: '#374151',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#1b4332'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      −
                    </button>
                    <input
                      type="number" value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{
                        flex: 1, height: 44, textAlign: 'center',
                        fontSize: 20, fontWeight: 800, color: '#1a1a1a',
                        border: '2px solid #e5e7eb', borderRadius: 10,
                        background: '#ffffff', outline: 'none', fontFamily: font,
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#1b4332'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <button
                      onClick={() => setQuantity(q => q + 10)}
                      style={{
                        width: 44, height: 44, borderRadius: 10,
                        border: '2px solid #e5e7eb', background: '#ffffff',
                        fontSize: 20, fontWeight: 700, color: '#374151',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#1b4332'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      +
                    </button>
                    <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>kg</span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: font }}>
                    {language === 'hi' ? 'अपेक्षित मूल्य / किग्रा (₹)' : 'Expected Price / kg (₹)'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#9ca3af', fontWeight: 600 }}>₹</span>
                    <input
                      type="number" value={price}
                      onChange={e => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        height: 44, paddingLeft: 34, paddingRight: 14,
                        fontSize: 16, fontWeight: 700, color: '#1a1a1a',
                        border: '2px solid #e5e7eb', borderRadius: 10,
                        background: '#ffffff', outline: 'none', fontFamily: font,
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#1b4332'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>

                {/* Total price preview */}
                <AnimatePresence>
                  {totalPrice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginBottom: 14 }}
                    >
                      <div style={{
                        background: '#f0fdf4', border: '1.5px solid #d1fae5', borderRadius: 12,
                        padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
                          </div>
                          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                            {quantity} kg × ₹{price}/kg
                          </div>
                        </div>
                        <motion.span
                          key={totalPrice}
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          style={{ fontFamily: serif, fontSize: 24, fontWeight: 800, color: '#166534' }}
                        >
                          ₹{totalPrice}
                        </motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dispatch days */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: font }}>
                    {language === 'hi' ? 'डिस्पैच के लिए तैयार (दिन)' : 'Ready to Dispatch (Days)'}
                  </label>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>📍</span>
                    <input
                      type="number" value={dispatchDays}
                      onChange={e => setDispatchDays(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{
                        width: 100, height: 42, paddingLeft: 34, paddingRight: 10,
                        fontSize: 16, fontWeight: 700, color: '#1a1a1a',
                        border: '2px solid #e5e7eb', borderRadius: 10,
                        background: '#ffffff', outline: 'none', fontFamily: font,
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#1b4332'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <span style={{ marginLeft: 8, fontSize: 14, color: '#6b7280' }}>
                    {language === 'hi' ? 'दिन' : 'Days'}
                  </span>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6, fontFamily: font }}>
                    {language === 'hi'
                      ? 'कितने दिनों में आपकी फसल डिस्पैच के लिए तैयार होगी।'
                      : 'The number of days when your produce will be ready for dispatch.'}
                  </p>
                </div>

                {/* Trader phone */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: font }}>
                    {language === 'hi' ? "व्यापारी का फ़ोन नंबर" : "Trader's Phone Number"} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 13, fontWeight: 700, color: '#6b7280',
                      borderRight: '1px solid #e5e7eb', paddingRight: 10, lineHeight: 1,
                    }}>+91</span>
                    <input
                      type="tel" value={traderPhone}
                      onChange={e => setTraderPhone(e.target.value)}
                      placeholder={language === 'hi' ? '10-अंकीय मोबाइल नंबर' : '10-digit mobile number'}
                      maxLength={10}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        height: 44, paddingLeft: 58, paddingRight: 14,
                        fontSize: 15, color: '#1a1a1a',
                        border: '2px solid #e5e7eb', borderRadius: 10,
                        background: '#ffffff', outline: 'none', fontFamily: font,
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#1b4332'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═════��════════════════════════
                STEP 3 — Set Quality
            ══════════════════════════════ */}
            {step === 3 && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>3/4</span>
                  <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>
                    {language === 'hi' ? 'चरण 3: गुणवत्ता तय करें' : 'Step 3: Set Quality'}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    {language === 'hi' ? 'अपनी फसल की गुणवत्ता बताएं।' : 'Describe the quality of your produce.'}
                  </p>
                </div>

                {/* Crop + quantity badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#f0fdf4', border: '1.5px solid #d1fae5',
                  borderRadius: 12, padding: '10px 16px', marginBottom: 18,
                }}>
                  <span style={{ fontSize: 20 }}>{cropData?.emoji ?? '🌱'}</span>
                  <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14, fontFamily: serif }}>{cropName}</span>
                  <span style={{ color: '#d1d5db' }}>|</span>
                  <span style={{ color: '#6b7280', fontSize: 13 }}>{quantity} kg</span>
                </div>

                <ChipGroup
                  label={`💧 ${language === 'hi' ? 'ताज़गी का स्तर' : 'Freshness Level'}`}
                  options={['<10%', '10-12%', '12-14%']}
                  value={freshness}
                  onChange={setFreshness}
                  helper={
                    freshness === '<10%' ? 'Very fresh, harvested recently.' :
                    freshness === '10-12%' ? 'Good freshness, standard moisture level.' :
                    'Higher moisture — suitable for immediate processing.'
                  }
                />

                <ChipGroup
                  label={`🌾 ${language === 'hi' ? 'उत्पाद गुणवत्ता' : 'Produce Quality'}`}
                  options={['Low', 'Medium', 'High']}
                  value={quality}
                  onChange={setQuality}
                  helper={
                    quality === 'High' ? 'Premium quality — uniform size, no discoloration.' :
                    quality === 'Medium' ? 'Good-sized, uniform produce with no significant discoloration.' :
                    'Mixed sizes with some minor defects.'
                  }
                />

                <ChipGroup
                  label={`🌿 ${language === 'hi' ? 'विदेशी पदार्थ' : 'Foreign Matter'}`}
                  options={['<1%', '1-2%', '>2%']}
                  value={foreignMatter}
                  onChange={setForeignMatter}
                  helper={
                    foreignMatter === '<1%' ? 'Very Clean (< 1% debris) — best quality.' :
                    foreignMatter === '1-2%' ? 'Slightly mixed — minor cleaning recommended.' :
                    'Significant debris — requires thorough cleaning.'
                  }
                />

                {/* Comments */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: font }}>
                    {language === 'hi' ? 'अतिरिक्त टिप्पणी' : 'Additional Comments'}
                    <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 5 }}>
                      ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})
                    </span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    rows={3}
                    placeholder={language === 'hi' ? 'उदा. साफ उत्पाद, एक समान आकार और रंग।' : 'e.g. Well-cleaned produce, uniform size and color. No pesticides used.'}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      border: '2px solid #e5e7eb', borderRadius: 10,
                      padding: '10px 14px', fontSize: 13, color: '#374151',
                      fontFamily: font, resize: 'none', outline: 'none',
                      lineHeight: 1.5, transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1b4332'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 4 — Confirm + Success
            ══════════════════════════════ */}
            {step === 4 && (
              <div>
                {success ? (
                  /* ── Success state ── */
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.1 }}
                      style={{
                        width: 70, height: 70, borderRadius: '50%',
                        background: '#dcfce7', margin: '0 auto 18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 0 10px rgba(20,83,45,0.10), 0 0 0 22px rgba(20,83,45,0.05)',
                      }}
                    >
                      <CheckCircle2 size={36} color="#16a34a" />
                    </motion.div>
                    <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>
                      {language === 'hi' ? 'लिस्टिंग पोस्ट हो गई!' : 'Listing Posted!'}
                    </h2>
                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 18, lineHeight: 1.6, fontFamily: font }}>
                      {language === 'hi'
                        ? <>आपकी <strong style={{ color: '#1b4332' }}>{cropName}</strong> की लिस्टिंग सफलतापूर्वक पो���्ट हो गई।</>
                        : <>Your listing for <strong style={{ color: '#1b4332' }}>{cropName}</strong> has been posted successfully.</>
                      }
                    </p>

                    <div style={{
                      background: '#f0fdf4', border: '1.5px solid #d1fae5',
                      borderRadius: 14, padding: '14px 18px', textAlign: 'left', marginBottom: 14,
                    }}>
                      <SumRow label="Trade ID"      value={`#${success.tradeId}`} />
                      <SumRow label="Crop"          value={cropName} />
                      <SumRow label="Quantity"      value={`${quantity} kg`} />
                      <SumRow label="Quality"       value={quality} />
                      <SumRow label="Total Value"   value={`₹${totalPrice ?? '—'}`} green />
                      {success.txHash && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #d1fae5' }}>
                          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Transaction Hash
                          </div>
                          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#166534', wordBreak: 'break-all', lineHeight: 1.5 }}>
                            {success.txHash}
                          </div>
                        </div>
                      )}
                    </div>

                    {success.txHash && (
                      <a
                        href={`https://explorer-sphinx.shardeum.org/tx/${success.txHash}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#1b4332', marginBottom: 18, textDecoration: 'underline' }}
                      >
                        View on Shardeum Explorer <ExternalLink size={10} />
                      </a>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                      <motion.button
                        whileHover={{ background: '#2d6a4f' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onViewTrade(success.tradeId)}
                        style={{
                          flex: 1, background: '#1b4332', color: '#ffffff',
                          border: 'none', borderRadius: 12, padding: '12px',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                          transition: 'background 0.18s',
                        }}
                      >
                        {language === 'hi' ? '📋 लिस्टिंग देखें' : '📋 View Listing'}
                      </motion.button>
                      <motion.button
                        whileHover={{ background: '#ea580c' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onBackToDash}
                        style={{
                          flex: 1, background: '#f97316', color: '#ffffff',
                          border: 'none', borderRadius: 12, padding: '12px',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                          transition: 'background 0.18s',
                        }}
                      >
                        🏠 {language === 'hi' ? 'होम' : 'Home'}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  /* ── Confirm state ── */
                  <div>
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>4/4</span>
                      <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>
                        {language === 'hi' ? 'अपनी लिस्टिंग की पुष्टि करें' : 'Confirm Your Listing'}
                      </h2>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                        {language === 'hi' ? 'पोस्ट करने से पहले विवरण की समीक्षा करें।' : 'Review your details before posting.'}
                      </p>
                    </div>

                    {/* Crop hero image */}
                    {cropData && (
                      <div style={{
                        width: '100%', height: 100, borderRadius: 12,
                        overflow: 'hidden', marginBottom: 16, position: 'relative',
                        backgroundImage: `url(${cropData.image})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,67,50,0.75) 0%, rgba(0,0,0,0.05) 100%)' }} />
                        <div style={{ position: 'absolute', bottom: 10, left: 14, color: '#ffffff', fontWeight: 800, fontSize: 18, fontFamily: serif, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
                          {cropName}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div style={{ border: '1.5px solid #f0fdf4', borderRadius: 14, padding: '4px 16px', marginBottom: 16 }}>
                      <SumRow label={language === 'hi' ? 'फसल' : 'Crop'}           value={cropName} />
                      <SumRow label={language === 'hi' ? 'मात्रा' : 'Quantity'}     value={`${quantity} kg`} />
                      <SumRow label={language === 'hi' ? 'गुणवत्ता' : 'Quality'}   value={quality} />
                      <SumRow label={language === 'hi' ? 'ताज़गी' : 'Freshness'}   value={freshness} />
                      <SumRow label={language === 'hi' ? 'अपेक्षित मूल्य' : 'Expected Price'} value={`₹${price}/kg`} />
                      <SumRow label={language === 'hi' ? 'कुल मूल्य' : 'Total Value'} value={`₹${totalPrice ?? '—'}`} green />
                      <SumRow label={language === 'hi' ? 'व्यापारी नंबर' : 'Trader Phone'} value={`+91 ${traderPhone}`} />
                    </div>

                    {/* "Will go live instantly" notice */}
                    <div style={{
                      background: '#eff6ff', border: '1.5px solid #bfdbfe',
                      borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: 16 }}>⚡</span>
                      <p style={{ margin: 0, fontSize: 12, color: '#1d4ed8', fontFamily: font, lineHeight: 1.4 }}>
                        {language === 'hi'
                          ? 'यह लिस्टिंग पोस्ट करते ही Shardeum ब्लॉकचेन पर दर्ज हो जाएगी।'
                          : 'This listing will go live instantly and be recorded on the Shardeum blockchain.'}
                      </p>
                    </div>

                    {/* Submit button */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      whileHover={!loading ? { background: '#2d6a4f', boxShadow: '0 8px 24px rgba(27,67,50,0.38)' } : {}}
                      whileTap={!loading ? { scale: 0.97 } : {}}
                      style={{
                        width: '100%', background: loading ? '#9ca3af' : '#1b4332',
                        color: '#ffffff', border: 'none', borderRadius: 12,
                        padding: '13px', fontSize: 15, fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer', fontFamily: font,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(27,67,50,0.28)',
                        transition: 'background 0.2s, box-shadow 0.2s',
                      }}
                    >
                      {loading ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                          {language === 'hi' ? 'पोस्ट हो रही है...' : 'Posting...'}
                        </span>
                      ) : (
                        language === 'hi' ? '🌾 लिस्टिंग पोस्ट करें' : '🌾 Post Listing'
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Error message ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                background: '#fef2f2', border: '1.5px solid #fecaca',
                borderRadius: 10, padding: '10px 16px', marginBottom: 14,
                fontSize: 13, color: '#dc2626', fontFamily: font, lineHeight: 1.5,
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Nav buttons (hidden on step 4 success) ── */}
        {!(step === 4 && success) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
          >
            <button
              onClick={goBack}
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.70)',
                borderRadius: 10, padding: '0 22px', height: 42,
                color: '#374151', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', fontFamily: font,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.90)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.75)'}
            >
              ← {language === 'hi' ? 'वापस' : 'Back'}
            </button>

            {step < 4 && (
              <motion.button
                onClick={goNext}
                whileHover={{ scale: 1.03, boxShadow: '0 6px 22px rgba(27,67,50,0.45)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: '#1b4332', border: 'none', borderRadius: 10,
                  padding: '0 28px', height: 44, color: '#ffffff',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                  boxShadow: '0 4px 14px rgba(27,67,50,0.35)',
                }}
              >
                {language === 'hi' ? 'आगे →' : 'Next →'}
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Hover effects via CSS */}
      <style>{`
        .ct-crop-tile:hover .ct-tile-photo { transform: scale(1.10); }
        .ct-crop-tile:hover .ct-shimmer    { background: rgba(255,255,255,0.10) !important; }
        .ct-crop-tile:hover .ct-select-badge { opacity: 1 !important; transform: translateY(0) !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
