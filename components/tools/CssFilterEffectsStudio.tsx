'use client';

import React, { useState, useMemo, useId } from 'react';
import { 
  Sliders, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCcw, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  Maximize2 
} from 'lucide-react';

interface FilterState {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
}

const DEFAULT_FILTERS: FilterState = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
};

const PRESETS: Record<string, { name: string; filters: FilterState }> = {
  normal: { name: 'Normal / Reset', filters: DEFAULT_FILTERS },
  vintage: {
    name: 'Vintage Film',
    filters: { ...DEFAULT_FILTERS, sepia: 40, contrast: 115, brightness: 95, saturate: 85 }
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    filters: { ...DEFAULT_FILTERS, contrast: 140, saturate: 180, hueRotate: 310 }
  },
  noir: {
    name: 'Monochrome Noir',
    filters: { ...DEFAULT_FILTERS, grayscale: 100, contrast: 145, brightness: 90 }
  },
  golden: {
    name: 'Golden Hour',
    filters: { ...DEFAULT_FILTERS, sepia: 25, brightness: 108, saturate: 130, contrast: 105 }
  },
  dramatic: {
    name: 'Dramatic Cool',
    filters: { ...DEFAULT_FILTERS, contrast: 135, brightness: 95, saturate: 120, hueRotate: 180 }
  }
};

const SAMPLE_IMAGES = [
  { label: 'Cyber City', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mountain Nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' },
  { label: 'Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' },
];

export function CssFilterEffectsStudio() {
  const [filters, setFilters] = useState<FilterState>(PRESETS.cyberpunk.filters);
  const [activeImage, setActiveImage] = useState<string>(SAMPLE_IMAGES[0].url);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const fileInputId = useId();

  // Construct CSS filter string
  const cssFilterString = useMemo(() => {
    const parts: string[] = [];
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
    if (filters.hueRotate > 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`);
    if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`);
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);

    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [filters]);

  const cssSnippet = `filter: ${cssFilterString};`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result;
      if (typeof res === 'string') {
        setActiveImage(res);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> CSS3 Filter Effects
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Zero External Libraries
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            CSS Filter Effects Studio & Playground
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Design interactive visual image filters, Instagram-style presets, and export clean hardware-accelerated CSS filter styles.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label
            htmlFor={fileInputId}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-fuchsia-400" />
            <span>Upload Photo</span>
          </label>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomImageUpload}
          />
          <button
            onClick={() => copyToClipboard(cssSnippet, 'css-top')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-semibold transition shadow-sm shadow-fuchsia-500/20"
          >
            {copiedType === 'css-top' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'css-top' ? 'Copied' : 'Copy Filter'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Preset Buttons */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Curated Filter Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setFilters(p.filters)}
                  className="p-2.5 rounded-xl text-xs font-medium bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Box */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Filter Parameters
              </h2>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Blur:</span>
                <span className="font-mono text-fuchsia-400">{filters.blur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={filters.blur}
                onChange={(e) => setFilters(prev => ({ ...prev, blur: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Brightness:</span>
                <span className="font-mono text-fuchsia-400">{filters.brightness}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                value={filters.brightness}
                onChange={(e) => setFilters(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Contrast:</span>
                <span className="font-mono text-fuchsia-400">{filters.contrast}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                value={filters.contrast}
                onChange={(e) => setFilters(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Grayscale:</span>
                <span className="font-mono text-fuchsia-400">{filters.grayscale}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={filters.grayscale}
                onChange={(e) => setFilters(prev => ({ ...prev, grayscale: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Hue Rotate:</span>
                <span className="font-mono text-fuchsia-400">{filters.hueRotate}deg</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={filters.hueRotate}
                onChange={(e) => setFilters(prev => ({ ...prev, hueRotate: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Saturation:</span>
                <span className="font-mono text-fuchsia-400">{filters.saturate}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={250}
                value={filters.saturate}
                onChange={(e) => setFilters(prev => ({ ...prev, saturate: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Sepia Tone:</span>
                <span className="font-mono text-fuchsia-400">{filters.sepia}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={filters.sepia}
                onChange={(e) => setFilters(prev => ({ ...prev, sepia: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Code */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-fuchsia-400" /> Real-Time Image Filter Preview
              </span>

              {/* Sample switcher */}
              <div className="flex gap-1">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      activeImage === img.url
                        ? 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-80 rounded-xl border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={activeImage}
                alt="Filter preview"
                className="w-full h-full object-cover transition-all"
                style={{ filter: cssFilterString }}
              />
            </div>
          </div>

          {/* CSS Output Snippet */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Standard CSS:</span>
              <button
                onClick={() => copyToClipboard(cssSnippet, 'css')}
                className="inline-flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 font-medium"
              >
                {copiedType === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'css' ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-fuchsia-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
              {cssSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
