'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Image as ImageIcon, Sliders, Download, Check } from 'lucide-react';

const PRESETS = [
  { name: '1200 × 630 (OG / Social)', w: 1200, h: 630 },
  { name: '1920 × 1080 (Full HD)', w: 1920, h: 1080 },
  { name: '800 × 600 (Standard 4:3)', w: 800, h: 600 },
  { name: '400 × 400 (Square / Avatar)', w: 400, h: 400 },
  { name: '300 × 250 (Medium Banner)', w: 300, h: 250 },
];

export function PlaceholderGenerator() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [bgColor, setBgColor] = useState('#18181b');
  const [textColor, setTextColor] = useState('#10b981');
  const [customText, setCustomText] = useState('');

  const displayText = customText.trim() || `${width} × ${height}`;

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}" />
  <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="${Math.max(14, Math.floor(Math.min(width, height) / 10))}" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
    ${displayText}
  </text>
</svg>`;

  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`;

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placeholder-${width}x${height}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Strip */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <span className="text-xs font-mono text-zinc-400">Popular Dimensions:</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setWidth(p.w);
                setHeight(p.h);
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Controls & Live Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Dimensions & Palette</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400">Width (px):</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Height (px):</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Custom Display Text (optional):</label>
              <input
                type="text"
                placeholder={`${width} × ${height}`}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Background:</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Text Color:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live SVG Preview */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>SVG Preview:</span>
            <button
              type="button"
              onClick={downloadSvg}
              className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .svg</span>
            </button>
          </div>

          <div className="h-[200px] rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center p-4 overflow-hidden">
            <div
              className="max-h-full max-w-full shadow-lg rounded"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>
        </div>
      </div>

      {/* Snippet Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SVG Markup */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
            <span className="font-bold">Raw SVG Markup:</span>
            <CopyButton text={svgCode} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[150px]">
            {svgCode}
          </pre>
        </div>

        {/* Data URI */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
            <span className="font-bold">Data URI (for HTML &lt;img src=&quot;...&quot;&gt;):</span>
            <CopyButton text={dataUri} />
          </div>
          <textarea
            readOnly
            value={dataUri}
            rows={6}
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none resize-none overflow-x-auto"
          />
        </div>
      </div>
    </div>
  );
}
