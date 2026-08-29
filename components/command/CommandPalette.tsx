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
} from 'lucide-react';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_REGISTRY } from '@/lib/registry';
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
              {TOOLS_REGISTRY.map((tool) => (
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
