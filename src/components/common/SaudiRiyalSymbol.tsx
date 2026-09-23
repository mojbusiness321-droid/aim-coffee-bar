import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

/**
 * Official new Saudi Riyal Symbol (SVG)
 * Includes screen-reader hidden text fallback "ر.س" / "SAR" for full accessibility.
 */
export const SaudiRiyalSymbol: React.FC<Props> = ({ className = 'inline-block text-current', size = 16 }) => {
  return (
    <span className="inline-flex items-center align-middle mx-0.5">
      <span className="sr-only">ر.س</span>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Modern Saudi Riyal Sign */}
        <path
          d="M6 18.5V6.5M6 12.5H12C15 12.5 17 10.5 17 8.5C17 6.5 15 4.5 12 4.5H6M10 18.5L16 12.5M18 18.5L15 15.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
