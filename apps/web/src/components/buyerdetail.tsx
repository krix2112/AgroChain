import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Wheat, Scale, Droplets, Calendar, MessageSquare, Phone, CheckCircle2, MapPin } from 'lucide-react';

const BUYER_AVATAR =
  'https://images.unsplash.com/photo-1657213565941-c805241062bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBidXNpbmVzc21hbiUyMHRyYWRlciUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDUwNTc0Nnww&ixlib=rb-4.1.0&q=80&w=400';

const REVIEWER1 =
  'https://images.unsplash.com/photo-1632923057240-b6775e4db748?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmYXJtZXIlMjBmYWNlJTIwcG9ydHJhaXQlMjBydXJhbCUyMG1hbnxlbnwxfHx8fDE3NzQ1MDU3NTZ8MA&ixlib=rb-4.1.0&q=80&w=100';

const REVIEWER2 =
  'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBmYXJtZXIlMjByZXZpZXdlciUyMHByb2ZpbGUlMjBwaG90b3xlbnwxfHx8fDE3NzQ1MDU3NTZ8MA&ixlib=rb-4.1.0&q=80&w=100';

interface BuyerDetailProps {
  language: 'en' | 'hi';
  onAcceptOffer?: () => void;
}

function StarRow({ count }: { count: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{
            width: 14,
            height: 14,
            fill: i < count ? '#F5A623' : 'none',
            color: i < count ? '#F5A623' : '#DDD',
          }}
        />
      ))}
    </span>
  );
}

const REQUIREMENTS = [
  { Icon: Wheat, label: 'Crop Type', value: 'Wheat (any grade)' },
  { Icon: Scale, label: 'Quantity Needed', value: '50–200 quintals' },
  { Icon: Droplets, label: 'Moisture Level', value: 'Less than 12%' },
  { Icon: Calendar, label: 'Delivery By', value: 'Within 7 days' },
];

const STATS = [
  { value: '240+', label: 'Trades Done', color: '#2D6A2F' },
  { value: '2019', label: 'Member Since', color: '#1A1A1A' },
  { value: '~2 hrs', label: 'Avg Response', color: '#1A1A1A' },
];

const font = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";

export function BuyerDetail({ language, onAcceptOffer }: BuyerDetailProps) {
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
            textShadow: '0 2px 10px rgba(255,255,255,0.55)',
          }}
        >
          Raj Traders
        </h1>
        <p style={{ fontSize: 15, color: '#555', textShadow: '0 1px 6px rgba(255,255,255,0.55)' }}>
          📍 Delhi · 12 km away
        </p>
      </motion.div>

      {/* ── 900px Main Panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          maxWidth: 900,
          margin: '0 auto 40px',
          padding: '0 16px',
        }}
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
            display: 'flex',
            gap: 40,
          }}
        >
          {/* ── LEFT COLUMN 38% ── */}
          <div style={{ width: '38%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Avatar */}
            <img
              src={BUYER_AVATAR}
              alt="Raj Traders"
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #2D6A2F',
                marginBottom: 16,
              }}
            />

            {/* Name & Location */}
            <p style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', textAlign: 'center', margin: 0 }}>
              Raj Traders
            </p>
            <p style={{ fontSize: 14, color: '#888', textAlign: 'center', marginTop: 4, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />
              Delhi, India
            </p>

            {/* Star Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Star key={i} style={{ width: 16, height: 16, fill: '#F5A623', color: '#F5A623' }} />
              ))}
              {/* half star */}
              <div style={{ position: 'relative', width: 16, height: 16 }}>
                <Star style={{ position: 'absolute', width: 16, height: 16, fill: 'none', color: '#F5A623', stroke: '#F5A623' }} />
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: '50%' }}>
                  <Star style={{ width: 16, height: 16, fill: '#F5A623', color: '#F5A623' }} />
                </div>
              </div>
              <span style={{ fontSize: 14, color: '#555' }}>4.5 (138 reviews)</span>
            </div>

            {/* Verified Badge */}
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
              Verified Buyer
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 20 }}>
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.60)',
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderRadius: 12,
                    padding: '14px 8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, marginBottom: 4 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', lineHeight: 1.3 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact Buttons */}
            <button
              style={{
                width: '100%',
                height: 52,
                background: '#2D6A2F',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: font,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Phone size={16} /> Call Now
            </button>
            <button
              style={{
                width: '100%',
                height: 48,
                background: 'transparent',
                color: '#2D6A2F',
                border: '1.5px solid #2D6A2F',
                borderRadius: 12,
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
              <MessageSquare size={16} /> Send Message
            </button>
          </div>

          {/* ── RIGHT COLUMN 58% ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Section heading */}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 14 }}>
              Current Offer
            </h3>

            {/* Offer highlight card */}
            <div
              style={{
                background: '#E8F5E9',
                border: '1px solid #A5D6A7',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: '#2D6A2F', fontFamily: font }}>
                ₹ 2,400 / quintal
              </div>
              <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                For Wheat · Minimum 50 quintals
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  marginTop: 10,
                }}
              >
                <span style={{ fontSize: 13, color: '#888' }}>Market rate: ₹2,300/qtl</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2D6A2F' }}>
                  ↑ ₹100 above market
                </span>
              </div>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>
                Buyer Requirements
              </h4>
              {REQUIREMENTS.map((req, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    padding: '12px 0',
                  }}
                >
                  <span style={{ fontSize: 14, color: '#888' }}>
                    <req.Icon size={16} />&nbsp;&nbsp;{req.label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>
                    {req.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>
                Recent Reviews
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Review 1 */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.60)',
                    borderRadius: 12,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    <img
                      src={REVIEWER1}
                      alt="Ramesh Kumar"
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10 }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Ramesh Kumar</span>
                      &nbsp;&nbsp;
                      <StarRow count={5} />
                    </div>
                    <span style={{ fontSize: 12, color: '#AAA' }}>Mar 2024</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#555', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                    "Very fair price, payment received on same day. Highly recommend."
                  </p>
                </div>
                {/* Review 2 */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.60)',
                    borderRadius: 12,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    <img
                      src={REVIEWER2}
                      alt="Suresh Patel"
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10 }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Suresh Patel</span>
                      &nbsp;&nbsp;
                      <StarRow count={4} />
                    </div>
                    <span style={{ fontSize: 12, color: '#AAA' }}>Feb 2024</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#555', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                    "Good experience, slightly delayed pickup but price was good."
                  </p>
                </div>
              </div>
            </div>

            {/* Accept Offer CTA */}
            <motion.button
              whileHover={{ boxShadow: '0 6px 28px rgba(45,106,47,0.50)', translateY: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAcceptOffer}
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
                boxShadow: '0 4px 18px rgba(45,106,47,0.35)',
                fontFamily: font,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <CheckCircle2 size={18} /> Accept This Offer
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}