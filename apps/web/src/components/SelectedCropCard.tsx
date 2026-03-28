import { Wheat } from 'lucide-react';

const WHEAT_THUMB =
    'https://images.unsplash.com/photo-1771208680359-28cf7faf1040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB3aGVhdCUyMHN0YWxrcyUyMGhhcnZlc3QlMjBmaWVsZHxlbnwxfHx8fDE3NzQ0Njg0NDR8MA&ixlib=rb-4.1.0&q=80&w=400';

interface SelectedCropCardProps {
    cropNameEn?: string;
    cropNameHi?: string;
    quantity?: number;
    unit?: string;
    language: 'en' | 'hi';
    photoUrl?: string;
}

export function SelectedCropCard({
    cropNameEn = 'Wheat',
    cropNameHi = 'गेहूं',
    quantity = 10,
    unit,
    language,
    photoUrl = WHEAT_THUMB,
}: SelectedCropCardProps) {
    const unitLabel = unit ?? (language === 'en' ? 'Quintals' : 'क्विंटल');
    const cropName = language === 'en' ? cropNameEn : cropNameHi;

    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.55)',
                borderRadius: 14,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(45,106,47,0.13)',
                marginBottom: 22,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(34,197,94,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Wheat style={{ width: 18, height: 18, color: '#22c55e' }} />
                </div>
                <span
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#1A1A1A',
                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                    }}
                >
                    {cropName}
                </span>
                <span style={{ color: '#CCC', fontSize: 18, margin: '0 2px' }}>|</span>
                <span
                    style={{
                        fontSize: 16,
                        color: '#666',
                        fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                    }}
                >
                    {quantity} {unitLabel}
                </span>
            </div>

            {/* Mini photo */}
            <div
                style={{
                    width: 80,
                    height: 60,
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                }}
            >
                <img
                    src={photoUrl}
                    alt={cropNameEn}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(90deg, rgba(255,255,255,0.55) 0%, transparent 55%)',
                    }}
                />
            </div>
        </div>
    );
}