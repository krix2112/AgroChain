import { useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Star, TrendingUp, Package, Bell, CheckCircle, Truck, DollarSign, AlertCircle, ChevronRight } from 'lucide-react';

interface Notification {
    id: string;
    type: 'offer' | 'transit' | 'payment' | 'alert';
    title: string;
    subtitle: string;
    timestamp: string;
    read: boolean;
}

const NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'offer',
        title: 'New Offer Received',
        subtitle: 'Raj Traders offered ₹2,450/kg for your wheat listing',
        timestamp: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'transit',
        title: 'Order in Transit',
        subtitle: 'Your tomato order #1041 is on the way to buyer',
        timestamp: '5 hours ago',
        read: false,
    },
    {
        id: '3',
        type: 'payment',
        title: 'Payment Received',
        subtitle: '₹1,20,000 credited for wheat order #1042',
        timestamp: '1 day ago',
        read: true,
    },
    {
        id: '4',
        type: 'offer',
        title: 'Price Alert',
        subtitle: 'Wheat prices increased by 8% in your region',
        timestamp: '2 days ago',
        read: true,
    },
    {
        id: '5',
        type: 'alert',
        title: 'Document Verification',
        subtitle: 'Your APMC certificate needs renewal by 15th May',
        timestamp: '3 days ago',
        read: false,
    },
];

const NOTIFICATION_CONFIG = {
    offer: { color: '#16a34a', bgColor: '#dcfce7', icon: CheckCircle },
    transit: { color: '#f97316', bgColor: '#fed7aa', icon: Truck },
    payment: { color: '#F4A825', bgColor: '#fef3c7', icon: DollarSign },
    alert: { color: '#dc2626', bgColor: '#fee2e2', icon: AlertCircle },
};

interface Props {
    onBack?: () => void;
    onLogout?: () => void;
    language?: 'en' | 'hi';
}

export function FarmerProfileDashboard({ onBack, onLogout, language = 'en' }: Props) {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen relative" style={{ fontFamily: "'Inter', 'Noto Sans', sans-serif" }}>
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1681226298721-88cdb4096e5f?w=1920&q=80)',
                        filter: 'blur(12px) brightness(0.7)',
                    }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(31,77,58,0.85) 0%, rgba(31,77,58,0.75) 50%, rgba(244,168,37,0.25) 100%)' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Profile & Notifications</h1>
                            <p className="text-white/70 text-sm">Manage your account and stay updated</p>
                        </div>
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition border border-white/20"
                            >
                                ← Back
                            </button>
                        )}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Panel - Profile */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                            >
                                {/* Profile Image */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative">
                                        <div
                                            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg, #1F4D3A 0%, #16a34a 100%)' }}
                                        >
                                            RK
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#F4A825] rounded-full flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Ramesh Kumar</h2>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                                        <MapPin className="w-4 h-4" />
                                        <span>Mathura, Uttar Pradesh</span>
                                    </div>

                                    {/* Verified Badge */}
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                                        style={{ background: '#dcfce7', color: '#15803d', border: '1.5px solid #86efac' }}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Verified Farmer</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-200 my-6" />

                                {/* Crops */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Primary Crops</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Wheat', 'Rice', 'Tomato'].map((crop) => (
                                            <span
                                                key={crop}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                                style={{ background: '#f0fdf4', color: '#15803d' }}
                                            >
                                                {crop}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Listings */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-center border border-blue-200/50">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <Package className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">12</div>
                                        <div className="text-xs text-gray-600 mt-1">Listings</div>
                                    </div>

                                    {/* Earnings */}
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 text-center border border-amber-200/50">
                                        <div className="w-10 h-10 bg-[#F4A825] rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">₹2.4L</div>
                                        <div className="text-xs text-gray-600 mt-1">Earnings</div>
                                    </div>

                                    {/* Rating */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 text-center border border-green-200/50">
                                        <div className="w-10 h-10 bg-[#16a34a] rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <Star className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">4.8</div>
                                        <div className="text-xs text-gray-600 mt-1">Rating</div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-200 my-6" />

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Info</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            📱
                                        </div>
                                        <span>+91 98765 43210</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            📧
                                        </div>
                                        <span>ramesh.k@email.com</span>
                                    </div>
                                </div>

                                {/* Edit Profile Button */}
                                <button
                                    className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #1F4D3A 0%, #16a34a 100%)' }}
                                >
                                    Edit Profile
                                </button>
                            </motion.div>
                        </div>

                        {/* Right Panel - Notifications */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                            >
                                {/* Notifications Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#1F4D3A] to-[#16a34a] rounded-lg flex items-center justify-center">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                                            <p className="text-sm text-gray-500">You have {unreadCount} unread messages</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium text-[#1F4D3A] hover:text-[#16a34a] transition">
                                        Mark all as read
                                    </button>
                                </div>

                                {/* Notifications List */}
                                <div className="space-y-3">
                                    {notifications.map((notification, index) => {
                                        const config = NOTIFICATION_CONFIG[notification.type];
                                        const Icon = config.icon;

                                        return (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                onClick={() => markAsRead(notification.id)}
                                                className={`group relative p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${notification.read
                                                        ? 'bg-gray-50/50 border-gray-200'
                                                        : 'bg-white border-gray-200 hover:border-[#1F4D3A]/30'
                                                    }`}
                                                style={{
                                                    borderLeft: `4px solid ${config.color}`,
                                                }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                                        style={{ background: config.bgColor }}
                                                    >
                                                        <Icon className="w-6 h-6" style={{ color: config.color }} />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-1">
                                                            <h3 className={`font-semibold text-gray-900 ${notification.read ? 'font-medium' : 'font-bold'}`}>
                                                                {notification.title}
                                                            </h3>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                                                {notification.timestamp}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{notification.subtitle}</p>

                                                        {/* Unread indicator */}
                                                        {!notification.read && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                                                                <span className="text-xs font-medium" style={{ color: config.color }}>
                                                                    New
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Chevron */}
                                                    <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Load More */}
                                <button className="w-full mt-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">
                                    Load More Notifications
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}