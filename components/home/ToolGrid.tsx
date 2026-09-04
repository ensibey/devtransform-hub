'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  DEVELOPER_TOOLS,
  CATEGORY_FILTERS,
  DeveloperToolItem,
  ToolCategoryKey,
} from '@/lib/tools-data';
import { getFavoriteToolSlugs, toggleFavoriteToolSlug } from '@/lib/storage';
import {
  Sparkles,
  ArrowRight,
  ArrowRightLeft,
  ShieldCheck,
  Clock,
  Terminal,
  Code2,
  Calculator,
  Search,
  SearchX,
  Smartphone,
  Zap,
  Palette,
  Triangle,
  Share2,
  Bot,
  GitBranch,
  Award,
  Waves,
  Sliders,
  Grid,
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
  Star,
  Box,
  Play,
  Keyboard,
  Ratio,
  Link2,
  Globe,
  Lock,
} from 'lucide-react';

export interface ToolGridProps {
  searchQuery: string;
  onClearSearch: () => void;
}

// Full icon dictionary helper
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces: Code2,
  Code2: Code2,
  Layers: Layers,
  FileCode: FileCode,
  ArrowRightLeft: ArrowRightLeft,
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
  Box: Box,
  Play: Play,
  Keyboard: Keyboard,
  Ratio: Ratio,
  Link2: Link2,
  Globe: Globe,
  Lock: Lock,
  Calculator: Calculator,
  Shield: ShieldCheck,
  ShieldCheck: ShieldCheck,
  Clock: Clock,
  FileJson: FileCode,
  Zap: Zap,
  Palette: Palette,
  Bot: Bot,
  GitBranch: GitBranch,
  Award: Award,
  Waves: Waves,
  Sliders: Sliders,
  Grid: Grid,
  Triangle: Triangle,
  Share2: Share2,
  Search: Search,
  Smartphone: Smartphone,
};

export function ToolGrid({ searchQuery, onClearSearch }: ToolGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryKey | 'favorites'>('all');
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteSlugs(getFavoriteToolSlugs());
  }, []);

  const handleToggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowFav = toggleFavoriteToolSlug(slug);
    setFavoriteSlugs(getFavoriteToolSlugs());
  };

  // Filter tools based on active category, favorites, and search query
  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DEVELOPER_TOOLS.filter((tool) => {
      // Favorites Filter
      if (selectedCategory === 'favorites') {
        if (!favoriteSlugs.includes(tool.slug)) return false;
      } else if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Query Match
      if (!query) return true;

      const titleMatch = tool.title.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      const tagMatch = tool.tags.some((tag) => tag.toLowerCase().includes(query));
      const catMatch = tool.categoryLabel.toLowerCase().includes(query);

      return titleMatch || descMatch || tagMatch || catMatch;
    });
  }, [selectedCategory, searchQuery, favoriteSlugs]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: DEVELOPER_TOOLS.length,
      favorites: favoriteSlugs.length,
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
  }, [favoriteSlugs]);

  return (
    <section id="tools" className="space-y-8 scroll-mt-20">
      {/* Category Pills & Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
        {/* All Filter */}
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-white shadow-sm border border-emerald-200 dark:border-zinc-700'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-emerald" />
          <span>Tüm Araçlar ({DEVELOPER_TOOLS.length})</span>
        </button>

        {/* Favorites Filter */}
        {favoriteSlugs.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCategory('favorites')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'favorites'
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-sm'
                : 'text-amber-600 dark:text-amber-400/80 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-zinc-800/40'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Favoriler ({favoriteSlugs.length})</span>
          </button>
        )}

        {CATEGORY_FILTERS.filter((c) => c.key !== 'all').map((cat) => {
          const count = categoryCounts[cat.key] || 0;
          const isActive = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-brand-emerald border border-emerald-200 dark:border-zinc-700 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/40'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-500">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tools Cards Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const IconComp = ICON_MAP[tool.icon] || Code2;
            const isFav = favoriteSlugs.includes(tool.slug);

            return (
              <Link
                key={tool.id}
                href={tool.path}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-zinc-900/80 dark:to-zinc-950/80 border border-slate-200 dark:border-zinc-800/80 hover:border-emerald-500/50 dark:hover:border-brand-emerald/50 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Card Header: Icon, Tags, Favorite Star */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 flex items-center justify-center text-emerald-600 dark:text-brand-emerald group-hover:scale-105 group-hover:border-emerald-500/50 group-hover:bg-emerald-50 dark:group-hover:bg-brand-emerald/10 transition-all">
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="flex items-center space-x-2">
                      {tool.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-bold">
                          POPÜLER
                        </span>
                      )}
                      {tool.isNew && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-brand-emerald border border-emerald-200 dark:border-emerald-500/30 font-bold">
                          YENİ
                        </span>
                      )}

                      {/* Favorite Toggle Star */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(tool.slug, e)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 hover:text-amber-500 transition-colors"
                        title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-zinc-600'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-brand-emerald transition-colors line-clamp-1">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Category label & Open Arrow */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-500">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">{tool.categoryLabel}</span>
                  <span className="flex items-center space-x-1 text-slate-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-brand-emerald font-semibold transition-colors">
                    <span>Aracı Başlat</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-zinc-900/40 border border-dashed border-slate-300 dark:border-zinc-800 space-y-3 font-sans text-xs text-slate-600 dark:text-zinc-400">
          <SearchX className="w-8 h-8 text-slate-400 dark:text-zinc-600 mx-auto" />
          <p className="text-sm text-slate-900 dark:text-zinc-300 font-bold">Aramanıza uygun araç bulunamadı.</p>
          <p className="text-slate-500 dark:text-zinc-500">&quot;{searchQuery}&quot; için sonuç çıkmadı.</p>
          <button
            type="button"
            onClick={onClearSearch}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold transition-colors"
          >
            Aramayı Temizle
          </button>
        </div>
      )}
    </section>
  );
}
