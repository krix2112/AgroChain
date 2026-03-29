import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Wheat, HelpCircle, Menu, X, Phone, ArrowRight, CheckCircle, MessageSquare, Truck, Package, Globe, IndianRupee, Smartphone, Users, Leaf } from 'lucide-react';
import farmBg from 'figma:asset/6ebba757bfe7e3c4f266787e46a11ed807fa8781.png';
import { 
  WheatIcon, 
  FarmerIcon, 
  TraderIcon, 
  TransporterIcon, 
  SuccessCheckIcon,
  GlobeIcon,
  MoneyIcon,
  HandshakeIcon 
} from './CropIcons';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

/* ── Real Count-Up Hook ── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return { count, start: () => setHasStarted(true) };
}

/* ── Section fade-in wrapper ── */
function FadeIn({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated Stats Counter with Glow ── */
function AnimatedStat({ 
  value, 
  label, 
  delay = 0 
}: { 
  value: string; 
  label: string; 
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  
  // Extract number from value string
  const numMatch = value.match(/[\d,]+/);
  const numericValue = numMatch ? parseInt(numMatch[0].replace(/,/g, '')) : 0;
  const prefix = value.split(numMatch?.[0] || '')[0];
  const suffix = value.split(numMatch?.[0] || '')[1] || '';
  
  const { count, start } = useCountUp(numericValue, 2000);
  
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(start, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, start, delay]);
  
  const formattedCount = count.toLocaleString('en-IN');
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      style={{
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            inset: -20,
            background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
        <p
          style={{
            fontFamily: serif,
            fontSize: 48,
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          {prefix}{formattedCount}{suffix}
        </p>
      </div>
      <p
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.70)',
          margin: 0,
          fontWeight: 500,
          fontFamily: font,
        }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export function AgroChainLandingPremium({ onLogin, onRegister }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeRole, setActiveRole] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── HEADER ── */
  const Header = (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled 
          ? 'rgba(255,255,255,0.95)' 
          : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: scrolled 
          ? '0 4px 24px rgba(0,0,0,0.08)' 
          : '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: font,
        borderBottom: '1px solid rgba(20,83,45,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 48px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="at-landing-header-inner"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5,46,22,0.25)',
            }}
          >
            <Wheat style={{ width: 22, height: 22, color: '#ffffff' }} />
          </div>
          <span
            style={{
              fontFamily: serif,
              fontSize: 24,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            AgroChain
          </span>
        </motion.div>

        {/* Desktop nav buttons */}
        <div className="at-landing-nav-btns" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.button
            whileHover={{ 
              scale: 1.02,
              background: 'rgba(5,46,22,0.05)',
              borderColor: '#052e16',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            style={{
              padding: '11px 26px',
              border: '2px solid #14532d',
              borderRadius: 999,
              background: 'rgba(0,0,0,0)',
              color: '#14532d',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: font,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 32px rgba(5,46,22,0.35), 0 0 20px rgba(74,222,128,0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegister}
            style={{
              padding: '11px 26px',
              border: 'none',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: font,
              boxShadow: '0 4px 16px rgba(5,46,22,0.30)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Register
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="at-landing-hamburger"
          onClick={() => setMobileMenuOpen(v => !v)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            color: '#052e16',
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              background: '#ffffff',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              padding: mobileMenuOpen ? '20px 28px 24px' : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              fontFamily: font,
            }}
          >
            <button
              onClick={() => { setMobileMenuOpen(false); onLogin(); }}
              style={{
                width: '100%',
                padding: '14px 0',
                border: '2px solid #14532d',
                borderRadius: 999,
                background: 'transparent',
                color: '#14532d',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: font,
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onRegister(); }}
              style={{
                width: '100%',
                padding: '14px 0',
                border: 'none',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: font,
              }}
            >
              Register
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );

  /* ── HERO SECTION ── */
  const Hero = (
    <section
      className="at-landing-hero"
      style={{
        minHeight: '100vh',
        paddingTop: 72,
        fontFamily: font,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
      }}
    >
      {/* Animated gradient mesh background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(74,222,128,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(209,250,229,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(5,46,22,0.03) 0%, transparent 60%)
          `,
          animation: 'gradient-shift 12s ease infinite',
        }}
      />

      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 48px',
          minHeight: 'calc(100vh - 72px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
        className="at-landing-hero-grid"
      >
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 15,
              color: '#6b7280',
              fontStyle: 'italic',
              marginBottom: 20,
              fontFamily: font,
              fontWeight: 500,
            }}
          >
            Kisan ka digital bazaar
          </motion.p>

          {/* Headline with staggered reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: serif,
              fontSize: 'clamp(38px, 4vw, 56px)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #052e16 0%, #14532d 70%, #166534 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.15,
              marginBottom: 24,
              maxWidth: 560,
            }}
          >
            India's trusted platform for farm-to-buyer trade.
          </motion.h1>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontSize: 17,
              color: '#4b5563',
              maxWidth: 480,
              lineHeight: 1.8,
              marginBottom: 40,
              fontFamily: font,
            }}
          >
            AgroChain connects farmers directly with verified buyers. List your
            crops, get the best price, and track delivery — all in one place.
          </motion.p>

          {/* CTA Buttons with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="at-landing-cta-row"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(5,46,22,0.35), 0 0 30px rgba(74,222,128,0.2)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onRegister}
              style={{
                padding: '16px 34px',
                background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: font,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 6px 24px rgba(5,46,22,0.28)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Start Selling</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.03,
                color: '#ffffff',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                // Set intended role for trader
                localStorage.setItem('agrochain_intended_role', 'trader');
                localStorage.setItem('agrochain_user', JSON.stringify({
                  name: 'Harshita Ramesh',
                  phone: '+91 98765 43210',
                  role: 'trader',
                  walletAddress: '0xABCD1234567890'
                }));
                localStorage.setItem('agrochain_token', 'demo_trader_token');
                onLogin();
              }}
              style={{
                padding: '16px 34px',
                background: 'rgba(255,255,255,0.9)',
                color: '#14532d',
                border: '2px solid #14532d',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: font,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              Find Crops
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="at-landing-trust"
            style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}
          >
            {['Free to join', 'OTP-based login', 'Hindi & English'].map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                style={{
                  fontSize: 14,
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontWeight: 600,
                  fontFamily: font,
                }}
              >
                <CheckCircle size={16} style={{ color: '#4ade80' }} />
                {t}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT: Glassmorphism floating card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background farm image with blur */}
          <div
            style={{
              position: 'absolute',
              inset: -40,
              borderRadius: 32,
              overflow: 'hidden',
              boxShadow: '0 20px 80px rgba(0,0,0,0.15)',
            }}
          >
            <img
              src={farmBg}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(4px)',
                transform: 'scale(1.1)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(5,46,22,0.75) 0%, rgba(20,83,45,0.55) 100%)',
              }}
            />
          </div>

          {/* Glassmorphism stats card with floating animation */}
          <motion.div
            animate={{ 
              y: [0, -12, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 420,
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 28,
              padding: '40px 44px',
              boxShadow: '0 20px 80px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {/* Icon with pulse */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
              }}
            >
              <WheatIcon size={64} />
            </motion.div>

            {/* Main stat with glow */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120%',
                  height: '120%',
                  background: 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, transparent 60%)',
                  filter: 'blur(25px)',
                  pointerEvents: 'none',
                }}
              />
              <p
                style={{
                  textAlign: 'center',
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0,
                  fontFamily: serif,
                  textShadow: '0 4px 16px rgba(0,0,0,0.40)',
                  letterSpacing: '-0.02em',
                  position: 'relative',
                }}
              >
                50,000+ farmers
              </p>
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: 'rgba(255,255,255,0.85)',
                marginTop: 8,
                marginBottom: 0,
                fontFamily: font,
                fontWeight: 500,
              }}
            >
              already trading on AgroChain
            </p>

            {/* Divider with gradient */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                margin: '28px 0',
              }}
            />

            {/* Stats rows with icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { Icon: IndianRupee, text: '₹2.4 Cr+ in trades completed' },
                { Icon: Users, text: '1,200+ verified buyers' },
                { Icon: Globe, text: 'Available in Hindi & English' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 + i * 0.15 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'rgba(74,222,128,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(74,222,128,0.25)',
                    }}
                  >
                    <s.Icon style={{ width: 18, height: 18, color: '#4ade80' }} />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: '#ffffff',
                      fontFamily: font,
                      fontWeight: 600,
                      textShadow: '0 2px 8px rgba(0,0,0,0.30)',
                    }}
                  >
                    {s.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile stats card (shown below hero on mobile) */}
      <div className="at-landing-mobile-stats" style={{ display: 'none' }}>
        {/* Will be shown via CSS media queries */}
      </div>
    </section>
  );

  /* ── FEATURES SECTION ── */
  const features = [
    {
      Icon: Wheat,
      iconBg: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
      title: 'List Your Harvest',
      body: 'Upload your crop details, set your price, and go live in under 3 minutes.',
      gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    },
    {
      Icon: MessageSquare,
      iconBg: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      title: 'Receive Buyer Offers',
      body: 'Verified buyers contact you directly. Compare offers and negotiate the best deal.',
      gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    },
    {
      Icon: Truck,
      iconBg: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
      title: 'Track Every Delivery',
      body: 'Real-time delivery updates from your farm to the buyer\'s warehouse.',
      gradient: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
    },
  ];

  const Features = (
    <section
      style={{
        background: '#ffffff',
        padding: '100px 48px',
        fontFamily: font,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="at-landing-section"
    >
      {/* Subtle background texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(5,46,22,0.03) 1px, transparent 0)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <FadeIn>
        <p
          style={{
            textAlign: 'center',
            fontSize: 15,
            color: '#6b7280',
            fontStyle: 'italic',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          Simple. Fast. Trusted.
        </p>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: serif,
            fontSize: 'clamp(32px, 3vw, 44px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 64,
          }}
        >
          Everything a farmer needs
        </h2>
      </FadeIn>

      <div
        className="at-landing-features-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {features.map((f, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <motion.div
              whileHover={{ 
                y: -10,
                rotateY: 2,
                rotateX: -2,
                boxShadow: '0 20px 60px rgba(5,46,22,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                border: '2px solid #d1fae5',
                borderRadius: 24,
                padding: '44px 36px',
                height: '100%',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Gradient glow on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: -2,
                  background: f.gradient,
                  borderRadius: 24,
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  zIndex: -1,
                  filter: 'blur(8px)',
                }}
              />

              {/* Icon with bounce animation */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
                style={{ 
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: f.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22,
                  boxShadow: '0 8px 24px rgba(34,197,94,0.25)',
                  flexShrink: 0,
                }}
              >
                <f.Icon style={{ width: 30, height: 30, color: '#ffffff', strokeWidth: 2 }} />
              </motion.div>

              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#052e16',
                  marginBottom: 14,
                  lineHeight: 1.3,
                }}
              >
                {f.title}
              </h3>
              <p 
                style={{ 
                  fontSize: 15, 
                  color: '#6b7280', 
                  lineHeight: 1.7, 
                  margin: 0,
                  fontFamily: font,
                }}
              >
                {f.body}
              </p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );

  /* ── ROLE SELECTION SECTION ── */
  const roles = [
    {
      RoleIcon: FarmerIcon,
      title: 'Farmer',
      body: 'List your crops and get fair prices directly from traders — no middlemen cutting your earnings.',
      cta: 'Join as Farmer',
      accent: '#4ade80',
    },
    {
      RoleIcon: TraderIcon,
      title: 'Trader',
      body: 'Browse verified crop listings and negotiate directly with farmers at transparent prices.',
      cta: 'Join as Trader',
      accent: '#34d399',
    },
    {
      RoleIcon: TransporterIcon,
      title: 'Transporter',
      body: 'Find delivery jobs near you and get paid automatically on successful completion.',
      cta: 'Join as Transporter',
      accent: '#6ee7b7',
    },
  ];

  const RoleCards = (
    <section
      style={{
        background: 'linear-gradient(160deg, #052e16 0%, #0a3d23 40%, #14532d 100%)',
        padding: '100px 48px',
        fontFamily: font,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="at-landing-section"
    >
      {/* Animated gradient mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(74,222,128,0.08) 0%, rgba(0,0,0,0) 55%)',
        }}
      />

      <FadeIn>
        <p
          style={{
            textAlign: 'center',
            fontSize: 15,
            color: 'rgba(255,255,255,0.50)',
            fontStyle: 'italic',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          Who are you?
        </p>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: serif,
            fontSize: 'clamp(32px, 3vw, 44px)',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: 16,
            textShadow: '0 4px 20px rgba(0,0,0,0.30)',
          }}
        >
          Choose your role
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: 'rgba(255,255,255,0.60)',
            maxWidth: 560,
            margin: '0 auto 72px',
            lineHeight: 1.7,
          }}
        >
          AgroChain connects three types of users. Sign up for the role that fits you.
        </p>
      </FadeIn>

      <div
        className="at-landing-features-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {roles.map((role, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <motion.div
              whileHover={{
                y: -12,
                scale: 1.02,
              }}
              onHoverStart={() => setActiveRole(i)}
              onHoverEnd={() => setActiveRole(null)}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: activeRole === i 
                  ? `2px solid ${role.accent}` 
                  : '2px solid rgba(255,255,255,0.15)',
                borderRadius: 28,
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: activeRole === i
                  ? `0 24px 80px rgba(0,0,0,0.50), 0 0 40px ${role.accent}40`
                  : '0 8px 32px rgba(0,0,0,0.25)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Top accent glow */}
              <motion.div
                animate={activeRole === i ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${role.accent}, transparent)`,
                  transformOrigin: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />

              {/* Icon with pulse */}
              <motion.div
                animate={activeRole === i ? { 
                  scale: [1, 1.12, 1],
                  y: [0, -6, 0],
                } : {}}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{ 
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))',
                }}
              >
                <role.RoleIcon size={72} />
              </motion.div>

              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}
              >
                {role.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.75,
                  marginBottom: 32,
                  flex: 1,
                }}
              >
                {role.body}
              </p>

              <motion.button
                whileHover={{ 
                  background: role.accent,
                  color: '#052e16',
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={onRegister}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.15)',
                  border: `2px solid ${role.accent}60`,
                  color: role.accent,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: font,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  alignSelf: 'stretch',
                }}
              >
                <span>{role.cta}</span>
                <motion.div
                  animate={activeRole === i ? { x: [0, 6, 0] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </motion.button>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );

  /* ── HOW IT WORKS: Animated Timeline ── */
  const steps = [
    {
      num: '1',
      title: 'Register',
      body: 'Sign up with your mobile number. OTP verified in seconds.',
      StepIcon: Smartphone,
    },
    {
      num: '2',
      title: 'List Your Crop',
      body: 'Add your harvest details — crop type, quantity, price, quality.',
      StepIcon: Wheat,
    },
    {
      num: '3',
      title: 'Get Paid',
      body: 'Receive offers from buyers, confirm, and track delivery to payment.',
      StepIcon: IndianRupee,
    },
  ];

  const HowItWorks = (
    <section
      style={{
        background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)',
        padding: '100px 48px',
        fontFamily: font,
        position: 'relative',
      }}
      className="at-landing-section"
    >
      <FadeIn>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: serif,
            fontSize: 'clamp(32px, 3vw, 44px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 72,
          }}
        >
          How AgroChain works
        </h2>
      </FadeIn>

      <div
        className="at-landing-steps"
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Animated connecting line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 48,
            left: '16.66%',
            right: '16.66%',
            height: 3,
            background: 'linear-gradient(90deg, #4ade80, #34d399, #6ee7b7)',
            transformOrigin: 'left',
            borderRadius: 99,
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 48,
          }}
        >
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Circular badge with icon */}
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 12px 40px rgba(74,222,128,0.35)',
                  }}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    boxShadow: '0 8px 28px rgba(5,46,22,0.30)',
                    fontFamily: serif,
                    position: 'relative',
                    zIndex: 2,
                    cursor: 'pointer',
                    border: '3px solid rgba(255,255,255,0.2)',
                    gap: 2,
                  }}
                >
                  <s.StepIcon style={{ width: 30, height: 30, color: '#ffffff', strokeWidth: 2 }} />
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{s.num}</span>
                </motion.div>

                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#052e16',
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: '#6b7280',
                    lineHeight: 1.7,
                    maxWidth: 240,
                    margin: 0,
                  }}
                >
                  {s.body}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── STATS SECTION with Count-Up ── */
  const stats = [
    { value: '50,000+', label: 'Registered Farmers' },
    { value: '₹2.4 Cr+', label: 'Trades Completed' },
    { value: '1,200+', label: 'Verified Buyers' },
  ];

  const SocialProof = (
    <section
      style={{
        background: 'linear-gradient(135deg, #052e16 0%, #0a3d23 50%, #14532d 100%)',
        padding: '80px 48px',
        fontFamily: font,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="at-landing-section"
    >
      {/* Animated background gradient mesh */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(74,222,128,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(110,231,183,0.08) 0%, transparent 50%)
          `,
          backgroundSize: '200% 100%',
        }}
      />

      <div
        className="at-landing-stats-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 64,
          maxWidth: 1000,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {stats.map((s, i) => (
          <AnimatedStat
            key={i}
            value={s.value}
            label={s.label}
            delay={i * 0.2}
          />
        ))}
      </div>
    </section>
  );

  /* ── PREMIUM FOOTER ── */
  const Footer = (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        padding: '48px 48px 0',
        fontFamily: font,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="at-landing-footer"
    >
      {/* Subtle top gradient line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #4ade80, transparent)',
        }}
      />

      {/* Main row */}
      <div
        className="at-landing-footer-main"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          paddingBottom: 32,
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(74,222,128,0.3)',
            }}
          >
            <Wheat style={{ width: 20, height: 20, color: '#052e16' }} />
          </div>
          <span
            style={{
              fontFamily: serif,
              fontSize: 22,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            AgroChain
          </span>
        </motion.div>

        {/* Center: help buttons */}
        <div
          className="at-landing-footer-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 8px 32px rgba(74,222,128,0.3)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 26px',
              background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: font,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Phone size={16} />
            Need help? Call Support
          </motion.button>
          <motion.button
            whileHover={{
              background: 'rgba(255,255,255,0.12)',
              borderColor: '#4ade80',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 26px',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.85)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: font,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Help / FAQ
          </motion.button>
        </div>

        {/* Language toggle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'flex',
            gap: 8,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {['EN', 'हिंदी'].map((lang, i) => (
            <motion.button
              key={lang}
              whileHover={{ background: 'rgba(255,255,255,0.15)' }}
              style={{
                padding: '6px 14px',
                background: i === 0 ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: 'none',
                borderRadius: 999,
                color: 'rgba(255,255,255,0.85)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: font,
                transition: 'background 0.2s',
              }}
            >
              {lang}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '24px 0',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 13,
        }}
      >
        © 2024 AgroChain. All rights reserved.
      </div>
    </footer>
  );

  /* ── FLOATING HELP BUTTON ── */
  const HelpButton = (
    <motion.button
      whileHover={{ scale: 1.1, boxShadow: '0 8px 32px rgba(74,222,128,0.4)' }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -8, 0],
      }}
      transition={{ 
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 24px rgba(5,46,22,0.35)',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <HelpCircle size={28} />
    </motion.button>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: font,
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% { 
              background-position: 0% 50%;
            }
            50% { 
              background-position: 100% 50%;
            }
          }
          
          /* Mobile adjustments */
          @media (max-width: 768px) {
            .at-landing-hero-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
              padding: 40px 24px !important;
            }
            .at-landing-features-grid {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            .at-landing-steps {
              padding: 0 24px !important;
            }
            .at-landing-stats-row {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
            .at-landing-nav-btns {
              display: none !important;
            }
            .at-landing-hamburger {
              display: block !important;
            }
            .at-landing-mobile-stats {
              display: block !important;
              padding: 0 24px;
              margin-top: 40px;
            }
          }
        `}
      </style>

      {Header}
      {Hero}
      {Features}
      {RoleCards}
      {HowItWorks}
      {SocialProof}
      {Footer}
      {HelpButton}
    </div>
  );
}
