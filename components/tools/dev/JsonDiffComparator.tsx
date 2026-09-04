'use client';

import React, { useState, useMemo } from 'react';
import { diffLines, Change } from 'diff';
import { CopyButton } from '@/components/shared/CopyButton';
import { GitCompare, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';

const SAMPLE_A = `{
  "id": "usr_9921",
  "name": "Jane Doe",
  "role": "Engineer",
  "tier": "Free",
  "features": ["api_access", "dashboard"],
  "metadata": {
    "loginCount": 42,
    "verified": true
  }
}`;

const SAMPLE_B = `{
  "id": "usr_9921",
  "name": "Jane Doe",
  "role": "Senior Staff Engineer",
  "tier": "Enterprise",
  "features": ["api_access", "dashboard", "sso_saml", "audit_logs"],
  "metadata": {
    "loginCount": 89,
    "verified": true,
    "securityKey": "enabled"
  }
}`;

function sortJsonObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortJsonObject);
  return Object.keys(obj)
    .sort()
    .reduce((res: any, key) => {
      res[key] = sortJsonObject(obj[key]);
      return res;
    }, {});
}

export function JsonDiffComparator() {
  const [jsonA, setJsonA] = useState(SAMPLE_A);
  const [jsonB, setJsonB] = useState(SAMPLE_B);
  const [sortKeys, setSortKeys] = useState(true);

  const { diffChanges, additions, deletions, error } = useMemo(() => {
    try {
      if (!jsonA.trim() || !jsonB.trim()) {
        return { diffChanges: [], additions: 0, deletions: 0, error: null };
      }

      let parsedA = JSON.parse(jsonA);
      let parsedB = JSON.parse(jsonB);

      if (sortKeys) {
        parsedA = sortJsonObject(parsedA);
        parsedB = sortJsonObject(parsedB);
      }

      const formattedA = JSON.stringify(parsedA, null, 2);
      const formattedB = JSON.stringify(parsedB, null, 2);

      const changes = diffLines(formattedA, formattedB);

      let addCount = 0;
      let delCount = 0;
      changes.forEach((c) => {
        const lines = (c.value.match(/\n/g) || []).length || 1;
        if (c.added) addCount += lines;
        if (c.removed) delCount += lines;
      });

      return {
        diffChanges: changes,
        additions: addCount,
        deletions: delCount,
        error: null,
      };
    } catch (err: any) {
      return {
        diffChanges: [],
        additions: 0,
        deletions: 0,
        error: `JSON Parse Error: ${err.message}`,
      };
    }
  }, [jsonA, jsonB, sortKeys]);

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-zinc-200 text-sm">
              Semantic JSON Diff & Object Comparison
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              Ignore Key Ordering (Sort Keys)
            </label>

            {!error && (
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
                  +{additions} lines
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800/80 text-red-400">
                  -{deletions} lines
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">Original JSON (Before)</label>
          <textarea
            rows={10}
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Paste original JSON..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">Modified JSON (After)</label>
          <textarea
            rows={10}
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            className="w-full p-3.5 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Paste modified JSON..."
          />
        </div>
      </div>

      {/* Diff Result Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Visual Unified Diff Viewer
          </span>
          {additions === 0 && deletions === 0 && !error && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> JSON objects are semantically identical
            </span>
          )}
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            {error}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto max-h-[400px]">
            {diffChanges.map((part, index) => {
              const colorClass = part.added
                ? 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500 pl-2'
                : part.removed
                ? 'bg-red-950/30 text-red-300 border-l-2 border-red-500 line-through opacity-80 pl-2'
                : 'text-zinc-400 pl-2';

              return (
                <div key={index} className={`${colorClass} py-0.5 whitespace-pre`}>
                  {part.value}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
