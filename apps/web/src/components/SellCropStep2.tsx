import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Info } from 'lucide-react';
import { SellCropStepper } from './SellCropStepper';
import { SelectedCropCard } from './SelectedCropCard';

// Shared nav buttons component
function NavButtons({
  onBack,
  onNext,
  backLabel,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  backLabel: string;
  nextLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}
    >
      <button
        onClick={onBack}
        style={{
          background: 'rgba(255,255,255,0.65)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 10,
          padding: '0 24px',
          height: 48,
          color: '#444',
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
        }}
      >
        {backLabel}
      </button>
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(45,106,47,0.45)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: '#2D6A2F',
          border: 'none',
          borderRadius: 12,
          padding: '0 32px',
          height: 52,
          color: 'white',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 14px rgba(45,106,47,0.35)',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
        }}
      >
        {nextLabel}
      </motion.button>
    </motion.div>
  );
}

interface SellCropStep2Props {
  language: 'en' | 'hi';
  onBack: () => void;
  onNext: () => void;
}

export function SellCropStep2({ language, onBack, onNext }: SellCropStep2Props) {
  const [quantity, setQuantity] = useState(2000); // 2000 Kg
  const [pricePerKg, setPricePerKg] = useState(24); // ₹24/kg
  const [dispatchDays, setDispatchDays] = useState(2);

  const MARKET_PRICE_KG = 18; // ₹18/kg for Tomato
  const totalPrice = quantity * pricePerKg; // Kg × ₹/kg = total

  const fmt = (n: number) => n.toLocaleString('en-IN');

  const t = {
    pageTitle: language === 'en' ? 'Sell Crop' : 'फसल बेचें',
    pageSubtitle:
      language === 'en'
        ? 'List your produce, set quantity, quality, and get offers from buyers.'
        : 'अपनी फसल सूचीबद्ध करें, मात्रा, गुणवत्ता तय करें और खरीदारों से ऑफर पाएं।',
    panelHeading: language === 'en' ? 'Step 2: Set Quantity' : 'चरण 2: मात्रा तय करें',
    panelSub: language === 'en' ? 'Enter the quantity of your harvest.' : 'अपनी फसल की मात्रा दर्ज करें।',
    qtyLabel: language === 'en' ? 'Quantity' : 'मात्रा',
    kilograms: language === 'en' ? 'Kg' : 'किलोग्राम',
    marketPrice: language === 'en' ? `Market Price: ₹${MARKET_PRICE_KG}/kg` : `बाज़ार मूल्य: ₹${MARKET_PRICE_KG}/किग्रा`,
    priceLabel: language === 'en' ? 'Expected Price / Kg' : 'अपेक्षित मूल्य / किग्रा',
    totalLabel: language === 'en' ? 'Total Price:' : 'कुल मूल्य:',
    dispatchLabel: language === 'en' ? 'Ready to Dispatch (Days)' : 'डिस्पैच के लिए तैयार (दिन)',
    dispatchHelper:
      language === 'en'
        ? 'The number of days when your produce will be ready for dispatch.'
        : 'कितने दिनों में आपकी फसल डिस्पैच के लिए तैयार होगी।',
    back: language === 'en' ? '← Back' : '← वापस',
    next: language === 'en' ? 'Next →' : 'आगे →',
  };

  return (
    <div
      className="at-page-wrap"
      style={{
        paddingTop: 64,
        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
        minHeight: 'calc(100vh - 72px)',
      }}
    >
      {/* ── Page Header ── */}
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

      {/* ── 860px centered column ── */}
      <div className="at-sell-container" style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 40px' }}>
        {/* Stepper */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <SellCropStepper currentStep={2} language={language} />
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
            padding: '36px 40px',
            marginBottom: 22,
          }}
        >
          {/* Panel heading */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>
              {t.panelHeading}
            </h2>
            <p style={{ fontSize: 14, color: '#666' }}>{t.panelSub}</p>
          </div>

          {/* Selected crop sub-card */}
          <SelectedCropCard
            cropNameEn="Tomato"
            cropNameHi="टमाटर"
            quantity={quantity}
            unit={language === 'en' ? 'Kg' : 'किलोग्राम'}
            language={language}
            photoUrl="https://images.unsplash.com/photo-1592924625601-63601e1bca95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzJTIwcmVhbGlzdGljJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ1MDY4NTR8MA&ixlib=rb-4.1.0&q=80&w=400"
          />

          {/* ──────────────────────────────────────────
              QUANTITY STEPPER ROW
          ────────────────────────────────────────── */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#555', marginBottom: 10, fontWeight: 500 }}>
              {t.qtyLabel}
            </label>

            <div className="at-qty-row" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* — button */}
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  width: 48, height: 48,
                  background: 'rgba(255,255,255,0.75)',
                  border: '1.5px solid #DDD',
                  borderRadius: 10,
                  fontSize: 22,
                  color: '#444',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                −
              </button>

              {/* Number input */}
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: 80,
                  height: 48,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1A1A1A',
                  border: '1.5px solid #DDD',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.75)',
                  outline: 'none',
                  fontFamily: "'Noto Sans', sans-serif",
                }}
              />

              {/* + button */}
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{
                  width: 48, height: 48,
                  background: 'rgba(255,255,255,0.75)',
                  border: '1.5px solid #DDD',
                  borderRadius: 10,
                  fontSize: 22,
                  color: '#444',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                +
              </button>

              {/* Unit label */}
              <span style={{ fontSize: 16, color: '#555', marginLeft: 4 }}>{t.kilograms}</span>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Market Price badge */}
              <div
                style={{
                  background: '#FFF8E1',
                  border: '1px solid #F5A623',
                  borderRadius: 20,
                  padding: '5px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E65100' }}>
                  {t.marketPrice}
                </span>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────
              DIVIDER
          ────────────────────────────────────────── */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 22 }} />

          {/* ─────────────────────────────────────────
              EXPECTED PRICE + TOTAL
          ────────────────────────────────────────── */}
          <div className="at-price-row" style={{ display: 'flex', alignItems: 'flex-end', gap: 48, marginBottom: 24, flexWrap: 'wrap' }}>
            {/* Price input */}
            <div className="at-price-input">
              <label style={{ display: 'block', fontSize: 14, color: '#555', marginBottom: 10, fontWeight: 500 }}>
                {t.priceLabel}
              </label>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    fontSize: 18,
                    color: '#888',
                    fontWeight: 500,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  value={pricePerKg}
                  min={0}
                  onChange={e => setPricePerKg(Math.max(0, parseInt(e.target.value) || 0))}
                  style={{
                    width: 220,
                    height: 52,
                    paddingLeft: 36,
                    paddingRight: 14,
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    border: '1.5px solid rgba(0,0,0,0.12)',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.75)',
                    outline: 'none',
                    fontFamily: "'Noto Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Total price display */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 15, color: '#555' }}>{t.totalLabel}</span>
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: '#2D6A2F',
                    fontFamily: "'Noto Sans', sans-serif",
                  }}
                >
                  ₹ {fmt(totalPrice)}
                </motion.span>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────
              DIVIDER
          ────────────────────────────────────────── */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 22 }} />

          {/* ──────────────────────────────────────────
              READY TO DISPATCH
          ────────────────────────────────────────── */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
                color: '#555',
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              {t.dispatchLabel}
              <Info style={{ width: 15, height: 15, color: '#AAA' }} />
            </label>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <MapPin
                style={{
                  position: 'absolute',
                  left: 12,
                  width: 16,
                  height: 16,
                  color: '#888',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="number"
                value={dispatchDays}
                min={0}
                onChange={e => setDispatchDays(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  width: 120,
                  height: 48,
                  paddingLeft: 36,
                  paddingRight: 8,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1A1A1A',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.75)',
                  outline: 'none',
                  fontFamily: "'Noto Sans', sans-serif",
                }}
              />
              <span style={{ marginLeft: 10, fontSize: 15, color: '#555' }}>
                {language === 'en' ? 'Days' : 'दिन'}
              </span>
            </div>

            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                color: '#888',
                fontStyle: 'italic',
                maxWidth: 420,
              }}
            >
              {t.dispatchHelper}
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="at-sell-nav-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <NavButtons
            onBack={onBack}
            onNext={onNext}
            backLabel={t.back}
            nextLabel={t.next}
          />
        </div>
      </div>
    </div>
  );
}