import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
    Search,
    ChevronDown,
    MapPin,
    Truck,
    Check,
    X,
    Phone,
    MessageCircle,
    Clock,
    Package,
    Navigation2,
} from 'lucide-react';


const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface MyOrdersProps {
    language: 'en' | 'hi';
    onBack?: () => void;
    onMarkAsPaid?: () => void;
    onTrackOrder?: () => void;
}

interface ProgressStep {
    id: string;
    labelEn: string;
    labelHi: string;
    completed: boolean;
    current: boolean;
    timestamp?: string;
}

interface OrderData {
    id: string;
    cropName: string;
    cropNameHi: string;
    quantity: string;
    price: string;
    status: 'in-transit' | 'packed' | 'completed' | 'cancelled';
    statusLabel: string;
    statusLabelHi: string;
    statusColor: string;
    statusBg: string;
    orderedDate: string;
    buyerName: string;
    buyerLocation: string;
    buyerDistance: string;
    transportInfo?: string;
    transportDistance?: string;
    estimatedDelivery?: string;
    cropImage: string;
    progressSteps: ProgressStep[];
    actionLabel: string;
    actionLabelHi: string;
    secondaryAction?: string;
    secondaryActionHi?: string;
}

const ORDERS: OrderData[] = [
    {
        id: '1',
        cropName: 'Wheat',
        cropNameHi: 'गेहूँ',
        quantity: '10 Quintals',
        price: '₹23,000',
        status: 'in-transit',
        statusLabel: 'In Transit',
        statusLabelHi: 'ट्रांज़िट में',
        statusColor: '#c2410c',
        statusBg: 'rgba(234,88,12,0.10)',
        orderedDate: '22 Apr 2024',
        buyerName: 'Raj Traders',
        buyerLocation: 'Indore',
        buyerDistance: '12 km',
        transportInfo: 'MP14 · 1234',
        transportDistance: '12 km away',
        estimatedDelivery: 'Today, 4:30 PM',
        cropImage:
            'https://images.unsplash.com/photo-1713272195609-93ca51c20062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWlucyUyMGNsb3NlJTIwdXAlMjBnb2xkZW58ZW58MXx8fHwxNzc0NTA0MjEzfDA&ixlib=rb-4.1.0&q=80&w=400',
        progressSteps: [
            { id: 'harvested', labelEn: 'Harvested', labelHi: 'काटा गया', completed: true, current: false, timestamp: '22 Apr, 9:00 AM' },
            { id: 'packed', labelEn: 'Packed', labelHi: 'पैक किया', completed: true, current: false, timestamp: '22 Apr, 2:00 PM' },
            { id: 'transit', labelEn: 'In Transit', labelHi: 'ट्रांज़िट में', completed: true, current: true, timestamp: '23 Apr, 10:00 AM' },
            { id: 'delivered', labelEn: 'Delivered', labelHi: 'डिलीवर', completed: false, current: false, timestamp: 'Est. Today 4:30 PM' },
        ],
        actionLabel: 'Track Order',
        actionLabelHi: 'ऑर्डर ट्रैक करें',
        secondaryAction: 'Contact',
        secondaryActionHi: 'संपर्क करें',
    },
    {
        id: '2',
        cropName: 'Tomato',
        cropNameHi: 'टमाटर',
        quantity: '50 Quintals',
        price: '₹75,000',
        status: 'packed',
        statusLabel: 'Packed',
        statusLabelHi: 'पैक किया',
        statusColor: '#15803d',
        statusBg: 'rgba(21,128,61,0.10)',
        orderedDate: '20 Apr 2024',
        buyerName: 'Goyal Fresh',
        buyerLocation: 'Ujjain',
        buyerDistance: '35 km',
        transportInfo: 'Finding transporter',
        transportDistance: '---',
        estimatedDelivery: 'Tomorrow, 10:00 AM',
        cropImage:
            'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0b21hdG9lcyUyMGZyZXNoJTIwcHJvZHVjZXxlbnwxfHx8fDE3NzQ1MDQyMTN8MA&ixlib=rb-4.1.0&q=80&w=400',
        progressSteps: [
            { id: 'harvested', labelEn: 'Harvested', labelHi: 'काटा गया', completed: true, current: false, timestamp: '20 Apr, 8:00 AM' },
            { id: 'packed', labelEn: 'Packed', labelHi: 'पैक किया', completed: true, current: true, timestamp: '20 Apr, 3:00 PM' },
            { id: 'transit', labelEn: 'In Transit', labelHi: 'ट्रांज़िट में', completed: false, current: false },
            { id: 'delivered', labelEn: 'Delivered', labelHi: 'डिलीवर', completed: false, current: false },
        ],
        actionLabel: 'Mark as Paid',
        actionLabelHi: 'भुगतान चिह्नित करें',
        secondaryAction: 'Contact',
        secondaryActionHi: 'संपर्क करें',
    },
];

