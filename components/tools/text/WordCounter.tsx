'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Trash2, FileText, Clock, Volume2, Hash, AlignLeft } from 'lucide-react';

export function WordCounter() {
  const [text, setText] = useState(
    'Welcome to DevTransform! This is an advanced client-side word counter, character density analyzer, and reading time estimator. Type or paste your text to see real-time metrics computed instantly in your browser.'
  );

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;

    // Reading time (avg 200 words per min)
    const readingTimeMin = Math.ceil(wordCount / 200);
    // Speaking time (avg 130 words per min)
    const speakingTimeMin = Math.ceil(wordCount / 130);

    // Keyword density
    const frequencyMap: Record<string, number> = {};
    for (const w of words) {
      const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanWord.length > 2) {
        frequencyMap[cleanWord] = (frequencyMap[cleanWord] || 0) + 1;
      }
    }

    const topKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      wordCount,
      charCount,
      charNoSpaces,
      sentences,
      paragraphs,
      readingTimeMin,
      speakingTimeMin,
      topKeywords,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-200 border border-border flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Words</div>
          <div className="text-2xl font-extrabold text-brand-emerald mt-1 font-mono">
            {stats.wordCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-200 border border-border flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Characters</div>
          <div className="text-2xl font-extrabold text-zinc-100 mt-1 font-mono">
            {stats.charCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-200 border border-border flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">No Spaces</div>
          <div className="text-2xl font-extrabold text-zinc-100 mt-1 font-mono">
            {stats.charNoSpaces.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-200 border border-border flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Sentences</div>
          <div className="text-2xl font-extrabold text-sky-400 mt-1 font-mono">
            {stats.sentences}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-200 border border-border flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Paragraphs</div>
          <div className="text-2xl font-extrabold text-violet-400 mt-1 font-mono">
            {stats.paragraphs}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-200 border border-border flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Read Time</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
            ~{stats.readingTimeMin}m
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="rounded-xl border border-border bg-oled overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-200 border-b border-border text-xs">
          <span className="font-mono text-zinc-400">Input Content</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-surface transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <CopyButton text={text} />
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          rows={10}
          className="w-full p-4 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-y leading-relaxed font-sans"
        />
      </div>

      {/* Keyword Density Table */}
      {stats.topKeywords.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-400 uppercase flex items-center space-x-1.5">
            <Hash className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Top Keywords Density</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.topKeywords.map(([kw, count]) => (
              <div
                key={kw}
                className="px-2.5 py-1 rounded-lg bg-surface-200 border border-border text-xs flex items-center space-x-2"
              >
                <span className="text-zinc-200 font-medium">{kw}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-brand-emerald">
                  {count}x ({((count / stats.wordCount) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
