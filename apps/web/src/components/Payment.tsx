import { Phone, Wheat, Upload } from 'lucide-react';

interface PaymentProps {
    language: 'en' | 'hi';
    onBack?: () => void;
}

export function Payment({ language }: PaymentProps) {
    const text = {
        title: language === 'en' ? 'Complete Payment' : 'भुगतान पूरा करें',
        subtitle:
            language === 'en'
                ? 'Review the transaction and choose a payment method.'
                : 'लेनदेन की समीक्षा करें और भुगतान विधि चुनें।',
        transactionDetails:
            language === 'en' ? 'Transaction Details' : 'लेनदेन विवरण',
        wheat: language === 'en' ? 'Wheat' : 'गेहूँ',
        quantity: language === 'en' ? 'Quantity: 10 Quintals' : 'मात्रा: 10 क्विंटल',
        perQuintal: language === 'en' ? '/ quintal' : '/ क्विंटल',
        buyer: language === 'en' ? 'Buyer' : 'खरीदार',
        totalAmount: language === 'en' ? 'Total Amount:' : 'कुल राशि:',
        or: language === 'en' ? 'OR' : 'या',
        backupOption: language === 'en' ? 'Backup option' : 'बैकअप विकल्प',
        markAsPaid: language === 'en' ? 'Mark as Paid' : 'भुगतान के रूप में चिह्नित करें',
        uploadScreenshot:
            language === 'en' ? '+ Upload Screenshot' : '+ स्क्रीनशॉट अपलोड करें',
        callBuyer: language === 'en' ? 'Call Buyer' : 'खरीदार को कॉल करें',
    };

    return (
        <div className="at-page-wrap pt-[80px] pb-10 px-8">
            {/* Page Header */}
            <div className="mb-8 text-center at-page-header">
                <h1
                    style={{
                        fontFamily: "'Noto Serif', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: 6,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {text.title}
                </h1>
                <p
                    style={{
                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                        fontSize: 15,
                        color: '#555',
                        lineHeight: 1.5,
                    }}
                >
                    {text.subtitle}
                </p>
            </div>

            {/* Main Glass Panel */}
            <div
                className="mx-auto"
                style={{
                    maxWidth: 680,
                    background: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1.5px solid rgba(255,255,255,0.55)',
                    borderRadius: 24,
                    boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
                    padding: '36px 40px',
                }}
            >
                {/* Transaction Details Card */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.55)',
                        border: '1px solid rgba(0,0,0,0.07)',
                        borderRadius: 16,
                        padding: '20px 24px',
                        marginBottom: 32,
                    }}
                >
                    <h3
                        style={{
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#1A1A1A',
                            marginBottom: 16,
                        }}
                    >
                        {text.transactionDetails}
                    </h3>

                    {/* Row 1 - Crop */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                            <Wheat
                                className="w-5 h-5 flex-shrink-0"
                                style={{ color: '#2D6A2F', marginTop: 2 }}
                            />
                            <div>
                                <div
                                    style={{
                                        fontFamily:
                                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: '#1A1A1A',
                                    }}
                                >
                                    {text.wheat}
                                </div>
                                <div
                                    style={{
                                        fontFamily:
                                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 13,
                                        color: '#888',
                                        marginTop: 2,
                                    }}
                                >
                                    {text.quantity}
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                fontSize: 14,
                                color: '#555',
                            }}
                        >
                            ₹24 {text.perQuintal}
                        </div>
                    </div>

                    <div
                        style={{
                            height: 1,
                            background: 'rgba(0,0,0,0.07)',
                            marginBottom: 16,
                        }}
                    />

                    {/* Row 2 - Buyer */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: '#8B4513',
                                    flexShrink: 0,
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        fontFamily:
                                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: '#1A1A1A',
                                    }}
                                >
                                    Raj Traders
                                </div>
                                <div
                                    style={{
                                        fontFamily:
                                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                        fontSize: 13,
                                        color: '#888',
                                        marginTop: 2,
                                    }}
                                >
                                    📍 Delhi – 12 km
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#2D6A2F',
                            }}
                        >
                            ₹2,400 {text.perQuintal}
                        </div>
                    </div>

                    <div
                        style={{
                            height: 1,
                            background: 'rgba(0,0,0,0.07)',
                            marginBottom: 16,
                        }}
                    />

                    {/* Row 3 - Total */}
                    <div className="flex items-center justify-between">
                        <div
                            style={{
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                fontSize: 16,
                                fontWeight: 600,
                                color: '#555',
                            }}
                        >
                            {text.totalAmount}
                        </div>
                        <div
                            style={{
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                fontSize: 32,
                                fontWeight: 700,
                                color: '#2D6A2F',
                            }}
                        >
                            ₹24,000
                        </div>
                    </div>
                </div>

                {/* Separator with OR */}
                <div className="flex items-center mb-6" style={{ margin: '32px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.10)' }} />
                    <span
                        style={{
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            fontSize: 13,
                            color: '#AAA',
                            padding: '0 16px',
                            background: 'rgba(255,255,255,0.82)',
                        }}
                    >
                        {text.or}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.10)' }} />
                </div>

                {/* UPI Payment Buttons */}
                <div className="flex gap-3 mb-8">
                    {/* GPay */}
                    <button
                        className="flex-1 flex flex-col items-center justify-center gap-2 transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.82)',
                            border: '1.5px solid rgba(0,0,0,0.10)',
                            borderRadius: 14,
                            height: 60,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#2D6A2F';
                            e.currentTarget.style.boxShadow =
                                '0 4px 14px rgba(45,106,47,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                        }}
                    >
                        <div
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                background:
                                    'linear-gradient(90deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 75%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            G
                        </div>
                        <span
                            style={{
                                fontFamily: "'Noto Sans', sans-serif",
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#333',
                            }}
                        >
                            GPay
                        </span>
                    </button>

                    {/* PhonePe */}
                    <button
                        className="flex-1 flex flex-col items-center justify-center gap-2 transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.80)',
                            border: '1.5px solid rgba(0,0,0,0.10)',
                            borderRadius: 14,
                            height: 60,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#2D6A2F';
                            e.currentTarget.style.boxShadow =
                                '0 4px 14px rgba(45,106,47,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: '#5F259F',
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "'Noto Sans', sans-serif",
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#5F259F',
                            }}
                        >
                            PhonePe
                        </span>
                    </button>

                    {/* Paytm */}
                    <button
                        className="flex-1 flex flex-col items-center justify-center gap-2 transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.80)',
                            border: '1.5px solid rgba(0,0,0,0.10)',
                            borderRadius: 14,
                            height: 60,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#2D6A2F';
                            e.currentTarget.style.boxShadow =
                                '0 4px 14px rgba(45,106,47,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: '#00BAF2',
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "'Noto Sans', sans-serif",
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#00BAF2',
                            }}
                        >
                            Paytm
                        </span>
                    </button>
                </div>

                {/* Backup Option Section */}
                <div className="mb-8">
                    <div
                        style={{
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#AAA',
                            marginBottom: 8,
                        }}
                    >
                        {text.backupOption}
                    </div>
                    <div
                        className="flex items-center justify-between"
                        style={{
                            background: 'rgba(255,255,255,0.55)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: 12,
                            padding: '14px 18px',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    background: '#2D6A2F',
                                }}
                            >
                                <span style={{ color: 'white', fontSize: 14 }}>✓</span>
                            </div>
                            <span
                                style={{
                                    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: '#1A1A1A',
                                }}
                            >
                                {text.markAsPaid}
                            </span>
                        </div>
                        <button
                            className="flex items-center gap-2"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#2D6A2F',
                                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                                cursor: 'pointer',
                            }}
                        >
                            <Upload className="w-4 h-4" />
                            {text.uploadScreenshot}
                        </button>
                    </div>
                </div>

                {/* Call Buyer Section */}
                <div className="flex gap-3">
                    {/* Outlined Call Button */}
                    <button
                        className="flex-1 flex items-center justify-center gap-2 transition-all duration-200"
                        style={{
                            background: 'transparent',
                            color: '#2D6A2F',
                            border: '1.5px solid #2D6A2F',
                            borderRadius: 12,
                            height: 52,
                            fontSize: 15,
                            fontWeight: 600,
                            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(45,106,47,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Phone className="w-4 h-4" />
                        {text.callBuyer}
                    </button>

                    {/* Filled Call Button */}
                    <button
                        className="flex-1 flex items-center justify-center gap-2 transition-all duration-200"
                        style={{
                            background: '#2D6A2F',
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            height: 52,
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
                        <Phone className="w-4 h-4" />
                        {text.callBuyer}
                    </button>
                </div>
            </div>
        </div>
    );
}