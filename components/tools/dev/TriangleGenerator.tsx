'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Play, Sliders, Palette, Check } from 'lucide-react';

type Direction = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function TriangleGenerator() {
  const [direction, setDirection] = useState<Direction>('top');
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(30);
  const [color, setColor] = useState('#10b981');

  const getBorderStyles = () => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    switch (direction) {
      case 'top':
        return {
          borderWidth: `0 ${halfWidth}px ${height}px ${halfWidth}px`,
          borderColor: `transparent transparent ${color} transparent`,
        };
      case 'bottom':
        return {
          borderWidth: `${height}px ${halfWidth}px 0 ${halfWidth}px`,
          borderColor: `${color} transparent transparent transparent`,
        };
      case 'left':
        return {
          borderWidth: `${halfHeight}px ${width}px ${halfHeight}px 0`,
          borderColor: `transparent ${color} transparent transparent`,
        };
      case 'right':
        return {
          borderWidth: `${halfHeight}px 0 ${halfHeight}px ${width}px`,
          borderColor: `transparent transparent transparent ${color}`,
        };
      case 'top-left':
        return {
          borderWidth: `${height}px ${width}px 0 0`,
          borderColor: `${color} transparent transparent transparent`,
        };
      case 'top-right':
        return {
          borderWidth: `0 ${width}px ${height}px 0`,
          borderColor: `transparent ${color} transparent transparent`,
        };
      case 'bottom-left':
        return {
          borderWidth: `${height}px 0 0 ${width}px`,
          borderColor: `transparent transparent transparent ${color}`,
        };
      case 'bottom-right':
        return {
          borderWidth: `0 0 ${height}px ${width}px`,
          borderColor: `transparent transparent ${color} transparent`,
        };
    }
  };

  const borderStyles = getBorderStyles();

  const cssCode = `.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${borderStyles.borderWidth};
  border-color: ${borderStyles.borderColor};
}`;

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Triangle Direction & Dimensions</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {/* Direction */}
            <div className="col-span-2 space-y-1">
              <label className="text-zinc-400">Direction:</label>
              <select
                value={direction}
                onChange={(e: any) => setDirection(e.target.value)}
                className="w-full p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald capitalize"
              >
                <option value="top">Top (Yukarı)</option>
                <option value="bottom">Bottom (Aşağı)</option>
                <option value="left">Left (Sola)</option>
                <option value="right">Right (Sağa)</option>
                <option value="top-left">Top-Left (Sol Üst Köşe)</option>
                <option value="top-right">Top-Right (Sağ Üst Köşe)</option>
                <option value="bottom-left">Bottom-Left (Sol Alt Köşe)</option>
                <option value="bottom-right">Bottom-Right (Sağ Alt Köşe)</option>
              </select>
            </div>

            {/* Width */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Width:</span>
                <span className="text-white font-bold">{width}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Height */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Height:</span>
                <span className="text-white font-bold">{height}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Color */}
            <div className="col-span-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Color:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-white uppercase focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Canvas */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Live CSS Triangle:</span>
            <span className="text-brand-emerald font-bold">{direction}</span>
          </div>

          <div className="h-[200px] rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center p-4 overflow-hidden">
            <div
              style={{
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: borderStyles.borderWidth,
                borderColor: borderStyles.borderColor,
                transition: 'all 0.1s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Generated CSS Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">CSS Code:</span>
          <CopyButton text={cssCode} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
