import React from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Terminal,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export function DailyEssentials() {
  return (
    <section className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Most Popular Daily Utilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daily Essentials & Featured Hubs
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Client-side utilities that execute locally in your browser with zero server roundtrips.
          </p>
        </div>

        <Link
          href="#tools"
          className="inline-flex items-center space-x-1 text-xs font-mono text-brand-emerald hover:underline font-semibold"
        >
          <span>Explore All 56+ Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Large Feature Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. PDF Toolkit */}
        <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-rose-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold">
                PDF Hub
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-rose-200 transition-colors">
                PDF Document Studio
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Merge, split, rotate, and convert photos to PDF. Handled locally via WebAssembly with zero data tracking.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-zinc-800/80 font-mono text-xs">
              <Link
                href="/tools/pdf-merge/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Merge Multiple PDFs</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/pdf-split/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Split PDF Pages</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/image-to-pdf/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Image to High-Res PDF</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/pdf/"
              className="w-full py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 text-xs font-mono text-center text-zinc-300 hover:text-white block transition-colors"
            >
              Open PDF Toolkit →
            </Link>
          </div>
        </div>

        {/* 2. Image & Media Suite */}
        <div className="rounded-2xl border border-sky-900/40 bg-gradient-to-b from-sky-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-sky-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/30 font-semibold">
                Image Suite
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-sky-200 transition-colors">
                Image & Media Studio
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Compress WebP/JPG/PNG images up to 80%, generate custom QR codes, and extract color palettes in Canvas.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-zinc-800/80 font-mono text-xs">
              <Link
                href="/tools/image-compressor/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Lossless Image Compressor</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/qr-code-generator/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Custom Vector QR Code</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/color-palette-extractor/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Palette & Hex Extractor</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/image/"
              className="w-full py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-sky-500/40 text-xs font-mono text-center text-zinc-300 hover:text-white block transition-colors"
            >
              Open Image Suite →
            </Link>
          </div>
        </div>

        {/* 3. Developer & Code Lab */}
        <div className="rounded-2xl border border-brand-emerald/30 bg-gradient-to-b from-brand-emerald/10 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-brand-emerald/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-brand-emerald group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                Dev Lab
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-emerald-200 transition-colors">
                Developer & API Lab
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Parse cURL commands into fetch code, generate mock JSON data, inspect DNS DoH records, and test regex.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-zinc-800/80 font-mono text-xs">
              <Link
                href="/tools/json-to-typescript/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• JSON to TypeScript Interface</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/dns-lookup-inspector/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• DNS over HTTPS Resolver</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/mock-data-generator/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Mock Data & SQL Generator</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/dev/"
              className="w-full py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-emerald/40 text-xs font-mono text-center text-zinc-300 hover:text-white block transition-colors"
            >
              Open Dev Lab →
            </Link>
          </div>
        </div>

        {/* 4. Text & Content Studio */}
        <div className="rounded-2xl border border-violet-900/40 bg-gradient-to-b from-violet-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-violet-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/30 font-semibold">
                Text Studio
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-violet-200 transition-colors">
                Text & Content Studio
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Word & character counter, case converters, visual text diff viewer, and Markdown to HTML processors.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-zinc-800/80 font-mono text-xs">
              <Link
                href="/tools/word-counter/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Live Word & Reading Time</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/text-diff/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Git-Style Text Diff Viewer</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/markdown-to-html-converter/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              >
                <span>• Markdown to HTML & MD</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/text/"
              className="w-full py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500/40 text-xs font-mono text-center text-zinc-300 hover:text-white block transition-colors"
            >
              Open Text Studio →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
