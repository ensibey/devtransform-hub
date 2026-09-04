'use client';

import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Code2, 
  RefreshCw, 
  Layers, 
  FileText 
} from 'lucide-react';

type BadgeStyle = 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';

interface BadgePreset {
  category: string;
  label: string;
  message: string;
  color: string;
  logo?: string;
}

const PRESETS: BadgePreset[] = [
  { category: 'Frameworks', label: 'Next.js', message: '14.2+', color: 'black', logo: 'nextdotjs' },
  { category: 'Frameworks', label: 'React', message: 'v18.3', color: '20232a', logo: 'react' },
  { category: 'Frameworks', label: 'TypeScript', message: '5.4+', color: '3178c6', logo: 'typescript' },
  { category: 'Frameworks', label: 'Tailwind CSS', message: 'v3.4', color: '06b6d4', logo: 'tailwindcss' },
  { category: 'Backend', label: 'Python', message: '3.12', color: '3776ab', logo: 'python' },
  { category: 'Backend', label: 'Node.js', message: '20 LTS', color: '339933', logo: 'nodedotjs' },
  { category: 'Backend', label: 'Docker', message: 'Ready', color: '2496ed', logo: 'docker' },
  { category: 'Build', label: 'Build', message: 'passing', color: 'brightgreen', logo: 'githubactions' },
  { category: 'Build', label: 'Coverage', message: '98.5%', color: 'success' },
  { category: 'License', label: 'License', message: 'MIT', color: 'blue' },
  { category: 'Social', label: 'GitHub', message: 'Sponsor', color: 'ea4aaa', logo: 'github' },
];

export function MarkdownBadgeGenerator() {
  const [label, setLabel] = useState('Next.js');
  const [message, setMessage] = useState('14.2+');
  const [color, setColor] = useState('black');
  const [labelColor, setLabelColor] = useState('555555');
  const [logo, setLogo] = useState('nextdotjs');
  const [style, setStyle] = useState<BadgeStyle>('flat');
  const [linkUrl, setLinkUrl] = useState('https://github.com/username/repo');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Build Shields.io URL
  const badgeUrl = useMemo(() => {
    const cleanLabel = encodeURIComponent(label || '');
    const cleanMessage = encodeURIComponent(message || '');
    let url = `https://img.shields.io/badge/${cleanLabel ? cleanLabel + '-' : ''}${cleanMessage}-${color}?style=${style}`;

    if (logo) {
      url += `&logo=${encodeURIComponent(logo)}&logoColor=white`;
    }
    if (labelColor && labelColor !== '555555') {
      url += `&labelColor=${encodeURIComponent(labelColor)}`;
    }

    return url;
  }, [label, message, color, labelColor, logo, style]);

  const markdownSnippet = linkUrl
    ? `[![${label || message}](${badgeUrl})](${linkUrl})`
    : `![${label || message}](${badgeUrl})`;

  const htmlSnippet = linkUrl
    ? `<a href="${linkUrl}"><img src="${badgeUrl}" alt="${label || message}" /></a>`
    : `<img src="${badgeUrl}" alt="${label || message}" />`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const applyPreset = (preset: BadgePreset) => {
    setLabel(preset.label);
    setMessage(preset.message);
    setColor(preset.color);
    setLogo(preset.logo || '');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> GitHub README Badges
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Shields.io Vector Engine
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Markdown README Badge Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Design vector status and tech badges for GitHub repositories, open-source packages, and documentation with 1-click Markdown copy.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => copyToClipboard(markdownSnippet, 'md-top')}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition shadow-sm shadow-emerald-500/20"
          >
            {copiedType === 'md-top' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'md-top' ? 'Copied' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Presets */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Popular Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
                >
                  {p.label}: {p.message}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Badge Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Left Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Next.js or Build"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Right Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. 14.2 or passing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Badge Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as BadgeStyle)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="flat">Flat (Standard)</option>
                  <option value="flat-square">Flat Square (Modern)</option>
                  <option value="for-the-badge">For-the-Badge (Bold Caps)</option>
                  <option value="plastic">Plastic (Classic 3D)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Right Color (Hex or Name)</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. 10b981 or black"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Simple-Icons Logo Slug (Optional)</label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="e.g. react, github, docker"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Link URL (Optional)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Code */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Live Badge Preview
            </span>

            {/* Rendered Badge Swatch */}
            <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[120px]">
              <img
                src={badgeUrl}
                alt={label || message}
                className="max-h-10 transition-transform scale-125"
              />
            </div>

            {/* Markdown Output */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">GitHub Markdown Code:</span>
                <button
                  onClick={() => copyToClipboard(markdownSnippet, 'md')}
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedType === 'md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'md' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                {markdownSnippet}
              </pre>
            </div>

            {/* HTML Output */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">HTML &lt;a&gt; &lt;img&gt; Snippet:</span>
                <button
                  onClick={() => copyToClipboard(htmlSnippet, 'html')}
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'html' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                {htmlSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
