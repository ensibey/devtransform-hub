'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Layout, Plus, Trash2, Sliders, Sparkles, Check } from 'lucide-react';

export function FlexboxPlayground() {
  const [direction, setDirection] = useState<'row' | 'column' | 'row-reverse' | 'column-reverse'>('row');
  const [justify, setJustify] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('center');
  const [align, setAlign] = useState<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'>('center');
  const [wrap, setWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('wrap');
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(4);

  const cssCode = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`;

  const tailwindDirection = direction === 'row' ? 'flex-row' : direction === 'column' ? 'flex-col' : direction === 'row-reverse' ? 'flex-row-reverse' : 'flex-col-reverse';
  const tailwindJustify = justify === 'flex-start' ? 'justify-start' : justify === 'center' ? 'justify-center' : justify === 'flex-end' ? 'justify-end' : justify === 'space-between' ? 'justify-between' : justify === 'space-around' ? 'justify-around' : 'justify-evenly';
  const tailwindAlign = align === 'stretch' ? 'items-stretch' : align === 'flex-start' ? 'items-start' : align === 'center' ? 'items-center' : align === 'flex-end' ? 'items-end' : 'items-baseline';
  const tailwindWrap = wrap === 'nowrap' ? 'flex-nowrap' : wrap === 'wrap' ? 'flex-wrap' : 'flex-wrap-reverse';

  const tailwindCode = `<div className="flex ${tailwindDirection} ${tailwindJustify} ${tailwindAlign} ${tailwindWrap} gap-[${gap}px]">
  {/* Flex Items */}
</div>`;

  return (
    <div className="space-y-6">
      {/* 2-Column Controls & Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Sliders className="w-4 h-4 text-brand-emerald" />
              <span>Flexbox Controls</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white flex items-center justify-center"
                title="Remove Item"
              >
                -
              </button>
              <span className="text-xs font-mono text-zinc-300 px-1">{itemCount}</span>
              <button
                type="button"
                onClick={() => setItemCount(Math.min(12, itemCount + 1))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white flex items-center justify-center"
                title="Add Item"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* flex-direction */}
            <div className="space-y-1">
              <label className="text-zinc-400">flex-direction:</label>
              <select
                value={direction}
                onChange={(e: any) => setDirection(e.target.value)}
                className="w-full p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              >
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>

            {/* justify-content */}
            <div className="space-y-1">
              <label className="text-zinc-400">justify-content:</label>
              <select
                value={justify}
                onChange={(e: any) => setJustify(e.target.value)}
                className="w-full p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              >
                <option value="flex-start">flex-start (start)</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end (end)</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>

            {/* align-items */}
            <div className="space-y-1">
              <label className="text-zinc-400">align-items:</label>
              <select
                value={align}
                onChange={(e: any) => setAlign(e.target.value)}
                className="w-full p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              >
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start (start)</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end (end)</option>
                <option value="baseline">baseline</option>
              </select>
            </div>

            {/* flex-wrap */}
            <div className="space-y-1">
              <label className="text-zinc-400">flex-wrap:</label>
              <select
                value={wrap}
                onChange={(e: any) => setWrap(e.target.value)}
                className="w-full p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              >
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
              </select>
            </div>

            {/* gap */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-zinc-400">
                <span>gap:</span>
                <span className="text-brand-emerald font-bold">{gap}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                value={gap}
                onChange={(e) => setGap(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>
          </div>
        </div>

        {/* Visual Stage Column */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Live Interactive Flexbox Container:</span>
            <span className="text-brand-emerald font-bold">{itemCount} items</span>
          </div>

          <div
            className="h-[320px] rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 p-4 overflow-auto transition-all"
            style={{
              display: 'flex',
              flexDirection: direction,
              justifyContent: justify,
              alignItems: align,
              flexWrap: wrap,
              gap: `${gap}px`,
            }}
          >
            {Array.from({ length: itemCount }).map((_, idx) => (
              <div
                key={idx}
                className="px-5 py-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-brand-emerald/40 text-brand-emerald font-mono font-bold text-xs flex items-center justify-center shadow-lg transition-all min-w-[70px] min-h-[50px]"
              >
                Item {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Generator Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
            <span className="font-bold">Standard CSS:</span>
            <CopyButton text={cssCode} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
            {cssCode}
          </pre>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-sky-400">
            <span className="font-bold">Tailwind CSS Classes:</span>
            <CopyButton text={tailwindCode} />
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
            {tailwindCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
