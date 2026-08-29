'use client';

import React, { useRef, useEffect } from 'react';
import { Search, Zap, ShieldCheck, Database, DollarSign, Terminal, Sparkles } from 'lucide-react';

export interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
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
    <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center flex flex-col items-center justify-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-emerald/10 via-brand-indigo/5 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Top Privacy Pill */}
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
        <span>Privacy-First Zero-Server Architecture</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500 max-w-4xl leading-[1.1] pb-2">
        Developer Utilities <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald via-teal-300 to-sky-400">
          Without The Cloud
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
        Zero server uploads. Zero telemetry. 100% in-browser execution via WebAssembly and Web Workers. Fast, private, and always free.
      </p>

      {/* Central Search Bar */}
      <div className="w-full max-w-2xl mt-8 px-2">
        <div className="relative flex items-center group">
          <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-brand-emerald transition-colors absolute left-4 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 100+ tools (e.g. cURL to Python, JSON to Go, JWT Decoder, PDF Merge)..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-brand-emerald/70 focus:ring-2 focus:ring-brand-emerald/20 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all shadow-xl backdrop-blur-md font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono bg-zinc-800 text-zinc-400 rounded-md border border-zinc-700 absolute right-4 pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Telemetry / Trust Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-10 w-full max-w-4xl font-mono text-[11px] sm:text-xs text-zinc-400">
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center space-x-2">
          <Zap className="w-4 h-4 text-brand-emerald flex-shrink-0" />
          <span>0ms Server Latency</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>100% Client Sandbox</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center space-x-2">
          <Terminal className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>100+ Static Tools</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center space-x-2">
          <DollarSign className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>$0 Cost Forever</span>
        </div>
      </div>
    </section>
  );
}
