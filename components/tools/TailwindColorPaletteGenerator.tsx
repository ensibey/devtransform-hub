'use client';

import React, { useState, useMemo } from 'react';
import { Palette, Copy, Check, Sparkles, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

interface Shade {
  shade: number;
  hex: string;
  isLight: boolean;
  contrastWhite: number;
  contrastBlack: number;
}

// Convert HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c || '3b82f6', 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);

  return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}

// Relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

// Generate 11 Tailwind shades
const SHADE_TARGETS = [
  { shade: 50, l: 96, sMult: 0.8 },
  { shade: 100, l: 91, sMult: 0.85 },
  { shade: 200, l: 82, sMult: 0.9 },
  { shade: 300, l: 71, sMult: 0.95 },
  { shade: 400, l: 59, sMult: 0.98 },
  { shade: 500, l: 48, sMult: 1.0 }, // Base-ish
  { shade: 600, l: 40, sMult: 1.02 },
  { shade: 700, l: 32, sMult: 1.02 },
  { shade: 800, l: 24, sMult: 0.98 },
  { shade: 900, l: 16, sMult: 0.94 },
  { shade: 950, l: 10, sMult: 0.90 },
];

const PRESETS = [
  { name: 'Indigo Brand', hex: '#6366f1' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Electric Violet', hex: '#8b5cf6' },
  { name: 'Amber Glow', hex: '#f59e0b' },
  { name: 'Rose Red', hex: '#f43f5e' },
  { name: 'Cyan Tech', hex: '#06b6d4' },
];

export function TailwindColorPaletteGenerator() {
  const [baseHex, setBaseHex] = useState<string>('#6366f1');
  const [colorName, setColorName] = useState<string>('brand');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute palette
  const shades: Shade[] = useMemo(() => {
    const rgb = hexToRgb(baseHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return SHADE_TARGETS.map((t) => {
      const targetL = t.l;
      const targetS = Math.min(100, Math.round(hsl.s * t.sMult));
      const hex = hslToHex(hsl.h, targetS, targetL);
      const contrastWhite = getContrast(hex, '#ffffff');
      const contrastBlack = getContrast(hex, '#000000');
      const isLight = contrastBlack > contrastWhite;

      return {
        shade: t.shade,
        hex,
        isLight,
        contrastWhite,
        contrastBlack,
      };
    });
  }, [baseHex]);

  // Export config
  const tailwindConfigCode = useMemo(() => {
    const lines = shades.map((s) => `      '${s.shade}': '${s.hex}',`).join('\n');
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${colorName}': {
${lines}
        },
      },
    },
  },
};`;
  }, [colorName, shades]);

  // CSS variables export
  const cssVariablesCode = useMemo(() => {
    const lines = shades.map((s) => `  --color-${colorName}-${s.shade}: ${s.hex};`).join('\n');
    return `:root {\n${lines}\n}`;
  }, [colorName, shades]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-6 h-6 text-indigo-400" />
              Tailwind CSS Color Palette Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Generate a complete 11-shade Tailwind CSS palette (50–950) from any single base hex color with WCAG contrast verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBaseHex('#6366f1')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Indigo
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
              onClick={() => setBaseHex(p.hex)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.hex }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Pick Base Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              className="w-14 h-11 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              placeholder="#6366f1"
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm uppercase"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Tailwind Color Key Name
          </label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="brand"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
          />
        </div>
      </div>

      {/* Palette Visual Swatches */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            11-Step Palette Swatches (Click shade to copy HEX)
          </h3>
          {copiedKey?.startsWith('hex-') && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Copied {copiedKey.replace('hex-', '')}!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
          {shades.map((s) => (
            <button
              key={s.shade}
              onClick={() => copyText(s.hex, `hex-${s.shade}`)}
              className="group rounded-xl p-3 flex flex-col justify-between h-32 transition-transform hover:scale-105 active:scale-95 text-left border border-black/10 shadow-sm"
              style={{ backgroundColor: s.hex }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: s.isLight ? '#0f172a' : '#ffffff' }}
                >
                  {s.shade}
                </span>
                <Copy
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: s.isLight ? '#0f172a' : '#ffffff' }}
                />
              </div>

              <div>
                <span
                  className="text-xs font-mono block uppercase font-medium"
                  style={{ color: s.isLight ? '#1e293b' : '#f1f5f9' }}
                >
                  {s.hex}
                </span>
                <span
                  className="text-[10px] block opacity-75 font-mono"
                  style={{ color: s.isLight ? '#334155' : '#cbd5e1' }}
                >
                  CR: {s.isLight ? `${s.contrastBlack}:1` : `${s.contrastWhite}:1`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Code Export Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tailwind Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              tailwind.config.js
            </span>
            <button
              onClick={() => copyText(tailwindConfigCode, 'tailwind')}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
            >
              {copiedKey === 'tailwind' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'tailwind' ? 'Copied!' : 'Copy Config'}
            </button>
          </div>
          <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {tailwindConfigCode}
          </pre>
        </div>

        {/* CSS Variables */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              CSS Custom Variables (:root)
            </span>
            <button
              onClick={() => copyText(cssVariablesCode, 'css')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5"
            >
              {copiedKey === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'css' ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
          <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
            {cssVariablesCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
