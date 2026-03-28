import { useState } from 'react';
import { motion } from 'motion/react';
import { AgroChainLandingPremium } from './components/AgroChainLandingPremium';
import { AgroChainLogin } from './components/AgroChainLogin';
import { AgroChainRegister } from './components/AgroChainRegister';
import { AgroChainFarmerDashboard } from './components/AgroChainFarmerDashboard';
import { AgroChainCreateTrade } from './components/AgroChainCreateTrade';
import { AgroChainTradeDetail } from './components/AgroChainTradeDetail';
import { SellCropStep1 } from './components/SellCropStep1';
import { SellCropStep2 } from './components/SellCropStep2';
import { SellCropStep3 } from './components/SellCropStep3';
import { SellCropStep4 } from './components/SellCropStep4';
import { BuyerOffers } from './components/BuyerOffers';
import { BuyerDetail } from './components/BuyerDetail';
import { Marketplace } from './components/Marketplace';
import { MyOrdersPremium } from './components/MyOrdersPremium';
import { OrderTracking } from './components/OrderTracking';
import { Payment } from './components/Payment';
import { Success } from './components/Success';
import { ProfileNotifications } from './components/ProfileNotifications';
import { AgroChainMyTrades } from './components/AgroChainMyTrades';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageModal } from './components/LanguageModal';
import { MobileBottomNav, type BottomNavTab } from './components/MobileBottomNav';
import { PublicListingsMarketplace } from './components/PublicListingsMarketplace';
import { ListingCreate } from './components/ListingCreate';
import { OpenRequests } from './components/OpenRequests';
import { RequestCreate } from './components/RequestCreate';
import { TraderDashboardNew } from './components/TraderDashboardNew';
import { BrowseListings } from './components/BrowseListings';
import { TraderMyOrders } from './components/TraderMyOrders';
import { FarmerProfileDashboard } from './components/FarmerProfileDashboard';
import { TraderProfileDashboard } from './components/TraderProfileDashboard';

// Lush green rice paddy field at golden sunrise (provided asset)
import bgImage from 'figma:asset/02a2b30228942223a501a2a4cb871849072179dd.png';
// Force rebuild

type Screen =
    | 'landing'
    | 'login'
    | 'signup'
    | 'home'
    | 'my-trades'
    | 'trade-detail'
    | 'create-trade'
    | 'sell-step1'
    | 'sell-step2'
    | 'sell-step3'
    | 'sell-step4'
    | 'buyer-offers'
    | 'buyer-detail'
    | 'marketplace'
    | 'my-orders'
    | 'order-tracking'
    | 'payment'
    | 'success'
    | 'profile'
    | 'public-listings'
    | 'listing-create'
    | 'requests'
    | 'request-create'
    | 'trader-dashboard'
    | 'trader-listings'
    | 'trader-my-orders'
    | 'farmer-profile'
    | 'trader-profile';

const BREADCRUMBS: Record<Screen, string[]> = {
    'landing': [],
    'login': [],
    'signup': [],
    'home': ['Home'],
    'my-trades': ['Home', 'My Trades'],
    'trade-detail': ['Home', 'Trade Detail'],
    'create-trade': ['Home', 'List New Crop'],
    'sell-step1': ['Home', 'Sell Crop'],
    'sell-step2': ['Home', 'Sell Crop'],
    'sell-step3': ['Home', 'Sell Crop'],
    'sell-step4': ['Home', 'Sell Crop'],
    'buyer-offers': ['Home', 'Buyer Offers'],
    'buyer-detail': ['Home', 'Buyer Offers', 'Raj Traders'],
    'marketplace': ['Home', 'Marketplace'],
    'my-orders': ['Home', 'My Orders'],
    'order-tracking': ['Home', 'My Orders', 'Wheat Order #1042'],
    'payment': ['Home', 'My Orders', 'Payment'],
    'success': ['Home'],
    'profile': ['Home', 'Profile'],
    'public-listings': ['Home', 'Crop Marketplace'],
    'listing-create': ['Home', 'Crop Marketplace', 'List a Crop'],
    'requests': ['Home', 'Buyer Requests'],
    'request-create': ['Home', 'Buyer Requests', 'Post Request'],
    'trader-dashboard': ['Home', 'Trader Dashboard'],
    'trader-listings': ['Home', 'Trader Dashboard', 'Browse Listings'],
    'trader-my-orders': ['Home', 'Trader Dashboard', 'My Orders'],
    'farmer-profile': ['Home', 'Farmer Profile'],
    'trader-profile': ['Home', 'Trader Profile'],
};

