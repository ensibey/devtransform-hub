import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllDnsRecords,
  getDnsRecordBySlug,
  DNS_RECORDS_DATA,
} from '@/lib/dns-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Globe,
  Terminal,
  Server,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const records = getAllDnsRecords();
  return records.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = getDnsRecordBySlug(params.slug);
  if (!record) return { title: 'DNS Record Details' };

  const title = `${record.type} Record (${record.name}): Syntax, Lookup & Setup Guide | DevTransform`;
  const description = `Complete guide to DNS ${record.type} records. Zone file syntax, dig & nslookup commands, TTL recommendations, and common configuration mistakes.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/dns/${record.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${record.type} record`,
      `what is a ${record.type} record`,
      `${record.type} record syntax`,
      `${record.type} record example`,
      `how to check ${record.type} record`,
      `dig ${record.type}`,
      `nslookup ${record.type}`,
      record.rfc.toLowerCase(),
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

export default function DnsDetailPage({ params }: PageProps) {
  const record = getDnsRecordBySlug(params.slug);
  if (!record) notFound();

  const otherRecords = DNS_RECORDS_DATA.filter((r) => r.slug !== record.slug).slice(0, 6);

  const faqs = [
    {
      question: `What is the purpose of a DNS ${record.type} record?`,
      answer: `${record.description}`,
    },
    {
      question: `How can I check or test a domain's ${record.type} record from the terminal?`,
      answer: `On macOS & Linux, run: "${record.terminalDig}". On Windows Command Prompt or PowerShell, run: "${record.terminalNslookup}" or "${record.powershellCommand}".`,
    },
    {
      question: `What is the recommended TTL for a ${record.type} record?`,
      answer: `The standard recommended TTL is ${record.defaultTtl}. If planning a migration, lower the TTL to 300 seconds (5 minutes) beforehand.`,
    },
    {
      question: `What common mistake should I avoid when configuring ${record.type} records?`,
      answer: `${record.commonMistakes}`,
    },
  ];

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `DNS ${record.type} Record (${record.name}) Developer Guide & Syntax`,
    description: record.description,
    url: `https://devtransform-hub.vercel.app/dns/${record.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'DNS Records Directory', item: 'https://devtransform-hub.vercel.app/dns/directory/' },
      { '@type': 'ListItem', position: 3, name: `${record.type} Record`, item: `https://devtransform-hub.vercel.app/dns/${record.slug}/` },
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
            <Link href="/dns/directory/" className="hover:text-zinc-200 transition-colors">DNS Directory</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{record.type} Record</span>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-zinc-300 border-border">
              {record.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-200 text-brand-emerald border-border">
              {record.rfc}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {record.type} Record — {record.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {record.summary}
          </p>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">RECORD TYPE</span>
          <p className="text-2xl font-bold font-mono text-brand-emerald mt-1">{record.type}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">STANDARD RFC</span>
          <p className="text-base font-bold font-mono text-zinc-100 mt-2 truncate">{record.rfc}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">DEFAULT TTL</span>
          <p className="text-sm font-bold font-mono text-zinc-200 mt-2 truncate">{record.defaultTtl}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">CATEGORY</span>
          <p className="text-xs font-bold font-mono text-zinc-200 mt-2 truncate">{record.category}</p>
        </div>
      </div>

      {/* Zone File Syntax Example */}
      <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-brand-emerald" />
            <h2 className="text-sm font-bold text-white">BIND Zone File Syntax Example</h2>
          </div>
          <CopyButton text={record.zoneExample} />
        </div>
        <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
          <code>{record.zoneExample}</code>
        </div>
      </div>

      {/* Terminal Lookup Commands */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-emerald" />
          <span>How to Query & Check {record.type} Records</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-surface-100 border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300">Linux / Mac (dig)</span>
              <CopyButton text={record.terminalDig} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-2.5 font-mono text-xs text-emerald-400 truncate">
              <code>{record.terminalDig}</code>
            </div>
          </div>

          <div className="bg-surface-100 border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300">Windows / Generic (nslookup)</span>
              <CopyButton text={record.terminalNslookup} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-2.5 font-mono text-xs text-sky-400 truncate">
              <code>{record.terminalNslookup}</code>
            </div>
          </div>

          <div className="bg-surface-100 border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300">PowerShell (Resolve-DnsName)</span>
              <CopyButton text={record.powershellCommand} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-2.5 font-mono text-xs text-amber-300 truncate">
              <code>{record.powershellCommand}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices & Common Pitfalls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Recommended Best Practices</h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {record.configurationAdvice}
          </p>
          <div className="pt-2 border-t border-border/40 space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-400 font-bold block">Primary Use Cases:</span>
            <ul className="space-y-1 text-xs text-zinc-400">
              {record.commonUseCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-brand-emerald">&bull;</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Common Configuration Mistake</h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {record.commonMistakes}
          </p>
          <div className="bg-black/40 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300/90 leading-relaxed mt-2">
            Always verify records using authoritative queries (`dig @1.1.1.1 ${record.type} example.com`) to bypass local ISP caching when debugging propagation delays.
          </div>
        </div>
      </div>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        title={`DNS ${record.type} Record Questions & Answers`}
        subtitle="Common questions regarding DNS propagation, TTL settings, and zone file syntax."
      />

      {/* Related DNS Records */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Explore Other DNS Record Types</h2>
          <Link href="/dns/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>View All DNS Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherRecords.map((r) => (
            <Link
              key={r.slug}
              href={`/dns/${r.slug}/`}
              className="group p-3 rounded-lg border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors"
            >
              <span className="text-sm font-bold font-mono text-brand-emerald group-hover:text-emerald-300 block">
                {r.type} Record
              </span>
              <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                {r.name.split('(')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
