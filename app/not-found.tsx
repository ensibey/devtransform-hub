'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Home,
  ArrowRight,
  Globe,
  Percent,
  Scale,
  Sparkles,
  Code2,
  FileCode,
} from 'lucide-react';

export default function NotFound() {
  const triggerCommandPalette = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  const topTools = [
    { title: 'JSON to TypeScript', slug: 'json-to-typescript', path: '/json-to-typescript/' },
    { title: 'SQL Formatter', slug: 'sql', path: '/formatters/sql/' },
    { title: 'Timezone Planner', slug: 'timezone-converter', path: '/tools/timezone-converter/' },
    { title: 'Image Compressor', slug: 'image-compressor', path: '/tools/image-compressor/' },
    { title: 'PDF Merge & Combine', slug: 'pdf-merge', path: '/tools/pdf-merge/' },
    { title: 'cURL to Code Converter', slug: 'curl-to-code', path: '/tools/curl-to-code/' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full space-y-10 text-center">
        {/* Glowing Badge & Error Code */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>404 &bull; Page or Calculation Not Found</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Lost in the Codebase?
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            The tool, timezone corridor, or percentage problem you requested doesn't exist or has moved. Explore our master directories or search 140+ utilities below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={triggerCommandPalette}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search 7,600+ Tools & Calculations (⌘K)</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-medium text-xs border border-zinc-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>

        {/* 3 Master Directories Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <Link
            href="/timezone/directory/"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-850 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <Globe className="w-4 h-4 text-emerald-400" />
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-bold text-sm text-white">Timezone Directory</div>
            <p className="text-xs text-zinc-400">75 metropolises & 5,500+ world time differences.</p>
          </Link>

          <Link
            href="/percentage/directory/"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-sky-500/40 hover:bg-zinc-850 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <Percent className="w-4 h-4 text-sky-400" />
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-bold text-sm text-white">Percentage Directory</div>
            <p className="text-xs text-zinc-400">1,100+ solved math problems & Excel formulas.</p>
          </Link>

          <Link
            href="/convert/directory/"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-850 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <Scale className="w-4 h-4 text-indigo-400" />
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-bold text-sm text-white">Unit Conversion Hub</div>
            <p className="text-xs text-zinc-400">350+ metric & imperial measurement converters.</p>
          </Link>
        </div>

        {/* Popular Essentials */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3 text-left">
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Popular Developer Tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {topTools.map((t) => (
              <Link
                key={t.path}
                href={t.path}
                className="p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/80 text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-between group transition-colors"
              >
                <span className="truncate pr-2">{t.title}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
