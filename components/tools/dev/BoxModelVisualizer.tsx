'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Box, Sliders, Layers, Check } from 'lucide-react';

export function BoxModelVisualizer() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(4);
  const [margin, setMargin] = useState(24);
  const [boxSizing, setBoxSizing] = useState<'content-box' | 'border-box'>('border-box');

  const totalRenderedWidth = boxSizing === 'border-box'
    ? width + margin * 2
    : width + padding * 2 + border * 2 + margin * 2;

  const totalRenderedHeight = boxSizing === 'border-box'
    ? height + margin * 2
    : height + padding * 2 + border * 2 + margin * 2;

  const innerContentWidth = boxSizing === 'border-box'
    ? Math.max(0, width - padding * 2 - border * 2)
    : width;

  const innerContentHeight = boxSizing === 'border-box'
    ? Math.max(0, height - padding * 2 - border * 2)
    : height;

  const cssCode = `.box {
  box-sizing: ${boxSizing};
  width: ${width}px;
  height: ${height}px;
  padding: ${padding}px;
  border: ${border}px solid #38bdf8;
  margin: ${margin}px;
}`;

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Live Nested Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Sliders className="w-4 h-4 text-brand-emerald" />
              <span>Box Sizing & Dimensions</span>
            </div>

            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setBoxSizing('border-box')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  boxSizing === 'border-box' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400'
                }`}
              >
                border-box
              </button>
              <button
                type="button"
                onClick={() => setBoxSizing('content-box')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  boxSizing === 'content-box' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400'
                }`}
              >
                content-box
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>CSS Width:</span>
                <span className="text-white font-bold">{width}px</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>CSS Height:</span>
                <span className="text-white font-bold">{height}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-emerald-400">
                <span>Padding:</span>
                <span className="font-bold">{padding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-sky-400">
                <span>Border:</span>
                <span className="font-bold">{border}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={border}
                onChange={(e) => setBorder(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-amber-400">
                <span>Margin:</span>
                <span className="font-bold">{margin}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Visual Box Model Diagram */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Rendered Footprint:</span>
            <span className="text-brand-emerald font-bold">{totalRenderedWidth}px × {totalRenderedHeight}px</span>
          </div>

          {/* Nested Box Model Graphic */}
          <div className="min-h-[260px] flex items-center justify-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-[10px]">
            {/* Margin (Amber) */}
            <div className="p-3 bg-amber-500/10 border border-dashed border-amber-500/40 rounded-xl text-amber-400 text-center space-y-1">
              <div className="uppercase font-bold tracking-wider">Margin ({margin}px)</div>
              
              {/* Border (Sky) */}
              <div className="p-2.5 bg-sky-500/15 border border-sky-400 rounded-lg text-sky-300 space-y-1">
                <div className="uppercase font-bold tracking-wider">Border ({border}px)</div>

                {/* Padding (Emerald) */}
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-md text-emerald-300 space-y-1">
                  <div className="uppercase font-bold tracking-wider">Padding ({padding}px)</div>

                  {/* Content (Indigo) */}
                  <div className="p-4 bg-indigo-600/30 border border-indigo-400 rounded text-indigo-200 font-bold">
                    <div>Content Area</div>
                    <div className="text-xs text-white mt-0.5">{innerContentWidth} × {innerContentHeight}px</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated CSS Box */}
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
