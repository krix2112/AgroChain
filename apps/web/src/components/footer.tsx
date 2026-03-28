import { Phone, HelpCircle, Tablet, Wheat, Carrot } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'hi';
}

export function Footer({ language }: FooterProps) {
  return (
    <footer
      className="w-full flex items-center px-10 gap-6"
      style={{
        height: 72,
        background: 'rgba(44,62,27,0.90)',
        flexShrink: 0,
      }}
    >
      {/* Left decorative tablet/device icon */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        style={{ opacity: 0.65, width: 100 }}
      >
        <Tablet className="w-7 h-7 text-yellow-200" />
        <div className="w-5 h-5 rounded-full bg-yellow-200/30 flex items-center justify-center">
          <Carrot className="w-3 h-3 text-yellow-200" />
        </div>
        <div className="w-5 h-5 rounded-full bg-green-200/30 flex items-center justify-center">
          <Wheat className="w-3 h-3 text-green-200" />
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center gap-6">
        <span
          style={{
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          }}
        >
          {language === 'en' ? 'Need help?' : 'मदद चाहिए?'}
        </span>

        <button
          className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 10,
            padding: '10px 20px',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            minHeight: 42,
            cursor: 'pointer',
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          }}
        >
          <Phone className="w-4 h-4" />
          {language === 'en' ? 'Call Support' : 'सहायता कॉल'}
        </button>

        <button
          className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 10,
            padding: '10px 20px',
            color: 'white',
            fontSize: 14,
            fontWeight: 500,
            minHeight: 42,
            cursor: 'pointer',
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          }}
        >
          {language === 'en' ? 'Help / FAQ' : 'सहायता / FAQ'}
        </button>
      </div>

      {/* Right spacer for balance */}
      <div style={{ minWidth: 100 }} />
    </footer>
  );
}