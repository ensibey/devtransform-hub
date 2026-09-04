'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Type, Sparkles, Wand2, RefreshCw } from 'lucide-react';

interface Preset {
  name: string;
  colors: string[];
  angle: number;
}

const PRESETS: Preset[] = [
  { name: 'Sunset Glow', colors: ['#f97316', '#ec4899', '#8b5cf6'], angle: 90 },
  { name: 'Emerald Forest', colors: ['#10b981', '#06b6d4', '#3b82f6'], angle: 135 },
  { name: 'Cyberpunk', colors: ['#ec4899', '#8b5cf6', '#3b82f6'], angle: 45 },
  { name: 'Golden Sun', colors: ['#f59e0b', '#ef4444'], angle: 90 },
  { name: 'Aurora', colors: ['#06b6d4', '#a855f7', '#ec4899'], angle: 120 },
];

export function CssGradientTextGenerator() {
  const [text, setText] = useState('Build Faster with Zero-Server Tools');
  const [angle, setAngle] = useState(90);
  const [colors, setColors] = useState(['#6366f1', '#ec4899', '#f59e0b']);
  const [fontSize, setFontSize] = useState(36);
  const [fontWeight, setFontWeight] = useState(800);

  const gradientCssValue = useMemo(() => {
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  }, [angle, colors]);

  const cssDeclaration = `/* CSS */
.gradient-text {
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  background: ${gradientCssValue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  display: inline-block;
}`;

  const tailwindSnippet = `<span className="bg-gradient-to-r from-[${colors[0]}] ${
    colors.length > 2 ? `via-[${colors[1]}] ` : ''
  }to-[${colors[colors.length - 1]}] bg-clip-text text-transparent font-extrabold text-4xl">
  ${text}
</span>`;

  const handleColorChange = (index: number, val: string) => {
    const updated = [...colors];
    updated[index] = val;
    setColors(updated);
  };

  const addColorStop = () => {
    if (colors.length >= 4) return;
    setColors([...colors, '#10b981']);
  };

  const removeColorStop = (index: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Visual Live Preview */}
      <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center min-h-[220px] text-center relative overflow-hidden shadow-sm">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <span
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              background: gradientCssValue,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              lineHeight: 1.2,
            }}
          >
            {text || 'Gradient Text Preview'}
          </span>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Preview Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none"
              placeholder="Enter text..."
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-300">
              <span className="font-semibold">Gradient Angle:</span>
              <span className="font-mono text-indigo-400">{angle}&deg;</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Color Stops & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Color Stops:</span>
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="color"
                  value={c}
                  onChange={(e) => handleColorChange(i, e.target.value)}
                  className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                />
                {colors.length > 2 && (
                  <button
                    onClick={() => removeColorStop(i)}
                    className="text-zinc-500 hover:text-red-400 text-xs px-1"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {colors.length < 4 && (
              <button
                onClick={addColorStop}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2"
              >
                + Add Stop
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-medium mr-1">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setColors(p.colors);
                  setAngle(p.angle);
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code Export Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">CSS Snippet</span>
            <CopyButton text={cssDeclaration} label="Copy CSS" />
          </div>
          <textarea
            rows={8}
            readOnly
            value={cssDeclaration}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-indigo-300 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Tailwind CSS Snippet</span>
            <CopyButton text={tailwindSnippet} label="Copy Tailwind" />
          </div>
          <textarea
            rows={8}
            readOnly
            value={tailwindSnippet}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
