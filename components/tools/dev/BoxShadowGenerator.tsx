'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Box, Layers, Sliders, Palette, Sparkles } from 'lucide-react';

const SHADOW_PRESETS = [
  { name: 'Soft Elevation', x: 0, y: 10, blur: 25, spread: -5, opacity: 20, inset: false },
  { name: 'Deep 3D Floating', x: 0, y: 20, blur: 40, spread: -10, opacity: 40, inset: false },
  { name: 'Neon Emerald Glow', x: 0, y: 0, blur: 30, spread: 8, opacity: 60, color: '#10b981', inset: false },
  { name: 'Cyberpunk Violet', x: 0, y: 0, blur: 35, spread: 10, opacity: 70, color: '#8b5cf6', inset: false },
  { name: 'Inset Inner Shadow', x: 0, y: 4, blur: 12, spread: 0, opacity: 30, inset: true },
];

export function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(12);
  const [blur, setBlur] = useState(32);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(35);
  const [color, setColor] = useState('#000000');
  const [inset, setInset] = useState(false);

  const hexToRgba = (hex: string, op: number) => {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${(op / 100).toFixed(2)})`;
  };

  const shadowValue = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
  const cssCode = `box-shadow: ${shadowValue};`;

  const applyPreset = (p: any) => {
    setX(p.x);
    setY(p.y);
    setBlur(p.blur);
    setSpread(p.spread);
    setOpacity(p.opacity);
    if (p.color) setColor(p.color);
    else setColor('#000000');
    setInset(p.inset);
  };

  return (
    <div className="space-y-6">
      {/* Presets Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <span className="text-xs font-mono text-zinc-400">Shadow Presets:</span>
        <div className="flex flex-wrap gap-2">
          {SHADOW_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Controls & Live Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Sliders className="w-4 h-4 text-brand-emerald" />
              <span>Shadow Controls</span>
            </div>
            <label className="flex items-center space-x-2 text-xs font-mono text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
              />
              <span>Inset Shadow</span>
            </label>
          </div>

          <div className="space-y-3.5 text-xs font-mono">
            {/* Offset X */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Horizontal Offset (X):</span>
                <span className="text-white font-bold">{x}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Offset Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Vertical Offset (Y):</span>
                <span className="text-white font-bold">{y}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Blur Radius:</span>
                <span className="text-sky-400 font-bold">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Spread */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Spread Radius:</span>
                <span className="text-amber-400 font-bold">{spread}px</span>
              </div>
              <input
                type="range"
                min="-30"
                max="60"
                value={spread}
                onChange={(e) => setSpread(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Shadow Opacity:</span>
                <span className="text-emerald-400 font-bold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Live Stage */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Live Shadow Canvas:</span>
            <span className="text-brand-emerald font-bold">Interactive CSS</span>
          </div>

          <div className="h-[260px] rounded-2xl bg-zinc-950/80 border border-dashed border-zinc-800 flex items-center justify-center p-8 overflow-hidden">
            <div
              className="w-48 h-32 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-xs font-mono font-bold text-white transition-all duration-150"
              style={{
                boxShadow: shadowValue,
              }}
            >
              <div className="text-center space-y-1">
                <Box className="w-5 h-5 text-brand-emerald mx-auto" />
                <span>Box Shadow Element</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated CSS Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">CSS Rule:</span>
          <CopyButton text={cssCode} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
