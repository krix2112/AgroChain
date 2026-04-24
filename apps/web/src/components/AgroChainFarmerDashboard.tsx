import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wheat, Plus, LogOut, Bell, HelpCircle, User,
  RefreshCw, AlertCircle, Eye, X, TrendingUp, Zap, Award,
} from 'lucide-react';

const font  = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

// ── Image URLs ────────────────────────────────────────────────────────────────

const HERO_BG   = 'https://images.unsplash.com/photo-1558534949-0a442809cb33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHJpY2UlMjBwYWRkeSUyMGZpZWxkJTIwYWVyaWFsJTIwZmFybSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzQ2OTA4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1600';
const SELL_IMG  = 'https://images.unsplash.com/photo-1756047890348-e3a5f8e9d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdCUyMGZhcm1lciUyMGhhbmRzfGVufDF8fHx8MTc3NDY5MDg4MHww&ixlib=rb-4.1.0&q=80&w=800';
const OFFER_IMG = 'https://images.unsplash.com/photo-1650012048722-c81295ccbe79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBtYXJrZXQlMjBmcmVzaCUyMHByb2R1Y2UlMjB0cmFkZSUyMHByaWNlJTIwbmVnb3RpYXRpb258ZW58MXx8fHwxNzc0NjkwODgxfDA&ixlib=rb-4.1.0&q=80&w=800';
const ORDER_IMG = 'https://images.unsplash.com/photo-1761456306456-ca7cb67233a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBjYXJnbyUyMGRlbGl2ZXJ5JTIwdHJ1Y2slMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzc0NjkwODgxfDA&ixlib=rb-4.1.0&q=80&w=800';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FarmerUser {
  name:           string;
  phone:          string;
  role:           string;
  walletAddress?: string;
}

type TradeStatus = 'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';

interface Trade {
  tradeId:   string;
  cropName:  string;
  quantity:  number;
  price:     number;
  status:    TradeStatus;
  trader?:   { name: string };
  createdAt?: string;
}

