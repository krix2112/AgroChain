'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ShoppingCart, Package, Store,
  FileText, Wallet, Bell, Search, Menu, X, LogOut, BarChart3
} from 'lucide-react';

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mandi-prices', label: 'Mandi Prices', icon: BarChart3 },
  { path: '/farmers', label: 'Farmers', icon: Users },
  { path: '/procurement', label: 'Procurement', icon: ShoppingCart },
  { path: '/lots', label: 'Lots', icon: Package },
  { path: '/marketplace', label: 'Marketplace', icon: Store },
  { path: '/trades', label: 'Trades', icon: FileText },
  { path: '/payments', label: 'Payments', icon: Wallet },
];

export default function FigmaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D32' }}>
                <span className="text-white font-bold">FT</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline" style={{ color: '#1a1a1a' }}>AgroTrade</span>
            </a>
          </div>
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search lots, traders, farmers..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} style={{ color: '#666' }} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2E7D32' }}>
                  <span className="text-white text-sm font-semibold">FP</span>
                </div>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Profile</button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Settings</button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2 text-red-600">
                    <LogOut size={16} />Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-[#2E7D32] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">© 2026 AgroTrade</div>
        </div>
      </aside>

      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        <div className="p-6">{children}</div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}
