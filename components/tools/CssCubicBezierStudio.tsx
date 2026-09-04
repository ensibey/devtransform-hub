'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, Copy, Check, Sparkles, RefreshCw, Play, RotateCcw } from 'lucide-react';

interface BezierPreset {
  name: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  desc: string;
}

const PRESETS: BezierPreset[] = [
  { name: 'Standard Ease', x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0, desc: 'CSS default ease curve' },
  { name: 'Ease-In', x1: 0.42, y1: 0.0, x2: 1.0, y2: 1.0, desc: 'Starts slow, accelerates' },
  { name: 'Ease-Out', x1: 0.0, y1: 0.0, x2: 0.58, y2: 1.0, desc: 'Starts fast, decelerates' },
  { name: 'Ease-In-Out', x1: 0.42, y1: 0.0, x2: 0.58, y2: 1.0, desc: 'Smooth slow start and finish' },
  { name: 'Snappy Bounce / Spring', x1: 0.68, y1: -0.55, x2: 0.265, y2: 1.55, desc: 'Overshoots for playful bounce' },
  { name: 'Subtle Swift', x1: 0.16, y1: 1.0, x2: 0.3, y2: 1.0, desc: 'Modern responsive feel' },
  { name: 'Linear', x1: 0.0, y1: 0.0, x2: 1.0, y2: 1.0, desc: 'Constant mechanical velocity' },
];

export function CssCubicBezierStudio() {
  const [x1, setX1] = useState<number>(0.25);
  const [y1, setY1] = useState<number>(0.1);
  const [x2, setX2] = useState<number>(0.25);
  const [y2, setY2] = useState<number>(1.0);
  const [duration, setDuration] = useState<number>(1.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);

  const bezierString = useMemo(() => {
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  }, [x1, y1, x2, y2]);

  const cssDeclaration = useMemo(() => {
    return `transition: transform ${duration}s ${bezierString};`;
  }, [duration, bezierString]);

  const tailwindSnippet = useMemo(() => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionTimingFunction: {
        'custom-curve': '${bezierString}',
      },
    },
  },
};`;
  }, [bezierString]);

  // SVG coordinate transformation
  // SVG box is 200x200 with padding
  const svgW = 220;
  const svgH = 220;
  const pad = 20;
  const graphW = svgW - pad * 2;
  const graphH = svgH - pad * 2;

  const toSvgX = (x: number) => pad + x * graphW;
  const toSvgY = (y: number) => pad + (1 - y) * graphH;

  const p0 = { x: toSvgX(0), y: toSvgY(0) };
  const p1 = { x: toSvgX(x1), y: toSvgY(y1) };
  const p2 = { x: toSvgX(x2), y: toSvgY(y2) };
  const p3 = { x: toSvgX(1), y: toSvgY(1) };

  const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  const triggerAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: BezierPreset) => {
    setX1(p.x1);
    setY1(p.y1);
    setX2(p.x2);
    setY2(p.y2);
    triggerAnimation();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-indigo-400" />
              CSS Cubic Bezier Easing Curve Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Design smooth animation acceleration curves with interactive control handles and live motion preview.
            </p>
          </div>

          <button
            onClick={() => applyPreset(PRESETS[0])}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Ease
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph & Sliders Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Curve Visualization SVG */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
            <svg width={svgW} height={svgH} className="overflow-visible select-none">
              {/* Grid Background */}
              <rect x={pad} y={pad} width={graphW} height={graphH} fill="#090d16" rx="8" stroke="#1e293b" />
              <line x1={pad} y1={toSvgY(0)} x2={pad + graphW} y2={toSvgY(1)} stroke="#334155" strokeDasharray="3 3" />

              {/* Control handle lines */}
              <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#6366f1" strokeWidth="2" />
              <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} stroke="#10b981" strokeWidth="2" />

              {/* Bezier Spline */}
              <path d={pathD} fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />

              {/* Control handle handles */}
              <circle cx={p1.x} cy={p1.y} r="6" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={p2.x} cy={p2.y} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {/* Start and end points */}
              <circle cx={p0.x} cy={p0.y} r="4" fill="#94a3b8" />
              <circle cx={p3.x} cy={p3.y} r="4" fill="#94a3b8" />
            </svg>

            <div className="mt-4 text-center">
              <code className="text-sm font-bold text-indigo-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                {bezierString}
              </code>
            </div>
          </div>

          {/* Coordinate Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Point 1 (Indigo) */}
              <div className="space-y-3 p-3 bg-slate-950/60 rounded-xl border border-indigo-900/40">
                <span className="text-xs font-bold text-indigo-400 block">Control Point 1 (X1, Y1)</span>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>X1</span>
                    <span className="font-mono text-white">{x1}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={x1}
                    onChange={(e) => setX1(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Y1</span>
                    <span className="font-mono text-white">{y1}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="2"
                    step="0.01"
                    value={y1}
                    onChange={(e) => setY1(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Point 2 (Emerald) */}
              <div className="space-y-3 p-3 bg-slate-950/60 rounded-xl border border-emerald-900/40">
                <span className="text-xs font-bold text-emerald-400 block">Control Point 2 (X2, Y2)</span>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>X2</span>
                    <span className="font-mono text-white">{x2}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={x2}
                    onChange={(e) => setX2(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Y2</span>
                    <span className="font-mono text-white">{y2}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="2"
                    step="0.01"
                    value={y2}
                    onChange={(e) => setY2(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Motion Test & Export Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Motion Simulation Stage */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Interactive Motion Preview
              </span>
              <button
                onClick={triggerAnimation}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play Motion
              </button>
            </div>

            {/* Moving Track */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
              {/* Custom Curve */}
              <div>
                <div className="text-[11px] text-slate-400 mb-2 flex justify-between">
                  <span>Custom Easing:</span>
                  <span className="text-indigo-400 font-mono text-[10px]">{bezierString}</span>
                </div>
                <div className="h-10 bg-slate-900 rounded-lg p-1 relative overflow-hidden">
                  <div
                    className={`w-8 h-8 rounded-md bg-indigo-500 shadow-md ${isPlaying ? 'translate-x-[260px] sm:translate-x-[360px]' : 'translate-x-0'}`}
                    style={{
                      transitionProperty: 'transform',
                      transitionDuration: `${duration}s`,
                      transitionTimingFunction: bezierString,
                    }}
                  />
                </div>
              </div>

              {/* Linear Reference */}
              <div>
                <div className="text-[11px] text-slate-500 mb-2">Linear Comparison (Reference):</div>
                <div className="h-10 bg-slate-900 rounded-lg p-1 relative overflow-hidden">
                  <div
                    className={`w-8 h-8 rounded-md bg-slate-700 shadow-md ${isPlaying ? 'translate-x-[260px] sm:translate-x-[360px]' : 'translate-x-0'}`}
                    style={{
                      transitionProperty: 'transform',
                      transitionDuration: `${duration}s`,
                      transitionTimingFunction: 'linear',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generated CSS Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CSS Transition Declaration
              </span>
              <button
                onClick={() => copyCode(cssDeclaration, 'css')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'css' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
              {cssDeclaration}
            </pre>
          </div>

          {/* Tailwind Config Box */}
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
