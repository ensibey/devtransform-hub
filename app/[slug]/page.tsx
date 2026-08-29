import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllMatrixPairs,
  getMatrixPair,
  isValidFormatId,
  FORMATS,
  FormatId,
} from '@/lib/matrix';
import { getPairSEOData, FORMAT_DETAILS } from '@/lib/seo-data';
import { ConverterWorkspace } from '@/components/editor/ConverterWorkspace';
import { TechnicalComparison } from '@/components/seo/TechnicalComparison';
import { HowToGuide } from '@/components/seo/HowToGuide';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { RelatedTools } from '@/components/seo/RelatedTools';
import { JsonLdSchema } from '@/components/seo/JsonLdSchema';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { EthicalAdUnit } from '@/components/ads/EthicalAdUnit';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Statically pre-render all N * (N - 1) = 90 conversion pair combinations.
 */
export async function generateStaticParams() {
  const pairs = getAllMatrixPairs();
  return pairs.map((pair) => ({
    slug: pair.slug,
  }));
}

function parsePairFromSlug(slug: string) {
  if (!slug.includes('-to-')) return null;
  const parts = slug.split('-to-');
  if (parts.length !== 2) return null;
  return getMatrixPair(parts[0], parts[1]);
}

/**
 * Generates keyword-rich Programmatic SEO metadata for every conversion pair.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pair = parsePairFromSlug(params.slug);
  if (!pair) {
    return {
      title: 'Converter Not Found',
    };
  }

  const seoData = getPairSEOData(pair.from as FormatId, pair.to as FormatId);
  const canonicalUrl = `https://zeroupload.pages.dev/${pair.slug}/`;

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: [
      `${pair.from} to ${pair.to}`,
      `convert ${pair.from} to ${pair.to}`,
      `${pair.fromMeta.shortName} to ${pair.toMeta.shortName} converter`,
      `${pair.from} parser`,
      `${pair.to} generator`,
      `${pair.from} to ${pair.to} online`,
      ...pair.fromMeta.keywords,
      ...pair.toMeta.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
    },
  };
}

export default function MatrixConverterPage({ params }: PageProps) {
  const pair = parsePairFromSlug(params.slug);

  if (!pair) {
    notFound();
  }

  const seoData = getPairSEOData(pair.from as FormatId, pair.to as FormatId);
  const fromDetail = FORMAT_DETAILS[pair.from as FormatId] || FORMAT_DETAILS.json;
  const toDetail = FORMAT_DETAILS[pair.to as FormatId] || FORMAT_DETAILS.typescript;
  const canonicalUrl = `https://zeroupload.pages.dev/${pair.slug}/`;

  return (
    <div className="space-y-8 py-2">
      {/* Triple JSON-LD Structured Schemas */}
      <JsonLdSchema
        fromMeta={pair.fromMeta}
        toMeta={pair.toMeta}
        faqs={seoData.faqs}
        url={canonicalUrl}
      />

      {/* Header Banner & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/#converters" className="hover:text-zinc-200 transition-colors">
              Converters
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-200 uppercase">{pair.fromMeta.shortName}</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
            <span className="text-brand-emerald font-semibold uppercase">{pair.toMeta.shortName}</span>
          </nav>

          <PrivacyBadge />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500">
            <Zap className="w-3.5 h-3.5 text-brand-emerald" />
            <span>⚡ 100% Client-Side • Sub-Millisecond AST Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {seoData.h1}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {seoData.subtitle}
          </p>
        </div>
      </div>

      {/* Interactive Master Converter Workspace */}
      <ConverterWorkspace
        initialFrom={pair.from}
        initialTo={pair.to}
      />

      <EthicalAdUnit />

      {/* Anti-Thin-Content Technical Comparison Table */}
      <TechnicalComparison
        fromDetail={fromDetail}
        toDetail={toDetail}
        comparisonTable={seoData.comparisonTable}
      />

      {/* Context-Aware How-To Guide */}
      <HowToGuide
        fromName={pair.fromMeta.shortName}
        toName={pair.toMeta.shortName}
        steps={seoData.howToSteps}
        advantages={seoData.advantages}
      />

      {/* Semantic Accessible FAQ Accordion */}
      <FaqAccordion
        faqs={seoData.faqs}
        fromName={pair.fromMeta.shortName}
        toName={pair.toMeta.shortName}
      />

      {/* Contextual Internal Linking Cluster */}
      <RelatedTools
        currentFrom={pair.from as FormatId}
        currentTo={pair.to as FormatId}
      />
    </div>
  );
}
