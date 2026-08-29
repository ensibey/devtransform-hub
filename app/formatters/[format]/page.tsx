import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FORMATS, FORMAT_LIST, isValidFormatId } from '@/lib/matrix';
import { ConverterWorkspace } from '@/components/editor/ConverterWorkspace';
import { JsonLdSchema } from '@/components/seo/JsonLdSchema';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { EthicalAdUnit } from '@/components/ads/EthicalAdUnit';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: {
    format: string;
  };
}

export async function generateStaticParams() {
  return FORMAT_LIST.map((format) => ({
    format: format.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const format = isValidFormatId(params.format) ? FORMATS[params.format] : null;
  if (!format) {
    return {
      title: 'Formatter Not Found',
    };
  }

  const title = `Online ${format.shortName} Formatter, Beautifier & Validator`;
  const description = `Format, prettify, lint, and validate ${format.name} online in your browser. 100% client-side with Prettier standalone & CodeMirror 6.`;
  const canonicalUrl = `https://zeroupload-edb.pages.dev/formatters/${format.id}/`;

  return {
    title,
    description,
    keywords: [
      `${format.id} formatter`,
      `beautify ${format.id}`,
      `validate ${format.id}`,
      `${format.id} validator`,
      `${format.id} prettifier`,
      ...format.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function FormatterPage({ params }: PageProps) {
  const format = isValidFormatId(params.format) ? FORMATS[params.format] : null;

  if (!format) {
    notFound();
  }

  const canonicalUrl = `https://devtransform.pages.dev/formatters/${format.id}/`;

  return (
    <div className="space-y-8 py-2">
      <JsonLdSchema
        formatterMeta={format}
        url={canonicalUrl}
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PrivacyBadge />
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Prettier & AST Engine</span>
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono">
            <span>Formatters</span>
            <span>/</span>
            <span className="text-brand-emerald uppercase">{format.shortName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>{format.shortName} Formatter & Beautifier</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Format, beautify, and validate {format.name} with instant linting diagnostics and error line indicators.
          </p>
        </div>
      </div>

      {/* Interactive Workspace (same format for source and target) */}
      <ConverterWorkspace
        initialFrom={format.id}
        initialTo={format.id}
      />

      <EthicalAdUnit />
    </div>
  );
}
