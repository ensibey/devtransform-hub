import React from 'react';
import Link from 'next/link';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_METADATA } from '@/lib/tools-metadata';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ArrowRight, Code2, Layers, Sparkles } from 'lucide-react';

const HOMEPAGE_FAQS = [
  {
    question: 'How is DevTransform completely free with zero server costs?',
    answer: 'DevTransform is engineered as a high-performance Next.js application deployed to edge global CDN. All code transformations, parsing, and calculations execute 100% inside your browser using client-side Web Workers and WebAssembly. Because no computation or storage occurs on backend servers, privacy is total and infrastructure costs are $0.',
  },
  {
    question: 'Is it safe to paste enterprise production code, API keys, or JWT tokens?',
    answer: 'Yes, 100%. Your payloads never leave your computer. You can disconnect your internet connection or inspect the Network tab in your browser developer tools to verify that 0 bytes are transmitted over the wire.',
  },
  {
    question: 'How does URL state sharing work without storing data in a database?',
    answer: 'When you click "Share", your state is compressed using the LZ-String algorithm and stored exclusively in the URL hash fragment (#data=...). Web browsers never send hash fragments to web servers in HTTP requests, keeping your shared snippets completely private.',
  },
  {
    question: 'Can I use DevTransform offline as a Progressive Web App (PWA)?',
    answer: 'Yes! DevTransform includes an offline Service Worker that caches static assets. Once loaded, all 140+ utilities and matrix converters function seamlessly even without an active internet connection.',
  },
];

export function SeoFooterDirectory() {
  const allPairs = getAllMatrixPairs();
  const topConverters = allPairs.slice(0, 16);
  const devTools = TOOLS_METADATA.filter((t) => t.category === 'dev' || t.category === 'text').slice(0, 8);
  const mediaTools = TOOLS_METADATA.filter((t) => t.category === 'pdf' || t.category === 'image' || t.category === 'calculator').slice(0, 8);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-16 sm:mt-24 border-t border-zinc-800/80 pt-12 space-y-12 text-zinc-300">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Semantic Directory Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-brand-emerald">
          <Layers className="w-3.5 h-3.5" />
          <span>Full Tool & Programmatic Directory</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Explore 7,600+ Free In-Browser Developer Utilities & Calculations
        </h2>
      </div>

      {/* 6 Master Directory Index Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/timezone/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-zinc-900/60 border border-emerald-500/30 hover:border-emerald-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">World Timezones</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            75 global metropolises, 5,500+ corridors, IATA airport codes, live clocks & meeting planners.
          </p>
          <span className="text-[11px] font-mono text-emerald-500 font-semibold">Browse 5,500+ Corridors &rarr;</span>
        </Link>

        <Link
          href="/port/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-zinc-900/60 border border-amber-500/30 hover:border-amber-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Developer Ports</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            70+ ports (Node, React, Postgres, Redis, Docker), terminal kill commands & security advisories.
          </p>
          <span className="text-[11px] font-mono text-amber-500 font-semibold">Browse 70+ Ports &rarr;</span>
        </Link>

        <Link
          href="/mime/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-violet-950/30 to-zinc-900/60 border border-violet-500/30 hover:border-violet-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">MIME Types & Headers</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            60+ web MIME types, file extensions, Content-Type headers, and NGINX/Apache configs.
          </p>
          <span className="text-[11px] font-mono text-violet-500 font-semibold">Browse 60+ MIME Types &rarr;</span>
        </Link>

        <Link
          href="/chmod/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-zinc-900/60 border border-rose-500/30 hover:border-rose-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">chmod Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            Interactive rwx permission breakdown (755, 644, 600, 777), recursive commands & security ratings.
          </p>
          <span className="text-[11px] font-mono text-rose-500 font-semibold">Browse chmod Matrix &rarr;</span>
        </Link>

        <Link
          href="/percentage/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-sky-950/30 to-zinc-900/60 border border-sky-500/30 hover:border-sky-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Percentages</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            1,100+ solved math problems with copyable Excel formulas, tax & discount tables.
          </p>
          <span className="text-[11px] font-mono text-sky-500 font-semibold">Browse 1,100+ Formulas &rarr;</span>
        </Link>

        <Link
          href="/convert/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-zinc-900/60 border border-indigo-500/30 hover:border-indigo-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Unit Converters</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            350+ precision measurement converters across length, mass, data storage, speed, and volume.
          </p>
          <span className="text-[11px] font-mono text-indigo-500 font-semibold">Browse 350+ Converters &rarr;</span>
        </Link>

        <Link
          href="/html-entity/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-teal-950/30 to-zinc-900/60 border border-teal-500/30 hover:border-teal-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">HTML Entities</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            50+ HTML entities (&amp;copy;, &amp;nbsp;, &amp;trade;), decimal, hex, CSS \XXXX &amp; JS unicode escapes.
          </p>
          <span className="text-[11px] font-mono text-teal-500 font-semibold">Browse 50+ Entities &rarr;</span>
        </Link>

        <Link
          href="/dns/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-sky-950/30 to-zinc-900/60 border border-sky-500/30 hover:border-sky-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">DNS Records</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            15+ DNS record types (A, CNAME, MX, TXT, SPF, DKIM, DMARC), zone file syntax &amp; dig commands.
          </p>
          <span className="text-[11px] font-mono text-sky-500 font-semibold">Browse DNS Directory &rarr;</span>
        </Link>

        <Link
          href="/curl-to/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-zinc-900/60 border border-amber-500/30 hover:border-amber-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">cURL to Code</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            Convert cURL commands to Python, JavaScript fetch, Axios, Go, Rust, PHP, C#, Java &amp; PowerShell.
          </p>
          <span className="text-[11px] font-mono text-amber-500 font-semibold">Browse 10+ Converters &rarr;</span>
        </Link>

        <Link
          href="/git/directory/"
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-zinc-900/60 border border-emerald-500/30 hover:border-emerald-500/60 transition-all group flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Git Recipes</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-zinc-400">
            Instant terminal solutions: undo commits, discard changes, stash files, resolve conflicts &amp; reflog.
          </p>
          <span className="text-[11px] font-mono text-emerald-500 font-semibold">Browse 15+ Git Recipes &rarr;</span>
        </Link>
      </div>

      {/* 3-Column Internal Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Top Converters */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-200 uppercase">
            <Code2 className="w-4 h-4 text-brand-emerald" />
            <span>Popular Type Converters</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {topConverters.map((pair) => (
              <Link
                key={pair.slug}
                href={`/${pair.slug}/`}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-between py-1 px-2 rounded-lg hover:bg-zinc-800/60 transition-colors group"
              >
                <span>{pair.fromMeta.shortName} to {pair.toMeta.shortName}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Developer & Security */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-200 uppercase">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Security & Web Utilities</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {devTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-between py-1 px-2 rounded-lg hover:bg-zinc-800/60 transition-colors group"
              >
                <span className="truncate pr-2">{tool.title}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Media & Calculators */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-200 uppercase">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>PDF, Image & Media</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {mediaTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-between py-1 px-2 rounded-lg hover:bg-zinc-800/60 transition-colors group"
              >
                <span className="truncate pr-2">{tool.title}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Homepage FAQ Section */}
      <FaqAccordion
        faqs={HOMEPAGE_FAQS}
        fromName="ZeroUpload"
        toName="Local Browser Engine"
      />
    </section>
  );
}
