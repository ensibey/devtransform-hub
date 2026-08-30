import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllHttpStatuses,
  getHttpStatusBySlug,
  HTTP_STATUSES,
} from '@/lib/http-status-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Code2,
  Terminal,
  Server,
  Layers,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const statuses = getAllHttpStatuses();
  return statuses.map((status) => ({
    slug: status.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const status = getHttpStatusBySlug(params.slug);
  if (!status) return { title: 'HTTP Status Code' };

  const title = `HTTP ${status.code} ${status.name} Explained: Causes & How to Fix (${status.nameTr})`;
  const description = `What is HTTP status ${status.code} (${status.name})? Learn the RFC definition, common root causes, and practical code solutions for Node.js, Python, and Nginx.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/http-status/${status.slug}/`;

  return {
    title,
    description,
    keywords: [
      `http ${status.code}`,
      `http status ${status.code}`,
      `what is ${status.name.toLowerCase()}`,
      `${status.code} error fix`,
      `http ${status.code} ${status.name.toLowerCase()}`,
      `${status.nameTr.toLowerCase()} nedir`,
      `how to fix ${status.code}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload HTTP Knowledgebase',
    },
  };
}

export default function HttpStatusPage({ params }: PageProps) {
  const status = getHttpStatusBySlug(params.slug);
  if (!status) notFound();

  const is2xx = status.category === '2xx';
  const is3xx = status.category === '3xx';
  const is4xx = status.category === '4xx';
  const is5xx = status.category === '5xx';

  const badgeColor = is2xx
    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    : is3xx
    ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
    : is4xx
    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    : 'bg-rose-500/10 text-rose-300 border-rose-500/30';

  const faqs = [
    {
      question: `What does HTTP ${status.code} (${status.name}) mean?`,
      answer: `${status.summary} In Turkish: ${status.summaryTr}`,
    },
    {
      question: `Is HTTP ${status.code} a client-side or server-side error?`,
      answer: is4xx
        ? `HTTP ${status.code} is a Client Error (4xx), meaning the issue originated from the client request (e.g. invalid payload, missing token, or wrong URL).`
        : is5xx
        ? `HTTP ${status.code} is a Server Error (5xx), meaning the client request reached the server, but the server encountered an error while attempting to fulfill it.`
        : `HTTP ${status.code} indicates a ${status.categoryName} response.`,
    },
    {
      question: `How can I fix the HTTP ${status.code} status in my application?`,
      answer: `Check the Causes and Code Solutions section above for step-by-step resolution in Express, FastAPI, and Nginx.`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `HTTP ${status.code} ${status.name} Complete Guide & Fixes`,
    description: status.summary,
    url: `https://devtransform-hub.vercel.app/http-status/${status.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'HTTP Status Codes', item: 'https://devtransform-hub.vercel.app/#tools' },
      { '@type': 'ListItem', position: 3, name: `HTTP ${status.code}`, item: `https://devtransform-hub.vercel.app/http-status/${status.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/#tools" className="hover:text-zinc-200 transition-colors">HTTP Status</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">HTTP {status.code}</span>
          </nav>

          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${badgeColor}`}>
            <Zap className="w-3.5 h-3.5" />
            <span>{status.categoryName} ({status.category})</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            HTTP {status.code} — {status.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {status.summary} ({status.summaryTr})
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Causes */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-amber-400 uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Yaygın Nedenler / Common Causes</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed">
            {status.causes.map((cause, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Category & RFC Info */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-sky-400 uppercase">
            <Server className="w-4 h-4" />
            <span>Spesifikasyon & Kategori</span>
          </div>
          <div className="space-y-2 text-xs text-zinc-300 font-mono">
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-500">Status Code:</span>
              <span className="font-bold text-white">{status.code}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-500">Category:</span>
              <span className="text-zinc-200">{status.categoryName} ({status.category})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">RFC Standard:</span>
              <span className="text-brand-emerald">RFC 9110 / HTTP/1.1 & HTTP/2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Solutions */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
          <Code2 className="w-4 h-4 text-brand-emerald" />
          <span>Nasıl Düzeltilir / Practical Code Solutions</span>
        </div>

        <div className="space-y-4">
          {status.fixes.map((fix, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <h3 className="font-bold text-sm text-zinc-200">{fix.title}</h3>
              <p className="text-xs text-zinc-400">{fix.description}</p>
              {fix.codeSnippet && (
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 relative font-mono text-xs text-zinc-200 overflow-x-auto">
                  <div className="absolute right-3 top-3">
                    <CopyButton text={fix.codeSnippet} />
                  </div>
                  <pre className="pr-12">{fix.codeSnippet}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Status Codes */}
      <section className="space-y-3 pt-6 border-t border-zinc-800">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-400 uppercase">
          <Layers className="w-4 h-4" />
          <span>Diğer Popüler HTTP Durum Kodları</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {HTTP_STATUSES.filter((s) => s.code !== status.code).slice(0, 12).map((item) => (
            <Link
              key={item.slug}
              href={`/http-status/${item.slug}/`}
              className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-xs font-mono flex items-center justify-between text-zinc-300 hover:text-white transition-all"
            >
              <span className="font-bold">{item.code}</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        fromName={`HTTP ${status.code}`}
        toName="RFC Standard"
      />
    </div>
  );
}
