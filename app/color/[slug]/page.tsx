import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllColorDefinitions,
  getColorBySlug,
  POPULAR_COLORS,
} from '@/lib/color-matrix';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Palette,
  Eye,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Copy,
  Layers,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const colors = getAllColorDefinitions();
  return colors.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const color = getColorBySlug(params.slug);
  if (!color) return { title: 'Color Converter' };

  const title = `${color.hex} to RGB, HSL & CMYK Converter — "${color.name}" (${color.nameTr} Renk Kodu)`;
  const description = `Convert HEX ${color.hex} to RGB(${color.rgb.join(', ')}), HSL(${color.hsl[0]}, ${color.hsl[1]}%, ${color.hsl[2]}%), and CMYK. WCAG contrast ratio test, shades, and CSS code snippets.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/color/${color.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${color.hex.toLowerCase()} to rgb`,
      `${color.hex} rgb`,
      `${color.name.toLowerCase()} color code`,
      `${color.nameTr.toLowerCase()} renk kodu`,
      `hex ${color.hex} to hsl`,
      'color converter',
      'hex to rgb online',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload Color Hub',
    },
  };
}

export default function ColorPage({ params }: PageProps) {
  const color = getColorBySlug(params.slug);
  if (!color) notFound();

  const rgbString = `rgb(${color.rgb.join(', ')})`;
  const hslString = `hsl(${color.hsl[0]}, ${color.hsl[1]}%, ${color.hsl[2]}%)`;
  const cmykString = `cmyk(${color.cmyk.join('%, ')}%)`;

  // WCAG Luminance calculation
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(color.rgb[0], color.rgb[1], color.rgb[2]);
  const contrastWhite = (1 + 0.05) / (lum + 0.05);
  const contrastBlack = (lum + 0.05) / (0 + 0.05);

  const whiteRatio = (contrastWhite < 1 ? 1 / contrastWhite : contrastWhite).toFixed(2);
  const blackRatio = (contrastBlack < 1 ? 1 / contrastBlack : contrastBlack).toFixed(2);

  const passesWhiteAA = parseFloat(whiteRatio) >= 4.5;
  const passesBlackAA = parseFloat(blackRatio) >= 4.5;

  const faqs = [
    {
      question: `What is ${color.hex} in RGB format?`,
      answer: `${color.hex} in RGB is ${rgbString} (Red: ${color.rgb[0]}, Green: ${color.rgb[1]}, Blue: ${color.rgb[2]}).`,
    },
    {
      question: `What is ${color.hex} in HSL format?`,
      answer: `${color.hex} in HSL is ${hslString} (Hue: ${color.hsl[0]}°, Saturation: ${color.hsl[1]}%, Lightness: ${color.hsl[2]}%).`,
    },
    {
      question: `Is ${color.hex} accessible for white or black text?`,
      answer: `On a ${color.hex} background, black text has a contrast ratio of ${blackRatio}:1 (${passesBlackAA ? 'Passes WCAG AA' : 'Fails'}), while white text has a contrast ratio of ${whiteRatio}:1 (${passesWhiteAA ? 'Passes WCAG AA' : 'Fails'}).`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${color.hex} Color Converter`,
    url: `https://devtransform-hub.vercel.app/color/${color.slug}/`,
    description: `Convert ${color.hex} to RGB, HSL, and CMYK.`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Color Codes', item: 'https://devtransform-hub.vercel.app/#tools' },
      { '@type': 'ListItem', position: 3, name: color.hex, item: `https://devtransform-hub.vercel.app/color/${color.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/tools/color-palette-extractor/" className="hover:text-zinc-200 transition-colors">Colors</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold font-mono">{color.hex}</span>
          </nav>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG 2.1 Contrast Verified</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {color.hex} to RGB Converter
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            &ldquo;{color.name}&rdquo; ({color.nameTr} Renk Kodu) — HEX, RGB, HSL ve CMYK değerleri, kontrast oranları ve CSS kodları.
          </p>
        </div>
      </div>

      {/* Large Visual Color Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Box */}
        <div
          className="rounded-2xl p-8 flex flex-col justify-between min-h-[260px] shadow-2xl border border-white/10 relative overflow-hidden group"
          style={{ backgroundColor: color.hex }}
        >
          <div className="flex justify-between items-start">
            <span
              className="px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-md"
              style={{
                backgroundColor: passesWhiteAA ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                color: passesWhiteAA ? '#fff' : '#000',
              }}
            >
              {color.name}
            </span>
          </div>

          <div>
            <div
              className="text-3xl sm:text-4xl font-black font-mono tracking-tight drop-shadow-md"
              style={{ color: passesWhiteAA ? '#ffffff' : '#000000' }}
            >
              {color.hex}
            </div>
            <div
              className="text-xs font-mono drop-shadow opacity-90 mt-1"
              style={{ color: passesWhiteAA ? '#ffffff' : '#000000' }}
            >
              {rgbString}
            </div>
          </div>
        </div>

        {/* Formats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* HEX */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1 font-mono">
              <span className="text-[11px] text-zinc-500 uppercase font-bold">HEX Code</span>
              <div className="text-base font-bold text-white">{color.hex}</div>
            </div>
            <CopyButton text={color.hex} />
          </div>

          {/* RGB */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1 font-mono">
              <span className="text-[11px] text-zinc-500 uppercase font-bold">RGB</span>
              <div className="text-base font-bold text-brand-emerald">{rgbString}</div>
            </div>
            <CopyButton text={rgbString} />
          </div>

          {/* HSL */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1 font-mono">
              <span className="text-[11px] text-zinc-500 uppercase font-bold">HSL</span>
              <div className="text-base font-bold text-sky-400">{hslString}</div>
            </div>
            <CopyButton text={hslString} />
          </div>

          {/* CMYK */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1 font-mono">
              <span className="text-[11px] text-zinc-500 uppercase font-bold">CMYK (Print)</span>
              <div className="text-base font-bold text-amber-400">{cmykString}</div>
            </div>
            <CopyButton text={cmykString} />
          </div>
        </div>
      </div>

      {/* WCAG Contrast Accessibility Test */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
          <Eye className="w-4 h-4 text-brand-emerald" />
          <span>WCAG 2.1 Erişilebilirlik & Kontrast Oranı (Accessibility)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* White Text Test */}
          <div
            className="p-5 rounded-xl border border-zinc-800 flex items-center justify-between"
            style={{ backgroundColor: color.hex }}
          >
            <span className="text-white font-bold text-sm drop-shadow">
              Beyaz Metin (White Text)
            </span>
            <div className="flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-lg text-xs font-mono text-white">
              <span>{whiteRatio}:1</span>
              {passesWhiteAA ? (
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pass AA</span>
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Fail</span>
                </span>
              )}
            </div>
          </div>

          {/* Black Text Test */}
          <div
            className="p-5 rounded-xl border border-zinc-800 flex items-center justify-between"
            style={{ backgroundColor: color.hex }}
          >
            <span className="text-black font-bold text-sm drop-shadow">
              Siyah Metin (Black Text)
            </span>
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-lg text-xs font-mono text-black">
              <span>{blackRatio}:1</span>
              {passesBlackAA ? (
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pass AA</span>
                </span>
              ) : (
                <span className="text-rose-700 font-bold flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Fail</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Colors */}
      <section className="space-y-3 pt-6 border-t border-zinc-800">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-400 uppercase">
          <Layers className="w-4 h-4" />
          <span>Diğer Popüler Renk Kodları</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {POPULAR_COLORS.filter((c) => c.slug !== color.slug).slice(0, 12).map((item) => (
            <Link
              key={item.slug}
              href={`/color/${item.slug}/`}
              className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-xs font-mono flex items-center space-x-2 text-zinc-300 hover:text-white transition-all group"
            >
              <div
                className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                style={{ backgroundColor: item.hex }}
              />
              <span className="font-bold truncate">{item.hex}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        fromName={color.hex}
        toName="RGB & HSL"
      />
    </div>
  );
}
