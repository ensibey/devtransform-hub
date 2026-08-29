import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllTimezonePairs,
  getTimezonePair,
  TimezonePair,
  CITIES,
} from '@/lib/timezone-matrix';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { TimezoneWorkspace } from '@/components/timezone/TimezoneWorkspace';
import {
  Clock,
  Globe,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const pairs = getAllTimezonePairs();
  return pairs.map((pair) => ({
    slug: pair.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pair = getTimezonePair(params.slug);
  if (!pair) return { title: 'Timezone Converter' };

  const diffText =
    pair.hourDifference > 0
      ? `${pair.hourDifference} hours ahead of`
      : pair.hourDifference < 0
      ? `${Math.abs(pair.hourDifference)} hours behind`
      : 'the same time as';

  const title = `${pair.from.name} to ${pair.to.name} Time Difference & Live Clock (${pair.from.nameTr} - ${pair.to.nameTr} Saat Farkı)`;
  const description = `What is the time difference between ${pair.from.name} (${pair.from.country}) and ${pair.to.name} (${pair.to.country})? Live world clock, meeting planner, and exact hour conversion table.`;
  const canonicalUrl = `https://zeroupload-edb.pages.dev/timezone/${pair.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${pair.from.name.toLowerCase()} to ${pair.to.name.toLowerCase()} time`,
      `${pair.from.nameTr.toLowerCase()} ${pair.to.nameTr.toLowerCase()} saat farkı`,
      `${pair.from.name} time now`,
      `${pair.to.name} time now`,
      `time difference between ${pair.from.name} and ${pair.to.name}`,
      'world clock',
      'meeting planner',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload Timezone Hub',
    },
  };
}

export default function TimezonePairPage({ params }: PageProps) {
  const pair = getTimezonePair(params.slug);
  if (!pair) notFound();

  const diff = pair.hourDifference;
  const diffSign = diff > 0 ? `+${diff}` : `${diff}`;
  const diffExplanation =
    diff > 0
      ? `${pair.to.name} is ${diff} hours ahead of ${pair.from.name}. When it is 12:00 PM in ${pair.from.name}, it is ${12 + diff > 24 ? (12 + diff) % 24 : 12 + diff}:00 in ${pair.to.name}.`
      : diff < 0
      ? `${pair.to.name} is ${Math.abs(diff)} hours behind ${pair.from.name}. When it is 12:00 PM in ${pair.from.name}, it is ${12 + diff < 0 ? 24 + (12 + diff) : 12 + diff}:00 in ${pair.to.name}.`
      : `${pair.from.name} and ${pair.to.name} share the same standard time offset.`;

  const faqs = [
    {
      question: `What is the time difference between ${pair.from.name} and ${pair.to.name}?`,
      answer: `${pair.to.name} is currently ${Math.abs(diff)} hours ${diff >= 0 ? 'ahead of' : 'behind'} ${pair.from.name}. Both cities follow their respective regional timezones (${pair.from.timezone} and ${pair.to.timezone}).`,
    },
    {
      question: `What is the best time for a video call between ${pair.from.name} and ${pair.to.name}?`,
      answer: `To coordinate during standard business hours (9:00 AM to 5:00 PM), the optimal meeting window is between ${diff >= 0 ? '9:00 AM - 1:00 PM' : '2:00 PM - 6:00 PM'} local time.`,
    },
    {
      question: `Does this time difference change during Daylight Saving Time (DST)?`,
      answer: `Depending on seasonal DST transitions in ${pair.from.country} or ${pair.to.country}, the exact hour difference may shift by ±1 hour during spring and autumn. This tool calculates live browser timezones in real time.`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${pair.from.name} to ${pair.to.name} Timezone Converter`,
    url: `https://zeroupload-edb.pages.dev/timezone/${pair.slug}/`,
    description: `Live time difference and meeting planner between ${pair.from.name} and ${pair.to.name}.`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zeroupload-edb.pages.dev/' },
      { '@type': 'ListItem', position: 2, name: 'Timezones', item: 'https://zeroupload-edb.pages.dev/#tools' },
      { '@type': 'ListItem', position: 3, name: `${pair.from.name} to ${pair.to.name}`, item: `https://zeroupload-edb.pages.dev/timezone/${pair.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      {/* Triple JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/tools/timezone-converter/" className="hover:text-zinc-200 transition-colors">World Clock</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-200">{pair.from.name}</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
            <span className="text-brand-emerald font-semibold">{pair.to.name}</span>
          </nav>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Live Real-Time Sync</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500">
            <Zap className="w-3.5 h-3.5 text-brand-emerald" />
            <span>UTC{pair.from.utcOffset >= 0 ? `+${pair.from.utcOffset}` : pair.from.utcOffset} to UTC{pair.to.utcOffset >= 0 ? `+${pair.to.utcOffset}` : pair.to.utcOffset}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {pair.from.name} to {pair.to.name} Time Difference
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {diffExplanation} ({pair.from.nameTr} ile {pair.to.nameTr} arasındaki saat farkı ve canlı dünya saati).
          </p>
        </div>
      </div>

      {/* Interactive Timezone Live Workspace */}
      <TimezoneWorkspace
        from={pair.from}
        to={pair.to}
        hourDiff={pair.hourDifference}
      />

      {/* 24-Hour Comparison Table */}
      <section className="mt-10 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-brand-emerald" />
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            24-Hour Time Conversion Table ({pair.from.name} vs {pair.to.name})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-900/80">
                <th className="p-2.5">{pair.from.name} ({pair.from.country})</th>
                <th className="p-2.5">{pair.to.name} ({pair.to.country})</th>
                <th className="p-2.5">Overlap Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {Array.from({ length: 24 }).map((_, hour) => {
                const targetHour = (hour + diff + 24) % 24;
                const isWorkingHour = hour >= 9 && hour <= 17 && targetHour >= 9 && targetHour <= 17;
                return (
                  <tr key={hour} className={`hover:bg-zinc-800/30 ${isWorkingHour ? 'bg-emerald-950/20' : ''}`}>
                    <td className="p-2.5 font-bold text-zinc-200">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    <td className="p-2.5 text-brand-emerald font-bold">
                      {targetHour.toString().padStart(2, '0')}:00
                    </td>
                    <td className="p-2.5">
                      {isWorkingHour ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Work Hours Overlap
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">Off Hours</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Structured FAQs */}
      <FaqAccordion
        faqs={faqs}
        fromName={pair.from.name}
        toName={pair.to.name}
      />
    </div>
  );
}
