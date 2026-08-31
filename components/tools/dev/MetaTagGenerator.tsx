'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Globe, Share2, Search, Sliders, Check } from 'lucide-react';

export function MetaTagGenerator() {
  const [title, setTitle] = useState('ZeroUpload - Privacy-First Zero-Server Developer Tools');
  const [description, setDescription] = useState('Ultra-fast, 100% client-side developer converters, formatters, and utilities with zero server logs.');
  const [url, setUrl] = useState('https://devtransform-hub.vercel.app');
  const [imageUrl, setImageUrl] = useState('https://devtransform-hub.vercel.app/og-image.png');
  const [siteName, setSiteName] = useState('ZeroUpload');
  const [activeTab, setActiveTab] = useState<'google' | 'twitter' | 'facebook'>('google');

  const metaHtmlCode = `<!-- Primary Meta Tags -->
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

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;

  return (
    <div className="space-y-6">
      {/* 2-Column Inputs & Live Social Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-brand-emerald" />
            <span>Metadata & Social Configuration</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Page Title:</span>
                <span className={title.length > 60 ? 'text-amber-400' : 'text-zinc-500'}>{title.length} / 60 chars</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Description:</span>
                <span className={description.length > 160 ? 'text-amber-400' : 'text-zinc-500'}>{description.length} / 160 chars</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Canonical URL:</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">OG Image URL:</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>
        </div>

        {/* Live Previews */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('google')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'google' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('twitter')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'twitter' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>X / Twitter</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('facebook')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'facebook' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Facebook / LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="min-h-[220px] flex items-center justify-center">
            {activeTab === 'google' && (
              <div className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 font-sans">
                <div className="text-[12px] text-zinc-400 truncate flex items-center space-x-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-black font-black">Z</div>
                  <span className="text-zinc-300">{siteName}</span>
                  <span className="text-zinc-600">›</span>
                  <span className="text-zinc-500 truncate">{url.replace('https://', '')}</span>
                </div>
                <div className="text-base text-sky-400 font-medium hover:underline cursor-pointer truncate">
                  {title}
                </div>
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {description}
                </div>
              </div>
            )}

            {activeTab === 'twitter' && (
              <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden font-sans space-y-2">
                <div className="h-32 bg-zinc-900 flex items-center justify-center text-xs font-mono text-zinc-500 border-b border-zinc-800">
                  <span>[ OpenGraph Image Preview ]</span>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[11px] text-zinc-500 uppercase">{url.replace('https://', '').split('/')[0]}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{title}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">{description}</div>
                </div>
              </div>
            )}

            {activeTab === 'facebook' && (
              <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden font-sans space-y-2">
                <div className="h-32 bg-zinc-900 flex items-center justify-center text-xs font-mono text-zinc-500 border-b border-zinc-800">
                  <span>[ Social Share Image ]</span>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">{url.replace('https://', '').split('/')[0]}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{title}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">{description}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Meta Tag Snippet */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">Generated HTML &lt;meta&gt; Tags:</span>
          <CopyButton text={metaHtmlCode} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
          {metaHtmlCode}
        </pre>
      </div>
    </div>
  );
}
