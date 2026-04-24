"use client";

import React from 'react';

interface StatusBadgeProps {
  state: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ state }) => {
  const getColors = () => {
    switch (state.toUpperCase()) {
      case 'CREATED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'AGREED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'IN_DELIVERY': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'DELIVERED': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  }

  return (
    <div className={`px-2 py-1 rounded text-xs font-bold border ${getColors()}`}>
      {state}
    </div>
  );
};

export default StatusBadge;