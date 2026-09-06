'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { OpenSslRecipe } from '@/lib/openssl-recipes-data';
import {
  Search,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

interface OpenSslDirectoryClientProps {
  recipes: OpenSslRecipe[];
}

export function OpenSslDirectoryClient({ recipes }: OpenSslDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const categories = [
    'all',
    'Generation & Keys',
    'Verification & Inspection',
    'Format Conversions',
    'Testing & Handshake',
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || r.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

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
            placeholder="Search OpenSSL commands (self-signed, check expiration, modulus check, pfx to pem, csr, rsa key)..."
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
              {cat === 'all' ? 'All Recipes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400 text-sm">
            No OpenSSL recipes found matching &quot;{searchQuery}&quot;. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((r) => (
            <Link
              key={r.slug}
              href={`/openssl/${r.slug}/`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    {r.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {r.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {r.summary}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <code className="text-xs font-mono text-emerald-300 truncate pr-2">
                    {r.command}
                  </code>
                  <button
                    onClick={(e) => copyToClipboard(e, r.command, r.slug)}
                    className="text-slate-400 hover:text-white transition p-1 rounded hover:bg-slate-800 shrink-0"
                    title="Copy command"
                  >
                    {copiedKey === r.slug ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{r.steps.length} verification steps</span>
                <span className="text-emerald-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>View Recipe</span>
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
