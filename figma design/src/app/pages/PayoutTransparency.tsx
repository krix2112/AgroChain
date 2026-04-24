import { useState } from 'react';
import { Download, Share2, TrendingUp } from 'lucide-react';
import heroImage from '../../imports/image-2.png';

interface FarmerPayout {
  id: number;
  name: string;
  contribution: number;
  payout: string;
  color: string;
}

export default function PayoutTransparency() {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const summary = {
    totalSaleValue: '₹12,50,000',
    commissionDeducted: '₹37,500',
    netPayout: '₹12,12,500',
  };

  const farmers: FarmerPayout[] = [
    { id: 1, name: 'Ramesh Kumar', contribution: 35, payout: '₹4,24,375', color: '#1B5E20' },
    { id: 2, name: 'Sunita Devi', contribution: 25, payout: '₹3,03,125', color: '#66BB6A' },
    { id: 3, name: 'Vijay Singh', contribution: 20, payout: '₹2,42,500', color: '#8D6E63' },
    { id: 4, name: 'Lakshmi Patel', contribution: 12, payout: '₹1,45,500', color: '#FDD835' },
    { id: 5, name: 'Mohan Reddy', contribution: 8, payout: '₹97,000', color: '#AED581' },
  ];

  const total = farmers.reduce((sum, f) => sum + f.contribution, 0);

  return (
    <div className="space-y-8 relative">
      {/* Subtle Background Fragments */}
      <div
        className="fixed top-0 left-0 w-64 h-64 -z-10 opacity-5"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-64 h-64 -z-10 opacity-5"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          filter: 'blur(8px)',
        }}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
          Payout Transparency
        </h1>
        <p className="text-sm" style={{ color: '#666' }}>
          Complete breakdown of sales and farmer payouts
        </p>
      </div>

      {/* Top Summary Card */}
      <div className="backdrop-blur-md bg-white/80 rounded-3xl p-8 border border-white/50 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="backdrop-blur-sm bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl p-6 border border-blue-200/50">
            <div className="text-sm text-blue-700 mb-2 font-medium">Total Sale Value</div>
            <div className="text-4xl font-bold text-blue-900">{summary.totalSaleValue}</div>
          </div>

          <div className="backdrop-blur-sm bg-gradient-to-br from-red-50/50 to-pink-50/50 rounded-2xl p-6 border border-red-200/50">
            <div className="text-sm text-red-700 mb-2 font-medium">Commission Deducted (3%)</div>
            <div className="text-4xl font-bold text-red-900">{summary.commissionDeducted}</div>
          </div>

          <div className="relative bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-2xl p-6 shadow-2xl shadow-[#2E7D32]/50 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-sm text-white/90 mb-2 font-medium">Net Payout</div>
              <div className="text-4xl font-bold text-white flex items-center gap-2">
                {summary.netPayout}
                <TrendingUp size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Farmer List - Glass Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
            Farmer Breakdown
          </h2>

          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              onMouseEnter={() => setHoveredSlice(farmer.id)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`backdrop-blur-md bg-white/90 rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                hoveredSlice === farmer.id ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                ringColor: hoveredSlice === farmer.id ? farmer.color : 'transparent',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                    style={{ backgroundColor: farmer.color }}
                  >
                    {farmer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-lg" style={{ color: '#1a1a1a' }}>
                      {farmer.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {farmer.contribution}% contribution
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                    {farmer.payout}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="backdrop-blur-md bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-2xl p-6 border border-green-200/50 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold" style={{ color: '#1a1a1a' }}>
                Total Distribution
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                {summary.netPayout}
              </span>
            </div>
          </div>
        </div>

        {/* Donut Chart - Enhanced */}
        <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 border border-white/50 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
            Distribution Chart
          </h2>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <svg width="320" height="320" viewBox="0 0 320 320" className="drop-shadow-2xl">
                <defs>
                  {farmers.map((farmer, index) => (
                    <filter key={`shadow-${index}`} id={`shadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                      <feOffset dx="0" dy="4" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  ))}
                </defs>

                {farmers.map((farmer, index) => {
                  let currentAngle = -90;
                  for (let i = 0; i < index; i++) {
                    currentAngle += (farmers[i].contribution / total) * 360;
                  }

                  const percentage = (farmer.contribution / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const gapAngle = 2;

                  const startAngle = currentAngle + gapAngle / 2;
                  const endAngle = currentAngle + angle - gapAngle / 2;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const outerRadius = hoveredSlice === farmer.id ? 140 : 130;
                  const innerRadius = 70;

                  const x1 = 160 + outerRadius * Math.cos(startRad);
                  const y1 = 160 + outerRadius * Math.sin(startRad);
                  const x2 = 160 + outerRadius * Math.cos(endRad);
                  const y2 = 160 + outerRadius * Math.sin(endRad);

                  const x3 = 160 + innerRadius * Math.cos(endRad);
                  const y3 = 160 + innerRadius * Math.sin(endRad);
                  const x4 = 160 + innerRadius * Math.cos(startRad);
                  const y4 = 160 + innerRadius * Math.sin(startRad);

                  const largeArc = angle - gapAngle > 180 ? 1 : 0;

                  const path = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

                  return (
                    <g
                      key={index}
                      onMouseEnter={() => setHoveredSlice(farmer.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className="cursor-pointer transition-all duration-300"
                    >
                      <path
                        d={path}
                        fill={farmer.color}
                        filter={`url(#shadow-${index})`}
                        opacity={hoveredSlice === null || hoveredSlice === farmer.id ? 1 : 0.5}
                        className="transition-all duration-300"
                        style={{
                          transform: hoveredSlice === farmer.id ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '160px 160px',
                        }}
                      />
                    </g>
                  );
                })}

                {/* Center Circle with Value */}
                <circle cx="160" cy="160" r="65" fill="white" className="drop-shadow-lg" />
                <text
                  x="160"
                  y="150"
                  textAnchor="middle"
                  className="text-sm font-medium"
                  fill="#666"
                >
                  Total Payout
                </text>
                <text
                  x="160"
                  y="175"
                  textAnchor="middle"
                  className="text-2xl font-bold"
                  fill="#2E7D32"
                >
                  {summary.netPayout}
                </text>
              </svg>
            </div>

            {/* Legend - Right Side */}
            <div className="w-full space-y-3">
              {farmers.map((farmer) => (
                <div
                  key={farmer.id}
                  onMouseEnter={() => setHoveredSlice(farmer.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    hoveredSlice === farmer.id
                      ? 'bg-gray-100 shadow-md scale-105'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: farmer.color }}
                    />
                    <span className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>
                      {farmer.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: farmer.color }}>
                    {farmer.contribution}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl hover:shadow-[#2E7D32]/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
          <Download size={20} />
          Download PDF Report
        </button>
        <button className="flex-1 py-4 backdrop-blur-md bg-white/80 border-2 border-[#2E7D32] text-[#2E7D32] rounded-2xl font-bold hover:bg-green-50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg">
          <Share2 size={20} />
          Share with Farmers
        </button>
      </div>
    </div>
  );
}
