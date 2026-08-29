'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code2, Minimize2, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export function HtmlMinifier() {
  const [htmlInput, setHtmlInput] = useState(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ZeroUpload - Fast & Private</title>
    <!-- SEO Meta Tags -->
    <meta name="description" content="100% client-side privacy-first developer utility hub." />
  </head>
  <body>
    <main class="container mx-auto">
      <h1>Hello World!</h1>
      <p>Zero server cost and sub-millisecond execution.</p>
    </main>
  </body>
</html>`);
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);

  const minifiedHtml = useMemo(() => {
    if (!htmlInput) return '';
    let result = htmlInput;

    if (removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    if (collapseWhitespace) {
      result = result
        .replace(/\r\n|\r|\n/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    }

    return result;
  }, [htmlInput, removeComments, collapseWhitespace]);

  const originalSize = new Blob([htmlInput]).size;
  const minifiedSize = new Blob([minifiedHtml]).size;
  const savings = originalSize > 0 ? (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Stats and Options Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-3">
          <span>Original: <strong className="text-white">{originalSize} B</strong></span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          <span>Minified: <strong className="text-brand-emerald">{minifiedSize} B</strong></span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
            -{savings}% Savings
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Strip HTML Comments</span>
          </label>

          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={collapseWhitespace}
              onChange={(e) => setCollapseWhitespace(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Collapse Whitespace</span>
          </label>
        </div>
      </div>

      {/* 2-Column Inputs & Minified Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Code2 className="w-4 h-4 text-brand-emerald" />
              <span>Raw HTML Input:</span>
            </span>
            <button
              type="button"
              onClick={() => setHtmlInput('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={12}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Paste your HTML markup here..."
          />
        </div>

        {/* Minified Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Compressed Minified HTML:</span>
              <CopyButton text={minifiedHtml} />
            </div>
            <textarea
              readOnly
              value={minifiedHtml}
              rows={12}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
