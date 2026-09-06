'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllCurlTargets } from '@/lib/curl-targets-data';
import {
  Terminal,
  Search,
  ExternalLink,
  ChevronRight,
  Code2,
  ArrowRight,
} from 'lucide-react';

export default function CurlDirectoryPage() {
  const allTargets = useMemo(() => getAllCurlTargets(), []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTargets = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return allTargets;
    return allTargets.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.language.toLowerCase().includes(search) ||
        t.library.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );
  }, [allTargets, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">cURL Code Converters Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Convert cURL to Any Programming Language
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Instant client-side converters turning cURL terminal commands into idiomatic Python, JavaScript Fetch, Node.js Axios, Go, Rust, PHP Guzzle, C#, Java, Dart, and PowerShell code.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-100 border border-border rounded-xl p-4 sm:p-5">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search language or library (e.g. Python requests, JavaScript fetch, Axios, Go, Rust, C#, PHP)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-border focus:border-brand-emerald rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-emerald transition-all"
          />
        </div>
      </div>

      {/* Target Languages Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>Available Language Targets ({filteredTargets.length})</span>
          <span>100% Client-Side &bull; Zero Server Uploads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTargets.map((t) => (
            <Link
              key={t.slug}
              href={`/curl-to/${t.slug}/`}
              className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-brand-emerald" />
                    <h3 className="text-base font-bold text-white group-hover:text-brand-emerald transition-colors">
                      {t.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 text-zinc-400 border border-border">
                    {t.library}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-brand-emerald group-hover:text-emerald-300">
                <span>Convert to {t.language}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
