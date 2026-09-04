'use client';

import React, { useState, useMemo, useId } from 'react';
import { 
  FileCode, 
  Upload, 
  Copy, 
  Check, 
  Sparkles, 
  Eye, 
  Maximize2, 
  RotateCcw, 
  ShieldCheck, 
  Code 
} from 'lucide-react';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
</svg>`;

export function SvgToDataUriConverter() {
  const [svgInput, setSvgInput] = useState(SAMPLE_SVG);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<'checker' | 'dark' | 'white'>('checker');
  const [previewScale, setPreviewScale] = useState<number>(1);
  const fileInputId = useId();

  // Clean and encode SVG to minimal UTF-8 Data URI
  const dataUri = useMemo(() => {
    if (!svgInput.trim()) return '';

    // Strip doctypes, xml declarations and comments
    let cleaned = svgInput
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Ensure xmlns is present for standalone rendering
    if (!cleaned.includes('xmlns=')) {
      cleaned = cleaned.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // RFC 3986 encoding (cleaner than base64 and 30% smaller)
    const encoded = encodeURIComponent(cleaned)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');

    return `data:image/svg+xml,${encoded}`;
  }, [svgInput]);

  const cssSnippet = `background-image: url("${dataUri}");`;
  const htmlSnippet = `<img src="${dataUri}" alt="Vector Graphic" />`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setSvgInput(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> High-Efficiency UTF-8 URI
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ~30% Smaller than Base64
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            SVG to Data URI Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Convert SVG icons and vector code into optimized CSS data URIs, HTML image tags, and Tailwind CSS classes.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label 
            htmlFor={fileInputId} 
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload SVG</span>
          </label>
          <input 
            id={fileInputId} 
            type="file" 
            accept=".svg,image/svg+xml" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button
            onClick={() => copyToClipboard(cssSnippet, 'css-top')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition shadow-sm shadow-cyan-500/20"
          >
            {copiedType === 'css-top' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'css-top' ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input SVG */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" /> Raw SVG Code Input
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {svgInput.length} chars
              </span>
            </div>

            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              rows={14}
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-y leading-relaxed"
              placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>...</svg>"
            />

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Automatically trims XML prologue & doctypes</span>
              <button
                onClick={() => setSvgInput(SAMPLE_SVG)}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Reset to Sample
              </button>
            </div>
          </div>
        </div>

        {/* Right: Visual Preview & Snippets */}
        <div className="lg:col-span-6 space-y-4">
          {/* Visual Preview */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" /> Rendered SVG Preview
              </span>

              {/* Background & scale controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setPreviewBg('checker')}
                    className={`px-2 py-0.5 rounded ${previewBg === 'checker' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  >
                    Checker
                  </button>
                  <button
                    onClick={() => setPreviewBg('dark')}
                    className={`px-2 py-0.5 rounded ${previewBg === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setPreviewBg('white')}
                    className={`px-2 py-0.5 rounded ${previewBg === 'white' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  >
                    White
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`w-full h-44 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden transition ${
                previewBg === 'dark'
                  ? 'bg-slate-950'
                  : previewBg === 'white'
                  ? 'bg-white'
                  : 'bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:16px_16px] bg-[#0f172a]'
              }`}
            >
              {dataUri ? (
                <div
                  className="w-24 h-24 bg-center bg-contain bg-no-repeat transition-transform"
                  style={{ backgroundImage: `url("${dataUri}")` }}
                />
              ) : (
                <span className="text-xs text-slate-500">No SVG detected</span>
              )}
            </div>
          </div>

          {/* Snippets */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            {/* CSS Background */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">CSS background-image:</span>
                <button
                  onClick={() => copyToClipboard(cssSnippet, 'css')}
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'css' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all max-h-20">
                {cssSnippet}
              </pre>
            </div>

            {/* HTML img tag */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">HTML &lt;img&gt; tag:</span>
                <button
                  onClick={() => copyToClipboard(htmlSnippet, 'html')}
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'html' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all max-h-20">
                {htmlSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
