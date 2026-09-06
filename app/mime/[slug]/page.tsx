import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllMimes, getMimeBySlug, MIME_DATA } from '@/lib/mime-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  FileCode,
  Globe,
  Server,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  FileText,
  Terminal,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const mimes = getAllMimes();
  return mimes.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getMimeBySlug(params.slug);
  if (!item) return { title: 'MIME Type Details' };

  const title = `${item.mime} MIME Type: HTTP Header, Extensions & Server Config | DevTransform`;
  const description = `Complete reference for MIME type ${item.mime} (${item.name}). Extensions: ${item.extensions.join(', ') || 'N/A'}. HTTP Content-Type headers, NGINX / Apache config, and security notes.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/mime/${item.slug}/`;

  return {
    title,
    description,
    keywords: [
      item.mime,
      `${item.mime} mime type`,
      `content type ${item.mime}`,
      `${item.name.toLowerCase()} mime`,
      `nginx ${item.mime}`,
      `http header ${item.mime}`,
      ...item.extensions.map((ext) => `${ext} mime type`),
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

export default function MimeDetailPage({ params }: PageProps) {
  const item = getMimeBySlug(params.slug);
  if (!item) notFound();

  const otherMimes = MIME_DATA.filter((m) => m.slug !== item.slug).slice(0, 6);

  const faqs = [
    {
      question: `What is the correct Content-Type header for ${item.name}?`,
      answer: `The standard HTTP response header is: "${item.httpHeader}".`,
    },
    {
      question: `Which file extensions map to ${item.mime}?`,
      answer: item.extensions.length > 0
        ? `Common extensions associated with this MIME type are: ${item.extensions.join(', ')}.`
        : `This MIME type is dynamically generated or used in multipart form transfers without fixed static extensions.`,
    },
    {
      question: `How do I configure NGINX to serve ${item.mime}?`,
      answer: `Add or verify within your nginx.conf mime.types block: "${item.nginxConfig.replace(/\n/g, ' ')}".`,
    },
    {
      question: `Are there security considerations when serving ${item.mime}?`,
      answer: item.securityNote,
    },
  ];

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${item.mime} MIME Type & Content-Type Developer Reference`,
    description: item.description,
    url: `https://devtransform-hub.vercel.app/mime/${item.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'MIME Types Directory', item: 'https://devtransform-hub.vercel.app/mime/directory/' },
      { '@type': 'ListItem', position: 3, name: item.mime, item: `https://devtransform-hub.vercel.app/mime/${item.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header & Breadcrumbs */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/mime/directory/" className="hover:text-zinc-200 transition-colors">MIME Types Directory</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{item.mime}</span>
          </nav>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-zinc-300 border-border">
            Category: {item.category}
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {item.mime}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">MIME / CONTENT-TYPE</span>
          <p className="text-lg sm:text-xl font-bold font-mono text-brand-emerald mt-1 truncate">{item.mime}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">ASSOCIATED EXTENSIONS</span>
          <p className="text-lg sm:text-xl font-bold font-mono text-zinc-100 mt-1 truncate">
            {item.extensions.length > 0 ? item.extensions.join(', ') : 'None / Stream'}
          </p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">PRIMARY CATEGORY</span>
          <p className="text-lg sm:text-xl font-bold font-mono text-zinc-100 mt-1">{item.category}</p>
        </div>
      </div>

      {/* HTTP Header & Server Configuration */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-brand-emerald" />
          <span>HTTP Headers & Web Server Configurations</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* HTTP Header Card */}
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200">Standard HTTP Response Header</span>
              <CopyButton text={item.httpHeader} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-emerald-400">
              <code>{item.httpHeader}</code>
            </div>
            <p className="text-[11px] text-zinc-400">
              Send this exact header in HTTP responses to instruct browsers how to decode and render the payload.
            </p>
          </div>

          {/* Example Code Snippet Card */}
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200">Node.js / Express / Web API</span>
              <CopyButton text={item.exampleSnippet} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-sky-300 overflow-x-auto whitespace-pre">
              <code>{item.exampleSnippet}</code>
            </div>
          </div>

          {/* NGINX Config */}
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200">NGINX Configuration (mime.types)</span>
              <CopyButton text={item.nginxConfig} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre">
              <code>{item.nginxConfig}</code>
            </div>
          </div>

          {/* Apache .htaccess */}
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200">Apache (.htaccess / httpd.conf)</span>
              <CopyButton text={item.apacheConfig} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-violet-300 overflow-x-auto whitespace-pre">
              <code>{item.apacheConfig}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Security Advisory */}
      <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-2.5">
        <div className="flex items-center space-x-2 text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          <h3 className="text-sm font-bold text-white">Security Advisory & Hardening</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {item.securityNote}
        </p>
      </div>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        title={`${item.mime} Questions & Answers`}
        subtitle="Common questions regarding MIME types, Content-Type headers, and web server configurations."
      />

      {/* Related MIME Types */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Explore Other MIME Types</h2>
          <Link href="/mime/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>View All MIME Types</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherMimes.map((m) => (
            <Link
              key={m.slug}
              href={`/mime/${m.slug}/`}
              className="group p-3 rounded-lg border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors"
            >
              <span className="text-xs font-bold font-mono text-brand-emerald group-hover:text-emerald-300 block truncate">
                {m.mime}
              </span>
              <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                {m.name.split('(')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
