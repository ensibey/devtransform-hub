'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Eye, Check, X, ArrowLeftRight, Sparkles } from 'lucide-react';

function hexToRgb(hex: string): [number, number, number] | null {
  const sanitized = hex.replace('#', '').trim();
  if (sanitized.length === 3) {
    const r = parseInt(sanitized[0] + sanitized[0], 16);
    const g = parseInt(sanitized[1] + sanitized[1], 16);
    const b = parseInt(sanitized[2] + sanitized[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : [r, g, b];
  }
  if (sanitized.length === 6) {
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : [r, g, b];
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrast(fgHex: string, bgHex: string): number | null {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);
  if (!fgRgb || !bgRgb) return null;

  const lum1 = getLuminance(...fgRgb);
  const lum2 = getLuminance(...bgRgb);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

const COLOR_PRESETS = [
  { name: 'Dark Mode Emerald', fg: '#10b981', bg: '#09090b' },
  { name: 'High Contrast White/Black', fg: '#ffffff', bg: '#000000' },
  { name: 'Clean Editorial', fg: '#18181b', bg: '#f4f4f5' },
  { name: 'Cyberpunk Neon', fg: '#38bdf8', bg: '#0f172a' },
  { name: 'Warm Amber', fg: '#fbbf24', bg: '#1c1917' },
  { name: 'Indigo Accent', fg: '#818cf8', bg: '#020617' },
];

export function ColorContrastChecker() {
  const [textColor, setTextColor] = useState('#10b981');
  const [bgColor, setBgColor] = useState('#09090b');
  const [previewSize, setPreviewSize] = useState<'normal' | 'large'>('normal');

  const contrast = useMemo(() => calculateContrast(textColor, bgColor), [textColor, bgColor]);

  const swapColors = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  const normalAa = contrast !== null && contrast >= 4.5;
  const largeAa = contrast !== null && contrast >= 3.0;
  const normalAaa = contrast !== null && contrast >= 7.0;
  const largeAaa = contrast !== null && contrast >= 4.5;
  const uiElements = contrast !== null && contrast >= 3.0;

  return (
    <div className="space-y-6">
      {/* Color Selectors & Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Foreground (Text) */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
          <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Foreground (Text)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={textColor.startsWith('#') && textColor.length === 7 ? textColor : '#10b981'}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/50 border border-zinc-700 rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none uppercase"
            />
          </div>
        </div>

        {/* Swap Button & Ratio Display */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center space-y-2 shadow-sm text-center">
          <button
            type="button"
            onClick={swapColors}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Swap foreground and background"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {contrast !== null ? `${contrast.toFixed(2)} : 1` : 'Invalid'}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">WCAG Contrast Ratio</span>
        </div>

        {/* Background */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
          <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Background
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={bgColor.startsWith('#') && bgColor.length === 7 ? bgColor : '#09090b'}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/50 border border-zinc-700 rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none uppercase"
            />
          </div>
        </div>
      </div>

      {/* WCAG Compliance Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* Normal AA */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-1.5 ${
            normalAa
              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-1 font-bold text-sm">
            {normalAa ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{normalAa ? 'Pass' : 'Fail'}</span>
          </div>
          <span className="text-xs font-semibold">Normal Text AA</span>
          <span className="text-[10px] opacity-75 font-mono">Min 4.5:1</span>
        </div>

        {/* Large AA */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-1.5 ${
            largeAa
              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-1 font-bold text-sm">
            {largeAa ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{largeAa ? 'Pass' : 'Fail'}</span>
          </div>
          <span className="text-xs font-semibold">Large Text AA</span>
          <span className="text-[10px] opacity-75 font-mono">Min 3.0:1 (18pt+)</span>
        </div>

        {/* Normal AAA */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-1.5 ${
            normalAaa
              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-1 font-bold text-sm">
            {normalAaa ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{normalAaa ? 'Pass' : 'Fail'}</span>
          </div>
          <span className="text-xs font-semibold">Normal Text AAA</span>
          <span className="text-[10px] opacity-75 font-mono">Min 7.0:1</span>
        </div>

        {/* Large AAA */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-1.5 ${
            largeAaa
              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-1 font-bold text-sm">
            {largeAaa ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{largeAaa ? 'Pass' : 'Fail'}</span>
          </div>
          <span className="text-xs font-semibold">Large Text AAA</span>
          <span className="text-[10px] opacity-75 font-mono">Min 4.5:1</span>
        </div>

        {/* UI Elements */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-1.5 col-span-2 sm:col-span-1 ${
            uiElements
              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-1 font-bold text-sm">
            {uiElements ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{uiElements ? 'Pass' : 'Fail'}</span>
          </div>
          <span className="text-xs font-semibold">UI Components</span>
          <span className="text-[10px] opacity-75 font-mono">Min 3.0:1</span>
        </div>
      </div>

      {/* Live Preview Studio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-emerald" />
            Live Preview Component
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPreviewSize('normal')}
              className={`px-3 py-1 rounded-lg text-xs font-mono ${
                previewSize === 'normal'
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Normal Text (16px)
            </button>
            <button
              type="button"
              onClick={() => setPreviewSize('large')}
              className={`px-3 py-1 rounded-lg text-xs font-mono ${
                previewSize === 'large'
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Large Headline (24px)
            </button>
          </div>
        </div>

        <div
          className="p-8 rounded-2xl border border-zinc-800 transition-colors space-y-4 shadow-lg"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <h2
            className={`font-bold tracking-tight ${
              previewSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            }`}
          >
            Designing Accessible Digital Experiences for Everyone
          </h2>
          <p
            className={`leading-relaxed max-w-2xl ${
              previewSize === 'large' ? 'text-base sm:text-lg' : 'text-sm'
            }`}
          >
            Web Content Accessibility Guidelines (WCAG 2.1) require sufficient color contrast between text and background to ensure content is legible for people with visual impairments or color blindness.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold border"
              style={{ borderColor: textColor }}
            >
              Outlined Button
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold"
              style={{ backgroundColor: textColor, color: bgColor }}
            >
              Filled CTA Action
            </button>
          </div>
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Curated High-Contrast Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setTextColor(p.fg);
                setBgColor(p.bg);
              }}
              className="p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all text-left space-y-2 group"
              style={{ backgroundColor: p.bg }}
            >
              <div className="text-[11px] font-bold truncate" style={{ color: p.fg }}>
                {p.name}
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fg }} />
                <span className="text-[9px] font-mono opacity-80" style={{ color: p.fg }}>
                  {p.fg}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
