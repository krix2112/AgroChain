import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Wheat, Building2, Globe, Bell, HelpCircle, LogOut, MessageSquare, Truck, CheckCircle2, TrendingUp, AlertCircle, Star, MapPin } from 'lucide-react';

const FARMER_AVATAR =
    'https://images.unsplash.com/photo-1632923057240-b6775e4db748?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmYXJtZXIlMjBmYWNlJTIwcG9ydHJhaXQlMjBydXJhbCUyMG1hbnxlbnwxfHx8fDE3NzQ1MDU3NTZ8MA&ixlib=rb-4.1.0&q=80&w=200';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

interface ProfileNotificationsProps {
    language: 'en' | 'hi';
    onLogout?: () => void;
}

const PROFILE_STATS = [
    { value: '12', label: 'Listings', color: '#2D6A2F' },
    { value: '₹1.2L', label: 'Total Earned', color: '#2D6A2F' },
    { value: '4.8', label: 'Seller Rating', color: '#2D6A2F', showStar: true },
];

// FIX 2.1 — "View My Listings" inserted as 2nd item
const PROFILE_MENU = [
    { Icon: User, label: 'Edit Profile', color: '#1A1A1A' },
    { Icon: Wheat, label: 'View My Listings', color: '#1A1A1A' },
    { Icon: Building2, label: 'Bank Details', color: '#1A1A1A' },
    { Icon: Globe, label: 'Language: English', color: '#1A1A1A' },
    { Icon: Bell, label: 'Notification Settings', color: '#1A1A1A' },
    { Icon: HelpCircle, label: 'Help & FAQ', color: '#1A1A1A' },
    { Icon: LogOut, label: 'Logout', color: '#E53935', isLogout: true },
];

const NOTIFICATIONS = [
    {
        id: 1,
        Icon: MessageSquare,
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        title: 'New offer from Raj Traders',
        body: '₹2,400/qtl for your Wheat listing',
        time: '2 min ago',
        unread: true,
    },
    {
        id: 2,
        Icon: Truck,
        iconBg: '#FFF7ED',
        iconColor: '#F97316',
        title: 'Your order is In Transit',
        body: 'Wheat order #1042 is on the way',
        time: '1 hr ago',
        unread: true,
    },
    {
        id: 3,
        Icon: CheckCircle2,
        iconBg: '#F0FDF4',
        iconColor: '#22C55E',
        title: 'Payment Received',
        body: '₹23,000 received for Tomato order',
        time: 'Yesterday',
        unread: true,
    },
    {
        id: 4,
        Icon: TrendingUp,
        iconBg: '#F0FDF4',
        iconColor: '#16A34A',
        title: 'Wheat prices up today',
        body: 'Mandi price: ₹2,450/qtl in Mathura',
        time: '2 days ago',
        unread: false,
    },
    {
        id: 5,
        Icon: AlertCircle,
        iconBg: '#FFFBEB',
        iconColor: '#F59E0B',
        title: 'Listing expiring soon',
        body: 'Your Onion listing expires in 2 days',
        time: '3 days ago',
        unread: false,
    },
];

