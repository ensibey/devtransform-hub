'use client';

import React, { useState, useMemo } from 'react';
import { Triangle, Copy, Check, RefreshCw, Sparkles, Box, Sliders } from 'lucide-react';

type Direction =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export function CssTriangleGeneratorStudio() {
  const [direction, setDirection] = useState<Direction>('top');
  const [width, setWidth] = useState<number>(40);
  const [height, setHeight] = useState<number>(40);
  const [color, setColor] = useState<string>('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);

  // Compute borders based on direction
  const triangleStyle = useMemo((): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (direction) {
      case 'top':
        return {
          ...base,
          borderWidth: `0 ${width / 2}px ${height}px ${width / 2}px`,
          borderColor: `transparent transparent ${color} transparent`,
        };
      case 'bottom':
        return {
          ...base,
          borderWidth: `${height}px ${width / 2}px 0 ${width / 2}px`,
          borderColor: `${color} transparent transparent transparent`,
        };
      case 'left':
        return {
          ...base,
          borderWidth: `${height / 2}px ${width}px ${height / 2}px 0`,
          borderColor: `transparent ${color} transparent transparent`,
        };
      case 'right':
        return {
          ...base,
          borderWidth: `${height / 2}px 0 ${height / 2}px ${width}px`,
          borderColor: `transparent transparent transparent ${color}`,
        };
      case 'top-left':
        return {
          ...base,
          borderWidth: `${height}px ${width}px 0 0`,
          borderColor: `${color} transparent transparent transparent`,
        };
      case 'top-right':
        return {
          ...base,
          borderWidth: `0 ${width}px ${height}px 0`,
          borderColor: `transparent ${color} transparent transparent`,
        };
      case 'bottom-left':
        return {
          ...base,
          borderWidth: `${height}px 0 0 ${width}px`,
          borderColor: `transparent transparent transparent ${color}`,
        };
      case 'bottom-right':
        return {
          ...base,
          borderWidth: `0 0 ${height}px ${width}px`,
          borderColor: `transparent transparent ${color} transparent`,
        };
    }
  }, [direction, width, height, color]);

  // CSS Code
  const cssCode = useMemo(() => {
    const style = triangleStyle;
    return `width: 0;
height: 0;
border-style: solid;
border-width: ${style.borderWidth};
border-color: ${style.borderColor};`;
  }, [triangleStyle]);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Triangle className="w-6 h-6 text-indigo-400" />
              CSS Triangle & Arrow Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Create lightweight pure CSS triangles and tooltip pointers using zero-pixel dimensions and border math.
            </p>
          </div>

          <button
            onClick={() => {
              setDirection('top');
              setWidth(40);
              setHeight(40);
              setColor('#6366f1');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Direction */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Pointer Direction
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'top', label: 'Top ▲' },
                  { id: 'bottom', label: 'Bottom ▼' },
                  { id: 'left', label: 'Left ◀' },
                  { id: 'right', label: 'Right ▶' },
                  { id: 'top-left', label: 'Top-Left ◤' },
                  { id: 'top-right', label: 'Top-Right ◥' },
                  { id: 'bottom-left', label: 'Bottom-Left ◣' },
                  { id: 'bottom-right', label: 'Bottom-Right ◢' },
                ] as { id: Direction; label: string }[]
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDirection(d.id)}
                  className={`py-2 px-2 text-xs rounded-lg border text-center transition font-medium ${
                    direction === d.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color & Size Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Dimensions & Tint
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">
                Triangle Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono uppercase"
                />
              </div>
            </div>

            {/* Width Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Triangle Base Width</span>
                <span className="text-white font-mono">{width}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="160"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Triangle Altitude Height</span>
                <span className="text-white font-mono">{height}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="160"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Code */}
        <div className="lg:col-span-6 space-y-5">
          {/* Stage */}
          <div className="rounded-2xl p-8 flex items-center justify-center min-h-[280px] bg-slate-950 border border-slate-800 relative overflow-hidden">
            <div style={triangleStyle} className="transition-all drop-shadow-md" />

            <div className="absolute bottom-3 right-3 text-[11px] px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400 font-mono">
              {width}×{height}px
            </div>
          </div>

          {/* Generated CSS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pure CSS Declaration
              </span>
              <button
                onClick={() => copyCode(cssCode, 'css')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'css' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
              {cssCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
