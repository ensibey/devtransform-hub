import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllChmods, getChmodBySlug, CHMOD_DATA } from '@/lib/chmod-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  FolderLock,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const chmods = getAllChmods();
  return chmods.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getChmodBySlug(params.slug);
  if (!item) return { title: 'chmod Permission Details' };

  const title = `chmod ${item.octal} (${item.symbolic}): Permissions, Commands & Security Guide | DevTransform`;
  const description = `What does chmod ${item.octal} (${item.symbolic}) mean? Permission breakdown for Owner, Group, Others, recursive chmod commands, and security best practices.`;
  const canonicalUrl = `https://devtransform-hub.vercel.app/chmod/${item.slug}/`;

  return {
    title,
    description,
    keywords: [
      `chmod ${item.octal}`,
      `what is chmod ${item.octal}`,
      `chmod ${item.octal} meaning`,
      `chmod ${item.symbolic}`,
      `chmod ${item.octal} recursive`,
      `linux permission ${item.octal}`,
      `chmod ${item.octal} security`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'DevTransform Developer Utilities',
    },
  };
}

export default function ChmodDetailPage({ params }: PageProps) {
  const item = getChmodBySlug(params.slug);
  if (!item) notFound();

  const isDangerous = item.securityRating === 'Dangerous';
  const badgeColor =
    item.securityRating === 'Dangerous'
      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
      : item.securityRating === 'Elevated'
      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      : item.securityRating === 'Safe'
      ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

  const otherChmods = CHMOD_DATA.filter((c) => c.slug !== item.slug).slice(0, 6);

  const faqs = [
    {
      question: `What permissions does chmod ${item.octal} grant?`,
      answer: `${item.summary} In symbolic notation, this is represented as "${item.symbolic}".`,
    },
    {
      question: `How do I apply chmod ${item.octal} to a file or directory?`,
      answer: `To apply to a single file, run "${item.commands.singleFile}". For recursive changes on a directory, run "${item.commands.recursive}".`,
    },
    {
      question: `Is chmod ${item.octal} safe for production web servers?`,
      answer: isDangerous
        ? `No! Chmod ${item.octal} is NOT safe for production. It grants full write access to all visitors and local processes.`
        : `Chmod ${item.octal} is rated as ${item.securityRating}. ${item.description}`,
    },
  ];

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `chmod ${item.octal} (${item.symbolic}) Linux Permission Guide`,
    description: item.description,
    url: `https://devtransform-hub.vercel.app/chmod/${item.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devtransform-hub.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'chmod Permissions Directory', item: 'https://devtransform-hub.vercel.app/chmod/directory/' },
      { '@type': 'ListItem', position: 3, name: `chmod ${item.octal}`, item: `https://devtransform-hub.vercel.app/chmod/${item.slug}/` },
    ],
  };

  return (
    <div className="space-y-8 py-2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header & Breadcrumbs */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/chmod/directory/" className="hover:text-zinc-200 transition-colors">chmod Directory</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold">chmod {item.octal}</span>
          </nav>

          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${badgeColor}`}>
            {isDangerous ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>Security: {item.securityRating}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            chmod {item.octal} — {item.symbolic}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {item.summary}
          </p>
        </div>
      </div>

      {/* Permission Matrix Visual Table */}
      <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FolderLock className="w-5 h-5 text-brand-emerald" />
          <span>Interactive Permission Matrix (rwx)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-mono text-zinc-400">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-center">Read (r - 4)</th>
                <th className="py-2.5 px-3 text-center">Write (w - 2)</th>
                <th className="py-2.5 px-3 text-center">Execute (x - 1)</th>
                <th className="py-2.5 px-3 text-right">Octal Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-mono">
              <tr>
                <td className="py-3 px-3 font-bold text-zinc-200">Owner (User)</td>
                <td className="py-3 px-3 text-center">
                  {item.owner.read ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-center">
                  {item.owner.write ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-center">
                  {item.owner.execute ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-right font-bold text-brand-emerald">
                  {(item.owner.read ? 4 : 0) + (item.owner.write ? 2 : 0) + (item.owner.execute ? 1 : 0)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-zinc-200">Group</td>
                <td className="py-3 px-3 text-center">
                  {item.group.read ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-center">
                  {item.group.write ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-center">
                  {item.group.execute ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-right font-bold text-brand-emerald">
                  {(item.group.read ? 4 : 0) + (item.group.write ? 2 : 0) + (item.group.execute ? 1 : 0)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-zinc-200">Others (Public)</td>
                <td className="py-3 px-3 text-center">
                  {item.others.read ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-center">
                  {item.others.write ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-center">
                  {item.others.execute ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-zinc-600 inline" />}
                </td>
                <td className="py-3 px-3 text-right font-bold text-brand-emerald">
                  {(item.others.read ? 4 : 0) + (item.others.write ? 2 : 0) + (item.others.execute ? 1 : 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Commands */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-emerald" />
          <span>Copyable chmod {item.octal} Commands</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200">Apply to Single File</span>
              <CopyButton text={item.commands.singleFile} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-emerald-400">
              <code>{item.commands.singleFile}</code>
            </div>
          </div>

          <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200">Apply Recursively to Directory</span>
              <CopyButton text={item.commands.recursive} />
            </div>
            <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-amber-300">
              <code>{item.commands.recursive}</code>
            </div>
          </div>

          {item.commands.findDirectories && (
            <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200">Only Apply to Directories (find)</span>
                <CopyButton text={item.commands.findDirectories} />
              </div>
              <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-sky-300 overflow-x-auto whitespace-pre">
                <code>{item.commands.findDirectories}</code>
              </div>
            </div>
          )}

          {item.commands.findFiles && (
            <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200">Only Apply to Files (find)</span>
                <CopyButton text={item.commands.findFiles} />
              </div>
              <div className="bg-black/60 border border-border/80 rounded-lg p-3 font-mono text-xs text-violet-300 overflow-x-auto whitespace-pre">
                <code>{item.commands.findFiles}</code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Use Cases & Security Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Recommended Real-World Use Cases</h3>
          <ul className="space-y-2 text-xs text-zinc-300 font-mono">
            {item.recommendedFor.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-emerald">&bull;</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-100 border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Security Consideration</h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {item.securityWarning || item.description}
          </p>
        </div>
      </div>

      {/* FAQ */}
      <FaqAccordion
        faqs={faqs}
        title={`chmod ${item.octal} Questions & Answers`}
        subtitle="Common questions regarding Linux permissions, security risks, and recursive chmod commands."
      />

      {/* Related Chmod Values */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Explore Other chmod Permissions</h2>
          <Link href="/chmod/directory/" className="text-xs font-mono text-brand-emerald hover:underline flex items-center gap-1">
            <span>View All chmod Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherChmods.map((c) => (
            <Link
              key={c.slug}
              href={`/chmod/${c.slug}/`}
              className="group p-3 rounded-lg border border-border bg-surface-100 hover:border-brand-emerald/40 transition-colors"
            >
              <span className="text-base font-bold font-mono text-brand-emerald group-hover:text-emerald-300 block">
                chmod {c.octal}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                {c.symbolic}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
