'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Search,
  Zap,
  Github,
  Sparkles,
  Command as CommandIcon,
} from 'lucide-react';
import { PrivacyBadge } from './PrivacyBadge';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const triggerCommandPalette = () => {
    // Dispatch Cmd+K event
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <BrandLogo size={32} />
          </Link>

          {/* Quick Categories Navigation */}
          <nav className="hidden md:flex items-center space-x-4 text-xs text-zinc-400">
            <Link
              href="/json-to-typescript/"
              className="hover:text-zinc-200 transition-colors"
            >
              JSON to TS
            </Link>
            <Link
              href="/json-to-go/"
              className="hover:text-zinc-200 transition-colors"
            >
              JSON to Go
            </Link>
            <Link
              href="/json-to-rust/"
              className="hover:text-zinc-200 transition-colors"
            >
              JSON to Rust
            </Link>
            <Link
              href="/yaml-to-json/"
              className="hover:text-zinc-200 transition-colors"
            >
              YAML to JSON
            </Link>
            <Link
              href="/formatters/sql/"
              className="hover:text-zinc-200 transition-colors flex items-center space-x-1 text-amber-400/90 hover:text-amber-300"
            >
              <Sparkles className="w-3 h-3" />
              <span>SQL Formatter</span>
            </Link>
          </nav>
        </div>

        {/* Right: Search Bar & Actions */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={triggerCommandPalette}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-xs text-zinc-400 hover:text-zinc-200 transition-all shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-emerald transition-colors" />
            <span className="hidden sm:inline">Search 90+ Converters...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-surface text-zinc-400 rounded border border-border">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-surface-100 transition-colors"
            title="Open Source GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
