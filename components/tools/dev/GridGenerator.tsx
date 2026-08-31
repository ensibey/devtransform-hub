'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { LayoutGrid, Sliders, Check } from 'lucide-react';

export function GridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gapX, setGapX] = useState(16);
  const [gapY, setGapY] = useState(16);

  const itemCount = cols * rows;

  const cssCode = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, minmax(0, 1fr));
  grid-template-rows: repeat(${rows}, minmax(0, 1fr));
  column-gap: ${gapX}px;
  row-gap: ${gapY}px;
}`;

  const tailwindClasses = `grid grid-cols-${cols} grid-rows-${rows} gap-x-[${gapX}px] gap-y-[${gapY}px]`;

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Grid Layout Dimensions</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {/* Columns */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Columns:</span>
                <span className="text-white font-bold">{cols} Cols</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Rows */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Rows:</span>
                <span className="text-white font-bold">{rows} Rows</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Gap X */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Col Gap:</span>
                <span className="text-white font-bold">{gapX}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={gapX}
                onChange={(e) => setGapX(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Gap Y */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Row Gap:</span>
                <span className="text-white font-bold">{gapY}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={gapY}
                onChange={(e) => setGapY(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>
          </div>
        </div>

        {/* Live Visual Grid Preview */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Visual Matrix Preview:</span>
            <span className="text-brand-emerald font-bold">{cols} × {rows} ({itemCount} Cells)</span>
          </div>

          <div
            className="w-full h-[220px] p-3 rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              columnGap: `${gapX}px`,
              rowGap: `${gapY}px`,
            }}
          >
            {Array.from({ length: itemCount }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-zinc-900/90 border border-emerald-500/30 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 shadow-sm"
              >
                #{idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Snippet Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CSS Code */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
            <span className="font-bold">Standard CSS:</span>
            <CopyButton text={cssCode} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
            {cssCode}
          </pre>
        </div>

        {/* Tailwind Classes */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Tailwind CSS Utility:</span>
              <CopyButton text={tailwindClasses} />
            </div>
            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-sky-300 overflow-x-auto">
              {tailwindClasses}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
