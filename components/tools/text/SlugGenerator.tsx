'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Link2, Sparkles, Sliders, Trash2, ArrowRight, Check } from 'lucide-react';

const CHAR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', I: 'i', İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
  ä: 'a', Ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  ñ: 'n', Ñ: 'n',
  ß: 'ss',
};

export function SlugGenerator() {
  const [inputText, setInputText] = useState(
    'En İyi 10 Yazılım Geliştirici Aracı & Türkçe Karakter Dönüştürücü!'
  );
  const [separator, setSeparator] = useState<'-' | '_' | '.'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeNumbers, setRemoveNumbers] = useState(false);

  const generatedSlug = useMemo(() => {
    if (!inputText) return '';

    let text = inputText;

    // Replace Turkish & accented characters
    Object.entries(CHAR_MAP).forEach(([char, replacement]) => {
      text = text.replaceAll(char, replacement);
    });

    if (lowercase) {
      text = text.toLowerCase();
    }

    // Remove non-alphanumeric characters (except whitespace)
    if (removeNumbers) {
      text = text.replace(/[^a-zA-Z\s]/g, '');
    } else {
      text = text.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    // Replace whitespace sequences with separator
    text = text.trim().replace(/\s+/g, separator);

    return text;
  }, [inputText, separator, lowercase, removeNumbers]);

  return (
    <div className="space-y-6">
      {/* Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Separator:</span>
            <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setSeparator('-')}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  separator === '-' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Hyphen (-)
              </button>
              <button
                type="button"
                onClick={() => setSeparator('_')}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  separator === '_' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Underscore (_)
              </button>
            </div>
          </div>

          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>lowercase</span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setInputText('')}
          className="text-zinc-500 hover:text-rose-400 transition-colors flex items-center space-x-1"
          title="Clear"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* 2-Column Inputs & Slug Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw Text Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Link2 className="w-4 h-4 text-brand-emerald" />
              <span>Original Title / Article Heading:</span>
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Type or paste text with Turkish / international characters..."
          />
        </div>

        {/* Clean URL Slug Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">SEO Friendly URL Slug:</span>
              <CopyButton text={generatedSlug} />
            </div>
            <textarea
              readOnly
              value={generatedSlug}
              rows={5}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
