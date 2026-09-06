'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllMimes } from '@/lib/mime-data';
import {
  FileCode,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function MimeDirectoryPage() {
  const allMimes = useMemo(() => getAllMimes(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(allMimes.map((m) => m.category));
    return ['ALL', ...Array.from(set)];
  }, [allMimes]);

  const filteredMimes = useMemo(() => {
    return allMimes.filter((m) => {
      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        m.mime.toLowerCase().includes(search) ||
        m.name.toLowerCase().includes(search) ||
        m.extensions.some((ext) => ext.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [allMimes, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">MIME Types Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            MIME Types & Content-Type Header Directory
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Search common web MIME types, file extensions, Content-Type HTTP response headers, NGINX / Apache configs, and web security advisories.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-surface-100 border border-border rounded-xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by MIME string (e.g. application/json, image/webp) or file extension (.pdf, .svg, .wasm)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-border focus:border-brand-emerald rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-emerald transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-emerald text-black font-bold shadow-sm'
                  : 'bg-surface-200 text-zinc-400 hover:text-zinc-200 border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List / Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>Showing {filteredMimes.length} of {allMimes.length} MIME Types</span>
          <span>Click any MIME type for server configs & code snippets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMimes.map((item) => (
            <div
              key={item.slug}
              className="bg-surface-100 border border-border hover:border-brand-emerald/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/mime/${item.slug}/`}
                    className="text-base font-bold font-mono text-brand-emerald group-hover:text-emerald-300 transition-colors flex items-center gap-1.5 truncate max-w-[200px]"
                  >
                    <span className="truncate">{item.mime}</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 text-zinc-400 border border-border flex-shrink-0">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-200 truncate">{item.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-mono text-zinc-400">
                    <span>Extensions:</span>
                    <span className="text-zinc-300">
                      {item.extensions.length > 0 ? item.extensions.join(', ') : 'None'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Header:</span>
                  <CopyButton text={item.httpHeader} />
                </div>
                <div className="bg-black/50 px-2.5 py-1.5 rounded font-mono text-[10px] text-emerald-400/90 truncate border border-border/40">
                  {item.httpHeader}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
