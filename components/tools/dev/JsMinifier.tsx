'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, Download, Trash2, Sliders, Check } from 'lucide-react';

export function JsMinifier() {
  const [inputCode, setInputCode] = useState(
    `/**
 * Calculate the Fibonacci sequence
 * @param {number} n
 * @returns {number}
 */
function fibonacci(n) {
  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }

  return b;
}

console.log('Result:', fibonacci(10));`
  );

  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);

  const minifiedCode = useMemo(() => {
    if (!inputCode.trim()) return '';

    let code = inputCode;

    if (removeComments) {
      // Remove multi-line comments
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove single-line comments (ignoring strings with urls)
      code = code.replace(/(^|[^\:\"\'\`])\/\/[^\n]*/g, '$1');
    }

    if (removeWhitespace) {
      // Normalize line breaks
      code = code.replace(/\r\n/g, '\n');
      // Collapse multiple spaces/tabs into single space
      code = code.replace(/[ \t]+/g, ' ');
      // Remove spaces around operators and punctuation
      code = code.replace(/\s*([\{\}\(\)\[\]\;\:\,\=\+\-\*\/\<\>\&\|\!\?])\s*/g, '$1');
      // Remove trailing/leading newlines
      code = code.replace(/^\s+|\s+$/g, '');
    }

    return code;
  }, [inputCode, removeComments, removeWhitespace]);

  const originalSize = new Blob([inputCode]).size;
  const minifiedSize = new Blob([minifiedCode]).size;
  const savedBytes = Math.max(0, originalSize - minifiedSize);
  const savedPercentage = originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : '0';

  const downloadJs = () => {
    const blob = new Blob([minifiedCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bundle.min.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Savings Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Strip Comments</span>
          </label>

          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeWhitespace}
              onChange={(e) => setRemoveWhitespace(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Compact Whitespace</span>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-emerald-400 font-bold">
            Saved: {savedPercentage}% ({savedBytes} bytes)
          </div>

          <button
            type="button"
            onClick={downloadJs}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .min.js</span>
          </button>
        </div>
      </div>

      {/* 2-Column Inputs & Minified Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Code */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileCode className="w-4 h-4 text-brand-emerald" />
              <span>Original JS / TS Source ({originalSize} bytes):</span>
            </span>
            <button
              type="button"
              onClick={() => setInputCode('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Paste your JavaScript / TypeScript code here..."
          />
        </div>

        {/* Minified Code */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Minified Output ({minifiedSize} bytes):</span>
              <CopyButton text={minifiedCode} />
            </div>

            <textarea
              readOnly
              value={minifiedCode}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
