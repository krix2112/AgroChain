/**
 * AgroChain brand logo — inline SVG, no external asset dependency.
 * A stylised wheat/leaf mark with a chain link accent.
 */

interface AgroChainLogoProps {
  /** Size of the square container in pixels */
  size?: number;
  /** Background fill colour of the container */
  bgColor?: string;
  /** Radius of the container */
  borderRadius?: number;
}

export function AgroChainLogo({ size = 32, bgColor = '#14532d', borderRadius = 8 }: AgroChainLogoProps) {
  const iconSize = Math.round(size * 0.65);
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bgColor,
        borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem */}
        <line x1="12" y1="22" x2="12" y2="8" stroke="#d1fae5" strokeWidth="2" strokeLinecap="round" />
        {/* Leaf / grain top */}
        <ellipse cx="12" cy="7" rx="4.5" ry="3" fill="#86efac" />
        {/* Left grain */}
        <ellipse cx="9" cy="11" rx="3.2" ry="2" transform="rotate(-30 9 11)" fill="#4ade80" />
        {/* Right grain */}
        <ellipse cx="15" cy="11" rx="3.2" ry="2" transform="rotate(30 15 11)" fill="#4ade80" />
        {/* Chain link left */}
        <rect x="6" y="19" width="4" height="2.5" rx="1.25" stroke="#fbbf24" strokeWidth="1.2" fill="none" />
        {/* Chain link right */}
        <rect x="14" y="19" width="4" height="2.5" rx="1.25" stroke="#fbbf24" strokeWidth="1.2" fill="none" />
        {/* Chain connector */}
        <line x1="10" y1="20.25" x2="14" y2="20.25" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
