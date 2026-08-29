'use client';

import React from 'react';
import { FormatMetadata } from '@/lib/matrix';
import { HelpCircle, Layers, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export interface TechnicalFaqProps {
  fromMeta: FormatMetadata;
  toMeta: FormatMetadata;
}

export function TechnicalFaq({ fromMeta, toMeta }: TechnicalFaqProps) {
  return (
    <section className="mt-16 border-t border-border pt-12 text-zinc-300">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-border text-xs font-mono text-brand-emerald">
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Deep Dive</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Converting {fromMeta.name} to {toMeta.name}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Understanding the architecture, type mappings, and structural transformations when translating {fromMeta.shortName} structures into {toMeta.shortName}.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-surface-100 shadow-xl">
          <div className="p-4 bg-surface-200 border-b border-border font-semibold text-xs text-zinc-200 uppercase tracking-wider font-mono">
            Format Feature & Specification Matrix
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-300 text-zinc-400 font-mono border-b border-border">
                <tr>
                  <th className="px-4 py-3">Specification Feature</th>
                  <th className="px-4 py-3 text-zinc-200">{fromMeta.shortName}</th>
                  <th className="px-4 py-3 text-brand-emerald">{toMeta.shortName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-surface-50/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">Category</td>
                  <td className="px-4 py-3 capitalize text-zinc-400">{fromMeta.category}</td>
                  <td className="px-4 py-3 capitalize text-zinc-300 font-medium">{toMeta.category}</td>
                </tr>
                <tr className="hover:bg-surface-50/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">File Extension</td>
                  <td className="px-4 py-3 font-mono text-zinc-400">.{fromMeta.extension}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300 font-medium">.{toMeta.extension}</td>
                </tr>
                <tr className="hover:bg-surface-50/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">MIME Type</td>
                  <td className="px-4 py-3 font-mono text-zinc-400">{fromMeta.mimeType}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300 font-medium">{toMeta.mimeType}</td>
                </tr>
                <tr className="hover:bg-surface-50/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">Primary Purpose</td>
                  <td className="px-4 py-3 text-zinc-400 leading-relaxed">{fromMeta.description}</td>
                  <td className="px-4 py-3 text-zinc-300 leading-relaxed font-medium">{toMeta.description}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-brand-indigo" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-100 border border-border space-y-2">
              <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                How does the {fromMeta.shortName} to {toMeta.shortName} converter work?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your input payload is parsed into an Abstract Syntax Tree (AST) inside a client-side Web Worker. The engine analyzes primitive types, nested objects, and optional fields to synthesize idiomatic {toMeta.name} code in sub-millisecond time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-100 border border-border space-y-2">
              <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                Is it safe for proprietary production code or passwords?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes. 100% of execution runs locally in your browser sandbox. No telemetry, database storage, or remote API endpoints receive your data.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-100 border border-border space-y-2">
              <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                How does URL sharing work without storing data?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you click "Share", your state is compressed using LZ-String algorithm and embedded into the URL hash fragment (#data=...). Browsers never send hash fragments to servers, keeping shares completely private.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-100 border border-border space-y-2">
              <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                Can I convert large payloads or files?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes! Because computations execute inside dedicated background Web Workers, the main UI thread stays at 60 FPS without freezing your browser tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
