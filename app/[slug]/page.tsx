import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllMatrixPairs,
  getMatrixPair,
  isValidFormatId,
  FORMATS,
} from '@/lib/matrix';
import { ConverterWorkspace } from '@/components/editor/ConverterWorkspace';
import { TechnicalFaq } from '@/components/seo/TechnicalFaq';
import { JsonLdSchema } from '@/components/seo/JsonLdSchema';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { EthicalAdUnit } from '@/components/ads/EthicalAdUnit';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

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

  const title = `Convert ${pair.fromMeta.shortName} to ${pair.toMeta.shortName} Online (Free & Private)`;
  const description = `Transform ${pair.fromMeta.name} into idiomatic ${pair.toMeta.name} in milliseconds. 100% client-side Web Worker execution, zero server storage, and LZ-String URL state sharing.`;
  const canonicalUrl = `https://devtransform.pages.dev/${pair.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${pair.from} to ${pair.to}`,
      `convert ${pair.from} to ${pair.to}`,
      `${pair.fromMeta.shortName} to ${pair.toMeta.shortName} converter`,
      `${pair.from} parser`,
      `${pair.to} generator`,
      ...pair.fromMeta.keywords,
      ...pair.toMeta.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function MatrixConverterPage({ params }: PageProps) {
  const pair = parsePairFromSlug(params.slug);

  if (!pair) {
    notFound();
  }

  const canonicalUrl = `https://devtransform.pages.dev/${pair.slug}/`;

  return (
    <div className="space-y-8 py-2">
      {/* Rich JSON-LD Schemas */}
      <JsonLdSchema
        fromMeta={pair.fromMeta}
        toMeta={pair.toMeta}
        url={canonicalUrl}
      />

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PrivacyBadge />
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-brand-emerald" />
              <span>⚡ Web Worker AST Engine</span>
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono">
            <span>Converters</span>
            <span>/</span>
            <span className="text-zinc-200 uppercase">{pair.fromMeta.shortName}</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
            <span className="text-brand-emerald uppercase">{pair.toMeta.shortName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {pair.fromMeta.shortName} to {pair.toMeta.shortName} Converter
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Convert {pair.fromMeta.name} into {pair.toMeta.name} entirely in your browser. Fast type inference, syntax highlighting, diff mode, and privacy-first URL hash state sharing.
          </p>
        </div>
      </div>

      {/* Interactive Master Converter Workspace */}
      <ConverterWorkspace
        initialFrom={pair.from}
        initialTo={pair.to}
      />

      <EthicalAdUnit />

      {/* Programmatic Technical Comparison & FAQ Section */}
      <TechnicalFaq
        fromMeta={pair.fromMeta}
        toMeta={pair.toMeta}
      />
    </div>
  );
}
