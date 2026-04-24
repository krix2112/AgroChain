import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Mic, PenLine } from 'lucide-react';
import { SellCropStepper } from './SellCropStepper';

// ── Crop images from Unsplash ──
const CROP_IMGS = {
  wheat:
    'https://images.unsplash.com/photo-1771208680359-28cf7faf1040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB3aGVhdCUyMHN0YWxrcyUyMGhhcnZlc3QlMjBmaWVsZHxlbnwxfHx8fDE3NzQ0Njg0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  tomato:
    'https://images.unsplash.com/photo-1760562796048-099c8d914490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXBlJTIwcmVkJTIwdG9tYXRvZXMlMjBvbiUyMHZpbmV8ZW58MXx8fHwxNzc0NDY4NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  rice:
    'https://images.unsplash.com/photo-1709607389132-7d4cad84aef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2UlMjBncmFpbnMlMjBwYWRkeSUyMGZpZWxkfGVufDF8fHx8MTc3NDQ2ODQ0NXww&ixlib=rb-4.1.0&q=80&w=1080',
  onion:
    'https://images.unsplash.com/photo-1685399246790-917f3b59934e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjByZWQlMjBvbmlvbnMlMjBmcmVzaCUyMGhhcnZlc3R8ZW58MXx8fHwxNzc0NDY4NDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  potato:
    'https://images.unsplash.com/photo-1723763246578-99e614b2a91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBwb3RhdG9lcyUyMHNvaWwlMjBmYXJtfGVufDF8fHx8MTc3NDQ2ODQ0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  corn:
    'https://images.unsplash.com/photo-1762725770569-9a454aad8247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBjb3JuJTIwY29icyUyMGhhcnZlc3R8ZW58MXx8fHwxNzc0NDY4NDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  chilli:
    'https://images.unsplash.com/photo-1637683085083-fa760c1fd0af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjByZWQlMjBjaGlsbGklMjBwZXBwZXJzfGVufDF8fHx8MTc3NDQ2ODQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
};

interface Crop {
  id: string;
  nameEn: string;
  nameHi: string;
  photo: string;
  gradient: string;
}

const crops: Crop[] = [
  {
    id: 'wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    photo: CROP_IMGS.wheat,
    gradient: 'linear-gradient(135deg, rgba(20,60,20,0.78) 0%, rgba(56,120,56,0.35) 100%)',
  },
  {
    id: 'tomato',
    nameEn: 'Tomato',
    nameHi: 'टमाटर',
    photo: CROP_IMGS.tomato,
    gradient: 'linear-gradient(135deg, rgba(160,30,15,0.78) 0%, rgba(210,55,25,0.35) 100%)',
  },
  {
    id: 'rice',
    nameEn: 'Rice',
    nameHi: 'चावल',
    photo: CROP_IMGS.rice,
    gradient: 'linear-gradient(135deg, rgba(130,100,10,0.78) 0%, rgba(190,155,20,0.35) 100%)',
  },
  {
    id: 'onion',
    nameEn: 'Onion',
    nameHi: 'प्याज',
    photo: CROP_IMGS.onion,
    gradient: 'linear-gradient(135deg, rgba(80,20,100,0.78) 0%, rgba(130,40,150,0.35) 100%)',
  },
  {
    id: 'potato',
    nameEn: 'Potato',
    nameHi: 'आलू',
    photo: CROP_IMGS.potato,
    gradient: 'linear-gradient(135deg, rgba(130,85,10,0.78) 0%, rgba(180,130,20,0.35) 100%)',
  },
  {
    id: 'corn',
    nameEn: 'Corn',
    nameHi: 'मक्का',
    photo: CROP_IMGS.corn,
    gradient: 'linear-gradient(135deg, rgba(160,105,0,0.78) 0%, rgba(210,155,5,0.35) 100%)',
  },
  {
    id: 'chilli',
    nameEn: 'Chilli',
    nameHi: 'मिर्च',
    photo: CROP_IMGS.chilli,
    gradient: 'linear-gradient(135deg, rgba(160,15,15,0.78) 0%, rgba(210,35,35,0.35) 100%)',
  },
];

interface CropTileProps {
  crop: Crop;
  selected: boolean;
  language: 'en' | 'hi';
  onClick: () => void;
}

