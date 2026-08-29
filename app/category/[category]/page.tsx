import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, ToolCategory } from '@/types/tool';
import { getToolsByCategory } from '@/lib/registry';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { EthicalAdUnit } from '@/components/ads/EthicalAdUnit';
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Calculator,
  Code2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryInfo = CATEGORIES[params.category as ToolCategory];
  if (!categoryInfo) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = `${categoryInfo.name} - Free Online Client-Side Tools`;
  const description = `${categoryInfo.description} 100% private, zero server storage, and instant in-browser execution.`;
  const canonicalUrl = `https://zeroupload.pages.dev/category/${categoryInfo.slug}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryInfo = CATEGORIES[params.category as ToolCategory];

  if (!categoryInfo) {
    notFound();
  }

  const tools = getToolsByCategory(categoryInfo.id);

  return (
    <div className="space-y-8 py-2">
      {/* Category Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-brand-emerald font-semibold">{categoryInfo.name}</span>
          </div>
          <PrivacyBadge />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {categoryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {categoryInfo.description} All utilities execute 100% locally inside your browser via WebAssembly and Canvas.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}/`}
            className="group p-5 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-border hover:border-zinc-500 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-surface-200 border border-border flex items-center justify-center text-brand-emerald group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                {tool.isPopular && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    POPULAR
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white pt-1">
                {tool.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {tool.shortDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-brand-emerald">
              <span>⚡ 100% Client-Side</span>
              <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <EthicalAdUnit />
    </div>
  );
}
