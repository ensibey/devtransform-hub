'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllPorts } from '@/lib/ports-data';
import {
  Server,
  Search,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function PortsDirectoryPage() {
  const allPorts = useMemo(() => getAllPorts(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(allPorts.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [allPorts]);

  const filteredPorts = useMemo(() => {
    return allPorts.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        p.port.toString().includes(search) ||
        p.service.toLowerCase().includes(search) ||
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [allPorts, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">Developer Ports Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Developer Ports & Network Services Directory
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Instant reference for common developer ports, databases, web servers, and protocols. Find who is listening, copy quick kill commands for macOS, Linux, and Windows, and inspect security advisories.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-surface-100 border border-border rounded-xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search port number (e.g. 3000, 5432, 8080) or service (Postgres, Redis, Docker)..."
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

      {/* Ports List Table / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>Showing {filteredPorts.length} of {allPorts.length} Ports</span>
          <span>Click any port for deep troubleshooting & kill guides</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPorts.map((item) => {
            const isHighRisk = item.riskLevel === 'Critical' || item.riskLevel === 'High';
            return (
              <div
                key={item.slug}
                className="bg-surface-100 border border-border hover:border-brand-emerald/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/port/${item.slug}/`}
                      className="text-lg font-bold font-mono text-brand-emerald group-hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                    >
                      <span>Port {item.port}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 text-zinc-400 border border-border">
                      {item.protocol}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 truncate">{item.service}</h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Quick Kill (Mac/Linux):</span>
                    <CopyButton text={item.killCommandLinux} />
                  </div>
                  <div className="bg-black/50 px-2.5 py-1.5 rounded font-mono text-[10px] text-amber-400/90 truncate border border-border/40">
                    {item.killCommandLinux}
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
