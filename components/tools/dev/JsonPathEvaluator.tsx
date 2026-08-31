'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Search, Code2, Trash2, Check } from 'lucide-react';

function evaluateSimpleJsonPath(obj: any, path: string): any {
  if (!path || path === '$' || path === '.') return obj;

  const normalized = path.replace(/^\$\.?/, '');
  const tokens = normalized.split(/\.|\[|\]/).filter(Boolean);

  let current = obj;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === '*') {
      if (Array.isArray(current)) {
        const restPath = tokens.slice(i + 1).join('.');
        return current.map((item) => (restPath ? evaluateSimpleJsonPath(item, restPath) : item));
      }
      if (typeof current === 'object' && current !== null) {
        const restPath = tokens.slice(i + 1).join('.');
        return Object.values(current).map((item) => (restPath ? evaluateSimpleJsonPath(item, restPath) : item));
      }
      return undefined;
    }

    if (current === undefined || current === null) return undefined;

    if (Array.isArray(current) && !isNaN(Number(token))) {
      current = current[Number(token)];
    } else if (typeof current === 'object') {
      current = current[token];
    } else {
      return undefined;
    }
  }

  return current;
}

export function JsonPathEvaluator() {
  const [jsonStr, setJsonStr] = useState(
    JSON.stringify(
      {
        store: {
          book: [
            { category: 'reference', author: 'Nigel Rees', title: 'Sayings of the Century', price: 8.95 },
            { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 },
            { category: 'fiction', author: 'Herman Melville', title: 'Moby Dick', isbn: '0-553-21311-3', price: 8.99 },
            { category: 'fiction', author: 'J. R. R. Tolkien', title: 'The Lord of the Rings', isbn: '0-395-19395-8', price: 22.99 },
          ],
          bicycle: { color: 'red', price: 19.95 },
        },
      },
      null,
      2
    )
  );

  const [path, setPath] = useState('$.store.book[*].title');

  const { resultStr, matchCount } = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonStr);
      const res = evaluateSimpleJsonPath(parsed, path);

      if (res === undefined) {
        return { resultStr: '/* No match found for expression */', matchCount: 0 };
      }

      const count = Array.isArray(res) ? res.length : 1;
      return { resultStr: JSON.stringify(res, null, 2), matchCount: count };
    } catch (err: any) {
      return { resultStr: `/* JSON Parse Error: ${err.message} */`, matchCount: 0 };
    }
  }, [jsonStr, path]);

  const PRESETS = [
    '$.store.book[*].title',
    '$.store.book[*].author',
    '$.store.bicycle',
    '$.store.book[0]',
  ];

  return (
    <div className="space-y-6">
      {/* Path Input Strip */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-white font-bold">
            <Search className="w-4 h-4 text-brand-emerald" />
            <span>JSONPath Expression:</span>
          </span>
          <span className="text-brand-emerald font-bold">{matchCount} Match(es)</span>
        </div>

        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.book[*].author"
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Quick Paths:</span>
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPath(p)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column JSON Input & Result Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Code2 className="w-4 h-4 text-brand-emerald" />
              <span>Input JSON Data:</span>
            </span>
            <button
              type="button"
              onClick={() => setJsonStr('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={jsonStr}
            onChange={(e) => setJsonStr(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Paste your JSON payload..."
          />
        </div>

        {/* Query Result Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">JSONPath Evaluation Result:</span>
              <CopyButton text={resultStr} />
            </div>

            <textarea
              readOnly
              value={resultStr}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
