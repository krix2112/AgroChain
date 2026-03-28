import { useState } from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

interface LanguageModalProps {
    onSelectLanguage: (lang: 'en' | 'hi') => void;
}

export function LanguageModal({ onSelectLanguage }: LanguageModalProps) {
    const [selected, setSelected] = useState<'en' | 'hi'>('en');

    const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

    return (
        <div
            className="at-lang-modal-overlay"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
            }}
        >
            {/* Drag handle — mobile bottom sheet only */}
            <motion.div
                className="at-lang-modal-card"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
                style={{
                    width: 520,
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(28px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                    border: '1.5px solid rgba(255,255,255,0.60)',
                    borderRadius: 28,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
                    padding: '48px 44px',
                    textAlign: 'center',
                    fontFamily: font,
                }}
            >
                {/* Drag handle pill — visible on mobile */}
                <div
                    className="mobile-only"
                    style={{
                        width: 40,
                        height: 4,
                        background: '#DDD',
                        borderRadius: 2,
                        margin: '0 auto 24px',
                        display: 'none', // shown via CSS
                    }}
                />

                {/* Globe icon */}
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'rgba(45,106,47,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}
                >
                    <Globe style={{ width: 32, height: 32, color: '#2D6A2F' }} />
                </div>

                {/* Headings */}
                <h2
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 26,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        margin: 0,
                    }}
                >
                    Choose your language
                </h2>
                <p
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#2D6A2F',
                        margin: '6px 0 0',
                        fontFamily: font,
                    }}
                >
                    अपनी भाषा चुनें
                </p>
                <p style={{ fontSize: 13, color: '#888', marginTop: 8, marginBottom: 0 }}>
                    You can always change this later from settings
                </p>

                {/* Language option buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                    {/* English */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelected('en')}
                        style={{
                            width: '100%',
                            height: 64,
                            background: selected === 'en' ? '#2D6A2F' : 'rgba(255,255,255,0.70)',
                            border: selected === 'en' ? 'none' : '2px solid #DDD',
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            cursor: 'pointer',
                            boxShadow: selected === 'en' ? '0 4px 16px rgba(45,106,47,0.30)' : 'none',
                            transition: 'all 0.18s',
                            fontFamily: font,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 22 }}>🇬🇧</span>
                            <span
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: selected === 'en' ? 'white' : '#1A1A1A',
                                }}
                            >
                                English
                            </span>
                        </div>
                        {/* Checkmark circle */}
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: selected === 'en' ? 'none' : '2px solid #DDD',
                                background: selected === 'en' ? 'rgba(255,255,255,0.30)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {selected === 'en' && (
                                <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>✓</span>
                            )}
                        </div>
                    </motion.button>

                    {/* Hindi */}
                    <motion.button
                        whileHover={{ scale: 1.01, borderColor: '#2D6A2F' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelected('hi')}
                        style={{
                            width: '100%',
                            height: 64,
                            background: selected === 'hi' ? '#2D6A2F' : 'rgba(255,255,255,0.70)',
                            border: selected === 'hi' ? 'none' : '2px solid #DDD',
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            cursor: 'pointer',
                            boxShadow: selected === 'hi' ? '0 4px 16px rgba(45,106,47,0.30)' : 'none',
                            transition: 'all 0.18s',
                            fontFamily: font,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 22 }}>🇮🇳</span>
                            <span
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: selected === 'hi' ? 'white' : '#1A1A1A',
                                }}
                            >
                                हिंदी
                            </span>
                        </div>
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: selected === 'hi' ? 'none' : '2px solid #DDD',
                                background: selected === 'hi' ? 'rgba(255,255,255,0.30)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {selected === 'hi' && (
                                <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>✓</span>
                            )}
                        </div>
                    </motion.button>
                </div>

                {/* Confirm button */}
                <motion.button
                    whileHover={{ boxShadow: '0 6px 28px rgba(45,106,47,0.45)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectLanguage(selected)}
                    style={{
                        width: '100%',
                        height: 56,
                        background: '#2D6A2F',
                        color: 'white',
                        border: 'none',
                        borderRadius: 14,
                        fontSize: 17,
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: 28,
                        boxShadow: '0 4px 16px rgba(45,106,47,0.30)',
                        fontFamily: font,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                    }}
                >
                    Confirm / पुष्टि करें
                </motion.button>
            </motion.div>
        </div>
    );
}