import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllHtmlEntities,
  getHtmlEntityBySlug,
  HTML_ENTITIES_DATA,
} from '@/lib/html-entities-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Sparkles,
  Code2,
  FileCode,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Hash,
  Globe,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const entities = getAllHtmlEntities();
  return entities.map((e) => ({
    slug: e.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getHtmlEntityBySlug(params.slug);
  if (!item) return { title: 'HTML Entity Details' };

  const title = `${item.char} ${item.name} HTML Entity (${item.namedEntity}): Codes & CSS/JS Escape | DevTransform`;
  const description = `Complete HTML entity reference for ${item.name} (${item.char}). Named entity ${item.namedEntity}, decimal ${item.decimalCode}, hex ${item.hexCode}, CSS escape ${item.cssContent}, and JS unicode ${item.jsUnicode}.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/html-entity/${item.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${item.name.toLowerCase()} html entity`,
      `${item.char} html code`,
      `${item.char} entity`,
      item.namedEntity,
      item.decimalCode,
      item.hexCode,
      `${item.name.toLowerCase()} unicode`,
      `${item.name.toLowerCase()} css content`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform Developer Utilities',
    },
  };
}

export default function HtmlEntityDetailPage({ params }: PageProps) {
  const item = getHtmlEntityBySlug(params.slug);
  if (!item) notFound();

  const otherEntities = HTML_ENTITIES_DATA.filter((e) => e.slug !== item.slug).slice(0, 6);

  const faqs = [
    {
      question: `What is the HTML entity for the ${item.name} (${item.char})?`,
      answer: `The standard HTML named entity is "${item.namedEntity}". If using numeric codes, you can use the decimal code "${item.decimalCode}" or hex code "${item.hexCode}".`,
    },
    {
      question: `How do I use ${item.name} in CSS ::before or ::after pseudo-elements?`,
      answer: `In CSS, specify the escaped hexadecimal code in the content property: "content: '${item.cssContent}';".`,
    },
    {
      question: `How do I write ${item.name} in JavaScript or TypeScript?`,
      answer: `In JavaScript strings, write "${item.jsUnicode}" (e.g. const symbol = "${item.jsUnicode}";).`,
    },
    {
      question: `Why should I use HTML entities instead of typing raw characters?`,
      answer: `Using HTML entities prevents document encoding issues (UTF-8 mismatch), eliminates XSS parser ambiguities for reserved characters (<, >, &, "), and guarantees uniform rendering across legacy browsers.`,
    },
  ];

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${item.name} (${item.char}) HTML Entity & Unicode Reference`,
    description: item.description,
    url: `https://devtransform-hub.vercel.app/html-entity/${item.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'HTML Entities Directory', item: 'https://devtransform-hub.vercel.app/html-entity/directory/' },
      { '@type': 'ListItem', position: 3, name: `${item.char} ${item.name}`, item: `https://devtransform-hub.vercel.app/html-entity/${item.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/html-entity/directory/" className="hover:text-zinc-200 transition-colors">HTML Entities</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{item.name}</span>
          </nav>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-zinc-300 border-border">
            {item.category}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
          {/* Big Visual Character Showcase Card */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface-100 border border-brand-emerald/40 flex items-center justify-center text-5xl sm:text-6xl text-white font-bold shadow-xl shadow-brand-emerald/5 flex-shrink-0">
            {item.char === ' ' ? <span className="text-xs font-mono text-zinc-500">NBSP</span> : item.char}
          </div>

          <div className="space-y-1.5 flex-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {item.name} ({item.char})
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Copyable Entity Formats Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-brand-emerald" />
          <span>One-Click Copyable Code Formats</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. HTML Named Entity */}
          <div className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span>HTML Named Entity</span>
              <CopyButton text={item.namedEntity} />
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg font-mono text-sm font-bold text-brand-emerald truncate border border-border/40">
              <code>{item.namedEntity}</code>
            </div>
          </div>

          {/* 2. HTML Decimal Code */}
          <div className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span>HTML Decimal Code</span>
              <CopyButton text={item.decimalCode} />
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg font-mono text-sm font-bold text-sky-400 truncate border border-border/40">
              <code>{item.decimalCode}</code>
            </div>
          </div>

          {/* 3. HTML Hex Code */}
          <div className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span>HTML Hex Code</span>
              <CopyButton text={item.hexCode} />
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg font-mono text-sm font-bold text-amber-400 truncate border border-border/40">
              <code>{item.hexCode}</code>
            </div>
          </div>

          {/* 4. CSS Pseudo-Element Content */}
          <div className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span>CSS content (\XXXX)</span>
              <CopyButton text={item.cssContent} />
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg font-mono text-sm font-bold text-violet-400 truncate border border-border/40">
              <code>{item.cssContent}</code>
            </div>
          </div>

          {/* 5. JavaScript / TypeScript */}
          <div className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span>JavaScript Unicode (\uXXXX)</span>
              <CopyButton text={item.jsUnicode} />
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg font-mono text-sm font-bold text-emerald-300 truncate border border-border/40">
              <code>{item.jsUnicode}</code>
            </div>
          </div>

          {/* 6. URL Percent Encoding */}
          <div className="bg-surface-100 border border-border hover:border-brand-emerald/50 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span>URL Percent Encoded</span>
              <CopyButton text={item.urlEncoded} />
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg font-mono text-sm font-bold text-rose-400 truncate border border-border/40">
              <code>{item.urlEncoded}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Code Integration Examples */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-brand-emerald" />
          <span>Real-World Implementation Snippets</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-surface-100 border border-border rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-zinc-300 block">HTML5 Document</span>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
              <code>{`<p>Example: ${item.namedEntity}</p>`}</code>
            </div>
          </div>

          <div className="bg-surface-100 border border-border rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-zinc-300 block">CSS ::before / ::after</span>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-sky-400 overflow-x-auto whitespace-pre">
              <code>{`.badge::before {\n  content: '${item.cssContent} ';\n}`}</code>
            </div>
          </div>

          <div className="bg-surface-100 border border-border rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-zinc-300 block">React JSX / TypeScript</span>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-violet-400 overflow-x-auto whitespace-pre">
              <code>{`<span>{"${item.jsUnicode}"}</span>`}</code>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        title={`${item.name} (${item.char}) HTML Entity FAQ`}
        subtitle="Common questions regarding HTML escape codes, CSS pseudo-elements, and browser character encoding."
      />

      {/* Related Entities */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Explore Other HTML Entities</h2>
          <Link href="/html-entity/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>View All HTML Entities Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherEntities.map((e) => (
            <Link
              key={e.slug}
              href={`/html-entity/${e.slug}/`}
              className="group p-3 rounded-lg border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded bg-surface-200 border border-border flex items-center justify-center font-bold text-brand-emerald group-hover:text-emerald-300 text-lg flex-shrink-0">
                {e.char === ' ' ? '␣' : e.char}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-zinc-200 truncate block">
                  {e.name}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 block truncate">
                  {e.namedEntity}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
