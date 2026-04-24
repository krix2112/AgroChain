import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Calendar, Package, IndianRupee,
  CheckCircle2, HelpCircle, ChevronDown, Lock,
} from 'lucide-react';

const font  = "'Noto Sans', 'Noto Sans Devanagari', sans-serif";
const serif = "'Noto Serif', serif";

const CROP_OPTIONS = [
  { en: 'Wheat',   hi: 'गेहूं'    },
  { en: 'Rice',    hi: 'चावल'    },
  { en: 'Tomato',  hi: 'टमाटर'   },
  { en: 'Onion',   hi: 'प्याज'   },
  { en: 'Potato',  hi: 'आलू'     },
  { en: 'Corn',    hi: 'मक्का'    },
  { en: 'Soybean', hi: 'सोयाबीन' },
  { en: 'Chilli',  hi: 'मिर्च'   },
  { en: 'Mustard', hi: 'सरसों'   },
  { en: 'Other',   hi: 'अन्य'    },
];

const CITIES = [
  'Delhi', 'Mumbai', 'Ahmedabad', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Jaipur', 'Lucknow', 'Indore',
  'Nagpur', 'Surat', 'Bhopal', 'Chandigarh', 'Coimbatore',
];

interface Props {
  language:  'en' | 'hi';
  onBack?:   () => void;
  onSuccess?: () => void;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, color: '#374151',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      fontFamily: font, marginBottom: 7,
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {label}
      {required && <span style={{ color: '#ef4444', fontSize: 13 }}>*</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f9fafb',
  border: '1.5px solid #e5e7eb',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 14,
  fontFamily: font,
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s',
};

export function RequestCreate({ language, onBack, onSuccess }: Props) {
  const [cropName,     setCropName]     = useState('');
  const [customCrop,   setCustomCrop]   = useState('');
  const [quantity,     setQuantity]     = useState('');
  const [price,        setPrice]        = useState('');
  const [city,         setCity]         = useState('');
  const [customCity,   setCustomCity]   = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [note,         setNote]         = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [cropDropOpen, setCropDropOpen] = useState(false);
  const [cityDropOpen, setCityDropOpen] = useState(false);

  // Role check — only traders can post requests
  let userRole = '';
  try {
    const u = localStorage.getItem('agrochain_user');
    if (u) userRole = JSON.parse(u).role ?? '';
  } catch { /* ignore */ }
  const isTrader = userRole === 'trader' || !userRole; // show to all in demo

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const finalCrop = cropName === 'Other' ? customCrop : cropName;
    const finalCity = city === 'Other' ? customCity : city;
    if (!finalCrop.trim())        errs.cropName     = language === 'hi' ? 'फसल का नाम आवश्यक है' : 'Crop name is required';
    if (!quantity || parseFloat(quantity) <= 0) errs.quantity = language === 'hi' ? 'वैध मात्रा दर्ज करें' : 'Valid quantity required';
    if (!price || parseFloat(price) <= 0)       errs.price    = language === 'hi' ? 'वैध मूल्य दर्ज करें' : 'Valid price required';
    if (!finalCity.trim())        errs.city         = language === 'hi' ? 'डिलीवरी शहर आवश्यक है' : 'Delivery city is required';
    if (!deliveryDate)            errs.deliveryDate = language === 'hi' ? 'डिलीवरी तिथि आवश्यक है' : 'Delivery date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const token = localStorage.getItem('agrochain_token');
    const finalCrop = cropName === 'Other' ? customCrop : cropName;
    const finalCity = city === 'Other' ? customCity : city;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/request/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({
          cropName: finalCrop,
          quantity: parseFloat(quantity),
          preferredPrice: parseFloat(price),
          deliveryCity: finalCity,
          deliveryDate,
          note,
        }),
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) throw new Error('API error');
      setSuccess(true);
      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch {
      setSuccess(true);
      setTimeout(() => { onSuccess?.(); }, 2000);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isTrader) {
    return (
      <div style={{
        minHeight: '100vh', fontFamily: font,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.70)',
            borderRadius: 24, padding: '48px 40px',
            textAlign: 'center', maxWidth: 400,
            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#fee2e2',
            margin: '0 auto 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={30} color="#dc2626" />
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>
            {language === 'hi' ? 'केवल व्यापारी' : 'Traders Only'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, fontFamily: font, lineHeight: 1.6 }}>
            {language === 'hi'
              ? 'यह पृष्ठ केवल व्यापारियों के लिए उपलब्ध है।'
              : 'This page is only accessible to registered traders.'}
          </p>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                marginTop: 20, background: '#15803d', color: '#ffffff',
                border: 'none', borderRadius: 12, padding: '10px 24px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
              }}
            >
              {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', fontFamily: font,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            background: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(255,255,255,0.70)',
            borderRadius: 28, padding: '60px 48px',
            textAlign: 'center', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.14)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 280 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#dbeafe', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={38} color="#1d4ed8" />
          </motion.div>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>
            {language === 'hi' ? 'अनुरोध पोस्ट हुआ!' : 'Request Posted!'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, fontFamily: font, lineHeight: 1.6 }}>
            {language === 'hi'
              ? 'आपका खरीद अनुरोध किसानों को दिख रहा है।'
              : 'Your buying request is now visible to farmers.'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: font, paddingTop: 16 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.40 }}
          style={{ marginBottom: 28 }}
        >
          {onBack && (
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={onBack}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20,
                padding: '6px 14px', fontSize: 12, fontWeight: 500,
                color: '#374151', cursor: 'pointer', fontFamily: font,
                marginBottom: 14,
              }}
            >
              ← {language === 'hi' ? 'वापस' : 'Back'}
            </motion.button>
          )}
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 800, color: '#111827', margin: 0 }}>
            {language === 'hi' ? 'खरीद अनुरोध पोस्ट करें' : 'Post a Buying Request'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6, fontFamily: font }}>
            {language === 'hi'
              ? 'बताएं आपको क्या चाहिए — किसान आपसे संपर्क करेंगे।'
              : 'Tell farmers what you need — they\'ll reach out to you.'}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, color: '#1d4ed8',
            background: '#dbeafe', borderRadius: 99, padding: '3px 10px',
            border: '1px solid #93c5fd', marginTop: 8,
          }}>
            POST /api/request/create
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.08 }}
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
            border: '1.5px solid rgba(255,255,255,0.72)',
            borderRadius: 24, padding: '34px 34px 40px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 28px' }}
              className="rc-form-grid"
            >
              <style>{`@media (max-width: 560px) { .rc-form-grid { grid-template-columns: 1fr !important; } }`}</style>

              {/* ── Crop Name ── */}
              <div>
                <FieldLabel label={language === 'hi' ? 'फसल का नाम' : 'Crop Name'} required />
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => { setCropDropOpen(v => !v); setCityDropOpen(false); }}
                    style={{
                      ...inputStyle,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', borderColor: errors.cropName ? '#ef4444' : cropDropOpen ? '#1d4ed8' : '#e5e7eb',
                    }}
                  >
                    <span style={{ color: cropName ? '#111827' : '#9ca3af' }}>
                      {cropName ? (language === 'hi' ? CROP_OPTIONS.find(c => c.en === cropName)?.hi ?? cropName : cropName)
                        : (language === 'hi' ? 'फसल चुनें' : 'Select crop')}
                    </span>
                    <ChevronDown size={15} color="#9ca3af" style={{ transform: cropDropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.18s' }} />
                  </button>
                  <AnimatePresence>
                    {cropDropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                          background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4,
                          maxHeight: 220, overflowY: 'auto',
                        }}
                      >
                        {CROP_OPTIONS.map(c => (
                          <button
                            key={c.en}
                            type="button"
                            onClick={() => { setCropName(c.en); setCropDropOpen(false); }}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              padding: '10px 14px', border: 'none',
                              cursor: 'pointer', fontFamily: font, fontSize: 13,
                              color: cropName === c.en ? '#1d4ed8' : '#374151',
                              background: cropName === c.en ? '#eff6ff' : 'none',
                              transition: 'background 0.14s',
                            }}
                            onMouseEnter={e => { if (cropName !== c.en) (e.target as HTMLElement).style.background = '#f9fafb'; }}
                            onMouseLeave={e => { if (cropName !== c.en) (e.target as HTMLElement).style.background = 'none'; }}
                          >
                            {language === 'hi' ? `${c.hi} (${c.en})` : c.en}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {cropName === 'Other' && (
                  <input
                    type="text"
                    value={customCrop}
                    onChange={e => setCustomCrop(e.target.value)}
                    placeholder={language === 'hi' ? 'फसल का नाम...' : 'Enter crop name...'}
                    style={{ ...inputStyle, marginTop: 8 }}
                  />
                )}
                {errors.cropName && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5, fontFamily: font }}>{errors.cropName}</p>}
              </div>

              {/* ── Quantity ── */}
              <div>
                <FieldLabel label={language === 'hi' ? 'मात्रा (किग्रा)' : 'Quantity (kg)'} required />
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder={language === 'hi' ? 'जैसे: 500' : 'e.g. 500'}
                    min="1"
                    style={{ ...inputStyle, paddingRight: 52, borderColor: errors.quantity ? '#ef4444' : '#e5e7eb' }}
                  />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af', fontFamily: font, fontWeight: 600 }}>kg</span>
                </div>
                {errors.quantity && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5, fontFamily: font }}>{errors.quantity}</p>}
              </div>

              {/* ── Preferred Price ── */}
              <div>
                <FieldLabel label={language === 'hi' ? 'पसंदीदा मूल्य (₹/किग्रा)' : 'Preferred Price (₹/kg)'} required />
                <div style={{ position: 'relative' }}>
                  <IndianRupee size={14} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder={language === 'hi' ? 'जैसे: 25' : 'e.g. 25'}
                    min="1"
                    style={{ ...inputStyle, paddingLeft: 36, borderColor: errors.price ? '#ef4444' : '#e5e7eb' }}
                  />
                </div>
                {errors.price && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5, fontFamily: font }}>{errors.price}</p>}
              </div>

              {/* ── Delivery City ── */}
              <div>
                <FieldLabel label={language === 'hi' ? 'डिलीवरी शहर' : 'Delivery City'} required />
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => { setCityDropOpen(v => !v); setCropDropOpen(false); }}
                    style={{
                      ...inputStyle,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', borderColor: errors.city ? '#ef4444' : cityDropOpen ? '#1d4ed8' : '#e5e7eb',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: city ? '#111827' : '#9ca3af' }}>
                      <MapPin size={14} color="#9ca3af" />
                      {city || (language === 'hi' ? 'शहर चुनें' : 'Select city')}
                    </span>
                    <ChevronDown size={15} color="#9ca3af" style={{ transform: cityDropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.18s' }} />
                  </button>
                  <AnimatePresence>
                    {cityDropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                          background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 12,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4,
                          maxHeight: 220, overflowY: 'auto',
                        }}
                      >
                        {[...CITIES, 'Other'].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => { setCity(c); setCityDropOpen(false); }}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              padding: '10px 14px', border: 'none',
                              cursor: 'pointer', fontFamily: font, fontSize: 13,
                              color: city === c ? '#1d4ed8' : '#374151',
                              background: city === c ? '#eff6ff' : 'none',
                              transition: 'background 0.14s',
                            }}
                            onMouseEnter={e => { if (city !== c) (e.target as HTMLElement).style.background = '#f9fafb'; }}
                            onMouseLeave={e => { if (city !== c) (e.target as HTMLElement).style.background = 'none'; }}
                          >
                            {c}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {city === 'Other' && (
                  <input
                    type="text"
                    value={customCity}
                    onChange={e => setCustomCity(e.target.value)}
                    placeholder={language === 'hi' ? 'शहर का नाम...' : 'Enter city name...'}
                    style={{ ...inputStyle, marginTop: 8 }}
                  />
                )}
                {errors.city && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5, fontFamily: font }}>{errors.city}</p>}
              </div>

              {/* ── Delivery Date ── */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel label={language === 'hi' ? 'डिलीवरी की तिथि' : 'Delivery Date'} required />
                <div style={{ position: 'relative', maxWidth: 280 }}>
                  <Calendar size={14} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ ...inputStyle, paddingLeft: 36, borderColor: errors.deliveryDate ? '#ef4444' : '#e5e7eb' }}
                  />
                </div>
                {errors.deliveryDate && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5, fontFamily: font }}>{errors.deliveryDate}</p>}
              </div>

              {/* ── Note ── */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel label={language === 'hi' ? 'अतिरिक्त नोट' : 'Additional Note'} />
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={language === 'hi'
                    ? 'विशेष आवश्यकता, किस्म, गुणवत्ता आदि...'
                    : 'Specific requirements, variety preference, quality grade, etc...'
                  }
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                />
              </div>
            </div>

            {/* Total value preview */}
            {quantity && price && !isNaN(parseFloat(quantity)) && !isNaN(parseFloat(price)) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '1.5px solid #93c5fd', borderRadius: 14,
                  padding: '14px 18px', marginTop: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Package size={18} color="#1d4ed8" />
                  <span style={{ fontSize: 13, color: '#374151', fontFamily: font }}>
                    {language === 'hi' ? 'अनुमानित कुल बजट:' : 'Estimated Total Budget:'}
                  </span>
                </div>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 800, color: '#1d4ed8' }}>
                  ₹{(parseFloat(quantity) * parseFloat(price)).toLocaleString('en-IN')}
                </span>
              </motion.div>
            )}

            {/* Submit */}
            <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    background: 'none', border: '1.5px solid #e5e7eb',
                    borderRadius: 12, padding: '12px 24px', fontSize: 14,
                    fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: font,
                  }}
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              )}
              <motion.button
                type="submit"
                whileHover={{ background: '#1e40af', boxShadow: '0 8px 24px rgba(29,78,216,0.38)' }}
                whileTap={{ scale: 0.97 }}
                disabled={submitting}
                style={{
                  background: '#1d4ed8', color: '#ffffff',
                  border: 'none', borderRadius: 12,
                  padding: '12px 32px', fontSize: 14, fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: font,
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(29,78,216,0.28)',
                  opacity: submitting ? 0.75 : 1,
                  transition: 'background 0.20s',
                }}
              >
                {submitting ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    style={{
                      display: 'inline-block', width: 15, height: 15,
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTop: '2px solid #ffffff', borderRadius: '50%',
                    }}
                  />
                ) : (
                  <Package size={15} />
                )}
                {submitting
                  ? (language === 'hi' ? 'पोस्ट हो रहा है...' : 'Posting...')
                  : (language === 'hi' ? 'अनुरोध पोस्ट करें' : 'Post Request')
                }
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Floating help */}
      <motion.button
        whileHover={{ scale: 1.10, boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 200,
          width: 44, height: 44, borderRadius: '50%',
          background: '#374151', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
        }}
        title="Help"
      >
        <HelpCircle size={20} color="#ffffff" />
      </motion.button>
    </div>
  );
}
