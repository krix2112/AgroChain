import { useState, useEffect } from 'react';

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
    status: 'CREATED' | 'AGREED' | 'IN_DELIVERY' | 'DELIVERED' | 'COMPLETED';
    farmer?: { name: string };
    createdAt?: string;
}

const DUMMY_TRADES: Trade[] = [
    { tradeId: '1042', cropName: 'Wheat', quantity: 50, price: 2000, status: 'COMPLETED', farmer: { name: 'Ramesh Kumar' }, createdAt: '2024-04-22' },
    { tradeId: '1041', cropName: 'Tomato', quantity: 200, price: 4800, status: 'IN_DELIVERY', farmer: { name: 'Suresh Patel' }, createdAt: '2024-04-20' },
    { tradeId: '1040', cropName: 'Onion', quantity: 80, price: 1600, status: 'AGREED', farmer: { name: 'Mohan Singh' }, createdAt: '2024-04-18' },
];

const CROP_EMOJI: Record<string, string> = {
    wheat: '🌾', tomato: '🍅', onion: '🧅', rice: '🌾',
    potato: '🥔', corn: '🌽', chilli: '🌶️',
};

function getCropEmoji(name: string) {
    return CROP_EMOJI[name.toLowerCase()] ?? '🌱';
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    CREATED: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Pending' },
    AGREED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Agreed' },
    IN_DELIVERY: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Delivery' },
    DELIVERED: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Delivered' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
};

function shortWallet(addr?: string) {
    if (!addr) return '0x????...????';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Mini sparkline SVG
function Sparkline({ color }: { color: string }) {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" className="opacity-80">
            <polyline
                points="0,28 16,22 32,26 48,14 64,10 80,4"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <circle cx="80" cy="4" r="4" fill={color} />
        </svg>
    );
}

interface Props {
    onNavigateToListings: () => void;
    onNavigateToTradeDetail: (tradeId: string) => void;
    onNavigateToRequests: () => void;
    onNavigateToMyTrades: () => void;
    onNavigateToMyOrders: () => void;
    onLogout: () => void;
}

