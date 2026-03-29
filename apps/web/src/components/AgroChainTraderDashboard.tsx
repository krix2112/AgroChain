import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, RefreshCw } from 'lucide-react';

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
  createdAt?:   string;
}

interface CurrentUser {
  name:           string;
  phone:          string;
  role:           string;
  walletAddress?: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_TRADES: Trade[] = [
  {
    tradeId: '1042', cropName: 'Wheat', quantity: 50, price: 2000,
    state: 'CREATED',
    farmer: { name: 'Ramesh Kumar', phone: '9876543210' },
    trader: { name: 'Raj Traders',  phone: '9123456780' },
    createdAt: '2024-04-22T09:00:00Z',
  },
  {
    tradeId: '1041', cropName: 'Tomato', quantity: 200, price: 4800,
    state: 'AGREED',
    farmer: { name: 'Suresh Patel', phone: '9876500000' },
    trader: { name: 'Raj Traders',  phone: '9123456780' },
    createdAt: '2024-04-20T11:00:00Z',
  },
  {
    tradeId: '1040', cropName: 'Onion', quantity: 80, price: 1600,
    state: 'IN_DELIVERY',
    farmer: { name: 'Mohan Singh', phone: '9812345678' },
    trader: { name: 'Raj Traders', phone: '9123456780' },
    transporter: { name: 'Suresh Logistics', phone: '9988776655' },
    createdAt: '2024-04-18T08:00:00Z',
  },
  {
    tradeId: '1039', cropName: 'Rice', quantity: 100, price: 5000,
    state: 'COMPLETED',
    farmer: { name: 'Vijay Kumar', phone: '9823456789' },
    trader: { name: 'Raj Traders', phone: '9123456780' },
    createdAt: '2024-04-15T10:00:00Z',
  },
  {
    tradeId: '1038', cropName: 'Potato', quantity: 150, price: 2250,
    state: 'COMPLETED',
    farmer: { name: 'Raju Verma', phone: '9834567890' },
    trader: { name: 'Raj Traders', phone: '9123456780' },
    createdAt: '2024-04-10T07:00:00Z',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CROP_EMOJI: Record<string, string> = {
  wheat: '🌾', tomato: '🍅', onion: '🧅', rice: '🌾',
  potato: '🥔', corn: '🌽', chilli: '🌶️',
};
const getCropEmoji = (n: string) => CROP_EMOJI[n.toLowerCase()] ?? '🌱';

function shortWallet(addr?: string) {
  if (!addr) return null;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  CREATED:     { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', label: 'Created'     },
  AGREED:      { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe', label: 'Agreed'      },
  IN_DELIVERY: { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: 'In Delivery' },
  DELIVERED:   { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa', label: 'Delivered'   },
  COMPLETED:   { bg: '#dcfce7', color: '#166534', border: '#86efac', label: 'Completed'   },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  language:            'en' | 'hi';
  onViewTrade:         (tradeId: string) => void;
  onLogout:            () => void;
  onBrowseMarketplace?: () => void;
  onPostRequest?:       () => void;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AgroChainTraderDashboard({ language, onViewTrade, onLogout, onBrowseMarketplace, onPostRequest }: Props) {
  const [user,         setUser]         = useState<CurrentUser | null>(null);
  const [trades,       setTrades]       = useState<Trade[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [apiLive,      setApiLive]      = useState(false);
  const [agreeLoading, setAgreeLoading] = useState('');
  const [agreeSuccess, setAgreeSuccess] = useState('');

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchTrades = useCallback(async () => {
    const token = localStorage.getItem('agrochain_token');
    try {
      const res = await fetch('http://localhost:5000/api/trade/my/all', {
        headers: { Authorization: `Bearer ${token ?? ''}` },
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : data.trades ?? DUMMY_TRADES);
      setApiLive(true);
    } catch {
      setTrades(DUMMY_TRADES);
      setApiLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userRaw = localStorage.getItem('agrochain_user');
    if (userRaw) {
      try { setUser(JSON.parse(userRaw)); } catch { /* ignore */ }
    }
    fetchTrades();
  }, [fetchTrades]);

  // ── Agree ──────────────────────────────────────────────────────────────────

  async function handleAgree(tradeId: string) {
    const token = localStorage.getItem('agrochain_token');
    setAgreeLoading(tradeId);
    setAgreeSuccess('');
    try {
      const res = await fetch(`http://localhost:5000/api/trade/${tradeId}/agree`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token ?? ''}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed.');
      setAgreeSuccess(tradeId);
      await fetchTrades();
    } catch { /* silently fail */ }
    finally { setAgreeLoading(''); }
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const waiting        = trades.filter(t => t.state === 'CREATED');
  const active         = trades.filter(t => ['AGREED', 'IN_DELIVERY', 'DELIVERED'].includes(t.state));
  const completed      = trades.filter(t => t.state === 'COMPLETED');
  const completedValue = completed.reduce((s, t) => s + t.quantity * t.price, 0);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
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
          >🤝</motion.div>
          <p style={{ color: '#2d6a4f', fontWeight: 600, fontSize: 14 }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: font }}>
      <style>{`
        @media (max-width: 640px) {
          .atd-hide-sm { display: none !important; }
          .atd-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 420px) {
          .atd-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        background: '#1b4332', height: 64,
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(0,0,0,0.20)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'rgba(255,255,255,0.12)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
            border: '1px solid rgba(255,255,255,0.20)',
          }}>🌱</div>
          <span style={{
            fontFamily: serif, fontSize: 20, fontWeight: 800,
            color: 'white', letterSpacing: '-0.3px',
          }}>AgroChain</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#34d399',
            background: 'rgba(52,211,153,0.15)',
            borderRadius: 99, padding: '2px 10px', marginLeft: 4,
            border: '1px solid rgba(52,211,153,0.25)',
          }}>
            {language === 'hi' ? 'व्यापारी' : 'Trader'}
          </span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13 }}
          className="atd-hide-sm">
          {language === 'hi' ? 'स्वागत है,' : 'Welcome,'}{' '}
          <span style={{ color: 'white', fontWeight: 700 }}>{user?.name ?? 'Trader'}</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!apiLive && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#fcd34d',
              background: 'rgba(252,211,77,0.12)',
              borderRadius: 99, padding: '3px 10px',
              border: '1px solid rgba(252,211,77,0.25)',
            }}>Demo</span>
          )}
          {shortWallet(user?.walletAddress) && (
            <span style={{
              fontFamily: 'monospace', fontSize: 11,
              color: 'rgba(255,255,255,0.70)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 99, padding: '4px 12px',
            }} className="atd-hide-sm">
              {shortWallet(user?.walletAddress)}
            </span>
          )}
          <motion.button
            whileHover={{ background: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.94 }}
            onClick={onLogout}
            style={{
              color: 'rgba(255,255,255,0.80)',
              border: '1.5px solid rgba(255,255,255,0.28)',
              borderRadius: 99, padding: '6px 18px', fontSize: 13,
              background: 'none', cursor: 'pointer', fontFamily: font,
              fontWeight: 600, transition: 'background 0.18s',
            }}>
            {language === 'hi' ? 'लॉगआउट' : 'Logout'}
          </motion.button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px 100px' }}>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                {language === 'hi' ? 'व्यापारी डैशबोर्ड' : 'Trader Dashboard'}
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
                {language === 'hi'
                  ? 'फसल लिस्टिंग देखें और अपने व्यापार प्रबंधित करें।'
                  : 'Browse crop listings and manage your trades.'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Browse Marketplace button */}
              <motion.button
                whileHover={{ background: '#14532d', boxShadow: '0 6px 18px rgba(20,83,45,0.35)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onBrowseMarketplace?.()}
                style={{
                  background: '#15803d', color: '#ffffff',
                  border: 'none', borderRadius: 12,
                  padding: '9px 16px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: font,
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  boxShadow: '0 3px 12px rgba(21,128,61,0.26)',
                  transition: 'background 0.20s',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5"/>
                  <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5"/>
                  <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5"/>
                  <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5"/>
                </svg>
                {language === 'hi' ? 'मंडी देखें' : 'Browse Marketplace'}
              </motion.button>
              {/* Post a Request button */}
              <motion.button
                whileHover={{ background: '#1e40af', boxShadow: '0 6px 18px rgba(29,78,216,0.35)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onPostRequest?.()}
                style={{
                  background: '#1d4ed8', color: '#ffffff',
                  border: 'none', borderRadius: 12,
                  padding: '9px 16px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: font,
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  boxShadow: '0 3px 12px rgba(29,78,216,0.24)',
                  transition: 'background 0.20s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5"/>
                  <line x1="7" y1="4" x2="7" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="4" y1="7" x2="10" y2="7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {language === 'hi' ? 'अनुरोध पोस्ट करें' : 'Post a Request'}
              </motion.button>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                onClick={fetchTrades}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1.5px solid #d1fae5', background: 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#2d6a4f',
                }}
              >
                <RefreshCw size={15} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.05 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16, marginBottom: 36,
          }}
          className="atd-stats-grid"
        >
          {[
            { icon: '⏳', bg: '#dbeafe', value: waiting.length,   label: language === 'hi' ? 'आपके लिए व्यापार' : 'Waiting for You', isText: false },
            { icon: '⚡', bg: '#fef3c7', value: active.length,    label: language === 'hi' ? 'सक्रिय व्यापार' : 'Active Trades',    isText: false },
            { icon: '✅', bg: '#dcfce7', value: completed.length, label: language === 'hi' ? 'पूर्ण व्यापार' : 'Completed',         isText: false },
            {
              icon: '₹',  bg: '#d1fae5',
              value: `${(completedValue / 100000).toFixed(1)}L`,
              label: language === 'hi' ? 'कुल मूल्य' : 'Total Value',
              isText: true,
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 + i * 0.05 }}
              style={{
                background: 'white', border: '1.5px solid #d1fae5',
                borderRadius: 18, padding: '18px 20px',
                boxShadow: '0 1px 8px rgba(5,46,22,0.06)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: s.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{
                  fontWeight: 800, color: '#1a1a1a',
                  fontSize: s.isText ? 20 : 26, fontFamily: s.isText ? font : serif,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Section 1: Waiting ── */}
        <Section
          title={language === 'hi' ? 'आपके लिए व्यापार' : 'Trades Waiting for You'}
          badge={waiting.length}
          badgeBg="#dbeafe" badgeColor="#1d4ed8"
          empty={waiting.length === 0}
          emptyIcon="⏳"
          emptyText={language === 'hi' ? 'अभी कोई नई ट्रेड रिक्वेस्ट नहीं है।' : 'No new trade requests right now.'}
          delayBase={0.10}
        >
          {waiting.map((trade, i) => (
            <TradeCard key={trade.tradeId} trade={trade} index={i} delayBase={0.12}>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                <AnimatePresence mode="wait">
                  {agreeSuccess === trade.tradeId ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        color: '#166534', fontSize: 13, fontWeight: 700,
                        background: '#dcfce7', borderRadius: 99, padding: '7px 16px',
                        border: '1.5px solid #86efac',
                      }}
                    >
                      ✅ {language === 'hi' ? 'सहमत हो गए!' : 'Agreed!'}
                    </motion.span>
                  ) : (
                    <motion.button
                      key="agree"
                      whileHover={{ background: '#14532d', boxShadow: '0 6px 20px rgba(27,67,50,0.35)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleAgree(trade.tradeId)}
                      disabled={agreeLoading === trade.tradeId}
                      style={{
                        background: '#1b4332', color: 'white', border: 'none',
                        borderRadius: 12, padding: '9px 20px', fontSize: 13,
                        fontWeight: 700, cursor: agreeLoading === trade.tradeId ? 'not-allowed' : 'pointer',
                        fontFamily: font, display: 'flex', alignItems: 'center', gap: 8,
                        opacity: agreeLoading === trade.tradeId ? 0.7 : 1,
                        boxShadow: '0 3px 12px rgba(27,67,50,0.22)',
                        transition: 'background 0.18s',
                      }}
                    >
                      {agreeLoading === trade.tradeId ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            style={{
                              display: 'inline-block', width: 13, height: 13,
                              border: '2px solid rgba(255,255,255,0.3)',
                              borderTop: '2px solid white', borderRadius: '50%',
                            }}
                          />
                          {language === 'hi' ? 'प्रोसेस हो रहा है...' : 'Processing...'}
                        </>
                      ) : (
                        language === 'hi' ? '🤝 सहमत हों' : '🤝 Agree to Trade'
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
                <motion.button
                  whileHover={{ background: '#f0fdf4' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onViewTrade(trade.tradeId)}
                  style={{
                    border: '1.5px solid #d1fae5', color: '#2d6a4f',
                    background: 'none', borderRadius: 12, padding: '9px 18px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                    transition: 'background 0.18s',
                  }}
                >
                  {language === 'hi' ? 'देखें →' : 'View →'}
                </motion.button>
              </div>
            </TradeCard>
          ))}
        </Section>

        {/* ── Section 2: Active ── */}
        <Section
          title={language === 'hi' ? 'मेरे सक्रिय व्यापार' : 'My Active Trades'}
          badge={active.length}
          badgeBg="#fef3c7" badgeColor="#b45309"
          empty={active.length === 0}
          emptyIcon="⚡"
          emptyText={language === 'hi' ? 'अभी कोई सक्रिय व्यापार नहीं है।' : 'No active trades at the moment.'}
          delayBase={0.14}
        >
          {active.map((trade, i) => (
            <TradeCard key={trade.tradeId} trade={trade} index={i} delayBase={0.16}>
              <div style={{ marginTop: 14 }}>
                <motion.button
                  whileHover={{ background: '#f0fdf4' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onViewTrade(trade.tradeId)}
                  style={{
                    border: '1.5px solid #d1fae5', color: '#2d6a4f',
                    background: 'none', borderRadius: 12, padding: '9px 20px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                    transition: 'background 0.18s',
                  }}
                >
                  {language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
                </motion.button>
              </div>
            </TradeCard>
          ))}
        </Section>

        {/* ── Section 3: Completed ── */}
        <Section
          title={language === 'hi' ? 'पूर्ण व्यापार' : 'Completed Trades'}
          badge={completed.length}
          badgeBg="#dcfce7" badgeColor="#166534"
          empty={completed.length === 0}
          emptyIcon="✅"
          emptyText={language === 'hi' ? 'अभी तक कोई पूर्ण व्यापार नहीं।' : 'No completed trades yet.'}
          delayBase={0.18}
          extra={
            completed.length > 0 ? (
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2d6a4f' }}>
                {language === 'hi' ? 'कुल:' : 'Total:'} ₹{completedValue.toLocaleString('en-IN')}
              </span>
            ) : undefined
          }
        >
          {completed.map((trade, i) => (
            <TradeCard key={trade.tradeId} trade={trade} index={i} muted delayBase={0.20}>
              <div style={{ marginTop: 14 }}>
                <motion.button
                  whileHover={{ background: '#f9fafb' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onViewTrade(trade.tradeId)}
                  style={{
                    border: '1.5px solid #e5e7eb', color: '#6b7280',
                    background: 'none', borderRadius: 12, padding: '9px 20px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                    transition: 'background 0.18s',
                  }}
                >
                  {language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
                </motion.button>
              </div>
            </TradeCard>
          ))}
        </Section>
      </main>

      {/* Floating help */}
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
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title, badge, badgeBg, badgeColor,
  empty, emptyIcon, emptyText,
  extra, children, delayBase,
}: {
  title: string;
  badge: number;
  badgeBg: string;
  badgeColor: string;
  empty: boolean;
  emptyIcon: string;
  emptyText: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  delayBase: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: delayBase }}
      style={{ marginBottom: 36 }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap',
      }}>
        <h2 style={{ fontFamily: serif, fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
          {title}
        </h2>
        <span style={{
          fontSize: 11, fontWeight: 700, borderRadius: 99, padding: '4px 12px',
          background: badgeBg, color: badgeColor,
        }}>
          {badge}
        </span>
        {extra && <div style={{ marginLeft: 'auto' }}>{extra}</div>}
      </div>

      {empty ? (
        <div style={{
          background: 'white', border: '2px dashed #d1fae5',
          borderRadius: 20, padding: '48px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>{emptyIcon}</div>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>{emptyText}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      )}
    </motion.div>
  );
}

function TradeCard({
  trade, muted, index, delayBase, children,
}: {
  trade: Trade;
  muted?: boolean;
  index: number;
  delayBase: number;
  children?: React.ReactNode;
}) {
  const s     = STATUS_STYLE[trade.state] ?? STATUS_STYLE.CREATED;
  const total = (trade.quantity * trade.price).toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delayBase + index * 0.04 }}
      whileHover={!muted ? {
        boxShadow: '0 8px 30px rgba(5,46,22,0.10)',
        borderColor: '#d1fae5',
      } : {}}
      style={{
        background: 'white', borderRadius: 18, padding: '18px 22px',
        border: muted ? '1.5px solid #f3f4f6' : '1.5px solid #e5e7eb',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        opacity: muted ? 0.82 : 1,
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46, height: 46, background: '#f0fdf4', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0, border: '1.5px solid #d1fae5',
          }}>
            {getCropEmoji(trade.cropName)}
          </div>
          <div>
            <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>
              {trade.cropName}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
              {trade.quantity} kg · ₹{trade.price.toLocaleString('en-IN')}/kg · <strong style={{ color: '#1a1a1a' }}>₹{total}</strong>
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
              Farmer: <span style={{ fontWeight: 600, color: '#374151' }}>{trade.farmer.name}</span>
              {trade.transporter && (
                <> · Transporter: <span style={{ fontWeight: 600, color: '#374151' }}>{trade.transporter.name}</span></>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, borderRadius: 99,
            padding: '5px 14px', whiteSpace: 'nowrap',
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
          }}>
            {s.label}
          </span>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            #{trade.tradeId} · {formatDate(trade.createdAt)}
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
