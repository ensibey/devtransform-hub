'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  faqs: FaqItem[];
  fromName: string;
  toName: string;
}

export function FaqAccordion({ faqs, fromName, toName }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-12 border-t border-border pt-10 text-zinc-300">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-border text-xs font-mono text-brand-indigo">
            <HelpCircle className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Common Questions About {fromName} to {toName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Everything you need to know regarding AST transformations, typing rules, and browser security.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface-100 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-zinc-200 hover:text-white transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-emerald' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-border/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
