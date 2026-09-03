'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Zap,
  ShieldCheck,
  Terminal,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Calculator,
  Lock,
} from 'lucide-react';

export interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onSelectCategory,
}: HeroSectionProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-10 pb-6 sm:pt-16 sm:pb-10 text-center flex flex-col items-center justify-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-emerald/15 via-brand-indigo/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Top Privacy Pill */}
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Lock className="w-3.5 h-3.5 text-brand-emerald" />
        <span>Zero Server Uploads • 100% In-Browser Client-Side Execution</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 max-w-4xl leading-[1.1] pb-2">
        Universal Developer Tools & <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald via-teal-300 to-sky-400">
          Daily Privacy Suite
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
        Effortlessly merge PDFs, compress images, format SQL, inspect DNS records, and convert code structures directly inside your browser. Sub-millisecond speed, total privacy, and completely free.
      </p>

      {/* Central Search Bar */}
      <div className="w-full max-w-2xl mt-6 px-2">
        <div className="relative flex items-center group">
          <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-brand-emerald transition-colors absolute left-4 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 100+ utilities (e.g. PDF Merge, Image Compressor, cURL to Code, JWT, JSON to TS)..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 focus:border-brand-emerald/70 focus:ring-2 focus:ring-brand-emerald/20 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all shadow-xl backdrop-blur-md font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono bg-zinc-800 text-zinc-400 rounded-md border border-zinc-700 absolute right-4 pointer-events-none">
            /
          </kbd>
        </div>

        {/* Quick-Jump Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs font-mono text-zinc-400">
          <span className="text-[11px] text-zinc-500 mr-1">Popular:</span>
          <Link
            href="/tools/pdf-merge/"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            📄 PDF Merge
          </Link>
          <Link
            href="/tools/image-compressor/"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            🖼️ Image Compress
          </Link>
          <Link
            href="/tools/json-to-typescript/"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            ⚡ JSON to TS
          </Link>
          <Link
            href="/tools/dns-lookup-inspector/"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            🌐 DNS Lookup
          </Link>
          <Link
            href="/tools/mock-data-generator/"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            🎲 Mock Data
          </Link>
        </div>
      </div>
    </section>
  );
}
