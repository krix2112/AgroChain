import { motion } from 'motion/react';

/* ── Wheat Icon Illustration ── */
export function WheatIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <defs>
        <linearGradient id="wheat-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path
        d="M32 48 L32 16"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Wheat grains - left side */}
      <ellipse cx="28" cy="20" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      <ellipse cx="27" cy="26" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      <ellipse cx="28" cy="32" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      <ellipse cx="27" cy="38" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      {/* Wheat grains - right side */}
      <ellipse cx="36" cy="20" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      <ellipse cx="37" cy="26" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      <ellipse cx="36" cy="32" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      <ellipse cx="37" cy="38" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
      {/* Top grain */}
      <ellipse cx="32" cy="14" rx="3.5" ry="5" fill="url(#wheat-gradient)" />
    </motion.svg>
  );
}

/* ── Tomato Icon Illustration ── */
export function TomatoIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <defs>
        <linearGradient id="tomato-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="leaf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      {/* Tomato body */}
      <circle cx="32" cy="36" r="18" fill="url(#tomato-gradient)" />
      {/* Highlight */}
      <ellipse cx="26" cy="30" rx="6" ry="4" fill="#ffffff" opacity="0.3" />
      {/* Leaves */}
      <path
        d="M32 20 Q28 16 24 18 Q26 20 28 22"
        fill="url(#leaf-gradient)"
      />
      <path
        d="M32 20 Q34 14 38 16 Q36 18 34 20"
        fill="url(#leaf-gradient)"
      />
      <path
        d="M32 20 Q32 12 32 10"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ── Generic Crop Icon ── */
export function CropIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <defs>
        <linearGradient id="crop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      {/* Leaf shape */}
      <path
        d="M32 48 Q32 32 32 24 Q32 16 40 12 Q36 20 32 24 Q28 20 24 12 Q32 16 32 24 Q32 32 32 48"
        fill="url(#crop-gradient)"
      />
      <path
        d="M32 48 L32 24"
        stroke="#166534"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ── Farmer Icon Illustration ── */
export function FarmerIcon({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="farmer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      {/* Hat */}
      <ellipse cx="32" cy="18" rx="16" ry="4" fill="#92400E" />
      <rect x="24" y="18" width="16" height="8" rx="2" fill="#B45309" />
      {/* Head */}
      <circle cx="32" cy="30" r="8" fill="#FCD34D" />
      {/* Body */}
      <path
        d="M32 38 L28 48 L24 56 M32 38 L36 48 L40 56"
        stroke="url(#farmer-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="32" cy="42" r="8" fill="url(#farmer-gradient)" />
      {/* Tool */}
      <path
        d="M40 44 L48 48 L48 52 L40 48 Z"
        fill="#78716C"
      />
    </motion.svg>
  );
}

/* ── Trader Icon Illustration ── */
export function TraderIcon({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="trader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Head */}
      <circle cx="32" cy="22" r="8" fill="#FCD34D" />
      {/* Body */}
      <rect x="24" y="30" width="16" height="20" rx="2" fill="url(#trader-gradient)" />
      {/* Arms */}
      <path d="M24 34 L18 40" stroke="url(#trader-gradient)" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 34 L46 40" stroke="url(#trader-gradient)" strokeWidth="4" strokeLinecap="round" />
      {/* Briefcase */}
      <rect x="26" y="44" width="12" height="8" rx="1" fill="#78716C" />
      <rect x="30" y="44" width="4" height="3" fill="#A8A29E" />
    </motion.svg>
  );
}

/* ── Transporter Icon Illustration ── */
export function TransporterIcon({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="transport-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      {/* Truck body */}
      <rect x="16" y="28" width="24" height="16" rx="2" fill="url(#transport-gradient)" />
      {/* Truck cabin */}
      <rect x="12" y="32" width="12" height="12" rx="2" fill="#10B981" />
      {/* Windows */}
      <rect x="14" y="34" width="4" height="4" rx="1" fill="#D1FAE5" />
      <rect x="19" y="34" width="3" height="4" rx="1" fill="#D1FAE5" />
      {/* Wheels */}
      <circle cx="20" cy="46" r="4" fill="#374151" />
      <circle cx="36" cy="46" r="4" fill="#374151" />
      <circle cx="20" cy="46" r="2" fill="#9CA3AF" />
      <circle cx="36" cy="46" r="2" fill="#9CA3AF" />
      {/* Details */}
      <rect x="26" y="32" width="10" height="8" rx="1" fill="#D1FAE5" opacity="0.5" />
    </motion.svg>
  );
}

/* ── Success Checkmark Icon ── */
export function SuccessCheckIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <defs>
        <linearGradient id="check-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill="url(#check-gradient)" />
      <path
        d="M7 12 L10 15 L17 8"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/* ── Language Globe Icon ── */
export function GlobeIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12 L22 12" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2 Q16 6 16 12 Q16 18 12 22 Q8 18 8 12 Q8 6 12 2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

/* ── Money/Payment Icon ── */
export function MoneyIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <defs>
        <linearGradient id="money-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#money-gradient)" />
      <text
        x="12"
        y="17"
        fontSize="14"
        fontWeight="bold"
        fill="#78350F"
        textAnchor="middle"
        fontFamily="serif"
      >
        ₹
      </text>
    </motion.svg>
  );
}

/* ── Handshake/Partnership Icon ── */
export function HandshakeIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="handshake-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        d="M6 10 L8 8 L10 10 L14 10 L16 8 L18 10 L18 14 L16 16 L14 14 L10 14 L8 16 L6 14 Z"
        fill="url(#handshake-gradient)"
      />
      <path
        d="M6 10 L6 14 M18 10 L18 14"
        stroke="#065F46"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
