import { CheckCircle2 } from 'lucide-react';

interface SuccessProps {
  language: 'en' | 'hi';
  onViewListing?: () => void;
  onHome?: () => void;
}

export function Success({ language, onViewListing, onHome }: SuccessProps) {
  const text = {
    heading: language === 'en' ? 'Listing Posted!' : 'लिस्टिंग पोस्ट की गई!',
    subtext1: language === 'en' ? 'Your listing for' : 'आपकी लिस्टिंग',
    cropName: language === 'en' ? 'Tomatoes' : 'टमाटर',
    subtext2:
      language === 'en'
        ? 'has been posted successfully.'
        : 'सफलतापूर्वक पोस्ट की गई है।',
    infoText:
      language === 'en'
        ? 'You will be notified of inquiries from interested buyers.'
        : 'रुचि रखने वाले खरीदारों की पूछताछ की सूचना आपको मिलेगी।',
    viewListing: language === 'en' ? 'View Listing' : 'लिस्टिंग देखें',
    home: language === 'en' ? 'Home' : 'होम',
  };

  return (
    <div
      className="flex items-center justify-center at-page-wrap"
      style={{ minHeight: 'calc(100vh - 136px)', padding: '40px 20px' }}
    >
      {/* Success Card */}
      <div
        className="text-center at-success-card"
        style={{
          width: 560,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255,255,255,0.60)',
          borderRadius: 28,
          boxShadow: '0 16px 56px rgba(0,0,0,0.12)',
          padding: '48px 44px',
        }}
      >
        {/* Success Icon with Glow */}
        <div className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#2D6A2F',
              boxShadow:
                '0 0 0 12px rgba(45,106,47,0.12), 0 0 0 24px rgba(45,106,47,0.06)',
            }}
          >
            <CheckCircle2
              className="text-white"
              style={{ width: 36, height: 36, strokeWidth: 3 }}
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: 12,
          }}
        >
          {text.heading}
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: 16,
            color: '#555',
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {text.subtext1}{' '}
          <span style={{ fontWeight: 700, color: '#2D6A2F' }}>
            {text.cropName}
          </span>{' '}
          {text.subtext2}
        </p>

        {/* Phone Mockup Illustration */}
        <div className="flex justify-center mb-6">
          <div
            style={{
              width: 160,
              height: 280,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              border: '8px solid #fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '16px 12px',
              position: 'relative',
            }}
          >
            {/* Phone Screen */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 12,
                background: 'white',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {/* Mini Listing Card Inside Phone */}
              <div
                style={{
                  background: 'rgba(45,106,47,0.08)',
                  borderRadius: 8,
                  padding: 8,
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: '#E53935',
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#2D6A2F',
                  }}
                >
                  {text.cropName}
                </div>
              </div>

              {/* Mini Details */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: '4px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 9,
                      color: '#888',
                    }}
                  >
                    2,000 kg
                  </span>
                  <span
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#2D6A2F',
                    }}
                  >
                    ₹24/kg
                  </span>
                </div>
                <div
                  style={{
                    height: 1,
                    background: 'rgba(0,0,0,0.08)',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      background: '#E8F5E9',
                      borderRadius: 4,
                      padding: '2px 6px',
                      fontSize: 8,
                      color: '#2D6A2F',
                      fontWeight: 600,
                    }}
                  >
                    Grade A
                  </div>
                </div>
              </div>

              {/* Mini Button */}
              <div
                style={{
                  background: '#2D6A2F',
                  borderRadius: 6,
                  padding: '6px 8px',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 'auto',
                }}
              >
                View Details
              </div>
            </div>

            {/* Phone Notch */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 50,
                height: 4,
                borderRadius: 2,
                background: '#ddd',
              }}
            />
          </div>
        </div>

        {/* Info Text */}
        <p
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: 14,
            color: '#888',
            lineHeight: 1.6,
            marginBottom: 28,
            maxWidth: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {text.infoText}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 at-success-btns">
          <button
            onClick={onViewListing}
            className="transition-all duration-200"
            style={{
              background: '#2D6A2F',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              height: 52,
              width: 220,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(45,106,47,0.30)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#245022';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 6px 18px rgba(45,106,47,0.40)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2D6A2F';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 14px rgba(45,106,47,0.30)';
            }}
          >
            {text.viewListing}
          </button>
          <button
            onClick={onHome}
            className="transition-all duration-200"
            style={{
              background: '#E8620A',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              height: 52,
              width: 220,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(232,98,10,0.30)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D05509';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 6px 18px rgba(232,98,10,0.40)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#E8620A';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 14px rgba(232,98,10,0.30)';
            }}
          >
            {text.home}
          </button>
        </div>
      </div>
    </div>
  );
}