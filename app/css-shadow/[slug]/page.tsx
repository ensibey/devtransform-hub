import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllShadowPresets, getShadowPreset } from '@/lib/shadow-matrix';
import { CopyButton } from '@/components/shared/CopyButton';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { Box, Sparkles, ChevronRight, Layers } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const presets = getAllShadowPresets();
  return presets.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shadow = getShadowPreset(params.slug);
  if (!shadow) return {};

  return {
    title: `${shadow.title} - CSS Box Shadow & Tailwind Preset`,
    description: `${shadow.description} Includes live interactive preview canvas, standard CSS snippet, and Tailwind CSS class.`,
    keywords: [
      shadow.title.toLowerCase(),
      'css box shadow',
      'box shadow generator',
      'tailwind shadow',
      shadow.category,
    ],
    openGraph: {
      title: `${shadow.title} | ZeroUpload`,
      description: shadow.description,
      url: `https://devtransform-hub.vercel.app/css-shadow/${shadow.slug}/`,
      type: 'website',
    },
  };
}

export default function ShadowPage({ params }: Props) {
  const shadow = getShadowPreset(params.slug);
  if (!shadow) notFound();

  // Extract raw shadow value from 'box-shadow: ...;'
  const rawShadow = shadow.cssValue.replace(/^box-shadow:\s*/, '').replace(/;$/, '');

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumb & Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-400">CSS Shadows</span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">{shadow.title}</span>
        </div>
        <PrivacyBadge />
      </div>

      {/* Main Heading */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 uppercase font-bold">
            {shadow.category}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {shadow.title}
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          {shadow.description}
        </p>
      </div>

      {/* Live Preview Canvas: Dark & Light Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dark Canvas */}
        <div className="p-8 rounded-2xl bg-[#09090b] border border-zinc-800 flex flex-col items-center justify-center min-h-[260px] space-y-4">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Dark Mode Preview
          </span>
          <div
            style={{ boxShadow: rawShadow }}
            className="w-48 h-32 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-center p-4 transition-all"
          >
            <span className="text-xs font-bold text-white font-mono">{shadow.title}</span>
          </div>
        </div>

        {/* Light Canvas */}
        <div className="p-8 rounded-2xl bg-zinc-100 border border-zinc-300 flex flex-col items-center justify-center min-h-[260px] space-y-4">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Light Mode Preview
          </span>
          <div
            style={{ boxShadow: rawShadow }}
            className="w-48 h-32 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-center p-4 transition-all"
          >
            <span className="text-xs font-bold text-zinc-900 font-mono">{shadow.title}</span>
          </div>
        </div>
      </div>

      {/* Code Snippets: Standard CSS & Tailwind */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* CSS Snippet */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-3">
          <div className="flex items-center justify-between text-brand-emerald font-bold">
            <span>Standard CSS Snippet:</span>
            <CopyButton text={shadow.cssValue} />
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white break-all select-all font-bold">
            {shadow.cssValue}
          </div>
        </div>

        {/* Tailwind CSS Class */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-sky-500/40 space-y-3">
          <div className="flex items-center justify-between text-sky-400 font-bold">
            <span>Tailwind CSS Utility Class:</span>
            <CopyButton text={shadow.tailwindClass} />
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white break-all select-all font-bold">
            {shadow.tailwindClass}
          </div>
        </div>
      </div>
    </div>
  );
}