function CropTile({ crop, selected, language, onClick }: CropTileProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      animate={{ scale: hovered && !selected ? 1.02 : 1 }}
      transition={{ duration: 0.15 }}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: 10,
        height: 72,
        border: selected
          ? '2.5px solid #2D6A2F'
          : hovered
          ? '2px solid rgba(45,106,47,0.55)'
          : '2px solid transparent',
        boxShadow: selected
          ? '0 0 0 1px rgba(45,106,47,0.18), 0 3px 12px rgba(45,106,47,0.22)'
          : hovered
          ? '0 2px 8px rgba(45,106,47,0.13)'
          : '0 1px 3px rgba(0,0,0,0.10)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${crop.photo})`,
          filter: 'brightness(0.85)',
          transition: 'filter 0.2s',
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: crop.gradient,
          opacity: selected || hovered ? 0.70 : 0.85,
          transition: 'opacity 0.2s',
        }}
      />

      {/* Crop name — bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: 9,
          left: 11,
          zIndex: 2,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 700,
          textShadow: '0 1px 4px rgba(0,0,0,0.40)',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
        }}
      >
        {language === 'en' ? crop.nameEn : crop.nameHi}
      </div>

      {/* Selected checkmark badge — top-right */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          className="absolute flex items-center justify-center"
          style={{
            top: 7,
            right: 7,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#2D6A2F',
            border: '2px solid #ffffff',
            zIndex: 3,
            boxShadow: '0 2px 6px rgba(0,0,0,0.28)',
          }}
        >
          <Check className="w-2.5 h-2.5" style={{ color: '#ffffff' }} strokeWidth={3} />
        </motion.div>
      )}
    </motion.div>
  );
}

interface SellCropStep1Props {
  language: 'en' | 'hi';
  onBack: () => void;
  onNext: () => void;
}

