'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Image as ImageIcon, Copy, Check, Sparkles, RefreshCw, Upload, Download, ArrowRightLeft, FileCode } from 'lucide-react';

const SAMPLE_SVG_BASE64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiM2MzY2ZjEiLz48L3N2Zz4=`;

export function Base64ImageEncoderDecoderStudio() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [base64Text, setBase64Text] = useState<string>(SAMPLE_SVG_BASE64);
  const [imageSrc, setImageSrc] = useState<string | null>(SAMPLE_SVG_BASE64);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number; type: string } | null>({
    name: 'sample_circle.svg',
    size: 154,
    type: 'image/svg+xml',
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type || 'image/png',
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64Text(result);
      setImageSrc(result);
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type || 'image/png',
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64Text(result);
      setImageSrc(result);
    };
    reader.readAsDataURL(file);
  };

  // Decode input change
  const handleDecodeInput = (text: string) => {
    setBase64Text(text);
    if (!text.trim()) {
      setImageSrc(null);
      return;
    }
    const clean = text.trim();
    if (clean.startsWith('data:image')) {
      setImageSrc(clean);
    } else {
      setImageSrc(`data:image/png;base64,${clean}`);
    }
  };

  // Code snippets
  const htmlImgTag = useMemo(() => {
    return `<img src="${base64Text}" alt="${fileDetails?.name || 'Base64 Image'}" />`;
  }, [base64Text, fileDetails]);

  const cssBackground = useMemo(() => {
    return `background-image: url('${base64Text}');`;
  }, [base64Text]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadImage = () => {
    if (!imageSrc) return;
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = fileDetails?.name || 'downloaded-image.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-indigo-400" />
              Base64 Image Encoder & Decoder Studio
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Convert PNG, JPEG, WebP, SVG into Base64 Data URIs, or decode Base64 strings back to downloadable image files.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setMode('encode')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                  mode === 'encode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Image to Base64
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                  mode === 'decode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Base64 to Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-5">
          {mode === 'encode' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900 border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer transition text-center group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-white mb-1">Click to Upload or Drag & Drop Image</div>
              <div className="text-xs text-slate-400">Supports PNG, JPEG, SVG, WebP, GIF (Processed 100% locally)</div>

              {fileDetails && (
                <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                  {fileDetails.name} • {(fileDetails.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Paste Base64 or Data URI String
              </label>
              <textarea
                value={base64Text}
                onChange={(e) => handleDecodeInput(e.target.value)}
                rows={12}
                placeholder="data:image/png;base64,iVBORw0KGgo..."
                className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
              />
            </div>
          )}

          {/* Export Code Snippets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                HTML &lt;img&gt; Element
              </span>
              <button
                onClick={() => copyText(htmlImgTag, 'html')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
              >
                {copiedKey === 'html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'html' ? 'Copied' : 'Copy HTML'}
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto truncate">
              {htmlImgTag}
            </pre>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CSS background-image
              </span>
              <button
                onClick={() => copyText(cssBackground, 'css')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
              >
                {copiedKey === 'css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'css' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto truncate">
              {cssBackground}
            </pre>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Image Canvas Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[340px] relative">
            {imageSrc ? (
              <div className="max-w-xs max-h-72 p-2 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Decoded Preview"
                  className="max-w-full max-h-64 object-contain rounded-lg shadow-xl"
                  onError={() => setImageSrc(null)}
                />
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <ImageIcon className="w-10 h-10 mx-auto opacity-30 mb-2" />
                No image preview available
              </div>
            )}

            {imageSrc && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={downloadImage}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  Download Image File
                </button>
                <button
                  onClick={() => copyText(base64Text, 'raw')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition flex items-center gap-2"
                >
                  {copiedKey === 'raw' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedKey === 'raw' ? 'Copied URI' : 'Copy Raw Base64'}
                </button>
              </div>
            )}
          </div>

          {/* Raw String View */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Data URI String (~{base64Text.length.toLocaleString()} characters)
            </span>
            <textarea
              readOnly
              value={base64Text}
              rows={4}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400 select-all leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
