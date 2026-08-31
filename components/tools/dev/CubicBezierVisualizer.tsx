'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Play, RotateCcw, Sliders, Check } from 'lucide-react';

const PRESETS = [
  { name: 'Standard Ease', v: [0.25, 0.1, 0.25, 1.0] },
  { name: 'Ease In (Accelerate)', v: [0.42, 0.0, 1.0, 1.0] },
  { name: 'Ease Out (Decelerate)', v: [0.0, 0.0, 0.58, 1.0] },
  { name: 'Ease In Out', v: [0.42, 0.0, 0.58, 1.0] },
  { name: 'Snappy Spring', v: [0.175, 0.885, 0.32, 1.275] },
  { name: 'Anticipate Swing', v: [0.6, -0.28, 0.735, 0.045] },
];

export function CubicBezierVisualizer() {
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.25);
  const [p2y, setP2y] = useState(1.0);
  const [duration, setDuration] = useState(1.2);
  const [animating, setAnimating] = useState(false);

  const bezierStr = `cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})`;
  const cssCode = `transition: all ${duration}s ${bezierStr};`;

  const runAnimation = () => {
    setAnimating(false);
    setTimeout(() => setAnimating(true), 50);
  };

  const applyPreset = (p: number[]) => {
    setP1x(p[0]);
    setP1y(p[1]);
    setP2x(p[2]);
    setP2y(p[3]);
    runAnimation();
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Strip */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <span className="text-xs font-mono text-zinc-400">Popular Timing Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset.v)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Controls & Live Animation Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Cubic Bezier Control Points</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>P1.x (0 to 1):</span>
                  <span className="text-brand-emerald font-bold">{p1x}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p1x}
                  onChange={(e) => setP1x(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>P1.y (-0.5 to 1.5):</span>
                  <span className="text-brand-emerald font-bold">{p1y}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="1.5"
                  step="0.01"
                  value={p1y}
                  onChange={(e) => setP1y(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>P2.x (0 to 1):</span>
                  <span className="text-sky-400 font-bold">{p2x}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p2x}
                  onChange={(e) => setP2x(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>P2.y (-0.5 to 1.5):</span>
                  <span className="text-sky-400 font-bold">{p2y}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="1.5"
                  step="0.01"
                  value={p2y}
                  onChange={(e) => setP2y(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Duration (Seconds):</span>
                <span className="text-amber-400 font-bold">{duration}s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Live Animation Runner */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Live Animation Comparison:</span>
            <button
              type="button"
              onClick={runAnimation}
              className="px-3 py-1 rounded-xl bg-brand-emerald/20 hover:bg-brand-emerald/30 text-brand-emerald border border-brand-emerald/40 transition-colors flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trigger Animation</span>
            </button>
          </div>

          <div className="space-y-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-xs">
            {/* Custom Bezier Track */}
            <div className="space-y-1">
              <div className="text-brand-emerald font-bold">Custom Bezier Curve:</div>
              <div className="h-10 bg-zinc-900 rounded-xl relative overflow-hidden flex items-center px-2">
                <div
                  className="w-8 h-8 rounded-lg bg-brand-emerald flex items-center justify-center font-bold text-black text-xs shadow-lg"
                  style={{
                    transform: animating ? 'translateX(calc(100% * 6))' : 'translateX(0)',
                    transition: `transform ${duration}s ${bezierStr}`,
                  }}
                >
                  ⚡
                </div>
              </div>
            </div>

            {/* Linear Reference Track */}
            <div className="space-y-1">
              <div className="text-zinc-500">Linear Reference:</div>
              <div className="h-10 bg-zinc-900 rounded-xl relative overflow-hidden flex items-center px-2">
                <div
                  className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-xs shadow-lg"
                  style={{
                    transform: animating ? 'translateX(calc(100% * 6))' : 'translateX(0)',
                    transition: `transform ${duration}s linear`,
                  }}
                >
                  ⏱️
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snippet Output */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">CSS Transition Timing Function:</span>
          <CopyButton text={cssCode} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
