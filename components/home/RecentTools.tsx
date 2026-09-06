'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, ArrowRight, X, Clock } from 'lucide-react';
import { DEVELOPER_TOOLS, DeveloperToolItem } from '@/lib/tools-data';
import { getRecentToolSlugs } from '@/lib/storage';

export function RecentTools() {
  const [recentTools, setRecentTools] = useState<DeveloperToolItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadRecents = () => {
    try {
      const slugs = getRecentToolSlugs();
      const matched = slugs
        .map((slug) => DEVELOPER_TOOLS.find((t) => t.slug === slug || t.id === slug))
        .filter((t): t is DeveloperToolItem => Boolean(t))
        .slice(0, 4);
      setRecentTools(matched);
    } catch {
      setRecentTools([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadRecents();
  }, []);

  const handleClear = () => {
    try {
      localStorage.removeItem('zeroupload_recents');
      localStorage.removeItem('devtransform_recents');
      setRecentTools([]);
    } catch {
      setRecentTools([]);
    }
  };

  const defaultQuickTools: DeveloperToolItem[] = [
    {
      id: 'json-to-typescript',
      slug: 'json-to-typescript',
      title: 'JSON to TypeScript',
      description: 'Convert JSON to TS interfaces',
      category: 'dev',
      categoryLabel: 'Code & Data Converters',
      icon: 'Code2',
      tags: ['json', 'typescript', 'types'],
      path: '/json-to-typescript/',
    },
    {
      id: 'sql-formatter',
      slug: 'sql',
      title: 'SQL Formatter',
      description: 'Beautify SQL queries',
      category: 'dev',
      categoryLabel: 'Code & Data Converters',
      icon: 'Database',
      tags: ['sql', 'format'],
      path: '/formatters/sql/',
    },
    {
      id: 'timezone-directory',
      slug: 'timezone-directory',
      title: 'Timezone Planner',
      description: '75 metropolises & meeting planner',
      category: 'calculators',
      categoryLabel: 'Calculators',
      icon: 'Globe',
      tags: ['timezone', 'clock'],
      path: '/timezone/directory/',
    },
    {
      id: 'percentage-directory',
      slug: 'percentage-directory',
      title: 'Percentage Solver',
      description: '1,100+ math formulas & Excel',
      category: 'calculators',
      categoryLabel: 'Calculators',
      icon: 'Percent',
      tags: ['percentage', 'math'],
      path: '/percentage/directory/',
    },
  ];

  if (!mounted) {
    return null;
  }

  const displayTools = recentTools.length > 0 ? recentTools : defaultQuickTools;
  const isRecent = recentTools.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 pl-1 flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-brand-emerald" />
            <span>{isRecent ? 'Recently Used:' : 'Quick Access:'}</span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {displayTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs text-zinc-200 hover:text-white border border-zinc-700/60 hover:border-zinc-600 transition-all group"
              >
                <span className="font-medium">{tool.title}</span>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {isRecent && (
          <button
            type="button"
            onClick={handleClear}
            className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors flex-shrink-0 ml-2"
            title="Clear history"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