// Map each screen → active bottom nav tab
const BOTTOM_NAV_TAB: Record<Screen, BottomNavTab | null> = {
    'landing': null,
    'login': null,
    'signup': null,
    'home': 'home',
    'my-trades': 'orders',
    'trade-detail': 'orders',
    'create-trade': 'sell',
    'sell-step1': 'sell',
    'sell-step2': 'sell',
    'sell-step3': 'sell',
    'sell-step4': 'sell',
    'buyer-offers': 'home',
    'buyer-detail': 'home',
    'marketplace': 'home',
    'my-orders': 'orders',
    'order-tracking': 'orders',
    'payment': 'orders',
    'success': 'home',
    'profile': 'profile',
    'public-listings': 'home',
    'listing-create': 'sell',
    'requests': 'home',
    'request-create': 'home',
    'trader-dashboard': 'home',
    'trader-listings': 'home',
    'trader-my-orders': 'orders',
    'farmer-profile': 'profile',
    'trader-profile': 'profile',
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
    const [activeTradeId, setActiveTradeId] = useState<string>('1042');

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLanguageModal(true);
        // Check if user role is 'trader' and navigate accordingly
        const userRaw = localStorage.getItem('agrochain_user');
        if (userRaw) {
            const user = JSON.parse(userRaw);
            if (user.role === 'trader') {
                setCurrentScreen('trader-dashboard');
                return;
            }
        }
        setCurrentScreen('home');
    };

    const handleLanguageSelect = (lang: 'en' | 'hi') => {
        setLanguage(lang);
        setShowLanguageModal(false);
    };

    const handleLanguageToggle = () => {
        setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === 0) setCurrentScreen('home');
        else if (index === 1) {
            if (currentScreen === 'buyer-detail') setCurrentScreen('buyer-offers');
            else if (currentScreen === 'order-tracking') setCurrentScreen('my-orders');
            else if (currentScreen === 'payment') setCurrentScreen('my-orders');
            else if (currentScreen === 'profile') setCurrentScreen('home');
            else if (currentScreen === 'trade-detail') setCurrentScreen('home');
            else if (currentScreen === 'my-trades') setCurrentScreen('home');
        }
    };

    const navigate = (screen: Screen) => {
        setCurrentScreen(screen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle bottom nav tab taps
    const handleBottomNavTap = (tab: BottomNavTab) => {
        switch (tab) {
            case 'home': navigate('home'); break;
            case 'sell': navigate('create-trade'); break;
            case 'orders': navigate('my-orders'); break;
            case 'profile': {
                // Route to appropriate profile based on user role
                const userRaw = localStorage.getItem('agrochain_user');
                if (userRaw) {
                    const user = JSON.parse(userRaw);
                    navigate(user.role === 'trader' ? 'trader-profile' : 'farmer-profile');
                } else {
                    navigate('farmer-profile');
                }
                break;
            }
        }
    };

    // Login / Sign Up screens — no navbar, no footer, no bottom nav
    if (!isLoggedIn) {
        if (currentScreen === 'landing') {
            return (
                <AgroChainLandingPremium
                    onLogin={() => setCurrentScreen('login')}
                    onRegister={() => setCurrentScreen('signup')}
                />
            );
        }
        if (currentScreen === 'signup') {
            return (
                <AgroChainRegister
                    onBack={() => setCurrentScreen('login')}
                    onSignUp={handleLogin}
                />
            );
        }
        return (
            <AgroChainLogin
                onLogin={handleLogin}
                onRegister={() => setCurrentScreen('signup')}
                onBack={() => setCurrentScreen('landing')}
            />
        );
    }

    const activeTab = BOTTOM_NAV_TAB[currentScreen];

    // Hide default navbar for trader screens (they have their own)
    const hideDefaultNavbar = currentScreen === 'trader-dashboard' || currentScreen === 'trader-listings' || currentScreen === 'trader-my-orders' || currentScreen === 'farmer-profile' || currentScreen === 'trader-profile';

    return (
        <div
            className="min-h-screen relative overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif" }}
        >
            {/* ── Fixed Background ─ */}
            {!hideDefaultNavbar && (
                <div className="fixed inset-0 z-0">
                    <motion.img
                        src={bgImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        draggable={false}
                        style={{
                            userSelect: 'none',
                            filter: 'blur(10px)',
                            transform: 'scale(1.02)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                    />
                    {/* Warm overlay — very light tint */}
                    <div className="absolute inset-0" style={{ background: 'rgba(255,252,235,0.15)' }} />
                </div>
            )}

            {/* ─ Navbar ── */}
            {!hideDefaultNavbar && (
                <Navbar
                    language={language}
                    onLanguageToggle={handleLanguageToggle}
                    breadcrumb={BREADCRUMBS[currentScreen]}
                    onBreadcrumbClick={handleBreadcrumbClick}
                    onProfileClick={() => {
                        // Route to appropriate profile based on user role
                        const userRaw = localStorage.getItem('agrochain_user');
                        if (userRaw) {
                            const user = JSON.parse(userRaw);
                            navigate(user.role === 'trader' ? 'trader-profile' : 'farmer-profile');
                        } else {
                            navigate('farmer-profile');
                        }
                    }}
                />
            )}

            {/* ── Page Content ── */}
            <div className="relative z-10 flex-1">
                {currentScreen === 'home' && (
                    <AgroChainFarmerDashboard
                        farmerName="Ramesh"
                        language={language}
                        onListCrop={() => navigate('create-trade')}
                        onViewTrade={(id) => { setActiveTradeId(id); navigate('trade-detail'); }}
                        onLogout={() => { setIsLoggedIn(false); setCurrentScreen('landing'); }}
                        onProfile={() => navigate('profile')}
                        onMyOrders={() => navigate('my-orders')}
                        onViewMyTrades={() => navigate('my-trades')}
                        onBrowseRequests={() => navigate('requests')}
                    />
                )}
                {currentScreen === 'create-trade' && (
                    <AgroChainCreateTrade
                        language={language}
                        onBack={() => navigate('home')}
                        onViewTrade={(id) => { setActiveTradeId(id); navigate('trade-detail'); }}
                        onBackToDash={() => navigate('home')}
                    />
                )}
                {currentScreen === 'trade-detail' && (
                    <AgroChainTradeDetail
                        tradeId={activeTradeId}
                        language={language}
                        onBack={() => navigate('home')}
                    />
                )}
                {currentScreen === 'sell-step1' && (
                    <SellCropStep1
                        language={language}
                        onBack={() => navigate('home')}
                        onNext={() => navigate('sell-step2')}
                    />
                )}
                {currentScreen === 'sell-step2' && (
                    <SellCropStep2
                        language={language}
                        onBack={() => navigate('sell-step1')}
                        onNext={() => navigate('sell-step3')}
                    />
                )}
                {currentScreen === 'sell-step3' && (
                    <SellCropStep3
                        language={language}
                        onBack={() => navigate('sell-step2')}
                        onNext={() => navigate('sell-step4')}
                    />
                )}
                {currentScreen === 'sell-step4' && (
                    <SellCropStep4
                        language={language}
                        onBack={() => navigate('sell-step3')}
                        onPost={() => navigate('success')}
                    />
                )}
                {currentScreen === 'buyer-offers' && (
                    <BuyerOffers
                        language={language}
                        onBack={() => navigate('home')}
                        onViewBuyer={() => navigate('buyer-detail')}
                    />
                )}
                {currentScreen === 'buyer-detail' && (
                    <BuyerDetail
                        language={language}
                        onAcceptOffer={() => navigate('success')}
                    />
                )}
                {currentScreen === 'marketplace' && (
                    <Marketplace
                        language={language}
                    />
                )}
                {currentScreen === 'my-orders' && (
                    <MyOrdersPremium
                        language={language}
                        onMarkAsPaid={() => navigate('payment')}
                        onTrackOrder={() => navigate('order-tracking')}
                    />
                )}
                {currentScreen === 'order-tracking' && (
                    <OrderTracking
                        language={language}
                        onBack={() => navigate('my-orders')}
                    />
                )}
                {currentScreen === 'payment' && (
                    <Payment
                        language={language}
                        onBack={() => navigate('my-orders')}
                    />
                )}
                {currentScreen === 'success' && (
                    <Success
                        language={language}
                        onViewListing={() => navigate('my-orders')}
                        onHome={() => navigate('home')}
                    />
                )}
                {currentScreen === 'profile' && (
                    <ProfileNotifications
                        language={language}
                        onLogout={() => {
                            setIsLoggedIn(false);
                            setCurrentScreen('login');
                        }}
                    />
                )}
                {currentScreen === 'my-trades' && (
                    <AgroChainMyTrades
                        language={language}
                        onViewTrade={(id) => { setActiveTradeId(id); navigate('trade-detail'); }}
                        onBack={() => navigate('home')}
                    />
                )}
                {currentScreen === 'public-listings' && (
                    <PublicListingsMarketplace
                        language={language}
                        onBack={() => navigate('home')}
                        onCreateListing={() => navigate('listing-create')}
                    />
                )}
                {currentScreen === 'listing-create' && (
                    <ListingCreate
                        language={language}
                        onBack={() => navigate('public-listings')}
                        onSuccess={() => navigate('public-listings')}
                    />
                )}
                {currentScreen === 'requests' && (
                    <OpenRequests
                        language={language}
                        onBack={() => navigate('home')}
                    />
                )}
                {currentScreen === 'request-create' && (
                    <RequestCreate
                        language={language}
                        onBack={() => navigate('requests')}
                        onSuccess={() => navigate('requests')}
                    />
                )}
                {currentScreen === 'trader-dashboard' && (
                    <TraderDashboardNew
                        onNavigateToListings={() => navigate('trader-listings')}
                        onNavigateToTradeDetail={(id) => { setActiveTradeId(id); navigate('trade-detail'); }}
                        onNavigateToRequests={() => navigate('requests')}
                        onNavigateToMyTrades={() => navigate('my-trades')}
                        onNavigateToMyOrders={() => navigate('trader-my-orders')}
                        onLogout={() => { setIsLoggedIn(false); setCurrentScreen('landing'); }}
                    />
                )}
                {currentScreen === 'trader-listings' && (
                    <BrowseListings
                        onBack={() => navigate('trader-dashboard')}
                        onStartTrade={(farmer, crop, price) => {
                            // Could pre-fill trade creation form with these values in the future
                            navigate('create-trade');
                        }}
                        onLogout={() => { setIsLoggedIn(false); setCurrentScreen('landing'); }}
                    />
                )}
                {currentScreen === 'trader-my-orders' && (
                    <TraderMyOrders
                        onBack={() => navigate('trader-dashboard')}
                        onViewDetails={(orderId) => {
                            setActiveTradeId(orderId);
                            navigate('trade-detail');
                        }}
                    />
                )}
                {currentScreen === 'farmer-profile' && (
                    <FarmerProfileDashboard
                        onBack={() => navigate('home')}
                        onLogout={() => { setIsLoggedIn(false); setCurrentScreen('landing'); }}
                    />
                )}
                {currentScreen === 'trader-profile' && (
                    <TraderProfileDashboard
                        onBack={() => navigate('trader-dashboard')}
                        onLogout={() => { setIsLoggedIn(false); setCurrentScreen('landing'); }}
                    />
                )}
            </div>

            {/* ── Footer (desktop only — hidden on mobile via CSS) ── */}
            <div className="relative z-10 at-footer">
                <Footer language={language} />
            </div>

            {/* ── Mobile Bottom Navigation ── */}
            {activeTab && (
                <MobileBottomNav
                    activeTab={activeTab}
                    onNavigate={handleBottomNavTap}
                    language={language}
                />
            )}

            {/* ── Language Modal (shown after first login) ── */}
            {showLanguageModal && (
                <LanguageModal onSelectLanguage={handleLanguageSelect} />
            )}
        </div>
    );
}