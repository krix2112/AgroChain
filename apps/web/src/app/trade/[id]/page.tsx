'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  farmer:      TradeUser;
  trader:      TradeUser;
  transporter?: TradeUser;
  utrHash?:    string;
  txHash?:     string;
  createdAt?:  string;
  agreedAt?:   string;
  pickedAt?:   string;
  deliveredAt?: string;
  completedAt?: string;
}

interface CurrentUser {
  name: string;
  phone: string;
  role: 'farmer' | 'trader' | 'transporter';
  walletAddress?: string;
}

interface BundleSuggestion {
  tradeIds: string[];
  totalWeight: number;
  cost: {
    soloCostPerTrade: number;
    bundledCostPerTrade: number;
    savingsPercent: number;
  };
}

// ─── Status order (for timeline logic) ───────────────────────────────────────


const STATUS_ORDER = ['CREATED', 'AGREED', 'IN_DELIVERY', 'DELIVERED', 'COMPLETED'];

function statusIndex(s: string) {
  return STATUS_ORDER.indexOf(s);
}

// ─── Dummy fallback data ──────────────────────────────────────────────────────

const DUMMY_TRADE: Trade = {
  tradeId:     '1042',
  cropName:    'Wheat',
  quantity:    50,
  price:       2000,
  state:      'IN_DELIVERY',
  farmer:      { name: 'Ramesh Kumar',  phone: '9876543210', walletAddress: '0x3f4a...8b2c' },
  trader:      { name: 'Raj Traders',   phone: '9123456780', walletAddress: '0xab12...cd34' },
  transporter: { name: 'Suresh Logistics', phone: '9988776655' },
  txHash:      '0xabc123def456789abcdef1234567890abcdef1234567890abcdef1234567890ab',
  createdAt:   '2024-04-22T09:00:00Z',
  agreedAt:    '2024-04-22T14:00:00Z',
  pickedAt:    '2024-04-23T08:00:00Z',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TradeDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [trade,       setTrade]       = useState<Trade | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [actionError,   setActionError]   = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // inputs for sub-actions
  const [transporterPhone, setTransporterPhone] = useState('');
  const [utrNumber,        setUtrNumber]        = useState('');
  const [showTransporterInput, setShowTransporterInput] = useState(false);
  const [showUtrInput,         setShowUtrInput]         = useState(false);
  const [suggestion, setSuggestion] = useState<BundleSuggestion | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);


  // ── Auth + fetch ─────────────────────────────────────────────────────────

  const fetchTrade = useCallback(async () => {
    const token = localStorage.getItem('agrochain_token');
    if (!token) { router.push('/login'); return; }

    try {
      const res = await fetch(`http://localhost:5000/api/trade/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTrade(data);
    } catch {
      setTrade(DUMMY_TRADE); // fallback
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const userRaw = localStorage.getItem('agrochain_user');
    const token   = localStorage.getItem('agrochain_token');
    if (!token || !userRaw) { router.push('/login'); return; }
    setCurrentUser(JSON.parse(userRaw));
    fetchTrade();
  }, [fetchTrade, router]);

  const myRole    = currentUser?.role;
  const curIdx    = trade ? statusIndex(trade.state) : -1;
  const totalVal  = trade ? (trade.quantity * trade.price).toLocaleString('en-IN') : '0';
  const tradeUrl  = trade ? `https://agrochain.app/trade/${trade.tradeId}` : '';

  // ── Fetch bundle suggestion ──────────────────────────────────────────

  useEffect(() => {
    async function checkBundle() {
      if (myRole === 'trader' && trade?.state === 'AGREED' && !trade.transporter) {
        setSuggestionLoading(true);
        try {
          // In a real scenario, the trade object from getTrade should include bundleId
          // If suggestion is only for non-bundled AGREED trades:
          const res = await bundleAPI.checkBundle(id);
          if (res.data?.suggestion) {
            setSuggestion(res.data.suggestion);
          }
        } catch (e) {
          console.error('Bundle suggestion error:', e);
        } finally {
          setSuggestionLoading(false);
        }
      }
    }
    if (trade) checkBundle();
  }, [id, trade, myRole]);

  // ── Generic action caller ─────────────────────────────────────────────────


  async function callAction(endpoint: string, body?: object, actionLabel = '') {
    const token = localStorage.getItem('agrochain_token');
    if (!token) { router.push('/login'); return; }

    setActionLoading(actionLabel);
    setActionError('');
    setActionSuccess('');

    try {
      const res = await fetch(`http://localhost:5000/api/trade/${id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Action failed.');

      const txMsg = data.txHash ? `  TX: ${data.txHash.slice(0, 18)}...` : '';
      setActionSuccess(`✅ Done!${txMsg}`);
      await fetchTrade(); // refresh

    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message.includes('fetch')
          ? 'Cannot connect to server at localhost:5000.'
          : err.message);
      }
    } finally {
      setActionLoading('');
      setShowTransporterInput(false);
      setShowUtrInput(false);
    }
  }

  // ── Bundle handlers ───────────────────────────────────────────────────────

  async function handleConfirmBundle() {
    if (!suggestion) return;
    setActionLoading('bundling');
    try {
      await bundleAPI.confirmBundle({
        tradeIds: suggestion.tradeIds,
        fromCity: 'Source', // Should be dynamic in full implementation
        toCity: 'Destination',
        deliveryDate: new Date().toISOString().split('T')[0]
      });
      setActionSuccess('🎉 Bundle confirmed! Logistics costs reduced.');
      setSuggestion(null);
      await fetchTrade();
    } catch (err: any) {
      setActionError(err.message || 'Failed to confirm bundle');
    } finally {
      setActionLoading('');
    }
  }

  async function handleRejectBundle() {
    setActionLoading('rejecting');
    try {
      await bundleAPI.rejectBundle(id);
      setSuggestion(null);
      setActionSuccess('Proceeding with solo delivery.');
    } catch (err: any) {
      setActionError(err.message || 'Failed to opt out of bundling');
    } finally {
      setActionLoading('');
    }
  }

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading || !trade) {
    return (
      <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-6 animate-bounce">🌱</div>
          <p className="text-green-700 dark:text-green-400 font-black text-sm uppercase tracking-widest animate-pulse">Fetching Transaction Proof...</p>
        </div>
      </div>
    );
  }



  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F0FFF4] dark:bg-zinc-950">
      <Navbar userName={currentUser?.name} wallet={currentUser?.walletAddress} />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2D6A4F] dark:text-green-400 text-sm font-bold hover:bg-green-50 dark:hover:bg-zinc-900 mb-8 rounded-xl px-4"
        >
          ← Back to Dashboard
        </Button>

        {/* ── Header Card ────────────────────────────────────────────────── */}
        <Card className="bg-white dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[32px] p-8 md:p-10 shadow-sm mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/10 rounded-[20px] flex items-center justify-center text-2xl shadow-inner">
                  🌾
                </div>
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Trade #{trade.tradeId}
                    </h1>
                    <div className="mt-1">
                        <StatusBadge state={trade.state} />
                    </div>
                </div>
              </div>
              <p className="text-zinc-500 font-bold text-sm ml-1">
                {trade.cropName} · <span className="text-zinc-700 dark:text-zinc-300">{trade.quantity} kg</span> · <span className="text-green-600 dark:text-green-400">₹{trade.price}/kg</span>
              </p>
            </div>
            <div className="text-left sm:text-right bg-green-50/50 dark:bg-green-900/5 p-4 rounded-2xl border border-green-100 dark:border-green-900/20">
              <div className="text-3xl font-black text-[#2D6A4F] dark:text-green-400 tracking-tight">₹{totalVal}</div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Total On-Chain Value</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-10 border-t border-zinc-100 dark:border-zinc-800/50">
            <PartyCard label="Farmer"      user={trade.farmer}      />
            <PartyCard label="Trader"      user={trade.trader}      />
            <PartyCard label="Transporter" user={trade.transporter} optional />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Timeline */}
            <Card className="bg-white dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-8 tracking-tight px-1">Trade Timeline</h2>
              <div className="relative ml-2">
                {/* Vertical line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-zinc-100 dark:bg-zinc-800" />

                {TIMELINE_STEPS.map((step, i) => {
                  const done    = curIdx > i;
                  const current = curIdx === i;
                  const date    = [
                    trade.createdAt, trade.agreedAt, trade.pickedAt,
                    trade.deliveredAt, trade.completedAt,
                  ][i];

                  return (
                    <div key={step.key} className="relative flex items-start gap-6 mb-8 last:mb-0">
                      {/* Node */}
                      <div className={`relative z-10 w-12 h-12 rounded-[18px] flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                        done    ? 'bg-[#1B4332] text-white shadow-xl shadow-green-900/20' :
                        current ? 'bg-[#2D6A4F] text-white shadow-2xl shadow-green-900/40 ring-4 ring-green-100 dark:ring-green-900/20' :
                                  'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                      }`}>
                        {done ? '✓' : step.icon}
                        {current && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-zinc-950 animate-ping" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="pt-2 flex-1 min-w-0">
                        <div className={`font-black text-sm tracking-tight ${
                          done || current ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'
                        }`}>
                          {step.label}
                          {current && (
                            <Badge className="ml-3 text-[10px] font-black uppercase text-[#2D6A4F] bg-green-100 dark:bg-green-900/30 border-none px-2 py-0.5">
                              Active
                            </Badge>
                          )}
                        </div>
                        {date && (
                          <div className="text-[11px] font-bold text-zinc-400 mt-1">
                            {new Date(date).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Payment Proof */}
            {trade.utrHash && (
              <Card className="bg-white dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight">Payment Verification</h2>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-black text-sm mb-4">
                  <span className="text-lg">✅</span> <span>FUNDS RECEIVED</span>
                </div>
                <div className="bg-green-50/50 dark:bg-green-900/10 rounded-2xl p-5 border border-green-100 dark:border-green-900/20">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">UTR Transaction ID</div>
                  <div className="font-mono text-sm text-zinc-900 dark:text-zinc-50 break-all font-bold">{trade.utrHash}</div>
                </div>
                {trade.txHash && (
                  <Button
                    variant="link"
                    asChild
                    className="mt-4 p-0 h-auto text-[#2D6A4F] dark:text-green-400 font-black text-xs uppercase tracking-widest"
                  >
                    <a href={`https://explorer-sphinx.shardeum.org/tx/${trade.txHash}`} target="_blank">
                      Verify On Explorer →
                    </a>
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* QR Code */}
            <Card className="bg-white dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm flex flex-col items-center">
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-1 self-start tracking-tight">Scan for Proof</h2>
              <p className="text-xs text-zinc-400 font-bold mb-8 self-start uppercase tracking-wider">
                Blockchain authenticity check
              </p>
              <div className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-inner group">
                <QRCodeSVG
                  value={tradeUrl}
                  size={180}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[10px] text-zinc-300 font-mono mt-6 text-center max-w-[200px] break-all opacity-50">
                {tradeUrl}
              </p>
            </Card>

            {/* Action buttons */}
            <Card className="bg-white dark:bg-zinc-900/50 border-green-100 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight">Trade Management</h2>

              {/* Feedback messages */}
              {actionSuccess && (
                <div className="bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-2xl px-5 py-4 text-green-700 dark:text-green-400 text-sm font-bold mb-6 animate-in fade-in slide-in-from-top-2">
                  {actionSuccess}
                </div>
              )}
              {actionError && (
                <div className="bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl px-5 py-4 text-red-600 dark:text-red-400 text-sm font-bold mb-6 animate-in fade-in slide-in-from-top-2">
                  ⚠️ {actionError}
                </div>
              )}

              <div className="flex flex-col gap-4">

                {/* TRADER: CREATED → Agree */}
                {myRole === 'trader' && trade.state === 'CREATED' && (
                  <ActionButton
                    label="🤝 Agree to Trade"
                    loading={actionLoading === 'agree'}
                    onClick={() => callAction('agree', undefined, 'agree')}
                    primary
                  />
                )}

                {/* TRADER: AGREED → Assign Transporter */}
                {myRole === 'trader' && trade.state === 'AGREED' && (
                  <>
                    {!showTransporterInput ? (
                      <ActionButton
                        label="🚛 Assign Transporter"
                        loading={false}
                        onClick={() => setShowTransporterInput(true)}
                      />
                    ) : (
                      <div className="space-y-4 animate-in slide-in-from-top-2">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">+91</span>
                          <input
                            type="tel"
                            value={transporterPhone}
                            onChange={e => setTransporterPhone(e.target.value)}
                            placeholder="Transporter phone number"
                            maxLength={10}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold border-none ring-1 ring-zinc-100 dark:ring-zinc-800 focus:ring-2 focus:ring-[#2D6A4F] transition-all"
                          />
                        </div>
                        <div className="flex gap-3">
                          <ActionButton
                            label="Confirm"
                            loading={actionLoading === 'assign'}
                            onClick={() => callAction('assign-transporter', { transporterPhone }, 'assign')}
                            primary
                            small
                          />
                          <Button
                            variant="outline"
                            onClick={() => setShowTransporterInput(false)}
                            className="flex-1 h-11 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* TRADER: DELIVERED → Payment proof */}
                {myRole === 'trader' && trade.state === 'DELIVERED' && (
                  <>
                    {!showUtrInput ? (
                      <ActionButton
                        label="💳 Mark Payment Done"
                        loading={false}
                        onClick={() => setShowUtrInput(true)}
                        primary
                      />
                    ) : (
                      <div className="space-y-4 animate-in slide-in-from-top-2">
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={e => setUtrNumber(e.target.value)}
                          placeholder="Enter UTR number"
                          className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold border-none ring-1 ring-zinc-100 dark:ring-zinc-800 focus:ring-2 focus:ring-[#2D6A4F] transition-all"
                        />
                        <div className="flex gap-3">
                          <ActionButton
                            label="Submit UTR"
                            loading={actionLoading === 'payment'}
                            onClick={() => callAction('payment-proof', { utrHash: utrNumber }, 'payment')}
                            primary
                            small
                          />
                          <Button
                            variant="outline"
                            onClick={() => setShowUtrInput(false)}
                            className="flex-1 h-11 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* TRANSPORTER: AGREED → Mark Picked Up */}
                {myRole === 'transporter' && trade.state === 'AGREED' && (
                  <ActionButton
                    label="📦 Mark Picked Up"
                    loading={actionLoading === 'pickup'}
                    onClick={() => callAction('pickup', undefined, 'pickup')}
                    primary
                  />
                )}

                {/* TRANSPORTER: IN_DELIVERY → Mark Delivered */}
                {myRole === 'transporter' && trade.state === 'IN_DELIVERY' && (
                  <ActionButton
                    label="🚛 Mark Delivered"
                    loading={actionLoading === 'deliver'}
                    onClick={() => callAction('deliver', undefined, 'deliver')}
                    primary
                  />
                )}

                {/* FARMER: DELIVERED → Confirm Completion */}
                {myRole === 'farmer' && trade.state === 'DELIVERED' && (
                  <ActionButton
                    label="✅ Confirm Completion"
                    loading={actionLoading === 'complete'}
                    onClick={() => callAction('complete', undefined, 'complete')}
                    primary
                  />
                )}

                {/* No action available */}
                {!hasAction(myRole, trade.state) && (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">📍</div>
                    <p className="text-zinc-400 font-bold text-sm">
                      {trade.state === 'COMPLETED'
                        ? 'Trade Successfully Concluded 🎉'
                        : 'Waiting for subsequent action...'}
                    </p>
                  </div>
                )}

              </div>
            </Card>

            {/* Smart Route Bundling Suggestion */}
            {suggestion && myRole === 'trader' && (
              <Card className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] border-none rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">📦</div>
                <div className="relative z-10">
                  <Badge className="mb-4 bg-green-400 text-[#1B4332] font-black text-[10px] uppercase border-none px-3 py-1">
                    Smart Route Suggestion
                  </Badge>
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">Save {suggestion.cost.savingsPercent}% on delivery</h3>
                  <p className="text-green-100/70 text-sm font-bold mb-6">
                    We found {suggestion.tradeIds.length - 1} other trade(s) heading the same way. Bundle them for extra profit!
                  </p>
                  
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/10 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-green-200 uppercase tracking-widest">Solo Cost</span>
                      <span className="text-sm font-bold text-white line-through opacity-50">₹{suggestion.cost.soloCostPerTrade}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-green-200 uppercase tracking-widest">Bundled Price</span>
                      <span className="text-xl font-black text-white">₹{suggestion.cost.bundledCostPerTrade}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleConfirmBundle}
                      disabled={!!actionLoading}
                      className="w-full h-12 bg-white text-[#1B4332] hover:bg-green-50 font-black rounded-xl"
                    >
                      {actionLoading === 'bundling' ? 'Processing...' : 'Accept Bundling'}
                    </Button>
                    <Button 
                      onClick={handleRejectBundle}
                      variant="ghost"
                      className="w-full text-white/70 hover:text-white hover:bg-white/10 font-bold"
                    >
                      No thanks, deliver solo
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasAction(role?: string, state?: string) {
  if (!role || !state) return false;
  const map: Record<string, string[]> = {
    trader:      ['CREATED', 'AGREED', 'DELIVERED'],
    transporter: ['AGREED', 'IN_DELIVERY'],
    farmer:      ['DELIVERED'],
  };
  return map[role]?.includes(state) ?? false;
}

const TIMELINE_STEPS = [
  { key: 'CREATED',     icon: '🌱', label: 'Trade Created'     },
  { key: 'AGREED',      icon: '🤝', label: 'Deal Agreed'      },
  { key: 'IN_DELIVERY', icon: '🚛', label: 'Goods In Transit' },
  { key: 'DELIVERED',   icon: '📦', label: 'Delivered'   },
  { key: 'COMPLETED',   icon: '✅', label: 'Trade Completed'   },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ state }: { state: string }) {
  const map: Record<string, string> = {
    CREATED:     'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    AGREED:      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    IN_DELIVERY: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    DELIVERED:   'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    COMPLETED:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500',
  };
  const label: Record<string, string> = {
    CREATED: 'Created', AGREED: 'Agreed', IN_DELIVERY: 'In Delivery',
    DELIVERED: 'Delivered', COMPLETED: 'Completed',
  };
  return (
    <Badge variant="secondary" className={`${map[state] ?? ''} text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none`}>
      {label[state] ?? state}
    </Badge>
  );
}

function PartyCard({ label, user, optional }: { label: string; user?: TradeUser; optional?: boolean }) {
  if (!user && optional) {
    return (
      <Card className="bg-zinc-50/50 dark:bg-zinc-900/10 border-none rounded-2xl p-5">
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-sm text-zinc-400 font-bold italic">Unassigned</div>
      </Card>
    );
  }
  if (!user) return null;
  return (
    <Card className="bg-green-50/50 dark:bg-green-900/5 border-none rounded-2xl p-5">
      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="font-black text-zinc-900 dark:text-zinc-50 text-sm tracking-tight">{user.name}</div>
      {user.walletAddress && (
        <div className="font-mono text-[10px] text-zinc-400 mt-1 truncate font-bold">
          {user.walletAddress.slice(0, 10)}...
        </div>
      )}
    </Card>
  );
}

function ActionButton({
  label, loading, onClick, primary, small,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
  primary?: boolean;
  small?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={`font-black tracking-tight leading-none rounded-2xl transition shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
        small ? 'h-11 flex-1 text-xs' : 'w-full h-14 text-sm'
      } ${
        primary
          ? 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-green-900/20'
          : 'border-green-100 dark:border-zinc-800 text-[#2D6A4F] dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-900 bg-transparent'
      }`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
          <span>Syncing...</span>
        </>
      ) : (
        label
      )}
    </Button>
  );
}

function Navbar({ userName, wallet }: { userName?: string; wallet?: string }) {
  const router = useRouter();
  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    router.push('/');
  }
  function shortWallet(addr?: string) {
    if (!addr) return null;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
  return (
    <nav className="bg-[#1B4332] px-6 md:px-12 h-16 flex items-center justify-between sticky top-0 z-50 border-b border-green-800/20">
      <button onClick={() => router.push('/dashboard/farmer')} className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">🌱</div>
        <span className="text-white font-bold text-lg tracking-tight">AgroChain</span>
      </button>
      <span className="hidden md:block text-white/75 text-sm font-medium">
        Active Session: <span className="text-white font-black">{userName ?? 'User'}</span>
      </span>
      <div className="flex items-center gap-4">
        {shortWallet(wallet) && (
          <span className="hidden sm:block font-mono text-[10px] font-black text-white/70 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 tracking-wider">
            {shortWallet(wallet)}
          </span>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-white hover:bg-white/10 rounded-full h-9 px-5 text-xs font-black"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
