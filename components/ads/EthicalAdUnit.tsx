'use client';

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function EthicalAdUnit() {
  return (
    <div className="my-6 p-4 rounded-xl bg-surface-100/60 border border-dashed border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-brand-emerald flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-zinc-200">
            Privacy-First Developer Utilities
          </div>
          <div className="text-[11px] text-zinc-400">
            Support zero-server open-source software. No third-party tracking scripts or cookie profiling.
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-500 bg-surface-200 px-2.5 py-1 rounded border border-border">
        <ShieldCheck className="w-3 h-3 text-brand-emerald" />
        <span>Ethical Developer Sponsor</span>
      </div>
    </div>
  );
}
