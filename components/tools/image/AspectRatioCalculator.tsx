'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Maximize2, Proportions, RefreshCw, Check } from 'lucide-react';

const PRESETS = [
  { label: '16:9 (Widescreen / YouTube)', w: 16, h: 9 },
  { label: '9:16 (TikTok / Reels / Shorts)', w: 9, h: 16 },
  { label: '1:1 (Square / Instagram)', w: 1, h: 1 },
  { label: '4:3 (Classic Display / iPad)', w: 4, h: 3 },
  { label: '21:9 (UltraWide Cinema)', w: 21, h: 9 },
  { label: '3:2 (DSLR Photography)', w: 3, h: 2 },
];

export function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState<number | string>(16);
  const [ratioH, setRatioH] = useState<number | string>(9);
  const [width, setWidth] = useState<number | string>(1920);
  const [height, setHeight] = useState<number | string>(1080);

  const numRatioW = parseFloat(`${ratioW}`) || 1;
  const numRatioH = parseFloat(`${ratioH}`) || 1;

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const num = parseFloat(val);
    if (!isNaN(num) && numRatioW > 0) {
      setHeight(Math.round((num * numRatioH) / numRatioW));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && numRatioH > 0) {
      setWidth(Math.round((num * numRatioW) / numRatioH));
    }
  };

  const handlePresetSelect = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
    const currentW = parseFloat(`${width}`) || 1920;
    setHeight(Math.round((currentW * h) / w));
  };

  const cssAspectRatio = `${numRatioW} / ${numRatioH}`;

  return (
    <div className="space-y-6">
      {/* Preset Buttons */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <span className="text-xs font-mono text-zinc-400">Popular Presets (Hazır Şablonlar):</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handlePresetSelect(p.w, p.h)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                numRatioW === p.w && numRatioH === p.h
                  ? 'bg-brand-emerald text-black font-bold shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Inputs & Real-time Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimensions Inputs */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Proportions className="w-4 h-4 text-brand-emerald" />
            <span>Ratio & Dimensions</span>
          </div>

          {/* Ratio Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Ratio Width (X):</label>
              <input
                type="number"
                value={ratioW}
                onChange={(e) => setRatioW(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Ratio Height (Y):</label>
              <input
                type="number"
                value={ratioH}
                onChange={(e) => setRatioH(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          {/* Calculated Dimensions */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-brand-emerald font-bold">Pixel Width (px):</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-brand-emerald/40 font-mono text-sm text-white font-bold focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-sky-400 font-bold">Pixel Height (px):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-sky-400/40 font-mono text-sm text-white font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* CSS Rule Copy */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300">
            <span>CSS: <code className="text-brand-emerald">aspect-ratio: {cssAspectRatio};</code></span>
            <CopyButton text={`aspect-ratio: ${cssAspectRatio};`} />
          </div>
        </div>

        {/* Scaled Visual Preview */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Live Scaled Preview:</span>
            <span className="text-brand-emerald font-bold">{width} × {height} px</span>
          </div>

          <div className="h-[220px] rounded-xl bg-zinc-950/80 border border-dashed border-zinc-800 flex items-center justify-center p-4 overflow-hidden">
            <div
              className="bg-gradient-to-br from-brand-emerald/20 to-sky-500/20 border-2 border-brand-emerald rounded-lg flex flex-col items-center justify-center text-xs font-mono font-bold text-white shadow-lg transition-all duration-300 max-h-full max-w-full"
              style={{
                aspectRatio: cssAspectRatio,
                width: numRatioW >= numRatioH ? '100%' : 'auto',
                height: numRatioH > numRatioW ? '100%' : 'auto',
              }}
            >
              <span>{numRatioW}:{numRatioH}</span>
              <span className="text-[10px] text-zinc-400 font-normal">{width} × {height}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
