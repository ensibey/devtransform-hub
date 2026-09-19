'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { RegexDefinition } from '@/lib/regex-matrix';
import {
  Search,
  Code2,
  Check,
  Copy,
  ArrowRight,
  Shield,
  Globe,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface RegexDirectoryClientProps {
  patterns: RegexDefinition[];
}

export function RegexDirectoryClient({ patterns }: RegexDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Patterns' },
    { id: 'validation', label: 'Validation' },
    { id: 'web', label: 'Web & URLs' },
    { id: 'security', label: 'Security & Auth' },
    { id: 'formatting', label: 'Formatting' },
  ];

  const filteredPatterns = useMemo(() => {
    return patterns.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [patterns, searchQuery, selectedCategory]);

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
            placeholder="Search regex patterns (email, password, url, ipv4, credit card, phone, uuid, slug)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredPatterns.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400 text-sm">
            No regular expression patterns found matching &quot;{searchQuery}&quot;. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatterns.map((p) => (
            <Link
              key={p.slug}
              href={`/regex/${p.slug}/`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30">
                    {p.category.toUpperCase()}
                  </span>
                  {p.flags && (
                    <span className="text-[11px] font-mono text-slate-500">
                      flags: /{p.flags}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <code className="text-xs font-mono text-indigo-300 truncate pr-2">
                    /{p.pattern}/{p.flags}
                  </code>
                  <button
                    onClick={(e) => copyToClipboard(e, p.pattern, p.slug)}
                    className="text-slate-400 hover:text-white transition p-1 rounded hover:bg-slate-800 shrink-0 text-xs flex items-center gap-1"
                    title="Copy regex pattern"
                  >
                    {copiedKey === p.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate max-w-[200px]">Match: <span className="text-emerald-400 font-mono">{p.sampleMatch}</span></span>
                <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