export function SellCropStep1({ language, onBack, onNext }: SellCropStep1Props) {
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [customCropInput, setCustomCropInput] = useState('');

  const t = {
    pageTitle: language === 'en' ? 'Add Produce' : 'उत्पाद जोड़ें',
    pageSubtitle:
      language === 'en'
        ? 'Sell your harvest in just a few steps.'
        : 'बस कुछ आसान चरणों में अपनी फसल बेचें।',
    stepLabel: language === 'en' ? '1/4' : '१/४',
    panelHeading:
      language === 'en' ? 'Step 1: Select Crop' : 'चरण 1: फसल चुनें',
    panelSubheading:
      language === 'en'
        ? 'Choose the crop you want to sell.'
        : 'वह फसल चुनें जिसे आप बेचना चाहते हैं।',
    cantFind: language === 'en' ? "Can't find your crop?" : 'फसल नहीं मिली?',
    speakLink: language === 'en' ? 'Speak instead' : 'बोलकर बताएं',
    speakBtn: language === 'en' ? 'Speak instead' : 'बोलकर बताएं',
    typeCrop: language === 'en' ? 'Type crop name' : 'फसल का नाम लिखें',
    typePlaceholder: language === 'en' ? 'e.g. Sugarcane, Bajra...' : 'उदा. गन्ना, बाजरा...',
    back: language === 'en' ? '← Back' : '← वापस',
    next: language === 'en' ? 'Next →' : 'आगे →',
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
        paddingTop: 32,
        paddingBottom: 40,
      }}
    >
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ paddingLeft: 80, paddingBottom: 24 }}
      >
        <h1
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#1A1A1A',
            lineHeight: 1.2,
            marginBottom: 5,
            textShadow: '0 1px 10px rgba(255,255,255,0.85)',
          }}
        >
          {t.pageTitle}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#444',
            fontWeight: 400,
            textShadow: '0 1px 6px rgba(255,255,255,0.60)',
          }}
        >
          {t.pageSubtitle}
        </p>
      </motion.div>

      {/* ── Centered content column (640px) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          margin: '0 auto',
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {/* ── Step Progress Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.08 }}
        >
          <SellCropStepper currentStep={1} language={language} />
        </motion.div>

        {/* ── Main Glass Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.15 }}
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1.5px solid rgba(255,255,255,0.55)',
            borderRadius: 20,
            boxShadow: '0 8px 36px rgba(0,0,0,0.11)',
            padding: '28px 30px 24px',
            marginBottom: 20,
          }}
        >
          {/* Step label + heading */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 4,
              }}
            >
              {t.stepLabel}
            </span>
            <h2
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: '#1A1A1A',
                marginBottom: 4,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              }}
            >
              {t.panelHeading}
            </h2>
            <p style={{ fontSize: 13, color: '#666', fontWeight: 400 }}>
              {t.panelSubheading}
            </p>
          </div>

          {/* ── Crop Grid: 2 cols × 4 rows (7 crops + 1 custom) ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 14,
            }}
          >
            {crops.map((crop, i) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.30, delay: 0.18 + i * 0.045 }}
              >
                <CropTile
                  crop={crop}
                  selected={selectedCrop === crop.id}
                  language={language}
                  onClick={() => setSelectedCrop(crop.id)}
                />
              </motion.div>
            ))}

            {/* Custom crop input tile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.30, delay: 0.18 + 7 * 0.045 }}
              onClick={() => setSelectedCrop('custom')}
              style={{
                background: selectedCrop === 'custom' ? 'rgba(45,106,47,0.05)' : 'rgba(255,255,255,0.70)',
                border: selectedCrop === 'custom'
                  ? '2px solid #2D6A2F'
                  : '2px dashed rgba(45,106,47,0.38)',
                borderRadius: 10,
                height: 72,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {/* Icon + label */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <PenLine style={{ width: 18, height: 18, color: '#2D6A2F' }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2D6A2F',
                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.typeCrop}
                </span>
              </div>

              {/* Text input */}
              <input
                type="text"
                value={customCropInput}
                onChange={e => {
                  e.stopPropagation();
                  setCustomCropInput(e.target.value);
                }}
                onClick={e => e.stopPropagation()}
                placeholder={t.typePlaceholder}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 8,
                  border: selectedCrop === 'custom'
                    ? '1.5px solid #2D6A2F'
                    : '1.5px solid rgba(0,0,0,0.11)',
                  background: 'rgba(255,255,255,0.85)',
                  padding: '0 10px',
                  fontSize: 12,
                  fontStyle: customCropInput ? 'normal' : 'italic',
                  color: customCropInput ? '#1A1A1A' : '#AAA',
                  outline: 'none',
                  fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                  boxShadow: selectedCrop === 'custom' ? '0 0 0 2px rgba(45,106,47,0.14)' : 'none',
                  transition: 'all 0.15s',
                  minWidth: 0,
                }}
              />
            </motion.div>
          </div>

          {/* ── Voice Input Row ── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.60)',
              borderRadius: 10,
              padding: '11px 16px',
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* "Can't find" text + link */}
            <span style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t.cantFind}
            </span>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 13,
                fontWeight: 600,
                color: '#2D6A2F',
                cursor: 'pointer',
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                whiteSpace: 'nowrap',
                flexShrink: 0,
                textDecoration: 'underline',
                textDecorationColor: 'rgba(45,106,47,0.35)',
              }}
            >
              {t.speakLink}
            </button>

            {/* Dotted separator */}
            <span
              style={{
                flex: 1,
                borderTop: '1.5px dashed #D5D5D5',
                height: 0,
                display: 'block',
              }}
            />

            {/* Voice button */}
            <button
              className="flex items-center gap-1.5 transition-all duration-200 hover:bg-green-50"
              style={{
                background: 'transparent',
                border: '1.5px solid #2D6A2F',
                borderRadius: 8,
                padding: '7px 16px',
                color: '#2D6A2F',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Mic className="w-3.5 h-3.5" />
              {t.speakBtn}
            </button>
          </div>
        </motion.div>

        {/* ── Navigation Buttons ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          {/* Back */}
          <button
            onClick={onBack}
            className="transition-all duration-200 hover:bg-white/80"
            style={{
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(0,0,0,0.11)',
              borderRadius: 9,
              padding: '0 22px',
              height: 42,
              color: '#444',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 1px 5px rgba(0,0,0,0.07)',
            }}
          >
            {t.back}
          </button>

          {/* Next */}
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.03, boxShadow: '0 6px 22px rgba(45,106,47,0.42)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: '#2D6A2F',
              border: 'none',
              borderRadius: 10,
              padding: '0 28px',
              height: 44,
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(45,106,47,0.35)',
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            }}
          >
            {t.next}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}