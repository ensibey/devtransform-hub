'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Upload, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad)" />
  <circle cx="100" cy="100" r="50" fill="#ffffff" fill-opacity="0.2" />
  <path d="M70 100 L90 120 L135 75" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`;

export function SvgToPngConverter() {
  const [svgInput, setSvgInput] = useState(DEFAULT_SVG);
  const [scale, setScale] = useState<number>(2); // 2x Retina default
  const [format, setFormat] = useState<'png' | 'webp' | 'jpeg'>('png');
  const [bgColor, setBgColor] = useState<'transparent' | 'white' | 'black' | 'custom'>('transparent');
  const [customBg, setCustomBg] = useState('#ffffff');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 400, height: 400 });
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parse and render SVG to Canvas
  useEffect(() => {
    try {
      setError(null);
      if (!svgInput.trim()) {
        setPreviewUrl(null);
        return;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgInput, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');

      if (!svgEl || doc.querySelector('parsererror')) {
        setError('Invalid SVG markup format.');
        return;
      }

      let width = 300;
      let height = 300;

      const viewBox = svgEl.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/\s+|,/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          width = parts[2];
          height = parts[3];
        }
      } else {
        const wAttr = parseFloat(svgEl.getAttribute('width') || '300');
        const hAttr = parseFloat(svgEl.getAttribute('height') || '300');
        if (wAttr > 0) width = wAttr;
        if (hAttr > 0) height = hAttr;
      }

      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);
      setDimensions({ width: targetWidth, height: targetHeight });

      const blob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Background handling
        if (bgColor === 'white') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else if (bgColor === 'black') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else if (bgColor === 'custom') {
          ctx.fillStyle = customBg;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else if (format === 'jpeg') {
          // JPEG doesn't support transparency
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        URL.revokeObjectURL(url);

        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
        const dataUri = canvas.toDataURL(mimeType, 0.95);
        setPreviewUrl(dataUri);
      };

      img.onerror = () => {
        setError('Failed to render SVG onto canvas.');
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (err: any) {
      setError(err.message || 'Error processing SVG.');
    }
  }, [svgInput, scale, format, bgColor, customBg]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setSvgInput(content);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = `exported-vector-${dimensions.width}x${dimensions.height}.${format}`;
    link.href = previewUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Format Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Export Format:</span>
            {(['png', 'webp', 'jpeg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3 py-1.5 text-xs uppercase font-bold rounded-lg transition-colors ${
                  format === fmt ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Scale Multiplier */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Scale:</span>
            {[1, 2, 4, 8].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                  scale === s ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Background Color */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Background:</span>
            <select
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-300 focus:outline-none"
            >
              <option value="transparent">Transparent</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="custom">Custom Color</option>
            </select>
            {bgColor === 'custom' && (
              <input
                type="color"
                value={customBg}
                onChange={(e) => setCustomBg(e.target.value)}
                className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>

      {/* Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              SVG Markup Input
            </label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload .svg
              <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={14}
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="<svg ...> ... </svg>"
          />
        </div>

        {/* Preview & Download Panel */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              Output Preview ({dimensions.width} &times; {dimensions.height} px)
            </span>
            {previewUrl && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download {format.toUpperCase()}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[320px] rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Checkerboard transparency pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#4b5563 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {error ? (
              <div className="text-sm text-red-400 text-center p-4 bg-red-950/20 border border-red-900/40 rounded-xl relative z-10">
                {error}
              </div>
            ) : previewUrl ? (
              <div className="relative z-10 max-h-[300px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Converted SVG rendering preview"
                  className="max-h-[280px] max-w-full object-contain rounded-lg shadow-lg border border-zinc-800/80"
                />
              </div>
            ) : (
              <div className="text-xs text-zinc-500 relative z-10">No SVG provided</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