/* ── Status dot indicator ── */
function StatusDot({ color }: { color: string }) {
    return (
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
            <motion.span
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.4 }}
            />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
        </span>
    );
}

/* ── Clean Progress Tracker ── */
function ProgressTracker({
    steps,
    language,
    compact = false,
}: {
    steps: ProgressStep[];
    language: 'en' | 'hi';
    compact?: boolean;
}) {
    const n = steps.length;
    const trackLeftPct = 100 / (n * 2);
    // Count segments to fill: a segment between step[i] and step[i+1] is filled if step[i] is completed
    const filledSegments = steps.slice(0, n - 1).filter(s => s.completed).length;
    const totalSegments = n - 1;
    const fillWidthPct = totalSegments > 0 ? (filledSegments / totalSegments) * (100 - 2 * trackLeftPct) : 0;

    const circleSize = compact ? 26 : 30;
    const topPad = compact ? 10 : 18;
    const trackTop = topPad + circleSize / 2;

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                paddingTop: topPad,
                paddingBottom: compact ? 4 : 8,
            }}
        >
            {/* Background track */}
            <div
                style={{
                    position: 'absolute',
                    top: trackTop,
                    left: `${trackLeftPct}%`,
                    right: `${trackLeftPct}%`,
                    height: 2,
                    background: '#e4e4e7',
                    borderRadius: 99,
                    zIndex: 0,
                }}
            />

            {/* Progress fill */}
            {filledSegments > 0 && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
                    style={{
                        position: 'absolute',
                        top: trackTop,
                        left: `${trackLeftPct}%`,
                        width: `${fillWidthPct}%`,
                        height: 2,
                        background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
                        borderRadius: 99,
                        zIndex: 0,
                        transformOrigin: 'left center',
                    }}
                />
            )}

            {steps.map((step, i) => (
                <div
                    key={step.id}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* Circle */}
                    <div style={{ position: 'relative', marginBottom: compact ? 7 : 9 }}>
                        {/* Subtle pulse for current active step */}
                        {step.current && (
                            <motion.div
                                animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute',
                                    inset: -5,
                                    borderRadius: '50%',
                                    background: '#22c55e',
                                    zIndex: 0,
                                }}
                            />
                        )}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.35, delay: i * 0.06, ease }}
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                width: circleSize,
                                height: circleSize,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: step.completed
                                    ? '#22c55e'
                                    : step.current
                                        ? 'rgba(34,197,94,0.09)'
                                        : '#fafafa',
                                border: step.completed
                                    ? 'none'
                                    : step.current
                                        ? '2px solid #22c55e'
                                        : '1.5px solid #d4d4d8',
                                boxShadow: step.completed
                                    ? '0 2px 8px rgba(34,197,94,0.28)'
                                    : 'none',
                                transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
                            }}
                        >
                            {step.completed && (
                                <Check
                                    style={{
                                        width: compact ? 11 : 13,
                                        height: compact ? 11 : 13,
                                        color: '#ffffff',
                                        strokeWidth: 3,
                                    }}
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Label */}
                    <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06 + 0.15 }}
                        style={{
                            display: 'block',
                            fontSize: compact ? 11 : 12,
                            fontFamily: font,
                            fontWeight: step.current ? 700 : 500,
                            color: step.completed
                                ? '#166534'
                                : step.current
                                    ? '#15803d'
                                    : '#a1a1aa',
                            textAlign: 'center',
                            lineHeight: 1.3,
                            letterSpacing: '0.01em',
                        }}
                    >
                        {language === 'en' ? step.labelEn : step.labelHi}
                    </motion.span>
                </div>
            ))}
        </div>
    );
}

