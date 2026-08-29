import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllPercentageProblems,
  getPercentageProblem,
  PercentageProblem,
} from '@/lib/percentage-matrix';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Percent,
  Calculator,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const problems = getAllPercentageProblems();
  return problems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const prob = getPercentageProblem(params.slug);
  if (!prob) return { title: 'Percentage Calculator' };

  const title = `What is ${prob.percent}% of ${prob.baseNumber}? (${prob.result}) - ${prob.titleTr}`;
  const description = `${prob.percent}% of ${prob.baseNumber} is ${prob.result}. Step-by-step mathematical explanation, formula, discount calculator, and percentage table.`;
  const canonicalUrl = `https://zeroupload-edb.pages.dev/percentage/${prob.slug}/`;

  return {
    title,
    description,
    keywords: [
      `what is ${prob.percent} percent of ${prob.baseNumber}`,
      `${prob.percent}% of ${prob.baseNumber}`,
      `calculate ${prob.percent}% of ${prob.baseNumber}`,
      `${prob.baseNumber} sayısının yüzde ${prob.percent}i`,
      'percentage calculator',
      'how to calculate percentages',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload Math Hub',
    },
  };
}

export default function PercentageProblemPage({ params }: PageProps) {
  const prob = getPercentageProblem(params.slug);
  if (!prob) notFound();

  const remaining = prob.baseNumber - prob.result;
  const discountPrice = prob.baseNumber - prob.result;
  const addedPrice = prob.baseNumber + prob.result;

  const faqs = [
    {
      question: `How do you calculate ${prob.percent}% of ${prob.baseNumber}?`,
      answer: `To calculate ${prob.percent}% of ${prob.baseNumber}: Divide ${prob.percent} by 100 to get ${(prob.percent / 100).toFixed(4)}, then multiply by ${prob.baseNumber}. Result: ${prob.result}.`,
    },
    {
      question: `If an item costs $${prob.baseNumber} with a ${prob.percent}% discount, how much is it?`,
      answer: `The discount amount is $${prob.result}. The final sale price is $${prob.baseNumber} - $${prob.result} = $${discountPrice.toFixed(2)}.`,
    },
    {
      question: `If ${prob.percent}% sales tax is added to $${prob.baseNumber}, what is the total?`,
      answer: `The tax amount is $${prob.result}. The total price is $${prob.baseNumber} + $${prob.result} = $${addedPrice.toFixed(2)}.`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Percentage Calculator: ${prob.title}`,
    url: `https://zeroupload-edb.pages.dev/percentage/${prob.slug}/`,
    description: prob.title,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zeroupload-edb.pages.dev/' },
      { '@type': 'ListItem', position: 2, name: 'Percentages', item: 'https://zeroupload-edb.pages.dev/#tools' },
      { '@type': 'ListItem', position: 3, name: `${prob.percent}% of ${prob.baseNumber}`, item: `https://zeroupload-edb.pages.dev/percentage/${prob.slug}/` },
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
            <Link href="/tools/percentage-calculator/" className="hover:text-zinc-200 transition-colors">Percentages</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold font-mono">{prob.percent}% of {prob.baseNumber}</span>
          </nav>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant In-Browser Math Engine</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            What is {prob.percent}% of {prob.baseNumber}?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {prob.titleTr} — Sonuç: <strong className="text-brand-emerald">{prob.result}</strong>. Adım adım çözüm, formül ve indirim hesaplaması.
          </p>
        </div>
      </div>

      {/* Large Featured Result Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900/80 via-zinc-900/50 to-zinc-950 border border-brand-emerald/40 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Answer:</span>
            <div className="text-4xl sm:text-6xl font-black font-mono text-brand-emerald tracking-tight">
              {prob.result}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1 font-mono text-xs text-zinc-300">
            <div className="text-zinc-500 text-[11px]">Mathematical Formula:</div>
            <div className="text-sm font-bold text-white">{prob.formula}</div>
          </div>
        </div>

        {/* Visual Percentage Bar Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>{prob.percent}% ({prob.result})</span>
            <span>100% ({prob.baseNumber})</span>
          </div>
          <div className="w-full h-3.5 bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-brand-emerald via-teal-400 to-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(prob.percent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step-by-Step Math Workout & Real-World Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step-by-Step Workout */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4 shadow-lg">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
            <span>Adım Adım Çözüm / Step-by-Step</span>
          </div>

          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed font-sans">
            {prob.stepByStep.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center font-mono font-bold text-[10px] text-brand-emerald flex-shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Real-World Scenarios */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4 shadow-lg">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-sky-400 uppercase">
            <TrendingUp className="w-4 h-4" />
            <span>Günlük Hayattan Örnekler / Real-World Scenarios</span>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-300 font-mono">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">🏷️ %{prob.percent} İndirimli Fiyat:</span>
              <span className="font-bold text-emerald-400">₺{discountPrice.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">📈 %{prob.percent} Zam / KDV Eklenmiş:</span>
              <span className="font-bold text-sky-400">₺{addedPrice.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">💰 İndirim / Fark Tutarı:</span>
              <span className="font-bold text-amber-400">₺{prob.result}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        fromName={`${prob.percent}%`}
        toName={`${prob.baseNumber}`}
      />
    </div>
  );
}
