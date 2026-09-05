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
import { InteractivePercentageSlider } from '@/components/percentage/InteractivePercentageSlider';
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
  if (!prob) return { title: 'Percentage Calculator | DevTransform' };

  const title = `What is ${prob.percent}% of ${prob.baseNumber}? (${prob.result}) + Excel Formula & Table`;
  const description = `${prob.percent}% of ${prob.baseNumber} = ${prob.result}. Includes copyable Excel formula (=A1*${prob.percent}%), step-by-step mathematical breakdown, discount and sales tax tables, and interactive slider.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/percentage/${prob.slug}/`;

  return {
    title,
    description,
    keywords: [
      `what is ${prob.percent} percent of ${prob.baseNumber}`,
      `${prob.percent}% of ${prob.baseNumber}`,
      `calculate ${prob.percent}% of ${prob.baseNumber}`,
      'excel percentage formula',
      'discount calculator',
      'sales tax formula',
      'math percentage solver',
      'percentage calculator',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform Percentage Solver',
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
    url: `https://devtransform-hub.vercel.app/percentage/${prob.slug}/`,
    description: prob.title,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Percentages', item: 'https://devtransform-hub.vercel.app/#tools' },
      { '@type': 'ListItem', position: 3, name: `${prob.percent}% of ${prob.baseNumber}`, item: `https://devtransform-hub.vercel.app/percentage/${prob.slug}/` },
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
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
            Calculate {prob.percent}% of {prob.baseNumber} — Result: <strong className="text-brand-emerald">{prob.result}</strong>. Step-by-step formula, discount math, and financial examples.
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
            <span>Step-by-Step Solution & Formula</span>
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
            <span>Real-World Scenarios & Financial Examples</span>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-300 font-mono">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">🏷️ {prob.percent}% Discounted Price:</span>
              <span className="font-bold text-emerald-400">${discountPrice.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">📈 {prob.percent}% Added / Sales Tax (VAT):</span>
              <span className="font-bold text-sky-400">${addedPrice.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">💰 Discount / Difference Amount:</span>
              <span className="font-bold text-amber-400">${prob.result}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator & Developer Snippets */}
      <InteractivePercentageSlider
        initialPercent={prob.percent}
        initialBase={prob.baseNumber}
      />

      {/* 10-Tier Discount, Tax & Rate Reference Table */}
      <section className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Calculator className="w-4 h-4 text-brand-emerald" />
            <span>Percentage & Discount Reference Table for ${prob.baseNumber.toLocaleString()}</span>
          </div>
          <Link
            href="/percentage/directory/"
            className="text-xs font-mono text-brand-emerald hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950/60">
                <th className="p-3">Percentage</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Sale Price (-%)</th>
                <th className="p-3">With Tax (+%)</th>
                <th className="p-3">Quick Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {[5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((tierPercent) => {
                const tierAmount = (tierPercent * prob.baseNumber) / 100;
                const tierDiscount = prob.baseNumber - tierAmount;
                const tierTax = prob.baseNumber + tierAmount;
                const isCurrent = tierPercent === prob.percent;

                return (
                  <tr
                    key={tierPercent}
                    className={`hover:bg-zinc-800/40 transition-colors ${
                      isCurrent ? 'bg-brand-emerald/10 font-bold text-white' : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-brand-emerald">
                      {tierPercent}%
                      {isCurrent && <span className="ml-2 text-[10px] bg-brand-emerald/20 text-brand-emerald px-1.5 py-0.5 rounded">Current</span>}
                    </td>
                    <td className="p-3">${tierAmount.toLocaleString()}</td>
                    <td className="p-3 text-emerald-400">${tierDiscount.toLocaleString()}</td>
                    <td className="p-3 text-sky-400">${tierTax.toLocaleString()}</td>
                    <td className="p-3">
                      <Link
                        href={`/percentage/what-is-${tierPercent}-percent-of-${prob.baseNumber}/`}
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center space-x-1 group"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        faqs={faqs}
        fromName={`${prob.percent}%`}
        toName={`${prob.baseNumber}`}
      />
    </div>
  );
}