type ModalType = 'sell' | 'offers' | 'orders' | null;

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_TRADES: Trade[] = [
  { tradeId: '1042', cropName: 'Wheat',  quantity: 50,  price: 2000, status: 'COMPLETED',  trader: { name: 'Raj Traders'   }, createdAt: '2024-04-22' },
  { tradeId: '1041', cropName: 'Tomato', quantity: 200, price: 4800, status: 'IN_DELIVERY', trader: { name: 'Vinay Grains'  }, createdAt: '2024-04-20' },
  { tradeId: '1040', cropName: 'Onion',  quantity: 80,  price: 1600, status: 'AGREED',      trader: { name: 'Patel Agro'   }, createdAt: '2024-04-18' },
  { tradeId: '1039', cropName: 'Rice',   quantity: 100, price: 5000, status: 'CREATED',     trader: { name: 'Sharma Foods' }, createdAt: '2024-04-15' },
  { tradeId: '1038', cropName: 'Potato', quantity: 150, price: 2250, status: 'COMPLETED',   trader: { name: 'Goyal Fresh'  }, createdAt: '2024-04-10' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CROP_EMOJI: Record<string, string> = {
  wheat: '🌾', tomato: '🍅', onion: '🧅', rice: '🌾',
  potato: '🥔', corn: '🌽', chilli: '🌶️',
};
function getCropEmoji(name: string) {
  return CROP_EMOJI[name.toLowerCase()] ?? '🌱';
}
function shortWallet(addr?: string) {
  if (!addr) return '0x????...????';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TradeStatus, { label: string; emoji: string; color: string; bg: string; border: string; glow: string; accentBar: string }> = {
  CREATED:     { label: 'Created',     emoji: '⏳', color: '#374151', bg: '#f3f4f6', border: '#d1d5db', glow: 'none', accentBar: '#9ca3af' },
  AGREED:      { label: 'Agreed',      emoji: '🤝', color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd', glow: '0 0 12px rgba(59,130,246,0.20)', accentBar: '#3b82f6' },
  IN_DELIVERY: { label: 'In Delivery', emoji: '🚛', color: '#b45309', bg: '#fef3c7', border: '#fcd34d', glow: '0 0 12px rgba(245,158,11,0.20)', accentBar: '#f59e0b' },
  DELIVERED:   { label: 'Delivered',   emoji: '📦', color: '#c2410c', bg: '#fff7ed', border: '#fdba74', glow: 'none', accentBar: '#f97316' },
  COMPLETED:   { label: 'Completed',   emoji: '✓',  color: '#15803d', bg: '#dcfce7', border: '#86efac', glow: '0 0 12px rgba(22,163,74,0.20)', accentBar: '#16a34a' },
};

// ─── Crop colors ──────────────────────────────────────────────────────────────

const CROP_COLORS: Record<string, { bg: string; border: string }> = {
  wheat:  { bg: '#fef9c3', border: '#fde047' },
  tomato: { bg: '#fee2e2', border: '#fca5a5' },
  onion:  { bg: '#fdf4ff', border: '#e879f9' },
  rice:   { bg: '#ecfdf5', border: '#6ee7b7' },
  potato: { bg: '#fff7ed', border: '#fdba74' },
  corn:   { bg: '#fef3c7', border: '#fcd34d' },
  chilli: { bg: '#fee2e2', border: '#f87171' },
};

function getCropColor(name: string) {
  const key = name.toLowerCase();
  return CROP_COLORS[key] ?? { bg: '#f0fdf4', border: '#d1fae5' };
}

// ─── Modal config ─────────────────────────────────────────────────────────────

const MODAL_CONFIG = {
  sell: {
    icon: '🌾',
    title: 'Sell Your Crop',
    subtitle: 'List your harvest and get the best price from verified buyers.',
    gradient: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
    steps: [
      { icon: '1️⃣', label: 'Select your crop type from the catalog' },
      { icon: '2️⃣', label: 'Set quantity in kg and price per kg' },
      { icon: '3️⃣', label: 'Enter the trader\'s phone number' },
      { icon: '4️⃣', label: 'Trade goes live and is recorded on blockchain' },
    ],
    cta: '🌾 + List New Crop',
  },
  offers: {
    icon: '🤝',
    title: 'View Buyer Offers',
    subtitle: 'See all offers from traders interested in your produce.',
    gradient: 'linear-gradient(135deg, #92400E 0%, #B45309 100%)',
    steps: [
      { icon: '📋', label: 'Browse all incoming offers on your listings' },
      { icon: '💬', label: 'Negotiate directly with buyers' },
      { icon: '✅', label: 'Accept the best deal for your produce' },
      { icon: '🔒', label: 'Deal recorded securely on blockchain' },
    ],
    cta: '🤝 View My Trades',
  },
  orders: {
    icon: '📦',
    title: 'My Orders',
    subtitle: 'Track every trade from farm gate to final delivery.',
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
    steps: [
      { icon: '🚛', label: 'Track transporter location in real-time' },
      { icon: '📍', label: 'Get live delivery status updates' },
      { icon: '💰', label: 'Confirm payment on delivery' },
      { icon: '⭐', label: 'Complete trade securely on blockchain' },
    ],
    cta: '📦 View All Orders',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onListCrop:        () => void;
  onViewTrade?:      (tradeId: string) => void;
  onLogout:          () => void;
  onProfile?:        () => void;
  onMyOrders?:       () => void;
  onViewMyTrades?:   () => void;
  onBrowseRequests?: () => void;
  language:          'en' | 'hi';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#f0fdf4',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: font,
    }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
          style={{ fontSize: 52, marginBottom: 18 }}
        >
          🌱
        </motion.div>
        <p style={{ color: '#2d6a4f', fontWeight: 600, fontSize: 14 }}>Loading your dashboard...</p>
      </div>
    </div>
  );
}

// ─── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1100) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let startTime: number | null = null;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// ─── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ data, color, w = 88, h = 36, uid }: {
  data: number[]; color: string; w?: number; h?: number; uid: string;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const pad = 4;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (w - pad * 2) + pad,
    y: h - pad - ((v - min) / rng) * (h - pad * 2 - 2),
  }));
  let line = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2;
    line += ` C ${cpx},${pts[i - 1].y} ${cpx},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  const area = `${line} L ${pts[pts.length - 1].x},${h} L ${pts[0].x},${h} Z`;
  const gid  = `spk-${uid}`;
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line}  stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3.5" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

// ─── Premium Stat Card ─────────────────────────────────────────────────────────

type FilterKey = 'all' | 'active' | 'completed';

interface StatCardConfig {
  uid:         string;
  filterKey:   FilterKey;
  label:       string;
  subLabel:    string;
  value:       number;
  icon:        React.ReactNode;
  accentColor: string;
  iconGrad:    string;
  cardGrad:    string;
  glowColor:   string;
  sparkData:   number[];
}

function PremiumStatCard({
  cfg, selected, onClick, index,
}: {
  cfg: StatCardConfig; selected: boolean; onClick: () => void; index: number;
}) {
  const [hovered,    setHovered]    = useState(false);
  const [iconPulse,  setIconPulse]  = useState(false);
  const displayCount = useCountUp(cfg.value, 900 + index * 130);

  const handleEnter = () => {
    setHovered(true);
    setIconPulse(true);
    setTimeout(() => setIconPulse(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: index * 0.10, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRadius: 24,
        padding: '28px 28px 22px',
        cursor: 'pointer',
        overflow: 'hidden',
        border: selected
          ? `1.5px solid ${cfg.accentColor}`
          : `1.5px solid rgba(255,255,255,0.74)`,
        boxShadow: selected
          ? `0 0 0 3.5px ${cfg.accentColor}28, 0 20px 56px rgba(0,0,0,0.14)`
          : hovered
          ? `0 18px 52px rgba(0,0,0,0.13), 0 0 0 1.5px ${cfg.accentColor}30`
          : '0 4px 24px rgba(0,0,0,0.07)',
        transform: hovered
          ? 'translateY(-6px) scale(1.022)'
          : 'translateY(0) scale(1)',
        transition: 'transform 0.30s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.24s ease',
      }}
    >
      {/* Background glow orb */}
      <div style={{
        position: 'absolute', top: -32, right: -28,
        width: 120, height: 120, borderRadius: '50%',
        background: cfg.accentColor,
        opacity: selected ? 0.12 : hovered ? 0.09 : 0.045,
        filter: 'blur(30px)',
        transition: 'opacity 0.30s',
        pointerEvents: 'none',
      }} />

      {/* Card gradient tint */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 24,
        background: cfg.cardGrad,
        opacity: selected ? 1 : hovered ? 0.7 : 0,
        transition: 'opacity 0.28s',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          {/* Icon */}
          <motion.div
            animate={iconPulse
              ? { scale: [1, 1.24, 0.93, 1.10, 1], rotate: [0, -7, 5, -2, 0] }
              : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.52, ease: 'easeOut' }}
            style={{
              width: 54, height: 54, borderRadius: 17,
              background: cfg.iconGrad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: hovered || selected
                ? `0 10px 30px ${cfg.glowColor}`
                : `0 4px 14px ${cfg.glowColor.replace('0.45)', '0.22)')}`,
              transition: 'box-shadow 0.28s ease',
            }}
          >
            {cfg.icon}
          </motion.div>
          {/* Sparkline */}
          <div style={{ paddingTop: 3 }}>
            <Sparkline data={cfg.sparkData} color={cfg.accentColor} w={88} h={36} uid={cfg.uid} />
          </div>
        </div>

        {/* Big number */}
        <div style={{
          fontFamily: serif, fontSize: 50, fontWeight: 800,
          color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 8,
        }}>
          {displayCount}
        </div>

        {/* Label */}
        <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
          {cfg.label}
        </div>

        {/* Sub-label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: cfg.accentColor,
            boxShadow: `0 0 6px ${cfg.accentColor}`,
          }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: cfg.accentColor, fontFamily: font }}>
            {cfg.subLabel}
          </span>
        </div>
      </div>

      {/* Bottom accent gradient line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: selected || hovered
          ? `linear-gradient(90deg, ${cfg.accentColor} 0%, ${cfg.accentColor}00 80%)`
          : `linear-gradient(90deg, ${cfg.accentColor}55 0%, ${cfg.accentColor}00 80%)`,
        borderRadius: '0 0 24px 24px',
        transition: 'background 0.28s',
      }} />

      {/* Selected indicator dot */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="sel"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.20 }}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 9, height: 9, borderRadius: '50%',
              background: cfg.accentColor,
              boxShadow: `0 0 9px ${cfg.accentColor}`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TradeCard({ trade, index, onView }: { trade: Trade; index: number; onView: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const s = STATUS_CONFIG[trade.status] ?? STATUS_CONFIG.CREATED;
  const cropColor = getCropColor(trade.cropName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ 
        opacity: 1, 
        y: isHovered ? -3 : 0,
        background: isHovered ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' : '#ffffff',
        borderColor: isHovered ? 'rgba(22,163,74,0.35)' : 'rgba(0,0,0,0.06)',
        boxShadow: isHovered 
          ? '0 12px 40px rgba(0,0,0,0.12), 0 0 0 2px rgba(22,163,74,0.25)'
          : '0 2px 8px rgba(0,0,0,0.06)',
      }}
      transition={{ 
        opacity: { duration: 0.38, delay: index * 0.055 },
        y: { duration: 0.25 },
        background: { duration: 0.25 },
        borderColor: { duration: 0.25 },
        boxShadow: { duration: 0.25 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        border: '1.5px solid',
        borderRadius: 16,
        height: 96,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar (colored bookmark) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: s.accentBar,
          borderRadius: '4px 0 0 4px',
        }}
      />

      {/* Crop icon box */}
      <div
        style={{
          width: 56,
          height: 56,
          background: cropColor.bg,
          border: `1.5px solid ${cropColor.border}`,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          flexShrink: 0,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {getCropEmoji(trade.cropName)}
      </div>

      {/* Crop name + quantity/price */}
      <div style={{ flex: '0 0 auto', minWidth: 140 }}>
        <div
          style={{
            fontFamily: font,
            fontSize: 17,
            fontWeight: 700,
            color: '#111827',
            lineHeight: 1.2,
          }}
        >
          {trade.cropName}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#6b7280',
            marginTop: 4,
          }}
        >
          {trade.quantity} kg · ₹{trade.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Trader section with left border accent */}
      <div
        className="ac-fd-hide-sm"
        style={{
          flex: '1 1 auto',
          minWidth: 140,
          borderLeft: '3px solid #d1fae5',
          paddingLeft: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}
        >
          TRADER
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#1f2937',
          }}
        >
          {trade.trader?.name ?? '��'}
        </div>
      </div>

      {/* Trade ID + Date */}
      <div className="ac-fd-hide-md" style={{ flex: '0 0 auto', minWidth: 110 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 4,
          }}
        >
          Trade #{trade.tradeId}
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          {formatDate(trade.createdAt)}
        </div>
      </div>

      {/* Status badge */}
      <div style={{ flex: '0 0 auto' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: s.bg,
            color: s.color,
            border: `1.5px solid ${s.border}`,
            borderRadius: 20,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: s.glow,
          }}
        >
          <span>{s.emoji}</span>
          {s.label}
        </span>
      </div>

      {/* View Details button */}
      <motion.button
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        animate={{
          background: (isHovered && buttonHovered) ? '#15803d' : 'rgba(0,0,0,0)',
          color: (isHovered && buttonHovered) ? '#ffffff' : '#6b7280',
          borderColor: (isHovered && buttonHovered) ? '#15803d' : '#e5e7eb',
          boxShadow: (isHovered && buttonHovered) ? '0 4px 12px rgba(22,163,74,0.30)' : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.25 }}
        whileTap={{ scale: 0.95 }}
        onClick={onView}
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: '1.5px solid',
          borderRadius: 10,
          padding: '8px 18px',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: font,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        View Details
        <motion.span
          animate={{ x: (isHovered && buttonHovered) ? 4 : 0 }}
          transition={{ duration: 0.25 }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

function EmptyState({ onCTA }: { onCTA: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#ffffff', border: '2px dashed #d1fae5', borderRadius: 20,
        padding: '72px 32px', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 18 }}>🌱</div>
      <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
        No trades yet
      </h3>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28, maxWidth: 320, margin: '0 auto 28px' }}>
        List your first crop and start getting offers from buyers.
      </p>
      <motion.button
        whileHover={{ boxShadow: '0 8px 24px rgba(27,67,50,0.35)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onCTA}
        style={{
          background: '#1b4332', color: '#ffffff', border: 'none',
          borderRadius: 14, padding: '13px 28px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(27,67,50,0.28)',
        }}
      >
        🌾 List Your First Crop
      </motion.button>
    </motion.div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  photoUrl, overlay, icon, title, desc, height, onClick,
}: {
  photoUrl: string;
  overlay: string;
  icon: string;
  title: string;
  desc: string;
  height: number | string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 18, cursor: 'pointer', height,
      }}
    >
      {/* Photo with zoom */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: hovered ? 'scale(1.10)' : 'scale(1.0)',
          transition: 'transform 0.70s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />

      {/* Color overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: overlay,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute', inset: 0,
          padding: 18, display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between',
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            width: 36, height: 36,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 18, border: '1px solid rgba(255,255,255,0.22)',
            flexShrink: 0, alignSelf: 'flex-start',
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div>
          <div style={{
            color: '#ffffff', fontWeight: 700,
            fontSize: 16, fontFamily: font,
            textShadow: '0 1px 6px rgba(0,0,0,0.35)',
          }}>
            {title}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 12,
            marginTop: 3, lineHeight: 1.4,
            fontFamily: font,
          }}>
            {desc}
          </div>
          {/* Hover hint */}
          <div
            style={{
              marginTop: 8, fontSize: 12,
              color: '#86efac', fontWeight: 600,
              fontFamily: font,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.25s, transform 0.25s',
            }}
          >
            Click to get started →
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgroChainFarmerDashboard({
  onListCrop, onViewTrade, onLogout, onProfile, onMyOrders, onViewMyTrades, onBrowseRequests, language,
}: Props) {
  const [user,        setUser]        = useState<FarmerUser | null>(null);
  const [trades,      setTrades]      = useState<Trade[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [apiLive,     setApiLive]     = useState(false);
  const [refreshKey,  setRefreshKey]  = useState(0);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modal,       setModal]       = useState<ModalType>(null);
  const [scrollY,     setScrollY]     = useState(0);
  const [statFilter,  setStatFilter]  = useState<FilterKey>('all');

  // Parallax scroll listener
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Auth + data fetch
  useEffect(() => {
    const token   = localStorage.getItem('agrochain_token');
    const userRaw = localStorage.getItem('agrochain_user');
    if (userRaw) {
      try { setUser(JSON.parse(userRaw)); } catch { /* ignore */ }
    }
    fetchTrades(token ?? '');
  }, [refreshKey]);

  async function fetchTrades(token: string) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/trade/my/all`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : (data.trades ?? DUMMY_TRADES));
      setApiLive(true);
    } catch {
      setTrades(DUMMY_TRADES);
      setApiLive(false);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    onLogout();
  }

  // Derived stats
  const total     = trades.length;
  const active    = trades.filter(t =>
    ['CREATED', 'AGREED', 'IN_DELIVERY', 'DELIVERED'].includes(t.status)
  ).length;
  const completed   = trades.filter(t => t.status === 'COMPLETED').length;
  const inDelivery  = trades.filter(t => t.status === 'IN_DELIVERY').length;

  // Filtered trades for list
  const displayedTrades = statFilter === 'active'
    ? trades.filter(t => ['CREATED', 'AGREED', 'IN_DELIVERY', 'DELIVERED'].includes(t.status))
    : statFilter === 'completed'
    ? trades.filter(t => t.status === 'COMPLETED')
    : trades;

  // Premium stat card configs
  const STAT_CARDS: StatCardConfig[] = [
    {
      uid: 'total', filterKey: 'all',
      label: 'Total Trades', subLabel: '+2 this week', value: total,
      icon: <TrendingUp size={24} color="#ffffff" strokeWidth={2.2} />,
      accentColor: '#0891b2',
      iconGrad:    'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      cardGrad:    'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(6,182,212,0.03) 100%)',
      glowColor:   'rgba(8,145,178,0.45)',
      sparkData:   [2, 3, 3, 4, 4, 5, 5],
    },
    {
      uid: 'active', filterKey: 'active',
      label: 'Active Trades', subLabel: `${inDelivery} in delivery`, value: active,
      icon: <Zap size={24} color="#ffffff" strokeWidth={2.2} />,
      accentColor: '#d97706',
      iconGrad:    'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      cardGrad:    'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(249,115,22,0.03) 100%)',
      glowColor:   'rgba(217,119,6,0.45)',
      sparkData:   [1, 3, 2, 4, 3, 3, 3],
    },
    {
      uid: 'completed', filterKey: 'completed',
      label: 'Completed Trades', subLabel: '+1 this week', value: completed,
      icon: <Award size={24} color="#ffffff" strokeWidth={2.2} />,
      accentColor: '#16a34a',
      iconGrad:    'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
      cardGrad:    'linear-gradient(135deg, rgba(22,163,74,0.06) 0%, rgba(16,185,129,0.03) 100%)',
      glowColor:   'rgba(22,163,74,0.45)',
      sparkData:   [0, 0, 1, 1, 1, 2, 2],
    },
  ];

  const farmerName    = user?.name ?? 'Farmer';
  const firstName     = farmerName.split(' ')[0];
  const activeModal   = modal ? MODAL_CONFIG[modal] : null;

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ minHeight: '100vh', fontFamily: font, background: '#f0fdf4' }}>
      <style>{`
        @media (max-width: 640px) {
          .ac-fd-hide-sm { display: none !important; }
        }
        @media (max-width: 900px) {
          .ac-fd-hide-md  { display: none !important; }
          .ac-fd-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .ac-fd-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        background: '#1b4332', height: 64,
        padding: '0 24px 0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(0,0,0,0.20)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'rgba(255,255,255,0.12)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
            border: '1px solid rgba(255,255,255,0.20)',
          }}>
            🌱
          </div>
          <span style={{
            fontFamily: serif, fontSize: 20, fontWeight: 800,
            color: '#ffffff', letterSpacing: '-0.02em',
          }}>
            AgroChain
          </span>
        </div>

        {/* Welcome */}
        <span className="ac-fd-hide-sm" style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)' }}>
          Welcome,{' '}
          <span style={{ color: '#ffffff', fontWeight: 600 }}>{farmerName}</span>
        </span>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user?.walletAddress && (
            <span className="ac-fd-hide-sm" style={{
              fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.65)',
              background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: 99, padding: '4px 12px',
            }}>
              {shortWallet(user.walletAddress)}
            </span>
          )}

          {!apiLive && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#b45309',
              background: '#fef3c7', borderRadius: 99, padding: '3px 10px',
            }}>
              Demo
            </span>
          )}

          {/* Refresh */}
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            onClick={() => setRefreshKey(k => k + 1)}
            title="Refresh"
            style={{
              width: 34, height: 34, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.10)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.80)',
            }}
          >
            <RefreshCw size={14} />
          </motion.button>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.10)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.85)', position: 'relative',
              }}
            >
              <Bell size={15} />
              <span style={{
                position: 'absolute', top: 7, right: 7, width: 6, height: 6,
                borderRadius: '50%', background: '#ef4444', border: '1.5px solid #1b4332',
              }} />
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: 42, right: 0, width: 300,
                    background: '#ffffff', border: '1.5px solid #d1fae5',
                    borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                    overflow: 'hidden', zIndex: 200,
                  }}
                >
                  <div style={{ padding: '13px 16px', borderBottom: '1px solid #f0fdf4' }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#052e16' }}>Notifications</p>
                  </div>
                  {[
                    { text: 'Raj Traders made an offer on your Tomato listing', time: '2m ago' },
                    { text: 'Your Wheat order #1042 has been delivered', time: '1h ago' },
                    { text: 'New buyer in your area: Patel Agro', time: '3h ago' },
                  ].map((n, i) => (
                    <div key={i} style={{
                      padding: '11px 16px', borderBottom: i < 2 ? '1px solid #f9fafb' : 'none',
                      display: 'flex', gap: 10,
                    }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#14532d', marginTop: 5, flexShrink: 0,
                      }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{n.text}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#9ca3af' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 12px 5px 5px', borderRadius: 99,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.12)', cursor: 'pointer', fontFamily: font,
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={13} color="#ffffff" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{farmerName}</span>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: 42, right: 0, width: 200,
                    background: '#ffffff', border: '1.5px solid #d1fae5',
                    borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    overflow: 'hidden', zIndex: 200,
                  }}
                >
                  <button
                    onClick={() => { onProfile?.(); setProfileOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '12px 16px', border: 'none',
                      background: 'rgba(0,0,0,0)', cursor: 'pointer',
                      textAlign: 'left', fontSize: 14, color: '#374151',
                      fontFamily: font, borderBottom: '1px solid #f9fafb',
                      transition: 'background 0.14s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                  >
                    <span style={{ color: '#14532d' }}><User size={14} /></span>
                    My Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '12px 16px', border: 'none',
                      background: 'rgba(0,0,0,0)', cursor: 'pointer',
                      textAlign: 'left', fontSize: 14, color: '#dc2626',
                      fontFamily: font, transition: 'background 0.14s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION — parallax farm photo + feature cards
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: 540,
          marginTop: -1, // avoid 1px gap
        }}
      >
        {/* Parallax background photo */}
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            height: '135%',
            top: '-17%',
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            transform: `translateY(${scrollY * 0.4}px)`,
            filter: 'brightness(0.52)',
            willChange: 'transform',
          }}
        />

        {/* Gradient overlay — dark top, fades to #f0fdf4 at bottom */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(27,67,50,0.55) 0%, rgba(27,67,50,0.15) 50%, #f0fdf4 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            maxWidth: 1100, margin: '0 auto',
            padding: '36px 28px 0',
          }}
        >
          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ marginBottom: 26 }}
          >
            <p style={{
              color: '#86efac', fontSize: 13, fontWeight: 600,
              marginBottom: 6, fontFamily: font, letterSpacing: '0.02em',
            }}>
              🌿 {language === 'hi' ? 'किसान डैशबोर्ड' : 'Farmer Dashboard'}
            </p>
            <h1 style={{
              fontFamily: serif, fontSize: 'clamp(26px, 3vw, 38px)',
              fontWeight: 800, color: '#ffffff',
              margin: 0, lineHeight: 1.15,
              textShadow: '0 2px 20px rgba(0,0,0,0.40)',
              letterSpacing: '-0.01em',
            }}>
              {language === 'hi'
                ? `नमस्ते, ${firstName}!`
                : `Welcome to AgroChain, ${firstName}!`}
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.72)', fontSize: 14,
              marginTop: 8, fontFamily: font, lineHeight: 1.5,
            }}>
              {language === 'hi'
                ? 'कृषि को डिजिटल बनाना आसान है। अपनी उपज सूचीबद्ध करें, ऑफर पाएं, डिलीवरी ट्रैक करें।'
                : 'Digitizing agriculture made easy. List your produce, get offers, and track deliveries effortlessly.'}
            </p>
          </motion.div>

          {/* ── 3 Feature Cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 22,
              padding: 16,
              display: 'grid',
              gridTemplateColumns: '1fr 1.8fr',
              gap: 14,
            }}
          >
            {/* LEFT — Sell Crop (full-height) */}
            <FeatureCard
              photoUrl={SELL_IMG}
              overlay="linear-gradient(to top, rgba(27,67,50,0.92) 0%, rgba(27,67,50,0.45) 55%, rgba(0,0,0,0.05) 100%)"
              icon="🌾"
              title={language === 'hi' ? 'फसल बेचें' : 'Sell Crop'}
              desc={language === 'hi' ? 'अपनी फसल सूचीबद्ध करें, कीमत तय करें, ऑफर पाएं।' : 'List your harvest, set a price, get offers.'}
              height={268}
              onClick={() => setModal('sell')}
            />

            {/* RIGHT — stacked 2 cards + strip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Top row: View Offers + My Orders side by side — grows to fill remaining height */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
                <FeatureCard
                  photoUrl={OFFER_IMG}
                  overlay="linear-gradient(to top, rgba(120,53,15,0.92) 0%, rgba(146,64,14,0.50) 60%, rgba(0,0,0,0.05) 100%)"
                  icon="💬"
                  title={language === 'hi' ? 'ऑफर देखें' : 'View Offers'}
                  desc={language === 'hi' ? 'सबसे अच्छे दाम पर बातचीत करें।' : 'Check offers and negotiate best prices'}
                  height="100%"
                  onClick={() => onViewMyTrades?.()}
                />
                <FeatureCard
                  photoUrl={ORDER_IMG}
                  overlay="linear-gradient(to top, rgba(30,58,95,0.92) 0%, rgba(37,99,235,0.50) 60%, rgba(0,0,0,0.05) 100%)"
                  icon="📦"
                  title={language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}
                  desc={language === 'hi' ? 'खेत से खरीदार तक ट्रैक करें।' : 'Track your produce from farm to buyer.'}
                  height="100%"
                  onClick={() => setModal('orders')}
                />
              </div>

              {/* Bottom strip — hugs to bottom, no extra space */}
              <div
                style={{
                  flex: '0 0 auto',
                  background: 'rgba(255,255,255,0.50)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.40)',
                  borderRadius: 14,
                  padding: '18px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: 14, fontFamily: font }}>
                    {language === 'hi' ? 'मिनटों में फसल सूचीबद्ध करें' : 'List your harvest in minutes'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: 12, marginTop: 2, fontFamily: font }}>
                    {language === 'hi'
                      ? '1. फसल चुनें · 2. कीमत तय करें · 3. लाइव!'
                      : '1. Select Crop · 2. Set Price & Quantity · 3. Go Live!'}
                  </div>
                </div>
                <motion.button
                  whileHover={{ background: '#2d6a4f', boxShadow: '0 6px 20px rgba(27,67,50,0.50)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onListCrop}
                  style={{
                    background: '#1b4332', color: '#ffffff',
                    border: 'none', borderRadius: 12,
                    padding: '10px 20px', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: font,
                    boxShadow: '0 4px 14px rgba(27,67,50,0.30)',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  <span>🌿</span>
                  {language === 'hi' ? 'शुरू करें' : 'Start Listing'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          DASHBOARD CONTENT — seamlessly below hero
      ════════════════════════════════════════════════════════════════════════ */}
      <main
        style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '12px 28px 64px',
          background: 'transparent',
        }}
      >
        {/* Stats row — premium cards */}
        <div
          className="ac-fd-stats-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}
        >
          {STAT_CARDS.map((cfg, i) => (
            <PremiumStatCard
              key={cfg.uid}
              cfg={cfg}
              index={i}
              selected={statFilter === cfg.filterKey}
              onClick={() => setStatFilter(prev => prev === cfg.filterKey ? 'all' : cfg.filterKey)}
            />
          ))}
        </div>

        {/* ── Quick Actions row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.18 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            flexWrap: 'wrap', marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {language === 'hi' ? 'त्वरित कार्य:' : 'Quick Actions:'}
          </span>
          <motion.button
            whileHover={{ background: '#14532d', boxShadow: '0 6px 18px rgba(20,83,45,0.35)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onBrowseRequests?.()}
            style={{
              background: '#15803d', color: '#ffffff',
              border: 'none', borderRadius: 12,
              padding: '9px 18px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: font,
              display: 'inline-flex', alignItems: 'center', gap: 7,
              boxShadow: '0 3px 12px rgba(21,128,61,0.26)',
              transition: 'background 0.20s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1.5" width="12" height="2.4" rx="1.2" fill="white"/>
              <rect x="1" y="5.8" width="8" height="2.4" rx="1.2" fill="white"/>
              <rect x="1" y="10" width="10" height="2.4" rx="1.2" fill="white"/>
            </svg>
            {language === 'hi' ? 'व्यापारी मांगें देखें' : 'Browse Requests'}
          </motion.button>
          <motion.button
            whileHover={{ background: '#f0fdf4' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onViewMyTrades?.()}
            style={{
              background: 'rgba(255,255,255,0.80)',
              border: '1.5px solid #d1fae5',
              borderRadius: 12,
              padding: '9px 18px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: font, color: '#15803d',
              display: 'inline-flex', alignItems: 'center', gap: 7,
              transition: 'background 0.18s',
            }}
          >
            {language === 'hi' ? 'मेरे ट्रेड' : 'My Trades'} →
          </motion.button>
        </motion.div>

        {/* Trades section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
              My Trades
            </h2>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#6b7280',
              background: '#f3f4f6', borderRadius: 99, padding: '4px 12px',
            }}>
              {displayedTrades.length} {displayedTrades.length === 1 ? 'trade' : 'trades'}
            </span>
            {statFilter !== 'all' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  color:      statFilter === 'active' ? '#d97706' : '#16a34a',
                  background: statFilter === 'active' ? '#fef3c7' : '#dcfce7',
                  border: `1px solid ${statFilter === 'active' ? '#fcd34d' : '#86efac'}`,
                  borderRadius: 99, padding: '4px 12px',
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontFamily: font,
                }}
                onClick={() => setStatFilter('all')}
              >
                {statFilter === 'active' ? 'Active only' : 'Completed only'} · ✕
              </motion.button>
            )}
            {!apiLive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4 }}>
                <AlertCircle size={13} color="#b45309" />
                <span style={{ fontSize: 12, color: '#b45309' }}>Demo data — API offline</span>
              </div>
            )}
          </div>

          {/* Status legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {(Object.entries(STATUS_CONFIG) as [TradeStatus, typeof STATUS_CONFIG[TradeStatus]][]).map(([key, cfg]) => (
              <span key={key} style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
              }}>
                {cfg.label}
              </span>
            ))}
          </div>

          {/* Trade list */}
          {displayedTrades.length === 0 ? (
            <EmptyState onCTA={onListCrop} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {displayedTrades.map((trade, i) => (
                <TradeCard
                  key={trade.tradeId}
                  trade={trade}
                  index={i}
                  onView={() => onViewTrade?.(trade.tradeId)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          POPUP MODALS
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modal && activeModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.20 }}
            onClick={() => setModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16,
              background: 'rgba(0,0,0,0.52)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          >
            <motion.div
              key="modal-card"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.90, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff', borderRadius: 26,
                width: '100%', maxWidth: 440, overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.32)',
              }}
            >
              {/* Colored header */}
              <div
                style={{
                  background: activeModal.gradient,
                  padding: '28px 28px 24px',
                  position: 'relative',
                }}
              >
                {/* × close */}
                <button
                  onClick={() => setModal(null)}
                  style={{
                    position: 'absolute', top: 14, right: 14,
                    width: 32, height: 32,
                    background: 'rgba(255,255,255,0.18)',
                    border: 'none', borderRadius: '50%',
                    cursor: 'pointer', color: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.18s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                >
                  <X size={16} />
                </button>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{activeModal.icon}</div>
                <h2 style={{
                  fontFamily: serif, fontSize: 24, fontWeight: 800,
                  color: '#ffffff', margin: '0 0 6px', lineHeight: 1.2,
                }}>
                  {activeModal.title}
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.72)', fontSize: 14,
                  margin: 0, lineHeight: 1.5, fontFamily: font,
                }}>
                  {activeModal.subtitle}
                </p>
              </div>

              {/* Steps + CTA */}
              <div style={{ padding: '24px 28px 28px' }}>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: '#9ca3af',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  margin: '0 0 16px', fontFamily: font,
                }}>
                  How it works
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {activeModal.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.07, duration: 0.30 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{
                        width: 36, height: 36, background: '#f0fdf4',
                        borderRadius: 10, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 18, flexShrink: 0,
                        border: '1.5px solid #d1fae5',
                      }}>
                        {step.icon}
                      </div>
                      <span style={{ fontSize: 14, color: '#374151', fontFamily: font, lineHeight: 1.4 }}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    whileHover={{ background: '#2d6a4f', boxShadow: '0 6px 20px rgba(27,67,50,0.35)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setModal(null);
                      if (modal === 'sell') onListCrop();
                      else if (modal === 'orders') onMyOrders?.();
                    }}
                    style={{
                      flex: 1, background: '#1b4332', color: '#ffffff',
                      border: 'none', borderRadius: 14,
                      padding: '13px 16px', fontSize: 14, fontWeight: 700,
                      cursor: 'pointer', fontFamily: font,
                      boxShadow: '0 4px 14px rgba(27,67,50,0.28)',
                      transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {activeModal.cta}
                  </motion.button>
                  <button
                    onClick={() => setModal(null)}
                    style={{
                      padding: '13px 20px', borderRadius: 14,
                      border: '1.5px solid #e5e7eb', color: '#6b7280',
                      background: '#ffffff', fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', fontFamily: font,
                      transition: 'background 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Close dropdowns on backdrop click */}
      {(notifOpen || profileOpen) && (
        <div
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
        />
      )}
    </div>
  );
}