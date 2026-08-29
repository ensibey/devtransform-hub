'use client';

import React, { useState } from 'react';
import { UnitDefinition } from '@/lib/units-matrix';
import { ArrowRight, Calculator, RefreshCw, Copy, Check } from 'lucide-react';

interface UnitWorkspaceProps {
  from: UnitDefinition;
  to: UnitDefinition;
  multiplier: number;
}

export function UnitWorkspace({ from, to, multiplier }: UnitWorkspaceProps) {
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [copied, setCopied] = useState(false);

  const numVal = typeof inputValue === 'number' ? inputValue : parseFloat(inputValue) || 0;
  const convertedResult = numVal * multiplier;

  const formattedResult =
    convertedResult > 10000 || (convertedResult < 0.0001 && convertedResult !== 0)
      ? convertedResult.toExponential(4)
      : parseFloat(convertedResult.toFixed(6));

  const handleCopy = () => {
    navigator.clipboard.writeText(`${formattedResult}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-xl">
      {/* 2 Inputs Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Input */}
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>From: {from.name} ({from.nameTr})</span>
            <span className="font-bold text-brand-emerald">{from.symbol}</span>
          </div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
            placeholder="1"
          />
        </div>

        {/* To Output */}
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-brand-emerald/40 space-y-2 relative">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>To: {to.name} ({to.nameTr})</span>
            <span className="font-bold text-brand-emerald">{to.symbol}</span>
          </div>
          <div className="text-2xl font-bold font-mono text-brand-emerald truncate pr-10">
            {formattedResult}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-4 bottom-4 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Copy value"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Formula Strip */}
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>Formula:</span>
        <span className="text-zinc-200">
          multiply the value in {from.symbol} by <strong className="text-brand-emerald">{multiplier > 0.0001 ? multiplier : multiplier.toExponential(4)}</strong>
        </span>
      </div>
    </div>
  );
}
