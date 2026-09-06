import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllHttpHeaders,
  getHttpHeaderBySlug,
  HTTP_HEADERS,
} from '@/lib/http-headers-data';
import { HeaderConfigSwitcher } from '@/components/http-header/HeaderConfigSwitcher';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, ShieldCheck, Server } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const headers = getAllHttpHeaders();
  return headers.map((h) => ({
    slug: h.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const header = getHttpHeaderBySlug(params.slug);
  if (!header) return { title: 'HTTP Header' };

  const title = `${header.name} Header: Syntax, Examples & Security Guide | DevTransform`;
  const description = `${header.summary} Server configs for NGINX, Apache, Next.js, and Express with OWASP recommendations and directives.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/http-header/${header.slug}/`;

  return {
    title,
    description,
    keywords: [
      header.name.toLowerCase(),
      `http header ${header.slug}`,
      `${header.name} nginx config`,
      `${header.name} apache`,
      `${header.name} nextjs`,
      'http security headers',
      'web headers guide',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function HttpHeaderPage({ params }: PageProps) {
  const header = getHttpHeaderBySlug(params.slug);
  if (!header) notFound();

  const otherHeaders = HTTP_HEADERS.filter((h) => h.slug !== header.slug);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/http-header/directory/" className="hover:text-zinc-200 transition-colors">HTTP Headers</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{header.name}</span>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-brand-emerald border-border">
              {header.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-200 text-zinc-400 border border-border">
              {header.type}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {header.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {header.summary}
          </p>
        </div>
      </div>

      {/* Interactive Config Switcher & Directives */}
      <HeaderConfigSwitcher header={header} />

      {/* FAQs */}
      <FaqAccordion
        faqs={header.faqs}
        title={`${header.name} - Questions & Answers`}
        subtitle="Common implementation questions, browser enforcement rules, and debugging."
      />

      {/* Related Headers */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Related HTTP Headers</h2>
          <Link href="/http-header/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>Browse All Headers</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherHeaders.slice(0, 6).map((h) => (
            <Link
              key={h.slug}
              href={`/http-header/${h.slug}/`}
              className="group p-4 rounded-xl border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-emerald uppercase">
                  {h.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {h.type}
                </span>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 block">
                {h.name}
              </span>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {h.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
