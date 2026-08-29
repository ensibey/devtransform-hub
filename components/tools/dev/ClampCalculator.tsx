'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Type, Sliders, Calculator, Check, ArrowRight } from 'lucide-react';

export function ClampCalculator() {
  const [minWidth, setMinWidth] = useState(360);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [minFontSize, setMinFontSize] = useState(16);
  const [maxFontSize, setMaxFontSize] = useState(32);
  const [rootFontSize, setRootFontSize] = useState(16);
  const [previewWidth, setPreviewWidth] = useState(768);

  const { clampString, slope, yAxisIntersection, currentCalculatedSize } = useMemo(() => {
    const minWidthRem = minWidth / rootFontSize;
    const maxWidthRem = maxWidth / rootFontSize;
    const minFontRem = minFontSize / rootFontSize;
    const maxFontRem = maxFontSize / rootFontSize;

    const slopeVal = (maxFontRem - minFontRem) / (maxWidthRem - minWidthRem);
    const yAxisIntersectionVal = -minWidthRem * slopeVal + minFontRem;

    const slopeVw = (slopeVal * 100).toFixed(4);
    const yAxisRem = yAxisIntersectionVal.toFixed(4);

    const clampStr = `clamp(${minFontRem}rem, ${yAxisRem}rem + ${slopeVw}vw, ${maxFontRem}rem)`;

    // Calculate current preview size
    let calculatedPx = minFontSize;
    if (previewWidth <= minWidth) {
      calculatedPx = minFontSize;
    } else if (previewWidth >= maxWidth) {
      calculatedPx = maxFontSize;
    } else {
      calculatedPx = minFontSize + ((previewWidth - minWidth) / (maxWidth - minWidth)) * (maxFontSize - minFontSize);
    }

    return {
      clampString: clampStr,
      slope: slopeVw,
      yAxisIntersection: yAxisRem,
      currentCalculatedSize: calculatedPx.toFixed(1),
    };
  }, [minWidth, maxWidth, minFontSize, maxFontSize, rootFontSize, previewWidth]);

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimensions Inputs */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Viewport & Typography Constraints</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <label className="text-zinc-400">Min Viewport (px):</label>
              <input
                type="number"
                value={minWidth}
                onChange={(e) => setMinWidth(parseInt(e.target.value) || 320)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-white font-bold focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <label className="text-zinc-400">Max Viewport (px):</label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1200)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-white font-bold focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <label className="text-brand-emerald font-bold">Min Font Size (px):</label>
              <input
                type="number"
                value={minFontSize}
                onChange={(e) => setMinFontSize(parseInt(e.target.value) || 14)}
                className="w-full bg-zinc-900 border border-brand-emerald/40 rounded px-2.5 py-1 text-white font-bold focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <label className="text-sky-400 font-bold">Max Font Size (px):</label>
              <input
                type="number"
                value={maxFontSize}
                onChange={(e) => setMaxFontSize(parseInt(e.target.value) || 24)}
                className="w-full bg-zinc-900 border border-sky-400/40 rounded px-2.5 py-1 text-white font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Responsive Font Preview Slider */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Simulated Viewport Width:</span>
            <span className="text-brand-emerald font-bold">{previewWidth}px ({currentCalculatedSize}px Font)</span>
          </div>

          <input
            type="range"
            min={minWidth - 60}
            max={maxWidth + 200}
            value={previewWidth}
            onChange={(e) => setPreviewWidth(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
          />

          {/* Fluid text render */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center min-h-[120px] text-center overflow-hidden">
            <p
              className="text-white font-bold tracking-tight transition-all duration-75 leading-tight"
              style={{ fontSize: `${currentCalculatedSize}px` }}
            >
              ZeroUpload Fluid Typography
            </p>
          </div>
        </div>
      </div>

      {/* Generated CSS Clamp */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">CSS font-size clamp Rule:</span>
          <CopyButton text={`font-size: ${clampString};`} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          font-size: {clampString};
        </pre>
      </div>
    </div>
  );
}
