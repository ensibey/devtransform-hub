'use client';

import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  Layers, 
  Code, 
  Plus, 
  Trash2 
} from 'lucide-react';

interface MeshPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface Preset {
  name: string;
  bgColor: string;
  points: MeshPoint[];
}

const PRESETS: Preset[] = [
  {
    name: 'Northern Lights',
    bgColor: '#030712',
    points: [
      { id: '1', x: 20, y: 20, radius: 60, color: '#10b981' },
      { id: '2', x: 80, y: 30, radius: 70, color: '#06b6d4' },
      { id: '3', x: 40, y: 80, radius: 65, color: '#6366f1' },
      { id: '4', x: 75, y: 75, radius: 55, color: '#8b5cf6' },
    ]
  },
  {
    name: 'Cyberpunk Neon',
    bgColor: '#09090b',
    points: [
      { id: '1', x: 15, y: 25, radius: 65, color: '#f43f5e' },
      { id: '2', x: 85, y: 20, radius: 70, color: '#06b6d4' },
      { id: '3', x: 50, y: 75, radius: 80, color: '#a855f7' },
      { id: '4', x: 20, y: 85, radius: 50, color: '#e11d48' },
    ]
  },
  {
    name: 'Sunset Mirage',
    bgColor: '#18181b',
    points: [
      { id: '1', x: 25, y: 15, radius: 75, color: '#f59e0b' },
      { id: '2', x: 80, y: 25, radius: 65, color: '#ef4444' },
      { id: '3', x: 30, y: 80, radius: 70, color: '#ec4899' },
      { id: '4', x: 85, y: 85, radius: 60, color: '#8b5cf6' },
    ]
  },
  {
    name: 'Deep Ocean Trench',
    bgColor: '#020617',
    points: [
      { id: '1', x: 20, y: 30, radius: 70, color: '#0284c7' },
      { id: '2', x: 80, y: 20, radius: 60, color: '#0d9488' },
      { id: '3', x: 45, y: 80, radius: 75, color: '#1d4ed8' },
      { id: '4', x: 70, y: 70, radius: 50, color: '#14b8a6' },
    ]
  }
];

