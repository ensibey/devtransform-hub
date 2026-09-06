import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPorts, getPortBySlug, PORTS_DATA } from '@/lib/ports-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Terminal,
  Server,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Cpu,
  Layers,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const ports = getAllPorts();
  return ports.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) return { title: 'Port Details' };

  const title = `Port ${port.port} (${port.service}): Check, Kill & Security Guide | DevTransform`;
  const description = `Everything about Port ${port.port} (${port.service}). How to check if port ${port.port} is open, kill process on ${port.port} (Linux/Mac/Windows), firewall rules, and security risks.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/port/${port.slug}/`;

  return {
    title,
    description,
    keywords: [
      `port ${port.port}`,
      `what is port ${port.port}`,
      `port ${port.port} service`,
      `kill process on port ${port.port}`,
      `check port ${port.port}`,
      `port ${port.port} linux windows`,
      `port ${port.port} already in use`,
      port.service.toLowerCase(),
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

export default function PortDetailPage({ params }: PageProps) {
  const port = getPortBySlug(params.slug);
  if (!port) notFound();

  const isHighRisk = port.riskLevel === 'Critical' || port.riskLevel === 'High';
  const riskBadgeColor =
    port.riskLevel === 'Critical'
      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
      : port.riskLevel === 'High'
      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      : port.riskLevel === 'Medium'
      ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

  const otherPorts = PORTS_DATA.filter((p) => p.slug !== port.slug).slice(0, 6);

  const faqs = [
    {
      question: `What is Port ${port.port} used for?`,
      answer: `Port ${port.port} is commonly used for ${port.service}. ${port.description}`,
    },
    {
      question: `How do I kill the process using port ${port.port}?`,
      answer: `On macOS & Linux, run: "${port.killCommandLinux}". On Windows PowerShell (as Admin), run: "${port.killCommandWin}".`,
    },
    {
      question: `Why am I getting "port ${port.port} already in use" (EADDRINUSE)?`,
      answer: `This occurs when another background instance of ${port.defaultProcess} or a zombie process is already bound to port ${port.port}. Use the kill commands above to free the port immediately.`,
    },
    {
      question: `Is Port ${port.port} safe to expose to the public internet?`,
      answer: `Risk level is ${port.riskLevel}. ${port.securityNote}`,
    },
  ];

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `Port ${port.port} (${port.service}) Developer Reference & Troubleshooting Guide`,
    description: port.description,
    url: `https://devtransform-hub.vercel.app/port/${port.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Ports Directory', item: 'https://devtransform-hub.vercel.app/port/directory/' },
      { '@type': 'ListItem', position: 3, name: `Port ${port.port}`, item: `https://devtransform-hub.vercel.app/port/${port.slug}/` },
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
            <Link href="/port/directory/" className="hover:text-zinc-200 transition-colors">Ports Directory</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">Port {port.port}</span>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-zinc-300 border-border">
              {port.category}
            </span>
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${riskBadgeColor}`}>
              {isHighRisk ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Risk: {port.riskLevel}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Port {port.port} — {port.service}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {port.description}
          </p>
        </div>
      </div>

      {/* Primary Quick Spec Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">PORT NUMBER</span>
          <p className="text-2xl font-bold font-mono text-brand-emerald mt-1">{port.port}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">PROTOCOL</span>
          <p className="text-2xl font-bold font-mono text-zinc-100 mt-1">{port.protocol}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">DEFAULT PROCESS</span>
          <p className="text-sm font-bold font-mono text-zinc-200 mt-2 truncate">{port.defaultProcess}</p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-4">
          <span className="text-xs text-zinc-400 font-mono">FIREWALL TARGET</span>
          <p className="text-sm font-bold font-mono text-zinc-200 mt-2 truncate">{port.port}/{port.protocol.toLowerCase()}</p>
        </div>
      </div>

      {/* Terminal Command Center */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-brand-emerald" />
          <h2 className="text-lg font-bold text-white">Instant Terminal Fixes for Port {port.port}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* macOS / Linux Commands */}
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="text-xs font-mono font-bold text-zinc-200">macOS & Linux Terminal</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">1. Check who is listening on port {port.port}:</span>
                <div className="flex items-center justify-between bg-black/60 border border-border/80 rounded-lg px-3 py-2 font-mono text-xs text-emerald-400">
                  <code className="truncate mr-2">{port.checkCommandLinux}</code>
                  <CopyButton text={port.checkCommandLinux} />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">2. Kill process occupying port {port.port} (EADDRINUSE fix):</span>
                <div className="flex items-center justify-between bg-black/60 border border-border/80 rounded-lg px-3 py-2 font-mono text-xs text-amber-400">
                  <code className="truncate mr-2">{port.killCommandLinux}</code>
                  <CopyButton text={port.killCommandLinux} />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">3. UFW Firewall Allow rule:</span>
                <div className="flex items-center justify-between bg-black/60 border border-border/80 rounded-lg px-3 py-2 font-mono text-xs text-zinc-300">
                  <code className="truncate mr-2">{port.firewallUfw}</code>
                  <CopyButton text={port.firewallUfw} />
                </div>
              </div>
            </div>
          </div>

          {/* Windows PowerShell Commands */}
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                <span className="text-xs font-mono font-bold text-zinc-200">Windows PowerShell (Admin)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">1. Check listening port:</span>
                <div className="flex items-center justify-between bg-black/60 border border-border/80 rounded-lg px-3 py-2 font-mono text-xs text-emerald-400">
                  <code className="truncate mr-2">{port.checkCommandWin}</code>
                  <CopyButton text={port.checkCommandWin} />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">2. Force kill process on port {port.port}:</span>
                <div className="flex items-center justify-between bg-black/60 border border-border/80 rounded-lg px-3 py-2 font-mono text-xs text-amber-400">
                  <code className="truncate mr-2">{port.killCommandWin}</code>
                  <CopyButton text={port.killCommandWin} />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">3. Docker Port Forwarding Mapping:</span>
                <div className="flex items-center justify-between bg-black/60 border border-border/80 rounded-lg px-3 py-2 font-mono text-xs text-zinc-300">
                  <code className="truncate mr-2">{port.dockerRun}</code>
                  <CopyButton text={port.dockerRun} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Advisory & Common Error */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Common Error Encountered</h3>
          </div>
          <p className="text-xs text-zinc-400 font-mono bg-black/40 p-2.5 rounded border border-border/50 text-rose-300">
            {port.commonError}
          </p>
        </div>

        <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-sky-400">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Security Advisory & Hardening</h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {port.securityNote}
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <FaqAccordion
        faqs={faqs}
        title={`Port ${port.port} Questions & Answers`}
        subtitle="Common questions regarding default services, kill commands, and firewall configurations."
      />

      {/* Related Developer Ports */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Explore Other Developer Ports</h2>
          <Link href="/port/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>View All Ports Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherPorts.map((item) => (
            <Link
              key={item.slug}
              href={`/port/${item.slug}/`}
              className="group p-3 rounded-lg border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors"
            >
              <span className="text-sm font-bold font-mono text-brand-emerald group-hover:text-emerald-300 block">
                Port {item.port}
              </span>
              <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                {item.service.split('/')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
