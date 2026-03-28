'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TradeUser {
  name: string;
  phone: string;
  walletAddress?: string;
}

interface Trade {
  tradeId: string;
  cropName: string;
  quantity: number;
  price: number;
  status: 'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';
  farmer: TradeUser;
  trader: TradeUser;
  transporter?: TradeUser;
  createdAt?: string;
}

interface CurrentUser {
  name: string;
  phone: string;
  role: string;
  walletAddress?: string;
}

// ─── Dummy fallback ───────────────────────────────────────────────────────────

const DUMMY_TRADES: Trade[] = [
  {
    tradeId: '1042', cropName: 'Wheat', quantity: 50, price: 2000,
    status: 'CREATED',
    farmer: { name: 'Ramesh Kumar', phone: '9876543210' },
    trader: { name: 'Raj Traders',  phone: '9123456780' },
    createdAt: '2024-04-22T09:00:00Z',
  },
  {
    tradeId: '1041', cropName: 'Tomato', quantity: 200, price: 4800,
    status: 'AGREED',
    farmer: { name: 'Suresh Patel', phone: '9876500000' },
    trader: { name: 'Raj Traders',  phone: '9123456780' },
    createdAt: '2024-04-20T11:00:00Z',
  },
  {
    tradeId: '1040', cropName: 'Onion', quantity: 80, price: 1600,
    status: 'IN_DELIVERY',
    farmer: { name: 'Mohan Singh', phone: '9812345678' },
    trader: { name: 'Raj Traders', phone: '9123456780' },
    transporter: { name: 'Suresh Logistics', phone: '9988776655' },
    createdAt: '2024-04-18T08:00:00Z',
  },
  {
    tradeId: '1039', cropName: 'Rice', quantity: 100, price: 5000,
    status: 'COMPLETED',
    farmer: { name: 'Vijay Kumar', phone: '9823456789' },
    trader: { name: 'Raj Traders', phone: '9123456780' },
    createdAt: '2024-04-15T10:00:00Z',
  },
  {
    tradeId: '1038', cropName: 'Potato', quantity: 150, price: 2250,
    status: 'COMPLETED',
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
function getCropEmoji(name: string) {
  return CROP_EMOJI[name.toLowerCase()] ?? '🌱';
}

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function TraderDashboard() {
  const router = useRouter();

  const [user,   setUser]   = useState<CurrentUser | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [agreeLoading,  setAgreeLoading]  = useState<string>('');
  const [agreeSuccess,  setAgreeSuccess]  = useState<string>('');

  // ── Auth + fetch ─────────────────────────────────────────────────────────

  const fetchTrades = useCallback(async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/trade/my/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('API error');
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
    const u: CurrentUser = JSON.parse(userRaw);
    setUser(u);
    fetchTrades(token);
  }, [router, fetchTrades]);

  // ── Agree to trade ───────────────────────────────────────────────────────

  async function handleAgree(tradeId: string) {
    const token = localStorage.getItem('agrochain_token');
    if (!token) { router.push('/login'); return; }

    setAgreeLoading(tradeId);
    setAgreeSuccess('');

    try {
      const res = await fetch(`http://localhost:5000/api/trade/${tradeId}/agree`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to agree.');
      setAgreeSuccess(tradeId);
      await fetchTrades(token); // refresh list
    } catch {
      // silently fail
    } finally {
      setAgreeLoading('');
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────

  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    router.push('/');
  }

  // ── Derived lists ────────────────────────────────────────────────────────

  const waiting   = trades.filter(t => t.status === 'CREATED');
  const active    = trades.filter(t => ['AGREED', 'IN_DELIVERY', 'DELIVERED'].includes(t.status));
  const completed = trades.filter(t => t.status === 'COMPLETED');
  const completedValue = completed.reduce((sum, t) => sum + t.quantity * t.price, 0);

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🤝</div>
          <p className="text-[#2D6A4F] font-semibold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="bg-[#1B4332] px-6 md:px-12 h-16 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white text-lg">🌱</div>
          <span className="text-white font-bold text-lg tracking-tight">AgroChain</span>
        </div>
        <span className="hidden md:block text-white/75 text-sm">
          Welcome, <span className="text-white font-semibold">{user?.name ?? 'Trader'}</span>
        </span>
        <div className="flex items-center gap-3">
          {shortWallet(user?.walletAddress) && (
            <span className="hidden sm:block font-mono text-xs text-white/70 bg-white/10 border border-white/20 rounded-full px-3 py-1">
              {shortWallet(user?.walletAddress)}
            </span>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 rounded-full px-4"
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Trader Dashboard</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Browse crop listings and manage your acquisitions.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard icon="⏳" iconBg="bg-blue-400/10"    value={waiting.length}   label="Waiting for You" />
          <StatCard icon="⚡" iconBg="bg-yellow-400/10"  value={active.length}    label="Active Trades"   />
          <StatCard icon="✅" iconBg="bg-emerald-400/10"   value={completed.length} label="Completed"       />
          <StatCard icon="₹"  iconBg="bg-green-400/10"  value={`₹${(completedValue/100000).toFixed(1)}L`} label="Total Value" isText />
        </div>

        {/* ── Section 1: Waiting ──────────────────────────────────────── */}
        <Section
          title="Trades Waiting for You"
          badge={waiting.length}
          badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
          empty={waiting.length === 0}
          emptyText="No new trade requests right now."
          emptyIcon="⏳"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waiting.map(trade => (
              <TradeCard key={trade.tradeId} trade={trade}>
                <div className="flex items-center gap-2 mt-4">
                  {agreeSuccess === trade.tradeId ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-4 py-2 rounded-xl w-full flex justify-center text-sm font-black">✅ Agreed!</Badge>
                  ) : (
                    <Button
                      onClick={() => handleAgree(trade.tradeId)}
                      disabled={agreeLoading === trade.tradeId}
                      className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold h-11 rounded-xl shadow-lg shadow-green-900/10"
                    >
                      {agreeLoading === trade.tradeId ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        '🤝 Agree to Trade'
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/trade/${trade.tradeId}`)}
                    className="border-green-100 dark:border-zinc-800 text-[#2D6A4F] dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-800 rounded-xl h-11 px-6 font-bold"
                  >
                    View
                  </Button>
                </div>
              </TradeCard>
            ))}
          </div>
        </Section>

        {/* ── Section 2: Active ───────────────────────────────────────── */}
        <Section
          title="My Active Trades"
          badge={active.length}
          badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
          empty={active.length === 0}
          emptyText="No active trades at the moment."
          emptyIcon="⚡"
        >
          <div className="flex flex-col gap-3">
            {active.map(trade => (
              <TradeCard key={trade.tradeId} trade={trade}>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/trade/${trade.tradeId}`)}
                    className="border-green-100 dark:border-zinc-800 text-[#2D6A4F] dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-800 rounded-xl h-11 px-6 font-bold"
                  >
                    View Details →
                  </Button>
                </div>
              </TradeCard>
            ))}
          </div>
        </Section>

        {/* ── Section 3: Completed ────────────────────────────────────── */}
        <Section
          title="Completed Trades"
          badge={completed.length}
          badgeColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          empty={completed.length === 0}
          emptyText="No completed trades yet."
          emptyIcon="✅"
          extra={
            completed.length > 0 ? (
              <span className="text-sm font-black text-[#2D6A4F]">
                Total: ₹{completedValue.toLocaleString('en-IN')}
              </span>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-3">
            {completed.map(trade => (
              <TradeCard key={trade.tradeId} trade={trade} muted>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/trade/${trade.tradeId}`)}
                    className="text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl px-6 font-bold"
                  >
                    View Details →
                  </Button>
                </div>
              </TradeCard>
            ))}
          </div>
        </Section>

      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, iconBg, value, label, isText,
}: {
  icon: string; iconBg: string; value: number | string; label: string; isText?: boolean;
}) {
  return (
    <Card className="bg-white/80 dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[24px] shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 ${iconBg} rounded-[18px] flex items-center justify-center text-xl flex-shrink-0 shadow-inner`}>
          {icon}
        </div>
        <div>
          <div className={`font-black text-zinc-900 dark:text-zinc-50 tracking-tight ${isText ? 'text-lg' : 'text-2xl'}`}>{value}</div>
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 leading-tight">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  title, badge, badgeColor, empty, emptyText, emptyIcon, extra, children,
}: {
  title: string; badge: number; badgeColor: string;
  empty: boolean; emptyText: string; emptyIcon: string;
  extra?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6 px-1">
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{title}</h2>
        <Badge variant="secondary" className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-none ${badgeColor}`}>
          {badge}
        </Badge>
        {extra && <div className="ml-auto">{extra}</div>}
      </div>
      {empty ? (
        <div className="bg-white/50 dark:bg-zinc-900/20 border-2 border-dashed border-green-100 dark:border-zinc-800 rounded-[32px] p-12 text-center">
          <div className="text-4xl mb-3">{emptyIcon}</div>
          <p className="text-zinc-400 font-bold text-sm">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
}

function TradeCard({
  trade, muted, children,
}: {
  trade: Trade; muted?: boolean; children?: React.ReactNode;
}) {
  const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    CREATED:     { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-500', label: 'New Listing' },
    AGREED:      { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Agreed' },
    IN_DELIVERY: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'On Way' },
    DELIVERED:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'Arrived' },
    COMPLETED:   { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Closed' },
  };
  const status = STATUS_STYLE[trade.status] ?? STATUS_STYLE.CREATED;
  const total  = (trade.quantity * trade.price).toLocaleString('en-IN');

  return (
    <div className={`bg-white dark:bg-zinc-900/50 border rounded-[28px] px-6 py-5 shadow-sm transition-all group ${
      muted ? 'border-zinc-100 dark:border-zinc-800 opacity-60' : 'border-green-100 dark:border-zinc-800 hover:shadow-md'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/10 rounded-[18px] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
            {getCropEmoji(trade.cropName)}
          </div>
          <div>
            <div className="font-black text-zinc-900 dark:text-zinc-50 text-base tracking-tight">{trade.cropName}</div>
            <div className="text-[11px] font-bold text-zinc-500 mt-1">
              {trade.quantity} kg · <span className="text-green-600 dark:text-green-400">Total ₹{total}</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              Farmer: <span className="text-zinc-600 dark:text-zinc-300">{trade.farmer.name}</span>
              {trade.transporter && (
                <>
                  <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                   Logistics: <span className="text-zinc-600 dark:text-zinc-300">{trade.transporter.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Trade #{trade.tradeId}</div>
            <div className="text-[10px] font-bold text-zinc-400">{formatDate(trade.createdAt)}</div>
          </div>
          <Badge variant="secondary" className={`${status.bg} ${status.text} text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border-none`}>
            {status.label}
          </Badge>
        </div>
      </div>
      {children}
    </div>
  );
}
