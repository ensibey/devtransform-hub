'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GitignoreTemplate } from '@/lib/gitignore-data';
import {
  Search,
  FileCode,
  ArrowRight,
  Copy,
  Check,
  GitBranch
} from 'lucide-react';

interface GitignoreDirectoryClientProps {
  templates: GitignoreTemplate[];
}

export function GitignoreDirectoryClient({ templates }: GitignoreDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const categories = [
    'all',
    'Languages & Frameworks',
    'Operating Systems',
    'IDEs & Editors',
    'DevOps & Cloud',
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || t.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const copyToClipboard = (e: React.MouseEvent, text: string, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="space-y-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search .gitignore templates (Node, Python, Next.js, Go, Rust, Java, macOS, Terraform, Docker)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Templates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400 text-sm">
            No .gitignore templates found matching &quot;{searchQuery}&quot;. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((t) => (
            <Link
              key={t.slug}
              href={`/gitignore/${t.slug}/`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    {t.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {t.content.split('\n').length} lines
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {t.summary}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={(e) => copyToClipboard(e, t.content, t.slug)}
                  className="hover:text-white transition flex items-center gap-1 text-slate-400 hover:bg-slate-800 px-2 py-1 rounded"
                >
                  {copiedKey === t.slug ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Rules</span>
                    </>
                  )}
                </button>
                <span className="text-emerald-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
