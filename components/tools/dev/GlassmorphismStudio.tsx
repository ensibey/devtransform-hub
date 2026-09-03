'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Layers, Sparkles, Sliders, Check } from 'lucide-react';

export function GlassmorphismStudio() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.25);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [color, setColor] = useState('#ffffff');

  // Convert hex color to rgb
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const rgb = hexToRgb(color);

  const cssSnippet = `background: rgba(${rgb}, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(${rgb}, ${borderOpacity});\nborder-radius: 16px;\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

  const tailwindSnippet = `backdrop-blur-[${blur}px] bg-[rgba(${rgb},${opacity})] border border-[rgba(${rgb},${borderOpacity})] rounded-2xl shadow-xl`;

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Live Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-white font-bold uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Glassmorphism Parameters</span>
          </div>

          {/* Blur Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Backdrop Blur:</span>
              <span className="text-brand-emerald font-bold">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
            />
          </div>

          {/* Background Opacity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Surface Opacity:</span>
              <span className="text-brand-emerald font-bold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
            />
          </div>

          {/* Border Opacity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Frosted Border Opacity:</span>
              <span className="text-brand-emerald font-bold">{Math.round(borderOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
            />
          </div>

          {/* Color Tint */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-400">Glass Color Tint:</span>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
              />
              <span className="text-white font-bold uppercase">{color}</span>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview with Floating Orbs */}
        <div className="relative rounded-2xl overflow-hidden p-8 flex items-center justify-center min-h-[300px] bg-zinc-950 border border-zinc-800">
          {/* Background Colorful Shapes */}
          <div className="absolute top-4 left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 blur-xl opacity-70 animate-pulse pointer-events-none" />
          <div className="absolute bottom-4 right-6 w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 blur-xl opacity-70 animate-pulse pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 blur-2xl opacity-50 pointer-events-none" />

          {/* Glass Card */}
          <div
            style={{
              background: `rgba(${rgb}, ${opacity})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              border: `1px solid rgba(${rgb}, ${borderOpacity})`,
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
            className="relative z-10 w-64 p-6 text-white space-y-3 shadow-2xl transition-all"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                ZU
              </div>
              <div>
                <h4 className="text-xs font-bold">Glassmorphism Card</h4>
                <p className="text-[10px] text-zinc-200 opacity-80">Live Rendered CSS</p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Smooth frosted glass surface floating above vibrant UI elements.
            </p>
          </div>
        </div>
      </div>

      {/* Code Export Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* CSS */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
          <div className="flex items-center justify-between text-brand-emerald font-bold">
            <span>CSS Style Block:</span>
            <CopyButton text={cssSnippet} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 overflow-x-auto">
            {cssSnippet}
          </pre>
        </div>

        {/* Tailwind */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-sky-500/40 space-y-2">
          <div className="flex items-center justify-between text-sky-400 font-bold">
            <span>Tailwind CSS Classes:</span>
            <CopyButton text={tailwindSnippet} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 overflow-x-auto whitespace-pre-wrap">
            {tailwindSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
