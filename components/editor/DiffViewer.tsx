'use client';

import React, { useMemo } from 'react';
import { diffLines, Change } from 'diff';
import { Columns, Split, ArrowLeftRight } from 'lucide-react';

export interface DiffViewerProps {
  originalText: string;
  modifiedText: string;
  originalTitle?: string;
  modifiedTitle?: string;
}

export function DiffViewer({
  originalText,
  modifiedText,
  originalTitle = 'Original',
  modifiedTitle = 'Transformed',
}: DiffViewerProps) {
  const diffs = useMemo(() => {
    try {
      return diffLines(originalText, modifiedText);
    } catch {
      return [];
    }
  }, [originalText, modifiedText]);

  return (
    <div className="w-full h-full flex flex-col bg-surface border border-border rounded-lg overflow-hidden font-mono text-xs">
      {/* Diff Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-200 border-b border-border text-zinc-300">
        <div className="flex items-center space-x-2">
          <ArrowLeftRight className="w-4 h-4 text-brand-emerald" />
          <span className="font-semibold text-zinc-200">Diff Comparison</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            <span>Removed</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Added</span>
          </span>
        </div>
      </div>

      {/* Diff Stream */}
      <div className="flex-1 overflow-auto p-4 space-y-0.5 leading-relaxed select-text">
        {diffs.map((part: Change, index: number) => {
          const colorClass = part.added
            ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 pl-2'
            : part.removed
            ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 pl-2'
            : 'text-zinc-400 pl-2.5';

          const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

          return (
            <div key={index} className={`whitespace-pre-wrap ${colorClass}`}>
              {part.value.split('\n').filter(Boolean).map((line, lIdx) => (
                <div key={lIdx}>
                  <span className="opacity-40 select-none mr-1">{prefix}</span>
                  {line}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
