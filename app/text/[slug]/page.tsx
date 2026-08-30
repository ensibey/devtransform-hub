import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllTextTransformations,
  getTextTransformationBySlug,
  TEXT_TRANSFORMATIONS,
} from '@/lib/text-matrix';
import { TextWorkspace } from '@/components/text/TextWorkspace';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Type,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Code2,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const list = getAllTextTransformations();
  return list.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getTextTransformationBySlug(params.slug);
  if (!item) return { title: 'Text Converter' };

  const title = `${item.name} Online Converter & Tool (${item.nameTr})`;
  const description = `Free online ${item.name} utility. ${item.description} Instant client-side transformation with zero latency and complete privacy.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/text/${item.slug}/`;

  return {
    title,
    description,
    keywords: [
      item.slug.replace(/-/g, ' '),
      item.name.toLowerCase(),
      `${item.nameTr.toLowerCase()}`,
      'text converter',
      'string manipulation online',
      'developer text tools',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload Text Hub',
    },
  };
}

export default function TextTransformationPage({ params }: PageProps) {
  const item = getTextTransformationBySlug(params.slug);
  if (!item) notFound();

  const faqs = [
    {
      question: `What is ${item.name}?`,
      answer: `${item.description} In Turkish: ${item.descriptionTr}`,
    },
    {
      question: `Does this tool upload my text to a server?`,
      answer: `No. All text transformations run 100% locally in your web browser using JavaScript string manipulation algorithms. Your text never leaves your device.`,
    },
    {
      question: `Is there any character or file size limit?`,
      answer: `There are no arbitrary limits. You can convert short variable names or entire multi-megabyte text documents without restriction.`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: item.name,
    url: `https://devtransform-hub.vercel.app/text/${item.slug}/`,
    description: item.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Text Tools', item: 'https://devtransform-hub.vercel.app/#tools' },
      { '@type': 'ListItem', position: 3, name: item.name, item: `https://devtransform-hub.vercel.app/text/${item.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/tools/case-converter/" className="hover:text-zinc-200 transition-colors">Text Utils</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{item.name}</span>
          </nav>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side Private</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {item.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {item.description} ({item.descriptionTr})
          </p>
        </div>
      </div>

      {/* Interactive Transformation Workspace */}
      <TextWorkspace slug={item.slug} sampleInput={item.sampleInput} />

      {/* Related Text Transformations */}
      <section className="space-y-3 pt-6 border-t border-zinc-800">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-400 uppercase">
          <Layers className="w-4 h-4" />
          <span>Diğer Metin Dönüştürücüleri (Related Text Tools)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {TEXT_TRANSFORMATIONS.filter((t) => t.slug !== item.slug).slice(0, 9).map((t) => (
            <Link
              key={t.slug}
              href={`/text/${t.slug}/`}
              className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-xs flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
            >
              <span className="font-mono text-zinc-200 group-hover:text-brand-emerald font-semibold truncate pr-2">
                {t.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqAccordion
        faqs={faqs}
        fromName={item.name}
        toName="Text Engine"
      />
    </div>
  );
}
