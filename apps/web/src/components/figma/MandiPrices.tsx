'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, ComposedChart,
  PieChart, Pie, Sector
} from 'recharts';
import { Search, Check, ChevronDown, Leaf, MapPin, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

// ─── API base (no key ever in this file) ────────────────────
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '') // strip trailing /api if present — our routes live at /api/mandi-intelligence
  + '/api/mandi-intelligence';

async function mandiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || `Request failed ${res.status}`);
  return json.data as T;
}

// ─── Types ───────────────────────────────────────────────────
interface LiveMonitor {
  available: boolean;
  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;
  priceSpread?: number;
  freshness?: string;
  date?: string;
  market?: string;
  district?: string;
  state?: string;
  reason?: string;
}
interface SellSignalData {
  signal: 'sell_now' | 'hold' | 'watch';
  confidence?: number;
  vs30dAvgPct?: number;
  explanation: string;
}
interface MomentumPoint { date: string; modalPrice: number | null; ma7: number | null; ma30: number | null; }
interface SpreadPoint   { date: string; minPrice: number; modalPrice: number; maxPrice: number; }
interface SeasonMonth   { label: string; avgModal: number | null; count: number; }
interface BarEntry      { market: string; district?: string; state?: string; modalPrice: number; minPrice: number; maxPrice: number; }
interface HeatmapRow    { label: string; values: (number | null)[]; normalized: (number | null)[]; }
interface DashboardData {
  livePriceMonitor: LiveMonitor;
  sellSignal: SellSignalData;
  momentum: { available: boolean; series: MomentumPoint[]; direction: string };
  priceSpreadBand: { available: boolean; series: SpreadPoint[]; avgSpread: number | null };
  seasonality: { available: boolean; months: SeasonMonth[] };
  marketComparisonBars: { bars: BarEntry[]; count: number };
  heatmap: { dates: string[]; matrix: HeatmapRow[]; colorDomain: { min: number; max: number } };
  trendView: { available: boolean; direction: string; pctChange: number | null };
  forecastBand: { available: boolean; confidence?: number; direction?: string };
  meta: { fetchedAt: string; latestRecordDate: string | null; missingDataWarnings: string[] };
}

// ─── CUSTOM SVG ILLUSTRATIONS (preserved exactly) ───────────
const GrowthIllustration = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="20" width="6" height="8" rx="1.5" fill="#86EFAC" />
    <rect x="13" y="14" width="6" height="14" rx="1.5" fill="#4ADE80" />
    <rect x="22" y="6" width="6" height="22" rx="1.5" fill="#22C55E" />
    <path d="M4 16L13 10L22 4" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="4" r="2.5" fill="#166534" />
  </svg>
);

const CoinsIllustration = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="20" r="8" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
    <path d="M10 20h4M12 18v4" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="20" cy="14" r="8" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
    <path d="M17 14h6" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 6L7 9L10 10L7 11L6 14L5 11L2 10L5 9L6 6Z" fill="#F59E0B" />
  </svg>
);

const TargetIllustration = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="8" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="4" fill="#3B82F6" />
    <path d="M26 6L16 16" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 5L27 5L27 10" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SellSignalIllustration = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 32L16 20L24 24L34 8" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 8H34V16" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="34" cy="8" r="4" fill="#059669" />
  </svg>
);

// ─── CUSTOM SEARCHABLE DROPDOWN ──────────────────────────────
const CustomDropdown = ({ options, value, onChange, icon: Icon, label }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );
  const selectedOption = options.find((opt: any) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 backdrop-blur-md bg-white border border-gray-200 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all shadow-sm text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
            <Icon size={18} className="text-emerald-600" />
          </div>
          <span className="font-semibold text-gray-900 truncate">{selectedOption?.label || 'Select...'}</span>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-emerald-500/30 transition-colors"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {filteredOptions.length > 0 ? filteredOptions.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(''); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  value === opt.value ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {opt.label}
                {value === opt.value && <Check size={16} className="text-emerald-500" />}
              </button>
            )) : (
              <div className="p-4 text-center text-sm text-gray-400">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CUSTOM PIE/DONUT SHAPE (preserved exactly) ───────────────
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#111827" className="text-lg font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#059669" className="text-sm font-semibold">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <Sector
        cx={cx} cy={cy} innerRadius={innerRadius - 2} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill}
        style={{ filter: `drop-shadow(0px 4px 10px ${fill}60)`, transition: 'all 300ms ease-in-out' }}
      />
      <Sector
        cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle}
        innerRadius={outerRadius + 12} outerRadius={outerRadius + 15}
        fill={fill} opacity={0.3}
      />
    </g>
  );
};

