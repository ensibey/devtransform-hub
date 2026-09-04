'use client';

import React, { useState, useMemo } from 'react';
import { Share2, Copy, Check, Sparkles, RefreshCw, Eye, Globe, ExternalLink, Image as ImageIcon } from 'lucide-react';

export function OpenGraphPreviewDebuggerStudio() {
  const [title, setTitle] = useState<string>('DevTransform - 120+ Free Developer Utilities');
  const [description, setDescription] = useState<string>('Fast, privacy-focused online developer tools. Zero server storage, sub-50ms client processing, and open-source utilities.');
  const [url, setUrl] = useState<string>('https://devtransform-hub.vercel.app');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop');
  const [siteName, setSiteName] = useState<string>('DevTransform Hub');
  const [activeTab, setActiveTab] = useState<'twitter' | 'facebook' | 'linkedin' | 'discord'>('twitter');
  const [copied, setCopied] = useState<boolean>(false);

  // Character lengths
  const titleLen = title.length;
  const descLen = description.length;

  // Generated meta tags HTML
  const generatedMetaTags = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;
  }, [title, description, url, imageUrl, siteName]);

  const copyMeta = () => {
    navigator.clipboard.writeText(generatedMetaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-6 h-6 text-indigo-400" />
              Open Graph & Social Meta Preview Studio
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Preview how your web pages look when shared across Twitter/X, Facebook, LinkedIn, and Discord with live SEO tag generation.
            </p>
          </div>

          <button
            onClick={() => {
              setTitle('DevTransform - 120+ Free Developer Utilities');
              setDescription('Fast, privacy-focused online developer tools. Zero server storage, sub-50ms client processing, and open-source utilities.');
              setUrl('https://devtransform-hub.vercel.app');
              setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop');
              setSiteName('DevTransform Hub');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Page Open Graph Attributes
            </h3>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="text-slate-300 font-medium">Page Title (og:title)</label>
                <span className={`font-mono ${titleLen > 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {titleLen}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page Title"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="text-slate-300 font-medium">Description (og:description)</label>
                <span className={`font-mono ${descLen > 155 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {descLen}/155 chars
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Page description..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs leading-relaxed"
              />
            </div>

            {/* Target URL */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Canonical URL (og:url)</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">OG Image URL (og:image - 1200×630 recommended)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono"
              />
            </div>

            {/* Site Name */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Site Name (og:site_name)</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Brand"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Live Social Previews Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Social Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {(
              [
                { id: 'twitter', label: 'Twitter / X' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'discord', label: 'Discord' },
              ] as { id: typeof activeTab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Social Mockup Stage */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 min-h-[340px] flex items-center justify-center">
            {activeTab === 'twitter' && (
              <div className="w-full max-w-md bg-black border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative aspect-[1.91/1] bg-neutral-900 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Twitter Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[11px] text-white/90 font-mono">
                    {new URL(url).hostname}
                  </div>
                </div>
                <div className="p-3 bg-neutral-950">
                  <div className="text-xs font-semibold text-neutral-200 line-clamp-1">{title}</div>
                  <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{description}</div>
                </div>
              </div>
            )}

            {activeTab === 'facebook' && (
              <div className="w-full max-w-md bg-[#242526] border border-[#3a3b3c] rounded-lg overflow-hidden shadow-2xl">
                <div className="relative aspect-[1.91/1] bg-neutral-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Facebook Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-3 bg-[#3a3b3c]/60">
                  <div className="text-[10px] uppercase font-mono text-[#b0b3b8]">{new URL(url).hostname}</div>
                  <div className="text-sm font-semibold text-[#e4e6eb] mt-0.5 line-clamp-1">{title}</div>
                  <div className="text-xs text-[#b0b3b8] mt-1 line-clamp-1">{description}</div>
                </div>
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="w-full max-w-md bg-[#1b1f23] border border-neutral-700 rounded-lg overflow-hidden shadow-2xl">
                <div className="relative aspect-[1.91/1] bg-neutral-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="LinkedIn Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-3 bg-[#1e2328]">
                  <div className="text-xs font-semibold text-white line-clamp-1">{title}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">{new URL(url).hostname}</div>
                </div>
              </div>
            )}

            {activeTab === 'discord' && (
              <div className="w-full max-w-md bg-[#2b2d31] border-l-4 border-indigo-500 rounded-lg p-3 shadow-2xl">
                <div className="text-[11px] text-[#949ba4] font-medium">{siteName}</div>
                <a href={url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#00a8fc] hover:underline mt-1 block line-clamp-1">
                  {title}
                </a>
                <div className="text-[11px] text-[#dbdee1] mt-1 line-clamp-2 leading-relaxed">{description}</div>
                <div className="mt-2.5 rounded-lg overflow-hidden max-h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Discord Embed"
                    className="w-full h-36 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generated HTML Meta Tags */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                HTML &lt;head&gt; Meta Tags
              </span>
              <button
                onClick={copyMeta}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Meta Tags'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              {generatedMetaTags}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
