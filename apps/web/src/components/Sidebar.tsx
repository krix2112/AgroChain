// apps/web/src/components/Sidebar.tsx
'use client';
import React from 'react';

const Sidebar = ({ user, activePath }: { user: any, activePath: string }) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen border-r border-white/5 bg-black/50 backdrop-blur-2xl fixed">
      <div className="p-8 pb-12 flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
          </svg>
        </div>
        <span className="text-xl font-black text-emerald-400">AgroChain</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {[
          { name: 'Overview', path: '/dashboard' },
          { name: 'Marketplace', path: '/marketplace' },
          { name: 'My Listings', path: '/inventory' },
          { name: 'Open Requests', path: '/requests' },
          { name: 'Wallet', path: '/wallet' },
          { name: 'Settings', path: '/settings' }
        ].map((item, idx) => (
          <a 
            key={idx} 
            href={item.path}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activePath === item.path ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
          >
            <span className="font-bold">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-6 m-4 mt-auto rounded-3xl bg-zinc-900/50 border border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500"></div>
          <div>
            <p className="font-bold text-sm truncate w-32">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button className="w-full py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all">
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
