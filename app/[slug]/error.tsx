'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ConverterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 p-6 bg-surface-100 border border-border rounded-2xl my-8">
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-lg font-bold text-white">Something went wrong</h2>
        <p className="text-xs text-zinc-400">
          An unexpected error occurred during editor initialization or AST conversion.
        </p>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
        <Link
          href="/"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
