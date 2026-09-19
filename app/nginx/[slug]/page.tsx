import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NGINX_RECIPES, getNginxRecipeBySlug } from '@/lib/nginx-recipes-data';
import { NginxConfigBuilder } from '@/components/nginx/NginxConfigBuilder';
import { ChevronRight, ArrowRight, Server, FileCode, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return NGINX_RECIPES.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = getNginxRecipeBySlug(params.slug);
  if (!recipe) return { title: 'Nginx Recipe' };

  const title = `${recipe.title} | DevTransform`;
  const description = `${recipe.summary} Includes copyable nginx.conf server block, syntax testing commands, and zero-downtime reload instructions.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/nginx/${recipe.slug}/`;

  return {
    title,
    description,
    keywords: [
      recipe.title.toLowerCase(),
      `nginx ${recipe.shortTitle.toLowerCase()}`,
      'nginx config generator',
      'nginx reverse proxy',
      'nginx reload zero downtime',
      'nginx ssl https configuration',
      'nginx server block',
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

export default function NginxRecipePage({ params }: PageProps) {
  const recipe = getNginxRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

  // Related recipes in the same or adjacent category
  const relatedRecipes = NGINX_RECIPES.filter((r) => r.slug !== recipe.slug).slice(0, 4);

  // Structured Data (TechArticle + FAQPage + BreadcrumbList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: recipe.title,
        description: recipe.summary,
        url: `https://devtransform-hub.vercel.app/nginx/${recipe.slug}/`,
        articleSection: recipe.category,
        keywords: [recipe.shortTitle, 'Nginx', 'DevOps', 'Reverse Proxy', 'Web Server'],
        author: {
          '@type': 'Organization',
          name: 'DevTransform',
          url: 'https://devtransform-hub.vercel.app',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: recipe.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://devtransform-hub.vercel.app',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Nginx Directory',
            item: 'https://devtransform-hub.vercel.app/nginx/directory/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: recipe.shortTitle,
            item: `https://devtransform-hub.vercel.app/nginx/${recipe.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/nginx/directory/" className="hover:text-foreground transition-colors">
            Nginx Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-xs">{recipe.shortTitle}</span>
        </nav>

        {/* Header Title & Summary */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
              {recipe.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <FileCode className="w-3.5 h-3.5" />
              {recipe.configFileName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {recipe.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Interactive Nginx Config Builder */}
        <NginxConfigBuilder recipe={recipe} />

        {/* Related Nginx Recipes */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            Related Nginx Configuration Recipes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedRecipes.map((rel) => (
              <Link
                key={rel.slug}
                href={`/nginx/${rel.slug}`}
                className="group p-4 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/70 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400">
                      {rel.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {rel.configFileName}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                    {rel.title}
                  </h3>
                </div>

                <div className="pt-3 flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-emerald-400">
                  <span>View Configuration</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
