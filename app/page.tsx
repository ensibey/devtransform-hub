'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Code2,
  Sparkles,
  ArrowRight,
  Search,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Calculator,
  History,
  Star,
  Flame,
} from 'lucide-react';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_REGISTRY, getPopularTools, getToolBySlug } from '@/lib/registry';
import { CATEGORIES, ToolCategory } from '@/types/tool';
import { getRecentToolSlugs } from '@/lib/storage';
import { ConverterWorkspace } from '@/components/editor/ConverterWorkspace';
import { PrivacyBadge, PrivacyFeaturesGrid } from '@/components/ui/PrivacyBadge';
import { EthicalAdUnit } from '@/components/ads/EthicalAdUnit';

export default function HomePage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(getRecentToolSlugs());
  }, []);

  const pairs = useMemo(() => getAllMatrixPairs(), []);
  const popularTools = useMemo(() => getPopularTools(), []);

  // Filtered tools across standalone registry & matrix
  const filteredTools = useMemo(() => {
    if (!filterQuery.trim()) return TOOLS_REGISTRY;
    const q = filterQuery.toLowerCase();
    return TOOLS_REGISTRY.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [filterQuery]);

  const recentTools = useMemo(() => {
    return recentSlugs
      .map((slug) => getToolBySlug(slug))
      .filter(Boolean) as typeof TOOLS_REGISTRY;
  }, [recentSlugs]);

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-8">
        <div className="flex justify-center">
          <PrivacyBadge />
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          All-in-One Client-Side <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-emerald via-teal-300 to-brand-indigo bg-clip-text text-transparent">
            Super Utility Platform
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          100% private in-browser utilities. PDF manipulation, image compression, text tools, daily calculators, and 90+ code converters with zero server cost and zero data transmission.
        </p>

        {/* Global Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search 120+ tools (e.g. PDF Merge, Image Compressor, Word Counter, JSON to Go)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-100 border border-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-xl transition-all"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-emerald" />
            <span>⚡ Sub-millisecond Execution</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-brand-indigo" />
            <span>120+ Offline Utilities</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
            <span>0 B Network Uploads</span>
          </div>
        </div>
      </div>

      {/* Recently Used Tools Bar (if any) */}
      {recentTools.length > 0 && !filterQuery && (
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-zinc-400">
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Recently Visited Tools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentTools.map((rTool) => (
              <Link
                key={rTool.slug}
                href={`/tools/${rTool.slug}/`}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-xs text-zinc-200 hover:text-white transition-all shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-brand-emerald" />
                <span className="font-medium">{rTool.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5 Core Pillars Category Cards */}
      {!filterQuery && (
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
            Explore 5 Utility Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.values(CATEGORIES).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}/`}
                className="group p-4 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-border hover:border-zinc-500 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-200 border border-border flex items-center justify-center text-brand-emerald group-hover:scale-105 transition-transform">
                    {cat.id === 'text' && <FileText className="w-5 h-5" />}
                    {cat.id === 'image' && <ImageIcon className="w-5 h-5" />}
                    {cat.id === 'pdf' && <FileSpreadsheet className="w-5 h-5" />}
                    {cat.id === 'calculator' && <Calculator className="w-5 h-5" />}
                    {cat.id === 'dev' && <Code2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-mono text-brand-emerald flex items-center justify-between">
                  <span>Browse Category</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular / Search Filtered Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              {filterQuery ? `Search Results (${filteredTools.length})` : 'Popular & Featured Utilities'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(filterQuery ? filteredTools : popularTools).map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}/`}
              className="group p-4 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-border hover:border-zinc-500 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-surface-200 border border-border flex items-center justify-center text-brand-emerald group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-200 text-zinc-400 border border-border">
                    {tool.category}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white pt-1">
                  {tool.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-brand-emerald">
                <span>⚡ 100% Client-Side</span>
                <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Interactive Code Converter Hero Workspace */}
      <section className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Live AST Type Converter Workspace
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Powered by QuickType & CodeMirror 6
          </span>
        </div>
        <ConverterWorkspace
          initialFrom="json"
          initialTo="typescript"
        />
      </section>

      <EthicalAdUnit />

      {/* All 90+ Static Matrix Pairs */}
      <section className="space-y-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              90+ Static Code Converter Matrix Routes
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Programmatic SEO routes for every conversion pair between JSON, YAML, CSV, XML, TOML, TypeScript, Go, Rust, Python, and SQL.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 bg-surface-100 px-3 py-1 rounded-lg border border-border">
            90 Static Routes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {pairs.slice(0, 24).map((pair) => (
            <Link
              key={pair.slug}
              href={`/${pair.slug}/`}
              className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border hover:border-zinc-500 transition-all text-xs flex items-center justify-between group"
            >
              <span className="text-zinc-300 font-medium group-hover:text-white">
                {pair.fromMeta.shortName} → {pair.toMeta.shortName}
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-brand-emerald transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy Architecture Grid */}
      <PrivacyFeaturesGrid />
    </div>
  );
}
