import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllUnitPairs, UNITS, UnitCategory } from '@/lib/units-matrix';
import { Scale, ArrowRight, Sparkles, Ruler, Database, Gauge, Compass, Droplet, Clock, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unit Conversion Directory: 350+ Measurement Converters & Formulas | DevTransform',
  description: 'Complete directory of precision unit converters across length, mass, digital data, speed, area, volume, and time with exact conversion multipliers.',
  keywords: [
    'unit conversion directory',
    'measurement converter list',
    'metric to imperial conversion formulas',
    'online unit converter directory',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/convert/directory/',
  },
  openGraph: {
    title: 'Unit Conversion Directory: 350+ Measurement Converters',
    description: 'Explore 350+ precision unit converters across length, mass, digital storage, and speed.',
    url: 'https://devtransform-hub.vercel.app/convert/directory/',
    type: 'website',
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  length: Ruler,
  weight: Scale,
  data: Database,
  speed: Gauge,
  area: Compass,
  volume: Droplet,
  time: Clock,
  energy: Zap,
};

export default function ConvertDirectoryPage() {
  const allPairs = getAllUnitPairs();

  const categories: { id: UnitCategory; name: string }[] = [
    { id: 'length', name: 'Length & Distance' },
    { id: 'weight', name: 'Weight & Mass' },
    { id: 'data', name: 'Digital Data & Memory' },
    { id: 'speed', name: 'Speed & Velocity' },
    { id: 'area', name: 'Area & Land Surface' },
    { id: 'volume', name: 'Volume & Fluid Capacity' },
    { id: 'time', name: 'Time & Duration' },
    { id: 'energy', name: 'Energy & Work' },
  ];

  const popularPairs = [
    { from: 'Kilometer', to: 'Mile', slug: 'kilometer-to-mile', cat: 'Length' },
    { from: 'Kilogram', to: 'Pound', slug: 'kilogram-to-pound', cat: 'Weight' },
    { from: 'Milligram', to: 'Gram', slug: 'milligram-to-gram', cat: 'Weight' },
    { from: 'Hectare', to: 'Square Kilometer', slug: 'hectare-to-square-kilometer', cat: 'Area' },
    { from: 'Megabyte', to: 'Gigabyte', slug: 'megabyte-to-gigabyte', cat: 'Data' },
    { from: 'Liter', to: 'Gallon', slug: 'liter-to-gallon-us', cat: 'Volume' },
    { from: 'Mile per Hour', to: 'Kilometer per Hour', slug: 'mile-per-hour-to-kilometer-per-hour', cat: 'Speed' },
    { from: 'Meter', to: 'Foot', slug: 'meter-to-foot', cat: 'Length' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converter', item: 'https://devtransform-hub.vercel.app/tools/unit-converter/' },
      { '@type': 'ListItem', position: 3, name: 'Directory', item: 'https://devtransform-hub.vercel.app/convert/directory/' },
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
          <Link href="/tools/unit-converter/" className="hover:text-emerald-600 dark:hover:text-brand-emerald transition-colors">Unit Converter</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Directory</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-brand-emerald/30 text-emerald-700 dark:text-brand-emerald text-xs font-mono font-medium">
            <Scale className="w-3.5 h-3.5" />
            <span>Precision Metric & Imperial Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Unit Conversion Directory
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-zinc-400">
            Browse 350+ instant unit conversions across 8 physical categories. Every conversion pair features high-precision multipliers, mathematical formulas, and zero-latency client-side calculation.
          </p>
        </div>

        {/* Popular Conversions */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              Most Popular Measurement Conversions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularPairs.map((p) => (
              <Link
                key={p.slug}
                href={`/convert/${p.slug}/`}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-brand-emerald transition-colors">
                    {p.from} &rarr; {p.to}
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Category: {p.cat}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Category-by-Category Conversion Grids */}
        <div className="space-y-12">
          {categories.map((cat) => {
            const pairsInCat = allPairs.filter((p) => p.from.category === cat.id);
            const Icon = CATEGORY_ICONS[cat.id] || Scale;

            if (pairsInCat.length === 0) return null;

            return (
              <section key={cat.id} className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-zinc-800 pb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-brand-emerald text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                      {cat.name} ({pairsInCat.length} Pairs)
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {pairsInCat.map((pair) => (
                    <Link
                      key={pair.slug}
                      href={`/convert/${pair.slug}/`}
                      className="p-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-all flex items-center justify-between text-xs font-mono group"
                    >
                      <span className="text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        {pair.from.name} &rarr; {pair.to.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 dark:text-zinc-600 group-hover:text-emerald-600 dark:group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
