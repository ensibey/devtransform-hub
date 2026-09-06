import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllViewportDevices } from '@/lib/viewport-data';
import { ViewportDirectoryClient } from '@/components/viewport/ViewportDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Smartphone,
  Layers,
  ChevronRight,
  Maximize2,
  Code2,
  CheckCircle2,
  Monitor
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Device Screen Sizes & CSS Viewports Matrix (2025/2026 Developer Guide) | DevTransform',
  description: 'Complete directory of popular mobile, tablet, laptop, and desktop screen sizes with logical CSS viewports, physical resolutions, DPR scale factors, and CSS media query snippets.',
  keywords: [
    'device screen sizes',
    'css viewport resolution',
    'iphone viewport sizes',
    'responsive design breakpoints',
    'device pixel ratio dpr',
    'tailwind screen breakpoints',
    'mobile screen resolutions table',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/viewport/directory/',
  },
  openGraph: {
    title: 'Device Screen Sizes & CSS Viewports Matrix | DevTransform',
    description: 'Lookup exact CSS viewport sizes, physical resolutions, and media queries for iPhones, Androids, iPads, MacBooks, and desktop displays.',
    url: 'https://devtransform-hub.vercel.app/viewport/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Device Screen Sizes & CSS Viewports Matrix',
    description: 'Lookup exact CSS viewport sizes and media queries for modern mobile and desktop screens.',
  },
};

export default function ViewportDirectoryPage() {
  const devices = getAllViewportDevices();

  const directoryFaqs = [
    {
      question: 'What is the difference between CSS pixels and physical hardware pixels?',
      answer: 'Physical pixels are the physical microscopic light-emitting diodes (LEDs/OLEDs) fabricated on a display glass. CSS pixels (logical pixels) are the abstract coordinate system used by web browsers. On high-density Retina displays, multiple physical pixels are grouped to render a single CSS pixel (determined by the Device Pixel Ratio, e.g. 2x, 3x, or 3.75x).'
    },
    {
      question: 'Why do CSS media queries use logical width instead of physical screen resolution?',
      answer: 'Web browsers evaluate media query conditions like @media (max-width: 640px) against the layout viewport in CSS pixels, not raw physical pixels. If browsers used physical pixels, an iPhone 16 Pro (1206x2622 native) would wrongly receive a full desktop monitor stylesheet on a 6.3-inch screen!'
    },
    {
      question: 'What is the recommended HTML viewport meta tag?',
      answer: 'The industry-standard viewport meta tag is: <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">. Adding viewport-fit=cover enables modern iPhones and iPads to leverage full edge-to-edge screen space with env(safe-area-inset-*).'
    },
    {
      question: 'What are the standard responsive breakpoints used in modern web development?',
      answer: 'Tailwind CSS standard breakpoints are: sm (640px), md (768px), lg (1024px), xl (1280px), and 2xl (1536px). Small smartphones usually sit between 360px and 440px width.'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Device Screen Sizes & CSS Viewports Matrix',
    description: 'Comprehensive directory of device viewports, logical CSS pixel dimensions, and DPR scaling factors.',
    url: 'https://devtransform-hub.vercel.app/viewport/directory/',
    author: {
      '@type': 'Organization',
      name: 'DevTransform Hub',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-400 font-medium">Viewport Directory</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Responsive Web Design & Testing Cheatsheet</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Device Screen Sizes & CSS Viewports
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Instant reference database for frontend engineers, UI/UX designers, and QA testers. Lookup verified CSS logical widths, native hardware resolutions, Device Pixel Ratios (DPR), and copy-paste ready media query snippets.
          </p>
        </div>

        {/* Directory Grid */}
        <ViewportDirectoryClient devices={devices} />

        {/* Breakpoints Matrix Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Standard CSS Responsive Breakpoint Guidelines
              </h2>
              <p className="text-xs text-slate-400">
                Industry benchmark breakpoints mapped across frameworks
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Tier</th>
                  <th className="pb-3 font-semibold">Width Range</th>
                  <th className="pb-3 font-semibold">Tailwind Class</th>
                  <th className="pb-3 font-semibold">Target Devices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <tr>
                  <td className="py-3 text-indigo-400 font-sans font-medium">Extra Small / Mobile</td>
                  <td className="py-3">&lt; 640px</td>
                  <td className="py-3 text-emerald-400">default (no prefix)</td>
                  <td className="py-3 text-slate-400 font-sans">iPhone 16, Galaxy S24, Pixel 8 (360px - 440px)</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-sans font-medium">Small</td>
                  <td className="py-3">&ge; 640px</td>
                  <td className="py-3 text-emerald-400">sm:</td>
                  <td className="py-3 text-slate-400 font-sans">Large phablets, landscape smartphones</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-sans font-medium">Medium / Tablet</td>
                  <td className="py-3">&ge; 768px</td>
                  <td className="py-3 text-emerald-400">md:</td>
                  <td className="py-3 text-slate-400 font-sans">iPad Air, iPad mini, Android tablets (768px - 834px)</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-sans font-medium">Large / Small Laptop</td>
                  <td className="py-3">&ge; 1024px</td>
                  <td className="py-3 text-emerald-400">lg:</td>
                  <td className="py-3 text-slate-400 font-sans">iPad Pro 12.9&quot; landscape, compact laptops (1024px)</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-sans font-medium">Extra Large / Desktop</td>
                  <td className="py-3">&ge; 1280px</td>
                  <td className="py-3 text-emerald-400">xl:</td>
                  <td className="py-3 text-slate-400 font-sans">MacBook Air 13&quot;, standard desktop monitors</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-sans font-medium">2X Large / Ultrawide</td>
                  <td className="py-3">&ge; 1536px</td>
                  <td className="py-3 text-emerald-400">2xl:</td>
                  <td className="py-3 text-slate-400 font-sans">MacBook Pro 16&quot;, 1080p, 1440p, and 4K displays</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions About Screen Resolutions & Viewports
          </h2>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}
