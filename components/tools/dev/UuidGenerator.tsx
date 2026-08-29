'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { RefreshCw, Download, Sparkles } from 'lucide-react';
import { downloadText } from '@/lib/utils';

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [brackets, setBrackets] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuidV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let uid = generateUuidV4();
      if (!hyphens) uid = uid.replace(/-/g, '');
      if (uppercase) uid = uid.toUpperCase();
      if (brackets) uid = `{${uid}}`;
      list.push(uid);
    }
    setUuids(list);
  };

  React.useEffect(() => {
    generate();
  }, [count, uppercase, hyphens, brackets]);

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-200 border border-border rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-mono">Quantity:</span>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
              className="w-16 bg-surface-300 border border-border rounded px-2 py-1 text-zinc-100 font-mono text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none"
            />
          </div>

          <label className="flex items-center space-x-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-border bg-surface text-brand-emerald focus:ring-0"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center space-x-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded border-border bg-surface text-brand-emerald focus:ring-0"
            />
            <span>Hyphens (-)</span>
          </label>

          <label className="flex items-center space-x-1.5 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={brackets}
              onChange={(e) => setBrackets(e.target.checked)}
              className="rounded border-border bg-surface text-brand-emerald focus:ring-0"
            />
            <span>Brackets {}</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={generate}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-emerald text-black font-semibold hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* UUIDs Output List */}
      <div className="rounded-xl border border-border bg-oled overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-200 border-b border-border text-xs">
          <span className="font-mono text-zinc-400">
            Generated UUID v4 List ({uuids.length})
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => downloadText(uuids.join('\n'), 'uuids.txt')}
              className="px-2.5 py-1 rounded bg-surface-300 hover:bg-surface-50 text-zinc-300 border border-border"
            >
              Download .txt
            </button>
            <CopyButton text={uuids.join('\n')} label="Copy All" />
          </div>
        </div>
        <div className="p-4 max-h-[360px] overflow-y-auto space-y-1.5 font-mono text-xs text-brand-emerald select-all">
          {uuids.map((u, i) => (
            <div key={i} className="hover:bg-zinc-900/60 px-2 py-0.5 rounded">
              {u}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
