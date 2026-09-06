import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllDockerRecipes,
  getDockerRecipeBySlug,
  DOCKER_RECIPES,
} from '@/lib/docker-recipes-data';
import { DockerCommandBuilder } from '@/components/docker/DockerCommandBuilder';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, Box } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const recipes = getAllDockerRecipes();
  return recipes.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = getDockerRecipeBySlug(params.slug);
  if (!recipe) return { title: 'Docker Recipe' };

  const title = `${recipe.title} | DevTransform`;
  const description = `${recipe.summary} Includes copyable terminal commands, flag options, step-by-step instructions, and common pitfalls.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/docker/${recipe.slug}/`;

  return {
    title,
    description,
    keywords: [
      recipe.title.toLowerCase(),
      `docker ${recipe.shortTitle.toLowerCase()}`,
      'docker command guide',
      'docker terminal cheat sheet',
      'docker container solutions',
      'dockerfile best practices',
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

export default function DockerRecipePage({ params }: PageProps) {
  const recipe = getDockerRecipeBySlug(params.slug);
  if (!recipe) notFound();

  const otherRecipes = DOCKER_RECIPES.filter((r) => r.slug !== recipe.slug);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/docker/directory/" className="hover:text-zinc-200 transition-colors">Docker Recipes</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{recipe.shortTitle}</span>
          </nav>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-brand-emerald border-border">
            {recipe.category}
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {recipe.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {recipe.summary}
          </p>
        </div>
      </div>

      {/* Interactive Command & Step Guide */}
      <DockerCommandBuilder recipe={recipe} />

      {/* FAQs */}
      <FaqAccordion
        faqs={recipe.faqs}
        title={`${recipe.shortTitle} - Frequently Asked Questions`}
        subtitle="Common questions about container isolation, signal handling, and runtime behavior."
      />

      {/* Related Docker Recipes */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Related Docker Command Guides</h2>
          <Link href="/docker/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>Browse All Docker Recipes</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherRecipes.slice(0, 6).map((r) => (
            <Link
              key={r.slug}
              href={`/docker/${r.slug}/`}
              className="group p-4 rounded-xl border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-emerald uppercase">
                  {r.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {r.riskLevel}
                </span>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 block">
                {r.title}
              </span>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {r.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
