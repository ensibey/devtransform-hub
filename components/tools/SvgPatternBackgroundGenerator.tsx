'use client';

import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Grid, 
  Sliders, 
  Code, 
  CheckCircle2, 
  Maximize2 
} from 'lucide-react';

type PatternType = 'dots' | 'grid' | 'diagonal' | 'zigzag' | 'isometric' | 'crosses' | 'blueprint' | 'hexagons';

interface PatternOption {
  id: PatternType;
  label: string;
  description: string;
}

const PATTERN_OPTIONS: PatternOption[] = [
  { id: 'dots', label: 'Polka Dot Grid', description: 'Evenly spaced modern dots' },
  { id: 'grid', label: 'Cartesian Grid', description: 'Clean square wireframe mesh' },
  { id: 'diagonal', label: 'Diagonal Stripes', description: 'Slanted 45° dynamic lines' },
  { id: 'zigzag', label: 'Chevron Zig-Zag', description: 'Modern geometric angled wave' },
  { id: 'isometric', label: 'Isometric Grid', description: '3D technical triangular lattice' },
  { id: 'crosses', label: 'Crosses / Plus', description: 'Plus mark technical scatter' },
  { id: 'blueprint', label: 'Blueprint Grid', description: 'Major & minor CAD grid' },
  { id: 'hexagons', label: 'Honeycomb Hex', description: 'Hexagonal interlocking lattice' },
];

