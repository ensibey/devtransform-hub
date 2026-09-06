'use client';

import React from 'react';
import { DockerRecipe } from '@/lib/docker-recipes-data';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Flame,
  HelpCircle,
  Layers,
  Box,
} from 'lucide-react';

interface DockerCommandBuilderProps {
  recipe: DockerRecipe;
}

export function DockerCommandBuilder({ recipe }: DockerCommandBuilderProps) {
  const getRiskBadge = () => {
    switch (recipe.riskLevel) {
      case 'Safe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Safe Command
          </span>
        );
      case 'Reversible':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-950/40 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Reversible (Container State)
          </span>
        );
      case 'Destructive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-rose-950/40 text-rose-400 border border-rose-500/30">
            <Flame className="w-3.5 h-3.5" />
            Destructive (Data Deletion)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Solution Card */}
      <div className="p-5 rounded-2xl bg-surface-100 border border-border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-brand-emerald" />
            <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Quick Docker Solution
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRiskBadge()}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-200 text-zinc-400 border border-border">
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/70 border border-border flex items-center justify-between gap-3">
          <pre className="text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre">
            <code>{recipe.quickCommand}</code>
          </pre>
          <CopyButton text={recipe.quickCommand} />
        </div>

        <div className="p-3.5 rounded-xl bg-surface-200/60 border border-border/80 text-xs text-zinc-300 flex items-start space-x-2.5">
          <HelpCircle className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">When to use this scenario:</strong>
            {recipe.scenario}
          </div>
        </div>
      </div>

      {/* Step-by-Step Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-emerald" />
          <span>Step-by-Step Execution Guide</span>
        </h2>

        <div className="space-y-3">
          {recipe.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-100 border border-border space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald text-xs font-mono font-bold border border-brand-emerald/20">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-200">
                    {step.title}
                  </span>
                </div>
                <CopyButton text={step.command} />
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-border">
                <pre className="text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
                  <code>{step.command}</code>
                </pre>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {step.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Pitfalls */}
      {recipe.pitfalls.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 via-surface-100 to-surface-100 border border-rose-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Critical Docker Pitfalls &amp; Precautions
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {recipe.pitfalls.map((p, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternatives */}
      {recipe.alternatives && recipe.alternatives.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider">
            Alternative Approaches
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipe.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-100 border border-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{alt.name}</span>
                  <CopyButton text={alt.command} />
                </div>
                <pre className="p-2 rounded bg-black/60 border border-border text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
                  <code>{alt.command}</code>
                </pre>
                <p className="text-[11px] text-zinc-400">{alt.whenToUse}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
