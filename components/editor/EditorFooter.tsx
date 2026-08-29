'use client';

import React from 'react';
import { Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface EditorFooterProps {
  value: string;
  durationMs?: number;
  isProcessing?: boolean;
  error?: string | null;
  showTiming?: boolean;
}

export function EditorFooter({
  value,
  durationMs = 0,
  isProcessing = false,
  error = null,
  showTiming = true,
}: EditorFooterProps) {
  const charCount = value.length;
  const lineCount = value ? value.split('\n').length : 0;
  const byteSize = new Blob([value]).size;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-surface-200 border-t border-border text-[11px] font-mono text-zinc-400 select-none">
      {/* Left: Validation / Execution state */}
      <div className="flex items-center space-x-2">
        {isProcessing ? (
          <div className="flex items-center space-x-1 text-amber-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Converting...</span>
          </div>
        ) : error ? (
          <div
            className="flex items-center space-x-1 text-rose-400 max-w-[280px] sm:max-w-md truncate"
            title={error}
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            <span>Valid</span>
          </div>
        )}

        {/* Execution duration latency pill */}
        {showTiming && durationMs > 0 && !isProcessing && (
          <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 text-[10px] rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
            <Zap className="w-2.5 h-2.5 text-emerald-400" />
            <span>{durationMs < 0.1 ? '<0.1ms' : `${durationMs.toFixed(1)}ms`}</span>
          </span>
        )}
      </div>

      {/* Right: Monospace size stats */}
      <div className="flex items-center space-x-3 text-zinc-500">
        <span>
          <strong className="text-zinc-300 font-normal">{lineCount}</strong> lines
        </span>
        <span className="hidden sm:inline">
          <strong className="text-zinc-300 font-normal">{charCount.toLocaleString()}</strong> chars
        </span>
        <span>
          <strong className="text-zinc-300 font-normal">{formatBytes(byteSize)}</strong>
        </span>
      </div>
    </div>
  );
}
