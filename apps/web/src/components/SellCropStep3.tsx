import { useState } from 'react';
import { motion } from 'motion/react';
import { SellCropStepper } from './SellCropStepper';
import { SelectedCropCard } from './SelectedCropCard';

// ── Reusable chip selector ──
interface ChipOption {
    value: string;
    labelEn: string;
    labelHi: string;
}

function ChipGroup({
    options,
    selected,
    onSelect,
    language,
}: {
    options: ChipOption[];
    selected: string;
    onSelect: (v: string) => void;
    language: 'en' | 'hi';
}) {
    return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {options.map(opt => {
                const isSelected = selected === opt.value;
                return (
                    <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onSelect(opt.value)}
                        style={{
                            borderRadius: 20,
                            padding: '7px 16px',
                            fontSize: 13,
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'pointer',
                            border: isSelected ? '1.5px solid #2D6A2F' : '1px solid #CCC',
                            background: isSelected ? '#2D6A2F' : 'transparent',
                            color: isSelected ? 'white' : '#555',
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            transition: 'all 0.15s',
                        }}
                    >
                        {language === 'en' ? opt.labelEn : opt.labelHi}
                    </motion.button>
                );
            })}
        </div>
    );
}

// ── Section wrapper with header ──
function QualitySection({
    icon,
    titleEn,
    titleHi,
    children,
    language,
}: {
    icon: string;
    titleEn: string;
    titleHi: string;
    children: React.ReactNode;
    language: 'en' | 'hi';
}) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.70)',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: 14,
                padding: '18px 20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 14,
                }}
            >
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#1A1A1A',
                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                    }}
                >
                    {language === 'en' ? titleEn : titleHi}
                </span>
            </div>
            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', marginBottom: 14 }} />
            {children}
        </div>
    );
}

// ── Nav buttons ──
function NavButtons({
    onBack,
    onNext,
    backLabel,
    nextLabel,
}: {
    onBack: () => void;
    onNext: () => void;
    backLabel: string;
    nextLabel: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}
        >
            <button
                onClick={onBack}
                style={{
                    background: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 10,
                    padding: '0 24px',
                    height: 48,
                    color: '#444',
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                }}
            >
                {backLabel}
            </button>
            <motion.button
                onClick={onNext}
                whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(45,106,47,0.45)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                    background: '#2D6A2F',
                    border: 'none',
                    borderRadius: 12,
                    padding: '0 32px',
                    height: 52,
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 14px rgba(45,106,47,0.35)',
                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                }}
            >
                {nextLabel}
            </motion.button>
        </motion.div>
    );
}

// ── Moisture options ──
const freshnessOptions: ChipOption[] = [
    { value: 'very-fresh', labelEn: 'Very Fresh', labelHi: 'बहुत ताज़ा' },
    { value: 'fresh', labelEn: 'Fresh', labelHi: 'ताज़ा' },
    { value: 'moderate', labelEn: 'Moderate', labelHi: 'मध्यम' },
];

// ── Produce quality options ──
const produceOptions: ChipOption[] = [
    { value: 'low', labelEn: 'Low', labelHi: 'कम' },
    { value: 'medium', labelEn: 'Medium', labelHi: 'मध्यम' },
    { value: 'high', labelEn: 'High', labelHi: 'उच्च' },
];

// ── Foreign matter options ──
const foreignOptions: ChipOption[] = [
    { value: 'lt1', labelEn: '< 1%', labelHi: '< 1%' },
    { value: '1-2', labelEn: '1–2%', labelHi: '1–2%' },
    { value: 'gt2', labelEn: '> 2%', labelHi: '> 2%' },
];

interface SellCropStep3Props {
    language: 'en' | 'hi';
    onBack: () => void;
    onNext: () => void;
}

