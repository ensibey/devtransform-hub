'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Box, Image as ImageIcon, Sliders } from 'lucide-react';

interface GlassPreset {
  name: string;
  blur: number;
  opacity: number;
  borderOpacity: number;
  radius: number;
  color: string;
  shadow: number;
}

const PRESETS: GlassPreset[] = [
  { name: 'Crystal Clear (Default)', blur: 16, opacity: 0.15, borderOpacity: 0.25, radius: 24, color: '#ffffff', shadow: 20 },
  { name: 'Heavy Frost', blur: 30, opacity: 0.35, borderOpacity: 0.4, radius: 20, color: '#ffffff', shadow: 25 },
  { name: 'Dark Smoked Glass', blur: 20, opacity: 0.25, borderOpacity: 0.15, radius: 24, color: '#000000', shadow: 30 },
  { name: 'Neon Purple Tint', blur: 18, opacity: 0.2, borderOpacity: 0.3, radius: 28, color: '#a855f7', shadow: 25 },
  { name: 'Cyber Emerald', blur: 16, opacity: 0.18, borderOpacity: 0.35, radius: 24, color: '#10b981', shadow: 20 },
];

const BACKGROUND_STYLES = [
  { id: 'aurora', name: 'Aurora Vibrant', style: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' },
  { id: 'sunset', name: 'Sunset Warm', style: 'linear-gradient(135deg, #f97316 0%, #e11d48 50%, #831843 100%)' },
  { id: 'cyber', name: 'Cyber Ocean', style: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #1e1b4b 100%)' },
  { id: 'mesh', name: 'Dark Cosmic', style: 'radial-gradient(at 0% 0%, #4f46e5 0px, transparent 50%), radial-gradient(at 100% 100%, #ec4899 0px, transparent 50%), #0f172a' },
];

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c || 'ffffff', 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CssGlassmorphismStudio() {
  const [blur, setBlur] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(0.15);
  const [borderOpacity, setBorderOpacity] = useState<number>(0.25);
  const [radius, setRadius] = useState<number>(24);
  const [color, setColor] = useState<string>('#ffffff');
  const [shadow, setShadow] = useState<number>(20);
  const [bgIndex, setBgIndex] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  const backgroundRgba = useMemo(() => hexToRgba(color, opacity), [color, opacity]);
  const borderRgba = useMemo(() => hexToRgba(color, borderOpacity), [color, borderOpacity]);
  const shadowValue = useMemo(() => `0 8px 32px 0 rgba(0, 0, 0, ${shadow / 100})`, [shadow]);

  // CSS Stylesheet
  const cssCode = useMemo(() => {
    return `background: ${backgroundRgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${radius}px;
border: 1px solid ${borderRgba};
box-shadow: ${shadowValue};`;
  }, [backgroundRgba, blur, radius, borderRgba, shadowValue]);

  // Tailwind CSS snippet
  const tailwindSnippet = useMemo(() => {
    const blurClass = blur <= 8 ? 'backdrop-blur-sm' : blur <= 16 ? 'backdrop-blur-md' : blur <= 24 ? 'backdrop-blur-lg' : 'backdrop-blur-xl';
    return `<div className="${blurClass} bg-white/[${opacity}] border border-white/[${borderOpacity}] shadow-2xl rounded-[${radius}px] p-6">
  {/* Glass Card Content */}
</div>`;
  }, [blur, opacity, borderOpacity, radius]);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: GlassPreset) => {
    setBlur(p.blur);
    setOpacity(p.opacity);
    setBorderOpacity(p.borderOpacity);
    setRadius(p.radius);
    setColor(p.color);
    setShadow(p.shadow);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              CSS Glassmorphism Studio & Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Design modern frosted glass UI components with realistic backdrop blur, specular borders, and instant CSS / Tailwind exports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset(PRESETS[0])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Crystal
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Glass Color & Backdrop */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Glass Tint & Blur Controls
            </h3>

            {/* Tint Color */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">
                Glass Tint Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono uppercase"
                />
              </div>
            </div>

            {/* Blur Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Backdrop Blur</span>
                <span className="text-white font-mono">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Glass Fill Opacity</span>
                <span className="text-white font-mono">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Border Opacity */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Border Specular Highlight</span>
                <span className="text-white font-mono">{Math.round(borderOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={Math.round(borderOpacity * 100)}
                onChange={(e) => setBorderOpacity(Number(e.target.value) / 100)}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Border Radius */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Corner Radius</span>
                <span className="text-white font-mono">{radius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Shadow Depth */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Shadow Elevation</span>
                <span className="text-white font-mono">{shadow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={shadow}
                onChange={(e) => setShadow(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Test Background Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Stage Test Background
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BACKGROUND_STYLES.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setBgIndex(idx)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 ${
                    bgIndex === idx ? 'border-indigo-500 bg-slate-800' : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: b.style }} />
                  <span className="text-slate-200">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview & Code Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Live Preview Container */}
          <div
            className="rounded-2xl p-8 flex items-center justify-center min-h-[360px] relative overflow-hidden border border-slate-700/50"
            style={{ background: BACKGROUND_STYLES[bgIndex].style }}
          >
            {/* Ambient colorful orbs behind card */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-amber-400/40 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-cyan-400/40 blur-2xl pointer-events-none" />

            {/* The Glass Card */}
            <div
              className="p-6 sm:p-8 max-w-sm w-full relative z-10 transition-all cursor-pointer"
              style={{
                background: backgroundRgba,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                borderRadius: `${radius}px`,
                border: `1px solid ${borderRgba}`,
                boxShadow: shadowValue,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm shadow-inner">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">Glassmorphic Card</h4>
                  <p className="text-xs text-white/80">Frosted Glass Effect</p>
                </div>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                Ultra-smooth real-time background blur and translucent color reflection crafted for modern UI design.
              </p>
            </div>
          </div>

          {/* Generated CSS Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CSS Properties
              </span>
              <button
                onClick={() => copyCode(cssCode, 'css')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'css' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
              {cssCode}
            </pre>
          </div>

          {/* Tailwind Export */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tailwind CSS
              </span>
              <button
                onClick={() => copyCode(tailwindSnippet, 'tailwind')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5"
              >
                {copied === 'tailwind' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'tailwind' ? 'Copied' : 'Copy Tailwind'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              {tailwindSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
