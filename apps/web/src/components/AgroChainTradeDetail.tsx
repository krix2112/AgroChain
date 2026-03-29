import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { HelpCircle, ExternalLink, RefreshCw, Zap, X } from 'lucide-react';

const font  = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TradeUser {
  name:           string;
  phone:          string;
  walletAddress?: string;
}

interface Trade {
  tradeId:      string;
  cropName:     string;
  quantity:     number;
  price:        number;
  state:        'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';
  farmer:       TradeUser;
  trader:       TradeUser;
  transporter?: TradeUser;
  utrHash?:     string;
  txHash?:      string;
  createdAt?:   string;
  agreedAt?:    string;
  pickedAt?:    string;
  deliveredAt?: string;
  completedAt?: string;
}

// ─── Dummy fallback ───────────────────────────────────────────────────────────

const DUMMY_TRADE: Trade = {
  tradeId:     '1042',
  cropName:    'Wheat',
  quantity:    50,
  price:       2000,
  state:       'IN_DELIVERY',
  farmer:      { name: 'Ramesh Kumar',     phone: '9876543210', walletAddress: '0x3f4a8b2c9d1e5f7a' },
  trader:      { name: 'Raj Traders',      phone: '9123456780', walletAddress: '0xab12cd34ef567890' },
  transporter: { name: 'Suresh Logistics', phone: '9988776655' },
  txHash:      '0xabc123def456789abcdef1234567890abcdef1234567890ab',
  createdAt:   '2024-04-22T09:00:00Z',
  agreedAt:    '2024-04-22T14:00:00Z',
  pickedAt:    '2024-04-23T08:00:00Z',
};

// ─── Status order ─────────────────────────────────────────────────────────────

const STATUS_ORDER = ['CREATED', 'AGREED', 'IN_DELIVERY', 'DELIVERED', 'COMPLETED'];

function stateIndex(s: string) {
  return STATUS_ORDER.indexOf(s);
}

