import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPercentageProblems } from '@/lib/percentage-matrix';
import { Percent, Calculator, ArrowRight, Sparkles, FileSpreadsheet, CheckCircle2, Bookmark } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Percentage Calculations Directory: 1,100+ Solved Math Problems & Formulas | DevTransform',
  description: 'Complete directory of solved percentage calculations with copyable Excel formulas, step-by-step mathematical proofs, discount charts, and tax calculators.',
  keywords: [
    'percentage calculation directory',
    'solved math percentages',
    'excel percentage formulas',
    'discount percentage calculator list',
    'what is percent of number directory',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/percentage/directory/',
  },
  openGraph: {
    title: 'Percentage Calculations Directory: 1,100+ Solved Math Problems',
    description: 'Explore 1,100+ solved percentage problems with instant copyable Excel formulas and step-by-step mathematical breakdowns.',
    url: 'https://devtransform-hub.vercel.app/percentage/directory/',
    type: 'website',
  },
};

export default function PercentageDirectoryPage() {
  const allProblems = getAllPercentageProblems();

  // Highlighted high-traffic problems from search queries
  const topQueries = [
    { p: 10, b: 10000, res: 1000 },
    { p: 30, b: 2000, res: 600 },
    { p: 20, b: 5000, res: 1000 },
    { p: 40, b: 2000, res: 800 },
    { p: 10, b: 1000, res: 100 },
    { p: 25, b: 5000, res: 1250 },
    { p: 30, b: 10000, res: 3000 },
    { p: 20, b: 10000, res: 2000 },
    { p: 10, b: 2000, res: 200 },
    { p: 15, b: 1000, res: 150 },
    { p: 50, b: 5000, res: 2500 },
    { p: 5, b: 10000, res: 500 },
  ];

  // Rate brackets
  const keyRates = [5, 10, 15, 20, 25, 30, 40, 50, 75];

  // Key base numbers
  const keyBases = [100, 500, 1000, 2000, 5000, 10000];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Percentage Calculator', item: 'https://devtransform-hub.vercel.app/tools/percentage-calculator/' },
      { '@type': 'ListItem', position: 3, name: 'Directory', item: 'https://devtransform-hub.vercel.app/percentage/directory/' },
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
          <Link href="/tools/percentage-calculator/" className="hover:text-emerald-600 dark:hover:text-brand-emerald transition-colors">Percentage Calculator</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Directory</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-brand-emerald/30 text-emerald-700 dark:text-brand-emerald text-xs font-mono font-medium">
            <Percent className="w-3.5 h-3.5" />
            <span>Mathematical Index & Solver</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Percentage Calculations Directory
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-zinc-400">
            Browse 1,100+ fully-solved mathematical percentage problems. Every calculation includes copyable Excel and Google Sheets formulas, step-by-step solutions, and discount & sales tax breakdowns.
          </p>
        </div>

        {/* Most Searched Calculations Grid */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              Most Frequently Searched Calculations
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topQueries.map((q) => (
              <Link
                key={`what-is-${q.p}-percent-of-${q.b}`}
                href={`/percentage/what-is-${q.p}-percent-of-${q.b}/`}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-brand-emerald transition-colors">
                    {q.p}% of {q.b.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono text-emerald-600 dark:text-brand-emerald font-semibold">
                    = {q.res.toLocaleString()}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Excel Formula Quick Reference Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-zinc-900/40 to-zinc-900/60 border border-emerald-500/20 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-brand-emerald" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-mono">
              Universal Excel & Google Sheets Percentage Formulas
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="text-slate-400 dark:text-zinc-500">Calculate P% of Amount:</span>
              <div className="font-bold text-emerald-600 dark:text-brand-emerald text-sm select-all">
                =A1 * 10%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="text-slate-400 dark:text-zinc-500">Discounted Sale Price:</span>
              <div className="font-bold text-emerald-600 dark:text-brand-emerald text-sm select-all">
                =A1 * (1 - 20%)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="text-slate-400 dark:text-zinc-500">Add Sales Tax:</span>
              <div className="font-bold text-emerald-600 dark:text-brand-emerald text-sm select-all">
                =A1 * (1 + 8.5%)
              </div>
            </div>
          </div>
        </div>

        {/* Rate-by-Rate Directory Sections */}
        <div className="space-y-10">
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              Calculations by Percentage Rate
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Select standard rate tiers to view calculations across different values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyRates.map((rate) => {
              const problemsForRate = allProblems.filter((p) => p.percent === rate).slice(0, 10);

              return (
                <div
                  key={rate}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-brand-emerald font-mono font-bold text-sm">
                        {rate}%
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {rate}% Calculations
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                      Dec: {(rate / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {problemsForRate.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/percentage/${p.slug}/`}
                        className="text-xs font-mono text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors group"
                      >
                        <span>{p.percent}% of {p.baseNumber.toLocaleString()}</span>
                        <span className="text-emerald-600 dark:text-brand-emerald font-semibold">
                          = {p.result.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Base-by-Base Directory Sections */}
        <div className="space-y-10">
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              Calculations for Round Base Amounts
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Calculate exact discounts and markdowns for benchmark sums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyBases.map((base) => {
              const problemsForBase = allProblems.filter((p) => p.baseNumber === base).slice(0, 10);

              return (
                <div
                  key={base}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Base: ${base.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {problemsForBase.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/percentage/${p.slug}/`}
                        className="text-xs font-mono text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors group"
                      >
                        <span>{p.percent}% of ${p.baseNumber.toLocaleString()}</span>
                        <span className="text-emerald-600 dark:text-brand-emerald font-semibold">
                          = ${p.result.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
