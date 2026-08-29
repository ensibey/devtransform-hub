'use client';

import React, { useState } from 'react';
import { DiffViewer } from '@/components/editor/DiffViewer';
import { RotateCcw } from 'lucide-react';

export function TextDiff() {
  const [original, setOriginal] = useState(`The quick brown fox jumps over the lazy dog.
Client-side web applications are fast and secure.
Everything runs locally in your browser.`);

  const [modified, setModified] = useState(`The fast brown fox leaps over the sleepy dog.
Client-side web applications are ultra-fast and 100% secure.
Everything executes locally in WebAssembly and Workers.`);

  const handleSample = () => {
    setOriginal(`function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`);
    setModified(`function calculateTotal(items: Item[]): number {\n  return items.reduce((acc, item) => acc + item.price, 0);\n}`);
  };

  return (
    <div className="space-y-6">
      {/* Input Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="px-3 py-2 bg-surface-300 border-b border-border text-xs font-mono text-zinc-300 flex justify-between items-center">
            <span>Original Text (Before)</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-[11px] text-brand-emerald hover:underline"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            rows={7}
            className="w-full p-3 bg-oled text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Modified */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="px-3 py-2 bg-surface-300 border-b border-border text-xs font-mono text-zinc-300 flex justify-between items-center">
            <span>Modified Text (After)</span>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            rows={7}
            className="w-full p-3 bg-oled text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Diff Result Stream */}
      <div className="h-[380px]">
        <DiffViewer
          originalText={original}
          modifiedText={modified}
          originalTitle="Original"
          modifiedTitle="Modified"
        />
      </div>
    </div>
  );
}
