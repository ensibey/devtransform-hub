'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Ratio, Sliders, Check } from 'lucide-react';

const RATIOS = [
  { name: '16:9 (Widescreen, YouTube)', w: 16, h: 9 },
  { name: '4:3 (Classic TV / Tablet)', w: 4, h: 3 },
  { name: '1:1 (Square, Instagram)', w: 1, h: 1 },
  { name: '9:16 (Stories, TikTok, Reels)', w: 9, h: 16 },
  { name: '21:9 (Ultrawide Cinema)', w: 21, h: 9 },
  { name: '3:2 (Photography 35mm)', w: 3, h: 2 },
];

export function AspectRatioVisualizer() {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const updateByWidth = (newW: number) => {
    setWidth(newW);
    setHeight(Math.round((newW * ratioH) / ratioW));
  };

  const updateByHeight = (newH: number) => {
    setHeight(newH);
    setWidth(Math.round((newH * ratioW) / ratioH));
  };

  const applyRatio = (rw: number, rh: number) => {
    setRatioW(rw);
    setRatioH(rh);
    setHeight(Math.round((width * rh) / rw));
  };

  const cssCode = `.aspect-box {\n  aspect-ratio: ${ratioW} / ${ratioH};\n  width: ${width}px;\n  height: ${height}px;\n}`;

  return (
    <div className="space-y-6">
      {/* Ratio Presets */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <span className="text-xs font-mono text-zinc-400">Popular Aspect Ratios:</span>
        <div className="flex flex-wrap gap-2">
          {RATIOS.map((r) => (
            <button
              key={r.name}
              type="button"
              onClick={() => applyRatio(r.w, r.h)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                ratioW === r.w && ratioH === r.h
                  ? 'bg-brand-emerald text-black font-black'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Inputs & Visual Ratio Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimensions */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Target Width & Height (Pixels)</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-zinc-400">Width (px):</label>
              <input
                type="number"
                value={width}
                onChange={(e) => updateByWidth(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Height (px):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => updateByHeight(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-500 uppercase">Ratio:</span>
                <div className="text-sm font-bold text-brand-emerald">{ratioW}:{ratioH}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-500 uppercase">Decimal:</span>
                <div className="text-sm font-bold text-sky-400">{(ratioW / ratioH).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Visual Aspect Ratio Box */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Visual Proportion:</span>
            <span className="text-brand-emerald font-bold">{width}px × {height}px</span>
          </div>

          <div className="h-[220px] rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center p-4 overflow-hidden">
            <div
              className="max-h-full max-w-full bg-emerald-500/20 border-2 border-brand-emerald rounded-xl flex items-center justify-center font-mono text-xs font-bold text-brand-emerald shadow-lg transition-all"
              style={{
                aspectRatio: `${ratioW} / ${ratioH}`,
                width: ratioW >= ratioH ? '100%' : 'auto',
                height: ratioH > ratioW ? '100%' : 'auto',
              }}
            >
              {ratioW}:{ratioH}
            </div>
          </div>
        </div>
      </div>

      {/* Snippet Output */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">Generated CSS:</span>
          <CopyButton text={cssCode} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
