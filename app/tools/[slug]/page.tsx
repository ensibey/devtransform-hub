import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY, getToolBySlug, getToolsByCategory } from '@/lib/registry';
import { ToolLayout } from '@/components/shared/ToolLayout';
import { ShieldCheck, Zap, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: 'Tool Not Found | ZeroUpload',
    };
  }

  // Click-Through-Rate (CTR) Optimized Title & Meta Description Formula
  const title = `${tool.title} - Fast, Client-Side & Free | ZeroUpload`;
  const description = `${tool.shortDesc} Execute instantly in your browser with zero server uploads, 100% privacy, and offline PWA support.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/tools/${tool.slug}/`;

  return {
    title,
    description,
    keywords: [
      ...tool.keywords,
      'client side tool',
      'zero upload',
      'offline developer tool',
      'free online tool',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload — Developer & Utility Suite',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;
  const relatedTools = getToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug);

  // Dynamic FAQPage Structured Data Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How does ${tool.title} work?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool.title} executes 100% client-side inside your browser sandbox using modern JavaScript and Web Workers. Your data, code, or files are never uploaded to any remote server or cloud database.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${tool.title} free and secure?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ZeroUpload is completely free to use with zero limitations. Because all computation happens locally on your device, sensitive passwords, API keys, and corporate schemas remain strictly confidential.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use ${tool.title} offline?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! ZeroUpload is built as a Progressive Web App (PWA). You can install it on Windows, macOS, Linux, iOS, or Android and use ${tool.title} without an active internet connection.`,
        },
      },
    ],
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <ToolLayout tool={tool} relatedTools={relatedTools}>
        <ToolComponent />

        {/* 150-200 Word In-Depth Guide & SEO Explanation */}
        <section className="mt-8 pt-8 border-t border-border space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-emerald" />
              <span>How {tool.title} Works & Key Use Cases</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-4xl">
              {tool.title} provides software engineers, designers, and daily users with an instantaneous, in-browser solution. 
              Traditional online converters send your private payloads over public networks, creating potential compliance and data leakage risks. 
              With ZeroUpload, every transformation is executed locally in your browser memory via dedicated background Web Workers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Server Logs</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Zero uploads, zero telemetry, and zero remote logging. Sensitive credentials remain local to your CPU.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Sub-Millisecond Speed</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Eliminates network latency. Computations happen at native browser speeds without cloud queue delays.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Offline PWA Ready</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Installable as a desktop or mobile application. Works seamlessly on airplanes, trains, or offline.
              </p>
            </div>
          </div>
        </section>
      </ToolLayout>
    </>
  );
}
