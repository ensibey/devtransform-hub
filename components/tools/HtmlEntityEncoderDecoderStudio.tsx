'use client';

import React, { useState, useMemo } from 'react';
import { Code2, Copy, Check, Sparkles, RefreshCw, ArrowRightLeft, ShieldCheck } from 'lucide-react';

const SAMPLE_TEXT = `<div class="hero-banner" id="main">
  <h1>Welcome & Enjoy "Special Deals" '2026'</h1>
  <p>© DevTransform • 100% Free & Open-Source • π ≈ 3.14159</p>
</div>`;

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '•': '&bull;',
  '—': '&mdash;',
  '–': '&ndash;',
};

export function HtmlEntityEncoderDecoderStudio() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeFormat, setEncodeFormat] = useState<'named' | 'decimal' | 'hex'>('named');
  const [input, setInput] = useState<string>(SAMPLE_TEXT);
  const [copied, setCopied] = useState<boolean>(false);

  const output = useMemo(() => {
    if (!input) return '';

    if (mode === 'encode') {
      if (encodeFormat === 'named') {
        return input.replace(/[&<>"'©®™€£¥•—–]/g, (char) => ENTITY_MAP[char] || char);
      } else if (encodeFormat === 'decimal') {
        return input.replace(/[&<>"'©®™€£¥•—–]/g, (char) => `&#${char.charCodeAt(0)};`);
      } else {
        return input.replace(/[&<>"'©®™€£¥•—–]/g, (char) => `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`);
      }
    } else {
      // Decode HTML entities
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      return doc.documentElement.textContent || '';
    }
  }, [input, mode, encodeFormat]);

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-400" />
              HTML Entity Encoder & Decoder Studio
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Safely encode reserved characters into HTML named, decimal, or hexadecimal entities, or decode HTML entities back to raw text.
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
                Encode Entities
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                  mode === 'decode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Decode Entities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options Toolbar */}
      {mode === 'encode' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Entity Format:
          </span>
          <div className="flex items-center gap-2">
            {[
              { id: 'named', label: 'Named (&lt;, &gt;, &amp;)' },
              { id: 'decimal', label: 'Decimal (&#60;, &#62;)' },
              { id: 'hex', label: 'Hexadecimal (&#x3C;, &#x3E;)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setEncodeFormat(f.id as any)}
                className={`px-3 py-1 text-xs rounded-lg border transition ${
                  encodeFormat === f.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Input vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {mode === 'encode' ? 'Raw Source Text' : 'Encoded HTML String'}
            </span>
            <button
              onClick={() => setInput(SAMPLE_TEXT)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition"
            >
              Reset Sample
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            placeholder={mode === 'encode' ? 'Type or paste HTML markup here...' : 'Paste &lt;div&gt; entities here...'}
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />
        </div>

        {/* Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {mode === 'encode' ? 'Safe Encoded Output' : 'Decoded Plain Text'}
            </span>
            <button
              onClick={copyResult}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>

          <textarea
            readOnly
            value={output}
            rows={14}
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 select-all leading-relaxed resize-y"
          />
        </div>
      </div>
    </div>
  );
}
