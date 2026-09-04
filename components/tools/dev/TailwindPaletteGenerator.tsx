'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Sparkles, Palette, Code2, RefreshCw } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

// Blend towards white or black
function blend(base: { r: number; g: number; b: number }, target: { r: number; g: number; b: number }, factor: number) {
  return {
    r: base.r + (target.r - base.r) * factor,
    g: base.g + (target.g - base.g) * factor,
    b: base.b + (target.b - base.b) * factor,
  };
}

function generateTailwindShades(hex: string): Record<string, string> {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return {
      '50': '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0',
      '300': '#cbd5e1',
      '400': '#94a3b8',
      '500': '#64748b',
      '600': '#475569',
      '700': '#334155',
      '800': '#1e293b',
      '900': '#0f172a',
      '950': '#020617',
    };
  }

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 10, g: 15, b: 26 };

  // Generate tints (50-400) by blending towards white
  // 500 is base
  // Generate shades (600-950) by blending towards black
  const shades: Record<string, string> = {
    '50': rgbToHex(blend(rgb, white, 0.95).r, blend(rgb, white, 0.95).g, blend(rgb, white, 0.95).b),
    '100': rgbToHex(blend(rgb, white, 0.88).r, blend(rgb, white, 0.88).g, blend(rgb, white, 0.88).b),
    '200': rgbToHex(blend(rgb, white, 0.72).r, blend(rgb, white, 0.72).g, blend(rgb, white, 0.72).b),
    '300': rgbToHex(blend(rgb, white, 0.52).r, blend(rgb, white, 0.52).g, blend(rgb, white, 0.52).b),
    '400': rgbToHex(blend(rgb, white, 0.26).r, blend(rgb, white, 0.26).g, blend(rgb, white, 0.26).b),
    '500': rgbToHex(rgb.r, rgb.g, rgb.b),
    '600': rgbToHex(blend(rgb, black, 0.18).r, blend(rgb, black, 0.18).g, blend(rgb, black, 0.18).b),
    '700': rgbToHex(blend(rgb, black, 0.38).r, blend(rgb, black, 0.38).g, blend(rgb, black, 0.38).b),
    '800': rgbToHex(blend(rgb, black, 0.58).r, blend(rgb, black, 0.58).g, blend(rgb, black, 0.58).b),
    '900': rgbToHex(blend(rgb, black, 0.78).r, blend(rgb, black, 0.78).g, blend(rgb, black, 0.78).b),
    '950': rgbToHex(blend(rgb, black, 0.90).r, blend(rgb, black, 0.90).g, blend(rgb, black, 0.90).b),
  };

  return shades;
}

function getContrastYIQ(hexcolor: string): 'black' | 'white' {
  const rgb = hexToRgb(hexcolor);
  if (!rgb) return 'white';
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

export function TailwindPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [colorName, setColorName] = useState('brand');

  const shades = useMemo(() => generateTailwindShades(baseColor), [baseColor]);

  const tailwindConfigCode = useMemo(() => {
    const formatted = Object.entries(shades)
      .map(([k, v]) => `        ${k}: '${v}',`)
      .join('\n');

    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName || 'brand'}: {
${formatted}
        },
      },
    },
  },
};`;
  }, [shades, colorName]);

  const cssVariablesCode = useMemo(() => {
    return `:root {\n${Object.entries(shades)
      .map(([k, v]) => `  --color-${colorName || 'brand'}-${k}: ${v};`)
      .join('\n')}\n}`;
  }, [shades, colorName]);

  const PRESETS = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Cyan', hex: '#06b6d4' },
  ];

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-zinc-700 bg-transparent cursor-pointer p-0.5"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-400 block">Base Hex Color</span>
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="font-mono text-sm uppercase px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none w-28"
                placeholder="#6366F1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Palette Name:</span>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none w-28"
              placeholder="brand"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
          <span className="text-xs text-zinc-400 font-medium mr-1">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setBaseColor(p.hex);
                setColorName(p.name.toLowerCase());
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.hex }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Swatches Grid */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 block">
          Generated Tailwind 11-Step Shade Scale
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {Object.entries(shades).map(([step, hexVal]) => {
            const contrast = getContrastYIQ(hexVal);
            return (
              <div
                key={step}
                className="p-3 rounded-xl flex flex-col justify-between h-28 shadow-sm transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: hexVal }}
              >
                <span
                  className="font-bold text-xs"
                  style={{ color: contrast === 'white' ? '#ffffff' : '#09090b' }}
                >
                  {step}
                </span>
                <div>
                  <span
                    className="font-mono text-[11px] uppercase block tracking-wider"
                    style={{ color: contrast === 'white' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)' }}
                  >
                    {hexVal}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              tailwind.config.js Export
            </span>
            <CopyButton text={tailwindConfigCode} label="Copy Config" />
          </div>
          <textarea
            rows={10}
            readOnly
            value={tailwindConfigCode}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-indigo-300 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-400" />
              CSS Custom Properties (:root)
            </span>
            <CopyButton text={cssVariablesCode} label="Copy CSS Vars" />
          </div>
          <textarea
            rows={10}
            readOnly
            value={cssVariablesCode}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
