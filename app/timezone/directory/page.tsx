import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, POPULAR_TIMEZONE_SLUGS } from '@/lib/timezone-matrix';
import { Globe, Clock, Plane, ArrowRight, Layers, Sparkles, MapPin, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'World Timezone Directory: 75 Global Metropolises & 5,500+ Time Differences | DevTransform',
  description: 'Explore live time differences, working hour overlaps, flight durations, and meeting schedules between 75 major global cities across all continents.',
  keywords: [
    'world timezone directory',
    'global time difference index',
    'international meeting planner',
    'time zone converter list',
    'world clock cities',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/timezone/directory/',
  },
  openGraph: {
    title: 'World Timezone Directory: 75 Global Metropolises & Corridors',
    description: 'Explore live time differences, working hour overlaps, and meeting schedules between 75 major global cities.',
    url: 'https://devtransform-hub.vercel.app/timezone/directory/',
    type: 'website',
  },
};

export default function TimezoneDirectoryPage() {
  // Sort cities alphabetically
  const sortedCities = [...CITIES].sort((a, b) => a.name.localeCompare(b.name));

  // Group cities by first letter
  const groupedCities: Record<string, typeof CITIES> = {};
  sortedCities.forEach((city) => {
    const letter = city.name[0].toUpperCase();
    if (!groupedCities[letter]) groupedCities[letter] = [];
    groupedCities[letter].push(city);
  });

  const alphabet = Object.keys(groupedCities).sort();

  // Curated list of popular corridors
  const popularCorridors = [
    { from: 'London', to: 'New York', slug: 'london-to-new-york', diff: '-5h' },
    { from: 'Paris', to: 'New York', slug: 'paris-to-new-york', diff: '-6h' },
    { from: 'New York', to: 'London', slug: 'new-york-to-london', diff: '+5h' },
    { from: 'Tokyo', to: 'London', slug: 'tokyo-to-london', diff: '-9h' },
    { from: 'Dubai', to: 'London', slug: 'dubai-to-london', diff: '-4h' },
    { from: 'Singapore', to: 'Sydney', slug: 'singapore-to-sydney', diff: '+2h' },
    { from: 'Bangkok', to: 'Singapore', slug: 'bangkok-to-singapore', diff: '+1h' },
    { from: 'Los Angeles', to: 'London', slug: 'los-angeles-to-london', diff: '+8h' },
    { from: 'Toronto', to: 'London', slug: 'toronto-to-london', diff: '+5h' },
    { from: 'Hong Kong', to: 'London', slug: 'hong-kong-to-london', diff: '-8h' },
    { from: 'San Francisco', to: 'New York', slug: 'san-francisco-to-new-york', diff: '+3h' },
    { from: 'Sydney', to: 'London', slug: 'sydney-to-london', diff: '-10h' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Timezone Planner', item: 'https://devtransform-hub.vercel.app/tools/timezone-converter/' },
      { '@type': 'ListItem', position: 3, name: 'Directory', item: 'https://devtransform-hub.vercel.app/timezone/directory/' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-zinc-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-brand-emerald transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools/timezone-converter/" className="hover:text-emerald-600 dark:hover:text-brand-emerald transition-colors">Timezone Planner</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Directory</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-brand-emerald/30 text-emerald-700 dark:text-brand-emerald text-xs font-mono font-medium">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Metropolis Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            World Timezone Directory
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-zinc-400">
            Browse time differences, daylight saving schedules, airport IATA codes, and mutually aligned business hours across 75 international financial and technological hubs.
          </p>
        </div>

        {/* Popular Global Corridors */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              Most Traveled Global Time Corridors
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularCorridors.map((c) => (
              <Link
                key={c.slug}
                href={`/timezone/${c.slug}/`}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-brand-emerald transition-colors">
                    {c.from} &rarr; {c.to}
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Difference: {c.diff}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Alphabet Quick Jump Bar */}
        <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex flex-wrap gap-1.5 items-center justify-center">
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 mr-2">Jump to:</span>
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 hover:bg-emerald-500 hover:text-white transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Metropolis Directory by Letter */}
        <div className="space-y-10">
          {alphabet.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="space-y-4 pt-4 scroll-mt-20">
              <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-zinc-800 pb-2">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-brand-emerald text-white font-mono font-black text-lg flex items-center justify-center">
                  {letter}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  Metropolises ({groupedCities[letter].length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCities[letter].map((city) => {
                  // Generate links to 3 key global partners
                  const targetPairs = [
                    { name: 'London', slug: `${city.slug}-to-london` },
                    { name: 'New York', slug: `${city.slug}-to-new-york` },
                    { name: 'Tokyo', slug: `${city.slug}-to-tokyo` },
                  ].filter((p) => p.name !== city.name);

                  return (
                    <div
                      key={city.slug}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/90 space-y-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {city.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {city.country}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                            {city.iata}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-brand-emerald">
                            UTC{city.utcOffset >= 0 ? `+${city.utcOffset}` : city.utcOffset}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                        TZ: {city.timezone} ({city.tzAbbr})
                      </div>

                      {/* Quick Links to Popular Corridors */}
                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          Direct Time Differences:
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {targetPairs.map((tp) => (
                            <Link
                              key={tp.slug}
                              href={`/timezone/${tp.slug}/`}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-50 dark:bg-zinc-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-brand-emerald border border-slate-200 dark:border-zinc-700/60 transition-colors"
                            >
                              <span>&rarr; {tp.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
