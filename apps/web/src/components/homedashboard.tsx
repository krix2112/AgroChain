import { motion } from 'motion/react';
import { Wheat, MessageSquare, Package } from 'lucide-react';

// ══════════════════════════════════════════════════
// IMAGES
// ══════════════════════════════════════════════════
const WHEAT_FIELD_IMG = 'https://images.unsplash.com/photo-1771318204802-424c195fa453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXNoJTIwZ3JlZW4lMjB3aGVhdCUyMGZpZWxkJTIwY3JvcHxlbnwxfHx8fDE3NzQ1MDUyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const GRAIN_HANDS_IMG = 'https://images.unsplash.com/photo-1673200674067-1923f239194d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGhvbGRpbmclMjBnb2xkZW4lMjB3aGVhdCUyMGdyYWluc3xlbnwxfHx8fDE3NzQ1MDUyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const VEGGIES_IMG = 'https://images.unsplash.com/photo-1598962099619-528a224cb625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBwcm9kdWNlJTIwY3JhdGUlMjBtYXJrZXR8ZW58MXx8fHwxNzc0NTA1MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080';

interface HomeDashboardProps {
    language: 'en' | 'hi';
    onSellCrop: () => void;
    onViewOffers?: () => void;
    onMarketplace?: () => void;
    onMyOrders?: () => void;
}

