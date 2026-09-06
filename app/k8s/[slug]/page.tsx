import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllK8sRecipes,
  getK8sRecipeBySlug,
  K8S_RECIPES,
} from '@/lib/k8s-recipes-data';
import { K8sCommandBuilder } from '@/components/k8s/K8sCommandBuilder';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, Layers, Box } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const recipes = getAllK8sRecipes();
  return recipes.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = getK8sRecipeBySlug(params.slug);
  if (!recipe) return { title: 'Kubernetes kubectl Recipe' };

  const title = `${recipe.title} | DevTransform`;
  const description = `${recipe.summary} Includes copyable kubectl command, interactive flags, step-by-step workflow, and troubleshooting tips.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/k8s/${recipe.slug}/`;

  return {
    title,
    description,
    keywords: [
      recipe.title.toLowerCase(),
      `kubectl ${recipe.shortTitle.toLowerCase()}`,
      'kubernetes kubectl command',
      'k8s tutorial',
      'devops commands',
      'kubernetes troubleshooting',
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

export default function K8sRecipePage({ params }: PageProps) {
  const recipe = getK8sRecipeBySlug(params.slug);
  if (!recipe) notFound();

  // Related recipes
  const relatedRecipes = K8S_RECIPES.filter((r) => r.slug !== recipe.slug).slice(0, 6);

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
          <Link href="/k8s/directory/" className="hover:text-white transition">
            Kubernetes Directory
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-sky-400 font-medium">{recipe.shortTitle}</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Box className="w-3.5 h-3.5" />
            <span>Kubernetes &bull; {recipe.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {recipe.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            {recipe.description}
          </p>
        </div>

        {/* Interactive Command Workspace */}
        <K8sCommandBuilder recipe={recipe} />

        {/* Prerequisites */}
        {recipe.prerequisites && recipe.prerequisites.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Prerequisites &amp; Cluster Access
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {recipe.prerequisites.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {recipe.faqs && recipe.faqs.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">
              Frequently Asked Questions About {recipe.shortTitle}
            </h2>
            <FaqAccordion faqs={recipe.faqs} />
          </div>
        )}

        {/* Related Kubernetes Guides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Related Kubernetes &amp; DevOps Recipes
            </h2>
            <Link
              href="/k8s/directory/"
              className="text-xs text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium"
            >
              <span>View All Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedRecipes.map((r) => (
              <Link
                key={r.slug}
                href={`/k8s/${r.slug}/`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-sky-400 block mb-1">
                    {r.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-sky-400 transition line-clamp-2">
                    {r.title}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono truncate max-w-[160px] text-slate-500">{r.command.split(' ')[1]}</span>
                  <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
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
