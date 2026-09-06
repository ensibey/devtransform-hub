'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from 'cmdk';
import {
  Search,
  ArrowRight,
  Sparkles,
  FileCode,
  Zap,
  Layers,
  Code2,
  FileText,
  Image as ImageIcon,
  Calculator,
  Globe,
  Percent,
  Scale,
  Server,
  FolderLock,
  GitBranch,
  Clock,
  ShieldCheck,
  Box,
  Database,
} from 'lucide-react';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_METADATA } from '@/lib/tools-metadata';
import { CATEGORIES } from '@/types/tool';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pairs = getAllMatrixPairs();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery('');
    router.push(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="fixed inset-0" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-2xl bg-surface-100 border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans">
        <Command className="w-full flex flex-col" shouldFilter={true}>
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-border bg-surface-200">
            <Search className="w-4 h-4 text-zinc-400 mr-3 flex-shrink-0" />
            <CommandInput
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search 120+ tools (e.g. PDF Merge, Image Compressor, JSON to TypeScript)..."
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
              ESC
            </kbd>
          </div>

          {/* List */}
          <CommandList className="max-h-[380px] overflow-y-auto p-2 space-y-1 select-none">
            <CommandEmpty className="py-8 text-center text-xs text-zinc-500">
              No matching utility or converter found.
            </CommandEmpty>

            {/* Standalone All-In-One Tools */}
            <CommandGroup
              heading="Standalone Utilities (100% Client-Side)"
              className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1"
            >
              {TOOLS_METADATA.map((tool) => (
                <CommandItem
                  key={tool.slug}
                  value={`${tool.title} ${tool.category} ${tool.keywords.join(' ')}`}
                  onSelect={() => handleSelect(`/tools/${tool.slug}/`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-emerald flex-shrink-0" />
                    <span className="font-medium text-zinc-100">{tool.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-surface uppercase">
                      {tool.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    /tools/{tool.slug}/
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Categories */}
            <CommandGroup
              heading="Tool Categories"
              className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 mt-2"
            >
              {Object.values(CATEGORIES).map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={`category ${cat.name} ${cat.description}`}
                  onSelect={() => handleSelect(`/category/${cat.id}/`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="font-medium text-zinc-100">{cat.name} Category</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    /category/{cat.id}/
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Master Programmatic Directories */}
            <CommandGroup
              heading="Master Programmatic Directories"
              className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 mt-2"
            >
              <CommandItem
                value="timezone directory world clock cities time difference 75 metropolises"
                onSelect={() => handleSelect('/timezone/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">World Timezone Directory</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-500/30">
                    5,500+ Corridors
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /timezone/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="percentage directory math discount calculator formulas 1100"
                onSelect={() => handleSelect('/percentage/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Percent className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">Percentage Calculations Directory</span>
                  <span className="text-[10px] font-mono text-sky-400 px-1.5 py-0.2 rounded bg-sky-950/40 border border-sky-500/30">
                    1,100+ Formulas
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /percentage/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="unit conversion directory metric imperial length weight data speed 350"
                onSelect={() => handleSelect('/convert/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Scale className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">Unit Conversion Directory</span>
                  <span className="text-[10px] font-mono text-indigo-400 px-1.5 py-0.2 rounded bg-indigo-950/40 border border-indigo-500/30">
                    350+ Pairs
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /convert/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="developer ports directory networking database dev servers 3000 8080 5432 6379 27017"
                onSelect={() => handleSelect('/port/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Server className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">Developer Ports Directory</span>
                  <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-500/30">
                    70+ Ports
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /port/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="mime types directory content type headers application json image webp pdf wasm"
                onSelect={() => handleSelect('/mime/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">MIME Types & Headers Directory</span>
                  <span className="text-[10px] font-mono text-violet-400 px-1.5 py-0.2 rounded bg-violet-950/40 border border-violet-500/30">
                    60+ Mimes
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /mime/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="chmod permissions directory linux unix security octal symbolic 755 644 600 777"
                onSelect={() => handleSelect('/chmod/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FolderLock className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">chmod Linux Permissions Matrix</span>
                  <span className="text-[10px] font-mono text-rose-400 px-1.5 py-0.2 rounded bg-rose-950/40 border border-rose-500/30">
                    Matrix & Commands
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /chmod/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="html entities directory unicode characters special symbols copy &copy; &nbsp; &trade;"
                onSelect={() => handleSelect('/html-entity/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">HTML Entities & Symbols Directory</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-500/30">
                    50+ Entities
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /html-entity/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="dns records directory a cname mx txt spf dkim dmarc caa nameserver lookup propagation"
                onSelect={() => handleSelect('/dns/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">DNS Records & Setup Directory</span>
                  <span className="text-[10px] font-mono text-sky-400 px-1.5 py-0.2 rounded bg-sky-950/40 border border-sky-500/30">
                    15+ Types & Syntax
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /dns/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="curl to code converter python requests javascript fetch node axios go net http rust reqwest c# php"
                onSelect={() => handleSelect('/curl-to/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">cURL to Code Converters</span>
                  <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-500/30">
                    10 Languages
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /curl-to/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="git command recipes undo last commit discard changes rename branch stash pop cherry pick reflog conflict"
                onSelect={() => handleSelect('/git/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">Git Command Recipes &amp; Solutions</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-500/30">
                    15+ Recipes
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /git/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="cron schedules directory expressions * * * * * crontab github actions syntax every 5 minutes midnight"
                onSelect={() => handleSelect('/cron/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">Cron Schedules &amp; Expressions Directory</span>
                  <span className="text-[10px] font-mono text-sky-400 px-1.5 py-0.2 rounded bg-sky-950/40 border border-sky-500/30">
                    25+ Schedules
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /cron/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="http headers directory csp content security policy hsts cache control cors x frame options cookies"
                onSelect={() => handleSelect('/http-header/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">HTTP Headers &amp; Security Directory</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-500/30">
                    12+ Directives
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /http-header/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="docker command recipes exec bash prune disk system entrypoint cmd copy volume mount inspect logs"
                onSelect={() => handleSelect('/docker/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Box className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">Docker Command Recipes &amp; Solutions</span>
                  <span className="text-[10px] font-mono text-sky-400 px-1.5 py-0.2 rounded bg-sky-950/40 border border-sky-500/30">
                    10+ Recipes
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /docker/directory/
                </span>
              </CommandItem>

              <CommandItem
                value="sql recipes query database postgres mysql duplicate rows upsert on conflict truncate drop running total explain analyze"
                onSelect={() => handleSelect('/sql/directory/')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-zinc-100">SQL Recipes &amp; Database Solutions</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-500/30">
                    10+ Queries
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  /sql/directory/
                </span>
              </CommandItem>
            </CommandGroup>

            {/* Popular Global Timezones */}
            <CommandGroup
              heading="Popular Global Time Differences"
              className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 mt-2"
            >
              {[
                { from: 'London', to: 'New York', slug: 'london-to-new-york' },
                { from: 'Paris', to: 'New York', slug: 'paris-to-new-york' },
                { from: 'Tokyo', to: 'London', slug: 'tokyo-to-london' },
                { from: 'Singapore', to: 'Sydney', slug: 'singapore-to-sydney' },
                { from: 'Dubai', to: 'London', slug: 'dubai-to-london' },
                { from: 'Istanbul', to: 'London', slug: 'istanbul-to-london' },
              ].map((tz) => (
                <CommandItem
                  key={tz.slug}
                  value={`time difference ${tz.from} to ${tz.to} clock timezone`}
                  onSelect={() => handleSelect(`/timezone/${tz.slug}/`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-medium text-zinc-100">{tz.from} &rarr; {tz.to}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    /timezone/{tz.slug}/
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Popular Percentage Solvers */}
            <CommandGroup
              heading="Frequently Searched Percentage Solvers"
              className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 mt-2"
            >
              {[
                { p: 10, b: 10000, res: 1000 },
                { p: 20, b: 5000, res: 1000 },
                { p: 30, b: 2000, res: 600 },
                { p: 40, b: 2000, res: 800 },
                { p: 50, b: 5000, res: 2500 },
              ].map((prob) => (
                <CommandItem
                  key={`${prob.p}-${prob.b}`}
                  value={`what is ${prob.p} percent of ${prob.b} calculate math`}
                  onSelect={() => handleSelect(`/percentage/what-is-${prob.p}-percent-of-${prob.b}/`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Percent className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="font-medium text-zinc-100">{prob.p}% of {prob.b.toLocaleString()}</span>
                    <span className="text-xs font-mono text-brand-emerald font-semibold">= {prob.res.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    /percentage/what-is-{prob.p}-percent-of-{prob.b}/
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Code Converters */}
            <CommandGroup
              heading="Code & Type Converters (90 Pairs)"
              className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 mt-2"
            >
              {pairs.map((pair) => (
                <CommandItem
                  key={pair.slug}
                  value={`${pair.from} to ${pair.to} ${pair.fromMeta.name} ${pair.toMeta.name}`}
                  onSelect={() => handleSelect(`/${pair.slug}/`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-3.5 h-3.5 text-brand-emerald flex-shrink-0" />
                    <span className="font-medium text-zinc-200">{pair.fromMeta.shortName}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                    <span className="font-medium text-zinc-200">{pair.toMeta.shortName}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    /{pair.slug}/
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {/* Shortcuts Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-surface-200 border-t border-border text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>100% Client-Side WebAssembly & Web Workers</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span>Navigate: <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">↑</kbd> <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">↓</kbd></span>
              <span>Open: <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">↵</kbd></span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
