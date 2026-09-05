'use client';

import React, { useState } from 'react';
import { Sliders, Copy, Check, Code2, FileSpreadsheet, Calculator, Sparkles } from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

interface InteractivePercentageSliderProps {
  initialPercent: number;
  initialBase: number;
}

export function InteractivePercentageSlider({ initialPercent, initialBase }: InteractivePercentageSliderProps) {
  const [percent, setPercent] = useState<number>(initialPercent);
  const [base, setBase] = useState<number>(initialBase);

  const result = Number(((base * percent) / 100).toFixed(2));
  const discounted = Number((base - result).toFixed(2));
  const withTax = Number((base + result).toFixed(2));

  const excelFormula = `=${base} * ${percent}%`;
  const jsSnippet = `const result = (${base} * ${percent}) / 100; // ${result}`;
  const pySnippet = `result = (${base} * ${percent}) / 100 # ${result}`;
  const sqlSnippet = `SELECT (${base} * ${percent} / 100.0) AS result;`;

  return (
    <div className="space-y-6">
      {/* Interactive Simulator Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Interactive Percentage Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Drag the slider or change the amount to calculate custom percentages in real-time.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-500/20">
            Real-Time Solver
          </span>
        </div>

        {/* Inputs & Sliders */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="font-medium text-slate-700 dark:text-zinc-300">Percentage ({percent}%):</label>
              <span className="text-emerald-600 dark:text-brand-emerald font-bold">{percent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="font-medium text-slate-700 dark:text-zinc-300">Base Number:</label>
              <span className="text-slate-500 dark:text-zinc-400">Total</span>
            </div>
            <input
              type="number"
              value={base}
              onChange={(e) => setBase(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
              Calculated Value ({percent}% of {base}):
            </span>
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-brand-emerald tracking-tight">
              {result}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <span className="text-slate-400 block text-[10px]">Discount Price</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">${discounted}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <span className="text-slate-400 block text-[10px]">With Tax/Tip (+{percent}%)</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">${withTax}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Snippets & Excel Formulas Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Copy Formulas & Developer Code Snippets
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              One-click export ready to paste into Excel, Google Sheets, Python, JS, or SQL.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
          {/* Excel / Sheets */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 relative group">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[10px]">
              <span className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-3 h-3" />
                Excel & Google Sheets Formula
              </span>
              <CopyButton text={excelFormula} />
            </div>
            <code className="block text-slate-800 dark:text-zinc-200 pt-0.5 select-all">
              {excelFormula}
            </code>
          </div>

          {/* JavaScript */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 relative group">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[10px]">
              <span className="font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Code2 className="w-3 h-3" />
                JavaScript / TypeScript
              </span>
              <CopyButton text={jsSnippet} />
            </div>
            <code className="block text-slate-800 dark:text-zinc-200 pt-0.5 select-all truncate">
              {jsSnippet}
            </code>
          </div>

          {/* Python */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 relative group">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[10px]">
              <span className="font-semibold flex items-center gap-1 text-sky-600 dark:text-sky-400">
                <Code2 className="w-3 h-3" />
                Python Formula
              </span>
              <CopyButton text={pySnippet} />
            </div>
            <code className="block text-slate-800 dark:text-zinc-200 pt-0.5 select-all truncate">
              {pySnippet}
            </code>
          </div>

          {/* SQL */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 relative group">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[10px]">
              <span className="font-semibold flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Code2 className="w-3 h-3" />
                SQL Query
              </span>
              <CopyButton text={sqlSnippet} />
            </div>
            <code className="block text-slate-800 dark:text-zinc-200 pt-0.5 select-all truncate">
              {sqlSnippet}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}