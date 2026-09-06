import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllSystemdRecipes,
  getSystemdRecipeBySlug,
  SYSTEMD_RECIPES,
} from '@/lib/systemd-recipes-data';
import { SystemdUnitBuilder } from '@/components/systemd/SystemdUnitBuilder';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, Server, FileCode } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const recipes = getAllSystemdRecipes();
  return recipes.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = getSystemdRecipeBySlug(params.slug);
  if (!recipe) return { title: 'Systemd Service Recipe' };

  const title = `${recipe.title} | DevTransform`;
  const description = `${recipe.summary} Includes copyable .service unit file, auto-restart on crash, non-root user setup, and journalctl log streaming.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/systemd/${recipe.slug}/`;

  return {
    title,
    description,
    keywords: [
      recipe.title.toLowerCase(),
      `systemd ${recipe.shortTitle.toLowerCase()}`,
      'systemd service generator',
      'systemctl daemon reload',
      'linux service auto restart',
      'journalctl logs',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function SystemdRecipePage({ params }: PageProps) {
  const recipe = getSystemdRecipeBySlug(params.slug);
  if (!recipe) notFound();

  const relatedRecipes = SYSTEMD_RECIPES.filter((r) => r.slug !== recipe.slug).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: recipe.title,
    description: recipe.description,
    author: {
      '@type': 'Organization',
      name: 'DevTransform Hub',
    },
    articleSection: recipe.category,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/systemd/directory/" className="hover:text-white transition">
            Systemd Directory
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-400 font-medium">{recipe.shortTitle}</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Server className="w-3.5 h-3.5" />
            <span>Linux &bull; {recipe.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {recipe.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            {recipe.description}
          </p>
        </div>

        {/* Interactive Unit Builder */}
        <SystemdUnitBuilder recipe={recipe} />

        {/* FAQs */}
        {recipe.faqs && recipe.faqs.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">
              Frequently Asked Questions About {recipe.shortTitle}
            </h2>
            <FaqAccordion faqs={recipe.faqs} />
          </div>
        )}

        {/* Related Systemd Guides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Related Linux &amp; Systemd Services
            </h2>
            <Link
              href="/systemd/directory/"
              className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedRecipes.map((r) => (
              <Link
                key={r.slug}
                href={`/systemd/${r.slug}/`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-indigo-400 block mb-1">
                    {r.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition line-clamp-2">
                    {r.title}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">{r.unitFileName}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                    Guide &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
