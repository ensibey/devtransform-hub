'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllChmods } from '@/lib/chmod-data';
import {
  FolderLock,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function ChmodDirectoryPage() {
  const allChmods = useMemo(() => getAllChmods(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');

  const ratings = ['ALL', 'Safe', 'Standard', 'Elevated', 'Dangerous'];

  const filteredChmods = useMemo(() => {
    return allChmods.filter((c) => {
      const matchesRating = selectedRating === 'ALL' || c.securityRating === selectedRating;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        c.octal.includes(search) ||
        c.symbolic.toLowerCase().includes(search) ||
        c.summary.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search);
      return matchesRating && matchesSearch;
    });
  }, [allChmods, selectedRating, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">chmod Permissions Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Linux chmod Permissions & Security Matrix
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Reference table for Linux & Unix file permissions. Understand octal (755, 644, 600, 777) vs symbolic (rwxr-xr-x) notation, learn what is safe for web servers, and copy quick commands.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-100 border border-border rounded-xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search octal (755, 644, 777) or symbolic (rwxr-xr-x)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-border focus:border-brand-emerald rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-emerald transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedRating === rating
                  ? 'bg-brand-emerald text-black font-bold shadow-sm'
                  : 'bg-surface-200 text-zinc-400 hover:text-zinc-200 border border-border'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>Showing {filteredChmods.length} of {allChmods.length} Permissions</span>
          <span>Click any permission for recursive commands and deep security breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredChmods.map((item) => {
            const isDangerous = item.securityRating === 'Dangerous';
            const badgeColor =
              item.securityRating === 'Dangerous'
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : item.securityRating === 'Elevated'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : item.securityRating === 'Safe'
                ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

            return (
              <div
                key={item.slug}
                className="bg-surface-100 border border-border hover:border-brand-emerald/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/chmod/${item.slug}/`}
                      className="text-xl font-bold font-mono text-brand-emerald group-hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                    >
                      <span>chmod {item.octal}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
                      {item.securityRating}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-zinc-300 bg-black/40 px-2 py-1 rounded inline-block">
                    {item.symbolic}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Command:</span>
                    <CopyButton text={item.commands.singleFile} />
                  </div>
                  <div className="bg-black/50 px-2.5 py-1.5 rounded font-mono text-[10px] text-emerald-400/90 truncate border border-border/40">
                    {item.commands.singleFile}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
