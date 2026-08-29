'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ArrowUpDown, FileUp, Sparkles, Trash2 } from 'lucide-react';

export function Base64EncoderDecoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Hello World! Privacy-first utilities.');
  const [urlSafe, setUrlSafe] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const process = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(input)));
        if (urlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setOutput(encoded);
      } else {
        let toDecode = input;
        if (urlSafe) {
          toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
          while (toDecode.length % 4) {
            toDecode += '=';
          }
        }
        const decoded = decodeURIComponent(escape(atob(toDecode)));
        setOutput(decoded);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid input for operation.');
      setOutput('');
    }
  };

  React.useEffect(() => {
    process();
  }, [input, mode, urlSafe]);

  const handleSwap = () => {
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6">
      {/* Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-surface-200 border border-border rounded-xl text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg bg-surface-300 border border-border p-0.5">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'encode' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Encode to Base64
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'decode' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer select-none ml-2">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-border bg-surface text-brand-emerald focus:ring-0"
            />
            <span>URL-Safe Base64</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-surface-300 hover:bg-surface-50 text-zinc-200 border border-border transition-colors font-medium"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-emerald" />
          <span>Swap Input & Output</span>
        </button>
      </div>

      {/* Inputs & Outputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
            <span className="font-mono text-zinc-400">
              Input ({mode === 'encode' ? 'Plain Text' : 'Base64'})
            </span>
            <button
              type="button"
              onClick={() => setInput('')}
              className="text-zinc-500 hover:text-rose-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste here..."
            rows={8}
            className="w-full p-4 bg-oled text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
            <span className="font-mono text-zinc-400">
              Output ({mode === 'encode' ? 'Base64' : 'Decoded Text'})
            </span>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={error || output}
            rows={8}
            className={`w-full p-4 bg-oled text-xs font-mono focus:outline-none resize-none leading-relaxed ${
              error ? 'text-rose-400' : 'text-brand-emerald'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
