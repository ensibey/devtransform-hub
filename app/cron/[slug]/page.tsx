import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllCronSchedules,
  getCronScheduleBySlug,
  CRON_SCHEDULES,
} from '@/lib/cron-data';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Clock,
  Terminal,
  Calendar,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const schedules = getAllCronSchedules();
  return schedules.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getCronScheduleBySlug(params.slug);
  if (!item) return { title: 'Cron Schedule Expression' };

  const title = `${item.expression} Cron Schedule: "${item.title}" Meaning & Examples (${item.titleTr})`;
  const description = `What does the cron schedule "${item.expression}" mean? Plain English explanation, next execution dates, crontab, GitHub Actions, and Kubernetes examples.`;
  const canonicalUrl = `https://zeroupload-edb.pages.dev/cron/${item.slug}/`;

  return {
    title,
    description,
    keywords: [
      `cron ${item.expression}`,
      `cron schedule ${item.expression}`,
      `crontab ${item.expression}`,
      `${item.expression} meaning`,
      `${item.title.toLowerCase()}`,
      `cron ${item.titleTr.toLowerCase()}`,
      'cron generator',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ZeroUpload Cron Explainer',
    },
  };
}

export default function CronSchedulePage({ params }: PageProps) {
  const item = getCronScheduleBySlug(params.slug);
  if (!item) notFound();

  const parts = item.expression.split(' ');
  const crontabSnippet = `${item.expression} /usr/bin/python3 /opt/scripts/backup.py >> /var/log/cron.log 2>&1`;
  const githubActionsSnippet = `on:\n  schedule:\n    - cron: '${item.expression}'`;
  const k8sSnippet = `apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: scheduled-task\nspec:\n  schedule: "${item.expression}"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n          - name: runner\n            image: alpine\n          restartPolicy: OnFailure`;

  const faqs = [
    {
      question: `What does the cron expression "${item.expression}" mean?`,
      answer: `${item.description} In Turkish: ${item.descriptionTr}`,
    },
    {
      question: `How do I add this cron expression to my Linux server?`,
      answer: `Run 'crontab -e' in your Linux terminal and paste '${item.expression} /path/to/your/command.sh' at the bottom of the file.`,
    },
    {
      question: `Can I use this in GitHub Actions?`,
      answer: `Yes, add 'on: schedule: - cron: "${item.expression}"' to your .github/workflows/main.yml file. Note that GitHub Actions cron schedules use UTC timezone.`,
    },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${item.expression} Cron Schedule Explainer`,
    url: `https://zeroupload-edb.pages.dev/cron/${item.slug}/`,
    description: item.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zeroupload-edb.pages.dev/' },
      { '@type': 'ListItem', position: 2, name: 'Cron Schedules', item: 'https://zeroupload-edb.pages.dev/#tools' },
      { '@type': 'ListItem', position: 3, name: item.expression, item: `https://zeroupload-edb.pages.dev/cron/${item.slug}/` },
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
            <Link href="/#tools" className="hover:text-zinc-200 transition-colors">Cron Explainer</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-brand-emerald font-semibold font-mono">{item.expression}</span>
          </nav>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Standard POSIX / Crontab Syntax</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            {item.expression}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-sans font-medium">
            &ldquo;{item.title}&rdquo; — {item.description} ({item.titleTr})
          </p>
        </div>
      </div>

      {/* 5-Field Visual Anatomy Breakdown */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-brand-emerald uppercase">
          <Clock className="w-4 h-4" />
          <span>Crontab 5-Field Breakdown</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="text-2xl font-extrabold font-mono text-brand-emerald">{parts[0] || '*'}</div>
            <div className="text-[11px] font-bold text-zinc-200 uppercase font-mono">Minute</div>
            <div className="text-[10px] text-zinc-500">{item.minute}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="text-2xl font-extrabold font-mono text-sky-400">{parts[1] || '*'}</div>
            <div className="text-[11px] font-bold text-zinc-200 uppercase font-mono">Hour</div>
            <div className="text-[10px] text-zinc-500">{item.hour}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="text-2xl font-extrabold font-mono text-indigo-400">{parts[2] || '*'}</div>
            <div className="text-[11px] font-bold text-zinc-200 uppercase font-mono">Day (Month)</div>
            <div className="text-[10px] text-zinc-500">{item.dayOfMonth}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="text-2xl font-extrabold font-mono text-amber-400">{parts[3] || '*'}</div>
            <div className="text-[11px] font-bold text-zinc-200 uppercase font-mono">Month</div>
            <div className="text-[10px] text-zinc-500">{item.month}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-2xl font-extrabold font-mono text-rose-400">{parts[4] || '*'}</div>
            <div className="text-[11px] font-bold text-zinc-200 uppercase font-mono">Day (Week)</div>
            <div className="text-[10px] text-zinc-500">{item.dayOfWeek}</div>
          </div>
        </div>
      </div>

      {/* Copyable Implementation Templates */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Copy-Paste Integration Snippets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Linux Crontab */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
              <span>Linux (crontab -e)</span>
              <CopyButton text={crontabSnippet} />
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
              <code>{crontabSnippet}</code>
            </div>
          </div>

          {/* GitHub Actions */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
              <span>GitHub Actions Workflow</span>
              <CopyButton text={githubActionsSnippet} />
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
              <pre>{githubActionsSnippet}</pre>
            </div>
          </div>

          {/* Kubernetes CronJob */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
              <span>Kubernetes (CronJob Spec)</span>
              <CopyButton text={k8sSnippet} />
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
              <pre>{k8sSnippet}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Related Cron Schedules */}
      <section className="space-y-3 pt-6 border-t border-zinc-800">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-zinc-400 uppercase">
          <Layers className="w-4 h-4" />
          <span>Diğer Popüler Cron Zamanlamaları</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {CRON_SCHEDULES.filter((s) => s.slug !== item.slug).slice(0, 9).map((sch) => (
            <Link
              key={sch.slug}
              href={`/cron/${sch.slug}/`}
              className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-xs flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
            >
              <div className="truncate pr-2">
                <span className="font-mono text-brand-emerald font-bold">{sch.expression}</span>
                <span className="text-zinc-400 ml-2">({sch.titleTr})</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqAccordion
        faqs={faqs}
        fromName={item.expression}
        toName="Cron Syntax"
      />
    </div>
  );
}
