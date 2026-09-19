import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllGitignoreTemplates } from '@/lib/gitignore-data';
import { GitignoreDirectoryClient } from '@/components/gitignore/GitignoreDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  GitBranch,
  Terminal,
  Layers,
  ChevronRight,
  ShieldCheck,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Git .gitignore Templates Directory & Best Practices (2025/2026 Developer Guide) | DevTransform',
  description: 'Verified .gitignore templates for Node.js, Python, Next.js, Go, Rust, Java, macOS, Terraform, and Docker. Download clean templates and learn how to untrack cached files.',
  keywords: [
    'gitignore templates directory',
    'nodejs gitignore',
    'python gitignore',
    'nextjs gitignore',
    'react gitignore',
    'git remove cached untrack',
    'dockerignore template',
    'terraform gitignore',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/gitignore/directory/',
  },
  openGraph: {
    title: 'Git .gitignore Templates Directory & Best Practices | DevTransform',
    description: 'Instant copy-paste .gitignore templates for every programming language and framework.',
    url: 'https://devtransform-hub.vercel.app/gitignore/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Git .gitignore Templates Directory & Best Practices',
    description: 'Instant copy-paste .gitignore templates for every programming language and framework.',
  },
};

export default function GitignoreDirectoryPage() {
  const templates = getAllGitignoreTemplates();

  const directoryFaqs = [
    {
      question: 'How do I remove files from Git that are already committed after adding them to .gitignore?',
      answer: 'Git continues tracking files that were already committed before the .gitignore rule was added. To untrack them without deleting your local files, run: `git rm -r --cached . && git add . && git commit -m "Untrack ignored files"`.'
    },
    {
      question: 'What is the difference between .gitignore and ~/.gitignore_global?',
      answer: 'Project `.gitignore` is committed to the repository and shared with the entire team. `~/.gitignore_global` applies only to your local workstation across all repositories (ideal for `.DS_Store`, local editor configs, or OS metadata).'
    },
    {
      question: 'What does the exclamation mark (!) mean in .gitignore?',
      answer: 'An exclamation mark negates a previous ignore rule. For example: `build/*` ignores everything in build, but `!build/keep.txt` re-includes `keep.txt`.'
    },
    {
      question: 'Should I commit .env files to GitHub?',
      answer: 'Never commit `.env` or `.env.local` containing live API keys, database credentials, or secret tokens. Always create and commit a sanitized `.env.example` file instead.'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Git .gitignore Templates Directory & Best Practices',
    description: 'Curated collection of verified .gitignore templates for developers, DevOps engineers, and designers.',
    url: 'https://devtransform-hub.vercel.app/gitignore/directory/',
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
          <span className="text-emerald-400 font-medium">.gitignore Directory</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Version Control &amp; Repository Hygiene</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Git .gitignore Templates Directory
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Curated, battle-tested `.gitignore` templates for every major programming language, web framework, operating system, and cloud tool. Keep repository sizes slim, eliminate merge conflicts, and prevent leaking secret credentials.
          </p>
        </div>

        {/* Directory Grid */}
        <GitignoreDirectoryClient templates={templates} />

        {/* Pattern Syntax Cheatsheet Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                .gitignore Pattern Syntax Cheatsheet
              </h2>
              <p className="text-xs text-slate-400">
                Mastering glob patterns, directory matching, and rule negations
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Pattern</th>
                  <th className="pb-3 font-semibold">Matching Behavior</th>
                  <th className="pb-3 font-semibold">Example Matches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <tr>
                  <td className="py-3 text-emerald-400">node_modules/</td>
                  <td className="py-3 text-slate-400 font-sans">Matches directory only (and all contents recursively)</td>
                  <td className="py-3 text-sky-400 font-sans">Any folder named node_modules at any depth</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400">*.log</td>
                  <td className="py-3 text-slate-400 font-sans">Wildcard matching any file ending in .log</td>
                  <td className="py-3 text-sky-400 font-sans">error.log, debug.log, npm-debug.log</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400">/build</td>
                  <td className="py-3 text-slate-400 font-sans">Leading slash pins match strictly to the repository root</td>
                  <td className="py-3 text-sky-400 font-sans">Matches /build, but ignores /packages/api/build</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400">**/temp</td>
                  <td className="py-3 text-slate-400 font-sans">Double asterisk matches zero or more leading directories</td>
                  <td className="py-3 text-sky-400 font-sans">temp, a/temp, a/b/c/temp</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400">!important.log</td>
                  <td className="py-3 text-slate-400 font-sans">Exclamation mark negates ignore rule (forces file tracking)</td>
                  <td className="py-3 text-sky-400 font-sans">Re-includes important.log even if *.log is ignored</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions About .gitignore Files
          </h2>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}
