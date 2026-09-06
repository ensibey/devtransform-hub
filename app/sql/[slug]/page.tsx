import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllSqlRecipes,
  getSqlRecipeBySlug,
  SQL_RECIPES,
} from '@/lib/sql-recipes-data';
import { SqlCommandBuilder } from '@/components/sql/SqlCommandBuilder';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, Database } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const recipes = getAllSqlRecipes();
  return recipes.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = getSqlRecipeBySlug(params.slug);
  if (!recipe) return { title: 'SQL Query Recipe' };

  const title = `${recipe.title} (${recipe.dialect}) | DevTransform`;
  const description = `${recipe.summary} Includes copyable SQL queries, execution steps, dialect comparisons, and performance tips.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/sql/${recipe.slug}/`;

  return {
    title,
    description,
    keywords: [
      recipe.title.toLowerCase(),
      `sql ${recipe.shortTitle.toLowerCase()}`,
      `${recipe.dialect.toLowerCase()} ${recipe.shortTitle.toLowerCase()}`,
      'sql query example',
      'database tutorial',
      'sql query optimization',
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

export default function SqlRecipePage({ params }: PageProps) {
  const recipe = getSqlRecipeBySlug(params.slug);
  if (!recipe) notFound();

  const otherRecipes = SQL_RECIPES.filter((r) => r.slug !== recipe.slug);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/sql/directory/" className="hover:text-zinc-200 transition-colors">SQL Recipes</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">{recipe.shortTitle}</span>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-surface-100 text-brand-emerald border-border">
              {recipe.dialect}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-200 text-zinc-400 border border-border">
              {recipe.category}
            </span>
          </div>
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
      <SqlCommandBuilder recipe={recipe} />

      {/* FAQs */}
      <FaqAccordion
        faqs={recipe.faqs}
        title={`${recipe.shortTitle} - Frequently Asked Questions`}
        subtitle="Common questions about transactional safety, indexing, and engine compatibility."
      />

      {/* Related SQL Recipes */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Related SQL Query Guides</h2>
          <Link href="/sql/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>Browse All SQL Recipes</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherRecipes.slice(0, 6).map((r) => (
            <Link
              key={r.slug}
              href={`/sql/${r.slug}/`}
              className="group p-4 rounded-xl border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-emerald uppercase">
                  {r.dialect}
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
