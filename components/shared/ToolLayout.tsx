'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ToolDefinition, CATEGORIES } from '@/types/tool';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { EthicalAdUnit } from '@/components/ads/EthicalAdUnit';
import { addRecentToolSlug, getFavoriteToolSlugs, toggleFavoriteToolSlug } from '@/lib/storage';
import {
  Star,
  Layers,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  relatedTools?: ToolDefinition[];
}

export function ToolLayout({ tool, children, relatedTools = [] }: ToolLayoutProps) {
  const category = CATEGORIES[tool.category];
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    addRecentToolSlug(tool.slug);
    const favs = getFavoriteToolSlugs();
    setIsFavorite(favs.includes(tool.slug));
  }, [tool.slug]);

  const handleToggleFavorite = () => {
    const nextState = toggleFavoriteToolSlug(tool.slug);
    setIsFavorite(nextState);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link
              href={`/category/${tool.category}/`}
              className="text-zinc-300 hover:text-white transition-colors capitalize font-medium"
            >
              {category?.name || tool.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{tool.title}</span>
          </div>

          <PrivacyBadge />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {tool.title}
              </h1>
              {tool.isPopular && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  POPULAR
                </span>
              )}
              {tool.isNew && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 font-semibold">
                  NEW
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              {tool.shortDesc}
            </p>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`self-start md:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isFavorite
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                : 'bg-surface-100 hover:bg-surface-50 text-zinc-400 hover:text-zinc-200 border-border'
            }`}
            title="Save to favorites"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'
              }`}
            />
            <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Main Tool Container */}
      <div className="w-full bg-surface-100 border border-border rounded-2xl p-4 sm:p-6 shadow-2xl">
        {children}
      </div>

      <EthicalAdUnit />

      {/* FAQs & Documentation Section */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="border-t border-border pt-10 space-y-6">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-brand-indigo" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Frequently Asked Questions & Guide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.faqs.map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-surface-100 border border-border space-y-2"
              >
                <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                  {faq.question}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools in Category */}
      {relatedTools.length > 0 && (
        <section className="border-t border-border pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-200 tracking-tight">
              More {category?.name || 'Utilities'}
            </h3>
            <Link
              href={`/category/${tool.category}/`}
              className="text-xs text-brand-emerald hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedTools.slice(0, 3).map((rTool) => (
              <Link
                key={rTool.slug}
                href={`/tools/${rTool.slug}/`}
                className="p-3.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border hover:border-zinc-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-zinc-200">
                    {rTool.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {rTool.shortDesc}
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-mono text-brand-emerald">
                  Open Tool →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
