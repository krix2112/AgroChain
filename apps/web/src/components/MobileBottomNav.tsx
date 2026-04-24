import { Home, Wheat, Package, User } from 'lucide-react';

export type BottomNavTab = 'home' | 'sell' | 'orders' | 'profile';

interface MobileBottomNavProps {
  activeTab: BottomNavTab;
  onNavigate: (tab: BottomNavTab) => void;
  language: 'en' | 'hi';
}

const TABS: { id: BottomNavTab; iconEn: string; iconHi: string; Icon: React.FC<{ style?: React.CSSProperties }> }[] = [
  { id: 'home',    iconEn: 'Home',    iconHi: 'होम',    Icon: ({ style }) => <Home    style={style} /> },
  { id: 'sell',    iconEn: 'Sell',    iconHi: 'बेचें',  Icon: ({ style }) => <Wheat   style={style} /> },
  { id: 'orders',  iconEn: 'Orders',  iconHi: 'ऑर्डर', Icon: ({ style }) => <Package style={style} /> },
  { id: 'profile', iconEn: 'Profile', iconHi: 'प्रोफ़ाइल', Icon: ({ style }) => <User style={style} /> },
];

export function MobileBottomNav({ activeTab, onNavigate, language }: MobileBottomNavProps) {
  return (
    <>
      <div
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 64,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
        }}
      >
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
              }}
            >
              {/* Active dot indicator above icon */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#2D6A2F',
                  }}
                />
              )}
              <tab.Icon
                style={{
                  width: 22,
                  height: 22,
                  color: isActive ? '#2D6A2F' : '#AAA',
                  marginTop: 6,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: isActive ? '#2D6A2F' : '#AAA',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {language === 'en' ? tab.iconEn : tab.iconHi}
              </span>
            </button>
          );
        })}
      </div>
      {/* Only show on mobile via CSS */}
      <style>{`
        .mobile-bottom-nav { display: none !important; }
        @media (max-width: 767px) {
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
