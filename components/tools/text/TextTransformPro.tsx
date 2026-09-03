'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Type, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

const MORSE_CODE_MAP: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....',
  i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.',
  q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
  y: '-.--', z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  ' ': '/',
};

const LEET_MAP: Record<string, string> = {
  a: '4', b: '8', e: '3', g: '9', i: '1', l: '1', o: '0', s: '5', t: '7', z: '2',
};

function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code >= 97 ? 97 : 65;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
}

function textToBinary(str: string): string {
  return str
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

function textToMorse(str: string): string {
  return str
    .toLowerCase()
    .split('')
    .map((c) => MORSE_CODE_MAP[c] || c)
    .join(' ');
}

function textToLeet(str: string): string {
  return str
    .split('')
    .map((c) => LEET_MAP[c.toLowerCase()] || c)
    .join('');
}

export function TextTransformPro() {
  const [inputText, setInputText] = useState('ZeroUpload Universal Developer Suite 2026');
  const [mode, setMode] = useState<'reverse' | 'binary' | 'morse' | 'rot13' | 'leet'>('rot13');

  const transformedText = useMemo(() => {
    switch (mode) {
      case 'reverse':
        return inputText.split('').reverse().join('');
      case 'binary':
        return textToBinary(inputText);
      case 'morse':
        return textToMorse(inputText);
      case 'rot13':
        return rot13(inputText);
      case 'leet':
        return textToLeet(inputText);
      default:
        return inputText;
    }
  }, [inputText, mode]);

  const MODES = [
    { key: 'rot13', label: 'ROT13 Cipher' },
    { key: 'binary', label: 'ASCII to Binary' },
    { key: 'morse', label: 'Morse Code' },
    { key: 'leet', label: '1337 Leet Speak' },
    { key: 'reverse', label: 'Reverse String' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Modes Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              mode === m.key
                ? 'bg-zinc-800 text-brand-emerald font-bold border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 2-Column Inputs & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Type className="w-4 h-4 text-brand-emerald" />
              <span>Input Text ({inputText.length} chars):</span>
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
            rows={12}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Type or paste your text here..."
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Transformed Result:</span>
              <CopyButton text={transformedText} />
            </div>

            <textarea
              readOnly
              value={transformedText}
              rows={12}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
