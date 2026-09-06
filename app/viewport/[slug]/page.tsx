import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllViewportDevices,
  getViewportDeviceBySlug,
  VIEWPORT_DEVICES,
} from '@/lib/viewport-data';
import { DeviceViewportViewer } from '@/components/viewport/DeviceViewportViewer';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { ChevronRight, ArrowRight, Smartphone, Monitor, CheckCircle, ShieldAlert } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const devices = getAllViewportDevices();
  return devices.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const device = getViewportDeviceBySlug(params.slug);
  if (!device) return { title: 'Device Viewport Size' };

  const title = `${device.name} Viewport Size, CSS Resolution & Media Queries | DevTransform`;
  const description = `Accurate CSS viewport resolution for ${device.name}: ${device.cssWidth} x ${device.cssHeight} px at ${device.dpr}x DPR. Includes CSS media queries, Tailwind breakpoints, and responsive design guidelines.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/viewport/${device.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${device.name.toLowerCase()} viewport`,
      `${device.name.toLowerCase()} css resolution`,
      `${device.name.toLowerCase()} screen size`,
      `${device.name.toLowerCase()} media query`,
      `${device.name.toLowerCase()} dpr`,
      'device screen resolutions',
      'responsive design breakpoints',
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

export default function ViewportDevicePage({ params }: PageProps) {
  const device = getViewportDeviceBySlug(params.slug);
  if (!device) notFound();

  // Find related devices
  const relatedDevices = VIEWPORT_DEVICES.filter((d) => d.slug !== device.slug).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${device.name} Viewport Resolution & CSS Specifications`,
    description: device.description,
    author: {
      '@type': 'Organization',
      name: 'DevTransform Hub',
    },
    mainEntity: {
      '@type': 'Product',
      name: device.name,
      brand: {
        '@type': 'Brand',
        name: device.brand,
      },
    },
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
          <Link href="/viewport/directory/" className="hover:text-white transition">
            Viewport Directory
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-400 font-medium">{device.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{device.brand} &bull; {device.category.toUpperCase()} &bull; {device.screenDiagonal}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {device.name} Viewport Size & CSS Resolution
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            {device.description} Use the interactive simulator and verified CSS media queries below for pixel-perfect responsive frontends.
          </p>
        </div>

        {/* Interactive Device Viewport Simulator */}
        <DeviceViewportViewer device={device} />

        {/* Responsive Design & Testing Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <CheckCircle className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">
                Frontend Design Best Practices
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {device.designTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">
                CSS Viewport Specification
              </h2>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">CSS Logical Width</span>
                <span className="font-mono font-semibold text-white">{device.cssWidth} px</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">CSS Logical Height</span>
                <span className="font-mono font-semibold text-white">{device.cssHeight} px</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Hardware Native Width</span>
                <span className="font-mono font-semibold text-white">{device.physicalWidth} px</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Hardware Native Height</span>
                <span className="font-mono font-semibold text-white">{device.physicalHeight} px</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Pixel Density (DPR)</span>
                <span className="font-mono font-semibold text-white">{device.dpr}&times;</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Aspect Ratio</span>
                <span className="font-mono font-semibold text-white">{device.aspectRatio}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        {device.faqs && device.faqs.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">
              Frequently Asked Questions About {device.name} Screen Dimensions
            </h2>
            <FaqAccordion faqs={device.faqs} />
          </div>
        )}

        {/* Other Devices Comparison */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Compare with Other Popular Devices
            </h2>
            <Link
              href="/viewport/directory/"
              className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
            >
              <span>View All Devices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedDevices.map((d) => (
              <Link
                key={d.slug}
                href={`/viewport/${d.slug}/`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{d.brand}</span>
                    <span className="font-mono">{d.cssWidth} &times; {d.cssHeight} px</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">
                    {d.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>DPR: {d.dpr}x</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                    Specs &rarr;
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
