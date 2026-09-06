import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllCurlTargets,
  getCurlTargetBySlug,
  CURL_TARGETS,
} from '@/lib/curl-targets-data';
import { CurlWorkspace } from '@/components/curl/CurlWorkspace';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const targets = getAllCurlTargets();
  return targets.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const target = getCurlTargetBySlug(params.slug);
  if (!target) return { title: 'cURL Converter' };

  const title = `Convert cURL to ${target.name} (${target.library}) Online | DevTransform`;
  const description = `Instantly convert cURL commands into clean, idiomatic ${target.name} code (${target.library}). 100% free, runs client-side in your browser with zero data upload.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/curl-to/${target.slug}/`;

  return {
    title,
    description,
    keywords: [
      `curl to ${target.language.toLowerCase()}`,
      `curl to ${target.library.toLowerCase()}`,
      `convert curl to ${target.name.toLowerCase()}`,
      `curl command generator ${target.language.toLowerCase()}`,
      'curl parser',
      'api request code generator',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function CurlToTargetPage({ params }: PageProps) {
  const target = getCurlTargetBySlug(params.slug);
  if (!target) notFound();

  const otherTargets = CURL_TARGETS.filter((t) => t.slug !== target.slug);

  const faqs = [
    {
      question: `How do I convert a cURL command into ${target.language} (${target.library})?`,
      answer: `Paste your cURL command into the input box above. DevTransform parses headers (-H), request method (-X), URL parameters, and JSON payloads (-d) entirely client-side in your browser and outputs native ${target.language} code in 0 milliseconds.`,
    },
    {
      question: `Does my sensitive API token or Bearer key leave my browser?`,
      answer: `No! DevTransform runs 100% client-side with zero backend server uploads. You can inspect the Network tab or run this tool completely offline as a PWA.`,
    },
    {
      question: `How do I handle JSON responses in ${target.language}?`,
      answer: `The generated code snippet already includes response extraction and error handling tailored for ${target.library}.`,
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/curl-to/directory/" className="hover:text-zinc-200 transition-colors">cURL Converters</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{target.name}</span>
          </nav>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-brand-emerald border-border">
            Library: {target.library}
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Convert cURL to {target.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {target.description}
          </p>
        </div>
      </div>

      {/* Interactive Converter Workspace */}
      <CurlWorkspace targetSlug={target.slug} />

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        title={`cURL to ${target.name} Questions & Answers`}
        subtitle="Common questions regarding API payload conversion, header extraction, and client-side privacy."
      />

      {/* Related Language Targets */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Convert cURL to Other Languages</h2>
          <Link href="/curl-to/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>View All cURL Converters</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherTargets.slice(0, 6).map((t) => (
            <Link
              key={t.slug}
              href={`/curl-to/${t.slug}/`}
              className="group p-3 rounded-lg border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors"
            >
              <span className="text-xs font-bold font-mono text-brand-emerald group-hover:text-emerald-300 block">
                {t.language}
              </span>
              <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                {t.library}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
