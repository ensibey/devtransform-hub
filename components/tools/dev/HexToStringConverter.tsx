'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Binary, ArrowLeftRight, Sparkles, Check, AlertCircle, Eye } from 'lucide-react';

function stringToHex(str: string, delimiter: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const hexParts = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));

  if (delimiter === 'space') return hexParts.join(' ');
  if (delimiter === '0x') return hexParts.map((h) => `0x${h}`).join(', ');
  if (delimiter === 'colon') return hexParts.join(':');
  return hexParts.join('');
}

function hexToString(hex: string): { text: string; error: string | null } {
  const clean = hex.replace(/0x/g, '').replace(/[\s,:]+/g, '').trim();
  if (!clean) return { text: '', error: null };
  if (clean.length % 2 !== 0) {
    return { text: '', error: 'Hex string must have an even number of characters' };
  }

  try {
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      const byte = parseInt(clean.slice(i, i + 2), 16);
      if (isNaN(byte)) {
        return { text: '', error: `Invalid hexadecimal sequence "${clean.slice(i, i + 2)}"` };
      }
      bytes[i / 2] = byte;
    }
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return { text: decoded, error: null };
  } catch (err: any) {
    return { text: '', error: err.message || 'Failed to decode hex' };
  }
}

function generateHexDump(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const lines: string[] = [];

  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const offset = i.toString(16).padStart(8, '0');
    const hexBytes = Array.from(chunk, (b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(48, ' ');
    const ascii = Array.from(chunk, (b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');
    lines.push(`${offset}  ${hexBytes}  |${ascii}|`);
  }

  return lines.join('\n');
}

const DEFAULT_TEXT = 'DevTransform: Fast, Private & Free Developer Tools.';

export function HexToStringConverter() {
  const [direction, setDirection] = useState<'strToHex' | 'hexToStr'>('strToHex');
  const [inputText, setInputText] = useState(DEFAULT_TEXT);
  const [inputHex, setInputHex] = useState('');
  const [delimiter, setDelimiter] = useState<'none' | 'space' | '0x' | 'colon'>('space');

  const { resultText, resultHex, error, hexDump } = useMemo(() => {
    if (direction === 'strToHex') {
      const hex = stringToHex(inputText, delimiter);
      const dump = generateHexDump(inputText);
      return { resultText: inputText, resultHex: hex, error: null, hexDump: dump };
    } else {
      const { text, error: hexErr } = hexToString(inputHex);
      const dump = text ? generateHexDump(text) : '';
      return { resultText: text, resultHex: inputHex, error: hexErr, hexDump: dump };
    }
  }, [direction, inputText, inputHex, delimiter]);

  const handleSwap = () => {
    if (direction === 'strToHex') {
      setInputHex(resultHex);
      setDirection('hexToStr');
    } else {
      setInputText(resultText);
      setDirection('strToHex');
    }
  };

  return (
    <div className="space-y-6">
      {/* Direction & Format Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Binary className="w-5 h-5 text-brand-emerald" />
          <span className="text-sm font-semibold text-white">
            {direction === 'strToHex' ? 'ASCII / UTF-8 Text ➔ Hexadecimal' : 'Hexadecimal ➔ ASCII / UTF-8 Text'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-mono text-zinc-500">Hex Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as any)}
              className="px-2 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-brand-emerald focus:outline-none"
            >
              <option value="space">Space (48 65)</option>
              <option value="none">None (4865)</option>
              <option value="0x">0x Array (0x48, 0x65)</option>
              <option value="colon">Colon (48:65)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-mono transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Swap</span>
          </button>
        </div>
      </div>

      {/* Conversion Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {direction === 'strToHex' ? 'Source String (UTF-8)' : 'Source Hex String'}
            </span>
          </div>
          <textarea
            value={direction === 'strToHex' ? inputText : inputHex}
            onChange={(e) => (direction === 'strToHex' ? setInputText(e.target.value) : setInputHex(e.target.value))}
            rows={10}
            placeholder={direction === 'strToHex' ? 'Enter text to convert to hex...' : 'Enter hex string (e.g. 48 65 6c 6c 6f)...'}
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
          />
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {direction === 'strToHex' ? 'Hexadecimal Output' : 'Decoded Text Output'}
            </span>
            <CopyButton text={direction === 'strToHex' ? resultHex : resultText} />
          </div>
          <textarea
            readOnly
            value={direction === 'strToHex' ? resultHex : resultText}
            rows={10}
            placeholder="Result will appear here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none break-all leading-relaxed select-all"
          />
        </div>
      </div>

      {/* Hex Dump View */}
      {hexDump && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-emerald" />
              Hexadecimal Memory Dump (Offset | Bytes | ASCII)
            </span>
            <CopyButton text={hexDump} />
          </div>
          <textarea
            readOnly
            value={hexDump}
            rows={8}
            className="w-full p-3 bg-black/80 border border-zinc-800 rounded-xl text-zinc-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all overflow-x-auto whitespace-pre"
          />
        </div>
      )}
    </div>
  );
}
