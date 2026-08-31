'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Fingerprint, RefreshCw, Download, Sliders, Check } from 'lucide-react';

function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function BulkUuidGenerator() {
  const [count, setCount] = useState(20);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [quotes, setQuotes] = useState(false);
  const [asJsonArray, setAsJsonArray] = useState(false);
  const [seed, setSeed] = useState(1);

  const generatedList = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateUuidV4();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      if (quotes && !asJsonArray) id = `"${id}"`;
      list.push(id);
    }

    if (asJsonArray) {
      return JSON.stringify(list, null, 2);
    }
    return list.join('\n');
  }, [count, uppercase, hyphens, quotes, asJsonArray, seed]);

  const downloadFile = () => {
    const filename = asJsonArray ? `uuids-${count}.json` : `uuids-${count}.txt`;
    const mime = asJsonArray ? 'application/json' : 'text/plain';
    const blob = new Blob([generatedList], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Strip */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Fingerprint className="w-4 h-4 text-brand-emerald" />
            <span>Bulk UUID / GUID Parameters</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>

            <button
              type="button"
              onClick={downloadFile}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono border border-emerald-500/40 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {asJsonArray ? '.json' : '.txt'}</span>
            </button>
          </div>
        </div>

        {/* Count Slider */}
        <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-zinc-800">
          <div className="flex justify-between text-zinc-400">
            <span>Quantity:</span>
            <span className="text-brand-emerald font-bold">{count} UUIDs</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800 text-xs font-mono">
          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>Include Hyphens</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={quotes}
              onChange={(e) => setQuotes(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>Add Quotes (&quot;)</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={asJsonArray}
              onChange={(e) => setAsJsonArray(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>JSON Array</span>
          </label>
        </div>
      </div>

      {/* Output Viewer Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">Generated UUIDs ({count} items):</span>
          <CopyButton text={generatedList} />
        </div>
        <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[350px] leading-relaxed">
          {generatedList}
        </pre>
      </div>
    </div>
  );
}
