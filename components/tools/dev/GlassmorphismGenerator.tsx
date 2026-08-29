'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Sparkles, Layers, Sliders, Palette, Check } from 'lucide-react';

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(15);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(25);
  const [shadowSpread, setShadowSpread] = useState(24);
  const [isDarkGlass, setIsDarkGlass] = useState(false);

  const glassRgba = isDarkGlass
    ? `rgba(0, 0, 0, ${(opacity / 100).toFixed(2)})`
    : `rgba(255, 255, 255, ${(opacity / 100).toFixed(2)})`;

  const borderRgba = isDarkGlass
    ? `rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)})`
    : `rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)})`;

  const cssCode = `/* Glassmorphism CSS */
background: ${glassRgba};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid ${borderRgba};
border-radius: 16px;
box-shadow: 0 8px ${shadowSpread}px 0 rgba(0, 0, 0, 0.37);`;

  const tailwindCode = `<div className="${
    isDarkGlass ? 'bg-black/' + opacity : 'bg-white/' + opacity
  } backdrop-blur-[${blur}px] backdrop-saturate-[${saturation}%] border border-white/${borderOpacity} rounded-2xl shadow-2xl">
  {/* Content */}
</div>`;

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Interactive Live Glass Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Sliders className="w-4 h-4 text-brand-emerald" />
              <span>Glassmorphism Parameters</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDarkGlass(!isDarkGlass)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                isDarkGlass
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                  : 'bg-white/10 text-zinc-300 hover:text-white border border-white/20'
              }`}
            >
              {isDarkGlass ? '🌙 Dark Glass' : '☀️ Frosted Light Glass'}
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-4 text-xs font-mono">
            {/* Blur */}
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

            {/* Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Background Transparency:</span>
                <span className="text-sky-400 font-bold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Backdrop Saturation:</span>
                <span className="text-amber-400 font-bold">{saturation}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Border Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Border Outline Opacity:</span>
                <span className="text-zinc-200 font-bold">{borderOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Live Glass Stage Preview */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Interactive Live Preview:</span>
            <span className="text-brand-emerald font-bold">Real-time GPU Filter</span>
          </div>

          {/* Stage with vibrant floating orbs behind */}
          <div className="relative h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 flex items-center justify-center p-6 border border-zinc-800">
            {/* Glowing background orbs */}
            <div className="absolute top-4 left-6 w-32 h-32 bg-rose-500/80 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-4 right-8 w-36 h-36 bg-brand-emerald/80 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 left-12 w-28 h-28 bg-indigo-500/80 rounded-full blur-2xl" />

            {/* The Glass Card */}
            <div
              className="relative z-10 p-6 rounded-2xl max-w-xs w-full space-y-2 text-white transition-all duration-200"
              style={{
                background: glassRgba,
                backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                border: `1px solid ${borderRgba}`,
                boxShadow: `0 8px ${shadowSpread}px 0 rgba(0, 0, 0, 0.37)`,
              }}
            >
              <div className="flex items-center space-x-2 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Glassmorphism UI</span>
              </div>
              <p className="text-[11px] text-zinc-200 leading-relaxed drop-shadow">
                Ultra-smooth frosted glass aesthetics with dynamic depth, refraction, and specular borders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated CSS & Tailwind Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CSS Code */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
            <span className="font-bold">Standard CSS:</span>
            <CopyButton text={cssCode} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
            {cssCode}
          </pre>
        </div>

        {/* Tailwind CSS Code */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-sky-400">
            <span className="font-bold">Tailwind CSS Classes:</span>
            <CopyButton text={tailwindCode} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
            {tailwindCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
