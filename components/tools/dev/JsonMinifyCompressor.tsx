'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Minimize2, Sparkles, Check, AlertCircle, Download, ArrowDown } from 'lucide-react';

const SAMPLE_JSON = `{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;

export function JsonMinifyCompressor() {
  const [inputJson, setInputJson] = useState(SAMPLE_JSON);
  const [escapeQuotes, setEscapeQuotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { minified, originalSize, minifiedSize, savingsPercent } = useMemo(() => {
    if (!inputJson.trim()) {
      return { minified: '', originalSize: 0, minifiedSize: 0, savingsPercent: 0 };
    }

    try {
      const parsed = JSON.parse(inputJson);
      let output = JSON.stringify(parsed);

      if (escapeQuotes) {
        output = output.replace(/"/g, '\\"');
      }

      const origBytes = new TextEncoder().encode(inputJson).length;
      const minBytes = new TextEncoder().encode(output).length;
      const savings = origBytes > 0 ? Math.max(0, ((origBytes - minBytes) / origBytes) * 100) : 0;

      setError(null);
      return {
        minified: output,
        originalSize: origBytes,
        minifiedSize: minBytes,
        savingsPercent: savings,
      };
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      return { minified: '', originalSize: 0, minifiedSize: 0, savingsPercent: 0 };
    }
  }, [inputJson, escapeQuotes]);

  const downloadMinified = () => {
    const blob = new Blob([minified], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.min.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Metric & Savings Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Original Size</span>
          <div className="text-lg font-bold font-mono text-zinc-300">
            {originalSize.toLocaleString()} B
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Minified Size</span>
          <div className="text-lg font-bold font-mono text-brand-emerald">
            {minifiedSize.toLocaleString()} B
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Space Saved</span>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {savingsPercent.toFixed(1)}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-center items-center">
          <label className="flex items-center space-x-2 text-xs font-mono text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={escapeQuotes}
              onChange={(e) => setEscapeQuotes(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
            />
            <span>Escape Quotes (\&quot;)</span>
          </label>
        </div>
      </div>

      {/* Side by Side Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw JSON */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Input Formatted JSON
            </span>
            <button
              type="button"
              onClick={() => setInputJson(SAMPLE_JSON)}
              className="text-[11px] font-mono text-brand-emerald hover:underline"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            rows={14}
            placeholder="Paste JSON here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
          />
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Minified JSON */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Minimize2 className="w-3.5 h-3.5 text-brand-emerald" />
              Minified Single-Line JSON
            </span>
            <div className="flex items-center space-x-2">
              {minified && (
                <button
                  type="button"
                  onClick={downloadMinified}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>.min.json</span>
                </button>
              )}
              {minified && <CopyButton text={minified} />}
            </div>
          </div>
          <textarea
            readOnly
            value={minified}
            rows={14}
            placeholder="Minified JSON will appear here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none break-all leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}
