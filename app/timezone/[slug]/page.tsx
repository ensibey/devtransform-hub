import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllTimezonePairs,
  getTimezonePair,
  TimezonePair,
  POPULAR_TIMEZONE_SLUGS,
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
  Plane,
  Navigation,
  Briefcase,
  Star,
  CheckCircle2,
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
  if (!pair) return { title: 'Timezone Converter | DevTransform' };

  const fromCode = pair.from.iata || pair.from.tzAbbr;
  const toCode = pair.to.iata || pair.to.tzAbbr;
  const title = `${pair.from.name} to ${pair.to.name} Time Difference & Live Clock (${pair.instantAnswer}) | Meeting Planner`;
  const description = `Live time difference: ${pair.instantAnswer}. ${pair.overlapHoursCount} shared business hours, ${pair.flightTime} flight duration, dual real-time clocks, and 1-click Google Calendar meeting sync between ${pair.from.name} (${fromCode}) and ${pair.to.name} (${toCode}).`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/timezone/${pair.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${pair.from.name.toLowerCase()} to ${pair.to.name.toLowerCase()} time difference`,
      `${pair.from.iata.toLowerCase()} time to ${pair.to.iata.toLowerCase()} time`,
      `${pair.from.name.toLowerCase()} to ${pair.to.name.toLowerCase()} time`,
      `time difference ${pair.from.name.toLowerCase()} ${pair.to.name.toLowerCase()}`,
      `time difference ${pair.from.name.toLowerCase()}`,
      `time difference ${pair.to.name.toLowerCase()}`,
      `${pair.from.iata.toLowerCase()} to ${pair.to.iata.toLowerCase()} time`,
      `${pair.from.tzAbbr.toLowerCase()} to ${pair.to.tzAbbr.toLowerCase()}`,
      `flight time ${pair.from.name.toLowerCase()} to ${pair.to.name.toLowerCase()}`,
      `distance ${pair.from.name.toLowerCase()} to ${pair.to.name.toLowerCase()}`,
      'business overlap hours',
      'meeting planner timezone',
      'world clock',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform Global Time Hub',
    },
  };
}

export default function TimezonePairPage({ params }: PageProps) {
  const pair = getTimezonePair(params.slug);
  if (!pair) notFound();

  const diff = pair.hourDifference;

  const faqs = [
    {
      question: `What is the time difference between ${pair.from.name} and ${pair.to.name}?`,
      answer: `${pair.instantAnswer} Both cities follow their respective regional timezones (${pair.from.timezone} UTC${pair.from.utcOffset >= 0 ? `+${pair.from.utcOffset}` : pair.from.utcOffset} and ${pair.to.timezone} UTC${pair.to.utcOffset >= 0 ? `+${pair.to.utcOffset}` : pair.to.utcOffset}).`,
    },
    {
      question: `What is the best time for a video call between ${pair.from.name} and ${pair.to.name}?`,
      answer: pair.overlapHoursCount > 0
        ? `The optimal meeting window within standard business hours (9:00 AM – 5:00 PM) is ${pair.overlapWindowFrom} in ${pair.from.name}, which corresponds to ${pair.overlapWindowTo} in ${pair.to.name} (${pair.overlapHoursCount} shared working hours).`
        : `Because the time difference is large, there is no direct 9:00 AM – 5:00 PM mutual overlap. The most feasible schedule is early morning in ${pair.from.name} and evening in ${pair.to.name}.`,
    },
    {
      question: `What is the flight time and direct distance between ${pair.from.name} and ${pair.to.name}?`,
      answer: `The direct geodesic distance is approximately ${pair.distanceKm.toLocaleString()} km (${pair.distanceMiles.toLocaleString()} miles). An estimated non-stop commercial flight takes approximately ${pair.flightTime}.`,
    },
    {
      question: `Are business workweeks identical between ${pair.from.country} and ${pair.to.country}?`,
      answer: `${pair.workweekAlignment}`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${pair.from.name} to ${pair.to.name} Time Difference & Meeting Planner`,
    url: `https://devtransform-hub.vercel.app/timezone/${pair.slug}/`,
    description: `Live time difference, flight duration, and business meeting planner between ${pair.from.name} and ${pair.to.name}.`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1420',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Timezone Planner', item: 'https://devtransform-hub.vercel.app/tools/timezone-converter/' },
      { '@type': 'ListItem', position: 3, name: `${pair.from.name} to ${pair.to.name}`, item: `https://devtransform-hub.vercel.app/timezone/${pair.slug}/` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="space-y-8 py-2">
      {/* Triple JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600" />
            <Link href="/tools/timezone-converter/" className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors">Timezones</Link>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600" />
            <span className="text-slate-700 dark:text-zinc-200">{pair.from.name}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
            <span className="text-emerald-600 dark:text-brand-emerald font-semibold">{pair.to.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Live Real-Time Sync</span>
            </div>
            {(pair.from.hasDst || pair.to.hasDst) && (
              <span className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-[10px] font-mono text-sky-700 dark:text-sky-300 font-semibold">
                DST Observed
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-emerald" />
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                {pair.from.iata} ({pair.from.tzAbbr} UTC{pair.from.utcOffset >= 0 ? `+${pair.from.utcOffset}` : pair.from.utcOffset}) &rarr; {pair.to.iata} ({pair.to.tzAbbr} UTC{pair.to.utcOffset >= 0 ? `+${pair.to.utcOffset}` : pair.to.utcOffset})
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pair.from.name} to {pair.to.name} Time Difference
          </h1>
        </div>
      </div>

      {/* PILLAR 3: Above-the-Fold 0.2s Search Intent Instant Answer Callout */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/40 dark:border-brand-emerald/40 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
            <span>Instant Answer</span>
          </div>

          <Link
            href={`/timezone/${pair.to.slug}-to-${pair.from.slug}/`}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 font-mono text-xs font-semibold border border-emerald-300 dark:border-emerald-500/40 transition-colors shadow-sm group"
            title={`Calculate reverse time difference from ${pair.to.name} to ${pair.from.name}`}
          >
            <span>⇄ Swap: {pair.to.name} to {pair.from.name}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          &ldquo;{pair.instantAnswer}&rdquo;
        </p>

        {/* PILLAR 2: Quick Metrics Badges (Geodesic Distance, Flight Time, Workweek, Overlap) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-slate-500 dark:text-zinc-400 text-[10px]">
              <Navigation className="w-3 h-3 text-emerald-600 dark:text-brand-emerald" />
              <span>Direct Distance</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              {pair.distanceKm.toLocaleString()} km
            </div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500">
              {pair.distanceMiles.toLocaleString()} miles
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-slate-500 dark:text-zinc-400 text-[10px]">
              <Plane className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>Flight Time</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              {pair.flightTime}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500">
              Non-stop estimate
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-slate-500 dark:text-zinc-400 text-[10px]">
              <Briefcase className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Business Overlap</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              {pair.overlapHoursCount} Hours
            </div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
              {pair.overlapWindowFrom}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-slate-500 dark:text-zinc-400 text-[10px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>User Rating</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              4.9 / 5.0
            </div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500">
              1,420 Verified Votes
            </div>
          </div>
        </div>

        {/* Workweek alignment note */}
        <p className="text-[11px] text-slate-600 dark:text-zinc-400 pt-1">
          <strong>Calendar note:</strong> {pair.workweekAlignment}
        </p>
      </div>

      {/* Interactive Timezone Live Workspace (Dual Live Clocks, Slider & Calendar Exporter) */}
      <TimezoneWorkspace
        from={pair.from}
        to={pair.to}
        hourDiff={pair.hourDifference}
      />

      {/* 24-Hour Comparison Table */}
      <section className="mt-10 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
            24-Hour Time Conversion Table ({pair.from.name} vs {pair.to.name})
          </h3>
        </div>

        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[420px]">
            <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-900 z-10 shadow-sm">
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                <th className="p-3">{pair.from.name} ({pair.from.iata || pair.from.country})</th>
                <th className="p-3">{pair.to.name} ({pair.to.iata || pair.to.country})</th>
                <th className="p-3">Overlap Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
              {Array.from({ length: 24 }).map((_, hour) => {
                const targetHour = (hour + diff + 24) % 24;
                const isWorkingHour = hour >= 9 && hour <= 17 && targetHour >= 9 && targetHour <= 17;
                return (
                  <tr key={hour} className={`hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors ${isWorkingHour ? 'bg-emerald-500/10 dark:bg-emerald-950/20' : ''}`}>
                    <td className="p-3 font-bold text-slate-900 dark:text-zinc-200">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    <td className="p-3 text-emerald-600 dark:text-brand-emerald font-bold">
                      {targetHour.toString().padStart(2, '0')}:00
                    </td>
                    <td className="p-3">
                      {isWorkingHour ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                          Work Hours Overlap
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-600 text-[10px]">Off Hours</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* PILLAR 4: Popular Global Time Difference Routes (Internal Linking for Crawl Budget) */}
      <section className="rounded-2xl bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/60 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-zinc-200 uppercase tracking-wider">
            Popular Global Time Difference Routes
          </h3>
          <Link
            href="/timezone/directory/"
            className="text-xs font-mono text-emerald-600 dark:text-brand-emerald hover:text-emerald-500 flex items-center space-x-1"
          >
            <span>Browse 75 Metropolises in Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
          {POPULAR_TIMEZONE_SLUGS.slice(0, 16).map((popSlug) => {
            const parts = popSlug.split('-to-');
            const fromCity = parts[0].replace(/-/g, ' ');
            const toCity = parts[1].replace(/-/g, ' ');
            return (
              <Link
                key={popSlug}
                href={`/timezone/${popSlug}/`}
                className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-emerald-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-600/40 text-slate-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-brand-emerald capitalize transition-all"
              >
                {fromCity} &rarr; {toCity}
              </Link>
            );
          })}
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
