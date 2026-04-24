import { Check } from 'lucide-react';

export interface StepConfig {
  en: string;
  hi: string;
}

export const SELL_STEPS: StepConfig[] = [
  { en: 'Select Crop', hi: 'फसल चुनें' },
  { en: 'Set Quantity', hi: 'मात्रा तय करें' },
  { en: 'Set Quality', hi: 'गुणवत्ता तय करें' },
  { en: 'Confirm', hi: 'पुष्टि करें' },
];

interface SellCropStepperProps {
  currentStep: number; // 1-based
  language: 'en' | 'hi';
}

export function SellCropStepper({ currentStep, language }: SellCropStepperProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.68)',
        borderRadius: 10,
        padding: '10px 18px',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}
    >
      {SELL_STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Divider line between steps */}
            {i > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 1,
                  height: 18,
                  background: 'rgba(0,0,0,0.10)',
                }}
              />
            )}

            <span
              style={{
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#ffffff' : isCompleted ? '#2D6A2F' : '#888',
                background: isActive ? '#2D6A2F' : 'transparent',
                borderRadius: isActive ? 7 : 0,
                padding: isActive ? '5px 14px' : '5px 8px',
                whiteSpace: 'nowrap',
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {isCompleted ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#2D6A2F',
                    flexShrink: 0,
                  }}
                >
                  <Check style={{ width: 9, height: 9, color: '#ffffff', strokeWidth: 3 }} />
                </span>
              ) : null}
              {stepNum}. {language === 'en' ? step.en : step.hi}
            </span>
          </div>
        );
      })}
    </div>
  );
}
