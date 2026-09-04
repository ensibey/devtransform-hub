'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Tag, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Code 
} from 'lucide-react';

type ChangeCategory = 'Added' | 'Changed' | 'Deprecated' | 'Removed' | 'Fixed' | 'Security';

interface ChangelogItem {
  id: string;
  category: ChangeCategory;
  text: string;
}

interface Release {
  id: string;
  version: string;
  date: string;
  isUnreleased: boolean;
  items: ChangelogItem[];
}

const CATEGORY_CONFIG: Record<ChangeCategory, { badge: string; color: string; icon: string }> = {
  Added: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', color: 'text-emerald-400', icon: '✨' },
  Changed: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', color: 'text-blue-400', icon: '🔄' },
  Deprecated: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', color: 'text-amber-400', icon: '⚠️' },
  Removed: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', color: 'text-rose-400', icon: '🗑️' },
  Fixed: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', color: 'text-purple-400', icon: '🐛' },
  Security: { badge: 'bg-red-500/10 text-red-400 border-red-500/30', color: 'text-red-400', icon: '🔒' },
};

export function MarkdownChangelogGenerator() {
  const [projectTitle, setProjectTitle] = useState('My Awesome Project');
  const [projectRepo, setProjectRepo] = useState('https://github.com/username/project');
  const [previewTab, setPreviewTab] = useState<'markdown' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);

  // New item inputs
  const [selectedCategory, setSelectedCategory] = useState<ChangeCategory>('Added');
  const [newItemText, setNewItemText] = useState('');

  // Initial release state following Keep a Changelog
  const [releases, setReleases] = useState<Release[]>([
    {
      id: 'rel-1',
      version: '1.0.0',
      date: new Date().toISOString().split('T')[0],
      isUnreleased: false,
      items: [
        { id: '1', category: 'Added', text: 'Initial public release of the open-source client and CLI tools.' },
        { id: '2', category: 'Added', text: 'Zero-knowledge browser cryptography and offline Web Worker processing.' },
        { id: '3', category: 'Fixed', text: 'Resolved race conditions during large multi-threaded batch operations.' },
        { id: '4', category: 'Security', text: 'Patched dependency vulnerabilities and enforced strict Content-Security-Policy headers.' }
      ]
    }
  ]);

  const activeRelease = releases[0];

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChangelogItem = {
      id: String(Date.now()),
      category: selectedCategory,
      text: newItemText.trim(),
    };

    setReleases(prev => prev.map((rel, idx) => {
      if (idx === 0) {
        return { ...rel, items: [...rel.items, newItem] };
      }
      return rel;
    }));
    setNewItemText('');
  };

  const handleRemoveItem = (itemId: string) => {
    setReleases(prev => prev.map((rel, idx) => {
      if (idx === 0) {
        return { ...rel, items: rel.items.filter(it => it.id !== itemId) };
      }
      return rel;
    }));
  };

  const handleUpdateReleaseMeta = (field: 'version' | 'date', val: string) => {
    setReleases(prev => prev.map((rel, idx) => {
      if (idx === 0) {
        return { ...rel, [field]: val };
      }
      return rel;
    }));
  };

  // Compile standard markdown
  const markdownOutput = useMemo(() => {
    let md = `# Changelog\n\nAll notable changes to [${projectTitle}](${projectRepo}) will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`;

    releases.forEach((rel) => {
      if (rel.isUnreleased) {
        md += `## [Unreleased]\n\n`;
      } else {
        md += `## [${rel.version}] - ${rel.date}\n\n`;
      }

      const categories: ChangeCategory[] = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
      categories.forEach((cat) => {
        const catItems = rel.items.filter(it => it.category === cat);
        if (catItems.length > 0) {
          md += `### ${cat}\n\n`;
          catItems.forEach(item => {
            md += `- ${item.text}\n`;
          });
          md += `\n`;
        }
      });
    });

    return md.trim();
  }, [projectTitle, projectRepo, releases]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CHANGELOG.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Keep a Changelog v1.1.0 Standard
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              SemVer Compliant
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Markdown Changelog Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build professional release logs for GitHub repositories, open-source packages, and software version history.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition shadow-sm shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download CHANGELOG.md</span>
          </button>
        </div>
      </div>

      {/* Main Form & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Side */}
        <div className="lg:col-span-6 space-y-5">
          {/* Project Details */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Project Metadata
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Repository URL</label>
                <input
                  type="url"
                  value={projectRepo}
                  onChange={(e) => setProjectRepo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Current Release Settings */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                2. Release Version & Date
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Version (SemVer)</label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={activeRelease.version}
                    onChange={(e) => handleUpdateReleaseMeta('version', e.target.value)}
                    placeholder="e.g. 1.2.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Release Date</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={activeRelease.date}
                    onChange={(e) => handleUpdateReleaseMeta('date', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add Changelog Entry */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Add Changelog Entry
            </h2>

            {/* Category Selectors */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_CONFIG) as ChangeCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? CATEGORY_CONFIG[cat].badge + ' ring-2 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{CATEGORY_CONFIG[cat].icon}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Input + Add */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                }}
                placeholder={`Describe what was ${selectedCategory.toLowerCase()}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddItem}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* List of current release items */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-slate-400">
                Entries ({activeRelease.items.length})
              </span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activeRelease.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 group hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${CATEGORY_CONFIG[item.category].badge}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-200 truncate">{item.text}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-[540px]">
            {/* Tab switch */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                    previewTab === 'preview'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Visual Preview</span>
                </button>
                <button
                  onClick={() => setPreviewTab('markdown')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                    previewTab === 'markdown'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Raw Markdown</span>
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                {markdownOutput.length} characters
              </span>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto">
              {previewTab === 'markdown' ? (
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto">
                  {markdownOutput}
                </pre>
              ) : (
                <div className="space-y-6 text-slate-200 p-2">
                  <div className="border-b border-slate-800/80 pb-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Changelog</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      All notable changes to <span className="text-indigo-400 underline">{projectTitle}</span> are tracked below.
                    </p>
                  </div>

                  {releases.map((rel) => (
                    <div key={rel.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white font-mono">
                          [{rel.version}]
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          - {rel.date}
                        </span>
                      </div>

                      {(['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'] as ChangeCategory[]).map((cat) => {
                        const items = rel.items.filter(it => it.category === cat);
                        if (items.length === 0) return null;
                        return (
                          <div key={cat} className="space-y-2 pl-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <span>{CATEGORY_CONFIG[cat].icon}</span>
                              <span className={CATEGORY_CONFIG[cat].color}>{cat}</span>
                            </h4>
                            <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                              {items.map(it => (
                                <li key={it.id} className="leading-relaxed">
                                  {it.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
