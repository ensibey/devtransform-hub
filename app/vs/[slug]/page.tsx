import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllComparisons, getComparisonBySlug } from '@/lib/comparison-matrix';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { GitCompare, ChevronRight, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const comparisons = getAllComparisons();
  return comparisons.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comp = getComparisonBySlug(params.slug);
  if (!comp) return {};

  const title = `${comp.title} | ZeroUpload`;
  const description = `${comp.summary} Compare features, performance benchmarks, and architecture recommendations.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/vs/${comp.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${comp.itemAName.toLowerCase()} vs ${comp.itemBName.toLowerCase()}`,
      'tech comparison',
      'developer benchmark',
      'architecture comparison',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'ZeroUpload Developer Suite',
    },
  };
}

export default function ComparisonPage({ params }: Props) {
  const comp = getComparisonBySlug(params.slug);
  if (!comp) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: comp.title,
    description: comp.summary,
    url: `https://devtransform-hub.vercel.app/vs/${comp.slug}/`,
    inLanguage: 'en-US',
  };

  return (
    <div className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb & Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-400">Comparisons</span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">{comp.itemAName} vs {comp.itemBName}</span>
        </div>
        <PrivacyBadge />
      </div>

      {/* Main Heading */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 uppercase font-bold">
            Architecture Matrix
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {comp.title}
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          {comp.summary}
        </p>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
          <GitCompare className="w-4 h-4 text-brand-emerald" />
          <span>Feature & Performance Breakdown</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Feature / Metric</th>
                <th className="py-3 px-4 text-brand-emerald">{comp.itemAName}</th>
                <th className="py-3 px-4 text-sky-400">{comp.itemBName}</th>
                <th className="py-3 px-4 text-center">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {comp.features.map((feat, idx) => (
                <tr key={idx} className="hover:bg-zinc-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{feat.feature}</td>
                  <td className="py-3.5 px-4 text-zinc-300">{feat.itemA}</td>
                  <td className="py-3.5 px-4 text-zinc-300">{feat.itemB}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        feat.verdict === 'A'
                          ? 'bg-emerald-500/20 text-brand-emerald border border-emerald-500/30'
                          : feat.verdict === 'B'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {feat.verdict === 'A' ? comp.itemAName : feat.verdict === 'B' ? comp.itemBName : 'Tie'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Guide / Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-emerald-500/30 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>When to Choose {comp.itemAName}:</span>
          </h3>
          <ul className="space-y-2 text-xs font-mono text-zinc-300">
            {comp.recommendations.whenToUseA.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-sky-500/30 space-y-3">
          <h3 className="text-sm font-bold text-sky-400 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>When to Choose {comp.itemBName}:</span>
          </h3>
          <ul className="space-y-2 text-xs font-mono text-zinc-300">
            {comp.recommendations.whenToUseB.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
