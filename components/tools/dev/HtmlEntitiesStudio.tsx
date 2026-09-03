'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code, ArrowRightLeft, Sparkles, Check, Trash2 } from 'lucide-react';

function encodeHtmlEntities(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

function decodeHtmlEntities(str: string): string {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent || '';
}

export function HtmlEntitiesStudio() {
  const [inputText, setInputText] = useState(
    `<div class="alert-box">\n  <h3>Warning: &lt;script&gt; tag detected!</h3>\n  <p>User "Alex" said: 'Hello & Welcome to 2026!'</p>\n</div>`
  );

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const outputText = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return mode === 'encode' ? encodeHtmlEntities(inputText) : decodeHtmlEntities(inputText);
  }, [inputText, mode]);

  return (
    <div className="space-y-6">
      {/* Modes Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'encode' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Encode HTML Entities
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'decode' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Decode HTML Entities
          </button>
        </div>
      </div>

      {/* 2-Column Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Input Text / HTML:</span>
            </span>
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
            placeholder="<div>...</div>"
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">
                {mode === 'encode' ? 'Encoded HTML Entities:' : 'Decoded Plain HTML:'}
              </span>
              <CopyButton text={outputText} />
            </div>

            <textarea
              readOnly
              value={outputText}
              rows={12}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
