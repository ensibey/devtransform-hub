'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DEVELOPER_TOOLS,
  CATEGORY_FILTERS,
  DeveloperToolItem,
  ToolCategoryKey,
} from '@/lib/tools-data';
import {
  Sparkles,
  ArrowRight,
  ArrowRightLeft,
  ShieldCheck,
  Terminal,
  Code2,
  Calculator,
  SearchX,
  Zap,
  Layers,
  Key,
  Binary,
  Fingerprint,
  FileCode,
  FileText,
  Table,
  Database,
  FileEdit,
  QrCode,
  Wand2,
  CheckCircle2,
  GitCompare,
  Type,
  Image as ImageIcon,
  FileSpreadsheet,
  Percent,
  Maximize2,
  RotateCw,
} from 'lucide-react';

export interface ToolGridProps {
  searchQuery: string;
  onClearSearch: () => void;
}

// Icon dictionary helper
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces: Code2,
  Code2: Code2,
  Layers: Layers,
  FileCode: FileCode,
  Table: Table,
  FileText: FileText,
  Database: Database,
  Terminal: Terminal,
  FileEdit: FileEdit,
  QrCode: QrCode,
  Wand2: Wand2,
  Key: Key,
  Binary: Binary,
  Fingerprint: Fingerprint,
  CheckCircle2: CheckCircle2,
  Sparkles: Sparkles,
  GitCompare: GitCompare,
  Type: Type,
  Image: ImageIcon,
  FileSpreadsheet: FileSpreadsheet,
  Percent: Percent,
  Maximize2: Maximize2,
  RotateCw: RotateCw,
};

export function ToolGrid({ searchQuery, onClearSearch }: ToolGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryKey>('all');

  // Filter tools based on active category and search query
  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DEVELOPER_TOOLS.filter((tool) => {
      // Category Match
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      if (!matchesCategory) return false;

      // Query Match
      if (!query) return true;

      const titleMatch = tool.title.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      const tagMatch = tool.tags.some((tag) => tag.toLowerCase().includes(query));
      const catMatch = tool.categoryLabel.toLowerCase().includes(query);

      return titleMatch || descMatch || tagMatch || catMatch;
    });
  }, [selectedCategory, searchQuery]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<ToolCategoryKey, number> = {
      all: DEVELOPER_TOOLS.length,
      pdf: 0,
      image: 0,
      text: 0,
      dev: 0,
      converters: 0,
      calculators: 0,
    };

    DEVELOPER_TOOLS.forEach((tool) => {
      if (counts[tool.category] !== undefined) {
        counts[tool.category]++;
      }
    });

    return counts;
  }, []);

  return (
    <section id="tools" className="mt-10 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Tüm Araçlar Kataloğu
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Kategorilere göre filtreleyin veya anında arama yapın.
          </p>
        </div>

        <span className="text-xs font-mono text-zinc-500">
          Toplam {DEVELOPER_TOOLS.length} Araç & 90 Dönüştürücü
        </span>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedCategory === cat.key;
          const count = categoryCounts[cat.key];

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? 'bg-zinc-950/20 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Tool Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const IconComponent = ICON_MAP[tool.icon] || Sparkles;

            return (
              <Link
                key={tool.id}
                href={tool.path}
                className="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5 hover:bg-zinc-900/90 hover:border-zinc-700 transition-all duration-200 group relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                {/* Subtle Hover Gradient Glow */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-brand-emerald/10 via-transparent to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  {/* Top Row: Icon + Badges */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-brand-emerald group-hover:scale-105 group-hover:border-brand-emerald/40 transition-all shadow-inner">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {tool.isNew && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 font-semibold">
                          YENİ
                        </span>
                      )}
                      {tool.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                          POPÜLER
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                        {tool.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Title + Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Tags + Arrow */}
                <div className="mt-5 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-1.5 overflow-hidden">
                    {tool.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-zinc-500 bg-zinc-950/60 px-1.5 py-0.5 rounded border border-zinc-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-mono text-brand-emerald font-semibold group-hover:translate-x-1 transition-transform">
                    <span className="text-[11px]">Kullan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-400 mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-200">
              &quot;{searchQuery}&quot; ile eşleşen bir araç bulunamadı
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Farklı bir anahtar kelime deneyin (örn. PDF, Resim, cURL, JSON, JWT, Kelime, Hash).
            </p>
          </div>
          <button
            type="button"
            onClick={onClearSearch}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
          >
            Aramayı Temizle
          </button>
        </div>
      )}
    </section>
  );
}
