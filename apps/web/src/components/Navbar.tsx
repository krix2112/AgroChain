import { Sprout, User, ChevronDown, Home, ChevronRight } from 'lucide-react';

interface NavbarProps {
  language: 'en' | 'hi';
  onLanguageToggle: () => void;
  breadcrumb?: string[];
  onBreadcrumbClick?: (index: number) => void;
  onProfileClick?: () => void;
}

export function Navbar({ language, onLanguageToggle, breadcrumb, onBreadcrumbClick, onProfileClick }: NavbarProps) {
  const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

  return (
    <nav
      className="at-navbar fixed top-0 left-0 right-0 z-50 flex items-center"
      style={{
        height: 64,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        fontFamily: font,
      }}
    >
      <div className="w-full flex items-center justify-between" style={{ padding: '0 32px' }}>

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5" style={{ minWidth: 160 }}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
            style={{ backgroundColor: '#2D6A2F' }}
          >
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: 20,
              fontWeight: 700,
              color: '#2D6A2F',
              letterSpacing: '-0.02em',
            }}
          >
            AgroChain
          </span>
        </div>

        {/* ── Center: Breadcrumb (desktop only) ── */}
        <div className="at-navbar-breadcrumb flex items-center gap-1.5">
          {breadcrumb && breadcrumb.length > 0 ? (
            breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#BBB' }} />
                )}
                <button
                  onClick={() => onBreadcrumbClick?.(i)}
                  className="transition-colors duration-150"
                  style={{
                    fontSize: 13,
                    color: i === breadcrumb.length - 1 ? '#444' : '#888',
                    fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                    background: 'none',
                    border: 'none',
                    cursor: i < breadcrumb.length - 1 ? 'pointer' : 'default',
                    fontFamily: font,
                    padding: 0,
                  }}
                  onMouseEnter={e => {
                    if (i < breadcrumb.length - 1) {
                      (e.target as HTMLButtonElement).style.color = '#2D6A2F';
                    }
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.color =
                      i === breadcrumb.length - 1 ? '#444' : '#888';
                  }}
                >
                  {i === 0 && (
                    <Home className="inline w-3 h-3 mr-1 relative" style={{ top: -1 }} />
                  )}
                  {crumb}
                </button>
              </span>
            ))
          ) : (
            <span style={{ fontSize: 13, color: '#888', fontFamily: font }}>
              <Home className="inline w-3 h-3 mr-1" style={{ position: 'relative', top: -1 }} />
              Home
            </span>
          )}
        </div>

        {/* ── Right: Language Toggle + Greeting + Avatar ── */}
        <div className="flex items-center gap-3" style={{ justifyContent: 'flex-end' }}>

          {/* Language Toggle — Full (desktop) */}
          <button
            onClick={onLanguageToggle}
            className="at-navbar-lang-full flex items-center transition-all duration-200"
            style={{
              background: 'rgba(45,106,47,0.08)',
              border: '1.5px solid rgba(45,106,47,0.25)',
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: '#2D6A2F',
              cursor: 'pointer',
              fontFamily: font,
              minHeight: 32,
            }}
          >
            {language === 'en' ? (
              <>
                <span style={{ color: '#2D6A2F', fontWeight: 700 }}>EN</span>
                <span style={{ color: '#BBB', margin: '0 4px' }}>|</span>
                <span style={{ color: '#888' }}>हिंदी</span>
              </>
            ) : (
              <>
                <span style={{ color: '#888' }}>EN</span>
                <span style={{ color: '#BBB', margin: '0 4px' }}>|</span>
                <span style={{ color: '#2D6A2F', fontWeight: 700 }}>हिंदी</span>
              </>
            )}
          </button>

          {/* Language Toggle — Compact (mobile) */}
          <button
            onClick={onLanguageToggle}
            className="at-navbar-lang-compact"
            style={{
              display: 'none', // shown via CSS on mobile
              background: 'rgba(45,106,47,0.08)',
              border: '1.5px solid rgba(45,106,47,0.25)',
              borderRadius: 16,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: '#2D6A2F',
              cursor: 'pointer',
              fontFamily: font,
              minHeight: 30,
              whiteSpace: 'nowrap',
            }}
          >
            {language === 'en' ? 'EN | हि' : 'EN | हि'}
          </button>

          {/* User Avatar */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={onProfileClick}
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 24,
              padding: '4px 8px 4px 4px',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '2px solid #2D6A2F',
                backgroundColor: '#c2622d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <User className="w-4 h-4 text-white" />
            </div>
            {/* Greeting — hidden on mobile */}
            <span
              className="at-navbar-greeting"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#444',
                fontFamily: font,
                whiteSpace: 'nowrap',
              }}
            >
              {language === 'en' ? '🙏 Namaste, Ramesh' : '🙏 नमस्ते, रमेश'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 at-navbar-greeting" />
          </div>
        </div>
      </div>
    </nav>
  );
}