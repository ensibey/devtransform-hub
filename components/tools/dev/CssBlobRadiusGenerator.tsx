'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Sparkles, RefreshCw, Wand2, Play, Pause, Code2, Layers } from 'lucide-react';

export function CssBlobRadiusGenerator() {
  // 8 Radii in percentages: [TL-H, TR-H, BR-H, BL-H, TL-V, TR-V, BR-V, BL-V]
  const [tlH, setTlH] = useState(60);
  const [trH, setTrH] = useState(40);
  const [brH, setBrH] = useState(30);
  const [blH, setBlH] = useState(70);

  const [tlV, setTlV] = useState(60);
  const [trV, setTrV] = useState(30);
  const [brV, setBrV] = useState(70);
  const [blV, setBlV] = useState(40);

  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#ec4899');
  const [isAnimating, setIsAnimating] = useState(false);

  const borderRadiusCss = useMemo(() => {
    return `${tlH}% ${trH}% ${brH}% ${blH}% / ${tlV}% ${trV}% ${brV}% ${blV}%`;
  }, [tlH, trH, brH, blH, tlV, trV, brV, blV]);

  const randomize = () => {
    setTlH(Math.floor(25 + Math.random() * 55));
    setTrH(Math.floor(25 + Math.random() * 55));
    setBrH(Math.floor(25 + Math.random() * 55));
    setBlH(Math.floor(25 + Math.random() * 55));

    setTlV(Math.floor(25 + Math.random() * 55));
    setTrV(Math.floor(25 + Math.random() * 55));
    setBrV(Math.floor(25 + Math.random() * 55));
    setBlV(Math.floor(25 + Math.random() * 55));
  };

  const cssSnippet = `/* CSS */
.organic-blob {
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, ${color1}, ${color2});
  border-radius: ${borderRadiusCss};
  transition: border-radius 0.5s ease-in-out;
}`;

  const tailwindSnippet = `<div className="w-72 h-72 bg-gradient-to-br from-[${color1}] to-[${color2}] [border-radius:${borderRadiusCss.replace(/\s+/g, '_')}] transition-all duration-500" />`;

  return (
    <div className="space-y-6">
      {/* Visual Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Preview */}
        <div className="lg:col-span-6 p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div
            className={`w-64 h-64 shadow-2xl transition-all duration-700 ease-in-out relative z-10 flex items-center justify-center ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{
              background: `linear-gradient(135deg, ${color1}, ${color2})`,
              borderRadius: borderRadiusCss,
            }}
          >
            <span className="text-white/90 font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
              border-radius
            </span>
          </div>

          <div className="flex items-center gap-3 mt-6 relative z-10">
            <button
              onClick={randomize}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Randomize Shape
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isAnimating
                  ? 'bg-amber-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAnimating ? 'Stop Animation' : 'Pulse Preview'}
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              8-Point Border-Radius Sliders
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 bg-transparent cursor-pointer"
                title="Color 1"
              />
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 bg-transparent cursor-pointer"
                title="Color 2"
              />
            </div>
          </div>

          {/* Horizontal Radii */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
              Horizontal Axes (Top & Bottom)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Top-Left:</span>
                  <span className="font-mono text-zinc-200">{tlH}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={tlH}
                  onChange={(e) => setTlH(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Top-Right:</span>
                  <span className="font-mono text-zinc-200">{trH}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={trH}
                  onChange={(e) => setTrH(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Bottom-Right:</span>
                  <span className="font-mono text-zinc-200">{brH}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={brH}
                  onChange={(e) => setBrH(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Bottom-Left:</span>
                  <span className="font-mono text-zinc-200">{blH}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={blH}
                  onChange={(e) => setBlH(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Vertical Radii */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider block">
              Vertical Axes (Left & Right)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Top-Left (V):</span>
                  <span className="font-mono text-zinc-200">{tlV}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={tlV}
                  onChange={(e) => setTlV(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Top-Right (V):</span>
                  <span className="font-mono text-zinc-200">{trV}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={trV}
                  onChange={(e) => setTrV(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Bottom-Right (V):</span>
                  <span className="font-mono text-zinc-200">{brV}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={brV}
                  onChange={(e) => setBrV(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Bottom-Left (V):</span>
                  <span className="font-mono text-zinc-200">{blV}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={blV}
                  onChange={(e) => setBlV(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Export Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Pure CSS Declaration</span>
            <CopyButton text={`border-radius: ${borderRadiusCss};`} label="Copy CSS" />
          </div>
          <pre className="font-mono text-xs text-indigo-300 overflow-x-auto p-2 bg-zinc-900/50 rounded-lg">
            {`border-radius: ${borderRadiusCss};`}
          </pre>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Tailwind CSS Arbitrary Snippet</span>
            <CopyButton text={tailwindSnippet} label="Copy Tailwind" />
          </div>
          <pre className="font-mono text-xs text-emerald-300 overflow-x-auto p-2 bg-zinc-900/50 rounded-lg truncate">
            {tailwindSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
