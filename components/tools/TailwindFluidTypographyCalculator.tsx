'use client';

import React, { useState, useMemo } from 'react';
import { Type, Copy, Check, Sparkles, RefreshCw, Sliders, Monitor, Smartphone } from 'lucide-react';

interface PresetScale {
  name: string;
  minPx: number;
  maxPx: number;
  label: string;
}

const PRESETS: PresetScale[] = [
  { name: 'Display Headline', minPx: 32, maxPx: 64, label: 'Hero Display' },
  { name: 'H1 Section Heading', minPx: 26, maxPx: 44, label: 'Page Title' },
  { name: 'H2 Subtitle', minPx: 20, maxPx: 32, label: 'Section Header' },
  { name: 'Body Text', minPx: 14, maxPx: 18, label: 'Standard Copy' },
  { name: 'Small / Caption', minPx: 12, maxPx: 14, label: 'Metadata' },
];

export function TailwindFluidTypographyCalculator() {
  const [minVw, setMinVw] = useState<number>(375); // Mobile width px
  const [maxVw, setMaxVw] = useState<number>(1440); // Desktop width px
  const [minFs, setMinFs] = useState<number>(18); // Min font size px
  const [maxFs, setMaxFs] = useState<number>(36); // Max font size px
  const [rootFs, setRootFs] = useState<number>(16); // Default 1rem = 16px

  const [previewWidth, setPreviewWidth] = useState<number>(800);
  const [copied, setCopied] = useState<string | null>(null);

  // Calculate clamp formula:
  // slope = (maxFs - minFs) / (maxVw - minVw)
  // slopeVw = slope * 100
  // interceptRem = (minFs - slope * minVw) / rootFs
  const { clampCss, tailwindSnippet, currentPreviewFs } = useMemo(() => {
    const slope = (maxFs - minFs) / (maxVw - minVw);
    const slopeVw = Number((slope * 100).toFixed(3));
    const interceptRem = Number(((minFs - slope * minVw) / rootFs).toFixed(3));

    const minRem = Number((minFs / rootFs).toFixed(3));
    const maxRem = Number((maxFs / rootFs).toFixed(3));

    const preferred = `${interceptRem}rem + ${slopeVw}vw`;
    const clampCss = `clamp(${minRem}rem, ${preferred}, ${maxRem}rem)`;

    const tailwindSnippet = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'fluid-heading': '${clampCss}',
      },
    },
  },
};`;

    // Simulated size at previewWidth
    let simulated = minFs + slope * (previewWidth - minVw);
    simulated = Math.max(minFs, Math.min(maxFs, simulated));
    const currentPreviewFs = Number(simulated.toFixed(1));

    return { clampCss, tailwindSnippet, currentPreviewFs };
  }, [minVw, maxVw, minFs, maxFs, rootFs, previewWidth]);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: PresetScale) => {
    setMinFs(p.minPx);
    setMaxFs(p.maxPx);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Type className="w-6 h-6 text-indigo-400" />
              Tailwind & CSS Fluid Typography Clamp Calculator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Calculate ultra-smooth CSS clamp() font scaling between mobile and desktop screen sizes without media query breakpoint jumps.
            </p>
          </div>

          <button
            onClick={() => {
              setMinVw(375);
              setMaxVw(1440);
              setMinFs(18);
              setMaxFs(36);
              setRootFs(16);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Scale Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>{p.name}</span>
              <span className="text-slate-400 font-mono">({p.minPx}px → {p.maxPx}px)</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Viewport Range Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-400" />
              Target Viewport Range (px)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Min Viewport (Mobile)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minVw}
                    onChange={(e) => setMinVw(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">px</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Max Viewport (Desktop)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={maxVw}
                    onChange={(e) => setMaxVw(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Font Size Bounds */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" />
              Font Size Bounds
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Minimum Font Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minFs}
                    onChange={(e) => setMinFs(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">px</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Maximum Font Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={maxFs}
                    onChange={(e) => setMaxFs(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Root Font Size */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Root Rem Base (default: 16px)
            </label>
            <div className="flex items-center gap-2 max-w-xs">
              <input
                type="number"
                value={rootFs}
                onChange={(e) => setRootFs(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
              <span className="text-xs text-slate-500 font-mono">px = 1rem</span>
            </div>
          </div>
        </div>

        {/* Live Simulation & Output Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Interactive Screen Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Viewport Width Slider: <strong className="text-indigo-400 font-mono">{previewWidth}px</strong>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Rendered: {currentPreviewFs}px
              </span>
            </div>

            <input
              type="range"
              min={minVw}
              max={maxVw}
              value={previewWidth}
              onChange={(e) => setPreviewWidth(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            {/* Typography Preview Stage */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 min-h-[160px] flex items-center justify-center overflow-hidden">
              <div
                className="font-bold text-white tracking-tight text-center leading-tight transition-all duration-75"
                style={{ fontSize: `${currentPreviewFs}px` }}
              >
                Responsive Headline
              </div>
            </div>
          </div>

          {/* Generated Clamp CSS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CSS clamp() Value
              </span>
              <button
                onClick={() => copyCode(clampCss, 'clamp')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied === 'clamp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'clamp' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
              font-size: {clampCss};
            </pre>
          </div>

          {/* Tailwind Config Export */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tailwind CSS Config
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
