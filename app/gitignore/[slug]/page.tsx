import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllGitignoreTemplates,
  getGitignoreTemplateBySlug,
  GITIGNORE_TEMPLATES,
} from '@/lib/gitignore-data';
import { GitignoreViewer } from '@/components/gitignore/GitignoreViewer';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, FileCode, GitBranch } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const templates = getAllGitignoreTemplates();
  return templates.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const template = getGitignoreTemplateBySlug(params.slug);
  if (!template) return { title: '.gitignore Template' };

  const title = `${template.name} | DevTransform`;
  const description = `${template.summary} Copy-paste ready .gitignore rules, rule explanations, and Git cache purging commands.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/gitignore/${template.slug}/`;

  return {
    title,
    description,
    keywords: [
      template.name.toLowerCase(),
      `${template.shortName.toLowerCase()} gitignore`,
      'gitignore template',
      'what to ignore in git',
      'git untrack files',
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

export default function GitignoreTemplatePage({ params }: PageProps) {
  const template = getGitignoreTemplateBySlug(params.slug);
  if (!template) notFound();

  const relatedTemplates = GITIGNORE_TEMPLATES.filter((t) => t.slug !== template.slug).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: template.name,
    description: template.description,
    author: {
      '@type': 'Organization',
      name: 'DevTransform Hub',
    },
    articleSection: template.category,
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
          <Link href="/gitignore/directory/" className="hover:text-white transition">
            .gitignore Directory
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400 font-medium">{template.shortName}</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Git &bull; {template.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {template.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            {template.description}
          </p>
        </div>

        {/* Interactive Viewer */}
        <GitignoreViewer template={template} />

        {/* FAQs */}
        {template.faqs && template.faqs.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">
              Frequently Asked Questions About {template.shortName} .gitignore
            </h2>
            <FaqAccordion faqs={template.faqs} />
          </div>
        )}

        {/* Related Templates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Related .gitignore Templates
            </h2>
            <Link
              href="/gitignore/directory/"
              className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-medium"
            >
              <span>View All Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedTemplates.map((t) => (
              <Link
                key={t.slug}
                href={`/gitignore/${t.slug}/`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 block mb-1">
                    {t.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition line-clamp-2">
                    {t.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">{t.content.split('\n').length} lines</span>
                  <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                    Template &rarr;
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
