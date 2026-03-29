'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { bundleAPI } from "@agrochain/api";

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
  state: 'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';
  farmer: TradeUser;
  trader: TradeUser;
  transporter?: TradeUser;
  createdAt?: string;
  pickedAt?: string;
  deliveredAt?: string;
  bundleId?: string;
}

interface Bundle {
  _id: string;
  trades: Trade[];
  fromCity: string;
  toCity: string;
  deliveryDate: string;
  state: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED';
  totalWeight: number;
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
    tradeId: '1044', cropName: 'Wheat', quantity: 50, price: 2000,
    state: 'AGREED',
    farmer: { name: 'Ramesh Kumar', phone: '9876543210' },
    trader: { name: 'Raj Traders',  phone: '9123456780' },
    transporter: { name: 'Suresh Logistics', phone: '9988776655' },
    createdAt: '2024-04-23T09:00:00Z',
  },
  {
    tradeId: '1043', cropName: 'Tomato', quantity: 200, price: 24,
    state: 'IN_DELIVERY',
    farmer: { name: 'Mohan Patel', phone: '9823456789' },
    trader: { name: 'Vinay Grains', phone: '9812345678' },
    transporter: { name: 'Suresh Logistics', phone: '9988776655' },
    createdAt: '2024-04-22T10:00:00Z',
    pickedAt:  '2024-04-22T15:00:00Z',
  },
  {
    tradeId: '1041', cropName: 'Onion', quantity: 80, price: 20,
    state: 'COMPLETED',
    farmer: { name: 'Vijay Singh', phone: '9811234567' },
    trader: { name: 'Patel Agro',  phone: '9800000001' },
    transporter: { name: 'Suresh Logistics', phone: '9988776655' },
    createdAt:   '2024-04-18T08:00:00Z',
    pickedAt:    '2024-04-19T09:00:00Z',
    deliveredAt: '2024-04-20T14:00:00Z',
  },
  {
    tradeId: '1038', cropName: 'Rice', quantity: 100, price: 50,
    state: 'COMPLETED',
    farmer: { name: 'Raju Verma', phone: '9834567890' },
    trader: { name: 'Sharma Foods', phone: '9800000002' },
    transporter: { name: 'Suresh Logistics', phone: '9988776655' },
    createdAt:   '2024-04-10T07:00:00Z',
    pickedAt:    '2024-04-11T08:00:00Z',
    deliveredAt: '2024-04-12T16:00:00Z',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CROP_EMOJI: Record<string, string> = {
  wheat: '🌾', tomato: '🍅', onion: '🧅', rice: '🌾',
  potato: '🥔', corn: '🌽', chilli: '🌶️',
};
function getCropEmoji(n: string) { return CROP_EMOJI[n.toLowerCase()] ?? '🌱'; }

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

export default function TransporterDashboard() {
  const router = useRouter();

  const [user,   setUser]   = useState<CurrentUser | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [actionLoading,  setActionLoading]  = useState<string>('');
  const [actionSuccess,  setActionSuccess]  = useState<string>('');

  // ── Auth + fetch ─────────────────────────────────────────────────────────

  const fetchTrades = useCallback(async (token: string) => {
    try {
      // Fetch trades and bundles in parallel; bundles are optional — failure is non-fatal
      const tRes = await fetch('http://localhost:5000/api/trade/my/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!tRes.ok) throw new Error(`Trades API ${tRes.status}`);
      const tData = await tRes.json();
      setTrades(Array.isArray(tData) ? tData : tData.trades ?? []);

      // Bundles are best-effort
      try {
        const bRes = await bundleAPI.getMyBundles();
        const bData = bRes.data;
        setBundles(Array.isArray(bData) ? bData : bData.bundles ?? []);
      } catch {
        setBundles([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setTrades(DUMMY_TRADES);
      setBundles([]);
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

  // ── Generic action ───────────────────────────────────────────────────────

  async function callAction(tradeId: string, endpoint: string) {
    const token = localStorage.getItem('agrochain_token');
    if (!token) { router.push('/login'); return; }

    setActionLoading(`${tradeId}-${endpoint}`);
    setActionSuccess('');

    try {
      const res = await fetch(`http://localhost:5000/api/trade/${tradeId}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Action failed.');
      setActionSuccess(`${tradeId}-${endpoint}`);
      await fetchTrades(token);
    } catch {
      // silently fail
    } finally {
      setActionLoading('');
    }
  }

  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    router.push('/');
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  const soloTrades = trades.filter(t => !t.bundleId);
  const readyForPickup = soloTrades.filter(t => t.state === 'AGREED');
  const inDelivery     = soloTrades.filter(t => t.state === 'IN_DELIVERY');
  const completed      = soloTrades.filter(t => t.state === 'COMPLETED' || t.state === 'DELIVERED');
  
  const activeBundles = bundles.filter(b => b.state === 'CONFIRMED');
  const totalDeliveries = completed.length + bundles.filter(b => b.trades.every(t => t.state === 'COMPLETED')).length;

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🚛</div>
          <p className="text-[#2D6A4F] font-semibold text-sm">Loading logistics board...</p>
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
          Welcome, <span className="text-white font-semibold">{user?.name ?? 'Transporter'}</span>
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
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Transporter Dashboard</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Manage your pickup and delivery logistics.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon="📦" iconBg="bg-blue-400/10"   value={readyForPickup.length} label="Ready for Pickup" />
          <StatCard icon="🚛" iconBg="bg-yellow-400/10" value={inDelivery.length}     label="In Delivery"      />
          <StatCard icon="✅" iconBg="bg-emerald-400/10"  value={totalDeliveries}       label="Completed"        />
        </div>

        {/* ── Section 1: Ready for Pickup ─────────────────────────────── */}
        <Section
          title="Pickups Assigned"
          badge={readyForPickup.length}
          badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
          empty={readyForPickup.length === 0}
          emptyText="No pickups waiting right now."
          emptyIcon="📦"
        >
          <div className="flex flex-col gap-4">
            {/* Bundles First */}
            {activeBundles.filter(b => b.trades.some(t => t.state === 'AGREED')).map(bundle => (
              <BundleCard 
                key={bundle._id} 
                bundle={bundle} 
                actionLoading={actionLoading}
                onAction={(end) => bundle.trades.forEach(t => callAction(t.tradeId, end))}
              />
            ))}
            
            {/* Then Solo Trades */}
            {readyForPickup.map(trade => (
              <DeliveryCard key={trade.tradeId} trade={trade}>
                <div className="flex items-center gap-3 mt-5">
                  {actionSuccess === `${trade.tradeId}-pickup` ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-6 py-2 rounded-xl flex justify-center text-sm font-black">✅ Marked as Picked Up!</Badge>
                  ) : (
                    <Button
                      onClick={() => callAction(trade.tradeId, 'pickup')}
                      disabled={actionLoading === `${trade.tradeId}-pickup`}
                      className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-black h-12 rounded-2xl shadow-xl shadow-green-900/10 transition-all active:scale-95"
                    >
                      {actionLoading === `${trade.tradeId}-pickup` ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                          Processing...
                        </>
                      ) : (
                        '📦 Mark Picked Up'
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/trade/${trade.tradeId}`)}
                    className="border-green-100 dark:border-zinc-800 text-[#2D6A4F] dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-800 rounded-2xl h-12 px-8 font-black"
                  >
                    View
                  </Button>
                </div>
              </DeliveryCard>
            ))}
          </div>
        </Section>

        {/* ── Section 2: In Delivery ──────────────────────────────────── */}
        <Section
          title="Active Deliveries"
          badge={inDelivery.length}
          badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
          empty={inDelivery.length === 0}
          emptyText="No active deliveries right now."
          emptyIcon="🚛"
        >
          <div className="flex flex-col gap-4">
            {/* Bundles In Transit */}
            {activeBundles.filter(b => b.trades.some(t => t.state === 'IN_DELIVERY')).map(bundle => (
              <BundleCard 
                key={bundle._id} 
                bundle={bundle} 
                actionLoading={actionLoading}
                onAction={(end) => bundle.trades.forEach(t => callAction(t.tradeId, end))}
                highlight
              />
            ))}

            {inDelivery.map(trade => (
              <DeliveryCard key={trade.tradeId} trade={trade} highlight>
                {/* Location info */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="bg-green-50/50 dark:bg-green-900/5 border-none rounded-2xl">
                    <CardContent className="p-4">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Pickup from</div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{trade.farmer.name}</div>
                      <div className="text-xs text-zinc-500 font-medium">{trade.farmer.phone}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50/50 dark:bg-blue-900/5 border-none rounded-2xl">
                    <CardContent className="p-4">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Deliver to</div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{trade.trader.name}</div>
                      <div className="text-xs text-zinc-500 font-medium">{trade.trader.phone}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center gap-3 mt-5">
                  {actionSuccess === `${trade.tradeId}-deliver` ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-6 py-2 rounded-xl flex justify-center text-sm font-black w-full">✅ Marked as Delivered!</Badge>
                  ) : (
                    <Button
                      onClick={() => callAction(trade.tradeId, 'deliver')}
                      disabled={actionLoading === `${trade.tradeId}-deliver`}
                      className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-black h-12 rounded-2xl shadow-xl shadow-green-900/10 transition-all active:scale-95"
                    >
                      {actionLoading === `${trade.tradeId}-deliver` ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                          Processing...
                        </>
                      ) : (
                        '🚛 Mark Delivered'
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/trade/${trade.tradeId}`)}
                    className="border-green-100 dark:border-zinc-800 text-[#2D6A4F] dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-800 rounded-2xl h-12 px-8 font-black"
                  >
                    View
                  </Button>
                </div>
              </DeliveryCard>
            ))}
          </div>
        </Section>

        {/* ── Section 3: Completed ────────────────────────────────────── */}
        <Section
          title="Past Deliveries"
          badge={totalDeliveries}
          badgeColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          empty={completed.length === 0}
          emptyText="No completed deliveries yet."
          emptyIcon="✅"
          extra={
            completed.length > 0 ? (
              <span className="text-sm font-black text-green-600 dark:text-green-400">
                {totalDeliveries} Successful Deliveries 🎉
              </span>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-3">
            {completed.map(trade => (
              <DeliveryCard key={trade.tradeId} trade={trade} muted>
                <div className="flex items-center justify-between mt-5 text-[11px] font-bold text-zinc-400 px-1">
                  <div className="flex gap-4">
                    <span>Picked: {formatDate(trade.pickedAt)}</span>
                    <span className="w-1 h-1 bg-zinc-200 rounded-full my-auto" />
                    <span>Delivered: {formatDate(trade.deliveredAt)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/trade/${trade.tradeId}`)}
                    className="text-zinc-400 hover:text-green-600 h-8 px-4 font-black rounded-lg"
                  >
                    Details →
                  </Button>
                </div>
              </DeliveryCard>
            ))}
          </div>
        </Section>

      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, iconBg, value, label,
}: {
  icon: string; iconBg: string; value: number | string; label: string;
}) {
  return (
    <Card className="bg-white/80 dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[28px] shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-14 h-14 ${iconBg} rounded-[20px] flex items-center justify-center text-2xl flex-shrink-0 shadow-inner`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{value}</div>
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1 leading-tight">{label}</div>
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
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6 px-1">
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{title}</h2>
        <Badge variant="secondary" className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-none ${badgeColor}`}>{badge}</Badge>
        {extra && <div className="ml-auto">{extra}</div>}
      </div>
      {empty ? (
        <div className="bg-white/50 dark:bg-zinc-900/20 border-2 border-dashed border-green-100 dark:border-zinc-800 rounded-[32px] p-16 text-center shadow-inner">
          <div className="text-5xl mb-4">{emptyIcon}</div>
          <p className="text-zinc-400 font-bold text-sm tracking-tight">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
}

function DeliveryCard({
  trade, highlight, muted, children,
}: {
  trade: Trade; highlight?: boolean; muted?: boolean; children?: React.ReactNode;
}) {
  const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    AGREED:      { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Assigned' },
    IN_DELIVERY: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Transit' },
    DELIVERED:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'At Destination' },
    COMPLETED:   { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Done' },
  };
  const statusStyle = STATUS_STYLE[trade.state] ?? { bg: 'bg-zinc-100', text: 'text-zinc-600', label: trade.state };
  const total  = (trade.quantity * trade.price).toLocaleString('en-IN');

  return (
    <div className={`bg-white dark:bg-zinc-900/50 rounded-[32px] px-8 py-6 shadow-sm transition-all group ${
      highlight ? 'border-2 border-yellow-300 dark:border-yellow-500/50 bg-yellow-50/10' :
      muted     ? 'border border-zinc-100 dark:border-zinc-800 opacity-60' :
                  'border border-green-100 dark:border-zinc-800 hover:shadow-xl'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 dark:bg-green-900/10 rounded-[20px] flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
            {getCropEmoji(trade.cropName)}
          </div>
          <div>
            <div className="font-black text-zinc-900 dark:text-zinc-50 text-xl tracking-tight">{trade.cropName}</div>
            <div className="text-[11px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">
              {trade.quantity} kg · ₹{trade.price}/kg · <span className="text-green-600 dark:text-green-400">₹{total}</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-bold mt-2">
              Trade #{trade.tradeId} · {formatDate(trade.createdAt)}
            </div>
          </div>
        </div>
        {/* Right */}
        <Badge variant="secondary" className={`${statusStyle.bg} ${statusStyle.text} text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-none self-start sm:self-center`}>
          {statusStyle.label}
        </Badge>
      </div>
      {children}
    </div>
  );
}

function BundleCard({ 
  bundle, highlight, actionLoading, onAction 
}: { 
  bundle: Bundle; highlight?: boolean; actionLoading: string; onAction: (end: string) => void 
}) {
  const isAgreed = bundle.trades.every(t => t.state === 'AGREED');
  const isInTransit = bundle.trades.some(t => t.state === 'IN_DELIVERY');
  
  return (
    <div className={`bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-[32px] px-8 py-6 shadow-xl relative overflow-hidden group mb-4 ${
      highlight ? 'ring-4 ring-yellow-400/50' : ''
    }`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📦</div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge className="bg-green-400 text-[#1B4332] font-black text-[10px] uppercase border-none px-3 py-1 mb-2">
              Smart Bundle ({bundle.trades.length} Trades)
            </Badge>
            <h3 className="text-xl font-black text-white tracking-tight">
              {bundle.fromCity} → {bundle.toCity}
            </h3>
            <p className="text-green-100/70 text-xs font-bold mt-1">
              Total Weight: {bundle.totalWeight} kg · Deliver by {formatDate(bundle.deliveryDate)}
            </p>
          </div>
          <Badge className="bg-white/20 text-white font-bold text-[10px] uppercase border-none px-3 py-1">
            {isAgreed ? 'Ready for Pickup' : isInTransit ? 'In Transit' : 'Mixed State'}
          </Badge>
        </div>

        <div className="space-y-2 mb-6">
          {bundle.trades.map(t => (
            <div key={t.tradeId} className="flex justify-between text-xs text-white/80 font-medium bg-white/5 px-3 py-2 rounded-lg">
              <span>{t.cropName} ({t.quantity}kg)</span>
              <span>{t.farmer.name} → {t.trader.name}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          {isAgreed && (
             <Button
                onClick={() => onAction('pickup')}
                disabled={!!actionLoading}
                className="flex-1 bg-white text-[#1B4332] hover:bg-green-50 font-black h-11 rounded-xl"
             >
                {actionLoading.includes('pickup') ? 'Syncing...' : '📦 Mark Bundle Picked Up'}
             </Button>
          )}
          {isInTransit && (
             <Button
                onClick={() => onAction('deliver')}
                disabled={!!actionLoading}
                className="flex-1 bg-white text-[#1B4332] hover:bg-green-50 font-black h-11 rounded-xl"
             >
                {actionLoading.includes('deliver') ? 'Syncing...' : '🚛 Mark Bundle Delivered'}
             </Button>
          )}
        </div>
      </div>
    </div>
  );
}
