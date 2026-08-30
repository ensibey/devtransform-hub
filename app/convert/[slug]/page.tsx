import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllUnitPairs,
  getUnitPair,
  UnitPair,
  UNITS,
} from '@/lib/units-matrix';
import { UnitWorkspace } from '@/components/convert/UnitWorkspace';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Calculator,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Table,
  Layers,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const pairs = getAllUnitPairs();
  return pairs.map((pair) => ({
    slug: pair.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pair = getUnitPair(params.slug);
  if (!pair) return { title: 'Unit Converter' };

  const title = `Convert ${pair.from.name} to ${pair.to.name} (${pair.from.symbol} to ${pair.to.symbol}) - ${pair.from.nameTr} ${pair.to.nameTr} Çevirme`;
  const description = `Free online ${pair.from.name} to ${pair.to.name} converter. 1 ${pair.from.symbol} = ${pair.multiplier} ${pair.to.symbol}. Instant calculation with formula and conversion table.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/convert/${pair.slug}/`;

  return {
    title,
    description,
    keywords: [
      `convert ${pair.from.slug} to ${pair.to.slug}`,
      `${pair.from.symbol} to ${pair.to.symbol}`,
      `${pair.from.name} to ${pair.to.name}`,
      `${pair.from.nameTr.toLowerCase()} ${pair.to.nameTr.toLowerCase()} çevirici`,
      `${pair.from.category} converter`,
      'unit conversion table',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload Unit Hub',
    },
  };
}

export default function UnitPairPage({ params }: PageProps) {
  const pair = getUnitPair(params.slug);
  if (!pair) notFound();

  const faqs = [
    {
      question: `How many ${pair.to.name} are in 1 ${pair.from.name}?`,
      answer: `1 ${pair.from.name} (${pair.from.symbol}) is equal to ${pair.multiplier} ${pair.to.name} (${pair.to.symbol}). To convert any quantity, simply multiply by ${pair.multiplier}.`,
    },
    {
      question: `What is the formula to convert ${pair.from.symbol} to ${pair.to.symbol}?`,
      answer: `Formula: [${pair.to.symbol}] = [${pair.from.symbol}] × ${pair.multiplier}.`,
    },
    {
      question: `Is this calculation accurate?`,
      answer: `Yes, all conversion constants are calculated based on international SI standards and IEEE-754 double precision floating-point arithmetic.`,
    },
  ];

  const sampleValues = [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${pair.from.name} to ${pair.to.name} Converter`,
    url: `https://devtransform-hub.vercel.app/convert/${pair.slug}/`,
    description: `Instant ${pair.from.name} to ${pair.to.name} conversion tool.`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: pair.from.categoryName, item: 'https://devtransform-hub.vercel.app/#tools' },
      { '@type': 'ListItem', position: 3, name: `${pair.from.symbol} to ${pair.to.symbol}`, item: `https://devtransform-hub.vercel.app/convert/${pair.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/tools/unit-converter/" className="hover:text-zinc-200 transition-colors">{pair.from.categoryNameTr}</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-200">{pair.from.name}</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
            <span className="text-brand-emerald font-semibold">{pair.to.name}</span>
          </nav>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SI Standard Multipliers</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500">
            <Zap className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Category: {pair.from.categoryName} ({pair.from.categoryNameTr})</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {pair.from.name} to {pair.to.name} Converter
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Convert {pair.from.name} ({pair.from.symbol}) to {pair.to.name} ({pair.to.symbol}) instantly in your browser with zero latency.
          </p>
        </div>
      </div>

      {/* Interactive Converter Workspace */}
      <UnitWorkspace
        from={pair.from}
        to={pair.to}
        multiplier={pair.multiplier}
      />

      {/* Conversion Table */}
      <section className="mt-10 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-brand-emerald" />
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            {pair.from.name} to {pair.to.name} Quick Conversion Table
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-900/80">
                <th className="p-2.5">{pair.from.name} ({pair.from.symbol})</th>
                <th className="p-2.5">{pair.to.name} ({pair.to.symbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {sampleValues.map((val) => (
                <tr key={val} className="hover:bg-zinc-800/30">
                  <td className="p-2.5 font-bold text-zinc-200">
                    {val} {pair.from.symbol}
                  </td>
                  <td className="p-2.5 text-brand-emerald font-bold">
                    {(val * pair.multiplier).toFixed(4)} {pair.to.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <FaqAccordion
        faqs={faqs}
        fromName={pair.from.name}
        toName={pair.to.name}
      />
    </div>
  );
}