export function SvgPatternBackgroundGenerator() {
  const [patternType, setPatternType] = useState<PatternType>('dots');
  const [size, setSize] = useState<number>(24);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [fgColor, setFgColor] = useState<string>('#38bdf8');
  const [bgColor, setBgColor] = useState<string>('#0f172a');
  const [opacity, setOpacity] = useState<number>(80);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Generate SVG pattern string
  const svgPatternString = useMemo(() => {
    const strokeAlpha = (opacity / 100).toFixed(2);
    const colorWithAlpha = fgColor;

    let innerContent = '';
    let patternW = size;
    let patternH = size;

    switch (patternType) {
      case 'dots':
        innerContent = `<circle cx="${size / 2}" cy="${size / 2}" r="${strokeWidth}" fill="${colorWithAlpha}" fill-opacity="${strokeAlpha}" />`;
        break;
      case 'grid':
        innerContent = `<path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${colorWithAlpha}" stroke-width="${strokeWidth}" stroke-opacity="${strokeAlpha}" />`;
        break;
      case 'diagonal':
        innerContent = `<line x1="0" y1="${size}" x2="${size}" y2="0" stroke="${colorWithAlpha}" stroke-width="${strokeWidth}" stroke-opacity="${strokeAlpha}" stroke-linecap="square" />`;
        break;
      case 'zigzag':
        patternW = size * 2;
        patternH = size;
        innerContent = `<path d="M0,${size / 2} L${size / 2},0 L${size},${size / 2} L${size * 1.5},0 L${size * 2},${size / 2}" fill="none" stroke="${colorWithAlpha}" stroke-width="${strokeWidth}" stroke-opacity="${strokeAlpha}" />`;
        break;
      case 'isometric': {
        const h = Math.round(size * 0.866);
        patternW = size;
        patternH = h * 2;
        innerContent = `<path d="M0 0 L${size} ${h * 2} M${size} 0 L0 ${h * 2} M0 ${h} L${size} ${h}" fill="none" stroke="${colorWithAlpha}" stroke-width="${strokeWidth}" stroke-opacity="${strokeAlpha}" />`;
        break;
      }
      case 'crosses': {
        const half = size / 2;
        const arm = Math.max(3, strokeWidth * 2.5);
        innerContent = `<path d="M${half - arm},${half} h${arm * 2} M${half},${half - arm} v${arm * 2}" stroke="${colorWithAlpha}" stroke-width="${strokeWidth}" stroke-linecap="square" stroke-opacity="${strokeAlpha}" />`;
        break;
      }
      case 'blueprint':
        innerContent = `
          <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${colorWithAlpha}" stroke-width="${strokeWidth * 1.5}" stroke-opacity="${strokeAlpha}" />
          <path d="M ${size / 2} 0 L ${size / 2} ${size} M 0 ${size / 2} L ${size} ${size / 2}" fill="none" stroke="${colorWithAlpha}" stroke-width="${Math.max(1, strokeWidth * 0.6)}" stroke-dasharray="2,2" stroke-opacity="${Math.max(0.1, Number(strokeAlpha) * 0.5)}" />
        `;
        break;
      case 'hexagons': {
        const w = size;
        const h = Math.round(size * 1.1547);
        patternW = w;
        patternH = h;
        innerContent = `<path d="M${w / 2} 0 L${w} ${h / 4} L${w} ${h * 0.75} L${w / 2} ${h} L0 ${h * 0.75} L0 ${h / 4} Z" fill="none" stroke="${colorWithAlpha}" stroke-width="${strokeWidth}" stroke-opacity="${strokeAlpha}" />`;
        break;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${patternW}" height="${patternH}" viewBox="0 0 ${patternW} ${patternH}">${innerContent.trim()}</svg>`;
  }, [patternType, size, strokeWidth, fgColor, opacity]);

  // CSS background string with URL encoding
  const cssBackgroundValue = useMemo(() => {
    const encodedSvg = encodeURIComponent(svgPatternString)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    return `background-color: ${bgColor};\nbackground-image: url("data:image/svg+xml,${encodedSvg}");`;
  }, [bgColor, svgPatternString]);

  // Inline data-uri for direct style application
  const dataUri = useMemo(() => {
    const encodedSvg = encodeURIComponent(svgPatternString);
    return `url("data:image/svg+xml,${encodedSvg}")`;
  }, [svgPatternString]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgPatternString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern-${patternType}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const randomizePalette = () => {
    const palettes = [
      { bg: '#0f172a', fg: '#38bdf8' },
      { bg: '#18181b', fg: '#a855f7' },
      { bg: '#022c22', fg: '#34d399' },
      { bg: '#1e1b4b', fg: '#f43f5e' },
      { bg: '#172554', fg: '#60a5fa' },
      { bg: '#2e1065', fg: '#f472b6' },
    ];
    const picked = palettes[Math.floor(Math.random() * palettes.length)];
    setBgColor(picked.bg);
    setFgColor(picked.fg);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Vector CSS Patterns
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Zero External Assets
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            SVG Pattern Background Generator Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create ultra-crisp seamless SVG background patterns with real-time controls, data-URI exports, and vector downloads.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={randomizePalette}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" />
            <span>Randomize Theme</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition shadow-sm shadow-sky-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Pattern Selector */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              1. Choose Pattern Geometry
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PATTERN_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPatternType(opt.id)}
                  className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                    patternType === opt.id
                      ? 'bg-sky-500/10 border-sky-500/50 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color & Dimension Controls */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Dimensions & Colors
            </label>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Pattern Grid Size:</span>
                  <span className="font-mono text-sky-400">{size}px</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={80}
                  step={2}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Stroke / Dot Weight:</span>
                  <span className="font-mono text-sky-400">{strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Pattern Opacity:</span>
                  <span className="font-mono text-sky-400">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Pattern Color</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Background</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Code Exports */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive Pattern Canvas */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" /> Interactive Canvas Preview
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Tile: {size}x{size}px
              </span>
            </div>

            <div
              className="w-full h-72 sm:h-80 rounded-xl border border-slate-700/60 shadow-inner transition-all flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundColor: bgColor,
                backgroundImage: dataUri,
              }}
            >
              {/* Overlay sample card to show real-world application */}
              <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl max-w-sm text-center shadow-2xl mx-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3 border border-sky-500/30">
                  <Grid className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Hero Section Mockup</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seamless SVG repeating backgrounds enhance dark-mode developer portals, hero sections, and cards.
                </p>
              </div>
            </div>
          </div>

          {/* Export Tabs / Snippets */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-sky-400" /> CSS & SVG Code Snippets
              </span>
            </div>

            {/* CSS Data URI */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Standard CSS background-image:</span>
                <button
                  onClick={() => copyToClipboard(cssBackgroundValue, 'css')}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'css' ? 'Copied' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                {cssBackgroundValue}
              </pre>
            </div>

            {/* Inline SVG */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Inline Vector &lt;svg&gt; markup:</span>
                <button
                  onClick={() => copyToClipboard(svgPatternString, 'svg')}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                >
                  {copiedType === 'svg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'svg' ? 'Copied' : 'Copy SVG'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                {svgPatternString}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
