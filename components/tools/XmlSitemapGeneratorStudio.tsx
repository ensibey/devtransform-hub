'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Globe,
  Settings,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface SitemapEntry {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const SAMPLE_URLS = [
  'https://example.com/',
  'https://example.com/about',
  'https://example.com/pricing',
  'https://example.com/blog',
  'https://example.com/blog/getting-started-with-nextjs',
  'https://example.com/docs/api-reference',
  'https://example.com/contact',
];

export function XmlSitemapGeneratorStudio() {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [bulkInput, setBulkInput] = useState<string>(SAMPLE_URLS.join('\n'));
  const [defaultChangefreq, setDefaultChangefreq] = useState<SitemapEntry['changefreq']>('weekly');
  const [defaultPriority, setDefaultPriority] = useState<string>('0.8');
  const [includeLastmod, setIncludeLastmod] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse bulk input into sitemap entries
  const entries: SitemapEntry[] = useMemo(() => {
    return bulkInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((url, index) => {
        let priority = defaultPriority;
        // Homepage automatically gets 1.0 priority
        if (url.endsWith('.com/') || url.endsWith('.io/') || url.endsWith('.org/') || url.endsWith('.dev/')) {
          priority = '1.0';
        }
        return {
          id: `entry-${index}-${url}`,
          loc: url,
          lastmod: todayStr,
          changefreq: defaultChangefreq,
          priority,
        };
      });
  }, [bulkInput, defaultChangefreq, defaultPriority, todayStr]);

  // Validation
  const validation = useMemo(() => {
    const invalidUrls: string[] = [];
    entries.forEach((e) => {
      try {
        const u = new URL(e.loc);
        if (!['http:', 'https:'].includes(u.protocol)) {
          invalidUrls.push(e.loc);
        }
      } catch {
        invalidUrls.push(e.loc);
      }
    });

    return {
      isValid: invalidUrls.length === 0,
      invalidCount: invalidUrls.length,
      invalidUrls,
      totalCount: entries.length,
    };
  }, [entries]);

  // Generate XML
  const sitemapXml = useMemo(() => {
    const escapeXml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    entries.forEach((entry) => {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
      if (includeLastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  }, [entries, includeLastmod]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadXml = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              XML Sitemap Generator & Validator Studio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create, validate, and download Google-standard XML sitemaps (<code className="font-mono text-xs text-cyan-600 dark:text-cyan-400">&lt;urlset&gt;</code>) for Search Console with priority &amp; changefreq controls.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            100% Client-Side Privacy
          </div>
        </div>
      </div>

      {/* Global Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Default Change Frequency:
          </label>
          <select
            value={defaultChangefreq}
            onChange={(e) => setDefaultChangefreq(e.target.value as SitemapEntry['changefreq'])}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="always">always (Live news)</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily (Active blogs)</option>
            <option value="weekly">weekly (Standard sites)</option>
            <option value="monthly">monthly (Docs/Guides)</option>
            <option value="yearly">yearly (Archived)</option>
            <option value="never">never</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Default Priority:
          </label>
          <select
            value={defaultPriority}
            onChange={(e) => setDefaultPriority(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="1.0">1.0 (Homepage / Most Important)</option>
            <option value="0.9">0.9 (Key Landing Pages)</option>
            <option value="0.8">0.8 (Standard Content / Tools)</option>
            <option value="0.6">0.6 (Articles / Blogs)</option>
            <option value="0.4">0.4 (Secondary Pages)</option>
            <option value="0.2">0.2 (Archive)</option>
          </select>
        </div>

        <div className="flex flex-col justify-center">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Include &lt;lastmod&gt; Tag:
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={includeLastmod}
              onChange={(e) => setIncludeLastmod(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Set to today ({todayStr})
            </span>
          </label>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: URL List Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-500" />
              Website URLs (1 per line):
            </label>
            <button
              onClick={() => setBulkInput(SAMPLE_URLS.join('\n'))}
              className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample URLs
            </button>
          </div>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            rows={14}
            placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/pricing"
            className="w-full font-mono text-xs leading-relaxed p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
          />

          {/* Validation Status */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              {validation.isValid ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <FileCheck className="w-4 h-4" />
                  All {validation.totalCount} URLs are valid
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {validation.invalidCount} invalid URL(s) detected (missing http/https)
                </span>
              )}
            </div>
            <span className="text-slate-500">
              Google limit: 50,000 URLs / 50MB
            </span>
          </div>
        </div>

        {/* Right Column: Generated XML Sitemap */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-500" />
              Generated sitemap.xml:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(sitemapXml, 'xml')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                {copiedKey === 'xml' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy XML
                  </>
                )}
              </button>
              <button
                onClick={downloadXml}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[340px]">
            <pre>
              <code>{sitemapXml}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
