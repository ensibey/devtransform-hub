import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY, getToolBySlug, getToolsByCategory } from '@/lib/registry';
import { ToolLayout } from '@/components/shared/ToolLayout';

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
      title: 'Tool Not Found',
    };
  }

  const title = `${tool.title} - Free Online Client-Side Utility`;
  const description = tool.seoDescription;
  const canonicalUrl = `https://devtransform.pages.dev/tools/${tool.slug}/`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform Super Utility Hub',
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

  return (
    <ToolLayout tool={tool} relatedTools={relatedTools}>
      <ToolComponent />
    </ToolLayout>
  );
}
