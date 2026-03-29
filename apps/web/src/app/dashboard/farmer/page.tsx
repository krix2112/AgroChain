'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  name: string;
  phone: string;
  role: string;
  walletAddress?: string;
}

interface Trade {
  tradeId: string;
  cropName: string;
  quantity: number;
  price: number;
  state: 'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';
  trader?: { name: string };
  createdAt?: string;
}

type ModalType = 'sell' | 'offers' | 'orders' | null;

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_TRADES: Trade[] = [
  { tradeId: '1042', cropName: 'Wheat',  quantity: 50,  price: 2000, state: 'COMPLETED',  trader: { name: 'Raj Traders'   }, createdAt: '2024-04-22' },
  { tradeId: '1041', cropName: 'Tomato', quantity: 200, price: 4800, state: 'IN_DELIVERY', trader: { name: 'Vinay Grains'  }, createdAt: '2024-04-20' },
  { tradeId: '1040', cropName: 'Onion',  quantity: 80,  price: 1600, state: 'AGREED',      trader: { name: 'Patel Agro'   }, createdAt: '2024-04-18' },
  { tradeId: '1039', cropName: 'Rice',   quantity: 100, price: 5000, state: 'CREATED',     trader: { name: 'Sharma Foods' }, createdAt: '2024-04-15' },
  { tradeId: '1038', cropName: 'Potato', quantity: 150, price: 2250, state: 'COMPLETED',   trader: { name: 'Goyal Fresh'  }, createdAt: '2024-04-10' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CROP_EMOJI: Record<string, string> = {
  wheat: '🌾', tomato: '🍅', onion: '🧅', rice: '🌾',
  potato: '🥔', corn: '🌽', chilli: '🌶️',
};
function getCropEmoji(name: string) {
  return CROP_EMOJI[name.toLowerCase()] ?? '🌱';
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  CREATED:     { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-600 dark:text-zinc-400', label: 'Created'     },
  AGREED:      { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Agreed'      },
  IN_DELIVERY: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Delivery' },
  DELIVERED:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'Delivered'   },
  COMPLETED:   { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Completed'   },
};

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

// ─── Modal content config ─────────────────────────────────────────────────────

const MODAL_CONFIG = {
  sell: {
    icon: '🌾',
    title: 'Sell Your Crop',
    subtitle: 'List your harvest and get the best price from verified buyers.',
    color: 'from-[#1B4332] to-[#2D6A4F]',
    steps: [
      { icon: '1️⃣', label: 'Select your crop type' },
      { icon: '2️⃣', label: 'Set quantity and price' },
      { icon: '3️⃣', label: 'Enter trader phone number' },
      { icon: '4️⃣', label: 'Trade goes live instantly' },
    ],
    cta: '+ List New Crop',
    ctaRoute: '/trade/create',
  },
  offers: {
    icon: '🤝',
    title: 'View Buyer Offers',
    subtitle: 'See all offers from traders interested in your produce.',
    color: 'from-[#92400E] to-[#B45309]',
    steps: [
      { icon: '📋', label: 'Browse all incoming offers' },
      { icon: '💬', label: 'Negotiate directly with buyers' },
      { icon: '✅', label: 'Accept the best deal' },
      { icon: '🔒', label: 'Deal recorded on blockchain' },
    ],
    cta: 'View My Trades',
    ctaRoute: '/dashboard/farmer',
  },
  orders: {
    icon: '📦',
    title: 'My Orders',
    subtitle: 'Track every trade from farm gate to final delivery.',
    color: 'from-[#1E3A5F] to-[#2563EB]',
    steps: [
      { icon: '🚛', label: 'Track transporter location' },
      { icon: '📍', label: 'Live delivery status updates' },
      { icon: '💰', label: 'Confirm payment on delivery' },
      { icon: '⭐', label: 'Complete trade on blockchain' },
    ],
    cta: 'View All Orders',
    ctaRoute: '/dashboard/farmer',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FarmerDashboard() {
  const router  = useRouter();

  const [user,    setUser]    = useState<User | null>(null);
  const [trades,  setTrades]  = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<ModalType>(null);

  // Parallax
  const heroRef    = useRef<HTMLDivElement>(null);
  const [scrollY,  setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Auth + fetch ─────────────────────────────────────────────────────────

  const fetchTrades = useCallback(async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/trade/my/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : data.trades ?? DUMMY_TRADES);
    } catch {
      setTrades(DUMMY_TRADES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token   = localStorage.getItem('agrochain_token');
    const userRaw = localStorage.getItem('agrochain_user');
    if (!token || !userRaw) { router.push('/login'); return; }
    setUser(JSON.parse(userRaw));
    fetchTrades(token);
  }, [router, fetchTrades]);

  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    router.push('/');
  }

  // ── Derived stats ────────────────────────────────────────────────────────

  const total     = trades.length;
  const active    = trades.filter(t => ['CREATED','AGREED','IN_DELIVERY','DELIVERED'].includes(t.state)).length;
  const completed = trades.filter(t => t.state === 'COMPLETED').length;

  if (loading) return <LoadingScreen />;

  const activeModal = modal ? MODAL_CONFIG[modal] : null;

  return (
    <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950 relative">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="bg-[#1B4332] px-6 md:px-12 h-16 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-green-800/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white text-lg">🌱</div>
          <span className="text-white font-bold text-lg tracking-tight">AgroChain</span>
        </div>
        <span className="hidden md:block text-white/75 text-sm">
          Welcome, <span className="text-white font-semibold">{user?.name ?? 'Farmer'}</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-mono text-xs text-white/70 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            {shortWallet(user?.walletAddress)}
          </span>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 rounded-full px-4"
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* ── HERO SECTION with Parallax ──────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ height: '520px' }}>

        {/* Parallax background */}
        <div
          className="absolute inset-0 w-full"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.4}px)`,
            height: '130%',
            top: '-15%',
            filter: 'brightness(0.55)',
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/60 via-transparent to-[#F0FFF4] dark:to-zinc-950" />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10">

          {/* Welcome text */}
          <div className="mb-8">
            <Badge variant="secondary" className="bg-green-400/20 text-green-300 border-none mb-1">🌿 Farmer Dashboard</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Farmer'}!
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Digitizing agriculture made easy. List your produce, get offers, track deliveries.
            </p>
          </div>

          {/* ── 3 Feature Cards ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Sell Crop — large */}
            <div
              onClick={() => setModal('sell')}
              className="md:col-span-1 relative overflow-hidden rounded-2xl cursor-pointer group shadow-xl border border-white/10"
              style={{ height: '220px' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/90 via-[#1B4332]/40 to-transparent group-hover:from-[#1B4332]/80 transition-all duration-300" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/20">
                  🌾
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Sell Crop</div>
                  <div className="text-white/75 text-xs mt-0.5">List your harvest, set a price, get offers.</div>
                  <div className="mt-2 text-xs text-green-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to get started →
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — View Offers + My Orders stacked */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">

              {/* View Offers */}
              <div
                onClick={() => setModal('offers')}
                className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg border border-white/10"
                style={{ height: '100px' }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#92400E]/90 via-[#92400E]/50 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center text-base border border-white/20">💬</div>
                  <div>
                    <div className="text-white font-bold text-sm">View Offers</div>
                    <div className="text-white/70 text-xs">Check & negotiate best prices</div>
                  </div>
                </div>
              </div>

              {/* My Orders */}
              <div
                onClick={() => setModal('orders')}
                className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg border border-white/10"
                style={{ height: '100px' }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/90 via-[#1E3A5F]/50 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center text-base border border-white/20">📦</div>
                  <div>
                    <div className="text-white font-bold text-sm">My Orders</div>
                    <div className="text-white/70 text-xs">Track farm to buyer</div>
                  </div>
                </div>
              </div>

              {/* Start Listing strip — full width below the two cards */}
              <div className="col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-white font-semibold text-sm">List your harvest in minutes</div>
                  <div className="text-white/60 text-xs mt-0.5">1. Select Crop · 2. Set Price & Quantity · 3. Go Live!</div>
                </div>
                <Button
                  onClick={() => router.push('/trade/create')}
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <span>🌿</span> Start Listing
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Dashboard Content ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 -mt-2">

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="📊" iconBg="bg-green-400/10" value={total}     label="Total Trades"     />
          <StatCard icon="⚡" iconBg="bg-yellow-400/10" value={active}    label="Active Trades"    />
          <StatCard icon="✅" iconBg="bg-emerald-400/10"  value={completed} label="Completed Trades" />
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push('/trade/create')}
            className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold px-6 py-6 rounded-2xl flex items-center gap-2 transition shadow-lg shadow-green-900/20 active:scale-95"
          >
            <span className="text-lg">🌾</span> + List New Crop
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-full px-4 py-1.5 border border-zinc-200 dark:border-zinc-800">
              {total} trades recorded
            </span>
          </div>
        </div>

        {/* Trades section */}
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 px-1">Recent Activity</h2>

          {trades.length === 0 ? (
            <EmptyState onCTA={() => router.push('/trade/create')} />
          ) : (
            <div className="flex flex-col gap-4">
              {trades.map(trade => (
                <TradeCard
                  key={trade.tradeId}
                  trade={trade}
                  onView={() => router.push(`/trade/${trade.tradeId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Popup Modals ────────────────────────────────────────────────── */}
      {modal && activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModal(null)}
        >
          <div
            className="relative bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className={`bg-gradient-to-br ${activeModal.color} p-8 text-white`}>
              <div className="text-5xl mb-4 drop-shadow-md">{activeModal.icon}</div>
              <h2 className="text-2xl font-black tracking-tight">{activeModal.title}</h2>
              <p className="text-white/80 text-sm mt-1 font-medium">{activeModal.subtitle}</p>
            </div>

            {/* Steps */}
            <div className="p-8">
              <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">How it works</p>
              <div className="space-y-4 mb-8">
                {activeModal.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => { setModal(null); router.push(activeModal.ctaRoute); }}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition shadow-xl shadow-green-600/20"
                >
                  {activeModal.cta}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModal(null)}
                  className="h-12 px-6 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl font-bold transition"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Close X */}
            <button
              onClick={() => setModal(null)}
              className="absolute top-6 right-6 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-white text-xl transition-all"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, iconBg, value, label }: {
  icon: string; iconBg: string; value: number; label: string;
}) {
  return (
    <Card className="bg-white/80 dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-14 h-14 ${iconBg} rounded-[20px] flex items-center justify-center text-2xl flex-shrink-0 shadow-inner`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{value}</div>
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function TradeCard({ trade, onView }: { trade: Trade; onView: () => void }) {
  const statusStyle = STATUS_STYLE[trade.state] ?? STATUS_STYLE.CREATED;
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[28px] px-6 py-5 shadow-sm hover:shadow-xl hover:border-green-200 dark:hover:border-green-500/30 transition-all flex flex-col sm:flex-row sm:items-center gap-6 group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 bg-green-50 dark:bg-green-900/10 rounded-[20px] flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
          {getCropEmoji(trade.cropName)}
        </div>
        <div className="min-w-0">
          <div className="font-black text-zinc-900 dark:text-zinc-50 text-lg truncate tracking-tight">{trade.cropName}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-zinc-500 font-bold text-xs">{trade.quantity} kg</span>
            <span className="w-1 h-1 bg-zinc-300 rounded-full" />
            <span className="text-green-600 dark:text-green-400 font-black text-xs">₹{trade.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block flex-1 border-l border-zinc-100 dark:border-zinc-800 pl-6">
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trader</div>
        <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-1 truncate">{trade.trader?.name ?? '—'}</div>
      </div>
      <div className="hidden lg:block flex-1 border-l border-zinc-100 dark:border-zinc-800 pl-6">
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trade #{trade.tradeId}</div>
        <div className="text-[11px] font-medium text-zinc-500 mt-1">{formatDate(trade.createdAt)}</div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <Badge variant="secondary" className={`${statusStyle.bg} ${statusStyle.text} font-black text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-full border-none`}>
          {statusStyle.label}
        </Badge>
        <Button
          onClick={onView}
          variant="outline"
          className="border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-[18px] h-11 px-5 font-black text-xs transition-all active:scale-95"
        >
          Details →
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onCTA }: { onCTA: () => void }) {
  return (
    <div className="bg-white dark:bg-zinc-900/30 border-2 border-dashed border-green-200 dark:border-zinc-800 rounded-[40px] p-16 text-center shadow-inner">
      <div className="text-6xl mb-6 animate-bounce">🌱</div>
      <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">Your Harvest is Ready</h3>
      <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-8 max-w-xs mx-auto">List your first crop on the blockchain and start getting direct offers from traders.</p>
      <Button
        onClick={onCTA}
        className="bg-green-600 hover:bg-green-500 text-white font-black px-8 py-7 rounded-[20px] text-lg transition-all shadow-2xl shadow-green-600/40 hover:-translate-y-1"
      >
        🌾 List Your First Crop
      </Button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="text-6xl mb-6 animate-bounce">🌱</div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping" />
      </div>
      <p className="text-green-700 dark:text-green-400 font-black text-sm uppercase tracking-widest animate-pulse">Syncing Dashboard...</p>
    </div>
  );
}
