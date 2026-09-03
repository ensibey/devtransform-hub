import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function BrandLogo({ className = '', size = 32, showText = true }: BrandLogoProps) {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Hyper-Modern Geometric Cyber-Icon */}
      <div
        style={{ width: size, height: size }}
        className="relative rounded-xl p-[1px] bg-gradient-to-tr from-brand-emerald via-teal-400 to-sky-500 shadow-lg shadow-brand-emerald/20 flex-shrink-0 group"
      >
        <div className="w-full h-full bg-[#0a0a0c] rounded-[11px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-sky-500/20 opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* SVG Geometric Emblem: Zero + Upload Lightning */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 relative z-10 text-brand-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          >
            {/* Outer Hex/Circuit Nodes */}
            <path
              d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            />
            {/* Upload Arrow / Lightning Core */}
            <path
              d="M12 7V17M12 7L8.5 10.5M12 7L15.5 10.5"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Horizontal Zero Ring Segment */}
            <circle
              cx="12"
              cy="12"
              r="2.5"
              fill="#10b981"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-extrabold tracking-tight text-white font-mono flex items-center">
              <span>Zero</span>
              <span className="text-brand-emerald">Upload</span>
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-brand-emerald border border-emerald-500/30">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono -mt-0.5 tracking-wider">
            100% Client-Side
          </span>
        </div>
      )}
    </div>
  );
}
