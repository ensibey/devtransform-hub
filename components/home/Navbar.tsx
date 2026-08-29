'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Search,
  Zap,
  Github,
  Sparkles,
  ShieldCheck,
  Star,
} from 'lucide-react';

export function Navbar() {
  const triggerCommandPalette = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2.5 text-zinc-100 font-semibold tracking-tight hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-emerald/20 via-zinc-900 to-brand-indigo/20 border border-brand-emerald/40 flex items-center justify-center shadow-lg shadow-brand-emerald/5 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-brand-emerald" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-white">
                Zero<span className="text-brand-emerald">Upload</span>
              </span>
              <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>100% Client-Side</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs font-medium text-zinc-400">
            <Link
              href="/#tools"
              className="hover:text-zinc-100 transition-colors"
            >
              All Tools
            </Link>
            <Link
              href="/json-to-typescript/"
              className="hover:text-zinc-100 transition-colors"
            >
              Converters
            </Link>
            <Link
              href="/formatters/sql/"
              className="hover:text-zinc-100 transition-colors"
            >
              Formatters
            </Link>
            <Link
              href="/tools/curl-to-code/"
              className="hover:text-zinc-100 transition-colors flex items-center space-x-1 text-sky-400 hover:text-sky-300"
            >
              <Sparkles className="w-3 h-3" />
              <span>cURL to Code</span>
            </Link>
          </nav>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center space-x-3">
          {/* Cmd+K Quick Search Trigger */}
          <button
            type="button"
            onClick={triggerCommandPalette}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-all shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-emerald transition-colors" />
            <span className="hidden sm:inline">Search 100+ utilities...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* GitHub Repo with Stars */}
          <a
            href="https://github.com/ensibey/devtransform-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-all"
            title="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline font-mono text-[11px]">Star</span>
            <span className="hidden md:flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>Free</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
