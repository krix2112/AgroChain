import { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

const font  = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

// ─── Types ────────────────────────────────────────────────────────────────────

type TradeState = 'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';

interface Trade {
  tradeId:   string;
  cropName:  string;
  quantity:  number;
  price:     number;
  state:    TradeState;
  traderName: string;
  date:      string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRADES: Trade[] = [
  { tradeId: '1042', cropName: 'Wheat',  quantity: 50,  price: 2000, state: 'COMPLETED',  traderName: 'Raj Traders',   date: '22 Apr 2024' },
  { tradeId: '1041', cropName: 'Tomato', quantity: 200, price: 4800, state: 'IN_DELIVERY', traderName: 'Vinay Grains',  date: '20 Apr 2024' },
  { tradeId: '1040', cropName: 'Onion',  quantity: 80,  price: 1600, state: 'AGREED',      traderName: 'Patel Agro',    date: '18 Apr 2024' },
  { tradeId: '1039', cropName: 'Rice',   quantity: 100, price: 5000, state: 'CREATED',     traderName: 'Sharma Foods',  date: '15 Apr 2024' },
  { tradeId: '1038', cropName: 'Potato', quantity: 150, price: 2250, state: 'COMPLETED',   traderName: 'Goyal Fresh',   date: '10 Apr 2024' },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TradeState, {
  label:     string;
  emoji:     string;
  color:     string;
  bg:        string;
  border:    string;
  glow:      string;
  accentBar: string;
  tabBg:     string;
  tabColor:  string;
  tabBorder: string;
}> = {
  CREATED: {
    label: 'Created', emoji: '⏳', color: '#374151',
    bg: '#f3f4f6', border: '#d1d5db', glow: 'none', accentBar: '#9ca3af',
    tabBg: 'transparent', tabColor: '#374151', tabBorder: '#d1d5db',
  },
  AGREED: {
    label: 'Agreed', emoji: '🤝', color: '#1d4ed8',
    bg: '#dbeafe', border: '#93c5fd', glow: '0 0 14px rgba(59,130,246,0.20)', accentBar: '#3b82f6',
    tabBg: '#dbeafe', tabColor: '#1d4ed8', tabBorder: '#93c5fd',
  },
  IN_DELIVERY: {
    label: 'In Delivery', emoji: '🚛', color: '#b45309',
    bg: '#fef3c7', border: '#fcd34d', glow: '0 0 14px rgba(245,158,11,0.20)', accentBar: '#f59e0b',
    tabBg: '#fef3c7', tabColor: '#b45309', tabBorder: '#fcd34d',
  },
  DELIVERED: {
    label: 'Delivered', emoji: '📦', color: '#c2410c',
    bg: '#fff7ed', border: '#fdba74', glow: 'none', accentBar: '#f97316',
    tabBg: '#fff7ed', tabColor: '#c2410c', tabBorder: '#fdba74',
  },
  COMPLETED: {
    label: 'Completed', emoji: '✓', color: '#15803d',
    bg: '#dcfce7', border: '#86efac', glow: '0 0 14px rgba(22,163,74,0.20)', accentBar: '#16a34a',
    tabBg: '#dcfce7', tabColor: '#15803d', tabBorder: '#86efac',
  },
};

const CROP_CONFIG: Record<string, { bg: string; border: string; emoji: string }> = {
  wheat:  { bg: '#fef9c3', border: '#fde047', emoji: '🌾' },
  tomato: { bg: '#fee2e2', border: '#fca5a5', emoji: '🍅' },
  onion:  { bg: '#fdf4ff', border: '#e879f9', emoji: '🧅' },
  rice:   { bg: '#ecfdf5', border: '#6ee7b7', emoji: '🌾' },
  potato: { bg: '#fff7ed', border: '#fdba74', emoji: '🥔' },
};

function getCropConfig(name: string) {
  return CROP_CONFIG[name.toLowerCase()] ?? { bg: '#f0fdf4', border: '#d1fae5', emoji: '🌱' };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  language:     'en' | 'hi';
  onViewTrade?: (tradeId: string) => void;
  onBack?:      () => void;
}

// ─── Trade Card ───────────────────────────────────────────────────────────────

function TradeRow({ trade, onView }: { trade: Trade; onView: () => void }) {
  const [hovered, setHovered]       = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const s    = STATUS_CONFIG[trade.state];
  const crop = getCropConfig(trade.cropName);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setBtnHovered(false); }}
      style={{
        position: 'relative',
        height: 100,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        background: hovered
          ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
          : 'transparent',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.10)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.20s ease',
        cursor: 'default',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 4,
          background: s.accentBar,
          borderRadius: '4px 0 0 4px',
          boxShadow: hovered ? `4px 0 16px ${s.accentBar}66` : 'none',
          transition: 'box-shadow 0.20s ease',
        }}
      />

      {/* Zone 1 — Crop icon */}
      <div
        style={{
          width: 56, height: 56,
          background: crop.bg,
          border: `1.5px solid ${crop.border}`,
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginLeft: 16,
          marginRight: 20,
        }}
      >
        {crop.emoji}
      </div>

      {/* Zone 2 — Crop name + price */}
      <div style={{ minWidth: 160, marginRight: 24 }}>
        <div style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
          {trade.cropName}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          {trade.quantity} kg · ₹{trade.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Zone 3 — Trader (with vertical divider) */}
      <div
        style={{
          borderLeft: '1px solid #e5e7eb',
          paddingLeft: 24,
          minWidth: 160,
          marginRight: 24,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          TRADER
        </div>
        <div style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: '#1f2937', marginTop: 3 }}>
          {trade.traderName}
        </div>
      </div>

      {/* Zone 4 — Trade ID + Date */}
      <div style={{ minWidth: 130, marginRight: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
          Trade #{trade.tradeId}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
          {trade.date}
        </div>
      </div>

      {/* Zone 5 — Status Badge */}
      <div style={{ flex: 1 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: s.bg,
            color: s.color,
            border: `1.5px solid ${s.border}`,
            borderRadius: 20,
            padding: '7px 18px',
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: hovered ? s.glow : 'none',
            transition: 'box-shadow 0.20s ease',
          }}
        >
          <span>{s.emoji}</span>
          {s.label}
        </span>
      </div>

      {/* Zone 6 — View Details button */}
      <button
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        onClick={onView}
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: `1.5px solid ${(hovered && btnHovered) ? '#15803d' : '#e5e7eb'}`,
          borderRadius: 10,
          padding: '9px 20px',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: font,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          background: (hovered && btnHovered) ? '#15803d' : 'transparent',
          color: (hovered && btnHovered) ? '#ffffff' : '#6b7280',
          boxShadow: (hovered && btnHovered) ? '0 4px 14px rgba(22,163,74,0.30)' : 'none',
          transition: 'all 0.20s ease',
        }}
      >
        View Details
        <span
          style={{
            display: 'inline-block',
            transform: (hovered && btnHovered) ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 0.20s ease',
          }}
        >
          →
        </span>
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AgroChainMyTrades({ language, onViewTrade, onBack }: Props) {
  const [activeFilter, setActiveFilter] = useState<TradeState | 'ALL'>('ALL');

  const total     = TRADES.length;
  const active    = TRADES.filter(t => ['CREATED', 'AGREED', 'IN_DELIVERY'].includes(t.state)).length;
  const completed = TRADES.filter(t => t.state === 'COMPLETED').length;

  const filtered = activeFilter === 'ALL'
    ? TRADES
    : TRADES.filter(t => t.state === activeFilter);

  const TABS: Array<{ key: TradeState | 'ALL'; label: string }> = [
    { key: 'ALL',         label: 'All Trades' },
    { key: 'CREATED',     label: 'Created'    },
    { key: 'AGREED',      label: 'Agreed'     },
    { key: 'IN_DELIVERY', label: 'In Delivery'},
    { key: 'DELIVERED',   label: 'Delivered'  },
    { key: 'COMPLETED',   label: 'Completed'  },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: font,
        paddingTop: 64, // below fixed navbar
      }}
    >
      {/* ── Page wrapper with left-aligned layout ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px' }}>

        {/* ── Page Header (28px below navbar = 28px padding-top) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ paddingTop: 28, paddingBottom: 20 }}
        >
          {/* Back link */}
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20,
                padding: '5px 14px', fontSize: 13, fontWeight: 500,
                color: '#374151', cursor: 'pointer', marginBottom: 16,
                fontFamily: font, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.90)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.70)'}
            >
              ← {language === 'hi' ? 'होम पर वापस' : 'Back to Home'}
            </button>
          )}

          <h1
            style={{
              fontFamily: serif, fontSize: 36, fontWeight: 700,
              color: '#1A1A1A', margin: 0, lineHeight: 1.15,
              textShadow: '0 1px 8px rgba(255,255,255,0.60)',
            }}
          >
            {language === 'hi' ? 'मेरे ट्रेड' : 'My Trades'}
          </h1>

          {/* Badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span
              style={{
                fontSize: 13, fontWeight: 600, color: '#6b7280',
                background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 20, padding: '5px 14px',
                backdropFilter: 'blur(8px)',
              }}
            >
              {total} {language === 'hi' ? 'ट्रेड' : 'trades'}
            </span>
            <span
              style={{
                fontSize: 13, fontWeight: 600, color: '#92400e',
                background: 'rgba(255,243,199,0.90)', border: '1px solid #fcd34d',
                borderRadius: 20, padding: '5px 14px',
                backdropFilter: 'blur(8px)',
              }}
            >
              ⚠ {language === 'hi' ? 'डेमो डेटा — API ऑफलाइन' : 'Demo data — API offline'}
            </span>
          </div>
        </motion.div>

        {/* ── Filter Tab Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {TABS.map(tab => {
            const isActive = activeFilter === tab.key;
            const cfg = tab.key !== 'ALL' ? STATUS_CONFIG[tab.key] : null;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  borderRadius: 20,
                  padding: '6px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: font,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: `1.5px solid ${
                    isActive
                      ? (cfg ? cfg.tabBorder : '#14532d')
                      : (cfg ? cfg.tabBorder : '#d1d5db')
                  }`,
                  background: isActive
                    ? (cfg ? cfg.tabBg : '#dcfce7')
                    : 'transparent',
                  color: isActive
                    ? (cfg ? cfg.tabColor : '#15803d')
                    : '#6b7280',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Main Glass Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.50, delay: 0.14 }}
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.55)',
            borderRadius: 24,
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            marginBottom: 32,
          }}
        >
          {/* Trade rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
              <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: '#374151', margin: 0 }}>
                No trades in this category
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((trade, idx) => (
                <motion.div
                  key={trade.tradeId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                >
                  <TradeRow
                    trade={trade}
                    onView={() => onViewTrade?.(trade.tradeId)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary Stats Strip */}
          <div
            style={{
              background: 'rgba(248,250,252,0.80)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 0,
            }}
          >
            <span style={{ fontSize: 14, color: '#6b7280', fontFamily: font }}>
              {language === 'hi' ? 'कुल ट्रेड:' : 'Total Trades:'}{' '}
              <strong style={{ color: '#1A1A1A' }}>{total}</strong>
            </span>
            <span style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 20px', display: 'inline-block' }} />
            <span style={{ fontSize: 14, color: '#6b7280', fontFamily: font }}>
              {language === 'hi' ? 'सक्रिय:' : 'Active:'}{' '}
              <strong style={{ color: '#f59e0b' }}>{active}</strong>
            </span>
            <span style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 20px', display: 'inline-block' }} />
            <span style={{ fontSize: 14, color: '#6b7280', fontFamily: font }}>
              {language === 'hi' ? 'पूर्ण:' : 'Completed:'}{' '}
              <strong style={{ color: '#16a34a' }}>{completed}</strong>
            </span>
          </div>
        </motion.div>

      </div>

      {/* Floating Help */}
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
        <HelpCircle size={20} color="#ffffff" />
      </motion.button>
    </div>
  );
}
