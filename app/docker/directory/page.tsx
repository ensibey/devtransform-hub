'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllDockerRecipes } from '@/lib/docker-recipes-data';
import {
  Box,
  Search,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function DockerDirectoryPage() {
  const allRecipes = useMemo(() => getAllDockerRecipes(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(allRecipes.map((r) => r.category));
    return ['ALL', ...Array.from(set)];
  }, [allRecipes]);

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((r) => {
      const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search) ||
        r.shortTitle.toLowerCase().includes(search) ||
        r.summary.toLowerCase().includes(search) ||
        r.quickCommand.toLowerCase().includes(search) ||
        r.category.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [allRecipes, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">Docker Command Recipes</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Docker Command Recipes &amp; Dockerfile Solutions
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Essential CLI recipes for everyday container management. Exec into containers with Bash, prune disk space, mount volumes, stream logs, write multi-stage builds, and master ENTRYPOINT vs CMD.
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
            placeholder="Search Docker commands (e.g. exec bash, prune disk, entrypoint, copy files, volumes, logs)..."
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

      {/* Grid of Docker Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.slug}
            className="p-5 rounded-2xl bg-surface-100 border border-border hover:border-brand-emerald/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-brand-emerald uppercase">
                  {recipe.category}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  recipe.riskLevel === 'Safe'
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                    : recipe.riskLevel === 'Reversible'
                    ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                    : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                }`}>
                  {recipe.riskLevel}
                </span>
              </div>

              <Link href={`/docker/${recipe.slug}/`} className="block">
                <h2 className="text-base font-bold text-white group-hover:text-brand-emerald transition-colors">
                  {recipe.title}
                </h2>
              </Link>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {recipe.summary}
              </p>
            </div>

            {/* Quick Command Box */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-black/70 border border-border flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-emerald-400 truncate">
                  {recipe.quickCommand}
                </code>
                <CopyButton text={recipe.quickCommand} />
              </div>

              <Link
                href={`/docker/${recipe.slug}/`}
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-brand-emerald hover:underline pt-1"
              >
                <span>Full step-by-step tutorial &amp; options</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-surface-100 border border-border text-zinc-400 space-y-2">
          <Box className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm">No Docker recipes found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
