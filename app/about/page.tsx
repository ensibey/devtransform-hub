import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Lock, Cpu, Globe, ArrowRight, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About DevTransform - 100% Client-Side Privacy-First Developer Hub',
  description:
    'Learn how DevTransform provides ultra-fast, zero-server developer utilities with complete client-side data privacy, WebAssembly processing, and zero ads.',
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/about/',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Our Mission & Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Developer Tools Built for Speed and Complete Privacy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          DevTransform was born out of frustration with slow, ad-cluttered online utilities that upload sensitive developer code, tokens, and payloads to unknown remote servers.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            100% Client-Side Privacy
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Every single tool runs strictly inside your local browser runtime. Your JSON, SQL queries, JWT tokens, certificates, and images never leave your machine and are never logged on any server.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Zero Latency & Sub-Millisecond Speed
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            By compiling formatters, parsers, and transformers with WebAssembly and optimized JavaScript engines, conversions happen in real-time as you type, even with multi-megabyte datasets.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Offline PWA Capability
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            DevTransform is a Progressive Web App (PWA). You can install it on macOS, Windows, Linux, or mobile and run critical conversion utilities on airplanes or in secure offline air-gapped environments.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Completely Free & Zero Paywalls
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            No sign-up prompts, no credit cards, no rate-limiting, and no disruptive banner advertisements. We believe basic developer infrastructure should be open, frictionless, and accessible to everyone.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-100/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 mb-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Engineered With Modern Standards
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono text-slate-600 dark:text-zinc-400">
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-slate-800 dark:text-zinc-200 block mb-1">Next.js 14 App Router</span>
            Static pre-rendering for 7,500+ optimized programmatic routes.
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-slate-800 dark:text-zinc-200 block mb-1">CodeMirror 6</span>
            Modern, accessible code editor with syntax highlighting and folding.
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-slate-800 dark:text-zinc-200 block mb-1">Web Workers & Wasm</span>
            Intense computation offloaded to background worker threads.
          </div>
        </div>
      </div>

      <div className="text-center space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <p className="text-sm text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
          Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" /> for engineers, data analysts, and designers worldwide.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors shadow"
          >
            Explore 140+ Developer Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-sm font-semibold transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}