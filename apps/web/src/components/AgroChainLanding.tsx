import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Wheat, HelpCircle, ChevronRight, ArrowRight, Phone, Menu, X } from 'lucide-react';

const FARM_BG =
  'https://images.unsplash.com/photo-1639360811878-f77267beacd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdCUyMHN1bnJpc2UlMjBmYXJtfGVufDF8fHx8MTc3NDYxOTY2MXww&ixlib=rb-4.1.0&q=80&w=1080';

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

/* â”€â”€ Animated counter â”€â”€ */
function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: string; prefix?: string; suffix?: string }) {
  return (
    <span>
      {prefix}{target}{suffix}
    </span>
  );
}

/* â”€â”€ Section fade-in wrapper â”€â”€ */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AgroChainLanding({ onLogin, onRegister }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* â”€â”€ HEADER â”€â”€ */
  const Header = (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.10)' : '0 1px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s, background 0.3s',
        fontFamily: font,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 40px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="at-landing-header-inner"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#052e16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Wheat style={{ width: 20, height: 20, color: 'white' }} />
          </div>
          <span
            style={{
              fontFamily: serif,
              fontSize: 22,
              fontWeight: 800,
              color: '#052e16',
              letterSpacing: '-0.02em',
            }}
          >
            AgroChain
          </span>
        </div>

        {/* Desktop nav buttons */}
        <div className="at-landing-nav-btns" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            whileHover={{ background: 'rgba(5,46,22,0.06)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogin}
            style={{
              padding: '9px 22px',
              border: '1.5px solid #14532d',
              borderRadius: 99,
              background: 'rgba(0,0,0,0)',
              color: '#14532d',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: font,
              transition: 'background 0.2s',
            }}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ background: '#14532d' }}
            whileTap={{ scale: 0.97 }}
            onClick={onRegister}
            style={{
              padding: '9px 22px',
              border: 'none',
              borderRadius: 99,
              background: '#052e16',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: font,
              boxShadow: '0 2px 10px rgba(5,46,22,0.35)',
              transition: 'background 0.2s',
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
            padding: 4,
            color: '#052e16',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              background: 'white',
              borderTop: '1px solid rgba(0,0,0,0.07)',
              padding: mobileMenuOpen ? '16px 24px 20px' : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontFamily: font,
            }}
          >
            <button
              onClick={() => { setMobileMenuOpen(false); onLogin(); }}
              style={{
                width: '100%',
                padding: '12px 0',
                border: '1.5px solid #14532d',
                borderRadius: 99,
                background: 'transparent',
                color: '#14532d',
                fontSize: 15,
                fontWeight: 600,
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
                padding: '12px 0',
                border: 'none',
                borderRadius: 99,
                background: '#052e16',
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: font,
              }}
            >
              Register
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  /* â”€â”€ HERO â”€â”€ */
  const Hero = (
    <section
      className="at-landing-hero"
      style={{
        display: 'flex',
        minHeight: '100vh',
        paddingTop: 68,
        fontFamily: font,
      }}
    >
      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="at-landing-hero-left"
        style={{
          width: '50%',
          background: '#f0fdf4',
          padding: '72px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Subtle badge */}
        <p
          style={{
            fontSize: 14,
            color: '#6b7280',
            fontStyle: 'italic',
            marginBottom: 18,
            fontFamily: font,
          }}
        >
          Kisan ka digital bazaar
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: serif,
            fontSize: 'clamp(32px, 3.2vw, 48px)',
            fontWeight: 800,
            color: '#052e16',
            lineHeight: 1.18,
            marginBottom: 22,
            maxWidth: 480,
          }}
        >
          India's trusted platform for farm-to-buyer trade.
        </h1>

        {/* Body */}
        <p
          style={{
            fontSize: 15,
            color: '#6b7280',
            maxWidth: 400,
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          AgroChain connects farmers directly with verified buyers. List your
          crops, get the best price, and track delivery â€” all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="at-landing-cta-row" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
          <motion.button
            whileHover={{ boxShadow: '0 8px 28px rgba(5,46,22,0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onRegister}
            style={{
              padding: '14px 28px',
              background: '#14532d',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: font,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(5,46,22,0.30)',
              transition: 'box-shadow 0.2s',
            }}
          >
            ðŸŒ± Start Selling
          </motion.button>
          <motion.button
            whileHover={{ background: '#f0fdf4', borderColor: '#052e16' }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogin}
            style={{
              padding: '14px 28px',
              background: 'white',
              color: '#14532d',
              border: '1.5px solid #14532d',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: font,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            ðŸ›’ Find Crops
          </motion.button>
        </div>

        {/* Trust strip */}
        <div
          className="at-landing-trust"
          style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}
        >
          {['Free to join', 'OTP-based login', 'Hindi & English'].map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: 13,
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 15 }}>âœ…</span> {t}
            </span>
          ))}
        </div>

        {/* Mobile: stats card shown below CTA */}
        <div className="at-landing-mobile-stats" style={{ display: 'none', marginTop: 36 }}>
          <div
            style={{
              background: 'rgba(5,46,22,0.07)',
              border: '1px solid #d1fae5',
              borderRadius: 20,
              padding: '24px 28px',
            }}
          >
            <div style={{ textAlign: 'center', fontSize: 32, marginBottom: 10 }}>ðŸŒ¾</div>
            <p style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: '#052e16', marginBottom: 4 }}>
              50,000+ farmers
            </p>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#166534', marginBottom: 16 }}>
              already trading on AgroChain
            </p>
            <div style={{ height: 1, background: '#d1fae5', marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'âœ…  â‚¹2.4 Cr+ in trades completed',
                'âœ…  1,200+ verified buyers',
                'âœ…  Available in Hindi & English',
              ].map((s, i) => (
                <p key={i} style={{ margin: 0, fontSize: 13, color: '#052e16', fontWeight: 500 }}>
                  {s}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT */}
      <div
        className="at-landing-hero-right"
        style={{
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Farm photo background */}
        <img
          src={FARM_BG}
          alt="Farm field at sunrise"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.06)',
          }}
        />
        {/* Green overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(5,46,22,0.45) 0%, rgba(20,83,45,0.25) 100%)',
          }}
        />

        {/* Glassmorphism card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: 'easeOut' }}
            style={{
              width: '100%',
              maxWidth: 380,
              background: 'rgba(255,255,255,0.17)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.38)',
              borderRadius: 24,
              padding: '32px 36px',
              boxShadow: '0 8px 48px rgba(0,0,0,0.25)',
            }}
          >
            {/* Wheat emoji */}
            <div style={{ textAlign: 'center', fontSize: 44, marginBottom: 14 }}>ðŸŒ¾</div>

            {/* Main stat */}
            <p
              style={{
                textAlign: 'center',
                fontSize: 26,
                fontWeight: 800,
                color: 'white',
                margin: 0,
                fontFamily: serif,
                textShadow: '0 2px 10px rgba(0,0,0,0.30)',
              }}
            >
              50,000+ farmers
            </p>
            <p
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: 'rgba(255,255,255,0.82)',
                marginTop: 6,
                marginBottom: 0,
                fontFamily: font,
              }}
            >
              already trading on AgroChain
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.28)', margin: '20px 0' }} />

            {/* Stats rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'âœ…  â‚¹2.4 Cr+ in trades completed',
                'âœ…  1,200+ verified buyers',
                'âœ…  Available in Hindi & English',
              ].map((s, i) => (
                <p
                  key={i}
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: 'white',
                    fontFamily: font,
                    fontWeight: 500,
                    textShadow: '0 1px 6px rgba(0,0,0,0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {s}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  /* â”€â”€ FEATURES â”€â”€ */
  const features = [
    {
      icon: 'ðŸŒ¾',
      title: 'List Your Harvest',
      body: 'Upload your crop details, set your price, and go live in under 3 minutes.',
    },
    {
      icon: 'ðŸ’¬',
      title: 'Receive Buyer Offers',
      body: 'Verified buyers contact you directly. Compare offers and negotiate the best deal.',
    },
    {
      icon: 'ðŸšš',
      title: 'Track Every Delivery',
      body: 'Real-time delivery updates from your farm to the buyer\'s warehouse.',
    },
  ];

  const Features = (
    <section
      style={{
        background: 'white',
        padding: '88px 64px',
        fontFamily: font,
      }}
      className="at-landing-section"
    >
      <FadeIn>
        <p
          style={{
            textAlign: 'center',
            fontSize: 14,
            color: '#6b7280',
            fontStyle: 'italic',
            marginBottom: 10,
          }}
        >
          Simple. Fast. Trusted.
        </p>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: serif,
            fontSize: 'clamp(26px, 2.5vw, 36px)',
            fontWeight: 800,
            color: '#052e16',
            marginBottom: 52,
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
          gap: 24,
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {features.map((f, i) => (
          <FadeIn key={i} delay={i * 0.12}>
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(5,46,22,0.13)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #d1fae5',
                borderRadius: 20,
                padding: '36px 32px',
                height: '100%',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 18 }}>{f.icon}</div>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#052e16',
                  marginBottom: 12,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>
                {f.body}
              </p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );

  /* â”€â”€ HOW IT WORKS â”€â”€ */
  const steps = [
    {
      num: '1',
      title: 'Register',
      body: 'Sign up with your mobile number. OTP verified in seconds.',
    },
    {
      num: '2',
      title: 'List Your Crop',
      body: 'Add your harvest details â€” crop type, quantity, price, quality.',
    },
    {
      num: '3',
      title: 'Get Paid',
      body: 'Receive offers from buyers, confirm, and track delivery to payment.',
    },
  ];

  // â”€â”€ ROLE CARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const roles = [
    {
      emoji: 'ðŸŒ¾',
      title: 'Farmer',
      titleHi: 'à¤•à¤¿à¤¸à¤¾à¤¨',
      body: 'List your crops and get fair prices directly from traders â€” no middlemen cutting your earnings.',
      bodyHi: 'à¤…à¤ªà¤¨à¥€ à¤«à¤¸à¤² à¤²à¤¿à¤¸à¥à¤Ÿ à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°à¤¿à¤¯à¥‹à¤‚ à¤¸à¥‡ à¤¸à¥€à¤§à¥‡ à¤‰à¤šà¤¿à¤¤ à¤®à¥‚à¤²à¥à¤¯ à¤ªà¤¾à¤à¤‚à¥¤',
      cta: 'Join as Farmer â†’',
      ctaHi: 'à¤•à¤¿à¤¸à¤¾à¤¨ à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤œà¥à¤¡à¤¼à¥‡à¤‚ â†’',
      accent: '#4ade80',
    },
    {
      emoji: 'ðŸ¤',
      title: 'Trader',
      titleHi: 'à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°à¥€',
      body: 'Browse verified crop listings and negotiate directly with farmers at transparent prices.',
      bodyHi: 'à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤ à¤«à¤¸à¤² à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤¦à¥‡à¤–à¥‡à¤‚ à¤”à¤° à¤•à¤¿à¤¸à¤¾à¤¨à¥‹à¤‚ à¤¸à¥‡ à¤¸à¥€à¤§à¥‡ à¤¸à¥Œà¤¦à¤¾ à¤•à¤°à¥‡à¤‚à¥¤',
      cta: 'Join as Trader â†’',
      ctaHi: 'à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°à¥€ à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤œà¥à¤¡à¤¼à¥‡à¤‚ â†’',
      accent: '#34d399',
    },
    {
      emoji: 'ðŸš›',
      title: 'Transporter',
      titleHi: 'à¤Ÿà¥à¤°à¤¾à¤‚à¤¸à¤ªà¥‹à¤°à¥à¤Ÿà¤°',
      body: 'Find delivery jobs near you and get paid automatically on successful completion.',
      bodyHi: 'à¤…à¤ªà¤¨à¥‡ à¤¨à¤œà¤¦à¥€à¤•à¥€ à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€ à¤•à¤¾à¤® à¤–à¥‹à¤œà¥‡à¤‚ à¤”à¤° à¤¸à¤«à¤² à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€ à¤ªà¤° à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤ªà¤¾à¤à¤‚à¥¤',
      cta: 'Join as Transporter â†’',
      ctaHi: 'à¤Ÿà¥à¤°à¤¾à¤‚à¤¸à¤ªà¥‹à¤°à¥à¤Ÿà¤° à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤œà¥à¤¡à¤¼à¥‡à¤‚ â†’',
      accent: '#6ee7b7',
    },
  ];

  const RoleCards = (
    <section
      style={{
        background: 'linear-gradient(160deg, #052e16 0%, #0d3321 60%, #14532d 100%)',
        padding: '88px 64px',
        fontFamily: font,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="at-landing-section"
    >
      {/* Radial glow accents */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 20% 50%, rgba(74,222,128,0.07) 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 20%, rgba(134,239,172,0.06) 0%, transparent 45%)`,
      }} />

      <FadeIn>
        <p style={{
          textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.45)',
          fontStyle: 'italic', marginBottom: 10, fontFamily: font,
        }}>
          {language === 'hi' ? 'à¤†à¤ª à¤•à¥Œà¤¨ à¤¹à¥ˆà¤‚?' : 'Who are you?'}
        </p>
        <h2 style={{
          textAlign: 'center', fontFamily: serif,
          fontSize: 'clamp(26px, 2.5vw, 36px)', fontWeight: 800,
          color: 'white', marginBottom: 14,
          textShadow: '0 2px 12px rgba(0,0,0,0.30)',
        }}>
          {language === 'hi' ? 'à¤…à¤ªà¤¨à¤¾ à¤°à¥‹à¤² à¤šà¥à¤¨à¥‡à¤‚' : 'Choose your role'}
        </h2>
        <p style={{
          textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.55)',
          maxWidth: 500, margin: '0 auto 56px', lineHeight: 1.6,
        }}>
          {language === 'hi'
            ? 'AgroChain à¤ªà¤° à¤¤à¥€à¤¨ à¤ªà¥à¤°à¤•à¤¾à¤° à¤•à¥‡ à¤‰à¤ªà¤¯à¥‹à¤—à¤•à¤°à¥à¤¤à¤¾ à¤¹à¥ˆà¤‚à¥¤ à¤…à¤ªà¤¨à¥€ à¤­à¥‚à¤®à¤¿à¤•à¤¾ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤¸à¤¾à¤‡à¤¨ à¤…à¤ª à¤•à¤°à¥‡à¤‚à¥¤'
            : 'AgroChain connects three types of users. Sign up for the role that fits you.'}
        </p>
      </FadeIn>

      <div
        className="at-landing-features-grid"
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24, maxWidth: 1100, margin: '0 auto',
        }}
      >
        {roles.map((role, i) => (
          <FadeIn key={i} delay={i * 0.13}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: `0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px ${role.accent}40`,
                borderColor: `${role.accent}70`,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.14)',
                borderRadius: 24, padding: '40px 32px',
                display: 'flex', flexDirection: 'column', height: '100%',
                cursor: 'default', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Subtle top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 32, right: 32, height: 2,
                background: `linear-gradient(90deg, transparent, ${role.accent}60, transparent)`,
                borderRadius: 99,
              }} />

              <div style={{ fontSize: 46, marginBottom: 18 }}>{role.emoji}</div>
              <h3 style={{
                fontFamily: serif, fontSize: 22, fontWeight: 700,
                color: 'white', marginBottom: 12,
              }}>
                {language === 'hi' ? role.titleHi : role.title}
              </h3>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.60)',
                lineHeight: 1.68, marginBottom: 28, flex: 1,
              }}>
                {language === 'hi' ? role.bodyHi : role.body}
              </p>
              <motion.button
                whileHover={{ background: role.accent, color: '#052e16' }}
                whileTap={{ scale: 0.97 }}
                onClick={onRegister}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 22px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.12)',
                  border: `1.5px solid ${role.accent}50`,
                  color: role.accent, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: font,
                  transition: 'background 0.2s, color 0.2s',
                  alignSelf: 'flex-start',
                }}
              >
                {language === 'hi' ? role.ctaHi : role.cta}
              </motion.button>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );

  const HowItWorks = (
    <section
      style={{
        background: '#f9fafb',
        padding: '88px 64px',
        fontFamily: font,
      }}
      className="at-landing-section"
    >
      <FadeIn>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: serif,
            fontSize: 'clamp(26px, 2.5vw, 36px)',
            fontWeight: 800,
            color: '#052e16',
            marginBottom: 56,
          }}
        >
          How AgroChain works
        </h2>
      </FadeIn>

      <div
        className="at-landing-steps"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 0,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            className="at-landing-step-row"
            style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}
          >
            <FadeIn delay={i * 0.15} className="at-landing-step-item" style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {/* Badge */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#14532d',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                    marginBottom: 18,
                    boxShadow: '0 4px 16px rgba(5,46,22,0.32)',
                    fontFamily: serif,
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#052e16',
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: '#6b7280',
                    lineHeight: 1.65,
                    maxWidth: 220,
                    margin: '0 auto',
                  }}
                >
                  {s.body}
                </p>
              </div>
            </FadeIn>

            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <div
                className="at-landing-step-arrow"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: 14,
                  flexShrink: 0,
                  width: 40,
                }}
              >
                <ChevronRight size={28} color="#14532d" strokeWidth={2.5} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  /* â”€â”€ SOCIAL PROOF BANNER â”€â”€ */
  const stats = [
    { value: '50,000+', label: 'Registered Farmers' },
    { value: 'â‚¹2.4 Cr+', label: 'Trades Completed' },
    { value: '1,200+', label: 'Verified Buyers' },
  ];

  const SocialProof = (
    <section
      style={{
        background: '#052e16',
        padding: '56px 64px',
        fontFamily: font,
      }}
      className="at-landing-section"
    >
      <div
        className="at-landing-stats-row"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="at-landing-stat-block"
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <FadeIn delay={i * 0.1} className="at-landing-stat-content" style={{ textAlign: 'center', flex: 1 }}>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 800,
                  color: 'white',
                  margin: '0 0 6px',
                  letterSpacing: '-0.01em',
                }}
              >
                <AnimatedCounter target={s.value} />
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0, fontWeight: 400 }}>
                {s.label}
              </p>
            </FadeIn>

            {i < stats.length - 1 && (
              <div
                className="at-landing-stat-divider"
                style={{
                  width: 1,
                  height: 56,
                  background: 'rgba(255,255,255,0.18)',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );

  /* â”€â”€ FOOTER â”€â”€ */
  const Footer = (
    <footer
      style={{
        background: '#1a1a1a',
        padding: '36px 64px 0',
        fontFamily: font,
      }}
      className="at-landing-footer"
    >
      {/* Main row */}
      <div
        className="at-landing-footer-main"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          paddingBottom: 28,
        }}
      >
        {/* Logo (white) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wheat style={{ width: 18, height: 18, color: '#052e16' }} />
          </div>
          <span
            style={{
              fontFamily: serif,
              fontSize: 20,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            AgroChain
          </span>
        </div>

        {/* Center: help buttons */}
        <div className="at-landing-footer-center" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            whileHover={{ background: '#166534' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 22px',
              background: '#14532d',
              color: 'white',
              border: 'none',
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: font,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'background 0.2s',
            }}
          >
            <Phone size={14} />
            Need help? Call Support
          </motion.button>
          <motion.button
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 22px',
              background: 'rgba(0,0,0,0)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,0.35)',
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: font,
              transition: 'background 0.2s',
            }}
          >
            Help / FAQ
          </motion.button>
        </div>

        {/* Right: lang toggle + socials */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            EN &nbsp;|&nbsp; à¤¹à¤¿à¤‚à¤¦à¥€
          </span>
          {/* Social circles */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['f', 't', 'in'].map((s, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.60)',
                  fontFamily: font,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.10)',
          padding: '16px 0',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 4px' }}>
          Â© 2024 AgroChain. All rights reserved.
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: 0 }}>
          Built on Shardeum Blockchain Â· Hackcraft 3.0
        </p>
      </div>
    </footer>
  );

  /* â”€â”€ FLOATING HELP BUTTON â”€â”€ */
  const HelpBtn = (
    <motion.button
      whileHover={{ scale: 1.1, boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
      whileTap={{ scale: 0.93 }}
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 200,
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: '#1f2937',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.30)',
        color: 'white',
      }}
      title="Help"
    >
      <HelpCircle size={22} color="white" />
    </motion.button>
  );

  return (
    <div style={{ fontFamily: font, overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .at-landing-hero { flex-direction: column !important; }
          .at-landing-hero-left {
            width: 100% !important;
            padding: 48px 28px !important;
            min-height: unset !important;
          }
          .at-landing-hero-right { display: none !important; }
          .at-landing-mobile-stats { display: block !important; }
          .at-landing-features-grid { grid-template-columns: 1fr !important; }
          .at-landing-steps { flex-direction: column !important; align-items: center !important; gap: 32px !important; }
          .at-landing-step-row { flex-direction: column !important; align-items: center !important; width: 100% !important; }
          .at-landing-step-arrow { transform: rotate(90deg); padding-top: 0 !important; }
          .at-landing-stats-row { flex-direction: column !important; gap: 28px !important; }
          .at-landing-stat-divider { display: none !important; }
          .at-landing-section { padding: 56px 24px !important; }
          .at-landing-footer { padding: 32px 24px 0 !important; }
          .at-landing-footer-main { flex-direction: column !important; align-items: center !important; text-align: center; }
          .at-landing-footer-center { flex-direction: column !important; }
          .at-landing-nav-btns { display: flex; }
          .at-landing-hamburger { display: none !important; }
          .at-landing-header-inner { padding: 0 20px !important; }
          .at-landing-cta-row { flex-direction: column !important; }
          .at-landing-cta-row button { width: 100% !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .at-landing-nav-btns { display: none !important; }
          .at-landing-hamburger { display: flex !important; }
        }
        .at-landing-step-item { width: 100%; }
      `}</style>

      {Header}

      <main>
        {Hero}
        {Features}
        {RoleCards}
        {HowItWorks}
        {SocialProof}
      </main>

      {Footer}
      {HelpBtn}
    </div>
  );
}
