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
  Share2,
  Check,
  Maximize2,
  Minimize2,
  Code2,
} from 'lucide-react';
import { CopyButton } from './CopyButton';

export interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  relatedTools?: ToolDefinition[];
}

export function ToolLayout({ tool, children, relatedTools = [] }: ToolLayoutProps) {
  const category = CATEGORIES[tool.category];
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  useEffect(() => {
    addRecentToolSlug(tool.slug);
    const favs = getFavoriteToolSlugs();
    setIsFavorite(favs.includes(tool.slug));
  }, [tool.slug]);

  const handleToggleFavorite = () => {
    const nextState = toggleFavoriteToolSlug(tool.slug);
    setIsFavorite(nextState);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className={`space-y-8 py-2 transition-all duration-300 ${isZenMode ? 'max-w-none px-2' : ''}`}>
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

          {/* Actions Bar: Favorite, Share, Zen Mode */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors shadow-sm"
              title="Share tool link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-emerald" />
                  <span className="text-brand-emerald font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Zen Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsZenMode(!isZenMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors shadow-sm ${
                isZenMode
                  ? 'bg-brand-emerald/20 border-brand-emerald text-brand-emerald font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Toggle Focus / Expanded Width Mode"
            >
              {isZenMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Standard</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Focus</span>
                </>
              )}
            </button>

            {/* Favorite Toggle Button */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-sm ${
                isFavorite
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
              title="Save to favorites"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'
                }`}
              />
              <span>{isFavorite ? 'Saved' : 'Pin'}</span>
            </button>

            {/* Embed Widget Button */}
            <button
              type="button"
              onClick={() => setShowEmbedModal(!showEmbedModal)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors shadow-sm ${
                showEmbedModal
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
              title="Embed this interactive tool on your website or blog"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Embed</span>
            </button>
          </div>
        </div>

        {/* Embed Widget Popover Box */}
        {showEmbedModal && (
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-sky-500/40 space-y-3 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-sky-400 font-bold">
              <span>Embed Widget Code (Copy & Paste to your HTML / Blog):</span>
              <CopyButton text={`<iframe src="https://devtransform-hub.vercel.app/embed/${tool.slug}/" width="100%" height="480" frameborder="0" style="border-radius: 16px; overflow: hidden;"></iframe>\n<p style="font-size: 11px; color: #71717a;"><a href="https://devtransform-hub.vercel.app/tools/${tool.slug}/" target="_blank" rel="noopener noreferrer">⚡ Powered by ZeroUpload</a></p>`} />
            </div>
            <textarea
              readOnly
              rows={3}
              value={`<iframe src="https://devtransform-hub.vercel.app/embed/${tool.slug}/" width="100%" height="480" frameborder="0" style="border-radius: 16px; overflow: hidden;"></iframe>\n<p style="font-size: 11px; color: #71717a;"><a href="https://devtransform-hub.vercel.app/tools/${tool.slug}/" target="_blank" rel="noopener noreferrer">⚡ Powered by ZeroUpload</a></p>`}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sky-300 select-all focus:outline-none resize-none leading-relaxed"
            />
            <span className="text-[10px] text-zinc-500 block">
              Free to embed on any blog, documentation, or developer site. Includes automatic iframe resizing.
            </span>
          </div>
        )}
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
        <section className="border-t border-border pt-10 space-y-6">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-emerald" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              More {category?.name || 'Related'} Utilities
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <Link
                key={relTool.id}
                href={`/tools/${relTool.slug}/`}
                className="p-4 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border hover:border-brand-emerald/30 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm group-hover:text-brand-emerald transition-colors">
                    {relTool.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {relTool.shortDesc}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-xs text-brand-emerald font-medium pt-2">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
