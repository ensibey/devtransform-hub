'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, Sparkles, Download, RefreshCw, Trash2, ArrowRightLeft } from 'lucide-react';

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // remove space around separators
    .replace(/;}/g, '}') // remove trailing semicolons
    .trim();
}

function beautifyCss(css: string): string {
  let formatted = '';
  let indent = 0;
  const clean = minifyCss(css);

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (char === '{') {
      formatted += ' {\n' + '  '.repeat(++indent);
    } else if (char === '}') {
      formatted += '\n' + '  '.repeat(--indent) + '}\n';
    } else if (char === ';') {
      formatted += ';\n' + '  '.repeat(indent);
    } else {
      formatted += char;
    }
  }

  return formatted.trim();
}

export function CssMinifierStudio() {
  const [cssInput, setCssInput] = useState(
    `/* Header Navigation Styles */\n.navbar-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n  background-color: #09090b;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n.navbar-container .nav-link {\n  color: #a1a1aa;\n  font-size: 14px;\n  font-weight: 500;\n  text-decoration: none;\n  transition: color 0.2s ease-in-out;\n}\n\n.navbar-container .nav-link:hover {\n  color: #10b981;\n}`
  );

  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');

  const outputCss = useMemo(() => {
    return mode === 'minify' ? minifyCss(cssInput) : beautifyCss(cssInput);
  }, [cssInput, mode]);

  const originalBytes = new Blob([cssInput]).size;
  const outputBytes = new Blob([outputCss]).size;
  const savedPercent =
    originalBytes > 0 && mode === 'minify'
      ? Math.round(((originalBytes - outputBytes) / originalBytes) * 100)
      : 0;

  const downloadCss = () => {
    const blob = new Blob([outputCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'minify' ? 'style.min.css' : 'style.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setMode('minify')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'minify' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Minify CSS
            </button>
            <button
              type="button"
              onClick={() => setMode('beautify')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'beautify' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Beautify / Format
            </button>
          </div>

          {mode === 'minify' && savedPercent > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Saved {savedPercent}% Size ({originalBytes}B → {outputBytes}B)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={downloadCss}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download {mode === 'minify' ? '.min.css' : '.css'}</span>
        </button>
      </div>

      {/* 2-Column CSS Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Input CSS Code:</span>
            </span>
            <button
              type="button"
              onClick={() => setCssInput('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
            placeholder="body { color: red; }..."
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">
                {mode === 'minify' ? 'Minified Output (Zero Whitespace):' : 'Formatted CSS:'}
              </span>
              <CopyButton text={outputCss} />
            </div>

            <textarea
              readOnly
              value={outputCss}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
