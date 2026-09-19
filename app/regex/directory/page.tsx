import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegexPatterns } from '@/lib/regex-matrix';
import { RegexDirectoryClient } from '@/components/regex/RegexDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Code2,
  Terminal,
  Layers,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Common Regular Expressions (RegEx) Library & Syntax Cheatsheet | DevTransform',
  description: 'Production-tested regular expressions (RegEx) for emails, strong passwords, URLs, phone numbers, UUIDs, IP addresses, dates, and slugs. With interactive copy and syntax breakdowns.',
  keywords: [
    'regular expressions cheatsheet',
    'common regex patterns',
    'email regex pattern',
    'password validation regex',
    'url validation regex',
    'ipv4 address regex',
    'regex tester examples',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/regex/directory/',
  },
  openGraph: {
    title: 'Common Regular Expressions (RegEx) Library & Syntax Cheatsheet | DevTransform',
    description: 'Instant copyable regular expressions for form validation, web security, and data parsing.',
    url: 'https://devtransform-hub.vercel.app/regex/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Common Regular Expressions (RegEx) Library & Syntax Cheatsheet',
    description: 'Instant copyable regular expressions for form validation, web security, and data parsing.',
  },
};

export default function RegexDirectoryPage() {
  const patterns = getAllRegexPatterns();

  const directoryFaqs = [
    {
      question: 'What is the most accurate regex for validating email addresses?',
      answer: 'For general web form validation, `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$` provides the optimal balance between strictness and compatibility without rejecting valid modern domains.'
    },
    {
      question: 'What is ReDoS (Regular Expression Denial of Service) and how do I prevent it?',
      answer: 'ReDoS occurs when a regular expression with catastrophic backtracking (nested quantifiers like `(a+)+$`) processes ambiguous non-matching inputs, causing the engine to burn 100% CPU. Avoid nested wildcards and specify reasonable input length limits before evaluating regex.'
    },
    {
      question: 'What is the difference between positive lookahead (?=...) and positive lookbehind (?<=...)?',
      answer: 'Lookaheads assert that what follows immediately matches the condition without consuming characters in the match. Lookbehinds assert that what precedes immediately matches the condition. Lookaheads are commonly used to enforce password strength rules (e.g. at least one digit `(?=.*\\d)`).'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Common Regular Expressions (RegEx) Library & Syntax Cheatsheet',
    description: 'Curated collection of verified regular expression patterns, sample matches, and syntax explanations.',
    url: 'https://devtransform-hub.vercel.app/regex/directory/',
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
          <span className="text-indigo-400 font-medium">Regex Directory</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Pattern Library &amp; Syntax Reference</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Common Regular Expressions (RegEx) Library
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Production-tested regular expressions for client-side forms, backend validation, and data extraction. Tested across JavaScript, Python, Go, PHP, and Java with sample matches and flag explanations.
          </p>
        </div>

        {/* Directory Grid */}
        <RegexDirectoryClient patterns={patterns} />

        {/* Syntax Cheatsheet Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Regular Expression Syntax Quick Reference
              </h2>
              <p className="text-xs text-slate-400">
                Core metacharacters, quantifiers, and assertion syntax
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Token</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <tr>
                  <td className="py-3 text-indigo-400 font-bold">^ / $</td>
                  <td className="py-3 text-slate-400 font-sans">Start of line / End of line anchors</td>
                  <td className="py-3 text-emerald-400">^https?</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-bold">\d / \D</td>
                  <td className="py-3 text-slate-400 font-sans">Any digit [0-9] / Any non-digit</td>
                  <td className="py-3 text-emerald-400">\d{4}-\d{2}-\d{2}</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-bold">\w / \W</td>
                  <td className="py-3 text-slate-400 font-sans">Word character [a-zA-Z0-9_] / Non-word</td>
                  <td className="py-3 text-emerald-400">^\w+$</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-bold">\s / \S</td>
                  <td className="py-3 text-slate-400 font-sans">Whitespace character (space, tab, newline) / Non-whitespace</td>
                  <td className="py-3 text-emerald-400">\s+</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-bold">*, +, ?</td>
                  <td className="py-3 text-slate-400 font-sans">0 or more (*), 1 or more (+), 0 or 1 optional (?)</td>
                  <td className="py-3 text-emerald-400">colou?r</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400 font-bold">(?=...)</td>
                  <td className="py-3 text-slate-400 font-sans">Positive lookahead assertion (must be followed by ...)</td>
                  <td className="py-3 text-emerald-400">(?=.*[A-Z])</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions About Regular Expressions
          </h2>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}
