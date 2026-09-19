import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Terminal,
  Code2,
  FolderLock,
  Clock,
  Server,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RelatedToolsRailProps {
  currentCategory?: string;
  currentSlug?: string;
}

export function RelatedToolsRail({ currentCategory, currentSlug }: RelatedToolsRailProps) {
  const hubs = [
    {
      category: 'Office & Document Suite',
      icon: FileText,
      color: 'text-amber-400',
      badge: '100% Client-Side',
      items: [
        { title: 'Word to PDF Converter', slug: 'word-to-pdf', path: '/tools/word-to-pdf/' },
        { title: 'PDF to Word Converter', slug: 'pdf-to-word', path: '/tools/pdf-to-word/' },
        { title: 'Markdown to PDF', slug: 'markdown-to-pdf', path: '/tools/markdown-to-pdf/' },
        { title: 'PDF Watermark & Numbers', slug: 'pdf-watermark', path: '/tools/pdf-watermark/' },
        { title: 'CSV to PDF Table', slug: 'csv-to-pdf', path: '/tools/csv-to-pdf/' },
        { title: 'Text to PDF Multi-Page', slug: 'text-to-pdf', path: '/tools/text-to-pdf/' },
      ],
    },
    {
      category: 'DevOps & System Cheatsheets',
      icon: Terminal,
      color: 'text-emerald-400',
      badge: 'Interactive',
      items: [
        { title: 'Linux chmod Calculator (64 Octals)', slug: 'chmod-directory', path: '/chmod/directory/' },
        { title: 'Cron Schedule Explainer (80+ Expressions)', slug: 'cron-directory', path: '/cron/directory/' },
        { title: 'Nginx Recipe Hub & Configs', slug: 'nginx-directory', path: '/nginx/directory/' },
        { title: 'Docker Cheatsheet & Compose', slug: 'docker-directory', path: '/docker/directory/' },
        { title: 'Kubernetes (kubectl) Helper', slug: 'k8s-directory', path: '/k8s/directory/' },
        { title: 'HTTP Status Codes (Multi-Lang)', slug: 'http-status-directory', path: '/http-status/200-ok/' },
      ],
    },
    {
      category: 'Code & Data Converters',
      icon: Code2,
      color: 'text-blue-400',
      badge: 'Instant Execution',
      items: [
        { title: 'JSON to TypeScript Interfaces', slug: 'json-to-typescript', path: '/json-to-typescript/' },
        { title: 'SQL Query Formatter & Beautifier', slug: 'sql-formatter', path: '/formatters/sql/' },
        { title: 'cURL to Fetch / Axios / Python', slug: 'curl-to-code', path: '/tools/curl-to-code/' },
        { title: 'JSON to Go Structs', slug: 'json-to-go', path: '/json-to-go/' },
        { title: 'YAML to JSON Converter', slug: 'yaml-to-json', path: '/yaml-to-json/' },
        { title: 'Regex Tester & Validator', slug: 'regex-tester', path: '/tools/regex-tester/' },
      ],
    },
  ];

  return (
    <section className="mt-12 pt-10 border-t border-neutral-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Layers className="w-4 h-4" /> Explore Related Developer &amp; Document Tools
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Popular Utilities in the DevTransform Ecosystem
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Server Uploads &bull; Free Forever</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hubs.map((hub, idx) => {
          const Icon = hub.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <Icon className={`w-4 h-4 ${hub.color}`} />
                    <span>{hub.category}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                    {hub.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {hub.items.map((item) => {
                    const isCurrent = item.slug === currentSlug;
                    return (
                      <Link
                        key={item.slug}
                        href={item.path}
                        className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                          isCurrent
                            ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/30'
                            : 'text-neutral-300 hover:text-white hover:bg-neutral-900/90'
                        }`}
                      >
                        <span className="truncate pr-2">{item.title}</span>
                        <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/60">
                <Link
                  href="/#tools"
                  className="text-[11px] font-mono text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>View all 145+ browser tools</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