// ─── TICKER ITEM ─────────────────────────────────────────────
const TickerItem = ({ name, price, change }: { name: string; price: string; change: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full whitespace-nowrap">
    <span className="text-xs font-bold text-white/60">{name}</span>
    <span className="text-sm font-black text-white">{price}</span>
    <span className={`text-[10px] font-bold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
  </div>
);

// ─── LOADING SKELETON ─────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse rounded-2xl ${className}`} />
);

// ─── ERROR BANNER ─────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">
    <AlertCircle size={18} className="shrink-0 text-red-500" />
    <span className="flex-1">{message}</span>
    <button onClick={onRetry} className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors">
      <RefreshCw size={13} /> Retry
    </button>
  </div>
);

// ─── fmt helpers ──────────────────────────────────────────────
const fmt  = (n?: number | null) => n != null ? `₹${n.toLocaleString('en-IN')}` : '—';
const fmtP = (n?: number | null) => n != null ? `${n > 0 ? '+' : ''}${n.toFixed(1)}%` : '—';

// ─── STATIC MANDIS TABLE (preserved from original) ───────────
const MANDIS_STATIC = [
  { name: 'Azadpur Mandi, Delhi',       location: 'Delhi',         arrivals: '1,200 tons', trend: 'up',     volatility: 'Low',    status: 'Active' },
  { name: 'Vashi Mandi, Mumbai',         location: 'Maharashtra',   arrivals: '850 tons',   trend: 'down',   volatility: 'High',   status: 'Active' },
  { name: 'Koyambedu, Chennai',          location: 'Tamil Nadu',    arrivals: '600 tons',   trend: 'stable', volatility: 'Medium', status: 'Closed' },
  { name: 'Lasalgaon Mandi, Nashik',     location: 'Maharashtra',   arrivals: '2,400 tons', trend: 'up',     volatility: 'Medium', status: 'Active' },
];

// ─── DONUT DATA (static — quality grade breakdown is not part of govt API) ───
const DONUT_DATA = [
  { name: 'Premium Grade', value: 45, color: '#34d399' },
  { name: 'Standard Grade', value: 35, color: '#10b981' },
  { name: 'Fair Average',   value: 20, color: '#059669' },
];