export function HomeDashboard({ language, onSellCrop, onViewOffers, onMyOrders }: HomeDashboardProps) {
    return (
        <div
            className="relative z-10 flex flex-col at-page-wrap"
            style={{
                paddingTop: 64, // navbar height
                minHeight: 'calc(100vh - 72px)', // subtract footer height
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            }}
        >
            {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
            <div className="at-home-hero" style={{ padding: '32px 0 0 80px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1
                        style={{
                            fontFamily: "'Noto Serif', serif",
                            fontSize: 38,
                            fontWeight: 700,
                            color: '#1A1A1A',
                            lineHeight: 1.25,
                            marginBottom: 10,
                            textShadow: '0 1px 8px rgba(255,255,255,0.80)',
                        }}
                    >
                        {language === 'en' ? 'Welcome to AgroTrade, Ramesh!' : 'AgroTrade पर स्वागत है, रमेश!'}
                    </h1>

                    <p
                        style={{
                            fontSize: 16,
                            color: '#444',
                            lineHeight: 1.5,
                            marginBottom: 6,
                            maxWidth: 540,
                        }}
                    >
                        {language === 'en' ? 'Digitizing agriculture made easy.' : 'कृषि को डिजिटल बनाना अब आसान।'}
                    </p>

                    <p
                        style={{
                            fontSize: 15,
                            color: '#555',
                            lineHeight: 1.5,
                            maxWidth: 560,
                        }}
                    >
                        {language === 'en'
                            ? 'List your produce, get offers, and track deliveries effortlessly.'
                            : 'फसल सूचीबद्ध करें, ऑफर पाएं और डिलीवरी ट्रैक करें।'}
                    </p>
                </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════
          MAIN GLASS PANEL — 900px wide, centered
          Contains 3 feature cards + start listing strip
      ══════════════════════════════════════════════════ */}
            <div className="flex justify-center" style={{ padding: '32px 0 48px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        width: 900,
                        background: 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(24px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                        border: '1.5px solid rgba(255,255,255,0.55)',
                        borderRadius: 24,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                        padding: 28,
                    }}
                >
                    {/* ══════════════════════════════════════════════════
              3 FEATURE CARDS
              Layout: 1 large left + 2 stacked right
          ══════════════════════════════════════════════════ */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                        {/* LEFT: Large Sell Crop Card */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onSellCrop}
                            className="relative overflow-hidden cursor-pointer group"
                            style={{
                                width: 520,
                                height: 260,
                                borderRadius: 16,
                            }}
                        >
                            {/* Photo background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${WHEAT_FIELD_IMG})` }}
                            />
                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30,80,30,0.80) 0%, rgba(50,110,50,0.45) 100%)',
                                }}
                            />
                            {/* Content */}
                            <div
                                className="relative z-10 flex flex-col justify-between"
                                style={{ padding: 20, height: '100%' }}
                            >
                                <div>
                                    <Wheat className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3
                                        className="text-white"
                                        style={{
                                            fontSize: 22,
                                            fontWeight: 700,
                                            marginBottom: 6,
                                            lineHeight: 1.3,
                                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        }}
                                    >
                                        {language === 'en' ? 'Sell Crop' : 'फसल बेचें'}
                                    </h3>
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.75)',
                                            fontSize: 14,
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {language === 'en'
                                            ? 'List your harvest, set a price, get offers.'
                                            : 'अपनी फसल सूचीबद्ध करें, मूल्य तय करें।'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT: Two smaller cards stacked */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Top: View Offers */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={onViewOffers}
                                className="relative overflow-hidden cursor-pointer group"
                                style={{
                                    height: 123,
                                    borderRadius: 16,
                                }}
                            >
                                {/* Photo background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${GRAIN_HANDS_IMG})` }}
                                />
                                {/* Gradient overlay */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(140,90,0,0.82) 0%, rgba(190,130,10,0.50) 100%)',
                                    }}
                                />
                                {/* Content */}
                                <div
                                    className="relative z-10 flex flex-col justify-between"
                                    style={{ padding: 18, height: '100%' }}
                                >
                                    <div>
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-white"
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                marginBottom: 4,
                                                lineHeight: 1.3,
                                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                            }}
                                        >
                                            {language === 'en' ? 'View Offers' : 'ऑफर देखें'}
                                        </h3>
                                        <p
                                            style={{
                                                color: 'rgba(255,255,255,0.75)',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {language === 'en'
                                                ? 'Check offers and negotiate best prices'
                                                : 'ऑफर देखें और बेहतर दाम पाएं'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Bottom: My Orders */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={onMyOrders}
                                className="relative overflow-hidden cursor-pointer group"
                                style={{
                                    height: 123,
                                    borderRadius: 16,
                                }}
                            >
                                {/* Photo background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${VEGGIES_IMG})` }}
                                />
                                {/* Gradient overlay */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(20,70,120,0.82) 0%, rgba(30,100,170,0.50) 100%)',
                                    }}
                                />
                                {/* Content */}
                                <div
                                    className="relative z-10 flex flex-col justify-between"
                                    style={{ padding: 18, height: '100%' }}
                                >
                                    <div>
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-white"
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                marginBottom: 4,
                                                lineHeight: 1.3,
                                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                            }}
                                        >
                                            {language === 'en' ? 'My Orders' : 'मेरे ऑर्डर'}
                                        </h3>
                                        <p
                                            style={{
                                                color: 'rgba(255,255,255,0.75)',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {language === 'en'
                                                ? 'Track your produce from farm to buyer'
                                                : 'खेत से खरीदार तक अपनी फसल ट्रैक करें'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════
              START LISTING STRIP
              Below the cards, horizontal layout
          ══════════════════════════════════════════════════ */}
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.70)',
                            borderRadius: 14,
                            padding: '20px 28px',
                            border: '1px solid rgba(255,255,255,0.55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 20,
                        }}
                    >
                        {/* Left: Text */}
                        <div>
                            <h4
                                style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                    color: '#1A1A1A',
                                    marginBottom: 6,
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                }}
                            >
                                {language === 'en' ? 'List your harvest in minutes' : 'मिनटों में अपनी फसल सूचीबद्ध करें'}
                            </h4>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: '#2D6A2F',
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                }}
                            >
                                {language === 'en'
                                    ? '1. Select Crop  ·  2. Set Price & Quantity  ·  3. Go Live!'
                                    : '1. फसल चुनें  ·  2. मूल्य तय करें  ·  3. लाइव करें!'}
                            </p>
                        </div>

                        {/* Right: CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 6px 18px rgba(45,106,47,0.35)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onSellCrop}
                            style={{
                                background: '#2D6A2F',
                                color: 'white',
                                border: 'none',
                                borderRadius: 12,
                                padding: '14px 28px',
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(45,106,47,0.30)',
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                whiteSpace: 'nowrap',
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            }}
                        >
                            <span>🌿</span>
                            {language === 'en' ? 'Start Listing' : 'सूचीबद्ध करें'}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}