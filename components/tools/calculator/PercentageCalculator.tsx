'use client';

import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';

export function PercentageCalculator() {
  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState<number>(15);
  const [val1B, setVal1B] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [val2A, setVal2A] = useState<number>(45);
  const [val2B, setVal2B] = useState<number>(150);

  // Mode 3: Percentage Increase / Decrease from X to Y
  const [val3A, setVal3A] = useState<number>(80);
  const [val3B, setVal3B] = useState<number>(120);

  // Mode 4: Discount Calculator (Original price, discount %)
  const [price, setPrice] = useState<number>(149.99);
  const [discountPercent, setDiscountPercent] = useState<number>(20);

  // Calculations
  const res1 = ((val1A / 100) * val1B).toFixed(2);
  const res2 = val2B !== 0 ? (((val2A / val2B) * 100).toFixed(2)) : '0';
  const diff3 = val3B - val3A;
  const pctDiff3 = val3A !== 0 ? (((diff3) / Math.abs(val3A)) * 100).toFixed(2) : '0';

  const discountAmount = ((discountPercent / 100) * price).toFixed(2);
  const finalPrice = (price - parseFloat(discountAmount)).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: What is X% of Y */}
        <div className="p-5 rounded-2xl bg-surface-200 border border-border flex flex-col justify-between space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase">
            What is X% of Y?
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-zinc-400">What is</span>
            <input
              type="number"
              value={val1A}
              onChange={(e) => setVal1A(parseFloat(e.target.value) || 0)}
              className="w-20 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">% of</span>
            <input
              type="number"
              value={val1B}
              onChange={(e) => setVal1B(parseFloat(e.target.value) || 0)}
              className="w-24 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">?</span>
          </div>
          <div className="p-3 bg-surface-300 rounded-xl border border-border flex items-center justify-between">
            <span className="text-xs text-zinc-400">Result:</span>
            <span className="text-xl font-bold font-mono text-brand-emerald">{res1}</span>
          </div>
        </div>

        {/* Card 2: X is what % of Y */}
        <div className="p-5 rounded-2xl bg-surface-200 border border-border flex flex-col justify-between space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase">
            X is what % of Y?
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <input
              type="number"
              value={val2A}
              onChange={(e) => setVal2A(parseFloat(e.target.value) || 0)}
              className="w-20 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">is what % of</span>
            <input
              type="number"
              value={val2B}
              onChange={(e) => setVal2B(parseFloat(e.target.value) || 0)}
              className="w-24 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">?</span>
          </div>
          <div className="p-3 bg-surface-300 rounded-xl border border-border flex items-center justify-between">
            <span className="text-xs text-zinc-400">Result:</span>
            <span className="text-xl font-bold font-mono text-sky-400">{res2}%</span>
          </div>
        </div>

        {/* Card 3: Percentage Increase / Decrease */}
        <div className="p-5 rounded-2xl bg-surface-200 border border-border flex flex-col justify-between space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase">
            Percentage Change (Increase / Decrease)
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-zinc-400">From</span>
            <input
              type="number"
              value={val3A}
              onChange={(e) => setVal3A(parseFloat(e.target.value) || 0)}
              className="w-20 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">to</span>
            <input
              type="number"
              value={val3B}
              onChange={(e) => setVal3B(parseFloat(e.target.value) || 0)}
              className="w-20 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
          </div>
          <div className="p-3 bg-surface-300 rounded-xl border border-border flex items-center justify-between">
            <span className="text-xs text-zinc-400">Difference:</span>
            <span
              className={`text-xl font-bold font-mono ${
                parseFloat(pctDiff3) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {parseFloat(pctDiff3) >= 0 ? `+${pctDiff3}%` : `${pctDiff3}%`}
            </span>
          </div>
        </div>

        {/* Card 4: Discount & Savings Calculator */}
        <div className="p-5 rounded-2xl bg-surface-200 border border-border flex flex-col justify-between space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase">
            Discount & Final Price Calculator
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-zinc-400">Price $</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-24 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">with</span>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-16 bg-surface-300 border border-border rounded-lg px-2.5 py-1 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <span className="text-zinc-400">% off</span>
          </div>
          <div className="p-3 bg-surface-300 rounded-xl border border-border flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              You Save: <strong className="text-amber-400">${discountAmount}</strong>
            </span>
            <span className="text-xl font-bold font-mono text-brand-emerald">
              ${finalPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
