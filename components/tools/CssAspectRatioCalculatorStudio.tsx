'use client';

import React, { useState, useMemo } from 'react';
import { Ratio, Copy, Check, Sparkles, RefreshCw, Box, Sliders } from 'lucide-react';

interface RatioPreset {
  name: string;
  w: number;
  h: number;
  label: string;
}

const COMMON_PRESETS: RatioPreset[] = [
  { name: '16:9 (Widescreen)', w: 16, h: 9, label: 'YouTube, HDTV, Monitors' },
  { name: '4:3 (Standard)', w: 4, h: 3, label: 'Classic TV, iPad displays' },
  { name: '1:1 (Square)', w: 1, h: 1, label: 'Instagram Posts, Avatars' },
  { name: '9:16 (Vertical)', w: 9, h: 16, label: 'TikTok, Instagram Reels, Shorts' },
  { name: '21:9 (Ultrawide)', w: 21, h: 9, label: 'Cinematic Ultrawide monitors' },
  { name: '3:2 (Photography)', w: 3, h: 2, label: 'DSLR sensors, 35mm film' },
  { name: '5:4 (Display)', w: 5, h: 4, label: 'Large format prints' },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function CssAspectRatioCalculatorStudio() {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [copied, setCopied] = useState<string | null>(null);

  // Calculate simplified ratio
  const { ratioW, ratioH, decimalRatio, calculatedTargetHeight } = useMemo(() => {
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    const divisor = gcd(w, h);

    const ratioW = w / divisor;
    const ratioH = h / divisor;
    const decimalRatio = Number((w / h).toFixed(4));
    const calculatedTargetHeight = Math.round(targetWidth / (w / h));

    return { ratioW, ratioH, decimalRatio, calculatedTargetHeight };
  }, [width, height, targetWidth]);

  // Code snippets
  const cssProperty = useMemo(() => {
    return `aspect-ratio: ${ratioW} / ${ratioH};`;
  }, [ratioW, ratioH]);

  const tailwindSnippet = useMemo(() => {
    if (ratioW === 16 && ratioH === 9) return 'aspect-video';
    if (ratioW === 1 && ratioH === 1) return 'aspect-square';
    return `aspect-[${ratioW}/${ratioH}]`;
  }, [ratioW, ratioH]);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: RatioPreset) => {
    setWidth(p.w * 120);
    setHeight(p.h * 120);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Ratio className="w-6 h-6 text-indigo-400" />
              CSS Aspect Ratio Calculator & Resizer
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Calculate simplified aspect ratios (GCD), compute scaled dimensions, and export modern CSS aspect-ratio properties.
            </p>
          </div>

          <button
            onClick={() => {
              setWidth(1920);
              setHeight(1080);
              setTargetWidth(800);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset 16:9
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Standard Ratios:
          </span>
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition"
            >
              <span>{p.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Dimensions Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-400" />
              Base Dimensions (Pixels)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Width (W)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">px</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Height (H)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Resizer Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Proportional Resizer
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Set New Target Width</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                />
                <span className="text-xs text-slate-500 font-mono">px</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Calculated Target Height:</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{calculatedTargetHeight}px</span>
            </div>
          </div>
        </div>

        {/* Live Preview & Output Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[240px]">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Simplified Aspect Ratio
            </div>
            <div className="text-5xl font-mono font-black text-indigo-400 my-1">
              {ratioW}:{ratioH}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Decimal Value: {decimalRatio}
            </div>
          </div>

          {/* Generated Code Boxes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CSS aspect-ratio
              </span>
              <button
                onClick={() => copyCode(cssProperty, 'css')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'css' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
              {cssProperty}
            </pre>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tailwind CSS Utility
              </span>
              <button
                onClick={() => copyCode(tailwindSnippet, 'tailwind')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5"
              >
                {copied === 'tailwind' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'tailwind' ? 'Copied' : 'Copy Tailwind'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              {tailwindSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
