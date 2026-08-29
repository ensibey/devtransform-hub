'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code, Trash2, ArrowRightLeft, Sparkles, Check } from 'lucide-react';

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
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

const REVERSE_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x2F;': '/',
  '&#x60;': '`',
  '&#x3D;': '=',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&bull;': '•',
  '&mdash;': '—',
  '&ndash;': '–',
};

export function HtmlEntityEncoder() {
  const [inputText, setInputText] = useState(
    `<div class="card" id="user-123">\n  <h3>"Hello, World!" & 'Welcome' © 2026</h3>\n</div>`
  );

  const encodedNamed = useMemo(() => {
    return inputText.replace(/[&<>"'`=\/©®™€£¥•—–]/g, (char) => ENTITY_MAP[char] || char);
  }, [inputText]);

  const encodedNumeric = useMemo(() => {
    return inputText
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        return code > 127 || /[&<>"'`=\/]/.test(char) ? `&#${code};` : char;
      })
      .join('');
  }, [inputText]);

  const decodedText = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const doc = new DOMParser().parseFromString(inputText, 'text/html');
        return doc.documentElement.textContent || '';
      } catch {
        // Fallback
      }
    }
    // Safe SSR fallback decoder
    return inputText.replace(/&[a-zA-Z0-9#x]+;/g, (entity) => {
      if (REVERSE_ENTITY_MAP[entity]) return REVERSE_ENTITY_MAP[entity];
      if (entity.startsWith('&#x')) return String.fromCharCode(parseInt(entity.slice(3, -1), 16));
      if (entity.startsWith('&#')) return String.fromCharCode(parseInt(entity.slice(2, -1), 10));
      return entity;
    });
  }, [inputText]);

  return (
    <div className="space-y-6">
      {/* Raw Input */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-white font-bold">
            <Code className="w-4 h-4 text-brand-emerald" />
            <span>Input HTML / Text String:</span>
          </span>
          <button
            type="button"
            onClick={() => setInputText('')}
            className="text-zinc-500 hover:text-rose-400 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
          placeholder="Paste HTML or string with special characters..."
        />
      </div>

      {/* 2-Column Outputs (Named Entities vs Decoded Plain Text) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Encoded Named */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Encoded (Named HTML Entities):</span>
              <CopyButton text={encodedNamed} />
            </div>
            <textarea
              readOnly
              value={encodedNamed}
              rows={6}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Encoded Decimal / Numeric */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-sky-400">
              <span className="font-bold">Encoded (Numeric Entities &amp;#123;):</span>
              <CopyButton text={encodedNumeric} />
            </div>
            <textarea
              readOnly
              value={encodedNumeric}
              rows={6}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
