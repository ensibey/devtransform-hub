import React from 'react';
import { HelpCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface HowToGuideProps {
  fromName: string;
  toName: string;
  steps: HowToStep[];
  advantages: string[];
}

export function HowToGuide({ fromName, toName, steps, advantages }: HowToGuideProps) {
  return (
    <section className="mt-12 border-t border-border pt-10 text-zinc-300">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-border text-xs font-mono text-brand-emerald">
            <Zap className="w-3.5 h-3.5" />
            <span>Step-by-Step Tutorial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How to Convert {fromName} to {toName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Follow this 3-step workflow to convert your payloads with 100% privacy and zero server footprint.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-xl bg-surface-100 border border-border relative flex flex-col space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-surface-200 border border-border flex items-center justify-center font-mono font-bold text-xs text-brand-emerald">
                  0{item.step}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  Step {item.step}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Core Advantages */}
        <div className="p-5 rounded-2xl bg-surface-100/60 border border-border space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Why Developers Choose DevTransform</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
