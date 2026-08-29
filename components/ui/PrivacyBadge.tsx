'use client';

import React from 'react';
import { ShieldCheck, Lock, Cpu, EyeOff } from 'lucide-react';

export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-sm">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span className="font-medium tracking-tight">100% Client-Side • 0 B Data Leaves Browser</span>
    </div>
  );
}

export function PrivacyFeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      <div className="p-4 rounded-xl bg-surface-100 border border-border flex flex-col space-y-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-brand-emerald">
          <Cpu className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-100">Zero Server Footprint</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          All parsing, AST transformations, and quicktype tasks execute entirely within your browser via dedicated Web Workers.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-100 border border-border flex flex-col space-y-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-brand-indigo">
          <Lock className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-100">Private URL Hash State</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          State is compressed directly into the URL hash (#data=...) using LZ-String. No databases or cloud storage are ever touched.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-100 border border-border flex flex-col space-y-2">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-brand-violet">
          <EyeOff className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-100">Zero Telemetry & Tracking</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          We do not log payloads, API keys, schemas, or sensitive records. Safe for proprietary production data and enterprise code.
        </p>
      </div>
    </div>
  );
}
