"use client";

"use client";

import React from 'react';

interface RoleSelectorProps {
  selected: string;
  onSelect: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selected, onSelect }) => {
  const roles = [
    { key: 'farmer', label: '🌾 Farmer' },
    { key: 'trader', label: '🤝 Trader' },
    { key: 'transporter', label: '🚛 Transporter' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {roles.map(role => (
        <button
          key={role.key}
          onClick={() => onSelect(role.key)}
          className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
            selected === role.key 
            ? 'border-emerald-500 bg-emerald-500/10 text-white' 
            : 'border-white/5 bg-zinc-900/40 text-zinc-500 hover:border-white/10'
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;