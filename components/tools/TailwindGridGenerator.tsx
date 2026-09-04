'use client';

import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Trash2, 
  Sliders, 
  Layers, 
  Code2, 
  Maximize2 
} from 'lucide-react';

interface GridItem {
  id: string;
  name: string;
  colSpan: number;
  rowSpan: number;
  color: string;
}

const ITEM_COLORS = [
  'bg-sky-500/20 border-sky-500/40 text-sky-300',
  'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300',
  'bg-amber-500/20 border-amber-500/40 text-amber-300',
  'bg-rose-500/20 border-rose-500/40 text-rose-300',
];

export function TailwindGridGenerator() {
  const [cols, setCols] = useState<number>(3);
  const [gap, setGap] = useState<number>(4);
  const [items, setItems] = useState<GridItem[]>([
    { id: '1', name: 'Header / Nav', colSpan: 3, rowSpan: 1, color: ITEM_COLORS[0] },
    { id: '2', name: 'Sidebar', colSpan: 1, rowSpan: 2, color: ITEM_COLORS[1] },
    { id: '3', name: 'Main Content', colSpan: 2, rowSpan: 1, color: ITEM_COLORS[2] },
    { id: '4', name: 'Analytics Card', colSpan: 2, rowSpan: 1, color: ITEM_COLORS[3] },
    { id: '5', name: 'Footer', colSpan: 3, rowSpan: 1, color: ITEM_COLORS[4] },
  ]);
  const [activeItemId, setActiveItemId] = useState<string>('1');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const activeItem = items.find(i => i.id === activeItemId) || items[0];

  // Generate JSX snippet safely without triggering Tailwind's parser
  const jsxSnippet = useMemo(() => {
    let code = `<div className="grid grid-cols-${cols} gap-${gap}">\n`;
    items.forEach(it => {
      const spanClass = [
        it.colSpan > 1 ? `col-span-${it.colSpan}` : '',
        it.rowSpan > 1 ? `row-span-${it.rowSpan}` : ''
      ].filter(Boolean).join(' ');

      code += `  <div className="${spanClass ? spanClass + ' ' : ''}p-4 rounded-xl border">\n    <h3>${it.name}</h3>\n  </div>\n`;
    });
    code += `</div>`;
    return code;
  }, [cols, gap, items]);

  const cssSnippet = `display: grid;\ngrid-template-columns: repeat(${cols}, minmax(0, 1fr));\ngap: ${gap * 0.25}rem;`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleAddItem = () => {
    if (items.length >= 12) return;
    const newId = String(Date.now());
    const colorIdx = items.length % ITEM_COLORS.length;
    const newItem: GridItem = {
      id: newId,
      name: `Widget #${items.length + 1}`,
      colSpan: 1,
      rowSpan: 1,
      color: ITEM_COLORS[colorIdx]
    };
    setItems(prev => [...prev, newItem]);
    setActiveItemId(newId);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    const remaining = items.filter(i => i.id !== id);
    setItems(remaining);
    setActiveItemId(remaining[0].id);
  };

  const handleUpdateItem = (id: string, updates: Partial<GridItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" /> Visual Grid Architect
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Tailwind CSS & CSS Grid
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Tailwind CSS Grid Visual Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build complex 12-column responsive layouts, configure column and row spans, and export clean Tailwind CSS JSX snippets.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleAddItem}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Item</span>
          </button>
          <button
            onClick={() => copyToClipboard(jsxSnippet, 'jsx-top')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition shadow-sm shadow-indigo-500/20"
          >
            {copiedType === 'jsx-top' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'jsx-top' ? 'Copied' : 'Copy JSX'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Grid Level Settings */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Grid Container Settings
            </h2>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Number of Columns:</span>
                <span className="font-mono text-indigo-400">{cols} columns</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Grid Gap:</span>
                <span className="font-mono text-indigo-400">gap-{gap} ({gap * 4}px)</span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={2}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Active Item Settings */}
          {activeItem && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  2. Customize Selected: {activeItem.name}
                </h2>
                {items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(activeItem.id)}
                    className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Item Title / Label</label>
                <input
                  type="text"
                  value={activeItem.name}
                  onChange={(e) => handleUpdateItem(activeItem.id, { name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Column Span:</span>
                  <span className="font-mono text-indigo-400">col-span-{activeItem.colSpan}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={cols}
                  value={Math.min(activeItem.colSpan, cols)}
                  onChange={(e) => handleUpdateItem(activeItem.id, { colSpan: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Row Span:</span>
                  <span className="font-mono text-indigo-400">row-span-{activeItem.rowSpan}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={activeItem.rowSpan}
                  onChange={(e) => handleUpdateItem(activeItem.id, { rowSpan: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Canvas & Snippets */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Grid Container */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Interactive Grid Canvas (Click item to edit)
            </span>

            <div
              className="p-4 rounded-xl border border-slate-800 bg-slate-950 min-h-[300px]"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: `${gap * 4}px`,
              }}
            >
              {items.map(it => (
                <div
                  key={it.id}
                  onClick={() => setActiveItemId(it.id)}
                  style={{
                    gridColumn: `span ${Math.min(it.colSpan, cols)} / span ${Math.min(it.colSpan, cols)}`,
                    gridRow: `span ${it.rowSpan} / span ${it.rowSpan}`,
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    it.color
                  } ${
                    activeItemId === it.id ? 'ring-2 ring-indigo-500 scale-[0.99] shadow-lg' : 'hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-xs">{it.name}</div>
                  <div className="text-[10px] opacity-75 font-mono mt-2">
                    span {Math.min(it.colSpan, cols)}x{it.rowSpan}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Snippets */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">React / JSX Tailwind:</span>
                <button
                  onClick={() => copyToClipboard(jsxSnippet, 'jsx')}
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {copiedType === 'jsx' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'jsx' ? 'Copied' : 'Copy JSX'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap max-h-36">
                {jsxSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