/* ── Track Order Modal ── */
function TrackOrderModal({
    order,
    language,
    onClose,
}: {
    order: OrderData;
    language: 'en' | 'hi';
    onClose: () => void;
}) {
    const t = {
        title: language === 'en' ? 'Track Order' : 'ऑर्डर ट्रैक करें',
        estimatedDelivery: language === 'en' ? 'Estimated Delivery' : 'अनुमानित डिलीवरी',
        trackingHistory: language === 'en' ? 'Tracking History' : 'ट्रैकिंग इतिहास',
        transport: language === 'en' ? 'Transport' : 'परिवहन',
        buyerLocation: language === 'en' ? 'Buyer Location' : 'खरीदार स्थान',
        contactDriver: language === 'en' ? 'Contact Driver' : 'ड्राइवर से संपर्क करें',
        contactBuyer: language === 'en' ? 'Contact Buyer' : 'खरीदार से संपर्क करें',
        message: language === 'en' ? 'Message' : 'संदेश',
        close: language === 'en' ? 'Close' : 'बंद करें',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                background: 'rgba(0,0,0,0.45)',
                padding: 24,
            }}
        >
            <motion.div
                initial={{ scale: 0.93, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 660,
                    maxHeight: '88vh',
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: 24,
                    boxShadow: '0 20px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.7)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Colored top accent bar */}
                <div
                    style={{
                        height: 3,
                        background:
                            order.status === 'in-transit'
                                ? 'linear-gradient(90deg, #ea580c, #f97316)'
                                : 'linear-gradient(90deg, #22c55e, #4ade80)',
                        flexShrink: 0,
                    }}
                />

                {/* Header */}
                <div
                    style={{
                        padding: '22px 28px 20px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontFamily: serif,
                                fontSize: 24,
                                fontWeight: 800,
                                color: '#052e16',
                                margin: '0 0 3px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {t.title}
                        </h2>
                        <p style={{ fontFamily: font, fontSize: 13, color: '#6b7280', margin: 0 }}>
                            Order #{order.id} · {order.cropName} · {order.quantity}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.08, background: 'rgba(0,0,0,0.07)' }}
                        whileTap={{ scale: 0.94 }}
                        onClick={onClose}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(0,0,0,0.05)',
                            color: '#4b5563',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                        }}
                    >
                        <X size={18} />
                    </motion.button>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
                    {/* Order summary row */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.3, ease }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: 20,
                            background: 'rgba(248,250,252,0.8)',
                            borderRadius: 16,
                            border: '1px solid rgba(0,0,0,0.05)',
                            marginBottom: 16,
                        }}
                    >
                        <img
                            src={order.cropImage}
                            alt={order.cropName}
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 12,
                                objectFit: 'cover',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: serif, fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                                {language === 'en' ? order.cropName : order.cropNameHi}
                            </p>
                            <p style={{ fontFamily: font, fontSize: 14, color: '#6b7280', margin: 0 }}>
                                {order.quantity} · {order.price}
                            </p>
                        </div>
                        {/* Status badge */}
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 14px',
                                borderRadius: 999,
                                background: order.statusBg,
                                color: order.statusColor,
                                fontSize: 13,
                                fontWeight: 700,
                                fontFamily: font,
                                flexShrink: 0,
                            }}
                        >
                            <StatusDot color={order.statusColor} />
                            {language === 'en' ? order.statusLabel : order.statusLabelHi}
                        </span>
                    </motion.div>

                    {/* Estimated delivery */}
                    {order.estimatedDelivery && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.3, ease }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '14px 18px',
                                background: 'rgba(34,197,94,0.07)',
                                borderRadius: 12,
                                border: '1px solid rgba(34,197,94,0.18)',
                                marginBottom: 16,
                            }}
                        >
                            <Clock size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                            <div>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px', fontFamily: font }}>{t.estimatedDelivery}</p>
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#166534', margin: 0, fontFamily: font }}>{order.estimatedDelivery}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Tracking history */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16, duration: 0.3, ease }}
                        style={{
                            background: 'rgba(248,250,252,0.8)',
                            borderRadius: 16,
                            padding: '20px 20px 16px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            marginBottom: 16,
                        }}
                    >
                        <p style={{ fontFamily: serif, fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{t.trackingHistory}</p>

                        <ProgressTracker steps={order.progressSteps} language={language} />

                        {/* Timestamps */}
                        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {order.progressSteps.filter(s => s.timestamp).map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.06, duration: 0.25 }}
                                    style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                                >
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: step.completed ? '#22c55e' : '#d4d4d8',
                                            flexShrink: 0,
                                            marginTop: 5,
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 14, fontWeight: step.current ? 700 : 600, color: step.completed ? '#166534' : '#9ca3af', margin: '0 0 1px', fontFamily: font }}>
                                            {language === 'en' ? step.labelEn : step.labelHi}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontFamily: font }}>{step.timestamp}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Location & Transport */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.3, ease }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 12,
                            marginBottom: 20,
                        }}
                    >
                        <div
                            style={{
                                background: 'rgba(248,250,252,0.8)',
                                borderRadius: 14,
                                padding: '16px 18px',
                                border: '1px solid rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                                <MapPin size={15} style={{ color: '#6b7280', flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: '#6b7280', fontFamily: font }}>{t.buyerLocation}</span>
                            </div>
                            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 2px', fontFamily: font }}>{order.buyerName}</p>
                            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, fontFamily: font }}>{order.buyerLocation} · {order.buyerDistance}</p>
                        </div>

                        {order.transportInfo && (
                            <div
                                style={{
                                    background: 'rgba(248,250,252,0.8)',
                                    borderRadius: 14,
                                    padding: '16px 18px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                                    <Truck size={15} style={{ color: '#6b7280', flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#6b7280', fontFamily: font }}>{t.transport}</span>
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 2px', fontFamily: font }}>{order.transportInfo}</p>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, fontFamily: font }}>{order.transportDistance}</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.28, ease }}
                        style={{ display: 'flex', gap: 10 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(34,197,94,0.28)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                flex: 1,
                                padding: '13px 20px',
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                border: 'none',
                                borderRadius: 12,
                                color: '#ffffff',
                                fontSize: 14,
                                fontWeight: 700,
                                fontFamily: font,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                boxShadow: '0 3px 12px rgba(34,197,94,0.22)',
                                transition: 'box-shadow 0.25s',
                            }}
                        >
                            <Phone size={16} />
                            {order.status === 'in-transit' ? t.contactDriver : t.contactBuyer}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, background: 'rgba(0,0,0,0.07)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '13px 20px',
                                background: 'rgba(0,0,0,0.04)',
                                border: '1px solid rgba(0,0,0,0.09)',
                                borderRadius: 12,
                                color: '#374151',
                                fontSize: 14,
                                fontWeight: 700,
                                fontFamily: font,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                transition: 'background 0.2s',
                            }}
                        >
                            <MessageCircle size={16} />
                            {t.message}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ── Premium Order Card ── */
function OrderCard({
    order,
    language,
    index,
    onMarkAsPaid,
}: {
    order: OrderData;
    language: 'en' | 'hi';
    index: number;
    onMarkAsPaid?: () => void;
}) {
    const [showModal, setShowModal] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    const t = {
        orderedOn: language === 'en' ? 'Ordered' : 'ऑर्डर',
        trackOrder: language === 'en' ? 'Track Order' : 'ट्रैक करें',
        markPaid: language === 'en' ? 'Mark as Paid' : 'भुगतान करें',
        contact: language === 'en' ? 'Contact' : 'संपर्क',
    };

    const isTrack = order.actionLabel === 'Track Order';

    return (
        <>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.09, ease }}
                whileHover={{
                    scale: 1.012,
                    y: -3,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.10)',
                    transition: { duration: 0.22, ease },
                }}
                style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.70)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    cursor: 'default',
                }}
            >
                {/* Thin left color accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 3,
                        bottom: 0,
                        background:
                            order.status === 'in-transit'
                                ? 'linear-gradient(180deg, #f97316, #ea580c)'
                                : order.status === 'packed'
                                    ? 'linear-gradient(180deg, #4ade80, #22c55e)'
                                    : 'linear-gradient(180deg, #a1a1aa, #71717a)',
                        borderRadius: '20px 0 0 20px',
                    }}
                />

                <div style={{ padding: '22px 24px 22px 28px' }}>
                    {/* Top Row: Image + Info + Price */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 4 }}>
                        {/* Crop thumbnail */}
                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.2, ease }}
                            style={{ flexShrink: 0 }}
                        >
                            <img
                                src={order.cropImage}
                                alt={order.cropName}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 12,
                                    objectFit: 'cover',
                                    boxShadow: '0 3px 12px rgba(0,0,0,0.12)',
                                    border: '2px solid rgba(255,255,255,0.9)',
                                    display: 'block',
                                }}
                            />
                        </motion.div>

                        {/* Crop info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
                                <span
                                    style={{
                                        fontFamily: serif,
                                        fontSize: 22,
                                        fontWeight: 800,
                                        color: '#111827',
                                        lineHeight: 1.2,
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {language === 'en' ? order.cropName : order.cropNameHi}
                                </span>
                                <span
                                    style={{
                                        fontFamily: font,
                                        fontSize: 14,
                                        color: '#9ca3af',
                                        fontWeight: 500,
                                    }}
                                >
                                    · {order.quantity}
                                </span>
                            </div>

                            {/* Status badge */}
                            <motion.span
                                animate={{
                                    opacity: [1, 0.85, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '5px 12px',
                                    borderRadius: 999,
                                    background: order.statusBg,
                                    color: order.statusColor,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    fontFamily: font,
                                    letterSpacing: '0.01em',
                                }}
                            >
                                <StatusDot color={order.statusColor} />
                                {language === 'en' ? order.statusLabel : order.statusLabelHi}
                            </motion.span>
                        </div>

                        {/* Price */}
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                            <span
                                style={{
                                    fontFamily: serif,
                                    fontSize: 24,
                                    fontWeight: 900,
                                    color: '#052e16',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1,
                                }}
                            >
                                {order.price}
                            </span>
                        </div>
                    </div>

                    {/* Progress Tracker */}
                    <ProgressTracker steps={order.progressSteps} language={language} compact />

                    {/* Bottom Row */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid rgba(0,0,0,0.05)',
                            paddingTop: 14,
                            marginTop: 4,
                            gap: 12,
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* Metadata */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: font, fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                                {t.orderedOn}: {order.orderedDate}
                            </span>

                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontFamily: font,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: '#374151',
                                }}
                            >
                                <span
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 6,
                                        background: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
                                        display: 'inline-block',
                                        flexShrink: 0,
                                    }}
                                />
                                {order.buyerName}
                            </span>

                            <motion.span
                                whileHover={{ scale: 1.04 }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    fontFamily: font,
                                    fontSize: 12,
                                    color: '#6b7280',
                                    padding: '4px 10px',
                                    background: 'rgba(0,0,0,0.03)',
                                    borderRadius: 8,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                }}
                            >
                                <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />
                                {order.buyerLocation}, {order.buyerDistance}
                            </motion.span>

                            {order.transportInfo && order.status === 'in-transit' && (
                                <motion.span
                                    animate={{ x: [0, 2, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 5,
                                        fontFamily: font,
                                        fontSize: 12,
                                        color: '#c2410c',
                                        fontWeight: 600,
                                        padding: '4px 10px',
                                        background: 'rgba(194,65,12,0.07)',
                                        borderRadius: 8,
                                    }}
                                >
                                    <Truck style={{ width: 12, height: 12, flexShrink: 0 }} />
                                    {order.transportDistance}
                                </motion.span>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            {order.secondaryAction && (
                                <motion.button
                                    whileHover={{ scale: 1.03, borderColor: '#052e16', color: '#052e16' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        background: 'transparent',
                                        color: '#374151',
                                        border: '1.5px solid #d1d5db',
                                        borderRadius: 10,
                                        padding: '8px 16px',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        fontFamily: font,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <Phone style={{ width: 13, height: 13 }} />
                                    {language === 'en' ? order.secondaryAction : order.secondaryActionHi}
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{
                                    scale: 1.04,
                                    boxShadow: '0 6px 20px rgba(22,101,52,0.30)',
                                }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    if (isTrack) setShowModal(true);
                                    else onMarkAsPaid?.();
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: 10,
                                    padding: '9px 18px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    fontFamily: font,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    boxShadow: '0 3px 12px rgba(22,101,52,0.22)',
                                    transition: 'box-shadow 0.25s',
                                }}
                            >
                                {isTrack ? <Navigation2 style={{ width: 13, height: 13 }} /> : <Package style={{ width: 13, height: 13 }} />}
                                {language === 'en' ? order.actionLabel : order.actionLabelHi}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <TrackOrderModal order={order} language={language} onClose={() => setShowModal(false)} />
                )}
            </AnimatePresence>
        </>
    );
}

/* ── Main Screen ── */
export function MyOrdersPremium({ language, onMarkAsPaid }: MyOrdersProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed' | 'cancelled'>('in-progress');

    const t = {
        title: language === 'en' ? 'My Orders' : 'मेरे ऑर्डर',
        subtitle:
            language === 'en'
                ? 'Track your produce from farm to delivery.'
                : 'खेत से डिलीवरी तक अपनी उपज को ट्रैक करें।',
        all: language === 'en' ? 'All' : 'सभी',
        inProgress: language === 'en' ? 'In Progress' : 'प्रगति में',
        completed: language === 'en' ? 'Completed' : 'पूर्ण',
        cancelled: language === 'en' ? 'Cancelled' : 'रद्द',
        sortBy: language === 'en' ? 'Latest' : 'नवीनतम',
    };

    const tabs = [
        { id: 'all' as const, label: t.all },
        { id: 'in-progress' as const, label: t.inProgress },
        { id: 'completed' as const, label: t.completed },
        { id: 'cancelled' as const, label: t.cancelled },
    ];

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                paddingTop: 88,
                paddingBottom: 48,
                paddingLeft: 40,
                paddingRight: 40,
            }}
        >
            {/* Soft ambient background */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -1,
                    background: `
            radial-gradient(ellipse at 15% 25%, rgba(74,222,128,0.05) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 75%, rgba(209,250,229,0.07) 0%, transparent 55%)
          `,
                    pointerEvents: 'none',
                }}
            />

            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                style={{ paddingLeft: 40, marginBottom: 28 }}
            >
                <h1
                    style={{
                        fontFamily: serif,
                        fontSize: 36,
                        fontWeight: 900,
                        color: '#052e16',
                        margin: '0 0 6px',
                        letterSpacing: '-0.025em',
                    }}
                >
                    {t.title}
                </h1>
                <p
                    style={{
                        fontFamily: font,
                        fontSize: 15,
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: 1.6,
                    }}
                >
                    {t.subtitle}
                </p>
            </motion.div>

            {/* Filter bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.07, ease }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 24,
                }}
            >
                <div
                    style={{
                        width: 880,
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.65)',
                        borderRadius: 14,
                        padding: '10px 20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Tab pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {tabs.map(tab => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: activeTab === tab.id ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'transparent',
                                    color: activeTab === tab.id ? '#ffffff' : '#6b7280',
                                    border: 'none',
                                    borderRadius: 9,
                                    padding: '7px 18px',
                                    fontSize: 14,
                                    fontWeight: activeTab === tab.id ? 700 : 600,
                                    fontFamily: font,
                                    cursor: 'pointer',
                                    transition: 'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                                    boxShadow: activeTab === tab.id ? '0 3px 10px rgba(34,197,94,0.28)' : 'none',
                                }}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Sort + search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <motion.button
                            whileHover={{ scale: 1.02, background: 'rgba(0,0,0,0.04)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'rgba(0,0,0,0.025)',
                                border: '1px solid rgba(0,0,0,0.07)',
                                borderRadius: 9,
                                padding: '7px 14px',
                                fontSize: 13,
                                color: '#6b7280',
                                fontFamily: font,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {t.sortBy}
                            <ChevronDown style={{ width: 14, height: 14 }} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.04, background: 'rgba(0,0,0,0.04)' }}
                            whileTap={{ scale: 0.96 }}
                            style={{
                                background: 'rgba(0,0,0,0.025)',
                                border: '1px solid rgba(0,0,0,0.07)',
                                borderRadius: 9,
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            <Search style={{ width: 16, height: 16, color: '#6b7280' }} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Order cards */}
            <div
                style={{
                    maxWidth: 880,
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}
            >
                {ORDERS.map((order, i) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        language={language}
                        index={i}
                        onMarkAsPaid={onMarkAsPaid}
                    />
                ))}
            </div>
        </div>
    );
}
