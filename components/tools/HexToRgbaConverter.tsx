'use client';

import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  Sun, 
  Moon 
} from 'lucide-react';

export function HexToRgbaConverter() {
  const [hexInput, setHexInput] = useState('#38bdf8');
  const [alpha, setAlpha] = useState<number>(0.85);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Parse HEX to RGB
  const parsed = useMemo(() => {
    let clean = hexInput.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    } else if (clean.length === 8) {
      // 8 digit hex contains alpha
      const aVal = parseInt(clean.substring(6, 8), 16) / 255;
      clean = clean.substring(0, 6);
      if (!isNaN(aVal)) {
        // Keep current clean
      }
    }

    const num = parseInt(clean, 16);
    if (isNaN(num) || (clean.length !== 6 && clean.length !== 3)) {
      return { r: 56, g: 189, b: 248, valid: false };
    }

    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    return { r, g, b, valid: true };
  }, [hexInput]);

  // HSL calculation
  const hsl = useMemo(() => {
    const r = parsed.r / 255;
    const g = parsed.g / 255;
    const b = parsed.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, [parsed]);

  // Alpha hex suffix
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  const fullHex8 = `#${parsed.r.toString(16).padStart(2, '0')}${parsed.g.toString(16).padStart(2, '0')}${parsed.b.toString(16).padStart(2, '0')}${alphaHex}`.toUpperCase();
  const hex6 = `#${parsed.r.toString(16).padStart(2, '0')}${parsed.g.toString(16).padStart(2, '0')}${parsed.b.toString(16).padStart(2, '0')}`.toUpperCase();

  const rgbaStr = `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha.toFixed(2)})`;
  const rgbStr = `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`;
  const hslaStr = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha.toFixed(2)})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // Luminance
  const yiq = (parsed.r * 299 + parsed.g * 587 + parsed.b * 114) / 1000;
  const isLight = yiq >= 128;

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setHexInput(randomHex);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Full Color Model Translation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Alpha Channel Preview
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            HEX to RGBA & Color Format Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Convert HEX colors to RGBA, RGB, HSLA, and 8-digit HEX with interactive alpha transparency controls.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleRandomColor}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-pink-400" />
            <span>Random Color</span>
          </button>
          <button
            onClick={() => copyToClipboard(rgbaStr, 'rgba-top')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-pink-500 hover:bg-pink-400 text-slate-950 font-semibold transition shadow-sm shadow-pink-500/20"
          >
            {copiedFormat === 'rgba-top' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedFormat === 'rgba-top' ? 'Copied' : 'Copy RGBA'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Color & Alpha Input
            </h2>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Hex Color Code</label>
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2">
                <input
                  type="color"
                  value={hex6}
                  onChange={(e) => setHexInput(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="#38bdf8"
                  className="w-full bg-transparent text-sm font-mono text-white focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Alpha Transparency:</span>
                <span className="font-mono text-pink-400">{Math.round(alpha * 100)}% ({alpha.toFixed(2)})</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Luminance & Contrast insight */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Recommended Text Color:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                isLight
                  ? 'bg-slate-950 text-slate-900 border-slate-800'
                  : 'bg-white text-slate-950 border-white'
              }`}>
                {isLight ? <Moon className="w-3 h-3 text-slate-900" /> : <Sun className="w-3 h-3 text-amber-500" />}
                <span>{isLight ? 'Dark Text (#000)' : 'White Text (#FFF)'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Swatches & Code Formats */}
        <div className="lg:col-span-7 space-y-5">
          {/* Swatch Previews */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Transparency Swatch Previews
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Checkerboard (Alpha) */}
              <div className="relative rounded-xl border border-slate-800 overflow-hidden h-28 flex items-center justify-center bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:16px_16px] bg-[#0f172a]">
                <div
                  className="absolute inset-0 transition-colors"
                  style={{ backgroundColor: rgbaStr }}
                />
                <span className="relative text-xs font-mono font-bold px-2 py-1 rounded bg-slate-950/70 text-white backdrop-blur-sm border border-slate-800/80">
                  {Math.round(alpha * 100)}% Alpha
                </span>
              </div>

              {/* Solid Base */}
              <div
                className="rounded-xl border border-slate-800 h-28 flex items-center justify-center transition-colors"
                style={{ backgroundColor: hex6 }}
              >
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded backdrop-blur-sm ${
                  isLight ? 'text-slate-950 bg-white/60' : 'text-white bg-black/60'
                }`}>
                  100% Solid
                </span>
              </div>
            </div>
          </div>

          {/* Formats Copy List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-2.5">
            {[
              { label: 'RGBA (Modern CSS)', val: rgbaStr, id: 'rgba' },
              { label: '8-Digit HEX (with Alpha)', val: fullHex8, id: 'hex8' },
              { label: 'RGB (Standard)', val: rgbStr, id: 'rgb' },
              { label: 'HSLA (Hue, Sat, Light, Alpha)', val: hslaStr, id: 'hsla' },
            ].map(fmt => (
              <div
                key={fmt.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] text-slate-500 font-medium">{fmt.label}</div>
                  <div className="text-xs font-mono text-pink-300 font-semibold truncate">{fmt.val}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(fmt.val, fmt.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0 flex items-center gap-1"
                >
                  {copiedFormat === fmt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === fmt.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
