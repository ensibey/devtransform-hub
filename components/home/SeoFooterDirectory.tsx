import React from 'react';
import Link from 'next/link';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_REGISTRY } from '@/lib/registry';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ArrowRight, Code2, Layers, Sparkles } from 'lucide-react';

const HOMEPAGE_FAQS = [
  {
    question: 'How is ZeroUpload completely free with zero server costs?',
    answer: 'ZeroUpload is engineered as a static export Next.js web application deployed to Cloudflare Pages edge global CDN. All code transformations, parsing, and type synthesis execute 100% inside your browser using client-side Web Workers and WebAssembly. Because no computation or storage occurs on backend servers, infrastructure costs are $0.',
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
    question: 'Can I use ZeroUpload offline as a Progressive Web App (PWA)?',
    answer: 'Yes! ZeroUpload includes an offline Service Worker that caches static assets. Once loaded, all 100+ utilities and matrix converters function seamlessly even without an active internet connection.',
  },
];

export function SeoFooterDirectory() {
  const allPairs = getAllMatrixPairs();
  const topConverters = allPairs.slice(0, 16);
  const devTools = TOOLS_REGISTRY.filter((t) => t.category === 'dev' || t.category === 'text').slice(0, 8);
  const mediaTools = TOOLS_REGISTRY.filter((t) => t.category === 'pdf' || t.category === 'image' || t.category === 'calculator').slice(0, 8);

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
          <span>Full Tool & Converter Directory</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Explore 100+ Free In-Browser Developer Utilities
        </h2>
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
