import React from 'react';
import { ShieldCheck, Cpu, ArrowRight, Lock, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export function PrivacyBlueprint() {
  return (
    <section className="mt-16 sm:mt-24 border-t border-zinc-800/80 pt-12 text-zinc-300">
      <div className="space-y-10">
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Privacy Model</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How ZeroUpload Protects Your Code
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Traditional online formatters send your sensitive payload to remote servers. ZeroUpload operates exclusively in your browser sandbox.
          </p>
        </div>

        {/* 3-Step Visual Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1: Input */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 relative flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-brand-emerald">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-brand-emerald uppercase tracking-wider font-semibold">
                  Phase 01
                </span>
                <h3 className="text-base font-bold text-white">Your Input (Local RAM)</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you paste JWT tokens, JSON payloads, or private schemas, they are placed directly into your local browser memory buffer.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Never hits network layer</span>
            </div>
          </div>

          {/* Step 2: Engine */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 relative flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-brand-indigo">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                  Phase 02
                </span>
                <h3 className="text-base font-bold text-white">Web Worker Sandbox</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Transformations and QuickType AST inferences run in dedicated background Web Workers, leaving the main UI thread at a crisp 60 FPS.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-indigo-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Client-Side Wasm / JS</span>
            </div>
          </div>

          {/* Step 3: Output */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 relative flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-sky-400">
                <EyeOff className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-semibold">
                  Phase 03
                </span>
                <h3 className="text-base font-bold text-white">Your Output (0 Bytes Sent)</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Exported code is synthesized instantaneously. Shares compress state into URL hash fragments (#data=...) without touching a database.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-sky-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 Server logs or analytics</span>
            </div>
          </div>
        </div>

        {/* Comparison Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs">
          <div className="space-y-2 p-3 rounded-xl bg-rose-950/20 border border-rose-900/30">
            <div className="font-bold text-rose-300 flex items-center space-x-1.5 font-mono">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Traditional Web Converters</span>
            </div>
            <ul className="space-y-1 text-zinc-400 text-[11px]">
              <li>❌ Uploads your files to remote cloud API servers</li>
              <li>❌ Stores sensitive database passwords & schemas in logs</li>
              <li>❌ Freezes browser tab on large 10MB+ payloads</li>
            </ul>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
            <div className="font-bold text-emerald-300 flex items-center space-x-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ZeroUpload Architecture</span>
            </div>
            <ul className="space-y-1 text-zinc-300 text-[11px]">
              <li>✓ 0 Bytes transmitted over the network (check DevTools)</li>
              <li>✓ Safe for proprietary enterprise production code</li>
              <li>✓ Instant sub-millisecond AST compilation via Web Workers</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
