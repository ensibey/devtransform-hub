import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllRegexPatterns, getRegexPattern } from '@/lib/regex-matrix';
import { CopyButton } from '@/components/shared/CopyButton';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';
import { Code2, Search, CheckCircle2, XCircle, ChevronRight, Sparkles, Terminal } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const patterns = getAllRegexPatterns();
  return patterns.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const regex = getRegexPattern(params.slug);
  if (!regex) return {};

  return {
    title: `${regex.title} - Online Tester & Cheat Sheet`,
    description: `${regex.description} Includes interactive tester, regex explanation, and copyable snippets for JS, Python, Go, and PHP.`,
    keywords: [
      regex.title.toLowerCase(),
      'regex tester',
      'regular expression',
      'regex pattern',
      regex.category,
    ],
    openGraph: {
      title: `${regex.title} | ZeroUpload`,
      description: regex.description,
      url: `https://devtransform-hub.vercel.app/regex/${regex.slug}/`,
      type: 'website',
    },
  };
}

export default function RegexPage({ params }: Props) {
  const regex = getRegexPattern(params.slug);
  if (!regex) notFound();

  const jsSnippet = `const regex = /${regex.pattern}/${regex.flags};\nconst isValid = regex.test("${regex.sampleMatch}");\nconsole.log(isValid); // true`;
  const pySnippet = `import re\n\npattern = r"${regex.pattern}"\nmatch = re.match(pattern, "${regex.sampleMatch}")\nprint(bool(match)) # True`;
  const goSnippet = `package main\nimport (\n  "fmt"\n  "regexp"\n)\n\nfunc main() {\n  re := regexp.MustCompile(\`${regex.pattern}\`)\n  fmt.Println(re.MatchString("${regex.sampleMatch}"))\n}`;

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumb & Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-400">Regex Library</span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">{regex.title}</span>
        </div>
        <PrivacyBadge />
      </div>

      {/* Main Heading */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 uppercase font-bold">
            {regex.category}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {regex.title}
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          {regex.description}
        </p>
      </div>

      {/* Primary Pattern Box */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold flex items-center space-x-1.5">
            <Search className="w-4 h-4" />
            <span>Regular Expression Pattern:</span>
          </span>
          <CopyButton text={`/${regex.pattern}/${regex.flags}`} />
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm sm:text-base font-mono text-brand-emerald font-bold break-all select-all">
          /{regex.pattern}/{regex.flags}
        </div>
      </div>

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Valid Match Example */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Valid Match Example:</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-white">
            {regex.sampleMatch}
          </div>
        </div>

        {/* Failed Match Example */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-rose-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold">
            <XCircle className="w-4 h-4" />
            <span>Invalid / Non-Match Example:</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400">
            {regex.sampleFail}
          </div>
        </div>
      </div>

      {/* Detailed Pattern Breakdown */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Regex Syntax Breakdown & Explanation</span>
        </h3>
        <ul className="space-y-2 text-xs font-mono text-zinc-300">
          {regex.explanation.map((exp, idx) => (
            <li key={idx} className="flex items-start space-x-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-brand-emerald font-bold">•</span>
              <span>{exp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Implementation Code Snippets */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-brand-emerald" />
          <span>Implementation in Popular Languages</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
          {/* JavaScript */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-bold text-white">JavaScript / TypeScript</span>
              <CopyButton text={jsSnippet} />
            </div>
            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-300 overflow-x-auto">
              {jsSnippet}
            </pre>
          </div>

          {/* Python */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-bold text-white">Python (re)</span>
              <CopyButton text={pySnippet} />
            </div>
            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-300 overflow-x-auto">
              {pySnippet}
            </pre>
          </div>

          {/* Go */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-bold text-white">Go (regexp)</span>
              <CopyButton text={goSnippet} />
            </div>
            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-300 overflow-x-auto">
              {goSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
