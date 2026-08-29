'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Palette, Sparkles, Sliders, RefreshCw, Layers } from 'lucide-react';

const PRESET_GRADIENTS = [
  { name: 'Hyper Emerald', color1: '#10b981', color2: '#06b6d4', angle: 135 },
  { name: 'Neon Cyberpunk', color1: '#8b5cf6', color2: '#ec4899', angle: 45 },
  { name: 'Sunset Glow', color1: '#f59e0b', color2: '#ef4444', angle: 90 },
  { name: 'Deep Oceanic', color1: '#0f172a', color2: '#3b82f6', angle: 180 },
  { name: 'Aurora Borealis', color1: '#10b981', color2: '#6366f1', angle: 120 },
  { name: 'Midnight Violet', color1: '#18181b', color2: '#7c3aed', angle: 225 },
];

export function GradientGenerator() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [color1, setColor1] = useState('#10b981');
  const [color2, setColor2] = useState('#6366f1');
  const [angle, setAngle] = useState(135);

  const gradientCss =
    gradientType === 'linear'
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssRule = `background: ${gradientCss};`;

  const randomize = () => {
    const randomHex = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    setColor1(randomHex());
    setColor2(randomHex());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="space-y-6">
      {/* Preset Gradients */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Curated Color Presets:</span>
          <button
            type="button"
            onClick={randomize}
            className="text-brand-emerald hover:text-white flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_GRADIENTS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setColor1(p.color1);
                setColor2(p.color2);
                setAngle(p.angle);
                setGradientType('linear');
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 flex items-center space-x-2 transition-all group"
            >
              <div
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ background: `linear-gradient(135deg, ${p.color1}, ${p.color2})` }}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Controls & Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Sliders className="w-4 h-4 text-brand-emerald" />
              <span>Gradient Parameters</span>
            </div>
            <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setGradientType('linear')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  gradientType === 'linear' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Linear
              </button>
              <button
                type="button"
                onClick={() => setGradientType('radial')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  gradientType === 'radial' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-mono text-zinc-400">Color 1 (Start):</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-white uppercase focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-mono text-zinc-400">Color 2 (End):</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-white uppercase focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Angle Slider (Linear only) */}
          {gradientType === 'linear' && (
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Gradient Angle / Direction:</span>
                <span className="text-brand-emerald font-bold">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>
          )}
        </div>

        {/* Live Canvas */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Live Gradient Canvas:</span>
            <span className="text-brand-emerald font-bold">{gradientType}</span>
          </div>

          <div
            className="h-[220px] rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center p-6 transition-all duration-200"
            style={{ background: gradientCss }}
          >
            <span className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold drop-shadow">
              Gradient Preview
            </span>
          </div>
        </div>
      </div>

      {/* Generated CSS Snippet */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">CSS Background Rule:</span>
          <CopyButton text={cssRule} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          {cssRule}
        </pre>
      </div>
    </div>
  );
}
