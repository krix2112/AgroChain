import { useState } from 'react';
import { motion } from 'motion/react';
import { AgroChainLogo } from './AgroChainLogo';

// Lush green rice paddy field at golden sunrise (provided asset)
const bgImage = '/assets/02a2b30228942223a501a2a4cb871849072179dd.png';

interface Order {
  id: string;
  crop: string;
  farmer: string;
  location: string;
  quantity: number;
  pricePerKg: number;
  total: number;
  status: 'Created' | 'Agreed' | 'In Delivery' | 'Delivered' | 'Completed';
  date: string;
}

const ORDERS: Order[] = [
  { id: '#1042', crop: 'Wheat', farmer: 'Ramesh Kumar', location: 'Mathura, UP', quantity: 50, pricePerKg: 2400, total: 120000, status: 'Completed', date: '22 Apr 2024' },
  { id: '#1041', crop: 'Tomato', farmer: 'Suresh Patel', location: 'Nashik, MH', quantity: 200, pricePerKg: 18, total: 3600, status: 'In Delivery', date: '20 Apr 2024' },
  { id: '#1040', crop: 'Onion', farmer: 'Gopal Yadav', location: 'Pune, MH', quantity: 80, pricePerKg: 22, total: 1760, status: 'Agreed', date: '18 Apr 2024' },
  { id: '#1039', crop: 'Rice', farmer: 'Vikram Singh', location: 'Patna, BR', quantity: 100, pricePerKg: 45, total: 4500, status: 'Created', date: '15 Apr 2024' },
  { id: '#1038', crop: 'Potato', farmer: 'Harish Gupta', location: 'Agra, UP', quantity: 150, pricePerKg: 12, total: 1800, status: 'Delivered', date: '10 Apr 2024' },
];

