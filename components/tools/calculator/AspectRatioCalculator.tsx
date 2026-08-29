'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Maximize2, Sparkles } from 'lucide-react';

const PRESETS = [
  { label: '16:9 (HD / YouTube)', w: 16, h: 9 },
  { label: '4:3 (Standard Photo)', w: 4, h: 3 },
  { label: '1:1 (Square / Instagram)', w: 1, h: 1 },
  { label: '21:9 (Ultrawide Cinema)', w: 21, h: 9 },
  { label: '9:16 (TikTok / Reels / Shorts)', w: 9, h: 16 },
  { label: '3:2 (Classic 35mm)', w: 3, h: 2 },
];

export function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);

  const [targetWidth, setTargetWidth] = useState(1920);
  const [targetHeight, setTargetHeight] = useState(1080);

  const updateFromWidth = (newW: number) => {
    setTargetWidth(newW);
    if (ratioW > 0) {
      setTargetHeight(Math.round((newW * ratioH) / ratioW));
    }
  };

  const updateFromHeight = (newH: number) => {
    setTargetHeight(newH);
    if (ratioH > 0) {
      setTargetWidth(Math.round((newH * ratioW) / ratioH));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
    setTargetHeight(Math.round((targetWidth * h) / w));
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.w, p.h)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              ratioW === p.w && ratioH === p.h
                ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/40'
                : 'bg-surface-200 hover:bg-surface-50 text-zinc-300 border-border'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimension Form */}
        <div className="p-6 rounded-2xl bg-surface-200 border border-border space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase">
            Aspect Ratio & Target Dimensions
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-mono text-xs mb-1">
                RATIO WIDTH (X)
              </label>
              <input
                type="number"
                value={ratioW}
                onChange={(e) => {
                  const rw = parseInt(e.target.value) || 1;
                  setRatioW(rw);
                  setTargetHeight(Math.round((targetWidth * ratioH) / rw));
                }}
                className="w-full bg-surface-300 border border-border rounded-xl p-3 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-mono text-xs mb-1">
                RATIO HEIGHT (Y)
              </label>
              <input
                type="number"
                value={ratioH}
                onChange={(e) => {
                  const rh = parseInt(e.target.value) || 1;
                  setRatioH(rh);
                  setTargetHeight(Math.round((targetWidth * rh) / ratioW));
                }}
                className="w-full bg-surface-300 border border-border rounded-xl p-3 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-zinc-300 font-medium text-xs mb-1">
                TARGET WIDTH (PX)
              </label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => updateFromWidth(parseInt(e.target.value) || 0)}
                className="w-full bg-surface-300 border border-border rounded-xl p-3 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium text-xs mb-1">
                TARGET HEIGHT (PX)
              </label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => updateFromHeight(parseInt(e.target.value) || 0)}
                className="w-full bg-surface-300 border border-border rounded-xl p-3 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>
          </div>

          <div className="p-3.5 bg-surface-300 rounded-xl border border-border flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono">Formula:</span>
            <span className="font-mono text-brand-emerald font-semibold">
              {targetWidth} × {targetHeight} ({ratioW}:{ratioH})
            </span>
          </div>
        </div>

        {/* Visual Aspect Ratio Box */}
        <div className="p-6 rounded-2xl bg-surface-200 border border-border flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-xs font-mono text-zinc-400 mb-4">
            Live Proportional Preview
          </div>
          <div className="w-full max-w-[280px] h-[220px] flex items-center justify-center">
            <div
              style={{
                aspectRatio: `${ratioW} / ${ratioH}`,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              className="w-full h-full border-2 border-brand-emerald bg-brand-emerald/10 rounded-xl flex items-center justify-center text-xs font-mono text-brand-emerald font-bold transition-all shadow-inner"
            >
              {targetWidth} × {targetHeight}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