export function ProfileNotifications({ language, onLogout }: ProfileNotificationsProps) {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

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
                className="at-page-header"
                style={{ paddingLeft: 80, paddingTop: 32, paddingBottom: 20 }}
            >
                <h1
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: 6,
                        textShadow: '0 1px 8px rgba(255,255,255,0.80)',
                    }}
                >
                    My Profile
                </h1>
                <p style={{ fontSize: 15, color: '#555', textShadow: '0 1px 6px rgba(255,255,255,0.80)' }}>
                    Manage your account and stay updated.
                </p>
            </motion.div>

            {/* ── 1000px Main Panel ── */}
            <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ maxWidth: 1000, margin: '0 auto 40px', padding: '0 16px' }}
            >
                {/* FIX 2.4 — main panel opacity 0.72 → 0.82, blur → 24px */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1.5px solid rgba(255,255,255,0.55)',
                        borderRadius: 24,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                        padding: '36px 40px',
                        display: 'flex',
                        gap: 40,
                    }}
                >
                    {/* ── LEFT COLUMN 35% ── */}
                    <div style={{ width: '35%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Avatar */}
                        <img
                            src={FARMER_AVATAR}
                            alt="Ramesh Kumar"
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid #2D6A2F',
                                marginBottom: 14,
                            }}
                        />
                        {/* FIX 2.3 — profile name #1A1A1A bold 22px */}
                        <p style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', textAlign: 'center', margin: 0 }}>
                            Ramesh Kumar
                        </p>
                        {/* FIX 2.3 — location #555 (was #888) */}
                        <p style={{ fontSize: 14, color: '#555', textAlign: 'center', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <MapPin style={{ width: 13, height: 13, color: '#6b7280', flexShrink: 0 }} />
                            Mathura, Uttar Pradesh
                        </p>
                        <p style={{ fontSize: 13, color: '#2D6A2F', textAlign: 'center', marginTop: 4, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <Wheat style={{ width: 13, height: 13, flexShrink: 0 }} />
                            Wheat · Tomato · Onion
                        </p>
                        {/* Verified badge */}
                        <div
                            style={{
                                background: '#E8F5E9',
                                border: '1px solid #A5D6A7',
                                borderRadius: 20,
                                padding: '6px 14px',
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#2D6A2F',
                                marginBottom: 20,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <CheckCircle2 style={{ width: 14, height: 14 }} />
                            Verified Farmer
                        </div>

                        {/* FIX 2.4 — Stats boxes opacity 0.60 → 0.75 */}
                        <div style={{ display: 'flex', gap: 8, width: '100%', marginBottom: 20 }}>
                            {PROFILE_STATS.map((stat, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.75)',
                                        border: '1px solid rgba(0,0,0,0.07)',
                                        borderRadius: 12,
                                        padding: '14px 6px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {/* FIX 2.3 — stats values #1A1A1A bold 20px */}
                                    <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                                        {stat.value}{stat.showStar && <Star style={{ width: 14, height: 14, color: '#f59e0b', fill: '#f59e0b' }} />}
                                    </div>
                                    {/* FIX 2.3 — stats labels #666 (was #888) */}
                                    <div style={{ fontSize: 11, color: '#666', lineHeight: 1.3 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* FIX 2.1 — Profile Menu with "View My Listings" as 2nd item */}
                        <div style={{ width: '100%' }}>
                            {PROFILE_MENU.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={item.isLogout ? onLogout : undefined}
                                    onMouseEnter={() => setHoveredMenu(item.label)}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: i < PROFILE_MENU.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                        padding: '14px 8px',
                                        cursor: 'pointer',
                                        borderRadius: 8,
                                        background: hoveredMenu === item.label ? 'rgba(45,106,47,0.04)' : 'transparent',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* FIX 2.3 — menu items #1A1A1A, logout #E53935 */}
                                    <span style={{ fontSize: 15, color: item.color }}>
                                        <item.Icon />&nbsp;&nbsp;{item.label}
                                    </span>
                                    <span style={{ fontSize: 16, color: '#888' }}>›</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN 60% ── */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Notifications Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <span
                                        style={{
                                            background: '#2D6A2F',
                                            color: 'white',
                                            borderRadius: 20,
                                            padding: '3px 10px',
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#2D6A2F',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontFamily: font,
                                    }}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* FIX 2.2 + 2.4 — Notification Items: uniform white glass, NO colored tints */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {notifications.map(notif => (
                                <motion.div
                                    key={notif.id}
                                    layout
                                    style={{
                                        /* FIX 2.2 — all cards same base style */
                                        background: 'rgba(255,255,255,0.80)',
                                        borderRadius: 14,
                                        padding: '16px 18px',
                                        border: '1px solid rgba(0,0,0,0.07)',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                                        /* FIX 2.2 — unread: green left border | read: no left border */
                                        borderLeft: notif.unread ? '3px solid #2D6A2F' : '1px solid rgba(0,0,0,0.07)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                    }}
                                >
                                    {/* Icon circle */}
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: notif.unread ? '#E8F5E9' : '#F5F5F5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 18,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <notif.Icon color={notif.iconColor} />
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* FIX 2.3 — unread title: #1A1A1A bold | read title: #555 regular */}
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontWeight: notif.unread ? 700 : 400,
                                                color: notif.unread ? '#1A1A1A' : '#555',
                                                marginBottom: 3,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {notif.title}
                                        </div>
                                        {/* FIX 2.3 — body text #555 minimum */}
                                        <div style={{ fontSize: 13, color: '#555' }}>{notif.body}</div>
                                    </div>

                                    {/* Time + unread dot */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            gap: 6,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {/* FIX 2.3 — timestamp #888 minimum */}
                                        <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                                            {notif.time}
                                        </span>
                                        {/* FIX 2.2 — unread: green dot | read: grey dot #CCC */}
                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                background: notif.unread ? '#2D6A2F' : '#CCC',
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}