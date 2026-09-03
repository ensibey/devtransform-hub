import React from 'react';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY, getToolBySlug } from '@/lib/registry';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ExternalLink } from 'lucide-react';

interface EmbedPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function EmbedToolPage({ params }: EmbedPageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const ToolComponent = tool.component;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-3 sm:p-4 flex flex-col justify-between font-sans">
      <div className="space-y-3">
        {/* Minimalist Embed Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <BrandLogo size={22} showText={false} />
            <span className="text-xs font-bold font-mono text-white tracking-tight">
              {tool.title}
            </span>
          </div>

          <Link
            href={`/tools/${tool.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[11px] font-mono text-brand-emerald hover:underline"
          >
            <span>Open in Fullscreen</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Embedded Interactive Tool */}
        <div className="pt-2">
          <ToolComponent />
        </div>
      </div>

      {/* Powered by ZeroUpload Backlink Footer */}
      <div className="mt-4 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <Link
          href="https://devtransform-hub.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-300 transition-colors flex items-center space-x-1"
        >
          <span>⚡ Powered by</span>
          <span className="text-brand-emerald font-bold">ZeroUpload</span>
        </Link>
        <span>100% Client-Side • Zero Data Stored</span>
      </div>
    </div>
  );
}
