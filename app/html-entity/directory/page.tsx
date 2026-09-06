'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllHtmlEntities } from '@/lib/html-entities-data';
import {
  Code2,
  Search,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function HtmlEntityDirectoryPage() {
  const allEntities = useMemo(() => getAllHtmlEntities(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(allEntities.map((e) => e.category));
    return ['ALL', ...Array.from(set)];
  }, [allEntities]);

  const filteredEntities = useMemo(() => {
    return allEntities.filter((e) => {
      const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        e.char.toLowerCase().includes(search) ||
        e.name.toLowerCase().includes(search) ||
        e.namedEntity.toLowerCase().includes(search) ||
        e.decimalCode.includes(search) ||
        e.hexCode.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [allEntities, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">HTML Entities Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            HTML Entities & Special Character Directory
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Instant search and 1-click copy for HTML named entities (&amp;copy;, &amp;nbsp;, &amp;trade;), decimal, hex, CSS content escapes, and JavaScript unicode characters.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-100 border border-border rounded-xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by character (©, $, →, &), entity (&copy;, &nbsp;), or name (copyright, arrow, ampersand)..."
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

      {/* Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>Showing {filteredEntities.length} of {allEntities.length} HTML Entities</span>
          <span>Click symbol to inspect CSS & JS escapes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredEntities.map((item) => (
            <div
              key={item.slug}
              className="bg-surface-100 border border-border hover:border-brand-emerald/40 rounded-xl p-3 flex flex-col justify-between space-y-2.5 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-surface-200 border border-border flex items-center justify-center font-bold text-brand-emerald group-hover:text-emerald-300 text-xl flex-shrink-0 shadow-inner">
                  {item.char === ' ' ? '␣' : item.char}
                </div>
                <CopyButton text={item.namedEntity} />
              </div>

              <div className="space-y-0.5">
                <Link
                  href={`/html-entity/${item.slug}/`}
                  className="text-xs font-bold text-zinc-200 group-hover:text-white truncate block transition-colors"
                >
                  {item.name}
                </Link>
                <span className="text-[11px] font-mono text-brand-emerald font-semibold block truncate">
                  {item.namedEntity}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block truncate">
                  {item.hexCode} &bull; {item.decimalCode}
                </span>
              </div>

              <Link
                href={`/html-entity/${item.slug}/`}
                className="text-[10px] font-mono text-zinc-400 hover:text-brand-emerald flex items-center justify-between pt-1 border-t border-border/40 transition-colors"
              >
                <span>Details & CSS</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