// ─── SIGNAL COLOR MAP ─────────────────────────────────────────
const signalMeta = {
  sell_now: { label: 'Sell Now', color: 'emerald' },
  hold:     { label: 'Hold',     color: 'blue'    },
  watch:    { label: 'Watch',    color: 'amber'   },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function MandiPrices() {
  const [searchQuery,        setSearchQuery]        = useState('');
  const [activePieIndex,     setActivePieIndex]     = useState(0);

  // Filter state — seeded with first options; updated once dropdowns load
  const [commodityOptions, setCommodityOptions] = useState([{ value: 'Wheat', label: 'Wheat' }]);
  const [stateOptions,     setStateOptions]     = useState([{ value: 'Punjab', label: 'Punjab' }]);
  const [districtOptions,  setDistrictOptions]  = useState<{ value: string; label: string }[]>([]);
  const [marketOptions,    setMarketOptions]    = useState<{ value: string; label: string }[]>([]);

  const [selectedCommodity, setSelectedCommodity] = useState('Wheat');
  const [selectedState,     setSelectedState]     = useState('Punjab');
  const [selectedDistrict,  setSelectedDistrict]  = useState('');
  const [selectedMarket,    setSelectedMarket]    = useState('');

  // Dashboard data
  const [dashData,  setDashData]  = useState<DashboardData | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const filteredMandis = MANDIS_STATIC.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Load dropdown lists on mount ──
  useEffect(() => {
    mandiGet<string[]>('/commodities')
      .then(cs => cs.length ? setCommodityOptions(cs.map(c => ({ value: c, label: c }))) : null)
      .catch(() => {/* keep defaults */});
    mandiGet<string[]>('/states')
      .then(ss => ss.length ? setStateOptions(ss.map(s => ({ value: s, label: s }))) : null)
      .catch(() => {/* keep defaults */});
  }, []);

  // ── Load districts when state changes ──
  useEffect(() => {
    if (!selectedState) return;
    setSelectedDistrict(''); setSelectedMarket('');
    setDistrictOptions([]);  setMarketOptions([]);
    mandiGet<string[]>(`/districts?state=${encodeURIComponent(selectedState)}`)
      .then(ds => setDistrictOptions(ds.map(d => ({ value: d, label: d }))))
      .catch(() => {});
  }, [selectedState]);

  // ── Load markets when district changes ──
  useEffect(() => {
    if (!selectedDistrict) return;
    setSelectedMarket(''); setMarketOptions([]);
    mandiGet<string[]>(`/markets?district=${encodeURIComponent(selectedDistrict)}&state=${encodeURIComponent(selectedState)}`)
      .then(ms => setMarketOptions(ms.map(m => ({ value: m, label: m }))))
      .catch(() => {});
  }, [selectedDistrict, selectedState]);

  // ── Fetch dashboard ──
  const fetchDashboard = useCallback(() => {
    if (!selectedCommodity) return;
    setLoading(true); setError(null);

    const qs = new URLSearchParams({ commodity: selectedCommodity, range: '30', forecastHorizon: '7' });
    if (selectedState)    qs.set('state',    selectedState);
    if (selectedDistrict) qs.set('district', selectedDistrict);
    if (selectedMarket)   qs.set('market',   selectedMarket);
    qs.set('compareBy', 'market');

    mandiGet<DashboardData>(`/dashboard?${qs.toString()}`)
      .then(d => { setDashData(d); setLoading(false); })
      .catch(e => { setError(e.message || 'Failed to load mandi data.'); setLoading(false); });
  }, [selectedCommodity, selectedState, selectedDistrict, selectedMarket]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // ─── Derived chart data from backend response ─────────────

  // Bar chart: top 8 markets by modal price
  const barChartData = dashData?.marketComparisonBars.bars.slice(0, 8).map(b => ({
    name:  b.market.length > 12 ? b.market.slice(0, 12) + '…' : b.market,
    price: b.modalPrice,
  })) ?? [];

  // Spread band: date-formatted series
  const spreadData = dashData?.priceSpreadBand.series.map(p => ({
    date:  p.date.slice(5), // MM-DD
    min:   p.minPrice,
    max:   p.maxPrice,
    modal: p.modalPrice,
  })) ?? [];

  // Seasonality curve
  const seasonalityData = dashData?.seasonality.available
    ? dashData.seasonality.months
        .filter(m => m.avgModal !== null)
        .map(m => ({ month: m.label, avg: m.avgModal! }))
    : [];

  // Momentum: map to recharts-friendly shape
  const momentumData = dashData?.momentum.series
    .filter(p => p.modalPrice !== null)
    .map(p => ({
      date:    p.date.slice(5),
      current: p.modalPrice,
      ma7:     p.ma7,
      ma30:    p.ma30,
    })) ?? [];

  // Heatmap: derive labels from backend
  const heatmapRows  = dashData?.heatmap.matrix ?? [];
  const heatmapDates = dashData?.heatmap.dates ?? [];
  const minVal       = dashData?.heatmap.colorDomain.min ?? 0;
  const maxVal       = dashData?.heatmap.colorDomain.max ?? 1;

  // Ticker items built from top 6 bar entries
  const tickerItems = dashData?.marketComparisonBars.bars.slice(0, 6).map(b => {
    const tag = `${selectedCommodity.slice(0,4).toUpperCase()}/${b.state?.slice(0,3).toUpperCase() ?? '—'}`;
    return { name: tag, price: fmt(b.modalPrice), change: '+0.0%' }; // pct not available per-bar
  }) ?? [
    { name: 'WHEAT/DEL', price: '₹2,450', change: '+1.2%' },
    { name: 'ONION/MAH', price: '₹1,800', change: '-0.5%' },
    { name: 'TOMATO/KA', price: '₹3,200', change: '+4.8%' },
    { name: 'POTATO/UP', price: '₹1,200', change: '+0.2%' },
    { name: 'RICE/PB',   price: '₹4,500', change: '+0.8%' },
    { name: 'MAIZE/BH',  price: '₹1,950', change: '-1.1%' },
  ];

  // Live price data
  const live = dashData?.livePriceMonitor;
  const sell = dashData?.sellSignal;
  const smeta = signalMeta[sell?.signal ?? 'watch'];

  // Heatmap color helper using normalized value from backend
  const getHeatmapColorFromNorm = (norm: number | null) => {
    if (norm === null) return 'bg-gray-50 text-gray-300 border-gray-100';
    if (norm < 0.33)  return 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200';
    if (norm < 0.66)  return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 hover:border-amber-200';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200';
  };

  // ─── RENDER ──────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-700 bg-slate-50 min-h-screen -m-6 p-8">

      {/* Financial Ticker Bar */}
      <div className="relative -mx-8 -mt-8 overflow-hidden bg-slate-900 py-3 shadow-2xl border-b border-white/5">
        <div className="flex gap-8 animate-marquee">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <TickerItem key={i} name={t.name} price={t.price} change={t.change} />
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Real-time Feed
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Market Intelligence</h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">
            Predictive pricing and logistics momentum for global agri-traders.
            {dashData?.meta.latestRecordDate && (
              <span className="ml-2 text-sm text-emerald-600 font-semibold">
                Latest data: {dashData.meta.latestRecordDate}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search mandi, state or commodity..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-3xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-xl shadow-slate-200/50 font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-4 bg-slate-900 text-white rounded-3xl hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60"
            title="Refresh data"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && <ErrorBanner message={error} onRetry={fetchDashboard} />}

      {/* Warnings from backend meta */}
      {dashData?.meta.missingDataWarnings?.length ? (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{dashData.meta.missingDataWarnings.join(' • ')}</span>
        </div>
      ) : null}

      {/* LIVE PRICE + FILTERS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">

        {/* Filters — now includes state, district, market */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              Market Context
            </h2>
            <div className="space-y-5">
              <CustomDropdown
                label="Commodity"
                icon={Leaf}
                options={commodityOptions}
                value={selectedCommodity}
                onChange={(v: string) => { setSelectedCommodity(v); }}
              />
              <CustomDropdown
                label="State"
                icon={MapPin}
                options={stateOptions}
                value={selectedState}
                onChange={(v: string) => setSelectedState(v)}
              />
              {districtOptions.length > 0 && (
                <CustomDropdown
                  label="District"
                  icon={MapPin}
                  options={[{ value: '', label: 'All Districts' }, ...districtOptions]}
                  value={selectedDistrict}
                  onChange={(v: string) => setSelectedDistrict(v)}
                />
              )}
              {marketOptions.length > 0 && (
                <CustomDropdown
                  label="Target Mandi"
                  icon={MapPin}
                  options={[{ value: '', label: 'All Mandis' }, ...marketOptions]}
                  value={selectedMarket}
                  onChange={(v: string) => setSelectedMarket(v)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Price Cards */}
        <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Min Price */}
          <div className="group relative bg-gradient-to-br from-red-50 to-orange-50/50 rounded-3xl p-6 border border-red-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-white/40" />
            <div className="relative">
              <div className="text-sm font-semibold text-gray-500 mb-4">Min Price Today</div>
              <div>
                {loading ? <Skeleton className="h-10 w-32" /> : (
                  <>
                    <div className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                      {live?.available ? fmt(live.minPrice) : '—'}
                    </div>
                    <div className="text-xs text-gray-500">per quintal</div>
                    {live?.freshness && <div className="text-xs text-gray-400 mt-1">{live.freshness}</div>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Modal Price (Hero) */}
          <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-white/90">Modal Price</div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                  {live?.freshness === 'today' ? (
                    <>
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
                      <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-white/80 tracking-wider">{live?.freshness?.toUpperCase() ?? 'LOADING'}</span>
                  )}
                </div>
              </div>
              <div>
                {loading ? <Skeleton className="h-16 w-40 bg-white/20" /> : (
                  <>
                    <div className="text-6xl font-black text-white mb-1 tracking-tighter drop-shadow-md">
                      {live?.available ? fmt(live.modalPrice) : '—'}
                    </div>
                    <div className="text-sm text-emerald-100 font-semibold">per quintal</div>
                    {live?.market && <div className="text-xs text-emerald-200 mt-1">{live.market}</div>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Max Price */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-3xl p-6 border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-white/40" />
            <div className="relative">
              <div className="text-sm font-semibold text-gray-500 mb-4">Max Price Today</div>
              <div>
                {loading ? <Skeleton className="h-10 w-32" /> : (
                  <>
                    <div className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                      {live?.available ? fmt(live.maxPrice) : '—'}
                    </div>
                    <div className="text-xs text-gray-500">per quintal</div>
                    {live?.priceSpread != null && (
                      <div className="text-xs text-blue-500 mt-1">Spread: {fmt(live.priceSpread)}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SELL SIGNAL + MOMENTUM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Sell Signal */}
        <div className="lg:col-span-5 relative overflow-hidden bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 group hover:border-emerald-300 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/30" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-100/50 rounded-full blur-[80px]" />
          <div className="relative flex flex-col h-full">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 animate-pulse">
                  <SellSignalIllustration />
                </div>
                <div>
                  {loading ? <Skeleton className="h-10 w-36 mb-2" /> : (
                    <>
                      <div className="text-4xl font-extrabold text-emerald-700">{smeta.label}</div>
                      <div className="text-sm font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Market Signal</div>
                    </>
                  )}
                </div>
              </div>
              {loading ? <Skeleton className="h-16 w-full" /> : (
                <p className="text-gray-700 leading-relaxed text-lg border-l-2 border-emerald-400 pl-4 bg-white/40 p-3 rounded-r-xl">
                  {sell?.explanation ?? 'Analysing market conditions…'}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">vs 30-day Avg</div>
                    <div className={`text-2xl font-bold ${(sell?.vs30dAvgPct ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {loading ? '—' : fmtP(sell?.vs30dAvgPct)}
                    </div>
                  </div>
                  <GrowthIllustration />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Spread</div>
                  <div className="text-xl font-bold text-gray-900">
                    {loading ? '—' : (live?.priceSpread != null ? fmt(live.priceSpread) : '—')}
                  </div>
                  <div className="mt-2"><CoinsIllustration /></div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 relative overflow-hidden">
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Confidence</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {loading ? '—' : `${Math.round((sell?.confidence ?? dashData?.forecastBand?.confidence ?? 0) * 100)}%`}
                  </div>
                  {/* SVG Circular Progress Ring */}
                  <svg className="absolute -right-4 -bottom-4 w-24 h-24 -rotate-90 opacity-10" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-blue-200" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * ((sell?.confidence ?? dashData?.forecastBand?.confidence ?? 0)))}
                      className="text-blue-600" strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Momentum Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Price Momentum vs Moving Averages</h2>
          <div className="flex-grow min-h-[300px]">
            {loading ? <Skeleton className="h-full w-full min-h-[280px]" /> : momentumData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={momentumData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="date" stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#111827' }} />
                  <Line type="monotone" dataKey="current" name="Current Price" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
                  <Line type="monotone" dataKey="ma7"     name="7-Day MA"      stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={1500} />
                  <Line type="monotone" dataKey="ma30"    name="30-Day MA"     stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No momentum data available yet for this selection.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADVANCED DATA VISUALIZATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        {/* 1. Market Comparison Bar */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Regional Price Comparison</h2>
          <div className="h-[280px]">
            {loading ? <Skeleton className="h-full w-full" /> : barChartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradLight" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={['dataMin - 100', 'dataMax + 100']} stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} width={90} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="price" fill="url(#barGradLight)" radius={[0, 4, 4, 0]} animationDuration={1200} barSize={24}>
                    {barChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.price === Math.max(...barChartData.map(d => d.price)) ? '#059669' : 'url(#barGradLight)'}
                        style={entry.price === Math.max(...barChartData.map(d => d.price)) ? { filter: 'drop-shadow(0 4px 6px rgba(16,185,129,0.3))' } : {}}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No market comparison data for this selection.
              </div>
            )}
          </div>
        </div>

        {/* 2. Price Spread Band */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Price Spread &amp; Volatility
            {dashData?.priceSpreadBand.avgSpread != null && (
              <span className="ml-3 text-sm font-normal text-gray-400">Avg spread: {fmt(dashData.priceSpreadBand.avgSpread)}</span>
            )}
          </h2>
          <div className="h-[280px]">
            {loading ? <Skeleton className="h-full w-full" /> : spreadData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={spreadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spreadGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="date" stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="max" stroke="none" fill="url(#spreadGradLight)" animationDuration={1500} />
                  <Area type="monotone" dataKey="min" stroke="none" fill="#ffffff" animationDuration={1500} />
                  <Line type="monotone" dataKey="modal" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No spread data available for this selection.
              </div>
            )}
          </div>
        </div>

        {/* 3. Seasonality Curve */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Historical Seasonality Curve</h2>
          <div className="h-[280px]">
            {loading ? <Skeleton className="h-full w-full" /> : seasonalityData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="seasonGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Area type="natural" dataKey="avg" stroke="#10b981" strokeWidth={3} fill="url(#seasonGradLight)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm text-center p-6">
                {dashData?.seasonality.available === false
                  ? 'Not enough historical data for seasonality. This will improve as data accumulates.'
                  : 'Loading seasonality…'}
              </div>
            )}
          </div>
        </div>

        {/* 4. Donut Chart (static — quality grade breakdown) */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Volume by Quality Grade</h2>
          <p className="text-xs text-gray-500 mb-4">Hover segments to expand details.</p>
          <div className="flex-grow min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  // @ts-expect-error - activeIndex is supported by Recharts but types are missing
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  data={DONUT_DATA}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={90}
                  dataKey="value"
                  onMouseEnter={(_: unknown, index: number) => setActivePieIndex(index)}
                  animationDuration={1000}
                  stroke="none"
                >
                  {DONUT_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 outline-none"
                      style={{ opacity: activePieIndex === index ? 1 : 0.6, filter: activePieIndex !== index ? 'blur(1px)' : 'none' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* HEATMAP */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Price Heatmap: Markets × Date</h2>
        {loading ? <Skeleton className="h-64 w-full" /> : heatmapRows.length ? (
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className={`grid gap-2 mb-2`} style={{ gridTemplateColumns: `160px repeat(${Math.min(heatmapDates.length, 8)}, 1fr)` }}>
                <div className="text-xs font-semibold text-gray-400 uppercase">Market</div>
                {heatmapDates.slice(-8).map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500">{d.slice(5)}</div>
                ))}
              </div>
              {/* Grid rows */}
              <div className="space-y-2">
                {heatmapRows.slice(0, 8).map((row) => (
                  <div key={row.label} className={`grid gap-2 items-center group`} style={{ gridTemplateColumns: `160px repeat(${Math.min(heatmapDates.length, 8)}, 1fr)` }}>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors truncate">{row.label}</div>
                    {row.normalized.slice(-8).map((norm, ci) => {
                      const rawVal = row.values[row.values.length - Math.min(heatmapDates.length, 8) + ci];
                      return (
                        <div
                          key={ci}
                          className={`h-12 rounded-xl border ${getHeatmapColorFromNorm(norm)} transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-md cursor-pointer flex items-center justify-center opacity-90 hover:opacity-100`}
                        >
                          <span className="opacity-0 hover:opacity-100 font-bold text-xs transition-opacity delay-100">
                            {rawVal != null ? fmt(rawVal) : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-end gap-4 mt-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-100 border border-red-200" /> Low</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200" /> Average</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-200" /> Premium</div>
                <div className="text-gray-400 ml-2">Range: {fmt(minVal)} – {fmt(maxVal)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            No heatmap data — select a commodity and state to generate a price matrix.
          </div>
        )}
      </div>

      {/* Data source footer */}
      {dashData?.meta && (
        <div className="text-xs text-gray-400 text-center pb-4">
          Source: Government of India — data.gov.in (Agmarknet) · Fetched: {new Date(dashData.meta.fetchedAt).toLocaleTimeString()}
        </div>
      )}

    </div>
  );
}
