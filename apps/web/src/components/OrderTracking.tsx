import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, RefreshCw, Circle, Wheat, User, IndianRupee, Truck, CreditCard } from 'lucide-react';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

interface OrderTrackingProps {
    language: 'en' | 'hi';
    onBack?: () => void;
}

const STAGES = [
    {
        key: 'harvested',
        Icon: CheckCircle2,
        iconColor: '#22c55e',
        label: 'Harvested',
        status: 'done',
        date: 'Apr 20, 9:00 AM',
        dateColor: '#888',
    },
    {
        key: 'packed',
        Icon: CheckCircle2,
        iconColor: '#22c55e',
        label: 'Packed',
        status: 'done',
        date: 'Apr 21, 2:00 PM',
        dateColor: '#888',
    },
    {
        key: 'transit',
        Icon: RefreshCw,
        iconColor: '#FF9800',
        label: 'In Transit',
        status: 'current',
        date: 'Apr 22, 8:00 AM',
        dateColor: '#FF9800',
    },
    {
        key: 'delivered',
        Icon: Circle,
        iconColor: '#d1d5db',
        label: 'Delivered',
        status: 'pending',
        date: 'Expected Apr 24',
        dateColor: '#AAA',
    },
];

const SUMMARY_CARDS = [
    { Icon: Wheat, iconColor: '#22c55e', value: 'Wheat · 10 Qtl', label: 'Crop & Quantity' },
    { Icon: User, iconColor: '#6b7280', value: 'Raj Traders', label: 'Buyer · Delhi 12km' },
    { Icon: IndianRupee, iconColor: '#2D6A2F', value: '₹ 24,000', label: 'Total Value', valueColor: '#2D6A2F' },
];

export function OrderTracking({ language, onBack }: OrderTrackingProps) {
    return (
        <div
            className="at-page-wrap"
            style={{
                paddingTop: 64,
                fontFamily: font,
                minHeight: 'calc(100vh - 72px)',
            }}
        >
            {/* ── Page Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ paddingLeft: 80, paddingTop: 32, paddingBottom: 20 }}
            >
                <h1
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: 6,
                        textShadow: '0 2px 10px rgba(255,255,255,0.55)',
                    }}
                >
                    Track Order #1042
                </h1>
                <p style={{ fontSize: 15, color: '#555', textShadow: '0 1px 6px rgba(255,255,255,0.55)' }}>
                    Wheat · 10 Quintals · Raj Traders
                </p>
            </motion.div>

            {/* ── 960px Main Panel ── */}
            <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ maxWidth: 960, margin: '0 auto 40px', padding: '0 16px' }}
            >
                <div
                    style={{
                        background: 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1.5px solid rgba(255,255,255,0.50)',
                        borderRadius: 24,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                        padding: '36px 40px',
                    }}
                >
                    {/* ── TOP SUMMARY ROW ── */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
                        {SUMMARY_CARDS.map((card, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.60)',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    borderRadius: 14,
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: 'rgba(45,106,47,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 20,
                                        flexShrink: 0,
                                    }}
                                >
                                    <card.Icon color={card.iconColor} />
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: card.valueColor ?? '#1A1A1A',
                                            marginBottom: 3,
                                        }}
                                    >
                                        {card.value}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#888' }}>{card.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── PROGRESS TRACKER ── */}
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                            {STAGES.map((stage, index) => (
                                <div key={stage.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                    {/* Connecting line (left side) */}
                                    {index > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 24,
                                                left: '-50%',
                                                width: '100%',
                                                height: 3,
                                                background: STAGES[index - 1].status !== 'pending' ? '#2D6A2F' : '#DDD',
                                                borderStyle: stage.status === 'pending' ? 'dashed' : 'solid',
                                                zIndex: 0,
                                            }}
                                        />
                                    )}

                                    {/* Node */}
                                    <div
                                        style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                            background:
                                                stage.status === 'done'
                                                    ? '#2D6A2F'
                                                    : stage.status === 'current'
                                                        ? '#FF9800'
                                                        : '#DDD',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow:
                                                stage.status === 'current'
                                                    ? '0 0 0 4px rgba(255,152,0,0.20)'
                                                    : stage.status === 'done'
                                                        ? '0 0 0 4px rgba(45,106,47,0.15)'
                                                        : 'none',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <stage.Icon
                                            style={{
                                                width: 22,
                                                height: 22,
                                                color: stage.status === 'pending' ? '#9ca3af' : '#ffffff',
                                                strokeWidth: 2.5,
                                            }}
                                        />
                                    </div>

                                    {/* Label */}
                                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color:
                                                    stage.status === 'done'
                                                        ? '#2D6A2F'
                                                        : stage.status === 'current'
                                                            ? '#FF9800'
                                                            : '#AAA',
                                            }}
                                        >
                                            {stage.label}
                                        </div>
                                        {stage.status === 'current' && (
                                            <div style={{ fontSize: 11, color: '#FF9800', marginTop: 2 }}>(Current)</div>
                                        )}
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: stage.dateColor,
                                                marginTop: 4,
                                                fontWeight: stage.status === 'current' ? 700 : 400,
                                            }}
                                        >
                                            {stage.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── TWO COLUMN DETAIL ── */}
                    <div style={{ display: 'flex', gap: 20 }}>
                        {/* Transporter Info */}
                        <div
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.60)',
                                borderRadius: 16,
                                padding: '20px 24px',
                            }}
                        >
                            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>
                                Transporter Details
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <Truck style={{ width: 22, height: 22, color: '#6b7280', flexShrink: 0 }} />
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>MP14 AB 1234</span>
                            </div>
                            <p style={{ fontSize: 14, color: '#555', marginBottom: 14 }}>
                                Currently 12 km away
                            </p>
                            {/* Progress bar */}
                            <div
                                style={{
                                    height: 8,
                                    borderRadius: 4,
                                    background: 'rgba(0,0,0,0.08)',
                                    marginBottom: 16,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        width: '65%',
                                        background: '#2D6A2F',
                                        borderRadius: 4,
                                    }}
                                />
                            </div>
                            <button
                                style={{
                                    width: '100%',
                                    height: 48,
                                    background: 'transparent',
                                    color: '#2D6A2F',
                                    border: '1.5px solid #2D6A2F',
                                    borderRadius: 10,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: font,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                }}
                            >
                                <CheckCircle2 style={{ width: 15, height: 15 }} /> Call Driver
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.60)',
                                borderRadius: 16,
                                padding: '20px 24px',
                            }}
                        >
                            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>
                                Delivery Details
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                                <div>
                                    <div style={{ fontSize: 13, color: '#888', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <Wheat style={{ width: 13, height: 13 }} /> Delivery To:
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>
                                        Raj Traders, Delhi Mandi, Delhi
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, color: '#888', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <Circle style={{ width: 13, height: 13 }} /> Expected By:
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>April 24, 2024</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, color: '#888', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <CreditCard style={{ width: 13, height: 13 }} /> Payment Status:
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#FF9800' }}>Pending</div>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ boxShadow: '0 4px 18px rgba(45,106,47,0.40)' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    width: '100%',
                                    height: 48,
                                    background: '#2D6A2F',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: font,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                }}
                            >
                                <CheckCircle2 style={{ width: 18, height: 18 }} /> Mark as Delivered
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}