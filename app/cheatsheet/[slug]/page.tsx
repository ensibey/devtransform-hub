import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCheatSheets, getCheatSheetBySlug } from '@/lib/cheatsheet-matrix';
import { CopyButton } from '@/components/shared/CopyButton';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { Terminal, Sparkles, ChevronRight, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const cheatsheets = getAllCheatSheets();
  return cheatsheets.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sheet = getCheatSheetBySlug(params.slug);
  if (!sheet) return {};

  const title = `${sheet.title} - Quick Reference & Commands | ZeroUpload`;
  const description = `${sheet.description} 1-click copyable terminal commands, explanations, and expert tips.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/cheatsheet/${sheet.slug}/`;

  return {
    title,
    description,
    keywords: [
      sheet.title.toLowerCase(),
      `${sheet.category} cheat sheet`,
      'developer cheat sheet',
      'terminal commands',
      'quick reference guide',
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

export default function CheatSheetPage({ params }: Props) {
  const sheet = getCheatSheetBySlug(params.slug);
  if (!sheet) notFound();

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sheet.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: sheet.title,
    description: sheet.description,
    url: `https://devtransform-hub.vercel.app/cheatsheet/${sheet.slug}/`,
    inLanguage: 'en-US',
  };

  return (
    <div className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />

      {/* Breadcrumb & Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-400">Cheat Sheets</span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">{sheet.title}</span>
        </div>
        <PrivacyBadge />
      </div>

      {/* Main Heading */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 uppercase font-bold">
            {sheet.category}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {sheet.title}
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          {sheet.description}
        </p>
      </div>

      {/* Sections & Commands Grid */}
      <div className="space-y-8">
        {sheet.sections.map((sec, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
              <Terminal className="w-4 h-4 text-brand-emerald" />
              <span>{sec.title}</span>
            </h2>

            <div className="grid grid-cols-1 gap-3 font-mono text-xs">
              {sec.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-zinc-400 text-[11px] block">{item.description}</span>
                    <span className="text-white font-bold text-xs select-all text-emerald-400">
                      {item.command}
                    </span>
                  </div>
                  <CopyButton text={item.command} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      {sheet.faqs.length > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {sheet.faqs.map((faq, fIdx) => (
              <div key={fIdx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="font-bold text-white block">• {faq.question}</span>
                <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
