import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllSystemdRecipes } from '@/lib/systemd-recipes-data';
import { SystemdDirectoryClient } from '@/components/systemd/SystemdDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Server,
  Terminal,
  Layers,
  ChevronRight,
  ShieldCheck,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Systemd Service Generator & Linux Daemon Management Hub (2025/2026 SysAdmin Guide) | DevTransform',
  description: 'Production-ready systemd unit file templates for Node.js, Python FastAPI, Go binaries, Docker Compose, background queue workers, and systemd timers. Includes auto-restart and journalctl logging.',
  keywords: [
    'systemd service generator',
    'systemd service nodejs express',
    'systemd service python fastapi',
    'systemctl daemon reload enable',
    'systemd auto restart crash',
    'journalctl view service logs',
    'systemd timer cron alternative',
    'linux background service tutorial',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/systemd/directory/',
  },
  openGraph: {
    title: 'Systemd Service Generator & Linux Daemon Management Hub | DevTransform',
    description: 'Instant production-ready systemd service files for Node.js, Python, Go, and Docker Compose.',
    url: 'https://devtransform-hub.vercel.app/systemd/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Systemd Service Generator & Linux Daemon Management Hub',
    description: 'Instant production-ready systemd service files for Node.js, Python, Go, and Docker Compose.',
  },
};

export default function SystemdDirectoryPage() {
  const recipes = getAllSystemdRecipes();

  const directoryFaqs = [
    {
      question: 'Where do custom systemd service files live on Ubuntu/Debian/CentOS?',
      answer: 'User-created custom service files belong in `/etc/systemd/system/` (for example, `/etc/systemd/system/myapp.service`). Files in `/lib/systemd/system/` are reserved for package manager packages and should not be edited directly.'
    },
    {
      question: 'Why do I have to run sudo systemctl daemon-reload?',
      answer: 'Systemd compiles and caches all unit files in memory for fast performance. When you create or modify a `.service` file on disk, `systemctl daemon-reload` instructs the systemd init process to re-scan `/etc/systemd/system/` and apply your modifications.'
    },
    {
      question: 'What is the difference between Restart=always and Restart=on-failure?',
      answer: '`Restart=always` restarts the process unconditionally, even if it exits cleanly with status 0 (e.g. `kill -SIGTERM`). `Restart=on-failure` only restarts if the process exits with a non-zero exit code, unhandled signal, or watchdog timeout, allowing clean manual shutdowns.'
    },
    {
      question: 'How do I follow real-time logs of my systemd service?',
      answer: 'Run: `sudo journalctl -u <service-name> -f`. You can add `-n 100` to view the last 100 lines, or `--no-pager` to print directly to stdout.'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Systemd Service Generator & Linux Daemon Management Hub',
    description: 'Curated collection of production systemd service templates, lifecycle commands, and journalctl logging workflows.',
    url: 'https://devtransform-hub.vercel.app/systemd/directory/',
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
          <span className="text-indigo-400 font-medium">Systemd Directory</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Server className="w-3.5 h-3.5" />
            <span>Linux Init &amp; Daemon Management</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Systemd Service Generator &amp; Guides
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Copy-paste production systemd unit files for modern web applications, APIs, background workers, and automation timers. Run services as unprivileged users, configure automatic recovery on crash, and stream unified logs with journalctl.
          </p>
        </div>

        {/* Directory Grid */}
        <SystemdDirectoryClient recipes={recipes} />

        {/* Systemctl Command Cheatsheet Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Essential systemctl &amp; journalctl Commands
              </h2>
              <p className="text-xs text-slate-400">
                Core lifecycle management commands for Linux sysadmins
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Command</th>
                  <th className="pb-3 font-semibold">Purpose</th>
                  <th className="pb-3 font-semibold">When to Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <tr>
                  <td className="py-3 text-indigo-400">sudo systemctl daemon-reload</td>
                  <td className="py-3 text-slate-400 font-sans">Reload systemd unit cache</td>
                  <td className="py-3 text-slate-300 font-sans">Required immediately after creating or editing any .service file</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400">sudo systemctl enable --now app</td>
                  <td className="py-3 text-slate-400 font-sans">Enable on boot AND start immediately</td>
                  <td className="py-3 text-slate-300 font-sans">Initial service launch</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400">sudo systemctl restart app</td>
                  <td className="py-3 text-slate-400 font-sans">Restart active daemon</td>
                  <td className="py-3 text-slate-300 font-sans">After code updates, git pull, or npm build</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400">sudo systemctl status app</td>
                  <td className="py-3 text-slate-400 font-sans">Inspect state, PID, memory, and recent logs</td>
                  <td className="py-3 text-slate-300 font-sans">Verifying service health and diagnosing boot failures</td>
                </tr>
                <tr>
                  <td className="py-3 text-indigo-400">sudo journalctl -u app -f</td>
                  <td className="py-3 text-slate-400 font-sans">Stream real-time log output</td>
                  <td className="py-3 text-slate-300 font-sans">Debugging live application errors and incoming requests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions About Systemd Services
          </h2>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}
