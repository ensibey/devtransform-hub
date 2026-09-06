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

import { ThemeToggle } from './ThemeToggle';

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-border bg-white/85 dark:bg-canvas/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <BrandLogo size={32} />
          </Link>

          {/* User-Friendly Categories Navigation */}
          <nav className="hidden lg:flex items-center space-x-2.5 text-xs font-medium text-slate-600 dark:text-zinc-400">
            <Link
              href="/timezone/directory/"
              className="px-2 py-1 rounded-md text-emerald-600 dark:text-brand-emerald hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              🌍 Timezones
            </Link>
            <Link
              href="/percentage/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              % Percentages
            </Link>
            <Link
              href="/convert/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              ⚖️ Units
            </Link>
            <Link
              href="/port/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              🔌 Ports
            </Link>
            <Link
              href="/mime/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              📄 MIME
            </Link>
            <Link
              href="/chmod/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              🔒 Chmod
            </Link>
            <Link
              href="/html-entity/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              &amp; Entities
            </Link>
            <Link
              href="/dns/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              🌐 DNS
            </Link>
            <Link
              href="/curl-to/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              ⚡ cURL
            </Link>
            <Link
              href="/git/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              🌿 Git
            </Link>
            <Link
              href="/docker/directory/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors"
            >
              🐳 Docker
            </Link>
            <Link
              href="/category/dev/"
              className="px-2 py-1 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-surface-100 transition-colors flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Converters</span>
            </Link>
          </nav>
        </div>

        {/* Right: Search Bar, Theme Toggle & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={triggerCommandPalette}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-surface-100 hover:bg-slate-200 dark:hover:bg-surface-50 border border-slate-200 dark:border-border text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition-all shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden sm:inline">Search 140+ Tools...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-surface text-slate-500 dark:text-zinc-400 rounded border border-slate-200 dark:border-border">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          <a
            href="https://github.com/ensibey/devtransform-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 rounded-lg bg-slate-100 dark:bg-surface-100 hover:bg-slate-200 dark:hover:bg-surface-50 border border-slate-200 dark:border-border transition-colors"
            title="Open Source GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