const STATUS_COLORS: Record<string, { accent: string; bg: string; text: string }> = {
  'Completed': { accent: '#16a34a', bg: '#dcfce7', text: '#15803d' },
  'In Delivery': { accent: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
  'Agreed': { accent: '#3b82f6', bg: '#dbeafe', text: '#1d4ed8' },
  'Created': { accent: '#9ca3af', bg: '#f3f4f6', text: '#374151' },
  'Delivered': { accent: '#f97316', bg: '#fed7aa', text: '#c2410c' },
};

const CROP_COLORS: Record<string, string> = {
  'Wheat': '#fef3c7',
  'Tomato': '#fee2e2',
  'Onion': '#fdf4ff',
  'Rice': '#dbeafe',
  'Potato': '#fed7aa',
};

const SPEND_BREAKDOWN = [
  { crop: 'Wheat', amount: 120000, color: '#16a34a' },
  { crop: 'Tomato', amount: 3600, color: '#f59e0b' },
  { crop: 'Onion', amount: 1760, color: '#a855f7' },
  { crop: 'Rice', amount: 4500, color: '#3b82f6' },
  { crop: 'Potato', amount: 1800, color: '#f97316' },
];

const FARMERS = [
  { initials: 'RK', name: 'Ramesh Kumar', location: 'Mathura', trades: 2, color: '#dcfce7' },
  { initials: 'SP', name: 'Suresh Patel', location: 'Nashik', trades: 1, color: '#fee2e2' },
  { initials: 'GY', name: 'Gopal Yadav', location: 'Pune', trades: 1, color: '#fdf4ff' },
  { initials: 'VS', name: 'Vikram Singh', location: 'Patna', trades: 1, color: '#dbeafe' },
];

// Sparkline SVG
function Sparkline({ color }: { color: string }) {
  return (
    <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
      <polyline
        points="0,28 26,20 53,24 80,8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Crop Icon - flat geometric SVG illustration
function CropIcon({ crop }: { crop: string }) {
  const bgColor = CROP_COLORS[crop] || '#f3f4f6';
  
  return (
    <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center" style={{ background: bgColor }}>
      {crop === 'Wheat' && (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="12" y="4" width="4" height="20" rx="1" fill="#ca8a04" />
          <ellipse cx="14" cy="8" rx="6" ry="4" fill="#fbbf24" />
          <ellipse cx="14" cy="14" rx="5" ry="3" fill="#fbbf24" />
          <ellipse cx="14" cy="19" rx="4" ry="2.5" fill="#fbbf24" />
        </svg>
      )}
      {crop === 'Tomato' && (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="15" r="9" fill="#ef4444" />
          <path d="M10 7 L14 7 L18 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="13" r="1.5" fill="#fca5a5" opacity="0.6" />
        </svg>
      )}
      {crop === 'Onion' && (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <ellipse cx="14" cy="16" rx="8" ry="9" fill="#c084fc" />
          <path d="M14 7 Q12 10, 14 13" stroke="#9333ea" strokeWidth="2" fill="none" />
          <ellipse cx="14" cy="16" rx="6" ry="7" fill="#e9d5ff" opacity="0.4" />
        </svg>
      )}
      {crop === 'Rice' && (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="12" y="8" width="4" height="14" rx="2" fill="#eab308" />
          <ellipse cx="14" cy="10" rx="3" ry="2" fill="#fef08a" />
          <ellipse cx="14" cy="14" rx="3" ry="2" fill="#fef08a" />
          <ellipse cx="14" cy="18" rx="3" ry="2" fill="#fef08a" />
        </svg>
      )}
      {crop === 'Potato' && (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <ellipse cx="14" cy="14" rx="9" ry="7" fill="#fb923c" />
          <circle cx="10" cy="12" r="1" fill="#7c2d12" />
          <circle cx="17" cy="13" r="1" fill="#7c2d12" />
          <circle cx="13" cy="17" r="1" fill="#7c2d12" />
        </svg>
      )}
    </div>
  );
}

// Progress Tracker
function ProgressTracker({ status }: { status: string }) {
  const stages = ['Created', 'Agreed', 'In Delivery', 'Completed'];
  const currentIndex = stages.indexOf(status);
  
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        
        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="relative w-[10px] h-[10px] rounded-full"
                style={{
                  background: isCompleted ? '#15803d' : isCurrent ? '#f59e0b' : '#e5e7eb',
                }}
              >
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: '#f59e0b', opacity: 0.4 }}
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              {isCurrent && (
                <div
                  className="text-[11px] font-bold mt-1 whitespace-nowrap"
                  style={{ color: '#f59e0b' }}
                >
                  {stage}
                </div>
              )}
            </div>
            {index < stages.length - 1 && (
              <div
                className="w-6 h-[2px] mx-0.5"
                style={{
                  background: isCompleted ? '#15803d' : '#e5e7eb',
                  borderStyle: isPending ? 'dashed' : 'solid',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  onBack: () => void;
  onViewDetails: (orderId: string) => void;
}

export function TraderMyOrders({ onBack, onViewDetails }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = ORDERS.filter(order => {
    const matchesSearch = order.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = ORDERS.length;
  const activeOrders = ORDERS.filter(o => ['Created', 'Agreed', 'In Delivery', 'Delivered'].includes(o.status)).length;
  const completedOrders = ORDERS.filter(o => o.status === 'Completed').length;
  const inDelivery = ORDERS.filter(o => o.status === 'In Delivery').length;

  const totalSpend = ORDERS.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <motion.img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'blur(10px)', transform: 'scale(1.02)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(255,252,235,0.15)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white px-12 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <AgroChainLogo size={40} bgColor="#14532d" borderRadius={10} />
          <span className="text-[#14532d] font-bold text-xl tracking-tight">AgroChain</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <button onClick={onBack} className="hover:text-[#14532d]">Home</button>
          <span>›</span>
          <span className="text-[#14532d] font-semibold">My Orders</span>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-20 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Noto Serif', serif" }}>
            My Orders
          </h1>
          <p className="text-[15px] text-[#6b7280] mt-1.5">
            Track all your crop purchases from farmers.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 mb-6 max-w-[1100px] mx-auto">
          {/* Total Orders */}
          <div
            className="flex-1 rounded-2xl border shadow-sm overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.82)',
              borderColor: 'rgba(0,0,0,0.07)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '90px',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#3b82f6' }} />
            <div className="flex items-center justify-between h-full px-6">
              <div>
                <div className="text-4xl font-bold text-[#111827]">{totalOrders}</div>
                <div className="text-[13px] text-[#6b7280] mt-0.5">Total Orders</div>
                <div className="text-[11px] font-semibold mt-1" style={{ color: '#3b82f6' }}>+2 this week</div>
              </div>
              <Sparkline color="#3b82f6" />
            </div>
          </div>

          {/* Active Orders */}
          <div
            className="flex-1 rounded-2xl border shadow-sm overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.82)',
              borderColor: 'rgba(0,0,0,0.07)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '90px',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#f59e0b' }} />
            <div className="flex items-center justify-between h-full px-6">
              <div>
                <div className="text-4xl font-bold text-[#111827]">{activeOrders}</div>
                <div className="text-[13px] text-[#6b7280] mt-0.5">Active Orders</div>
                <div className="text-[11px] font-semibold mt-1" style={{ color: '#f59e0b' }}>{inDelivery} in delivery</div>
              </div>
              <Sparkline color="#f59e0b" />
            </div>
          </div>

          {/* Completed Orders */}
          <div
            className="flex-1 rounded-2xl border shadow-sm overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.82)',
              borderColor: 'rgba(0,0,0,0.07)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '90px',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#16a34a' }} />
            <div className="flex items-center justify-between h-full px-6">
              <div>
                <div className="text-4xl font-bold text-[#111827]">{completedOrders}</div>
                <div className="text-[13px] text-[#6b7280] mt-0.5">Completed Orders</div>
                <div className="text-[11px] font-semibold mt-1" style={{ color: '#16a34a' }}>+1 this week</div>
              </div>
              <Sparkline color="#16a34a" />
            </div>
          </div>
        </div>

        {/* Filter + Search Bar */}
        <div
          className="max-w-[1100px] mx-auto rounded-2xl border px-5 py-3 mb-6 flex items-center gap-4"
          style={{
            background: 'rgba(255,255,255,0.82)',
            borderColor: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <input
            type="text"
            placeholder="Search crop or farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-60 h-10 px-4 text-[13px] rounded-lg border"
            style={{ borderColor: 'rgba(0,0,0,0.10)' }}
          />
          
          <div className="flex gap-2">
            {['All', 'Agreed', 'In Delivery', 'Delivered', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="px-4 py-1.5 rounded-full text-[13px] font-medium transition"
                style={{
                  background: statusFilter === status ? '#dcfce7' : '#f3f4f6',
                  color: statusFilter === status ? '#15803d' : '#6b7280',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[13px] text-[#6b7280] italic">
            {filteredOrders.length} orders
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-[1100px] mx-auto flex gap-4">
          {/* Left Column - Order Cards */}
          <div className="flex-1" style={{ width: '65%' }}>
            <div className="flex flex-col gap-3">
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} onViewDetails={onViewDetails} />
              ))}
            </div>
          </div>

          {/* Right Column - Summary Sidebar */}
          <div style={{ width: '32%' }}>
            {/* Spend Summary */}
            <div
              className="rounded-2xl border shadow-sm p-6 mb-4"
              style={{
                background: 'rgba(255,255,255,0.82)',
                borderColor: 'rgba(0,0,0,0.07)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div className="text-base font-bold text-[#111827]">Spend Summary</div>
              <div className="text-xs text-[#9ca3af] mt-0.5">This month</div>
              <div className="text-[28px] font-bold mt-3" style={{ color: '#15803d' }}>
                ₹{totalSpend.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#9ca3af] mt-1">Total spent across {totalOrders} orders</div>
              
              <div className="border-t my-3.5" style={{ borderColor: 'rgba(0,0,0,0.06)' }} />
              
              {SPEND_BREAKDOWN.map(item => (
                <div
                  key={item.crop}
                  className="flex items-center justify-between h-9 border-b"
                  style={{ borderColor: 'rgba(0,0,0,0.05)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-[13px] text-[#374151]">{item.crop}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#111827]">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Overview */}
            <div
              className="rounded-2xl border shadow-sm p-6 mb-4"
              style={{
                background: 'rgba(255,255,255,0.82)',
                borderColor: 'rgba(0,0,0,0.07)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div className="text-base font-bold text-[#111827] mb-3">Status Overview</div>
              
              {[
                { status: 'Completed', count: 2, color: '#16a34a', percent: 40 },
                { status: 'In Delivery', count: 1, color: '#f59e0b', percent: 20 },
                { status: 'Agreed', count: 1, color: '#3b82f6', percent: 20 },
                { status: 'Created', count: 1, color: '#9ca3af', percent: 20 },
                { status: 'Delivered', count: 0, color: '#f97316', percent: 0 },
              ].map(item => (
                <div key={item.status} className="mb-3">
                  <div className="flex items-center justify-between h-8">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: STATUS_COLORS[item.status]?.bg,
                        color: STATUS_COLORS[item.status]?.text,
                      }}
                    >
                      {item.status}
                    </span>
                    <span className="text-sm font-bold text-[#111827]">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f3f4f6] rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percent}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Farmers Traded With */}
            <div
              className="rounded-2xl border shadow-sm p-6"
              style={{
                background: 'rgba(255,255,255,0.82)',
                borderColor: 'rgba(0,0,0,0.07)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div className="text-base font-bold text-[#111827] mb-3">Farmers Traded With</div>
              
              {FARMERS.map((farmer, index) => (
                <div
                  key={farmer.initials}
                  className="flex items-center gap-3 h-11 border-b"
                  style={{ borderColor: index === FARMERS.length - 1 ? 'transparent' : 'rgba(0,0,0,0.05)' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: farmer.color, color: '#374151' }}
                  >
                    {farmer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#111827] truncate">{farmer.name}</div>
                    <div className="text-xs text-[#9ca3af] truncate">{farmer.location}</div>
                  </div>
                  <div className="text-xs text-[#6b7280] whitespace-nowrap">
                    {farmer.trades} {farmer.trades === 1 ? 'trade' : 'trades'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition z-50">
        ?
      </button>
    </div>
  );
}

function OrderCard({ order, onViewDetails }: { order: Order; onViewDetails: (id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const statusConfig = STATUS_COLORS[order.status];

  const getActionButton = () => {
    switch (order.status) {
      case 'Agreed':
        return { label: 'Assign Transporter', bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' };
      case 'In Delivery':
        return { label: 'Track Order', bg: '#fef3c7', color: '#b45309', border: '#fcd34d' };
      case 'Delivered':
        return { label: 'Mark Payment Done', bg: '#dcfce7', color: '#15803d', border: '#86efac' };
      case 'Completed':
        return { label: 'View Receipt', bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
      default:
        return { label: 'View Status', bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
    }
  };

  const actionBtn = getActionButton();

  return (
    <motion.div
      className="rounded-2xl border shadow-sm p-6 relative overflow-hidden cursor-pointer"
      style={{
        background: isHovered ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' : 'rgba(255,255,255,0.85)',
        borderColor: isHovered ? 'rgba(22,163,74,0.25)' : 'rgba(0,0,0,0.06)',
        boxShadow: isHovered ? '0 10px 36px rgba(0,0,0,0.10)' : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'all 0.20s ease',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ y: isHovered ? -2 : 0 }}
    >
      {/* Left Accent Bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: statusConfig.accent }}
      />

      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <CropIcon crop={order.crop} />
          <div>
            <div className="text-[17px] font-bold text-[#111827]">{order.crop}</div>
            <div className="text-[13px] text-[#6b7280] flex items-center gap-1.5">
              <span>by {order.farmer}</span>
              <span>·</span>
              <span>{order.location}</span>
              <span
                className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: '#dcfce7', color: '#15803d' }}
              >
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: '#15803d' }}>
            ₹{order.total.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#9ca3af]">Order {order.id}</div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="border-t pt-3 mb-3 flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#f3f4f6', color: '#374151' }}>
            {order.quantity} kg
          </span>
          <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#dcfce7', color: '#15803d' }}>
            ₹{order.pricePerKg}/kg
          </span>
          <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#f3f4f6', color: '#6b7280' }}>
            Ordered: {order.date}
          </span>
        </div>
        <ProgressTracker status={order.status} />
      </div>

      {/* Bottom Row */}
      <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: CROP_COLORS[order.crop] || '#f3f4f6', color: '#374151' }}
          >
            {order.farmer.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#111827]">{order.farmer}</div>
            <div className="text-xs text-[#6b7280]">{order.location}</div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => onViewDetails(order.id)}
            className="border px-4 py-2 rounded-lg text-[13px] font-semibold transition"
            style={{
              borderColor: isHovered ? '#15803d' : '#e5e7eb',
              color: isHovered ? '#15803d' : '#6b7280',
              background: isHovered ? '#f0fdf4' : 'transparent',
            }}
          >
            View Details →
          </button>
          <button
            className="border px-4 py-2 rounded-lg text-[13px] font-semibold transition"
            style={{
              background: actionBtn.bg,
              color: actionBtn.color,
              borderColor: actionBtn.border,
            }}
          >
            {actionBtn.label}
          </button>
        </div>
      </div>
    </motion.div>
  );
}