export function TraderDashboardNew({
    onNavigateToListings,
    onNavigateToTradeDetail,
    onNavigateToRequests,
    onNavigateToMyTrades,
    onNavigateToMyOrders,
    onLogout
}: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [trades, setTrades] = useState<Trade[]>(DUMMY_TRADES);
    const [loading, setLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const fn = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('agrochain_token');
        const userRaw = localStorage.getItem('agrochain_user');
        if (!token || !userRaw) {
            onLogout();
            return;
        }
        setUser(JSON.parse(userRaw));
        setLoading(false);
    }, [onLogout]);

    const total = trades.length;
    const active = trades.filter(t =>
        ['CREATED', 'AGREED', 'IN_DELIVERY', 'DELIVERED'].includes(t.status)
    ).length;
    const completed = trades.filter(t => t.status === 'COMPLETED').length;
    const inDelivery = trades.filter(t => t.status === 'IN_DELIVERY').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0FFF4] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-bounce">🤝</div>
                    <p className="text-[#2D6A4F] font-semibold text-sm">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0FFF4] relative">
            {/* Navbar */}
            <nav className="bg-white px-6 md:px-12 h-16 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#14532d] rounded-lg flex items-center justify-center text-white text-xl">🌱</div>
                    <span className="text-[#14532d] font-bold text-xl tracking-tight">AgroTrade</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[#14532d] text-sm font-medium hover:text-[#166534] transition flex items-center gap-1">
                        🏠 Home
                    </button>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
                        <span className="text-[#14532d] text-sm font-semibold">EN</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400 text-sm">বাং</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0) || 'T'}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{user?.name?.split(' ')[0] || 'Trader'}</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <div className="relative overflow-hidden" style={{ height: '420px' }}>
                {/* Parallax Background */}
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `translateY(${scrollY * 0.4}px)`,
                        height: '130%',
                        top: '-15%',
                        filter: 'brightness(0.40)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#14532d]/80 via-[#14532d]/60 to-[#F0FFF4]" />

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10">
                    {/* Welcome heading */}
                    <div className="mb-6">
                        <p className="text-green-300 text-sm font-medium mb-1">🌿 Trader Dashboard</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                            Welcome to AgroTrade, {user?.name?.split(' ')[0] || 'Trader'}!
                        </h1>
                        <p className="text-white/80 text-sm mt-1">
                            Digitizing agriculture made easy. List your produce, get offers, and track deliveries effortlessly.
                        </p>
                    </div>

                    {/* Feature Cards + Strip */}
                    <div className="flex flex-col gap-3" style={{ height: '260px' }}>
                        {/* Top row: View Offers + My Orders */}
                        <div className="flex gap-3" style={{ height: '140px' }}>
                            {/* View Offers */}
                            <div
                                onClick={onNavigateToListings}
                                className="relative overflow-hidden rounded-2xl cursor-pointer group flex-1"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#78350f]/95 via-[#78350f]/60 to-transparent" />
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-all duration-300" />

                                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/20">
                                        🤝
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-xl">View Offers</div>
                                        <div className="text-white/80 text-sm mt-1">Check offers and negotiate best prices</div>
                                    </div>
                                </div>
                            </div>

                            {/* My Orders */}
                            <div
                                onClick={() => onNavigateToMyOrders()}
                                className="relative overflow-hidden rounded-2xl cursor-pointer group flex-1"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e40af]/95 via-[#1e40af]/60 to-transparent" />
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-all duration-300" />

                                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/20">
                                        📦
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-xl">My Orders</div>
                                        <div className="text-white/80 text-sm mt-1">Track your product from farm to buyer.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom strip */}
                        <div
                            className="flex items-center justify-between px-5 rounded-2xl flex-1"
                            style={{
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(14px)',
                                border: '1.5px solid rgba(255,255,255,0.25)',
                            }}
                        >
                            <div>
                                <div className="text-white font-semibold text-base">List your harvest in minutes</div>
                            </div>
                            <button
                                onClick={() => { }}
                                className="bg-[#14532d] hover:bg-[#166534] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg flex-shrink-0 ml-4 active:scale-95"
                            >
                                <span>🌱</span> Start Listing Harvest
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 -mt-2">
                {/* 3 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    {/* Total Trades - Blue */}
                    <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
                                📈
                            </div>
                            <Sparkline color="#3B82F6" />
                        </div>
                        <div className="text-5xl font-bold text-[#1A1A1A] mb-1">{total}</div>
                        <div className="text-sm text-gray-500 font-medium mb-2">Total Trades</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs text-blue-600 font-semibold">+2 this week</span>
                        </div>
                    </div>

                    {/* Active Trades - Orange */}
                    <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl"
                                style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                                ⚡
                            </div>
                            <Sparkline color="#F59E0B" />
                        </div>
                        <div className="text-5xl font-bold text-[#1A1A1A] mb-1">{active}</div>
                        <div className="text-sm text-gray-500 font-medium mb-2">Active Trades</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-xs text-orange-600 font-semibold">{inDelivery} in delivery</span>
                        </div>
                    </div>

                    {/* Completed Trades - Green */}
                    <div className="bg-white border-2 border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl"
                                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                                🏆
                            </div>
                            <Sparkline color="#10B981" />
                        </div>
                        <div className="text-5xl font-bold text-[#1A1A1A] mb-1">{completed}</div>
                        <div className="text-sm text-gray-500 font-medium mb-2">Completed Trades</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs text-green-600 font-semibold">+1 this week</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions:</p>
                    <div className="flex gap-3">
                        <button
                            onClick={onNavigateToRequests}
                            className="bg-[#14532d] hover:bg-[#166534] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-sm active:scale-95"
                        >
                            🌱 Browse Requests
                        </button>
                        <button
                            onClick={onNavigateToMyTrades}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-sm active:scale-95"
                        >
                            My Trades →
                        </button>
                    </div>
                </div>

                {/* My Trades List */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-[#1A1A1A]">Recent Trades</h2>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                            {total} trades
                        </span>
                    </div>

                    {trades.length === 0 ? (
                        <div className="bg-white border border-dashed border-[#D1FAE5] rounded-2xl p-12 text-center">
                            <div className="text-5xl mb-4">🤝</div>
                            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No trades yet</h3>
                            <p className="text-gray-500 text-sm mb-6">Browse farmer listings and start your first trade.</p>
                            <button
                                onClick={onNavigateToListings}
                                className="bg-[#14532d] hover:bg-[#166534] text-white font-semibold px-6 py-3 rounded-xl text-sm transition"
                            >
                                🤝 Browse Listings
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {trades.map(trade => (
                                <TradeCard
                                    key={trade.tradeId}
                                    trade={trade}
                                    onView={() => onNavigateToTradeDetail(trade.tradeId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Help Button */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition z-50">
                ?
            </button>
        </div>
    );
}

function TradeCard({ trade, onView }: { trade: Trade; onView: () => void }) {
    const status = STATUS_STYLE[trade.status] ?? STATUS_STYLE.CREATED;
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#D1FAE5] transition-all flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-[#F0FFF4] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {getCropEmoji(trade.cropName)}
                </div>
                <div className="min-w-0">
                    <div className="font-bold text-[#1A1A1A] text-base truncate">{trade.cropName}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                        {trade.quantity} kg · ₹{trade.price.toLocaleString('en-IN')}
                    </div>
                </div>
            </div>
            <div className="hidden md:block flex-1">
                <div className="text-xs text-gray-400">Farmer</div>
                <div className="text-sm font-semibold text-[#1A1A1A] mt-0.5">{trade.farmer?.name ?? '—'}</div>
            </div>
            <div className="hidden lg:block flex-1">
                <div className="text-xs text-gray-400">Trade #{trade.tradeId}</div>
                <div className="text-xs text-gray-400 mt-0.5">{formatDate(trade.createdAt)}</div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`${status.bg} ${status.text} text-xs font-semibold rounded-full px-3 py-1.5`}>
                    {status.label}
                </span>
                <button
                    onClick={onView}
                    className="border border-[#D1FAE5] text-[#14532d] hover:bg-[#F0FFF4] rounded-lg px-4 py-2 text-xs font-semibold transition whitespace-nowrap"
                >
                    View Details →
                </button>
            </div>
        </div>
    );
}