// ─── Timeline steps ───────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: 'CREATED',     label: 'Trade Created', date: '22 Apr, 02:30 pm' },
  { key: 'AGREED',      label: 'Agreed',        date: '22 Apr, 07:30 pm' },
  { key: 'IN_DELIVERY', label: 'In Delivery',   date: '23 Apr, 01:30 pm' },
  { key: 'DELIVERED',   label: 'Delivered',     date: ''                  },
  { key: 'COMPLETED',   label: 'Completed',     date: ''                  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  CREATED:     { label: 'Created',     color: '#4b5563', bg: '#f3f4f6', border: '#e5e7eb' },
  AGREED:      { label: 'Agreed',      color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' },
  IN_DELIVERY: { label: 'In Delivery', color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  DELIVERED:   { label: 'Delivered',   color: '#c2410c', bg: '#ffedd5', border: '#fed7aa' },
  COMPLETED:   { label: 'Completed',   color: '#166534', bg: '#dcfce7', border: '#86efac' },
};

// ─── Geometric SVG Icons (no emojis) ─────────────────────────────────────────

/** Crisp geometric checkmark — two straight lines */
function IconCheck({ size = 18, color = '#ffffff' }: { size?: number; color?: string }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points="3,9 7.5,13.5 15,5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Minimal flat truck — cab + trailer rectangles + two circle wheels */
function IconTruck({ size = 18, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trailer body */}
      <rect x="1" y="5" width="10" height="7" rx="1" stroke={color} strokeWidth="1.5" />
      {/* Cab */}
      <path d="M11 8.5h4l1 2.5v1H11V8.5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Wheels */}
      <circle cx="4"  cy="13" r="1.5" stroke={color} strokeWidth="1.3" />
      <circle cx="13" cy="13" r="1.5" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

/** Person silhouette — head circle + body arc */
function IconPerson({ size = 20, color = '#16a34a' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="7" r="3.2" stroke={color} strokeWidth="1.7" />
      <path d="M3.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Briefcase — flat geometric */
function IconBriefcase({ size = 20, color = '#3b82f6' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="16" height="11" rx="1.5" stroke={color} strokeWidth="1.7" />
      <path d="M7 7V5.5C7 4.7 7.7 4 8.5 4h3c.8 0 1.5.7 1.5 1.5V7" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="2" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

/** Truck outline — for transporter card */
function IconTruckOutline({ size = 20, color = '#f59e0b' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trailer */}
      <rect x="1" y="5.5" width="11" height="7.5" rx="1" stroke={color} strokeWidth="1.7" />
      {/* Cab */}
      <path d="M12 9h4.5l1.5 2.5V14H12V9z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      {/* Wheels */}
      <circle cx="5"  cy="14.5" r="1.8" stroke={color} strokeWidth="1.5" />
      <circle cx="14.5" cy="14.5" r="1.8" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/** Chain-link icon — two interlocking rectangles outline */
function IconChain({ size = 14, color = '#15803d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="5" width="5" height="4" rx="2" stroke={color} strokeWidth="1.4" />
      <rect x="8"  y="5" width="5" height="4" rx="2" stroke={color} strokeWidth="1.4" />
      <line x1="6" y1="7" x2="8" y2="7" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

// ─── Participant Card ─────────────────────────────────────────────────────────

function ParticipantCard({
  role, label, name, wallet, accentColor, iconBg,
  icon, assigned,
}: {
  role:         string;
  label:        string;
  name:         string;
  wallet?:      string;
  accentColor:  string;
  iconBg:       string;
  icon:         React.ReactNode;
  assigned?:    string;
}) {
  function shortWallet(addr?: string) {
    if (!addr) return '0x????...????';
    return `${addr.slice(0, 10)}...`;
  }

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.75)',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        padding: '20px 24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 4, background: accentColor, borderRadius: '4px 0 0 4px',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Avatar circle */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: iconBg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '0.10em',
            marginBottom: 4,
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: font, fontSize: 16, fontWeight: 700,
            color: '#111827', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {name}
          </div>
          {assigned ? (
            <div style={{ fontSize: 12, color: '#16a34a', marginTop: 3, fontWeight: 500 }}>
              {assigned}
            </div>
          ) : (
            <div style={{
              fontFamily: 'monospace', fontSize: 11, color: '#9ca3af', marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {shortWallet(wallet)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Node ────────────────────────────────────────────────────────────

function TimelineNode({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#15803d', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, position: 'relative',
      }}>
        <IconCheck size={18} color="#ffffff" />
      </div>
    );
  }
  if (current) {
    return (
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0px rgba(245,158,11,0.25)',
            '0 0 0 8px rgba(245,158,11,0.00)',
          ],
        }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#f59e0b',
          border: '3px solid #fde68a',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2, position: 'relative',
        }}
      >
        <IconTruck size={16} color="#ffffff" />
      </motion.div>
    );
  }
  // Pending
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: '#f3f4f6', border: '2px solid #e5e7eb',
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2, position: 'relative',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} />
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  tradeId:  string;
  language: 'en' | 'hi';
  onBack:   () => void;
}

// ─── Bundle Suggestion ───────────────────────────────────────────────────────

interface BundleSuggestion {
  similarTradeId: string;
  savings:        number; // ₹
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgroChainTradeDetail({ tradeId, language, onBack }: Props) {
  const [trade,            setTrade]            = useState<Trade | null>(null);
  const [loading,          setLoading]          = useState(true);
  const [apiLive,          setApiLive]          = useState(false);
  const [explorerHovered,  setExplorerHovered]  = useState(false);
  const [bundleSuggestion, setBundleSuggestion] = useState<BundleSuggestion | null>(null);
  const [bundleDismissed,  setBundleDismissed]  = useState(false);
  const [bundlePending,    setBundlePending]    = useState(false);
  const [bundled,          setBundled]          = useState(false);

  const fetchTrade = useCallback(async () => {
    const token = localStorage.getItem('agrochain_token');
    try {
      const res = await fetch(`http://localhost:5000/api/trade/${tradeId}`, {
        headers: { Authorization: `Bearer ${token ?? ''}` },
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTrade(data);
      setApiLive(true);
    } catch {
      setTrade(DUMMY_TRADE);
      setApiLive(false);
    } finally {
      setLoading(false);
    }
  }, [tradeId]);

  useEffect(() => { fetchTrade(); }, [fetchTrade]);

  // ── Bundle check — triggers when status is AGREED ──────────────────────────
  useEffect(() => {
    if (!trade || trade.state !== 'AGREED' || bundleDismissed) return;
    const token = localStorage.getItem('agrochain_token');
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bundle/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token ?? ''}`,
          },
          body: JSON.stringify({ tradeId: trade.tradeId }),
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) throw new Error('no suggestion');
        const data = await res.json();
        if (data?.similarTradeId) {
          setBundleSuggestion({ similarTradeId: data.similarTradeId, savings: data.savings ?? 850 });
        }
      } catch {
        // Demo: show a mock bundle suggestion for AGREED trades
        setBundleSuggestion({ similarTradeId: '1039', savings: 850 });
      }
    })();
  }, [trade?.state, bundleDismissed]);

  async function handleBundle() {
    setBundlePending(true);
    const token = localStorage.getItem('agrochain_token');
    try {
      await fetch('http://localhost:5000/api/bundle/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ tradeId: trade?.tradeId, bundleWithTradeId: bundleSuggestion?.similarTradeId }),
        signal: AbortSignal.timeout(3000),
      });
    } catch { /* ignore in demo */ }
    setBundlePending(false);
    setBundled(true);
  }

  if (loading || !trade) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: font,
      }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          style={{
            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '40px 60px', textAlign: 'center',
            border: '1.5px solid rgba(255,255,255,0.55)',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid #15803d', borderTopColor: 'transparent',
            margin: '0 auto 16px',
            animation: 'spin 0.9s linear infinite',
          }} />
          <p style={{ color: '#374151', fontWeight: 600, fontSize: 14, margin: 0 }}>
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading trade details...'}
          </p>
          <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
        </motion.div>
      </div>
    );
  }

  const tradeUrl  = \`https://agrochain.app/trade/\${trade.tradeId}\`;
  const curIdx    = stateIndex(trade.state);
  const totalVal  = (trade.quantity * trade.price).toLocaleString('en-IN');
  const statusCfg = STATUS_CFG[trade.state] ?? STATUS_CFG.CREATED;

  return (
    <div style={{ minHeight: '100vh', fontFamily: font, paddingTop: 64 }}>

      <style>{\`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .td-two-col { grid-template-columns: 1fr !important; }
          .td-three-col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .td-three-col { grid-template-columns: 1fr !important; }
          .td-summary-row { flex-direction: column !important; gap: 12px !important; }
        }
      \`}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* ── Back + refresh bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20,
              padding: '7px 16px', fontSize: 13, fontWeight: 500,
              color: '#374151', cursor: 'pointer', fontFamily: font,
            }}
          >
            ← {language === 'hi' ? 'वापस जाएं' : 'Back'}
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!apiLive && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: '#92400e',
                background: 'rgba(254,243,199,0.90)', border: '1px solid #fcd34d',
                borderRadius: 20, padding: '4px 12px',
              }}>
                Demo Data
              </span>
            )}
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              onClick={fetchTrade}
              title="Refresh"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.10)',
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#374151',
              }}
            >
              <RefreshCw size={14} />
            </motion.button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TOP SUMMARY CARD
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(255,255,255,0.60)',
            borderRadius: 20,
            padding: '28px 36px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            marginBottom: 16,
          }}
        >
          {/* Title row */}
          <div
            className="td-summary-row"
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}
          >
            {/* Left */}
            <div>
              {/* Row 1: Trade # + status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: serif, fontSize: 28, fontWeight: 700,
                  color: '#111827', margin: 0, lineHeight: 1.2,
                }}>
                  Trade #{trade.tradeId}
                </h1>

                {/* Status badge — filled dot instead of emoji */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  border: \`1.5px solid \${statusCfg.border}\`,
                  borderRadius: 20,
                  padding: '6px 16px',
                  fontSize: 13, fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {/* Filled dot — no emoji */}
                  <span style={{
                    display: 'inline-block',
                    width: 8, height: 8, borderRadius: '50%',
                    background: statusCfg.color,
                    flexShrink: 0,
                  }} />
                  {statusCfg.label}
                </span>
              </div>

              {/* Row 2 */}
              <div style={{ fontSize: 15, color: '#6b7280', marginTop: 8 }}>
                {trade.cropName} · {trade.quantity} kg · ₹{trade.price.toLocaleString('en-IN')}/kg
              </div>
            </div>

            {/* Right — total value */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: font, fontSize: 38, fontWeight: 700,
                color: '#15803d', lineHeight: 1,
              }}>
                ₹{totalVal}
              </div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
                {language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            THREE PARTICIPANT CARDS
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07 }}
          className="td-three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <ParticipantCard
            role="farmer"
            label={language === 'hi' ? 'किसान' : 'Farmer'}
            name={trade.farmer.name}
            wallet={trade.farmer.walletAddress}
            accentColor="#16a34a"
            iconBg="#dcfce7"
            icon={<IconPerson size={20} color="#16a34a" />}
          />
          <ParticipantCard
            role="trader"
            label={language === 'hi' ? 'व्यापारी' : 'Trader'}
            name={trade.trader.name}
            wallet={trade.trader.walletAddress}
            accentColor="#3b82f6"
            iconBg="#dbeafe"
            icon={<IconBriefcase size={20} color="#3b82f6" />}
          />
          <ParticipantCard
            role="transporter"
            label={language === 'hi' ? 'ट्रांसपोर्टर' : 'Transporter'}
            name={trade.transporter?.name ?? 'Not Assigned'}
            accentColor="#f59e0b"
            iconBg="#fef3c7"
            icon={<IconTruckOutline size={20} color="#f59e0b" />}
            assigned={trade.transporter ? (language === 'hi' ? 'नियुक्त' : 'Assigned') : undefined}
          />
        </motion.div>

        {/* ══════════════════════════════════════════
            TWO-COLUMN SECTION
        ══════════════════════════════════════════ */}
        <div
          className="td-two-col"
          style={{ display: 'grid', gridTemplateColumns: '58fr 38fr', gap: 16 }}
        >

          {/* ── LEFT: Trade Timeline ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 20,
              border: '1px solid rgba(0,0,0,0.07)',
              padding: '28px 32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h2 style={{
              fontFamily: font, fontSize: 18, fontWeight: 700,
              color: '#111827', margin: '0 0 28px',
            }}>
              {language === 'hi' ? 'व्यापार की यात्रा' : 'Trade Timeline'}
            </h2>

            <div style={{ position: 'relative' }}>
              {TIMELINE_STEPS.map((step, i) => {
                const done    = curIdx > i;
                const current = curIdx === i;
                const isLast  = i === TIMELINE_STEPS.length - 1;

                return (
                  <div key={step.key} style={{ display: 'flex', gap: 16 }}>
                    {/* Node + connector column */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TimelineNode done={done} current={current} />

                      {/* Connector line (not shown after last) */}
                      {!isLast && (
                        <div style={{
                          width: 2,
                          flex: 1,
                          minHeight: 32,
                          background: done
                            ? '#15803d'
                            : current
                            ? 'linear-gradient(to bottom, #f59e0b 0%, #e5e7eb 100%)'
                            : '#e5e7eb',
                          borderStyle: done ? 'solid' : current ? 'solid' : 'dashed',
                          // Use border trick for dashed
                          backgroundImage: (!done && !current)
                            ? 'repeating-linear-gradient(to bottom, #e5e7eb 0px, #e5e7eb 5px, transparent 5px, transparent 10px)'
                            : undefined,
                          margin: '4px 0',
                        }} />
                      )}
                    </div>

                    {/* Step content */}
                    <div style={{ paddingTop: 6, paddingBottom: isLast ? 0 : 28, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 15,
                          fontWeight: current ? 700 : 600,
                          color: done ? '#111827' : current ? '#b45309' : '#9ca3af',
                        }}>
                          {step.label}
                        </span>
                        {current && (
                          <span style={{
                            background: '#fef3c7',
                            color: '#b45309',
                            borderRadius: 20,
                            padding: '3px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                          }}>
                            {language === 'hi' ? 'वर्तमान' : 'Current'}
                          </span>
                        )}
                      </div>
                      {step.date && (done || current) && (
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
                          {step.date}
                        </div>
                      )}
                      {!step.date && !done && !current && (
                        <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 3 }}>
                          {language === 'hi' ? 'लंबित' : 'Pending'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── RIGHT: QR + Blockchain ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Card 1 — Verify on Blockchain */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.07)',
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <div style={{ width: '100%' }}>
                <h2 style={{
                  fontFamily: font, fontSize: 16, fontWeight: 700,
                  color: '#111827', margin: 0,
                }}>
                  {language === 'hi' ? 'ब्लॉकचेन पर सत्यापित करें' : 'Verify on Blockchain'}
                </h2>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 20px' }}>
                  {language === 'hi'
                    ? 'इस व्यापार को सत्यापित करने के लिए QR कोड स्कैन करें'
                    : 'Scan to verify this trade on the blockchain'}
                </p>
              </div>

              {/* QR code */}
              <div style={{
                background: '#ffffff',
                padding: 12,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                display: 'inline-block',
              }}>
                <QRCodeSVG
                  value={tradeUrl}
                  size={160}
                  fgColor="#111827"
                  bgColor="#FFFFFF"
                  level="M"
                />
              </div>

              {/* URL */}
              <p style={{
                fontSize: 11, color: '#9ca3af', marginTop: 12,
                fontFamily: 'monospace', textAlign: 'center',
                wordBreak: 'break-all', maxWidth: 220,
              }}>
                {tradeUrl}
              </p>

              {/* Button — View on Shardeum */}
              <a
                href={\`https://explorer-sphinx.shardeum.org/trade/\${trade.tradeId}\`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 7, width: '100%',
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  color: '#15803d',
                  borderRadius: 10,
                  padding: '10px 20px',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: font,
                  textDecoration: 'none',
                  transition: 'background 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#dcfce7')}
                onMouseLeave={e => (e.currentTarget.style.background = '#f0fdf4')}
              >
                <IconChain size={14} color="#15803d" />
                {language === 'hi' ? 'Shardeum पर देखें' : 'View on Shardeum Blockchain'}
              </a>
            </motion.div>

            {/* Card 2 — Blockchain Record */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.07)',
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <h2 style={{
                fontFamily: font, fontSize: 16, fontWeight: 700,
                color: '#111827', margin: 0,
              }}>
                {language === 'hi' ? 'ब्लॉकचेन रिकॉर्ड' : 'Blockchain Record'}
              </h2>

              <div style={{
                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.10em',
                marginTop: 16, marginBottom: 8,
              }}>
                {language === 'hi' ? 'लेनदेन हैश' : 'Transaction Hash'}
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#374151',
                wordBreak: 'break-all',
                lineHeight: 1.6,
              }}>
                {trade.txHash ?? '0xabc123def456789abcdef1234567890abcdef1234567890ab'}
              </div>

              <a
                href={\`https://explorer-sphinx.shardeum.org/tx/\${trade.txHash}\`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setExplorerHovered(true)}
                onMouseLeave={() => setExplorerHovered(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  marginTop: 12,
                  fontSize: 13, fontWeight: 600,
                  color: '#15803d',
                  textDecoration: explorerHovered ? 'underline' : 'none',
                  transition: 'text-decoration 0.15s',
                  fontFamily: font,
                }}
              >
                {language === 'hi' ? 'Shardeum Explorer पर देखें' : 'View on Shardeum Explorer'}
                <ExternalLink size={12} />
              </a>
            </motion.div>

          </div>{/* end RIGHT */}
        </div>{/* end two-col */}

        {/* ══════════════════════════════════════════
            BUNDLE SUGGESTION CARD (shown when AGREED)
        ══════════════════════════════════════════ */}
        <AnimatePresence>
          {trade.status === 'AGREED' && bundleSuggestion && !bundleDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.40, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 16,
                background: bundled
                  ? 'linear-gradient(135deg, rgba(220,252,231,0.95) 0%, rgba(187,247,208,0.90) 100%)'
                  : 'linear-gradient(135deg, rgba(240,253,244,0.96) 0%, rgba(209,250,229,0.92) 100%)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: bundled ? '1.5px solid #4ade80' : '1.5px solid #86efac',
                borderRadius: 20,
                padding: '22px 28px',
                boxShadow: '0 4px 24px rgba(22,163,74,0.14), 0 0 0 3px rgba(22,163,74,0.06)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow orb */}
              <div style={{
                position: 'absolute', top: -30, right: -20,
                width: 120, height: 120, borderRadius: '50%',
                background: '#22c55e', opacity: 0.10, filter: 'blur(30px)',
                pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: bundled ? '#15803d' : '#16a34a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                  }}>
                    <Zap size={20} color="#ffffff" fill="#ffffff" />
                  </div>

                  <div style={{ flex: 1 }}>
                    {bundled ? (
                      <>
                        <div style={{
                          fontFamily: font, fontSize: 16, fontWeight: 700,
                          color: '#15803d', marginBottom: 4,
                        }}>
                          {language === 'hi' ? 'बंडलिंग की गई!' : 'Bundled Successfully!'}
                        </div>
                        <div style={{ fontSize: 13, color: '#166534', fontFamily: font, lineHeight: 1.5 }}>
                          {language === 'hi'
                            ? \`Trade #\${bundleSuggestion.similarTradeId} के साथ बंडल किया गया। आप ₹\${bundleSuggestion.savings.toLocaleString('en-IN')} बचाएंगे।\`
                            : \`Bundled with Trade #\${bundleSuggestion.similarTradeId}. You'll save ₹\${bundleSuggestion.savings.toLocaleString('en-IN')} on delivery.\`
                          }
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontFamily: font, fontSize: 14, fontWeight: 700,
                          color: '#15803d', marginBottom: 5,
                          display: 'flex', alignItems: 'center', gap: 7,
                        }}>
                          <span style={{
                            background: '#dcfce7', border: '1px solid #86efac',
                            borderRadius: 99, padding: '2px 9px',
                            fontSize: 10, fontWeight: 800, color: '#14532d',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>
                            {language === 'hi' ? 'स्मार्ट सुझाव' : 'Smart Suggestion'}
                          </span>
                        </div>
                        <div style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: '#14532d', marginBottom: 6, lineHeight: 1.4 }}>
                          {language === 'hi'
                            ? \`हमने एक मिलती-जुलती डिलीवरी पाई! Trade #\${bundleSuggestion.similarTradeId} के साथ बंडल करके ₹\${bundleSuggestion.savings.toLocaleString('en-IN')} बचाएं।\`
                            : \`We found a similar delivery! Save ₹\${bundleSuggestion.savings.toLocaleString('en-IN')} by bundling with Trade #\${bundleSuggestion.similarTradeId}.\`
                          }
                        </div>
                        <div style={{ fontSize: 12, color: '#166534', fontFamily: font }}>
                          {language === 'hi'
                            ? 'एक ही ट्रांसपोर्टर दोनों डिलीवरी करेगा — लागत साझा होगी।'
                            : 'One transporter handles both — shared logistics cost.'
                          }
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                          <motion.button
                            whileHover={{ background: '#14532d', boxShadow: '0 6px 20px rgba(20,83,45,0.38)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleBundle}
                            disabled={bundlePending}
                            style={{
                              background: '#15803d', color: '#ffffff',
                              border: 'none', borderRadius: 11, padding: '9px 20px',
                              fontSize: 13, fontWeight: 700, cursor: bundlePending ? 'not-allowed' : 'pointer',
                              fontFamily: font,
                              display: 'flex', alignItems: 'center', gap: 7,
                              boxShadow: '0 3px 12px rgba(21,128,61,0.30)',
                              opacity: bundlePending ? 0.75 : 1,
                              transition: 'background 0.20s',
                            }}
                          >
                            {bundlePending ? (
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                style={{
                                  display: 'inline-block', width: 13, height: 13,
                                  border: '2px solid rgba(255,255,255,0.30)',
                                  borderTop: '2px solid #ffffff', borderRadius: '50%',
                                }}
                              />
                            ) : (
                              <Zap size={13} fill="#ffffff" />
                            )}
                            {bundlePending
                              ? (language === 'hi' ? 'हो रहा है...' : 'Bundling...')
                              : (language === 'hi' ? 'बंडल करें' : 'Bundle it')
                            }
                          </motion.button>
                          <motion.button
                            whileHover={{ background: '#f0fdf4' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setBundleDismissed(true)}
                            style={{
                              background: 'rgba(255,255,255,0.60)',
                              border: '1.5px solid rgba(22,163,74,0.30)',
                              borderRadius: 11, padding: '9px 18px',
                              fontSize: 13, fontWeight: 600, color: '#374151',
                              cursor: 'pointer', fontFamily: font,
                              transition: 'background 0.18s',
                            }}
                          >
                            {language === 'hi' ? 'नहीं, अलग डिलीवरी' : 'No, deliver separately'}
                          </motion.button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Dismiss X */}
                {!bundled && (
                  <button
                    onClick={() => setBundleDismissed(true)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#6b7280', padding: 4, flexShrink: 0,
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>{/* end max-width wrapper */}

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