export function SellCropStep3({ language, onBack, onNext }: SellCropStep3Props) {
    const [freshness, setFreshness] = useState('fresh');
    const [freshnessSlider, setFreshnessSlider] = useState(50);
    const [produceQuality, setProduceQuality] = useState('medium');
    const [foreignMatter, setForeignMatter] = useState('lt1');
    const [comments, setComments] = useState('');

    const t = {
        pageTitle: language === 'en' ? 'Sell Crop' : 'फसल बेचें',
        pageSubtitle:
            language === 'en'
                ? 'List your produce, set quantity, quality, and get offers from buyers.'
                : 'अपनी फसल सूचीबद्ध करें, मात्रा, गुणवत्ता तय करें और खरीदारों से ऑफर पाएं।',
        panelHeading: language === 'en' ? 'Step 3: Set Quality' : 'चरण 3: गुणवत्ता तय करें',
        panelSub: language === 'en' ? 'Describe the quality of your produce.' : 'अपनी फसल की गुणवत्ता बताएं।',
        commentsLabel: language === 'en' ? 'Additional Comments' : 'अतिरिक्त टिप्पणी',
        optional: language === 'en' ? '(Optional)' : '(वैकल्पिक)',
        commentsPlaceholder:
            language === 'en'
                ? 'Well-sorted tomatoes, no bruising, uniform size and color.'
                : 'अच्छी तरह छाँटे गए टमाटर, बिना दाग, एक समान आकार और रंग।',
        produceHelper:
            language === 'en'
                ? 'Uniform shape and size, bright red color with minimal blemishes.'
                : 'एक समान आकार और आकार, हल्के दाग के साथ चमकीला लाल रंग।',
        foreignHelper: language === 'en' ? 'Very Clean (< 1% debris).' : 'बहुत साफ (< 1% मलबा)।',
        back: language === 'en' ? '← Back' : '← वापस',
        next: language === 'en' ? 'Next →' : 'आगे →',
    };

    return (
        <div
            className="at-page-wrap"
            style={{
                paddingTop: 64,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                minHeight: 'calc(100vh - 72px)',
            }}
        >
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="at-page-header"
                style={{ paddingLeft: 80, paddingTop: 32, paddingBottom: 20 }}
            >
                <h1
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: 7,
                        textShadow: '0 1px 8px rgba(255,255,255,0.80)',
                    }}
                >
                    {t.pageTitle}
                </h1>
                <p style={{ fontSize: 15, color: '#555', textShadow: '0 1px 6px rgba(255,255,255,0.55)' }}>
                    {t.pageSubtitle}
                </p>
            </motion.div>

            {/* 860px column */}
            <div className="at-sell-container" style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 40px' }}>
                {/* Stepper */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <SellCropStepper currentStep={3} language={language} />
                </motion.div>

                {/* ── Main Glass Panel ── */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{
                        background: 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1.5px solid rgba(255,255,255,0.50)',
                        borderRadius: 24,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                        padding: '36px 40px',
                        marginBottom: 22,
                    }}
                >
                    {/* Panel heading */}
                    <div style={{ marginBottom: 20 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>
                            {t.panelHeading}
                        </h2>
                        <p style={{ fontSize: 14, color: '#666' }}>{t.panelSub}</p>
                    </div>

                    {/* Selected crop sub-card */}
                    <SelectedCropCard
                        cropEmoji="🍅"
                        cropNameEn="Tomato"
                        cropNameHi="टमाटर"
                        quantity={2000}
                        unit={language === 'en' ? 'Kg' : 'किलोग्राम'}
                        language={language}
                        photoUrl="https://images.unsplash.com/photo-1592924625601-63601e1bca95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzJTIwcmVhbGlzdGljJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ1MDY4NTR8MA&ixlib=rb-4.1.0&q=80&w=400"
                    />

                    {/* ── Quality Sections ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 22 }}>

                        {/* Section 1: Freshness Level */}
                        <QualitySection icon="💧" titleEn="Freshness Level" titleHi="ताज़गी स्तर" language={language}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                                {/* Slider */}
                                <div style={{ flex: 1, minWidth: 160 }}>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={freshnessSlider}
                                        onChange={e => {
                                            const v = parseInt(e.target.value);
                                            setFreshnessSlider(v);
                                            if (v < 35) setFreshness('moderate');
                                            else if (v < 70) setFreshness('fresh');
                                            else setFreshness('very-fresh');
                                        }}
                                        style={{
                                            width: '100%',
                                            accentColor: '#2D6A2F',
                                            cursor: 'pointer',
                                            height: 4,
                                        }}
                                    />
                                </div>
                                {/* Chips */}
                                <ChipGroup
                                    options={freshnessOptions}
                                    selected={freshness}
                                    onSelect={v => {
                                        setFreshness(v);
                                        setFreshnessSlider(v === 'moderate' ? 20 : v === 'fresh' ? 50 : 85);
                                    }}
                                    language={language}
                                />
                            </div>
                        </QualitySection>

                        {/* Section 2: Produce Quality */}
                        <QualitySection icon="🍅" titleEn="Produce Quality" titleHi="उत्पाद गुणवत्ता" language={language}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                                <span style={{ fontSize: 14, color: '#888', minWidth: 36 }}>
                                    {language === 'en' ? 'Low' : 'कम'}
                                </span>
                                <ChipGroup
                                    options={produceOptions}
                                    selected={produceQuality}
                                    onSelect={setProduceQuality}
                                    language={language}
                                />
                            </div>
                            <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 6 }}>
                                {t.produceHelper}
                            </p>
                        </QualitySection>

                        {/* Section 3: Foreign Matter */}
                        <QualitySection icon="🌿" titleEn="Foreign Matter" titleHi="बाहरी पदार्थ" language={language}>
                            <ChipGroup
                                options={foreignOptions}
                                selected={foreignMatter}
                                onSelect={setForeignMatter}
                                language={language}
                            />
                            <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 10 }}>
                                {t.foreignHelper}
                            </p>
                        </QualitySection>
                    </div>

                    {/* ── Additional Comments ── */}
                    <div>
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 14,
                                color: '#555',
                                fontWeight: 500,
                                marginBottom: 10,
                            }}
                        >
                            {t.commentsLabel}
                            <span style={{ color: '#AAA', fontWeight: 400 }}>{t.optional}</span>
                        </label>
                        <textarea
                            value={comments}
                            onChange={e => setComments(e.target.value)}
                            placeholder={t.commentsPlaceholder}
                            rows={4}
                            style={{
                                width: '100%',
                                height: 90,
                                borderRadius: 10,
                                border: '1.5px solid rgba(0,0,0,0.10)',
                                background: 'rgba(255,255,255,0.75)',
                                padding: '12px 14px',
                                fontSize: 13,
                                color: '#333',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                </motion.div>

                {/* Navigation */}
                <div className="at-sell-nav-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <NavButtons onBack={onBack} onNext={onNext} backLabel={t.back} nextLabel={t.next} />
                </div>
            </div>
        </div>
    );
}