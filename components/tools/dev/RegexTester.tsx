'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Terminal, CheckCircle2, AlertCircle, Sparkles, Trash2, Eye } from 'lucide-react';

export function RegexTester() {
  const [pattern, setPattern] = useState(String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`);
  const [flags, setFlags] = useState('gm');
  const [testText, setTestText] = useState(
    `Contact us at support@example.com or sales@company.org.
You can also reach out to admin123@sub.domain.co.uk for inquiries!`
  );

  const { matches, isValid, error } = useMemo(() => {
    if (!pattern) return { matches: [], isValid: true, error: '' };
    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: { match: string; index: number; groups: string[] }[] = [];

      if (flags.includes('g')) {
        let m;
        while ((m = regex.exec(testText)) !== null) {
          if (m.index === regex.lastIndex) regex.lastIndex++;
          allMatches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      } else {
        const m = regex.exec(testText);
        if (m) {
          allMatches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      }

      return { matches: allMatches, isValid: true, error: '' };
    } catch (err: any) {
      return { matches: [], isValid: false, error: err.message };
    }
  }, [pattern, flags, testText]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, '') : prev + f));
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-brand-emerald font-bold">
            <Terminal className="w-4 h-4" />
            <span>Regular Expression (RegEx)</span>
          </span>
          <div className="flex items-center space-x-1">
            {(['g', 'i', 'm', 's'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all ${
                  flags.includes(f)
                    ? 'bg-brand-emerald text-black shadow-sm'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title={`Flag: ${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-zinc-500 font-mono text-base pointer-events-none">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g. \d{3}-\d{4})..."
            className="w-full pl-7 pr-16 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald"
          />
          <span className="absolute right-3 text-zinc-500 font-mono text-xs pointer-events-none">/{flags}</span>
        </div>

        {!isValid && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Syntax Error: {error}</span>
          </div>
        )}
      </div>

      {/* 2-Column Test Area & Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Test String / Payload</span>
            <button
              type="button"
              onClick={() => setTestText('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={10}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none resize-none leading-relaxed"
            placeholder="Enter test string to match regex against..."
          />
        </div>

        {/* Matches List */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-emerald font-bold">
              Matches Found: {matches.length}
            </span>
            <span className="text-zinc-500 text-[11px]">Index & Groups</span>
          </div>

          <div className="flex-1 space-y-2 max-h-[260px] overflow-y-auto no-scrollbar">
            {matches.length > 0 ? (
              matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold break-all">{m.match}</span>
                    <span className="text-[10px] text-zinc-500">index: {m.index}</span>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="text-[11px] text-zinc-400 space-x-2 pt-1 border-t border-zinc-800/60">
                      {m.groups.map((g, gIdx) => (
                        <span key={gIdx} className="bg-zinc-900 px-1.5 py-0.5 rounded text-sky-400">
                          Group {gIdx + 1}: {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded-xl">
                No regex matches found in test string.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
