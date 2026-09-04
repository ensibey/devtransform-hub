'use client';

import React, { useState, useMemo } from 'react';
import { 
  Waves, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Eye, 
  Maximize2 
} from 'lucide-react';

export function SvgWaveGenerator() {
  const [wavesCount, setWavesCount] = useState<number>(3);
  const [height, setHeight] = useState<number>(150);
  const [fillColor, setFillColor] = useState<string>('#38bdf8');
  const [bgColor, setBgColor] = useState<string>('#0f172a');
  const [flipY, setFlipY] = useState<boolean>(false);
  const [flipX, setFlipX] = useState<boolean>(false);
  const [hasDoubleLayer, setHasDoubleLayer] = useState<boolean>(true);
  const [seed, setSeed] = useState<number>(42);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Generate smooth cubic bezier SVG path
  const paths = useMemo(() => {
    const width = 1440;
    const segments = wavesCount;
    const segWidth = width / segments;

    // Pseudo-random offsets based on seed
    const getOffset = (i: number, layer: number) => {
      const pseudo = Math.sin(seed * 99 + i * 13 + layer * 7);
      return pseudo * (height * 0.35);
    };

    const generateWavePath = (layerOffset: number, baselineY: number) => {
      let d = flipY
        ? `M 0,${height} L 0,${baselineY} `
        : `M 0,0 L 0,${baselineY} `;

      let currentX = 0;
      let currentY = baselineY;

      for (let i = 0; i < segments; i++) {
        const nextX = currentX + segWidth;
        const targetY = baselineY + getOffset(i, layerOffset);
        const cp1x = currentX + segWidth / 2;
        const cp1y = currentY;
        const cp2x = currentX + segWidth / 2;
        const cp2y = targetY;

        d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${nextX},${targetY} `;
        currentX = nextX;
        currentY = targetY;
      }

      if (flipY) {
        d += `L ${width},${height} L 0,${height} Z`;
      } else {
        d += `L ${width},0 L 0,0 Z`;
      }

      return d;
    };

    const mainPath = generateWavePath(0, height * 0.55);
    const backPath = generateWavePath(1, height * 0.4);

    return { mainPath, backPath };
  }, [wavesCount, height, flipY, seed]);

  // Complete SVG vector string
  const svgMarkup = useMemo(() => {
    const transform = `${flipX ? 'scale(-1, 1) translate(-1440, 0)' : ''}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${height}" preserveAspectRatio="none" style="display: block; width: 100%; height: 100%;">
  <rect width="1440" height="${height}" fill="${bgColor}" />
  <g transform="${transform}">
    ${hasDoubleLayer ? `<path d="${paths.backPath}" fill="${fillColor}" fill-opacity="0.35" />` : ''}
    <path d="${paths.mainPath}" fill="${fillColor}" fill-opacity="1" />
  </g>
</svg>`.trim();
  }, [paths, height, bgColor, fillColor, flipX, hasDoubleLayer]);

  // Clean CSS data URI
  const cssBackground = useMemo(() => {
    const encoded = encodeURIComponent(svgMarkup)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    return `background-image: url("data:image/svg+xml,${encoded}");`;
  }, [svgMarkup]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wave-divider.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 10000));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" /> SVG Section Dividers
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% Vector Math
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            SVG Wave Divider Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Design smooth organic SVG wave dividers for hero sections, landing page footer transitions, and web card backgrounds.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={randomizeSeed}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" />
            <span>Randomize</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition shadow-sm shadow-sky-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Wave Geometry & Height
            </h2>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Wave Crests / Complexity:</span>
                <span className="font-mono text-sky-400">{wavesCount} waves</span>
              </div>
              <input
                type="range"
                min={2}
                max={7}
                value={wavesCount}
                onChange={(e) => setWavesCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Wave Height:</span>
                <span className="font-mono text-sky-400">{height}px</span>
              </div>
              <input
                type="range"
                min={60}
                max={280}
                step={5}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setFlipY(!flipY)}
                className={`p-2 rounded-xl text-xs font-medium border transition ${
                  flipY ? 'bg-sky-500/10 border-sky-500/40 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {flipY ? 'Top Section' : 'Bottom Section'}
              </button>
              <button
                onClick={() => setFlipX(!flipX)}
                className={`p-2 rounded-xl text-xs font-medium border transition ${
                  flipX ? 'bg-sky-500/10 border-sky-500/40 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Invert Curve
              </button>
              <button
                onClick={() => setHasDoubleLayer(!hasDoubleLayer)}
                className={`p-2 rounded-xl text-xs font-medium border transition ${
                  hasDoubleLayer ? 'bg-sky-500/10 border-sky-500/40 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {hasDoubleLayer ? 'Double Layer' : 'Single Layer'}
              </button>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Wave Fill Color</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Background Color</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
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

        {/* Live Preview & Snippets */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Divider Canvas */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Live Wave Canvas (1440px ViewBox)
            </span>

            <div className="w-full rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
              <div
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                className="w-full transition-all"
                style={{ height: `${height}px` }}
              />
            </div>
          </div>

          {/* Export Code */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            {/* Raw SVG */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Inline &lt;svg&gt; Vector Markup:</span>
                <button
                  onClick={() => copyToClipboard(svgMarkup, 'svg')}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                >
                  {copiedType === 'svg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'svg' ? 'Copied' : 'Copy SVG'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                {svgMarkup}
              </pre>
            </div>

            {/* CSS Data URI */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">CSS background-image:</span>
                <button
                  onClick={() => copyToClipboard(cssBackground, 'css')}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'css' ? 'Copied' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all max-h-20">
                {cssBackground}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
