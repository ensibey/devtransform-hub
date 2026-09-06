'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllHttpHeaders } from '@/lib/http-headers-data';
import {
  ShieldCheck,
  Search,
  Server,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function HttpHeadersDirectoryPage() {
  const allHeaders = useMemo(() => getAllHttpHeaders(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(allHeaders.map((h) => h.category));
    return ['ALL', ...Array.from(set)];
  }, [allHeaders]);

  const filteredHeaders = useMemo(() => {
    return allHeaders.filter((h) => {
      const matchesCategory = selectedCategory === 'ALL' || h.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        h.name.toLowerCase().includes(search) ||
        h.slug.toLowerCase().includes(search) ||
        h.summary.toLowerCase().includes(search) ||
        h.recommendedValue.toLowerCase().includes(search) ||
        h.category.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [allHeaders, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">HTTP Headers Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            HTTP Headers &amp; Security Directives Directory
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Essential HTTP response and request headers explained. Master Content-Security-Policy, HSTS, Cache-Control, CORS, and cookie security with ready-to-copy server configs for NGINX, Apache, Next.js, and Express.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search headers (e.g. CSP, HSTS, Cache-Control, CORS, cookies, X-Frame-Options)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-100 border border-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-emerald"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-surface-100 text-zinc-400 hover:text-white border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHeaders.map((header) => (
          <div
            key={header.slug}
            className="p-5 rounded-2xl bg-surface-100 border border-border hover:border-brand-emerald/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-brand-emerald uppercase">
                  {header.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-emerald-950/40 text-emerald-400 border-emerald-500/30">
                  {header.owaspRating}
                </span>
              </div>

              <Link href={`/http-header/${header.slug}/`} className="block">
                <h2 className="text-base font-bold text-white group-hover:text-brand-emerald transition-colors">
                  {header.name}
                </h2>
              </Link>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {header.summary}
              </p>
            </div>

            {/* Recommended Value Snippet */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-black/70 border border-border flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-emerald-400 truncate">
                  {header.recommendedValue}
                </code>
                <CopyButton text={header.recommendedValue} />
              </div>

              <Link
                href={`/http-header/${header.slug}/`}
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-brand-emerald hover:underline pt-1"
              >
                <span>NGINX, Apache, Next.js configs &amp; directives</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredHeaders.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-surface-100 border border-border text-zinc-400 space-y-2">
          <Server className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm">No HTTP headers found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