export function CssMeshGradientGenerator() {
  const [bgColor, setBgColor] = useState(PRESETS[0].bgColor);
  const [points, setPoints] = useState<MeshPoint[]>(PRESETS[0].points);
  const [activePointId, setActivePointId] = useState<string>(PRESETS[0].points[0].id);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const activePoint = points.find(p => p.id === activePointId) || points[0];

  // Build CSS gradient string
  const cssGradients = useMemo(() => {
    const radialLayers = points.map(
      p => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.radius}%)`
    );
    return radialLayers.join(',\n  ');
  }, [points]);

  const fullCssSnippet = useMemo(() => {
    return `background-color: ${bgColor};\nbackground-image: \n  ${cssGradients};`;
  }, [bgColor, cssGradients]);

  const tailwindSnippet = useMemo(() => {
    const cleanGradients = points.map(
      p => `radial-gradient(at_${p.x}%_${p.y}%,_${p.color}_0px,_transparent_${p.radius}%)`
    ).join(',');
    return `className="bg-[${bgColor}] bg-[image:${cleanGradients}]"`;
  }, [bgColor, points]);

  const handleApplyPreset = (preset: Preset) => {
    setBgColor(preset.bgColor);
    setPoints(preset.points);
    setActivePointId(preset.points[0].id);
  };

  const handleUpdatePoint = (id: string, updates: Partial<MeshPoint>) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleAddPoint = () => {
    if (points.length >= 6) return;
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const newPoint: MeshPoint = {
      id: String(Date.now()),
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10,
      radius: 65,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setPoints(prev => [...prev, newPoint]);
    setActivePointId(newPoint.id);
  };

  const handleRemovePoint = (id: string) => {
    if (points.length <= 2) return;
    const remaining = points.filter(p => p.id !== id);
    setPoints(remaining);
    setActivePointId(remaining[0].id);
  };

  const handleRandomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setPoints(prev => prev.map(p => ({
      ...p,
      x: Math.floor(Math.random() * 85) + 10,
      y: Math.floor(Math.random() * 85) + 10,
      radius: Math.floor(Math.random() * 35) + 50,
      color: randomHex()
    })));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> High-Performance Pure CSS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              No Heavy Canvas / Zero Images
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            CSS Mesh Gradient Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Design fluid multi-point radial mesh gradients with live visual anchors and instant CSS & Tailwind CSS copy.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleRandomize}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-fuchsia-400" />
            <span>Shuffle Mesh</span>
          </button>
          <button
            onClick={() => copyToClipboard(fullCssSnippet, 'css')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-semibold transition shadow-sm shadow-fuchsia-500/20"
          >
            {copiedType === 'css' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'css' ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset Pickers */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Curated Theme Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((prs) => (
                <button
                  key={prs.name}
                  onClick={() => handleApplyPreset(prs)}
                  className="p-3 rounded-xl text-left border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition group flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {prs.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    {prs.points.map((p) => (
                      <span
                        key={p.id}
                        className="w-3.5 h-3.5 rounded-full border border-slate-700"
                        style={{ backgroundColor: p.color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Points List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Gradient Mesh Anchors ({points.length}/6)
              </label>
              {points.length < 6 && (
                <button
                  onClick={handleAddPoint}
                  className="inline-flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Point
                </button>
              )}
            </div>

            <div className="space-y-2">
              {points.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setActivePointId(p.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    activePointId === p.id
                      ? 'bg-fuchsia-500/10 border-fuchsia-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-lg border border-slate-700 shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-xs font-semibold">
                      Anchor #{idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({p.x}%, {p.y}%)
                    </span>
                  </div>

                  {points.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePoint(p.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Active Anchor Sliders */}
            {activePoint && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Customize Selected Anchor
                  </span>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
                    <input
                      type="color"
                      value={activePoint.color}
                      onChange={(e) => handleUpdatePoint(activePoint.id, { color: e.target.value })}
                      className="w-5 h-5 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white uppercase">{activePoint.color}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Horizontal Position (X):</span>
                    <span className="font-mono text-fuchsia-400">{activePoint.x}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activePoint.x}
                    onChange={(e) => handleUpdatePoint(activePoint.id, { x: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Vertical Position (Y):</span>
                    <span className="font-mono text-fuchsia-400">{activePoint.y}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activePoint.y}
                    onChange={(e) => handleUpdatePoint(activePoint.id, { y: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Diffusion Radius:</span>
                    <span className="font-mono text-fuchsia-400">{activePoint.radius}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={activePoint.radius}
                    onChange={(e) => handleUpdatePoint(activePoint.id, { radius: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visual Preview & Snippets */}
        <div className="lg:col-span-7 space-y-5">
          {/* Canvas */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Mesh Canvas
              </span>
              <span className="text-[11px] text-slate-500">
                Click canvas to relocate active anchor
              </span>
            </div>

            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                handleUpdatePoint(activePoint.id, { x: clickX, y: clickY });
              }}
              className="w-full h-80 sm:h-96 rounded-xl border border-slate-700/60 shadow-2xl relative overflow-hidden cursor-crosshair transition-all"
              style={{
                backgroundColor: bgColor,
                backgroundImage: cssGradients,
              }}
            >
              {/* Draggable/clickable anchor visual indicators */}
              {points.map((p, idx) => (
                <div
                  key={p.id}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-lg transition-transform ${
                    activePointId === p.id
                      ? 'border-white scale-125 ring-4 ring-fuchsia-500/50'
                      : 'border-slate-800/80 scale-100'
                  }`}
                  style-color={p.color}
                >
                  <span className="w-full h-full rounded-full flex items-center justify-center text-white" style={{ backgroundColor: p.color }}>
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Code Cards */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Standard CSS:</span>
                <button
                  onClick={() => copyToClipboard(fullCssSnippet, 'css')}
                  className="inline-flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 font-medium"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'css' ? 'Copied' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-fuchsia-300 overflow-x-auto whitespace-pre-wrap break-all max-h-32">
                {fullCssSnippet}
              </pre>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Tailwind CSS (Arbitrary Values):</span>
                <button
                  onClick={() => copyToClipboard(tailwindSnippet, 'tw')}
                  className="inline-flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 font-medium"
                >
                  {copiedType === 'tw' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'tw' ? 'Copied' : 'Copy Class'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                {tailwindSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
